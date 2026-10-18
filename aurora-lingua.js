/* ============================================================================
   AURORA LINGUA — italiano · English · Deutsch · Español
   ============================================================================
   L'app e' un pacchetto compilato: i suoi testi sono dentro il JavaScript
   minificato, e non c'e' nessun modo di chiederglieli. Quindi qui si fa una
   cosa sola, ma fatta bene: si guarda quello che l'app ha DISEGNATO e si
   sostituisce il testo italiano con la traduzione, senza toccare i suoi dati.

   Regole che rendono la cosa sicura:
     - si traducono SOLO le frasi che stanno nel dizionario (aurora-lingue.js):
       un titolo di capitolo, un nome di libro, una data, un numero non ci sono
       dentro, quindi restano come sono;
     - di ogni nodo si ricorda com'era in italiano, percio' tornare
       all'italiano e' esatto, non una traduzione al contrario;
     - gli attributi che leggono gli screen reader (aria-label, title,
       placeholder, alt) si traducono quanto il testo visibile;
     - se la lingua e' l'italiano non si fa niente: nessun giro, nessun costo.

   La scelta sta in `aut_lingua` ('auto' | 'it' | 'en' | 'de' | 'es').
   «auto» segue il telefono.
   ============================================================================ */

(function () {
  'use strict';

  var ID = 'aurora-lingua';
  var CHIAVE = 'aut_lingua';
  var L = window.AURORA_LINGUE;
  if (!L) return;

  /* --------------------------------------------------------------- il dizionario */

  var DIZ = L.diz;

  /* I titoli delle letture stanno in un file loro (aurora-titoli.js): sono
     migliaia e crescono a blocchi, e non devono gonfiare il dizionario
     dell'interfaccia. Qui si uniscono a quello che c'e' gia'; se il file non
     c'e' (la pagina Introduzione non lo carica) non succede niente. */
  if (window.AURORA_TITOLI) {
    for (var t in window.AURORA_TITOLI) {
      if (!DIZ[t]) DIZ[t] = window.AURORA_TITOLI[t];
    }
  }

  var MOD = [];
  for (var i = 0; i < L.mod.length; i++) {
    MOD.push({ re: new RegExp(L.mod[i][0]), v: L.mod[i][1].split('|') });
  }

  var CODICI = ['en', 'de', 'es'];

  /* ------------------------------------------------------- quello che non si tocca ---
     Alcune cose NON vanno tradotte, mai: il nome di una persona, per esempio.
     È un difetto trovato provando il pannello dell'account: nel dizionario
     «Marco» c'è — è il Vangelo di Marco, e in tedesco diventa «Markus» — e
     quindi un lettore che si chiama Marco si vedeva ribattezzare dall'app.
     Chi scrive un pezzo dell'interfaccia che contiene dati della persona lo
     segna con `translate="no"` (o `data-aurora-fisso`), e il motore passa
     oltre. Vale anche per l'attributo: il nome di un pulsante, per esempio. */
  function intoccabile(nodo) {
    var el = nodo.nodeType === 1 ? nodo : nodo.parentElement;
    while (el && el.getAttribute) {
      if (el.getAttribute('translate') === 'no' || el.hasAttribute('data-aurora-fisso')) return true;
      el = el.parentElement;
    }
    return false;
  }

  var LINGUE = [
    { v: 'auto', nome: 'Automatico' },
    { v: 'it', nome: 'Italiano' },
    { v: 'en', nome: 'English' },
    { v: 'de', nome: 'Deutsch' },
    { v: 'es', nome: 'Español' }
  ];

  var ATTRIBUTI = ['aria-label', 'title', 'placeholder', 'alt'];

  /* ----------------------------------------------------------------- la lingua */

  function scelta() {
    try {
      var v = localStorage.getItem(CHIAVE);
      if (v === 'auto' || v === 'it' || v === 'en' || v === 'de' || v === 'es') return v;
    } catch (e) {}
    return 'auto';
  }

  function dalTelefono() {
    var l = '';
    try { l = (navigator.language || 'it').toLowerCase(); } catch (e) { l = 'it'; }
    if (l.indexOf('it') === 0) return 'it';
    if (l.indexOf('de') === 0) return 'de';
    if (l.indexOf('es') === 0) return 'es';
    /* per tutto il resto: inglese, la lingua che piu' gente capisce */
    return 'en';
  }

  function codice() {
    var s = scelta();
    return s === 'auto' ? dalTelefono() : s;
  }

  /* -1 = italiano (niente da tradurre), 0 = inglese, 1 = tedesco, 2 = spagnolo */
  function indice() {
    var c = codice();
    return c === 'it' ? -1 : CODICI.indexOf(c);
  }

  /* ------------------------------------------------------------- le date italiane */
  /* L'app scrive «7 gennaio 2028» e «ottobre 2026» con Intl in italiano. Il
     dizionario non puo' fare niente con una data che cambia: qui si riconosce
     la forma e si ricompone nella lingua scelta. */

  function mese(nome) {
    var m = L.mesi[String(nome).toLowerCase()];
    return m ? m[indice()] : nome;
  }

  function dataItalian(t) {
    var g = t.match(/^(\d{1,2}) ([a-zà-ù]+)( \d{4})?$/i);
    if (g && L.mesi[g[2].toLowerCase()]) {
      var nome = mese(g[2]);
      var anno = g[3] || '';
      return g[1] + (indice() === 1 ? '. ' : ' ') + nome + anno;
    }
    var m = t.match(/^([a-zà-ù]+)( \d{4})$/i);
    if (m && L.mesi[m[1].toLowerCase()]) {
      var n2 = mese(m[1]);
      return indice() === 2 ? n2 + ' de' + m[2] : n2 + m[2];
    }
    /* il solo nome del mese: nel calendario l'anno e' un nodo accanto */
    if (L.mesi[t.toLowerCase()]) return mese(t);
    return null;
  }

  /* Frase spezzata in più nodi, con i numeri in elementi accanto: si riconosce
     dal contesto, non dal testo.
       «0 di 1189 capitoli letti»   -> il «di» da solo
       «L M M G V S D»              -> le iniziali, lette per posizione */
  function contesto(nodo) {
    var p = nodo.parentElement;
    if (!p || !p.classList) return null;
    var ind = indice();

    /* le iniziali dei giorni: il nodo sta dentro uno <span>, e la riga è il
       contenitore .wd. Si conta la posizione del figlio che lo contiene. */
    var wd = null;
    var el = p;
    for (var k = 0; k < 2 && el; k++) {
      if (el.classList && el.classList.contains('wd')) { wd = el; break; }
      el = el.parentElement;
    }
    if (wd) {
      var figlio = p;
      while (figlio && figlio.parentElement !== wd) figlio = figlio.parentElement;
      var posto = 0;
      var f = wd.firstChild;
      while (f && f !== figlio) {
        if (f.nodeType === 1) posto++;
        f = f.nextSibling;
      }
      var g = L.giorni[ind];
      if (g && g[posto]) return g[posto];
    }

    if (p.classList.contains('barlab') && senzaSpazi(nodo.nodeValue) === 'di') {
      return ['of', 'von', 'de'][ind];
    }

    return null;
  }

  /* ------------------------------------------------------------------ tradurre */

  /* ------------------------------------------------------- i riferimenti biblici ---
     «Genesi 1», «Salmo 119:1-36», «1 Samuele 3»: il nome del libro si traduce,
     i numeri restano. Si riconosce solo un riferimento INTERO (nome più
     numeri, nient'altro), così una frase che contiene «Giovanni» non viene
     toccata: quella la traducono il dizionario o i blocchi interi. */

  var RE_LIBRO = null;

  function reLibro() {
    if (RE_LIBRO) return RE_LIBRO;
    var nomi = Object.keys(L.libri || {}).sort(function (a, b) { return b.length - a.length; });
    var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
    RE_LIBRO = new RegExp('^(' + nomi.map(esc).join('|') + ')([\\s0-9:\\-\\u2013,\\.]*)$');
    return RE_LIBRO;
  }

  /* null se non è un riferimento: chi chiama decide cosa fare */
  function riferimento(testo) {
    if (!L.libri) return null;
    var m = String(testo).match(reLibro());
    if (!m) return null;
    var voce = L.libri[m[1]];
    if (!voce) return null;
    var coda = m[2] || '';
    /* in tedesco il capitolo si separa con la virgola: «Psalm 139,9-10»,
       come nelle citazioni della pagina Introduzione */
    if (indice() === 1) coda = coda.replace(/:/g, ',');
    return voce.split('|')[indice()] + coda;
  }

  /* Un pezzo preso dalla frase italiana può essere a sua volta una parola da
     tradurre: «Conferma Tramonto — Adesso è il momento di Tramonto.» porta
     dentro il nome del momento, che in inglese è «Sunset», e «Salterai 185
     letture (Esodo 29 → Isaia 17-21)» porta dentro due riferimenti. Se il
     pezzo è nel dizionario si traduce, se è un riferimento si traduce il nome
     del libro, altrimenti resta com'è (un titolo, un numero). */
  function gruppo(v) {
    if (v == null) return '';
    var t = senzaSpazi(v);
    var d = DIZ[t];
    if (d) return d.split('|')[indice()];
    var rif = riferimento(t);
    return rif === null ? v : rif;
  }

  function sostituisci(modello, gruppi) {
    return modello.replace(/\$(\d)/g, function (tutto, n) {
      return gruppo(gruppi[parseInt(n, 10)]);
    });
  }

  var senzaSpazi = function (t) { return t.replace(/^\s+|\s+$/g, ''); };
  var spaziIniziali = function (t) { return (t.match(/^\s*/) || [''])[0]; };
  var spaziFinali = function (t) { return (t.match(/\s*$/) || [''])[0]; };

  /* restituisce la frase tradotta, oppure null se non e' roba nostra */
  function traduci(testo) {
    var ind = indice();
    if (ind < 0) return null;
    var t = senzaSpazi(String(testo == null ? '' : testo));
    if (!t) return null;

    var diretto = DIZ[t] || L.fram[t];
    if (diretto) return diretto.split('|')[ind];

    for (var i = 0; i < MOD.length; i++) {
      var m = t.match(MOD[i].re);
      if (m) return sostituisci(MOD[i].v[ind], m);
    }

    var rif = riferimento(t);
    if (rif !== null) return rif;

    return dataItalian(t);
  }

  /* applica la traduzione a una stringa intera (sportello per il collaudo) */
  function traduciTesto(testo) {
    var t = traduci(testo);
    return t === null ? testo : t;
  }

  /* ------------------------------------------------------- gli originali in memoria */

  function testoNodo(nodo) {
    var ora = nodo.nodeValue;
    var stato = nodo.__aurora;
    if (!stato || stato.out !== ora) stato = nodo.__aurora = { it: ora };

    var ind = indice();
    if (ind < 0) {
      if (stato.it !== ora) { scrivi(function () { nodo.nodeValue = stato.it; }); }
      return;
    }
    if (!stato.it || !stato.it.trim()) return;
    if (intoccabile(nodo)) return;

    var nuovo = contesto(nodo);
    if (nuovo === null) nuovo = traduci(stato.it);
    if (nuovo === null) return;
    /* Gli spazi ai lati si portano dietro: alcune frasi l'app le spezza in più
       nodi e gli spazi stanno DENTRO i pezzi («0 di 1189 capitoli letti» sono
       quattro nodi: «0», « di », «1189», « capitoli letti»). Toglierli
       incollerebbe le parole: «0of1189chapters read». */
    nuovo = spaziIniziali(stato.it) + nuovo + spaziFinali(stato.it);
    stato.out = nuovo;
    if (ora !== nuovo) scrivi(function () { nodo.nodeValue = nuovo; });
  }

  function attributo(el, nome) {
    var ora = el.getAttribute(nome);
    if (ora === null) return;
    var memoria = el.__auroraAttr || (el.__auroraAttr = {});
    var stato = memoria[nome];
    if (!stato || stato.out !== ora) stato = memoria[nome] = { it: ora };

    var ind = indice();
    if (ind < 0) {
      if (stato.it !== ora) scrivi(function () { el.setAttribute(nome, stato.it); });
      return;
    }
    if (!stato.it || !stato.it.trim()) return;
    if (intoccabile(el)) return;

    var nuovo = traduci(stato.it);
    if (nuovo === null) return;
    stato.out = nuovo;
    if (ora !== nuovo) scrivi(function () { el.setAttribute(nome, nuovo); });
  }

  /* ------------------------------------------- leggere la pagina al contrario ---
     I miei moduli leggono la pagina per confrontarla con i dati dell'app —
     quelli sono italiani e restano italiani (il piano, i giri, i riferimenti,
     il documento che va nel backup e nella sincronizzazione). Da quando anche
     il testo disegnato può essere tradotto, leggere il testo così com'è non
     basta: queste due funzioni restituiscono l'originale italiano di un nodo o
     di un attributo, e se non l'abbiamo tradotto noi danno il testo di adesso.
     Non scrivono niente: chi legge chiama, il DOM resta quello che si vede. */

  function italianoDi(nodo) {
    if (!nodo) return '';
    if (nodo.nodeType === 3) {
      var s = nodo.__aurora;
      return s && s.it != null ? s.it : nodo.nodeValue;
    }
    if (nodo.nodeType !== 1) return '';
    var fuori = '';
    for (var f = nodo.firstChild; f; f = f.nextSibling) fuori += italianoDi(f);
    return fuori;
  }

  function attributoItaliano(el, nome) {
    if (!el || !el.getAttribute) return null;
    var m = el.__auroraAttr && el.__auroraAttr[nome];
    return m && m.it != null ? m.it : el.getAttribute(nome);
  }

  /* le scritture nostre non devono far ripartire l'osservatore */
  var scrivendo = 0;
  function scrivi(fai) {
    scrivendo++;
    try { fai(); } finally { scrivendo--; }
  }

  /* ----------------------------------------------------- i blocchi di più righe ---
     Una poesia o un brano della pagina Introduzione sono righe separate da <br>.
     Riga per riga non si possono tradurre: in tedesco il verbo va in fondo, in
     spagnolo l'aggettivo cambia posto, e verrebbe un mosaico. Quindi la chiave
     del dizionario è TUTTO il blocco (righe unite da «\n») e la traduzione
     torna giù nelle righe, ricostruendo le <br>. */

  function righeCorrenti(nodo) {
    var figli = nodo.childNodes;
    if (!figli || figli.length < 2) return null;
    var righe = [''], soloRighe = true;
    for (var i = 0; i < figli.length; i++) {
      var f = figli[i];
      if (f.nodeType === 3) righe[righe.length - 1] += f.nodeValue;
      else if (f.nodeType === 1 && f.tagName === 'BR') righe.push('');
      else { soloRighe = false; break; }
    }
    if (!soloRighe) return null;
    for (var j = 0; j < righe.length; j++) righe[j] = senzaSpazi(righe[j]);
    if (!righe.join('')) return null;
    return righe;
  }

  function disegnaRighe(nodo, righe) {
    scrivi(function () {
      while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
      for (var i = 0; i < righe.length; i++) {
        if (i) nodo.appendChild(document.createElement('br'));
        nodo.appendChild(document.createTextNode(righe[i]));
      }
    });
  }

  /* restituisce true se del blocco ci siamo occupati noi (tradotto o già
     rimesso in italiano), false se non è roba nostra */
  function bloccoRighe(nodo) {
    if (!L.righe) return false;
    var righe = righeCorrenti(nodo);
    if (!righe) return false;
    var it = righe.join('\n');
    var ind = indice();

    if (ind < 0) {
      /* italiano: se l'avevamo tradotto, si rimette com'era */
      if (nodo.__auroraRighe && nodo.__auroraRighe.join('\n') !== it) {
        disegnaRighe(nodo, nodo.__auroraRighe);
      }
      return true;
    }

    var voce = L.righe[it];
    if (!voce) return !!nodo.__auroraRighe;   /* nostro, ma già tradotto */

    var nuove = voce.split('|')[ind].split('\n');
    nodo.__auroraRighe = righe;
    if (nuove.join('\n') !== it) disegnaRighe(nodo, nuove);
    return true;
  }

  /* ------------------------------------------------------------------- il giro */

  var SALTATI = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };

  function cammina(nodo) {
    if (!nodo) return;
    if (nodo.nodeType === 3) { testoNodo(nodo); return; }
    if (nodo.nodeType !== 1) return;
    if (nodo.hasAttribute && nodo.hasAttribute('data-aurora-no')) return;

    /* Gli attributi si guardano PRIMA di saltare i campi di testo: il
       segnaposto di una <textarea> è una frase che si legge («Il codice
       appare qui…»), mentre il suo contenuto è roba della persona. Per
       questo la textarea resta in SALTATI, ma i suoi attributi no. */
    for (var a = 0; a < ATTRIBUTI.length; a++) attributo(nodo, ATTRIBUTI[a]);

    /* Dentro questi non c'è testo da leggere: si salta solo il contenuto. */
    if (SALTATI[nodo.tagName]) return;

    /* un blocco di righe si traduce intero, e le sue righe non si toccano una
       per una */
    if (bloccoRighe(nodo)) return;

    var figlio = nodo.firstChild;
    while (figlio) {
      var dopo = figlio.nextSibling;
      cammina(figlio);
      figlio = dopo;
    }
  }

  function linguaDellDocumento() {
    var c = codice();
    if (document.documentElement.getAttribute('lang') !== c) {
      document.documentElement.setAttribute('lang', c);
    }
  }

  /* ------------------------------------------------------- fuori dal corpo ---
     Il titolo della scheda e la descrizione non si possono «camminare»: non
     sono nodi del corpo. Si traducono con lo stesso dizionario, ricordando
     l'originale, così tornare in italiano è esatto e non una traduzione al
     contrario. */

  var testata = {};

  function fuoriTesto(chi, valore, metti) {
    var st = testata[chi];
    if (!st || (valore !== st.it && valore !== st.out)) st = testata[chi] = { it: valore };
    var ind = indice();
    var nuovo;
    if (ind < 0) {
      nuovo = st.it;
    } else {
      nuovo = traduci(st.it);
      if (nuovo === null) return;
    }
    st.out = nuovo;
    if (valore !== nuovo) metti(nuovo);
  }

  function testataDellaPagina() {
    fuoriTesto('titolo', document.title, function (v) { document.title = v; });

    var m = document.querySelector('meta[name="description"]');
    if (m) fuoriTesto('descrizione', m.getAttribute('content') || '', function (v) { m.setAttribute('content', v); });
  }

  function tutto() {
    if (!document.body) return;
    linguaDellDocumento();
    cammina(document.body);
    testataDellaPagina();
    segnaScelta();
  }

  /* --------------------------------------------------------------- l'osservatore */

  var inCoda = 0;

  /* L'app ridisegna in continuazione: quando arriva una modifica si rifà il
     giro intero, non solo sui nodi appena aggiunti. Guardare solo i nodi di
     QUELLA modifica perdeva tutto quello che arrivava nei 60 ms successivi —
     per esempio le card dei miei moduli, che si disegnano appena si apre la
     scheda Impostazioni: restavano in italiano. In italiano non si fa niente:
     il giro serve solo quando c'è qualcosa da tradurre. */
  function osserva() {
    if (!window.MutationObserver) return;
    /* Si segna SEMPRE, anche se in questo istante stiamo scrivendo noi: le
       scritture di un giro sono modifiche come le altre, e scartarle faceva
       perdere per strada quello che l'app disegnava nello stesso momento (la
       card di un altro modulo, la riga di un'altra scheda). Un giro in più che
       non trova niente da fare non scrive niente, quindi non si richiama: il
       ciclo finisce da solo. */
    var o = new MutationObserver(function () {
      if (inCoda) return;
      inCoda = setTimeout(function () {
        inCoda = 0;
        if (scrivendo) return;
        if (indice() < 0) return;
        cammina(document.body);
        testataDellaPagina();
        linguaDellDocumento();
      }, 60);
    });
    /* Gli attributi vanno guardati quanto il testo: React scrive
       `placeholder` e `aria-label` DOPO il primo disegno, e senza queste due
       righe restavano in italiano (visto: i due campi dei codici di backup).
       Le scritture nostre non fanno danni: il giro successivo non trova
       differenze e non scrive, quindi non si richiama da solo. */
    o.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRIBUTI
    });
  }

  /* ------------------------------------------------------------------- la card */

  function costruisci() {
    var card = document.createElement('div');
    card.className = 'card';
    card.id = ID;

    var titolo = document.createElement('h2');
    titolo.style.marginTop = '0';
    titolo.textContent = 'Lingua';

    var spiega = document.createElement('p');
    spiega.className = 'msg';
    spiega.textContent = 'L’app segue la lingua del telefono. Scegliendone un’altra vale solo per questa app: i titoli dei capitoli restano in italiano.';

    var gruppo = document.createElement('div');
    gruppo.className = 'chips';
    gruppo.setAttribute('role', 'group');
    gruppo.setAttribute('aria-label', 'Lingua');

    LINGUE.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip aurora-lingua-tasto';
      b.setAttribute('data-lingua', l.v);
      b.setAttribute('aria-pressed', 'false');
      b.textContent = l.nome;
      b.addEventListener('click', function () {
        try { localStorage.setItem(CHIAVE, l.v); } catch (e) {}
        tutto();
        /* i miei moduli (tema, promemoria) si ridisegnano: le loro frasi sono
           italiane nel codice e passano dal dizionario come tutto il resto */
        document.dispatchEvent(new CustomEvent('aurora-lingua', { detail: { lingua: codice() } }));
      });
      gruppo.appendChild(b);
    });

    card.appendChild(titolo);
    card.appendChild(spiega);
    card.appendChild(gruppo);
    return card;
  }

  function segnaScelta() {
    var card = document.getElementById(ID);
    if (!card) return;
    var s = scelta();
    var tasti = card.querySelectorAll('button[data-lingua]');
    for (var i = 0; i < tasti.length; i++) {
      var premuto = tasti[i].getAttribute('data-lingua') === s ? 'true' : 'false';
      if (tasti[i].getAttribute('aria-pressed') !== premuto) tasti[i].setAttribute('aria-pressed', premuto);
    }
  }

  /* La scheda Impostazioni si riconosce dal suo «Ritmo del piano» — ma quel
     titolo, cambiando lingua, diventa «Plan pace» o «Lesetempo»: cercarlo solo
     in italiano vorrebbe dire perdere il pannello appena si traduce. Quindi si
     riconosce in tutte e quattro le lingue, e alla prima occasione si segna
     `main[data-aurora-impostazioni]`, che nessuna traduzione tocca. */
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

  /* La card va DOPO «Aspetto» e PRIMA di «Promemoria»: la lingua è la scelta
     che si cerca per prima, e in terza posizione restava sotto il bordo dello
     schermo (segnalato: «non vedo la lingua»). La posizione si giudica da chi
     sta prima, mai da chi sta dopo — due moduli che si spostano a vicenda
     farebbero ripartire l'animazione d'ingresso e la card resterebbe
     invisibile. Catena: Aspetto → Lingua → Promemoria. */
  var occupato = false;

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try {
      var dove = pannello();
      var card = document.getElementById(ID);

      if (!dove) { if (card) card.remove(); return; }

      if (!card) card = costruisci();

      var pred = document.getElementById('aurora-aspetto');
      var inMain = !!pred && pred.parentElement === dove.main;
      var postoGiusto = card.parentElement === dove.main && (
        inMain ? pred.nextElementSibling === card : dove.main.firstElementChild === card
      );
      if (!postoGiusto) {
        dove.main.insertBefore(card, inMain ? pred.nextElementSibling : dove.main.firstElementChild);
      }

      /* le frasi della card sono appena state scritte in italiano: si traducono */
      cammina(card);
      segnaScelta();
    } finally {
      occupato = false;
    }
  }

  /* ------------------------------------------------------------------- l'avvio */

  function nomeCanonico(nome) {
    var t = String(nome || '').trim().toLowerCase();
    if (!t) return '';
    var m = L.momenti;
    for (var lingua in m) {
      if (!m.hasOwnProperty(lingua)) continue;
      for (var i = 0; i < m[lingua].length; i++) {
        if (m[lingua][i].toLowerCase() === t) return m.it[i];
      }
    }
    return String(nome || '').trim();
  }

  /* Su una pagina disegnata dal server (l'Introduzione) React "adotta" il
     documento al primo giro: cambiare il testo PRIMA che abbia finito gli fa
     trovare qualcosa di diverso da quello che ha scritto, e React butta via il
     disegno e rifà tutto (#425, poi #418 e #423). Lì si aspetta il momento
     giusto, e a dirlo è il tag <script> stesso: data-aurora-attesa.
     Sull'app non serve: la pagina è un guscio che React riempie da zero, e
     tradurre subito è sicuro (misurato: 0 messaggi). */
  var ATTESA = false;
  try {
    var mio = document.currentScript;
    ATTESA = !!(mio && mio.hasAttribute && mio.hasAttribute('data-aurora-attesa'));
  } catch (e) {}

  function avvia() {
    /* dopo il caricamento, con un margine: React ha già preso in mano la
       pagina, e l'osservatore aggiusta comunque quello che riscrive dopo */
    if (ATTESA) {
      osserva();
      window.addEventListener('load', function () { setTimeout(tutto, 350); });
      setTimeout(tutto, 1500);
      setTimeout(tutto, 2500);
      setTimeout(aggiorna, 700);
      setTimeout(aggiorna, 1600);
      aggiorna();
      return;
    }

    tutto();
    osserva();

    if (window.MutationObserver) {
      var inCoda2 = false;
      var o = new MutationObserver(function () {
        if (inCoda2) return;
        inCoda2 = true;
        setTimeout(function () { inCoda2 = false; aggiorna(); }, 120);
      });
      o.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', tutto);
    setTimeout(tutto, 300);
    setTimeout(tutto, 1200);
    setTimeout(aggiorna, 400);
    setTimeout(aggiorna, 1500);
    aggiorna();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* sportello per il collaudo e per gli altri moduli */
  window.AuroraLingua = {
    codice: codice,
    scelta: scelta,
    scegli: function (v) {
      try { localStorage.setItem(CHIAVE, v); } catch (e) {}
      tutto();
      document.dispatchEvent(new CustomEvent('aurora-lingua', { detail: { lingua: codice() } }));
      return codice();
    },
    traduci: traduciTesto,
    canonico: nomeCanonico,
    italiano: italianoDi,
    attributo: attributoItaliano,
    tutto: tutto
  };
})();
