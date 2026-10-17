/* ============================================================================
   AURORA GIRI — quante volte hai letto, e a che punto sei nella rilettura
   ============================================================================
   Due cose che l'app non dice, e che servono a chi rilegge per studiare.

   1. NELLA RILETTURA I PALLINI RESTANO VERDI. I pallini della scheda Libri
      mostrano la PRIMA lettura: quando parte un «giro» nuovo (il pulsante
      «rileggi» sul libro) i capitoli riletti non si distinguono più da quelli
      letti una volta sola, quindi non si vede a che punto si è del giro. Qui i
      capitoli del giro in corso prendono un anello, e l'intestazione del libro
      dice «· nel giro 12/50».

   2. QUANTE VOLTE. L'app tiene il numero del giro raggiunto (rr[libro].n) e i
      capitoli del giro in corso (rr[libro].items), ma azzera gli items a ogni
      giro nuovo: il dettaglio di QUALE capitolo è stato letto quante volte non
      esiste da nessuna parte. Qui si tiene il conto: ogni volta che un capitolo
      passa da «non letto» a «letto» (prima lettura, rilettura, o riletto dopo
      aver annullato) è una lettura in più, con la data.
      Il conto sta in `aut_giri`, una chiave MIA, fuori dal documento del piano:
      la sincronizzazione non se ne accorge e non c'è niente da migrare.

   Onestà, per iscritto: i giri fatti PRIMA che questa riga esistesse non si
   possono ricostruire — l'app non li ha conservati. Per questo, sui libri già
   riletti, la card offre un pulsante per aggiungerli tu («Aggiungi i giri fatti
   prima»): è una tua dichiarazione, non una mia ipotesi.
   ============================================================================ */

