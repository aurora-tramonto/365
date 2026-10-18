/* ============================================================================
   AURORA SALTA — «Dove sei arrivato?»
   ============================================================================
   Il pannello «Modifica» dell'app chiede due cose diverse con lo stesso peso:
   un campo per saltare a un altro punto e un campo numerico per dire «mi sono
   fermato al versetto». Nessuno dei due dice dove finirai, il secondo non
   mostra l'intervallo valido, e su una lettura di più capitoli non funziona
   affatto — ma lo scopri solo dopo aver premuto.

   Qui il pannello diventa una domanda sola:

     Adesso: Genesi 1-3 · lettura 1 di 561
     Dove sei arrivato?  [ es. Isaia 22:15 ]
     ┌────────────────────────────────────────────────┐
     │ Segno Isaia 22:1-15 come letto · riprendi da … │   ← cosa succederà
     └────────────────────────────────────────────────┘
     [ Segna e riprendi ]   (o «Riprendi da qui», se sei altrove)

   Il pulsante cambia da solo secondo dove sei, e se non c'è niente da fare
   si spegne e lo dice («Sei già qui»), invece di far finta.

   COME FUNZIONA, E PERCHÉ COSÌ
   Non riscrivo il programma: i due campi e i due pulsanti veri restano nel
   documento, nascosti. Quando confermi, il modulo scrive nel campo giusto
   (passando dal setter nativo, così React se ne accorge) e preme il pulsante
   giusto: a fare il lavoro è l'app, con le sue regole. Se il programma cambia
   idea su come si divide una lettura, questo modulo non deve saperlo.

   L'unica cosa che il modulo deve sapere è DOVE sei: legge `aut_local` e
   cerca la lettura che contiene il punto scritto, esattamente come fa l'app.
   ============================================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- i capitoli */
  /* Quanti versetti ha ogni capitolo: serve solo a dire «Isaia 22:99 non esiste»
     prima di premere. Sono i numeri della Bibbia, non del piano. */
  var CAPITOLI = {"Genesi":[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],"Esodo":[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],"Levitico":[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],"Numeri":[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],"Deuteronomio":[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],"Giosuè":[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],"Giudici":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],"Rut":[22,23,18,22],"1 Samuele":[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],"2 Samuele":[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],"1 Re":[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],"2 Re":[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],"1 Cronache":[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],"2 Cronache":[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],"Esdra":[11,70,13,24,17,22,28,36,15,44],"Neemia":[11,20,32,23,19,19,73,18,38,39,36,47,31],"Ester":[22,23,15,17,14,14,10,17,32,3],"Giobbe":[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],"Salmo":[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],"Proverbi":[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],"Ecclesiaste":[18,26,22,16,20,12,29,17,18,20,10,14],"Cantico":[17,17,11,16,16,13,13,14],"Isaia":[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],"Geremia":[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],"Lamentazioni":[22,22,66,22,22],"Ezechiele":[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],"Daniele":[21,49,30,37,31,28,28,27,27,21,45,13],"Osea":[11,23,5,19,15,11,16,14,17,15,12,14,16,9],"Gioele":[20,32,21],"Amos":[15,16,15,13,27,14,17,14,15],"Abdia":[21],"Giona":[17,10,10,11],"Michea":[16,13,12,13,15,16,20],"Naum":[15,13,19],"Abacuc":[17,20,19],"Sofonia":[18,15,20],"Aggeo":[15,23],"Zaccaria":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],"Malachia":[14,17,18,6],"Matteo":[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],"Marco":[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],"Luca":[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],"Giovanni":[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],"Atti":[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],"Romani":[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],"1 Corinzi":[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],"2 Corinzi":[24,17,18,18,21,18,16,24,15,18,33,21,14],"Galati":[24,21,29,31,26,18],"Efesini":[23,22,21,32,33,24],"Filippesi":[30,30,21,23],"Colossesi":[29,23,25,18],"1 Tessalonicesi":[10,20,13,18,28],"2 Tessalonicesi":[12,17,18],"1 Timoteo":[20,15,16,16,25,21],"2 Timoteo":[18,26,17,22],"Tito":[16,15,15],"Filemone":[25],"Ebrei":[14,18,19,16,14,20,28,13,28,39,40,29,25],"Giacomo":[27,26,18,17,20],"1 Pietro":[25,25,22,19,14],"2 Pietro":[21,22,18],"1 Giovanni":[10,29,24,21,21],"2 Giovanni":[13],"3 Giovanni":[15],"Giuda":[25],"Apocalisse":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]};

  var ORDINE = Object.keys(CAPITOLI);
  var CHIAVE = 'aut_local';
  var CLASSE_VIA = 'aurora-salta-via';

  /* qualche nome come lo scrive la gente, non come sta nel piano */
  var ALIAS = {
    'salmi': 'Salmo',
    'cantico dei cantici': 'Cantico',
    'atti degli apostoli': 'Atti',
    'apocalisse di giovanni': 'Apocalisse',
    'qohelet': 'Ecclesiaste',
    'ecclesiaste': 'Ecclesiaste'
  };

  function T(testo) {
    try {
      if (window.AuroraLingua && window.AuroraLingua.traduci) return window.AuroraLingua.traduci(testo);
    } catch (e) {}
    return testo;
  }

  /* ------------------------------------------------------------------ i nomi ---
     Da quando l'app traduce i nomi dei libri, chi legge «Isaiah 22» o «Jesaja 22»
     deve essere capito come chi scrive «Isaia 22»: qui si impara la forma della
     lingua scelta e la si riporta al nome italiano. La scrittura verso l'app
     resta italiana — i riferimenti del piano sono quelli, ed e' quello che
     l'app salva nel piano, nel backup e nella sincronizzazione. */
  function indiceLingua() {
    try {
      var c = window.AuroraLingua && window.AuroraLingua.codice ? window.AuroraLingua.codice() : 'it';
      return c === 'it' ? -1 : ['en', 'de', 'es'].indexOf(c);
    } catch (e) { return -1; }
  }

  function nomeLibro(b) {
    var i = indiceLingua();
    var L = window.AURORA_LINGUE;
    if (i < 0 || !L || !L.libri || !L.libri[b]) return b;
    return L.libri[b].split('|')[i];
  }

  /* «1. Samuel» e «1 Samuel» sono lo stesso libro: punti e spazi non contano */
  function compatto(s) {
    return senzaAccenti(s).replace(/[\s.]/g, '');
  }

  /* ------------------------------------------------------------- lo stato vero */
  var cacheGrezzo = null;
  var cacheStato = null;

  function statoApp() {
    var grezzo = null;
    try { grezzo = localStorage.getItem(CHIAVE); } catch (e) { return null; }
    if (grezzo === cacheGrezzo) return cacheStato;
    cacheGrezzo = grezzo;
    try { cacheStato = JSON.parse(grezzo || 'null'); } catch (e) { cacheStato = null; }
    return cacheStato;
  }

  /* ------------------------------------------------------------- i riferimenti */
  function senzaAccenti(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /* nomi compattati («1 Samuele» → «1samuele»), dal più lungo: così «1 Giovanni»
     non viene letto come «Giovanni». Di ogni libro si impara anche la forma
     tradotta, se una lingua e' scelta. */
  var NOMI = [];

  function imparaNomi() {
    NOMI = [];
    ORDINE.forEach(function (b) {
      NOMI.push({ b: b, n: compatto(b) });
      var tradotto = nomeLibro(b);
      if (tradotto !== b) NOMI.push({ b: b, n: compatto(tradotto) });
    });
    NOMI.sort(function (x, y) { return y.n.length - x.n.length; });
  }

  imparaNomi();

  /* l'ordine della Bibbia, per l'elenco da toccare */
  var NOMI_ORDINE = ORDINE.slice();

  function trovaLibro(piatto) {
    for (var i = 0; i < NOMI.length; i++) {
      if (piatto.indexOf(NOMI[i].n) === 0) return NOMI[i];
    }
    return null;
  }

  /* «isaia 22:15» → { b, c1, c2, v1, v2 } — oppure { ignoto } / { fuori } */
  function analizza(testo) {
    var t = String(testo || '').trim().replace(/\s+/g, ' ');
    if (!t) return { vuoto: true };

    var norm = senzaAccenti(t);
    for (var k in ALIAS) {
      if (!ALIAS.hasOwnProperty(k)) continue;
      if (norm === k || norm.indexOf(k + ' ') === 0) { t = ALIAS[k] + t.slice(k.length); break; }
    }
    var piatto = compatto(t);

    var trovato = trovaLibro(piatto);
    if (!trovato) return { ignoto: true };

    var resto = piatto.slice(trovato.n.length);
    var b = trovato.b;
    var quanti = CAPITOLI[b].length;

    if (!resto) return { b: b, c1: 1, c2: quanti, v1: null, v2: null, libro: true };

    /* il versetto si separa con «:» (italiano, spagnolo, inglese) oppure con
       «,» (tedesco: «Jesaja 22,15», che è anche quello che il segnaposto
       suggerisce in tedesco). Prima si accettava solo «:», quindi chi
       scriveva «Jesaja 22,15» leggeva «non riesco a leggere questa
       indicazione» e nel messaggio gli veniva suggerito «Galater 5,1» —
       che non funzionava nemmeno. Difetto trovato provando il pannello in
       tedesco. */
    var m = resto.match(/^(\d+)(?:[:,](\d+)(?:-(\d+))?)?(?:-(\d+))?$/);
    if (!m) return { b: b, rotto: true };

    var c1 = +m[1];
    if (c1 < 1 || c1 > quanti) return { b: b, fuori: true, max: quanti, tipo: 'capitoli' };

    var versi = CAPITOLI[b][c1 - 1];

    if (m[2]) {
      var v1 = +m[2], v2 = m[3] ? +m[3] : v1;
      if (v1 < 1 || v2 < v1 || v2 > versi) {
        return { b: b, fuori: true, max: versi, tipo: 'versetti', capitolo: c1 };
      }
      return { b: b, c1: c1, c2: c1, v1: v1, v2: v2 };
    }

    if (m[4]) {
      var c2 = Math.min(+m[4], quanti);
      if (c2 <= c1) return { b: b, rotto: true };
      return { b: b, c1: c1, c2: c2, v1: null, v2: null };
    }

    return { b: b, c1: c1, c2: c1, v1: null, v2: null };
  }

  /* le letture del piano sono scritte come «Genesi 1-3» o «Salmo 119:1-106» */
  function partiRef(r) {
    var m = String(r || '').trim().match(/^(.+?)\s(\d+)(?::(\d+)(?:-(\d+))?)?(?:-(\d+))?$/);
    if (!m) return null;
    return {
      b: m[1], c1: +m[2],
      c2: m[5] ? +m[5] : +m[2],
      v1: m[3] ? +m[3] : null,
      v2: m[4] ? +m[4] : null
    };
  }

  function versiDelCapitolo(b, c) {
    var l = CAPITOLI[b];
    return l && l[c - 1] ? l[c - 1] : 0;
  }

  /* quale lettura del piano contiene quel punto (e quel versetto, se c'è) */
  function letturaDi(piano, b, c, v) {
    var primo = -1;
    for (var i = 0; i < piano.length; i++) {
      var p = partiRef(piano[i]);
      if (!p || p.b !== b || c < p.c1 || c > p.c2) continue;
      if (primo < 0) primo = i;
      if (!v) continue;
      if (p.v1 != null) {
        var alto = p.v2 != null ? p.v2 : versiDelCapitolo(b, c);
        if (v >= p.v1 && v <= alto) return i;
      } else {
        return i;
      }
    }
    return primo;
  }

  /* --------------------------------------------------- parlare con React ----- */
  /* Non basta `input.value = …`: React tiene il suo valore e non se ne accorge.
     Il setter nativo invece passa dal suo ascoltatore, come un tasto vero. */
  function mettiValore(input, valore) {
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, String(valore));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function premi(input) {
    var riga = input.parentElement;
    var bottone = riga && riga.querySelector('button');
    if (bottone) bottone.click();
  }

  /* ------------------------------------------------------- che cosa è già letto ---
     L'app tiene tre elenchi: `done` (le letture spuntate), `extra` (i pezzi letti
     a parte, come quelli lasciati dietro da una divisione) e `rr` (le riletture).
     Da lì si ricava, versetto per versetto, che cosa è già passato: serve alla
     griglia (per segnare i capitoli già letti) e agli avvisi («questo pezzo è
     già letto»). Non si inventa niente: sono gli stessi dati dell'app. */

  var cacheMappa = { grezzo: null, n: -1, mappa: null };

  function segnaLetto(mappa, rif) {
    var p = partiRef(rif);
    if (!p || !CAPITOLI[p.b]) return;
    if (!mappa[p.b]) {
      mappa[p.b] = CAPITOLI[p.b].map(function (v) { return new Uint8Array(v + 1); });
    }
    var quanti = CAPITOLI[p.b].length;
    var c2 = Math.min(p.c2, quanti);
    for (var c = p.c1; c <= c2; c++) {
      if (c < 1) continue;
      var q = mappa[p.b][c - 1];
      var da = (c === p.c1 && p.v1) ? p.v1 : 1;
      var a = Math.min((c === p.c2 && p.v2) ? p.v2 : q.length - 1, q.length - 1);
      for (var v = da; v <= a; v++) q[v] = 1;
    }
  }

  function mappaLetto(s, n) {
    if (cacheMappa.grezzo === cacheGrezzo && cacheMappa.n === n) return cacheMappa.mappa;

    var mappa = {};
    var piano = (s.plan && s.plan[n]) || [];

    (s.pre || []).forEach(function (r) { segnaLetto(mappa, r); });
    (s.extra || []).forEach(function (r) { segnaLetto(mappa, typeof r === 'string' ? r : ''); });

    var fatti = (s.done && s.done[n]) || [];
    for (var i = 0; i < fatti.length; i++) {
      segnaLetto(mappa, (s.ovr && s.ovr[n + ':' + fatti[i]]) || piano[fatti[i]]);
    }

    if (s.rr) {
      for (var b in s.rr) {
        if (!s.rr.hasOwnProperty(b) || !s.rr[b] || !s.rr[b].items) continue;
        s.rr[b].items.forEach(function (r) { segnaLetto(mappa, r); });
      }
    }

    cacheMappa = { grezzo: cacheGrezzo, n: n, mappa: mappa };
    return mappa;
  }

  /* 0 = niente, 1 = in parte, 2 = tutto il capitolo */
  function quantoLetto(mappa, b, c) {
    var q = mappa && mappa[b] && mappa[b][c - 1];
    if (!q) return 0;
    var letti = 0, tot = q.length - 1;
    for (var v = 1; v <= tot; v++) if (q[v]) letti++;
    if (!letti) return 0;
    return letti === tot ? 2 : 1;
  }

  function versoLetto(mappa, b, c, v) {
    var q = mappa && mappa[b] && mappa[b][c - 1];
    return !!(q && q[v]);
  }

  /* ------------------------------------------------------------------ il pannello */
  function crea(n) {
    var box = document.createElement('div');
    box.className = 'aurora-salta';
    box.__sel = { b: null, c: null, v: null };
    box.__aperto = null;
    box.__filtro = '';

    var dove = document.createElement('p');
    dove.className = 'aurora-salta-dove';

    var domanda = document.createElement('label');
    domanda.className = 'aurora-salta-domanda';
    domanda.textContent = T('Dove sei arrivato?');

    /* i tre passi: libro → capitolo → versetto. Si toccano, non si scrivono. */
    var scelta = document.createElement('div');
    scelta.className = 'aurora-salta-scelta';
    box.__passi = {};

    [['libro', T('Libro')], ['capitolo', T('Capitolo')], ['versetto', T('Versetto')]].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'aurora-salta-passo';
      b.appendChild(document.createTextNode('—'));
      var s = document.createElement('span');
      s.textContent = p[1];
      b.appendChild(s);
      b.addEventListener('click', function () {
        if (b.disabled) return;
        box.__aperto = box.__aperto === p[0] ? null : p[0];
        box.__firma = '';
        aggiorna(box.__edit);
      });
      scelta.appendChild(b);
      box.__passi[p[0]] = b;
    });

    var cerca = document.createElement('input');
    cerca.type = 'search';
    cerca.className = 'aurora-salta-cerca';
    cerca.autocomplete = 'off';
    cerca.placeholder = T('Cerca un libro');
    cerca.setAttribute('aria-label', T('Cerca un libro'));
    cerca.addEventListener('input', function () {
      box.__filtro = cerca.value;
      box.__firma = '';
      aggiorna(box.__edit);
    });

    var griglia = document.createElement('div');
    griglia.className = 'aurora-salta-griglia';

    var lista = document.createElement('div');
    lista.className = 'aurora-salta-lista';
    lista.hidden = true;
    lista.appendChild(cerca);
    lista.appendChild(griglia);

    var campo = document.createElement('input');
    campo.type = 'text';
    campo.className = 'aurora-salta-campo';
    campo.autocomplete = 'off';
    campo.spellcheck = false;
    campo.placeholder = T('es. Isaia 22:15');
    campo.id = 'aurora-salta-campo-' + n;
    campo.setAttribute('aria-describedby', 'aurora-salta-eco-' + n);
    campo.hidden = true;

    var scrivi = document.createElement('button');
    scrivi.type = 'button';
    scrivi.className = 'link aurora-salta-scrivi';
    scrivi.textContent = T('oppure scrivi il riferimento');
    scrivi.addEventListener('click', function () {
      box.__scritto = !box.__scritto;
      aggiorna(box.__edit);
      if (box.__scritto) campo.focus();
    });

    var eco = document.createElement('p');
    eco.className = 'aurora-salta-eco';
    eco.id = 'aurora-salta-eco-' + n;
    eco.setAttribute('aria-live', 'polite');

    var chiede = document.createElement('p');
    chiede.className = 'aurora-salta-chiede';
    chiede.hidden = true;

    var fai = document.createElement('button');
    fai.type = 'button';
    fai.className = 'btn pri full aurora-salta-fai';
    fai.textContent = T('Riprendi da qui');
    /* la riga sopra il pulsante dice cosa succederà: il lettore di schermo
       la legge insieme al pulsante, senza doverla cercare */
    fai.setAttribute('aria-describedby', 'aurora-salta-eco-' + n);

    var no = document.createElement('button');
    no.type = 'button';
    no.className = 'link aurora-salta-no';
    no.hidden = true;

    var sotto = document.createElement('div');
    sotto.className = 'aurora-salta-sotto';
    sotto.appendChild(no);

    box.appendChild(dove);
    box.appendChild(domanda);
    box.appendChild(scelta);
    box.appendChild(lista);
    box.appendChild(scrivi);
    box.appendChild(campo);
    box.appendChild(eco);
    box.appendChild(chiede);
    box.appendChild(fai);
    box.appendChild(sotto);

    box.__pezzi = {
      dove: dove, domanda: domanda, campo: campo, eco: eco, fai: fai,
      sotto: sotto, scelta: scelta, lista: lista, cerca: cerca, griglia: griglia,
      scrivi: scrivi, chiede: chiede, no: no, passi: box.__passi
    };
    return box;
  }

  /* il testo che il campo nascosto deve contenere, dato quello che è stato toccato */
  function testoScelto(sel) {
    if (!sel.b) return '';
    if (!sel.c) return sel.b;
    return sel.b + ' ' + sel.c + (sel.v ? ':' + sel.v : '');
  }

  function scegli(box, cosa, valore) {
    var sel = box.__sel;
    if (cosa === 'b') { sel.b = valore; sel.c = null; sel.v = null; box.__aperto = 'capitolo'; box.__filtro = ''; }
    if (cosa === 'c') { sel.c = valore; sel.v = null; box.__aperto = 'versetto'; }
    if (cosa === 'v') { sel.v = valore; box.__aperto = null; }
    box.__mancaCapitolo = cosa === 'b';
    box.__digitato = false;
    box.__firma = '';
    box.__pezzi.campo.value = testoScelto(sel);
    aggiorna(box.__edit);
  }

  function bottoneGriglia(testo, attivo, letto, fai) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'aurora-salta-cella' + (letto ? ' letto' : '') + (attivo ? ' ora' : '');
    b.textContent = testo;
    b.setAttribute('aria-pressed', attivo ? 'true' : 'false');
    b.addEventListener('click', fai);
    return b;
  }

  /* disegna il passo aperto; se non è cambiato niente, non tocca il DOM */
  function disegnaLista(box, mappa) {
    var pezzi = box.__pezzi;
    var lista = pezzi.lista;
    var griglia = pezzi.griglia;
    var sel = box.__sel;
    var aperto = box.__aperto;

    if (!aperto) {
      lista.hidden = true;
      box.__firma = '';
      return;
    }

    var firma = aperto + '|' + (sel.b || '') + '|' + (sel.c || '') + '|' + box.__filtro + '|' + cacheGrezzo;
    if (box.__firma === firma) return;
    box.__firma = firma;

    lista.hidden = false;
    pezzi.cerca.hidden = aperto !== 'libro';
    griglia.textContent = '';

    if (aperto === 'libro') {
      var filtro = compatto(box.__filtro);
      NOMI_ORDINE.forEach(function (nome) {
        /* si cerca in italiano e nella lingua scelta: «iesaja» e «isaia»
           trovano lo stesso libro */
        if (filtro && compatto(nome).indexOf(filtro) < 0 && compatto(nomeLibro(nome)).indexOf(filtro) < 0) return;
        griglia.appendChild(bottoneGriglia(nome, sel.b === nome, false, function () {
          scegli(box, 'b', nome);
        }));
      });
      return;
    }

    if (!sel.b || !CAPITOLI[sel.b]) return;

    if (aperto === 'capitolo') {
      for (var c = 1; c <= CAPITOLI[sel.b].length; c++) {
        (function (cap) {
          var quanto = quantoLetto(mappa, sel.b, cap);
          var b = bottoneGriglia(String(cap), sel.c === cap, quanto === 2, function () {
            scegli(box, 'c', cap);
          });
          if (quanto === 1) b.classList.add('parte');
          b.title = quanto === 2 ? T('già letto') : (quanto === 1 ? T('letto in parte') : T('non ancora letto'));
          griglia.appendChild(b);
        }(c));
      }
      return;
    }

    /* i versetti: prima «tutto il capitolo», poi i numeri con quelli già letti
       segnati — così l'avviso arriva prima di toccare, non dopo */
    var quanti = CAPITOLI[sel.b][sel.c - 1];
    griglia.appendChild(bottoneGriglia(T('Tutto il capitolo'), sel.v == null, false, function () {
      scegli(box, 'v', null);
    }));
    for (var v = 1; v <= quanti; v++) {
      (function (verso) {
        var b = bottoneGriglia(String(verso), sel.v === verso, versoLetto(mappa, sel.b, sel.c, verso), function () {
          scegli(box, 'v', verso);
        });
        b.title = versoLetto(mappa, sel.b, sel.c, verso) ? T('già letto') : T('non ancora letto');
        griglia.appendChild(b);
      }(v));
    }
  }

  /* nasconde le righe vere del pannello dell'app, lasciando il loro messaggio */
  function nascondi(edit, go, sv) {
    var nodi = [];
    var fGo = go && go.parentElement;
    var fSv = sv && sv.parentElement;
    var etichetta = go && edit.querySelector('label[for="' + go.id + '"]');
    var fEtichetta = etichetta && etichetta.parentElement;
    var suggerimento = edit.querySelector('small.hint');

    [fEtichetta, suggerimento, fGo, fSv].forEach(function (n) {
      if (n && n !== edit) nodi.push(n);
    });

    nodi.forEach(function (n) { n.classList.add(CLASSE_VIA); });
  }

  /* ------------------------------------------------------------------ il disegno */
  function aggiorna(edit) {
    var go = edit.querySelector('input[id^="go"]');
    var sv = edit.querySelector('input[id^="sv"]');
    if (!go) return;

    var n = parseInt(String(go.id).slice(2), 10);
    if (isNaN(n)) return;

    nascondi(edit, go, sv);

    var box = edit.querySelector('.aurora-salta');
    if (!box) {
      box = crea(n);
      edit.insertBefore(box, edit.firstChild);
    } else if (edit.firstElementChild !== box) {
      edit.insertBefore(box, edit.firstChild);
    }

    var pezzi = box.__pezzi;
    var campo = pezzi.campo;
    var eco = pezzi.eco;
    var fai = pezzi.fai;
    var sotto = pezzi.sotto;

    var s = statoApp();
    var piano = s && s.plan && s.plan[n];
    if (!piano) {
      pezzi.dove.textContent = '';
      return;
    }

    var pos = (s.pos && typeof s.pos[n] === 'number') ? s.pos[n] : 0;
    var riga = edit.closest('.row');
    var refOra = '';
    if (riga) {
      var r = riga.querySelector('.ref');
      refOra = r ? (r.textContent || '').trim() : '';
    }

    /* Dove sei lo dice la pagina, non la memoria. `aut_local` viene scritto
       con un attimo di ritardo — e a volte non viene scritto affatto: dopo una
       divisione è rimasto indietro di duecento letture. Il riferimento in cima
       alla riga invece è quello che si vede. Si cerca nel piano, prima per
       stringa intera (è il caso normale), poi per libro e capitolo: dopo una
       divisione la riga dice «Genesi 41:16-57», che nel piano non c'è, ma
       appartiene alla lettura «Genesi 41». */
    var visto = refOra ? piano.indexOf(refOra) : -1;
    var rifOra = refOra ? partiRef(refOra) : null;
    if (visto < 0 && rifOra) visto = letturaDi(piano, rifOra.b, rifOra.c1, rifOra.v1 || 1);
    if (visto >= 0) pos = visto;
    if (!refOra) refOra = piano[pos] || '';

    /* Le frecce della riga hanno come nome «‹ precedente» e «successiva ›»:
       il primo si sente «segno minore precedente», il secondo non dice cosa
       muove. Qui prendono un nome che si capisce, senza cambiare il testo. */
    if (riga) {
      /* La casella dice «Segna Aurora come letto»: il momento, non la lettura.
         Chi ascolta sente tre caselle identiche e non sa quale spuntare. */
      var casella = riga.querySelector('input.chk');
      if (casella) casella.setAttribute('aria-label', T('Segna ' + refOra + ' come letto'));

      var frecce = riga.querySelectorAll('.nav button');
      for (var fe = 0; fe < frecce.length; fe++) {
        var freccia = frecce[fe];
        var testoFreccia = (freccia.textContent || '');
        if (testoFreccia.indexOf('\u203a') >= 0) freccia.setAttribute('aria-label', T('Lettura successiva'));
        else if (testoFreccia.indexOf('\u2039') >= 0) freccia.setAttribute('aria-label', T('Lettura precedente'));
      }
    }

    /* etichette (possono cambiare lingua) */
    pezzi.domanda.textContent = T('Dove sei arrivato?');
    campo.placeholder = T('es. Isaia 22:15');
    pezzi.dove.textContent = T('Adesso: ' + refOra + ' · lettura ' + (pos + 1) + ' di ' + piano.length);
    pezzi.scrivi.textContent = T('oppure scrivi il riferimento');
    pezzi.cerca.placeholder = T('Cerca un libro');

    box.__edit = edit;

    /* il campo si vede solo se lo chiedi: il modo normale è toccare */
    campo.hidden = !box.__scritto;
    pezzi.scrivi.setAttribute('aria-expanded', box.__scritto ? 'true' : 'false');

    /* se si sta scrivendo, quello che si scrive diventa la scelta */
    if (box.__digitato) {
      box.__digitato = false;
      var scritto = analizza(campo.value);
      if (scritto && scritto.b) {
        box.__sel = { b: scritto.b, c: scritto.c1 || null, v: scritto.v1 || null };
        box.__firma = '';
      }
    }

    var q = analizza(campo.value);
    box.__azione = null;
    box.__no = null;

    /* i tre passi raccontano quello che è stato toccato */
    var sel = box.__sel;
    var passi = pezzi.passi;
    function passa(chi, testo, sottoTesto, attivo, scelto, titolo) {
      var b = passi[chi];
      b.firstChild.nodeValue = testo;
      b.querySelector('span').textContent = sottoTesto;
      b.disabled = !attivo;
      b.setAttribute('aria-expanded', box.__aperto === chi ? 'true' : 'false');
      b.setAttribute('aria-label', titolo + ': ' + testo);
      b.classList.toggle('pieno', !!scelto);
    }
    passa('libro', sel.b || T('Scegli'), T('Libro'), true, !!sel.b, T('Libro'));
    passa('capitolo', sel.c ? String(sel.c) : '—', T('Capitolo'), !!sel.b, !!sel.c, T('Capitolo'));
    passa('versetto', sel.c ? (sel.v ? T('Fino al ' + sel.v) : T('Tutto')) : '—', T('Versetto'), !!sel.c, !!sel.v, T('Versetto'));

    var mappa = mappaLetto(s, n);
    disegnaLista(box, mappa);

    fai.disabled = true;
    fai.removeAttribute('aria-disabled');
    fai.textContent = T('Riprendi da qui');
    pezzi.chiede.hidden = true;
    pezzi.chiede.textContent = '';
    pezzi.no.hidden = true;
    pezzi.no.textContent = '';
    while (sotto.firstChild && sotto.firstChild !== pezzi.no) sotto.removeChild(sotto.firstChild);
    eco.className = 'aurora-salta-eco';

    if (q.vuoto) {
      eco.textContent = T('Tocca il libro, poi il capitolo, poi il versetto — oppure scrivi il riferimento.');
      return;
    }

    /* il libro scelto e il capitolo non ancora: non si salta a metà scelta */
    if (box.__mancaCapitolo) {
      eco.textContent = T('Tocca anche il capitolo.');
      return;
    }

    if (q.ignoto) {
      eco.textContent = T('Non conosco «' + campo.value.trim() + '».');
      eco.className = 'aurora-salta-eco err';
      /* qualche nome che comincia come quello scritto: si tocca e si riprova */
      var prime = senzaAccenti(campo.value).replace(/\s+/g, '').slice(0, 3);
      var simili = [];
      NOMI.forEach(function (o) { if (o.n.indexOf(prime) === 0 && simili.length < 3) simili.push(o.b); });
      simili.forEach(function (b) {
        var tasto = document.createElement('button');
        tasto.type = 'button';
        tasto.className = 'link';
        tasto.textContent = b;
        tasto.addEventListener('click', function () { campo.value = b; aggiorna(edit); campo.focus(); });
        sotto.appendChild(tasto);
      });
      return;
    }

    if (q.fuori) {
      var rif = campo.value.trim();
      eco.className = 'aurora-salta-eco err';
      eco.textContent = q.tipo === 'versetti'
        ? T('«' + rif + '» non esiste: ' + q.b + ' ' + q.capitolo + ' ha ' + q.max + ' versetti.')
        : T('«' + rif + '» non esiste: ' + q.b + ' ha ' + q.max + ' capitoli.');
      return;
    }

    if (q.rotto) {
      eco.className = 'aurora-salta-eco err';
      eco.textContent = T('Non riesco a leggere questo punto. Prova «Isaia 22» o «Galati 5:1».');
      return;
    }

    var idx = letturaDi(piano, q.b, q.c1, q.v1);
    if (idx < 0) {
      eco.className = 'aurora-salta-eco err';
      eco.textContent = T('«' + campo.value.trim() + '» non è in questo piano.');
      return;
    }

    var lettura = partiRef(piano[idx]) || { b: q.b, c1: q.c1, c2: q.c1, v1: null, v2: null };
    var dentro = idx === pos;

    /* --- siamo già su questa lettura: o si segna il pezzo letto, o niente --- */
    if (dentro) {
      if (lettura.c1 !== lettura.c2) {
        fai.textContent = T('Sei già qui');
        /* non spento, ma non disponibile: così il perché si può ascoltare */
        fai.disabled = false;
    fai.removeAttribute('aria-disabled');
        fai.setAttribute('aria-disabled', 'true');
        eco.textContent = T('In questa lettura il segnaposto è uno solo: per fermarti a metà serve una lettura di un capitolo.');
        return;
      }

      /* se il segnaposto è già a metà (dopo una divisione), la parte che
         resta comincia dal versetto della riga, non da 1 */
      var aMeta = rifOra && rifOra.b === lettura.b && rifOra.c1 === lettura.c1;
      var da = (aMeta && rifOra.v1) ? rifOra.v1 : (lettura.v1 || 1);
      var a = (aMeta && rifOra.v2) ? rifOra.v2 : (lettura.v2 || versiDelCapitolo(lettura.b, lettura.c1));

      if (!q.v1) {
        fai.textContent = T('Sei già qui');
        /* non spento, ma non disponibile: così il perché si può ascoltare */
        fai.disabled = false;
    fai.removeAttribute('aria-disabled');
        fai.setAttribute('aria-disabled', 'true');
        eco.textContent = T('Tocca il versetto dove ti sei fermato e segno la parte letta, riprendendo da quello dopo.');
        return;
      }
      if (q.v1 < da) {
        fai.textContent = T('Sei già qui');
        /* non spento, ma non disponibile: così il perché si può ascoltare */
        fai.disabled = false;
    fai.removeAttribute('aria-disabled');
        fai.setAttribute('aria-disabled', 'true');
        eco.textContent = T(q.b + ' ' + q.c1 + ':' + q.v1 + ' è prima di ' + q.b + ' ' + q.c1 + ':' + da + ': quel pezzo è già letto, non c’è niente da segnare.');
        return;
      }
      if (q.v1 >= a) {
        fai.textContent = T('Sei già qui');
        /* non spento, ma non disponibile: così il perché si può ascoltare */
        fai.disabled = false;
    fai.removeAttribute('aria-disabled');
        fai.setAttribute('aria-disabled', 'true');
        eco.textContent = T('Questo è l’ultimo versetto: qui non resta niente da riprendere. Se hai finito il capitolo, spunta la casella.');
        return;
      }

      fai.disabled = false;
    fai.removeAttribute('aria-disabled');
      fai.textContent = T('Segna e riprendi');
      eco.className = 'aurora-salta-eco ok';
      eco.textContent = T('Segno ' + q.b + ' ' + q.c1 + ':' + da + '-' + q.v1 + ' come letto · riprendi da ' +
        q.b + ' ' + q.c1 + ':' + (q.v1 + 1) + '.');
      box.__azione = { tipo: 'dividi', verso: q.v1, go: go, sv: sv, edit: edit };
      return;
    }

    /* --- altrove: si sposta il segnaposto, senza segnare --- */
    var testo = q.v1 ? q.b + ' ' + q.c1 + ':' + q.v1 : (q.c2 > q.c1 ? q.b + ' ' + q.c1 + '-' + q.c2 : q.b + ' ' + q.c1);
    var avanti = idx > pos;

    eco.textContent = T('«' + testo + '» · lettura ' + (idx + 1) + ' di ' + piano.length +
      '. Il segnaposto si sposta lì, senza segnare niente.');

    if (avanti) {
      /* saltare in avanti vuol dire lasciare indietro delle letture: si dice
         quante, e si chiede se è davvero così */
      var scarto = idx - pos;
      var daL = piano[pos + 1] || piano[pos];
      var aL = piano[idx - 1] || piano[pos];
      eco.textContent += ' ' + T(scarto === 1
        ? 'Salterai una lettura (' + daL + '): resta da leggere, non la segno io.'
        : 'Salterai ' + scarto + ' letture (' + daL + ' → ' + aL + '): restano da leggere, non le segno io.');
      eco.className = 'aurora-salta-eco attenzione';
      pezzi.chiede.hidden = false;
      pezzi.chiede.textContent = T('Hai letto tutto fino a qui?');
      pezzi.no.hidden = false;
      pezzi.no.textContent = T('No, mi sono fermato prima');
      box.__no = 'fermo';
    } else {
      /* tornare indietro non toglie niente, ma è bene saperlo */
      var quanto = quantoLetto(mappa, q.b, q.c1);
      if (quanto === 2) eco.textContent += ' ' + T(q.b + ' ' + q.c1 + ' è già letto: si torna indietro, non si cancella niente.');
      else if (quanto === 1) eco.textContent += ' ' + T('Di ' + q.b + ' ' + q.c1 + ' hai già letto una parte: il resto era rimasto indietro.');
      else eco.textContent += ' ' + T(q.b + ' ' + q.c1 + ' non risulta letto: nessuna spunta lo copre.');
      pezzi.chiede.hidden = false;
      pezzi.chiede.textContent = T('Ci torni indietro?');
      pezzi.no.hidden = false;
      pezzi.no.textContent = T('No, resta');
      box.__no = 'resta';
      fai.textContent = T('Torna a ' + testo);
    }

    fai.disabled = false;
    fai.removeAttribute('aria-disabled');
    if (!avanti) fai.textContent = T('Torna a ' + testo);
    else fai.textContent = T('Riprendi da qui');
    box.__azione = { tipo: 'salta', testo: testo, go: go, sv: sv, edit: edit };
    box.__posRif = refOra;
  }

  /* ------------------------------------------------------------------ l'azione */
  function esegui(box) {
    var az = box.__azione;
    if (!az) return;

    /* Un respiro prima di premere: React tiene il valore dei suoi campi nello
       stato, e lo aggiorna dopo l'evento. Premendo nello stesso istante, il
       pulsante leggerebbe il valore DI PRIMA (vuoto) e risponderebbe «scrivi
       un versetto tra 1 e 56». Un giro di orologio e il valore c'è. */
    if (az.tipo === 'dividi' && az.sv) {
      mettiValore(az.sv, az.verso);
      setTimeout(function () { premi(az.sv); }, 0);
    } else if (az.tipo === 'salta' && az.go) {
      mettiValore(az.go, az.testo);
      setTimeout(function () { premi(az.go); }, 0);
    }

    var pezzi = box.__pezzi;
    pezzi.campo.value = '';
    pezzi.fai.disabled = true;
    pezzi.fai.textContent = T('Riprendi da qui');
    pezzi.no.hidden = true;
    pezzi.chiede.hidden = true;
    while (pezzi.sotto.firstChild && pezzi.sotto.firstChild !== pezzi.no) pezzi.sotto.removeChild(pezzi.sotto.firstChild);
    box.__sel = { b: null, c: null, v: null };
    box.__aperto = null;
    box.__firma = '';
    box.__azione = null;
    box.__no = null;
    box.__mancaCapitolo = false;
  }

  /* «No» alle due domande: o si resta dov'eravamo, o si apre il versetto della
     lettura di oggi per dire dove ci si è fermati davvero. */
  function annulla(box, edit) {
    if (box.__no === 'fermo') {
      var p = box.__posRif ? partiRef(box.__posRif) : null;
      box.__sel = p ? { b: p.b, c: p.c1, v: null } : { b: null, c: null, v: null };
      box.__pezzi.campo.value = testoScelto(box.__sel);
      box.__aperto = (p && p.c1 === p.c2) ? 'versetto' : null;
    } else {
      box.__sel = { b: null, c: null, v: null };
      box.__pezzi.campo.value = '';
      box.__aperto = null;
    }
    box.__digitato = false;
    box.__mancaCapitolo = false;
    box.__firma = '';
    aggiorna(edit);
  }

  /* collega gli ascoltatori una volta sola, alla creazione */
  function collega(box, edit) {
    var campo = box.__pezzi.campo;
    /* Mentre scrivi, la riga di anteprima cambia a ogni tasto. Per gli occhi
       va bene; per un lettore di schermo è un fiume di frasi a metà («Non
       conosco la I», «Non conosco la Is»). Lo stato si aggiorna subito, il
       disegno aspetta che ti fermi un attimo. */
    var attesaScrittura = null;
    campo.addEventListener('input', function () {
      box.__digitato = true;
      box.__mancaCapitolo = false;
      box.__aperto = null;
      box.__firma = '';
      clearTimeout(attesaScrittura);
      attesaScrittura = setTimeout(function () { aggiorna(edit); }, 420);
    });
    campo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !box.__pezzi.fai.disabled) { e.preventDefault(); esegui(box); }
    });
    box.__pezzi.fai.addEventListener('click', function () { esegui(box); });
    box.__pezzi.no.addEventListener('click', function () { annulla(box, edit); });
  }

  /* ------------------------------------------------------------------ il giro */
  function sistema(daCapo) {
    var pannelli = document.querySelectorAll('.edit');
    for (var i = 0; i < pannelli.length; i++) {
      var edit = pannelli[i];
      var go = edit.querySelector('input[id^="go"]');
      if (!go) continue;
      if (daCapo) {
        var vecchio = edit.querySelector('.aurora-salta');
        if (vecchio) vecchio.remove();
      }
      aggiorna(edit);
      var box = edit.querySelector('.aurora-salta');
      if (box && !box.__collegato) { box.__collegato = true; collega(box, edit); }
    }
  }

  var inCoda = 0;
  function fraPoco(ms) {
    if (inCoda) return;
    inCoda = setTimeout(function () { inCoda = 0; sistema(false); }, ms || 120);
  }

  function avvia() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }
    sistema(false);

    if (window.MutationObserver) {
      var o = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          var n = recs[i].target;
          var dentro = n.nodeType === 1 ? n : n.parentElement;
          if (dentro && dentro.closest && dentro.closest('.aurora-salta')) continue;
          fraPoco();
          return;
        }
      });
      o.observe(document.body, { childList: true, subtree: true });
    }

    /* il pannello si apre e si chiude con un clic: si ricontrolla subito dopo */
    document.addEventListener('click', function () { fraPoco(160); }, true);
    document.addEventListener('change', function () { fraPoco(160); }, true);

    /* la lingua cambia: le nostre frasi vanno riscritte, e i nomi dei libri
       vanno imparati di nuovo nella lingua nuova (altrimenti chi scrive
       «Jesaja 22» non verrebbe capito) */
    document.addEventListener('aurora-lingua', function () { imparaNomi(); sistema(true); });

    /* il piano cambia anche senza toccare il DOM (localStorage): ogni tanto */
    setInterval(function () { if (!document.hidden) sistema(false); }, 1500);

    window.addEventListener('load', function () { sistema(true); });
    setTimeout(function () { sistema(true); }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* sportello per il collaudo */
  window.AuroraSalta = {
    analizza: analizza,
    letturaDi: letturaDi,
    partiRef: partiRef,
    sistema: function () { sistema(true); }
  };
})();
