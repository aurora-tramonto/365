/* ============================================================================
   AURORA SYNC — accesso con Google e sincronizzazione fra dispositivi
   ============================================================================
   Cosa fa, in una frase: tiene un documento per utente su Firebase e lo fonde
   con quello che il telefono ha in locale, senza perdere letture.

   Tre principi, in ordine di importanza:

   1. NON PERDERE NIENTE. La lettura è un gesto che si accumula: unire due
      dispositivi deve significare «restano lette tutte quelle fatte», mai
      «vince l'ultimo che ha scritto». Per questo la fusione fa l'unione degli
      indici delle letture, non una scelta fra i due documenti.
      Conseguenza da sapere: se cancelli una lettura per sbaglio e poi
      sincronizzi, quella torna — perché sull'altro dispositivo non è mai
      stata cancellata. Nel pannello c'è «Questo dispositivo vince», che
      sovrascrive: serve proprio a questo.

   2. SENZA CONFIGURAZIONE NON FA NULLA. Se `window.AURORA_FIREBASE` non c'è,
      il modulo esce subito: nessun elemento, nessuna richiesta, nessun
      errore. L'app resta esattamente quella di prima.

   3. L'APP RESTA QUELLA DI PRIMA. Non viene modificato il programma: si
      legge e si scrive solo la chiave `aut_local` che l'app già usa, e si
      aggiunge una striscia sotto la testata, fuori dall'albero di React.

   Come si collauda senza Firebase: aprendo l'indirizzo con `?aurora-prova=1`
   il «remoto» diventa un finto archivio in localStorage, e si possono provare
   accesso, fusione, invio e conflitto senza toccare la rete.
   ============================================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- costanti */
  var CHIAVE = 'aut_local';        // il documento dell'app (19 KB)
  var CHIAVE_TUT = 'aut_tut';      // «il benvenuto è già stato visto»
  var SCHEMA = 1;                  // versione del formato di sincronizzazione
  var ATTESA = 2000;               // invio rimandato di 2 secondi
  var VERSIONE_SDK = '10.12.5';    // versione fissa dell'SDK Firebase
  var PROVA = /(?:\?|&)aurora-prova=1(?:&|$)/.test(location.search);

  var CFG = window.AURORA_FIREBASE || null;
  if (!CFG && !PROVA) return;      // non configurato: via, senza fare rumore

  /* ------------------------------------------------------------- utilità base */
  var log = function () {
    if (window.AURORA_DEBUG || PROVA) console.log.apply(console, ['[aurora-sync]'].concat([].slice.call(arguments)));
  };

  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function statoLocale() {
    try { return JSON.parse(leggi(CHIAVE) || 'null'); } catch (e) { return null; }
  }

  function uguali(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  /* ==========================================================================
     LA FUSIONE — è qui che si può perdere o salvare un piano di quattro anni
     ========================================================================== */

  /* Due stati si possono unire solo se descrivono lo stesso piano: gli indici
     delle letture significano «la lettura numero N del MIO piano», quindi con
     piani diversi (ritmo diverso) unirli sarebbe un errore, non una comodità. */
  function stessoPiano(a, b) {
    if (!a || !b) return false;
    if (!uguali(a.plan, b.plan)) return false;
    if (!uguali(a.settings, b.settings)) return false;
    return true;
  }

  function unioneIndici(x, y) {
    var visti = {}, out = [];
    [x, y].forEach(function (lato) {
      if (!Array.isArray(lato)) return;
      lato.forEach(function (n) {
        if (typeof n === 'number' && !visti[n]) { visti[n] = 1; out.push(n); }
      });
    });
    return out.sort(function (p, q) { return p - q; });
  }

  function unioneElenco(x, y) {
    var visti = {}, out = [];
    [x, y].forEach(function (lato) {
      if (!Array.isArray(lato)) return;
      lato.forEach(function (v) {
        if (v != null && !visti[v]) { visti[v] = 1; out.push(v); }
      });
    });
    return out.sort();
  }

  /**
   * unisci(locale, remoto) → { stato, motivo, conflitto }
   * motivo: 'solo-locale' | 'solo-remoto' | 'unito' | 'piani-diversi'
   * Con 'piani-diversi' → stato è null: decide la persona, non il codice.
   */
  function unisci(a, b) {
    if (!a && !b) return { stato: null, motivo: 'vuoto', conflitto: false };
    if (!a) return { stato: b, motivo: 'solo-remoto', conflitto: false };
    if (!b) return { stato: a, motivo: 'solo-locale', conflitto: false };
    if (!stessoPiano(a, b)) return { stato: null, motivo: 'piani-diversi', conflitto: true };

    var recente = (b.ts || 0) > (a.ts || 0) ? b : a;

    /* i campi che si possono unire senza perdere niente */
    var done = [];
    var corsie = Math.max(
      Array.isArray(a.done) ? a.done.length : 0,
      Array.isArray(b.done) ? b.done.length : 0
    );
    for (var i = 0; i < corsie; i++) {
      done.push(unioneIndici(a.done && a.done[i], b.done && b.done[i]));
    }

    var corsiePos = Math.max(
      Array.isArray(a.pos) ? a.pos.length : 0,
      Array.isArray(b.pos) ? b.pos.length : 0
    );
    var pos = [];
    for (var j = 0; j < corsiePos; j++) {
      pos.push(Math.max((Array.isArray(a.pos) && a.pos[j]) || 0, (Array.isArray(b.pos) && b.pos[j]) || 0));
    }

    /* Le fondamenta sono lo stato più recente, copiato INTERO. Così ogni campo
       che l'app scrive oggi o scriverà domani viaggia senza che io lo conosca:
       l'elenco qui sotto non è un filtro, è solo ciò che viene ricalcolato. */
    var unito = JSON.parse(JSON.stringify(recente));

    unito.done = done;
    unito.pos = pos;
    unito.act = unioneElenco(a.act, b.act);
    unito.v = Math.max(a.v || 0, b.v || 0);
    unito.ts = Math.max(a.ts || 0, b.ts || 0);
    return { stato: unito, motivo: 'unito', conflitto: false };
  }

  /* ==========================================================================
     IL REMOTO — Firebase, oppure l'archivio finto per il collaudo
     ========================================================================== */

  var remoto = PROVA ? remotoFinto() : null;    // riempito dopo l'accesso
  var dispositivo = (function () {
    var d = leggi('aut_device');
    if (!d) { d = 'd' + Math.random().toString(36).slice(2, 10); scrivi('aut_device', d); }
    return d;
  })();

  /* archivio finto: nel collaudo il «cloud» è una chiave in localStorage */
  function remotoFinto() {
    var CHIAVE_FINTA = 'aurora_prova_remoto';
    var spie = [];
    return {
      async leggi() {
        try { return JSON.parse(leggi(CHIAVE_FINTA) || 'null'); } catch (e) { return null; }
      },
      async scrivi(doc) {
        scrivi(CHIAVE_FINTA, JSON.stringify(doc));
        spie.forEach(function (cb) { try { cb(doc); } catch (e) {} });
      },
      osserva(cb) { spie.push(cb); }
    };
  }

  var firebaseApi = null;    // { app, auth, db, ... } dopo il caricamento

  async function caricaFirebase() {
    if (firebaseApi) return firebaseApi;
    var base = 'https://www.gstatic.com/firebasejs/' + VERSIONE_SDK + '/';
    var appMod = await import(base + 'firebase-app.js');
    var authMod = await import(base + 'firebase-auth.js');
    var dbMod = await import(base + 'firebase-firestore.js');
    var app = appMod.initializeApp(CFG);
    var auth = authMod.getAuth(app);
    var db = dbMod.getFirestore(app);
    firebaseApi = { app: app, auth: auth, db: db, A: authMod, D: dbMod };
    remoto = {
      async leggi() {
        var rif = dbMod.doc(db, 'utenti', auth.currentUser.uid, 'stato', 'principale');
        var s = await dbMod.getDoc(rif);
        return s.exists() ? s.data() : null;
      },
      async scrivi(doc) {
        var rif = dbMod.doc(db, 'utenti', auth.currentUser.uid, 'stato', 'principale');
        await dbMod.setDoc(rif, doc);
      },
      osserva(cb) {
        var rif = dbMod.doc(db, 'utenti', auth.currentUser.uid, 'stato', 'principale');
        dbMod.onSnapshot(rif, function (s) { cb(s.exists() ? s.data() : null); });
      }
    };
    return firebaseApi;
  }

  /* ==========================================================================
     LO STATO DEL MODULO E IL SUO PANNELLO
     ========================================================================== */

  var utente = null;
  var stato = 'spento';   // spento | senza-accesso | in-corso | sincronizzato | attesa | errore | conflitto
  var nota = '';
  var ultimoDoc = null;   // ultimo documento remoto conosciuto (per non ripetere)
  var invioInCorso = false;
  var orologioInvio = null;
  var attesaDa = 0;      // da quando sto rimandando l'invio (per non rimandare all'infinito)

  function stile(nuovoStato, nuovaNota) {
    stato = nuovoStato;
    nota = nuovaNota || '';
    dipingi();
    avvisa();
  }

  /* Chi aspetta di sapere se c'è un accesso (il pannello dell'account): viene
     chiamato a ogni cambio di stato, con l'utente o con null. */
  var spie = [];
  function avvisa() {
    for (var i = 0; i < spie.length; i++) { try { spie[i](utente); } catch (e) {} }
  }

  /* ------------------------------------------------------------------ pannello */
  var striscia, foglio;

  function costruisci() {
    if (striscia) return;

    /* l'interruttore per il foglio di stile: senza questa classe la striscia
       non esiste e non viene riservato nessuno spazio */
    document.documentElement.classList.add('aurora-con-account');

    striscia = document.createElement('div');
    striscia.className = 'aurora-account';
    striscia.innerHTML =
      '<button type="button" class="aurora-account-tasto">' +
        '<span class="aurora-account-punto" aria-hidden="true"></span>' +
        '<span class="aurora-account-testo"></span>' +
        '<span class="aurora-account-freccia" aria-hidden="true">›</span>' +
      '</button>';
    striscia.querySelector('button').addEventListener('click', apriFoglio);
    document.body.appendChild(striscia);

    foglio = document.createElement('div');
    foglio.className = 'aurora-foglio-bg';
    foglio.hidden = true;
    foglio.innerHTML =
      '<div class="aurora-foglio" role="dialog" aria-modal="true" aria-label="Account e sincronizzazione">' +
        /* il marchio in piccolo: l'arco del logo con le tre luci SOPRA la linea.
           Centro (38,36), raggio 30 — le quote sono calcolate, non a occhio.
           Il tratteggio "100" serve a disegnarlo e alla cometa che lo percorre. */
        '<div class="aurora-foglio-cielo" aria-hidden="true">' +
          '<svg viewBox="0 0 76 32" focusable="false">' +
            '<defs><linearGradient id="aurora-cielo-filo" x1="0" y1="0" x2="1" y2="0">' +
              '<stop class="s1" offset="0"></stop>' +
              '<stop class="s2" offset=".5"></stop>' +
              '<stop class="s3" offset="1"></stop>' +
            '</linearGradient></defs>' +
            '<path class="filo" pathLength="100" d="M10.594 23.801A30 30 0 0 1 65.406 23.801"></path>' +
            '<path class="cometa" pathLength="100" d="M10.594 23.801A30 30 0 0 1 65.406 23.801"></path>' +
            '<circle class="luce l1" cx="10.594" cy="23.801" r="2.6"></circle>' +
            '<circle class="luce l2" cx="38" cy="6" r="2.6"></circle>' +
            '<circle class="luce l3" cx="65.406" cy="23.801" r="2.6"></circle>' +
          '</svg>' +
        '</div>' +
        '<h2>Il tuo piano, su tutti i dispositivi</h2>' +
        '<p class="aurora-foglio-stato"></p>' +
        /* Una frase sola, in un nodo solo: dentro ci sono le <b> di prima, ma
           tradurre un pezzo alla volta in tedesco metterebbe il verbo in mezzo
           alla riga. Così la frase intera è la chiave del dizionario. */
        '<p class="aurora-foglio-spiega">' +
          'Le letture fatte su un dispositivo si uniscono a quelle fatte sull’altro: niente si perde. Per questo, se cancelli una lettura per sbaglio, al prossimo scambio torna: usa «Questo dispositivo vince» per imporre quello che vedi qui.' +
        '</p>' +
        '<div class="aurora-foglio-azioni"></div>' +
        '<button type="button" class="aurora-foglio-chiudi">Chiudi</button>' +
      '</div>';
    foglio.addEventListener('click', function (e) { if (e.target === foglio) chiudiFoglio(); });
    foglio.querySelector('.aurora-foglio-chiudi').addEventListener('click', chiudiFoglio);
    document.body.appendChild(foglio);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !foglio.hidden) chiudiFoglio();
    });
    window.addEventListener('resize', misuraBarra);
    osservaBarra();
  }

  /* La striscia sta appena sopra la barra delle schede: ne misuro l'altezza.
     ATTENZIONE: all'avvio la barra non esiste ancora — la disegna React dopo —
     quindi misurarla subito darebbe 0 e la striscia finirebbe SOPRA la barra.
     Per questo la misuro quando compare, e la rimisuro se cambia altezza
     (su iPhone l'altezza cresce con la zona sicura del pollice). */
  function misuraBarra() {
    var barra = document.querySelector('.tabs');
    var h = barra ? Math.round(barra.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--aurora-barra-h', h + 'px');
  }

  var osservaBarra = (function () {
    var ro = null, mo = null;
    function osserva(e) {
      if (e) {
        if (!ro && typeof ResizeObserver === 'function') { ro = new ResizeObserver(misuraBarra); ro.observe(e); }
        else if (ro) { ro.disconnect(); ro.observe(e); }
      }
    }
    return function () {
      misuraBarra();
      var barra = document.querySelector('.tabs');
      if (barra) { osserva(barra); return; }
      if (mo) return;
      if (typeof MutationObserver === 'function') {
        mo = new MutationObserver(function () {
          if (document.querySelector('.tabs')) { mo.disconnect(); mo = null; osservaBarra(); }
        });
        mo.observe(document.body, { childList: true, subtree: true });
      }
    };
  })();

  /* Il pannello si chiude con lo stesso gesto con cui è arrivato: scende e
     sparisce in un quinto di secondo, invece di sparire di colpo. La classe
     «via» fa partire l'uscita; il `hidden` arriva alla fine. Chi riapre in
     fretta non aspetta: l'orologio si annulla e il pannello resta dov'è. */
  var chiusura = null;

  function apriFoglio() {
    if (chiusura) { clearTimeout(chiusura); chiusura = null; }
    foglio.classList.remove('aurora-foglio-via');
    foglio.hidden = false;
    osservaBarra();
    dipingi();
  }

  function chiudiFoglio() {
    if (!foglio || foglio.hidden || chiusura) return;
    foglio.classList.add('aurora-foglio-via');
    chiusura = setTimeout(function () {
      chiusura = null;
      foglio.hidden = true;
      foglio.classList.remove('aurora-foglio-via');
    }, 190);
  }

  var TESTI = {
    spento:      ['', ''],
    senzaAccesso:['Accedi per non perdere il piano', 'acceso'],
    inCorso:     ['Accesso in corso…', 'attesa'],
    sincronizzato:['Piano sincronizzato', 'fatto'],
    attesa:      ['Invio…', 'attesa'],
    errore:      ['Non riesco a sincronizzare', 'errore'],
    conflitto:   ['Due piani diversi: decidi tu', 'errore']
  };

  function dipingi() {
    if (!striscia) return;
    var t = TESTI[stato] || TESTI.spento;
    striscia.querySelector('.aurora-account-testo').textContent = nota || t[0];
    striscia.dataset.stato = t[1] || 'spento';
    striscia.hidden = stato === 'spento';

    /* lo stato anche sul pannello (che sta DENTRO lo sfondo, non è lui):
       da questo dipendono le animazioni — il giorno che passa mentre si
       accede, la spunta quando è fatto. */
    if (foglio) {
      var pannello = foglio.querySelector('.aurora-foglio');
      if (pannello) {
        pannello.dataset.stato = t[1] || 'spento';
        pannello.dataset.accesso = utente ? 'si' : 'no';
      }
    }

    if (foglio && !foglio.hidden) {
      var s = foglio.querySelector('.aurora-foglio-stato');
      s.textContent = utente
        ? 'Hai accesso come ' + (utente.email || utente.nome) + '. ' + (nota || t[0]) + '.'
        : 'Non hai ancora accesso: il piano vive solo su questo dispositivo.';
      var az = foglio.querySelector('.aurora-foglio-azioni');
      az.textContent = '';
      if (utente) {
        if (stato === 'conflitto') {
          az.appendChild(tasto('Tieni quello di questo dispositivo', function () { vinceLocale(); }));
          az.appendChild(tasto('Prendi quello del cloud', function () { vinceRemoto(); }));
        } else {
          az.appendChild(tasto('Sincronizza adesso', function () { spingi(true); }));
          az.appendChild(tasto('Questo dispositivo vince', function () { vinceLocale(); }, 'piano'));
          az.appendChild(tasto('Esci', function () { esci(); }));
        }
      } else {
        az.appendChild(tasto('Accedi con Google', function () { accedi(); }));
      }
    }
  }

  function tasto(testo, azione, tipo) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'aurora-foglio-tasto' + (tipo === 'piano' ? ' piano' : '');
    b.textContent = testo;
    b.addEventListener('click', azione);
    return b;
  }

  /* ==========================================================================
     LE OPERAZIONI
     ========================================================================== */

  async function accedi() {
    if (PROVA) { utente = { uid: 'prova', email: 'prova@esempio.it', nome: 'Prova' }; stile('inCorso', 'Leggo il tuo piano dal cloud…'); return dopoAccesso(); }
    stile('inCorso', 'Accesso in corso…');
    try {
      var api = await caricaFirebase();
      var provider = new api.A.GoogleAuthProvider();
      try {
        var res = await api.A.signInWithPopup(api.auth, provider);
        utente = { uid: res.user.uid, email: res.user.email, nome: res.user.displayName };
      } catch (e) {
        /* Su iPhone, quando il sito è aperto dalla schermata iniziale (o dentro
           il browser di un'altra app: Instagram, Messenger, LinkedIn) la
           finestra di Google a volte non si può proprio aprire. In quel caso la
           via che funziona è uscire dalla pagina e rientrare: tornando,
           onAuthStateChanged vede l'accesso fatto e prosegue da solo.
           Non è un ripiego per un annullamento vero: se chiudi la finestra
           apposta, non ti rispedisco altrove. */
        var senzaFinestra = /popup-blocked|operation-not-supported|web-storage-unsupported|cancelled-popup-request/.test(String((e && e.code) || ''));
        if (!senzaFinestra) throw e;
        log('finestra non apribile: passo al rientro nella pagina', e);
        stile('inCorso', 'Ti porto su Google…');
        await api.A.signInWithRedirect(api.auth, provider);
        return;
      }
      stile('inCorso', 'Leggo il tuo piano dal cloud…');
      dopoAccesso();
    } catch (e) {
      stile('errore', 'Accesso non riuscito');
      log('accesso', e);
    }
  }

  async function esci() {
    if (!PROVA) { try { var api = await caricaFirebase(); await api.A.signOut(api.auth); } catch (e) {} }
    utente = null; ultimoDoc = null; chiudiFoglio(); stile('senzaAccesso');
  }

  /* al primo accesso: leggi, fondi, scrivi, e se il locale è cambiato ricarica */
  async function dopoAccesso() {
    try {
      var doc = await remoto.leggi();
      var esito = unisci(statoLocale(), doc ? doc.state : null);

      if (esito.conflitto) { stile('conflitto', 'I due piani sono diversi: scegli tu'); return; }

      var locale = statoLocale();
      var cambiatoInLocale = !uguali(locale, esito.stato);

      if (cambiatoInLocale && esito.stato) {
        scriviStato(esito.stato);
        if (!leggi(CHIAVE_TUT)) scrivi(CHIAVE_TUT, '1');
      }
      /* se non c'e' ancora un piano (schermata iniziale) non si scrive niente:
         un documento vuoto nel cloud non serve a nessuno */
      if (esito.stato) await remoto.scrivi(impacchetta(esito.stato));
      stile('sincronizzato', 'Piano sincronizzato');
      ascoltaRemoto();
      if (cambiatoInLocale) ricarica('Ho trovato letture fatte altrove: aggiorno la pagina');
    } catch (e) {
      stile('errore', 'Non riesco a sincronizzare');
      log('lettura', e);
    }
  }

  function impacchetta(state) {
    return {
      schema: SCHEMA,
      rev: Date.now(),
      dispositivo: dispositivo,
      aggiornato: Date.now(),
      state: state
    };
  }

  function ricarica(messaggio) {
    stile('attesa', messaggio);
    setTimeout(function () { location.reload(); }, 1200);
  }

  /* invio rimandato: si aspetta che l'utente smetta di toccare.
     Ma chi legge spuntando una lettura ogni pochi secondi non deve poter
     rimandare l'invio per sempre: oltre sei secondi si manda comunque. */
  var TETTO_ATTESA = 6000;

  function programmaInvio() {
    if (!utente || stato === 'conflitto') return;
    if (!attesaDa) attesaDa = Date.now();
    if (orologioInvio) clearTimeout(orologioInvio);
    var passato = Date.now() - attesaDa;
    var quanto = Math.max(0, Math.min(ATTESA, TETTO_ATTESA - passato));
    stile('attesa', 'Salvo…');
    orologioInvio = setTimeout(function () { attesaDa = 0; spingi(false); }, quanto);
  }

  async function spingi(esplicito) {
    if (invioInCorso || !utente) return;
    invioInCorso = true;
    try {
      var doc = await remoto.leggi();
      var locale = statoLocale();
      var esito = unisci(locale, doc ? doc.state : null);
      if (esito.conflitto) { stile('conflitto', 'I due piani sono diversi: scegli tu'); return; }

      if (!uguali(locale, esito.stato)) {
        /* il remoto aveva qualcosa che qui non c'era: applico e ricarico */
        scriviStato(esito.stato);
        await remoto.scrivi(impacchetta(esito.stato));
        stile('sincronizzato', 'Aggiornato dal cloud');
        ricarica('Ho trovato letture fatte altrove: aggiorno la pagina');
        return;
      }
      if (locale) await remoto.scrivi(impacchetta(locale));
      stile('sincronizzato', 'Piano sincronizzato');
    } catch (e) {
      stile('errore', 'Non riesco a salvare');
      log('invio', e);
    } finally {
      invioInCorso = false;
    }
  }

  /* qualcuno ha scritto mentre avevamo la pagina aperta */
  function ascoltaRemoto() {
    if (!remoto || !remoto.osserva) return;
    remoto.osserva(function (doc) {
      if (!doc || doc.dispositivo === dispositivo) return;   // è il nostro stesso invio
      var esito = unisci(statoLocale(), doc.state);
      if (esito.conflitto) { stile('conflitto', 'I due piani sono diversi: scegli tu'); return; }
      if (!uguali(statoLocale(), esito.stato)) {
        scriviStato(esito.stato);
        ricarica('Un altro dispositivo ha letto: aggiorno la pagina');
      }
    });
  }

  /* «questo dispositivo vince»: sovrascrive il cloud senza fondere */
  async function vinceLocale() {
    try {
      var locale = statoLocale();
      var doc = await remoto.leggi();
      if (doc && !stessoPiano(locale, doc.state)) {
        scriviStato(locale);                      // resta il nostro
        await remoto.scrivi(impacchetta(locale));
        chiudiFoglio(); stile('sincronizzato', 'Questo dispositivo vince'); return;
      }
      await remoto.scrivi(impacchetta(locale));
      chiudiFoglio(); stile('sincronizzato', 'Questo dispositivo vince');
    } catch (e) { stile('errore', 'Non riesco a salvare'); }
  }

  /* «prende quello del cloud»: il locale viene sostituito */
  async function vinceRemoto() {
    try {
      var doc = await remoto.leggi();
      if (doc && doc.state) {
        scriviStato(doc.state);
        ricarica('Prendo il piano dal cloud: aggiorno la pagina');
      } else { stile('sincronizzato', 'Nel cloud non c’è ancora niente'); }
    } catch (e) { stile('errore', 'Non riesco a leggere'); }
  }

  /* ==========================================================================
     AGGANCIO ALL'APP — senza toccarla
     ========================================================================== */

  /* Accorgersi che l'app ha salvato.

     Il primo tentativo era agganciarsi a localStorage.setItem. NON FUNZIONA:
     su WebKit (il motore di Safari) l'assegnazione a localStorage.setItem non
     attecchisce — la proprietà resta quella originale — e infatti le scritture
     non si vedevano pur essendo avvenute. Qui non c'è margine di errore: se il
     gancio non c'è, non si sincronizza niente e sembra tutto a posto.

     Quindi sorveglio il documento: leggo la chiave a intervalli brevi e
     confronto il testo. Leggere 19 KB ogni 1,2 s non costa niente, e questa
     via non può essere aggirata da come l'app decide di scrivere. */
  var visto = null;

  function impronta() { return leggi(CHIAVE); }

  /* scrivere lo stato passando da qui aggiorna anche l'impronta: altrimenti la
     sorveglianza scambierebbe la nostra stessa scrittura per una dell'app e
     rilancerebbe l'invio all'infinito */
  function scriviStato(s) { scrivi(CHIAVE, JSON.stringify(s)); visto = impronta(); }

  function sorvegliaScritture() {
    visto = impronta();
    setInterval(function () {
      if (!utente) return;
      var ora = impronta();
      if (ora === null) return;
      if (visto === null) { visto = ora; return; }
      if (ora !== visto) { visto = ora; programmaInvio(); }
    }, 1200);
  }

  function avvia() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }
    costruisci();
    sorvegliaScritture();
    if (PROVA) {
      /* Nel collaudo NON si entra da soli. Prima succedeva, e chi apriva
         l'indirizzo di prova si trovava dentro come «prova@esempio.it» senza
         aver toccato niente: sembrava un accesso vero che non funzionava.
         Adesso si parte da fuori, si tocca «Accedi con Google» e l'accesso è
         finto (vedi accedi()), che è anche il modo giusto di mostrare il tasto. */
      stile('senzaAccesso', 'Accedi per non perdere il piano');
    } else {
      stile('senzaAccesso', 'Accedi per non perdere il piano');
      caricaFirebase().then(function (api) {
        api.A.onAuthStateChanged(api.auth, function (u) {
          if (u) {
            utente = { uid: u.uid, email: u.email, nome: u.displayName };
            stile('inCorso', 'Leggo il tuo piano dal cloud…');
            dopoAccesso();
          } else {
            utente = null;
            stile('senzaAccesso', 'Accedi per non perdere il piano');
          }
        });
      }).catch(function (e) { log('Firebase non parte', e); stile('errore', 'Firebase non risponde'); });
    }
  }

  /* ------------------------------------------------------------------ profilo ---
     I dati della persona: foto, nome, data di nascita. Stanno in un documento
     loro — `utenti/<uid>/profilo/dati` — separato dal piano, per una ragione
     precisa: la fusione fra due dispositivi confronta il documento del piano, e
     se il profilo stesse lì dentro ogni cambio di nome diventerebbe una fusione
     da fare. Così il piano resta una cosa sola, e il profilo un'altra. */

  function rifProfilo(api) {
    return api.D.doc(api.db, 'utenti', api.auth.currentUser.uid, 'profilo', 'dati');
  }

  var CHIAVE_PROFILO_FINTO = 'aurora_prova_profilo';

  async function leggiProfilo() {
    try {
      if (PROVA) { return JSON.parse(leggi(CHIAVE_PROFILO_FINTO) || 'null'); }
      if (!utente) return null;
      var api = await caricaFirebase();
      var s = await api.D.getDoc(rifProfilo(api));
      return s.exists() ? s.data() : null;
    } catch (e) { log('profilo: lettura', e); return null; }
  }

  async function scriviProfilo(p) {
    try {
      if (PROVA) { scrivi(CHIAVE_PROFILO_FINTO, JSON.stringify(p)); return true; }
      if (!utente) return false;
      var api = await caricaFirebase();
      await api.D.setDoc(rifProfilo(api), p, { merge: true });
      return true;
    } catch (e) { log('profilo: scrittura', e); return false; }
  }

  function osservaProfilo(cb) {
    if (PROVA || !utente) return;
    caricaFirebase().then(function (api) {
      api.D.onSnapshot(rifProfilo(api), function (s) { cb(s.exists() ? s.data() : null); });
    }).catch(function (e) { log('profilo: osservazione', e); });
  }

  /* sportello per il collaudo: così le prove girano sul file vero */
  window.AuroraSync = {
    unisci: unisci,
    stessoPiano: stessoPiano,
    stato: function () { return { stato: stato, nota: nota, utente: utente, prova: PROVA }; },
    accedi: accedi,
    esci: esci,
    spingi: spingi,
    /* --- per il pannello dell'account --- */
    configurato: !!CFG,
    prova: PROVA,
    utente: function () { return utente; },
    osservatore: function (cb) { spie.push(cb); try { cb(utente); } catch (e) {} },
    profilo: { leggi: leggiProfilo, scrivi: scriviProfilo, osserva: osservaProfilo },
    perIlCollaudo: { scrivi: scrivi, leggi: leggi, remotoFinto: remotoFinto, impacchetta: impacchetta }
  };

  avvia();
})();
