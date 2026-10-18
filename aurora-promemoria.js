/* ============================================================================
   AURORA PROMEMORIA — «avvisami alle 7:00, alle 13:00, alle 20:00»
   ============================================================================
   Il nodo della questione, detto subito perché decide tutto il resto: una
   pagina web NON puo' svegliarti quando e' chiusa. Le notifiche del browser
   esistono (- Web Push -) ma richiedono un server che le spedisca, un permesso,
   l'app installata sulla schermata Home e, su iPhone, iOS 16.4 o successivo.
   Non e' una cosa che si aggiunge con un file.

   Il calendario invece funziona sempre: anche a telefono spento, anche fra un
   anno, anche senza rete. Quindi qui si fa una cosa sola, fatta bene:

      scegli l'ora di ogni momento  ->  un file .ics da aggiungere al calendario

   Il file contiene un evento per ogni momento scelto, che si ripete OGNI
   GIORNO alla stessa ora, con la sveglia del calendario. Il telefono lo sa
   fare da solo: nessun permesso, nessun account, niente da mantenere.

   Onesta' sui limiti, che vanno detti:
     - il calendario non sa se hai gia' letto: se hai finito prima, l'avviso
       arriva lo stesso (e' il prezzo di non avere un server);
     - se cambi un'ora, il file va aggiunto di nuovo: il calendario tiene la
       copia che gli hai dato;
     - la scelta dell'ora resta su questo dispositivo (`aut_promemoria`), fuori
       dal documento del piano: cosi' non entra nella fusione della
       sincronizzazione, che confronta i piani e non deve saperne nulla.
   ============================================================================ */