(function () {
  'use strict';

  var ID_CARD = 'aurora-giri';
  var CHIAVE = 'aut_giri';          // il mio conto
  var CHIAVE_PIANO = 'aut_local';
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio',
    'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function piano() {
    try { return JSON.parse(leggi(CHIAVE_PIANO) || 'null'); } catch (e) { return null; }
  }

  function conto() {
    var c = null;
    try { c = JSON.parse(leggi(CHIAVE) || 'null'); } catch (e) { c = null; }
    if (!c || typeof c !== 'object') c = {};
    if (!c.letture || typeof c.letture !== 'object') c.letture = {};
    if (!c.visti || typeof c.visti !== 'object') c.visti = {};
    if (!c.giri || typeof c.giri !== 'object') c.giri = {};
    if (!c.aggiunti || typeof c.aggiunti !== 'object') c.aggiunti = {};
    return c;
  }

  function salva(c) { scrivi(CHIAVE, JSON.stringify(c)); }

  /* L'insieme dei capitoli verdi, come testo ordinato: due fotografie uguali
     danno la stessa chiave. */
  var ultimaChiaveVerdi = null;      // l'ultima fotografia guardata
  var chiaveConfermata = null;       // l'ultima fotografia applicata al conto
  var palliniInAttesa = false;
  var attesaTimer = 0;

  function chiaveVerdi(pal) {
    return Object.keys(pal.letti).sort().join('|');
  }

  function riprovaPallini() {
    if (attesaTimer) return;
    attesaTimer = setTimeout(function () {
      attesaTimer = 0;
      if (palliniInAttesa) aggiorna(false);
    }, 700);
  }

  function oggi() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function dataInItaliano(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return Number(p[2]) + ' ' + MESI[Number(p[1]) - 1] + ' ' + p[0];
  }

  /* ---------------------------------------------------- la pagina, letta vera ---
     Da quando l'interfaccia si traduce, il testo disegnato può essere in
     inglese o tedesco; i dati dell'app invece sono italiani e tali restano.
     Qui si legge l'originale: «Genesi 1» anche quando sullo schermo c'è
     «Genesis 1». Così i conti dei giri e delle riletture non cambiano quando
     si cambia lingua. Nessuna scrittura: si legge e basta. */
  function originale(el, nome) {
    try {
      var L = window.AuroraLingua;
      if (L && L.attributo) return L.attributo(el, nome) || '';
    } catch (e) {}
    return (el && el.getAttribute ? el.getAttribute(nome) : '') || '';
  }

  function italianoNodo(nodo) {
    try {
      var L = window.AuroraLingua;
      if (L && L.italiano) return L.italiano(nodo) || '';
    } catch (e) {}
    return (nodo && nodo.textContent) || '';
  }

  /* --------------------------------------------------- lo stato dell'app, letto */

  /* I pallini: l'app ha già calcolato tutto (f = capitolo intero letto,
     p = in parte). Si legge la sua verità invece di rifarla — così non può
     divergere. Serve anche il numero di capitoli di ogni libro. */
  function pallini() {
    var out = { letti: {}, parziali: {}, capitoli: {} };
    var celle = document.querySelectorAll('.ch[aria-label]');
    for (var i = 0; i < celle.length; i++) {
      var et = originale(celle[i], 'aria-label');
      var g = et.match(/^(.+?) (\d+)$/);
      if (!g) continue;
      var libro = g[1];
      if (!out.capitoli[libro]) out.capitoli[libro] = 0;
      out.capitoli[libro]++;
      if (celle[i].classList.contains('f')) out.letti[et] = 1;
      else if (celle[i].classList.contains('p')) out.parziali[et] = 1;
    }
    return out;
  }

  /* Il giro in corso: rr[libro].items contiene i capitoli segnati in questo giro,
     oppure il nome del libro intero (tutti i suoi capitoli). */
  function giroCorso(p, capitoli) {
    var out = {};
    var rr = (p && p.rr) || {};
    for (var libro in rr) {
      if (!Object.prototype.hasOwnProperty.call(rr, libro)) continue;
      var items = (rr[libro] && rr[libro].items) || [];
      for (var i = 0; i < items.length; i++) {
        var e = items[i];
        var g = e.match(/^(.+?) (\d+)$/);
        if (g) { out[g[1] + ' ' + Number(g[2])] = 1; continue; }
        if (e === libro) {
          var n = capitoli[libro] || 0;
          for (var c = 1; c <= n; c++) out[libro + ' ' + c] = 1;
        }
      }
    }
    return out;
  }

  /* ------------------------------------------------------------------ il conto */

  function aggiungiLettura(c, et) {
    var s = c.letture[et] || { v: 0, u: null, d: [] };
    s.v += 1;
    s.u = oggi();
    s.d = [s.u].concat(s.d || []).slice(0, 12);
    c.letture[et] = s;
    return s;
  }

  /* Il conteggio, in due tempi.

     1. IL PALLINO VERDE (la prima lettura). Un capitolo che passa da bianco a
        verde è una lettura in più. Un capitolo che si sbianca e poi torna verde
        — «annulla lettura» e poi segnato di nuovo — è un'altra lettura ancora:
        è successo davvero, quindi si conta.

     2. IL GIRO. I capitoli segnati nel giro in corso contano una volta PER
        GIRO, non una volta per ogni passaggio dell'osservatore: si tiene il
        numero del giro in cui quel capitolo è stato contato (`c.giri[et]`) e
        non si conta due volte lo stesso giro. Così segnare/annullare/segnare
        non gonfia il conto, e un giro nuovo conta di nuovo.

     L'app non conserva i giri passati (li azzera a ogni giro nuovo), quindi da
     sola non si può sapere quante volte un capitolo è stato riletto: il conto
     comincia da qui, e i giri già fatti li può dichiarare la persona. */
  function aggiornaConto() {
    var p = piano();
    if (!p) return null;
    var pal = pallini();
    var giro = giroCorso(p, pal.capitoli);
    var rr = p.rr || {};
    var c = conto();
    var nuove = [];
    var et;

    /* 1. i pallini verdi — solo se la scheda Libri c'è davvero.

       Fuori da quella scheda le celle non esistono, e aggiornare `visti` con un
       elenco vuoto farebbe ricontare da capo tutti i pallini verdi al ritorno:
       letture gonfiate senza che nessuno abbia letto niente. Se non c'è
       nessuna cella, questo pezzo non si tocca. */
    if (Object.keys(pal.capitoli).length) {
      /* Una fotografia sola non basta: React ridisegna la scheda Libri e per un
         istante le celle possono esserci senza le loro classi. Contare quella
         fotografia vorrebbe dire «nessun capitolo letto», e al ridisegno dopo
         sarebbero tutti letti di nuovo — letture inventate. Quindi si conta solo
         quando due fotografie di fila dicono la stessa cosa. */
      var chiave = chiaveVerdi(pal);
      if (chiave !== ultimaChiaveVerdi) {
        ultimaChiaveVerdi = chiave;
        palliniInAttesa = true;
        riprovaPallini();
      } else if (chiave !== chiaveConfermata) {
        var adesso = {};
        for (et in pal.letti) if (pal.letti[et]) adesso[et] = 1;
        for (et in adesso) {
          if (c.visti[et]) continue;
          aggiungiLettura(c, et);
          nuove.push(et);
        }
        c.visti = adesso;
        chiaveConfermata = chiave;
        palliniInAttesa = false;
      }
    } else if (palliniInAttesa) {
      /* se ne siamo usciti a metà, la fotografia non vale più */
      palliniInAttesa = false;
      ultimaChiaveVerdi = null;
    }

    /* 2. i capitoli del giro in corso */
    for (et in giro) {
      if (!giro[et]) continue;
      var libro = et.replace(/ \d+$/, '');
      var lap = Number((rr[libro] && rr[libro].n) || 0) + 1;
      if (c.giri[et] === lap) continue;
      aggiungiLettura(c, et);
      c.giri[et] = lap;
      nuove.push(et);
    }

    salva(c);
    return { conto: c, pallini: pal, giro: giro, nuove: nuove, piano: p };
  }

  /* ------------------------------------------------- le decorazioni nella scheda */

  function segna() {
    var p = piano();
    if (!p) return;
    var c = conto();
    var pal = pallini();
    if (!Object.keys(pal.capitoli).length) return;   // non siamo nella scheda Libri
    var giro = giroCorso(p, pal.capitoli);

    /* 1. i capitoli del giro in corso: un anello, così si vede che sono di questo giro */
    var celle = document.querySelectorAll('.ch[aria-label]');
    for (var i = 0; i < celle.length; i++) {
      var b = celle[i];
      var et = originale(b, 'aria-label');
      var nelGiro = !!giro[et];
      if (nelGiro !== b.classList.contains('aurora-giro')) b.classList.toggle('aurora-giro', nelGiro);
      var s = c.letture[et];
      var volte = s ? s.v : 0;
      if (volte >= 2) {
        if (b.getAttribute('data-aurora-volte') !== String(volte)) {
          b.setAttribute('data-aurora-volte', String(volte));
          /* solo il numero: la data dentro un attributo non si potrebbe
             tradurre (è un pezzo solo), e sta già nella card */
          b.setAttribute('title', 'letto ' + volte + ' volte');
        }
      } else if (b.hasAttribute('data-aurora-volte')) {
        b.removeAttribute('data-aurora-volte');
        b.removeAttribute('title');
      }
    }

    /* 2. l'intestazione di ogni libro: a che punto è il giro in corso */
    var rr = p.rr || {};
    var testate = document.querySelectorAll('.book .bh');
    for (var k = 0; k < testate.length; k++) {
      var bh = testate[k];
      var suo = bh.querySelector('b');
      if (!suo) continue;
      var nome = italianoNodo(suo).split('·')[0].trim();
      var r = rr[nome];
      var libroEl = (bh.closest ? bh.closest('.book') : bh.parentNode) || bh.parentNode;
      var mio = libroEl ? libroEl.querySelector('.aurora-giro-riga') : null;
      /* Il giro conta anche quando è appena cominciato e non hai segnato
         niente: è proprio lì che serve vedere «0/7 nel giro», altrimenti
         sembra che il pulsante non abbia fatto nulla. */
      if (!r) {
        if (mio && mio.parentNode) mio.parentNode.removeChild(mio);
        continue;
      }
      var fatti = 0;
      for (var j = 1; j <= (pal.capitoli[nome] || 0); j++) if (giro[nome + ' ' + j]) fatti++;
      var totale = pal.capitoli[nome] || 0;
      /* «giro 2» lo scrive già l'app accanto al nome del libro: qui serve
         solo il punto a cui sei, il pezzo che l'app non dà. */
      var testo = fatti + '/' + totale + ' nel giro';
      if (!mio) {
        mio = document.createElement('i');
        mio.className = 'aurora-giro-riga';
        /* sotto i pallini, non nella riga del titolo: lì «Lettura
           completata» e «7/7» non lasciano spazio, e su un telefono
           finirebbe su tre righe storte. */
        var chs = libroEl && libroEl.querySelector('.chs');
        if (chs && chs.parentNode) chs.parentNode.insertBefore(mio, chs.nextSibling);
        else bh.appendChild(mio);
      }
      if (mio.textContent !== testo) mio.textContent = testo;
    }
  }

  /* -------------------------------------------------------------------- la card */

  function pezzo(tag, testo, classe) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo != null) e.textContent = testo;
    return e;
  }

  function cardCon(chiave) {
    var voluti = [chiave];
    var D = window.AURORA_LINGUE;
    var v = D && D.diz ? D.diz[chiave] : null;
    if (v) voluti = voluti.concat(v.split('|'));
    voluti = voluti.map(function (t) { return t.trim().toLowerCase(); });
    var cards = document.querySelectorAll('main .card');
    for (var i = 0; i < cards.length; i++) {
      var h = cards[i].querySelector('h2');
      if (!h) continue;
      if (voluti.indexOf((h.textContent || '').trim().toLowerCase()) >= 0) return cards[i];
    }
    return null;
  }

  var FR_TITOLO = 'Quante volte hai letto';
  var FR_VUOTO = 'Ancora nessuna rilettura: quando rileggi un capitolo, o quando parti con un giro nuovo, il conto si aggiorna da solo.';
  var FR_TOTALE = 'letture oltre la prima';
  var FR_PIU = 'capitoli letti più di una volta';
  var FR_IN_CORSO = 'In rilettura adesso';
  var FR_NOTA = 'Il conto comincia da quando questa card esiste: i giri fatti prima non si possono ricostruire, ma puoi aggiungerli tu.';
  var FR_AGGIUNGI = 'Aggiungi i giri fatti prima';
  var FR_AZZERA = 'Azzera il conto delle letture';

  function costruisciCard() {
    var p = piano();
    var c = conto();
    var pal = pallini();
    var giro = p ? giroCorso(p, pal.capitoli) : {};

    var card = pezzo('div', null, 'card');
    card.id = ID_CARD;
    card.appendChild(pezzo('h2', FR_TITOLO));

    /* i numeri: quante letture oltre la prima, e su quanti capitoli */
    var extra = 0, ripetuti = 0, et;
    for (et in c.letture) {
      var v = c.letture[et].v;
      if (v > 1) { ripetuti++; extra += v - 1; }
    }
    if (!extra && !ripetuti) {
      card.appendChild(pezzo('p', FR_VUOTO, 'msg'));
    } else {
      var riga = pezzo('div', null, 'aurora-giri-numeri');
      var n1 = pezzo('div', null, 'aurora-giri-numero');
      n1.appendChild(pezzo('b', String(extra)));
      n1.appendChild(pezzo('span', FR_TOTALE));
      var n2 = pezzo('div', null, 'aurora-giri-numero');
      n2.appendChild(pezzo('b', String(ripetuti)));
      n2.appendChild(pezzo('span', FR_PIU));
      riga.appendChild(n1);
      riga.appendChild(n2);
      card.appendChild(riga);
    }

    /* i giri in corso, con a che punto sono */
    var rr = (p && p.rr) || {};
    var inCorso = [];
    for (var libro in rr) {
      if (!Object.prototype.hasOwnProperty.call(rr, libro)) continue;
      if (!rr[libro]) continue;
      var fatti = 0;
      for (var j = 1; j <= (pal.capitoli[libro] || 0); j++) if (giro[libro + ' ' + j]) fatti++;
      inCorso.push({ libro: libro, giro: Number(rr[libro].n || 0) + 1, fatti: fatti, totale: pal.capitoli[libro] || 0 });
    }
    if (inCorso.length) {
      card.appendChild(pezzo('p', FR_IN_CORSO, 'msg'));
      var elenco = pezzo('div', null, 'aurora-giri-elenco');
      inCorso.forEach(function (g) {
        var r = pezzo('div', null, 'aurora-giri-riga');
        r.appendChild(pezzo('b', g.libro));
        r.appendChild(pezzo('span', ' · giro ' + g.giro + ' · ' + g.fatti + '/' + g.totale + ' nel giro'));
        elenco.appendChild(r);
      });
      /* le righe qui sopra hanno numeri dentro una frase: il dizionario le
         riconosce con un modello (vedi aurora-lingue.js) */
      card.appendChild(elenco);
    }

    /* i capitoli letti più di una volta, quelli con più letture in cima */
    var ripetutiElenco = [];
    for (et in c.letture) {
      if (c.letture[et].v >= 2) ripetutiElenco.push({ et: et, v: c.letture[et].v, u: c.letture[et].u });
    }
    ripetutiElenco.sort(function (a, b) { return b.v - a.v || (a.et < b.et ? -1 : 1); });
    if (ripetutiElenco.length) {
      var lista = pezzo('div', null, 'aurora-giri-elenco');
      ripetutiElenco.slice(0, 24).forEach(function (x) {
        var r = pezzo('div', null, 'aurora-giri-riga');
        r.appendChild(pezzo('b', x.et));
        r.appendChild(pezzo('span', ' · ' + x.v + ' volte · '));
        /* la data in un nodo suo: così il nome del mese lo traduce il
           dizionario come per tutte le altre date dell'app */
        r.appendChild(pezzo('span', 'ultima '));
        r.appendChild(pezzo('b', dataInItaliano(x.u)));
        lista.appendChild(r);
      });
      card.appendChild(lista);
      if (ripetutiElenco.length > 24) {
        card.appendChild(pezzo('p', 'e altri ' + (ripetutiElenco.length - 24) + ' capitoli, in fondo alla lista.', 'msg aurora-giri-altri'));
      }
    }

    /* i giri che l'app aveva già fatto prima di questo conto: li dichiara la persona */
    var daAggiungere = [];
    for (var l2 in rr) {
      if (!Object.prototype.hasOwnProperty.call(rr, l2)) continue;
      var n2 = Number((rr[l2] && rr[l2].n) || 0);
      if (n2 > 0 && !c.aggiunti[l2]) daAggiungere.push({ libro: l2, n: n2 });
    }
    if (daAggiungere.length) {
      card.appendChild(pezzo('p', FR_NOTA, 'msg'));
      daAggiungere.slice(0, 8).forEach(function (x) {
        var b = pezzo('button', FR_AGGIUNGI.replace(/prima$/, 'prima (' + x.n + ')'), 'chip aurora-giri-tasto');
        b.type = 'button';
        b.setAttribute('data-libro', x.libro);
        b.addEventListener('click', function () { aggiungiGiri(x.libro, x.n); });
        card.appendChild(b);
      });
    }

    var azzera = pezzo('button', FR_AZZERA, 'chip aurora-giri-tasto');
    azzera.type = 'button';
    azzera.addEventListener('click', function () {
      var nome = window.confirm('Azzerare il conto delle letture? I progressi del piano non si toccano.');
      if (!nome) return;
      var vuoto = { letture: {}, visti: {}, giri: {}, aggiunti: {} };
      salva(vuoto);
      aggiornaConto();
      aggiorna(true);
    });
    card.appendChild(azzera);
    return card;
  }

  /* Dichiara i giri fatti prima di questo conto: si aggiungono solo ai capitoli
     già letti, e solo una volta per libro. */
  function aggiungiGiri(libro, n) {
    var c = conto();
    if (c.aggiunti[libro]) return;
    var p = piano();
    var pal = pallini();
    var giro = giroCorso(p, pal.capitoli);
    var letti = {};
    var et;
    for (et in pal.letti) if (pal.letti[et]) letti[et] = 1;
    for (et in giro) if (giro[et]) letti[et] = 1;
    for (et in letti) {
      var g = et.match(/^(.+?) (\d+)$/);
      if (!g || g[1] !== libro) continue;
      var s = c.letture[et] || { v: 1, u: oggi(), d: [] };
      s.v += n;
      c.letture[et] = s;
    }
    c.aggiunti[libro] = n;
    salva(c);
    aggiorna(true);
  }

  /* -------------------------------------------------------------------- il giro */

  var occupato = false;
  var ultimoGrezzo = null;
  var ultimaFirmaPallini = null;
  var firmaCard = null;

  /* Il segno dei pallini: quanti sono verdi, quanti a metà, quante celle ci sono.
     Serve perché cambiare scheda NON cambia il piano salvato: senza questo, i
     pallini verdi che si vedono per la prima volta nella scheda Libri non
     verrebbero mai contati (lo stato è lo stesso di prima, solo che prima non
     si poteva guardare). Basta il numero: ogni passaggio bianco↔verde lo cambia. */
  function firmaPallini() {
    return document.querySelectorAll('.ch.f').length + '|' +
      document.querySelectorAll('.ch.p').length + '|' +
      document.querySelectorAll('.ch[aria-label]').length;
  }

  function firma() {
    var c = conto();
    var p = piano();
    var rr = (p && p.rr) || {};
    var n = 0, t = '';
    for (var et in c.letture) { n++; t += et + c.letture[et].v; }
    var g = '';
    for (var l in rr) { if (rr[l] && rr[l].items) g += l + rr[l].n + rr[l].items.length; }
    return n + '|' + g + '|' + t.length;
  }

  function aggiorna(forza) {
    if (occupato) return;
    occupato = true;
    try {
      var grezzo = leggi(CHIAVE_PIANO);
      var cambiato = grezzo !== ultimoGrezzo;
      ultimoGrezzo = grezzo;
      var pall = firmaPallini();
      var palliniCambiati = pall !== ultimaFirmaPallini;
      ultimaFirmaPallini = pall;

      if (cambiato || forza || palliniCambiati || palliniInAttesa) aggiornaConto();
      segna();

      /* la card: solo nelle Impostazioni, e solo se c'è qualcosa di nuovo da dire */
      var dove = cardCon('I tuoi dati') || cardCon('File di backup');
      var mia = document.getElementById(ID_CARD);
      if (!dove) {
        if (mia && mia.parentElement) mia.parentElement.removeChild(mia);
        firmaCard = null;
        return;
      }
      var seg = firma();
      if (!mia) {
        mia = costruisciCard();
        var dopo = document.getElementById('aurora-dati');
        var ancoraggio = dopo && dopo.parentElement === dove.parentElement ? dopo : dove;
        ancoraggio.parentElement.insertBefore(mia, ancoraggio.nextElementSibling);
        firmaCard = seg;
      } else if (seg !== firmaCard) {
        mia.parentElement.replaceChild(costruisciCard(), mia);
        firmaCard = seg;
      }
    } finally {
      occupato = false;
    }
  }

  var inCoda = 0;
  function fraPoco(ms) {
    if (inCoda) return;
    inCoda = setTimeout(function () { inCoda = 0; aggiorna(false); }, ms || 220);
  }

  function avvia() {
    if (!document.body) return;
    aggiorna(true);

    document.addEventListener('click', function () { fraPoco(500); }, true);
    document.addEventListener('change', function () { fraPoco(500); }, true);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) aggiorna(false); });

    /* Lo stato dell'app cambia senza avvisare nessuno (è localStorage): si
       guarda ogni tanto, e comunque a ogni ridisegno della pagina. Non si
       rilegge il piano se la stringa non è cambiata. */
    setInterval(function () { if (!document.hidden) aggiorna(false); }, 1500);

    if (window.MutationObserver) {
      var o = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          var n = recs[i].target;
          var dentro = n.nodeType === 1 ? n : n.parentElement;
          if (dentro && dentro.closest && dentro.closest('#' + ID_CARD + ',.aurora-giro')) continue;
          fraPoco(260);
          return;
        }
      });
      o.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', function () { aggiorna(true); });
    setTimeout(function () { aggiorna(true); }, 400);
    setTimeout(function () { aggiorna(false); }, 1600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  window.AuroraGiri = {
    aggiorna: function () { aggiorna(true); },
    conto: conto,
    pallini: pallini,
    giroCorso: function () { var p = piano(); return p ? giroCorso(p, pallini().capitoli) : {}; }
  };
})();