(function () {
  'use strict';

  var ID = 'aurora-promemoria';
  var CHIAVE = 'aut_promemoria';       // { v: 1, ore: { aurora: '07:00', … } }
  var NOME_FILE = 'promemoria-aurora.ics';

  /* l'ora proposta per ogni momento: si puo' cambiare, e' solo un inizio.
     Il nome del momento e' quello che scrive l'app, quindi la chiave e' senza
     accenti e senza spazi («Mezzodì» -> «mezzodi»). */
  var ORE = {
    giornata: '07:30',
    mattino: '08:00',
    aurora: '07:00',
    mezzodi: '13:00',
    pomeriggio: '16:00',
    sera: '20:30',
    tramonto: '20:00'
  };

  /* se l'app non ha ancora disegnato niente (o se un giorno cambia le
     etichette), questo e' l'elenco dei nomi per ogni ritmo: misurato
     cliccando 1..5 al giorno nelle Impostazioni */
  var PER_RITMO = {
    1: ['Giornata'],
    2: ['Mattino', 'Sera'],
    3: ['Aurora', 'Mezzodì', 'Tramonto'],
    4: ['Aurora', 'Mezzodì', 'Pomeriggio', 'Tramonto'],
    5: ['Aurora', 'Mattino', 'Mezzodì', 'Pomeriggio', 'Tramonto']
  };

  /* ------------------------------------------------------------- il salvataggio */

  function leggi() {
    try {
      var d = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
      if (d && d.v === 1 && d.ore && typeof d.ore === 'object') return d;
    } catch (e) {}
    return { v: 1, ore: {} };
  }

  function scrivi(d) {
    try { localStorage.setItem(CHIAVE, JSON.stringify(d)); } catch (e) {}
  }

  /* Il nome del momento arriva dall'app, quindi e' nella lingua scelta: con
     l'inglese si chiama «Dawn», con il tedesco «Morgendämmerung». La chiave
     salvata pero' non deve cambiare quando si cambia lingua, altrimenti un
     promemoria acceso stamattina risulterebbe spento stasera: prima si
     riporta il nome all'italiano, poi si riduce a una chiave. */
  function canonico(nome) {
    var L = window.AuroraLingua;
    return L && L.canonico ? L.canonico(nome) : nome;
  }

  function chiave(nome) {
    /* senza accenti e senza spazi: «Mezzodì» e «Mezzodi» sono la stessa cosa,
       cosi' il file .ics non cambia identificativo se un giorno l'app scrive
       l'etichetta in modo leggermente diverso */
    var t = String(nome || '');
    try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  /* ------------------------------------------------------------- i momenti */

  /* 1. la scheda Oggi, se e' disegnata: e' la fonte migliore, perche' sono i
        nomi che l'app sta usando davvero in questo momento */
  function nomiDaOggi() {
    var card = document.querySelector('.card.today');
    if (!card) return null;
    var nomi = [];
    var nodi = card.querySelectorAll('.row');
    for (var i = 0; i < nodi.length; i++) {
      var c = nodi[i].querySelector('input.chk');
      if (!c) continue;
      /* Il nome del momento si legge dal primo nodo di testo dentro `.lab`:
         e' quello che l'app disegna, gia' nella lingua scelta; la sua
         posizione non cambia con la lingua, la traduzione dell'aria-label
         invece si' (e in tedesco non somiglia all'italiano). */
      var nome = '';
      var lab = nodi[i].querySelector('.lab');
      if (lab) {
        for (var k = 0; k < lab.childNodes.length; k++) {
          var nodo = lab.childNodes[k];
          if (nodo.nodeType === 3) {
            var t = (nodo.nodeValue || '').trim();
            if (t) { nome = t; break; }
          }
        }
      }
      if (!nome) {
        var etichetta = c.getAttribute('aria-label') || '';
        var m = etichetta.match(/Segna\s+(.+?)\s+come\s+letto/i) ||
                etichetta.match(/Mark\s+(.+?)\s+as\s+read/i);
        nome = m ? m[1] : '';
      }
      if (!nome) {
        var piccolo = nodi[i].querySelector('small');
        nome = piccolo ? (piccolo.textContent || '').trim() : '';
      }
      if (nome) nomi.push(nome);
    }
    return nomi.length ? nomi : null;
  }

  /* 2. le Impostazioni: la card «Ritmo del piano» elenca i momenti del piano
        scelto con il numero di letture (<b>Aurora</b> <small>212 letture</small>) */
  function nomiDaRitmo() {
    var cards = document.querySelectorAll('main > .card');
    for (var i = 0; i < cards.length; i++) {
      var t = cards[i].querySelector('h2');
      /* il titolo della card cambia con la lingua («Plan pace», «Lesetempo»,
         «Ritmo del plan»): riconoscerlo solo in italiano la faceva sparire */
      if (!t || !/Ritmo del piano|Plan pace|Lesetempo|Ritmo del plan/.test(t.textContent || '')) continue;
      var nomi = [];
      var b = cards[i].querySelectorAll('b');
      for (var j = 0; j < b.length; j++) {
        var s = b[j].nextElementSibling;
        if (s && s.tagName === 'SMALL' && /letture/i.test(s.textContent || '')) {
          nomi.push((b[j].textContent || '').trim());
        }
      }
      if (nomi.length) return nomi;
    }
    return null;
  }

  /* 3. il documento del piano: settings.n dice quante letture al giorno */
  function nomiDalPiano() {
    try {
      var d = JSON.parse(localStorage.getItem('aut_local') || 'null');
      var n = d && d.settings && d.settings.n;
      if (PER_RITMO[n]) return PER_RITMO[n].slice();
    } catch (e) {}
    return PER_RITMO[3].slice();
  }

  var visti = '';   /* l'ultimo elenco di nomi costruito */
  var nomi = [];

  function aggiornaNomi() {
    var n = nomiDaOggi() || nomiDaRitmo() || nomiDalPiano();
    var firma = n.join('|');
    if (firma !== visti) { visti = firma; nomi = n; return true; }
    return false;
  }

  function momenti() {
    if (!nomi.length) aggiornaNomi();
    return nomi;
  }

  /* ------------------------------------------------------------- il file .ics */

  function due(n) { return (n < 10 ? '0' : '') + n; }

  /* la prossima volta che quell'ora arriva: oggi se deve ancora venire,
     altrimenti domani (cosi' non parte una sveglia mentre stai aggiungendo) */
  function prossima(hhmm) {
    var p = String(hhmm).split(':');
    var h = parseInt(p[0], 10);
    var mi = parseInt(p[1], 10);
    if (!(h >= 0 && h < 24 && mi >= 0 && mi < 60)) return null;
    var adesso = new Date();
    var d = new Date(adesso.getFullYear(), adesso.getMonth(), adesso.getDate(), h, mi, 0, 0);
    if (d.getTime() - adesso.getTime() < 120000) d = new Date(d.getTime() + 86400000);
    return d;
  }

  function data(d) {
    return d.getFullYear() + due(d.getMonth() + 1) + due(d.getDate()) +
      'T' + due(d.getHours()) + due(d.getMinutes()) + '00';
  }

  function quandoUtc(d) {
    return d.getUTCFullYear() + due(d.getUTCMonth() + 1) + due(d.getUTCDate()) +
      'T' + due(d.getUTCHours()) + due(d.getUTCMinutes()) + due(d.getUTCSeconds()) + 'Z';
  }

  /* nei campi di testo di un .ics questi caratteri sono speciali */
  function testo(t) {
    return String(t == null ? '' : t)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  /* le righe lunghe si spezzano: lo pretende lo standard, e senza le righe
     continuano con uno spazio all'inizio della successiva */
  function piega(riga) {
    var fuori = '';
    var resto = riga;
    while (resto.length > 74) {
      fuori += resto.slice(0, 74) + '\r\n ';
      resto = resto.slice(74);
    }
    return fuori + resto;
  }

  function indirizzo() {
    var c = document.querySelector('link[rel=canonical]');
    var u = c && c.getAttribute('href');
    if (u && /^https?:/i.test(u)) return u;
    return 'https://aurora-tramonto.github.io/365/';
  }

  function ospite() {
    try { return new URL(indirizzo()).host; } catch (e) { return 'aurora-tramonto.github.io'; }
  }

  function apribili() {
    var d = leggi();
    var out = [];
    var m = momenti();
    for (var i = 0; i < m.length; i++) {
      var ora = d.ore[chiave(canonico(m[i]))];
      if (ora) out.push({ nome: m[i], ora: ora });
    }
    return out;
  }

  function ics() {
    var scelti = apribili();
    var adesso = new Date();
    var righe = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dall\'Aurora al Tramonto//Promemoria//IT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + testo('Dall\'Aurora al Tramonto — promemoria')
    ];

    for (var i = 0; i < scelti.length; i++) {
      var s = scelti[i];
      var inizio = prossima(s.ora);
      if (!inizio) continue;
      var fine = new Date(inizio.getTime() + 15 * 60000);
      var titolo = s.nome + ' — la lettura di oggi';
      righe.push(
        'BEGIN:VEVENT',
        'UID:aurora-promemoria-' + chiave(canonico(s.nome)) + '@' + ospite(),
        'DTSTAMP:' + quandoUtc(adesso),
        'DTSTART:' + data(inizio),          /* ora locale, senza fuso: il calendario usa quella del telefono */
        'DTEND:' + data(fine),
        'RRULE:FREQ=DAILY',
        'TRANSP:TRANSPARENT',               /* non blocca l'agenda: e' un invito */
        'SUMMARY:' + testo(titolo),
        'DESCRIPTION:' + testo('Apri l\'app: ' + indirizzo()),
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'TRIGGER:PT0M',
        'DESCRIPTION:' + testo(titolo),
        'END:VALARM',
        'END:VEVENT'
      );
    }
    righe.push('END:VCALENDAR');
    return righe.map(piega).join('\r\n') + '\r\n';
  }

  /* ------------------------------------------------------------------ il file */

  function nomeFile() {
    return NOME_FILE;
  }

  function condividi() {
    var testo = ics();
    if (!apribili().length) return 'vuoto';
    var f;
    try { f = new File([testo], nomeFile(), { type: 'text/calendar' }); } catch (e) { f = null; }

    /* su iPhone e Android la via piu' corta e' il pannello di condivisione:
       da li' «Calendario» aggiunge gli eventi in due tocchi */
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) {
      navigator.share({ files: [f], title: 'Promemoria di lettura' })
        .then(function () { esito('Fatto: ' + apribili().length + ' promemoria da aggiungere al calendario.'); })
        .catch(function (e) {
          if (e && e.name === 'AbortError') return;   /* hai annullato: niente da dire */
          scarica(testo);
        });
      return 'condivisione';
    }
    scarica(testo);
    return 'file';
  }

  function scarica(testo) {
    try {
      var blob = new Blob([testo], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = nomeFile();
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      esito('Scaricato «' + nomeFile() + '»: aprilo per aggiungere i promemoria al calendario.');
    } catch (e) {
      esito('Il telefono non ha permesso di preparare il file. Riprova dal browser.');
    }
  }

  /* ------------------------------------------------------------------ la card */

  /* Il confronto si fa con l'italiano che vogliamo scrivere, non con il testo
     visibile: con un'altra lingua il nodo contiene già la traduzione, e
     confrontarsi con quella farebbe riscrivere l'italiano a ogni giro (un
     anello infinito fra questo modulo e il traduttore). */
  function scriviTesto(el, t) {
    if (!el) return;
    if (el.getAttribute('data-t') === t) return;
    el.setAttribute('data-t', t);
    el.textContent = t;
  }

  function esito(t) {
    var card = document.getElementById(ID);
    scriviTesto(card && card.querySelector('.aurora-prom-esito'), t);
  }

  function attivi() { return apribili().length; }

  function riga(nome) {
    var k = chiave(canonico(nome));
    var d = leggi();
    var ora = d.ore[k] || '';
    var r = document.createElement('div');
    r.className = 'aurora-prom-riga';
    r.setAttribute('data-chiave', k);

    var etichetta = document.createElement('span');
    etichetta.className = 'aurora-prom-nome';
    etichetta.textContent = nome;

    var tasto = document.createElement('button');
    tasto.type = 'button';
    tasto.className = 'chip aurora-prom-tasto';
    tasto.setAttribute('aria-pressed', ora ? 'true' : 'false');
    tasto.textContent = ora ? 'Attivo' : 'Spento';
    tasto.setAttribute('aria-label', 'Promemoria ' + nome + ': ' + (ora ? 'attivo' : 'spento'));

    var campo = document.createElement('input');
    campo.type = 'time';
    campo.className = 'aurora-prom-ora';
    campo.value = ora || ORE[k] || '07:00';
    campo.setAttribute('aria-label', 'Ora del promemoria ' + nome);
    /* da spento non si vede, ma il suo posto resta: cosi' l'interruttore delle
       righe spente sta sulla stessa colonna di quelle accese, invece di
       scivolare a destra */
    campo.disabled = !ora;
    campo.setAttribute('aria-hidden', ora ? 'false' : 'true');
    if (!ora) r.classList.add('spento');

    tasto.addEventListener('click', function () {
      var stato = leggi();
      var attuale = stato.ore[k];
      if (attuale) delete stato.ore[k];
      else stato.ore[k] = campo.value || ORE[k] || '07:00';
      scrivi(stato);
      var nuovo = !!stato.ore[k];
      tasto.setAttribute('aria-pressed', nuovo ? 'true' : 'false');
      tasto.textContent = nuovo ? 'Attivo' : 'Spento';
      tasto.setAttribute('aria-label', 'Promemoria ' + nome + ': ' + (nuovo ? 'attivo' : 'spento'));
      campo.disabled = !nuovo;
      campo.setAttribute('aria-hidden', nuovo ? 'false' : 'true');
      if (nuovo) r.classList.remove('spento'); else r.classList.add('spento');
      aggiornaTasto();
      esito('');
    });

    campo.addEventListener('change', function () {
      if (!campo.value) { campo.value = ORE[k] || '07:00'; }
      var stato = leggi();
      stato.ore[k] = campo.value;
      scrivi(stato);
      aggiornaTasto();
      esito('');
    });
    campo.addEventListener('input', function () {
      if (!campo.value) return;
      var stato = leggi();
      stato.ore[k] = campo.value;
      scrivi(stato);
    });

    r.appendChild(etichetta);
    r.appendChild(tasto);
    r.appendChild(campo);
    return r;
  }

  function costruisci() {
    var card = document.createElement('div');
    card.className = 'card';
    card.id = ID;

    var titolo = document.createElement('h2');
    titolo.style.marginTop = '0';
    titolo.textContent = 'Promemoria';

    var spiega = document.createElement('p');
    spiega.className = 'msg';
    spiega.textContent = 'Il calendario del telefono ti avvisa anche ad app chiusa: scegli un\'ora per ogni momento, poi aggiungi i promemoria. Si ripetono ogni giorno da soli.';

    var elenco = document.createElement('div');
    elenco.className = 'aurora-prom-elenco';

    var azioni = document.createElement('div');
    azioni.className = 'chips';
    var crea = document.createElement('button');
    crea.type = 'button';
    crea.className = 'btn pri aurora-prom-crea';
    crea.textContent = 'Aggiungi al calendario';
    crea.addEventListener('click', function () { condividi(); });
    azioni.appendChild(crea);

    var nota = document.createElement('p');
    nota.className = 'msg aurora-prom-esito';
    nota.setAttribute('aria-live', 'polite');

    var avviso = document.createElement('p');
    avviso.className = 'msg aurora-prom-avviso';
    avviso.textContent = 'Il calendario non sa se hai già letto: l\'avviso arriva comunque. E se cambi un\'ora, aggiungi di nuovo il file.';

    card.appendChild(titolo);
    card.appendChild(spiega);
    card.appendChild(elenco);
    card.appendChild(azioni);
    card.appendChild(nota);
    card.appendChild(avviso);
    return card;
  }

  function aggiornaTasto() {
    var card = document.getElementById(ID);
    if (!card) return;
    var crea = card.querySelector('.aurora-prom-crea');
    var n = attivi();
    if (crea) {
      crea.disabled = !n;
      scriviTesto(crea, n ? 'Aggiungi al calendario' : 'Nessun promemoria scelto');
    }
  }

  function ridisegnaElenco(card) {
    var elenco = card.querySelector('.aurora-prom-elenco');
    if (!elenco) return;
    elenco.innerHTML = '';
    var m = momenti();
    for (var i = 0; i < m.length; i++) elenco.appendChild(riga(m[i]));
  }

  /* La scheda Impostazioni si riconosce dalla card «Ritmo del piano», che con
     un'altra lingua diventa «Plan pace» / «Lesetempo» / «Ritmo del plan»: si
     riconosce in tutte e quattro, e il pannello trovato si segna con un
     attributo che nessuna traduzione può cambiare. */
  var TITOLI = /Ritmo del piano|Plan pace|Lesetempo|Ritmo del plan/;

  function pannello() {
    var segnato = document.querySelector('main[data-aurora-impostazioni]');
    if (segnato) return { main: segnato, prima: segnato.firstElementChild };

    var cards = document.querySelectorAll('main > .card');
    for (var i = 0; i < cards.length; i++) {
      var t = cards[i].querySelector('h2');
      if (t && TITOLI.test(t.textContent || '')) {
        var main = cards[i].parentElement;
        if (main && main.tagName === 'MAIN') main.setAttribute('data-aurora-impostazioni', 'sì');
        return { main: main, prima: cards[i] };
      }
    }
    return null;
  }

  var occupato = false;

  /* se il cursore è in uno dei campi non si ridisegna niente: ricostruire la
     riga mentre qualcuno scrive l'ora gli toglierebbe il campo da sotto le dita */
  function stoScrivendo() {
    var e = document.activeElement;
    if (!e || !e.closest) return false;
    return !!e.closest('#' + ID);
  }

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try {
      var cambiato = aggiornaNomi();
      var dove = pannello();
      var card = document.getElementById(ID);

      if (!dove) { if (card) card.remove(); return; }

      if (!card) {
        card = costruisci();
        ridisegnaElenco(card);
        cambiato = false;
      } else if (cambiato && !stoScrivendo()) {
        ridisegnaElenco(card);
      }

      /* Dopo «Lingua» e «Aspetto» se ci sono, altrimenti in cima: sono le
         scelte che riguardano l'app, non il piano, e vanno per prime.
         La posizione si giudica da chi sta PRIMA della card, non da chi sta
         dopo: due moduli che si spostano a vicenda si rincorrerebbero a ogni
         ridisegno, e ogni spostamento fa ripartire l'animazione d'ingresso
         della card (che resterebbe a opacita' zero per sempre). */
      var pred = document.getElementById('aurora-lingua') ||
        document.getElementById('aurora-aspetto');
      var inCima = !!pred && pred.parentElement === dove.main;
      var postoGiusto = card.parentElement === dove.main && (
        inCima ? pred.nextElementSibling === card
               : dove.main.firstElementChild === card
      );
      if (!postoGiusto) {
        dove.main.insertBefore(card, inCima ? pred.nextElementSibling : dove.main.firstElementChild);
      }
      aggiornaTasto();
    } finally {
      occupato = false;
    }
  }

  /* --------------------------------------------------------------- l'avvio */

  function avvia() {
    /* la lingua cambia: le righe si riscrivono con i nomi nuovi, senza perdere
       quello che e' acceso (le chiavi restano le stesse) */
    document.addEventListener('aurora-lingua', function () {
      visti = '';
      var card = document.getElementById(ID);
      if (card) ridisegnaElenco(card);
      aggiorna();
    });

    if (window.MutationObserver) {
      var inCoda = false;
      var osservatore = new MutationObserver(function () {
        if (inCoda) return;
        inCoda = true;
        setTimeout(function () { inCoda = false; aggiorna(); }, 120);
      });
      osservatore.observe(document.body, { childList: true, subtree: true });
    }
    aggiorna();
    setTimeout(aggiorna, 400);
    setTimeout(aggiorna, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* sportello per il collaudo: cosi' le prove girano sul file vero */
  window.AuroraPromemoria = {
    momenti: momenti,
    dati: leggi,
    ics: ics,
    condividi: condividi,
    scelte: function () {
      var d = leggi();
      return momenti().map(function (n) { return { nome: n, chiave: chiave(n), ora: d.ore[chiave(n)] || null }; });
    }
  };
})();
