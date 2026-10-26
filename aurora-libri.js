/* ============================================================================
   AURORA LIBRI — «che cosa legge ogni momento»
   ============================================================================
   IL PROBLEMA, detto come lo dice chi legge: a mezzodì serve una lettura
   CORTA. Il piano dell'app, invece, divide la Bibbia in parti uguali per
   numero di giorni: a mezzodì tocca un capitolo intero come ad Aurora, e se
   quel capitolo è Isaia 40 o Genesi 24 non è una pausa di mezzogiorno.

   In Impostazioni c'è già una scelta (dentro «Ritmo del piano», chiusa e
   marcata «facoltativo»), ma muove solo l'INIZIO di una lettura: i libri
   cambiano padrone in blocco, e per avere a mezzodì i Salmi e i Vangeli non
   basta — il meccanismo glieli accoda a tutto il Nuovo Testamento, e la
   lettura diventa più lunga invece che più corta. Provato: scegliendo Giobbe
   su Mezzodì, Mezzodì diventa poetici + tutto il Nuovo Testamento.

   QUI SI FA UN'ALTRA COSA, e va detta chiara: si costruisce un piano nuovo
   libro per libro e passo per passo, e lo si scrive nella chiave che l'app
   legge all'avvio (`aut_local`, lo stesso documento che salva lei). L'app non
   viene toccata: alla riapertura trova un piano perfettamente valido e lo
   disegna come sempre — schede Oggi, Libri, Serie, Piano, sincronizzazione,
   tutto. Cambia solo il contenuto delle letture.

   PER CHI È, E QUANTO VALE. La card è per tutti (il modulo si carica sempre,
   non è dietro `?aurora-prova=1`) e si adatta al piano che uno ha: una riga
   per ogni lettura della giornata, una sola come cinque. I nomi sono quelli
   dell'app (Giornata; Mattino e Sera; Aurora, Mezzodì e Tramonto; con
   Pomeriggio; con Pomeriggio e Mattino), quindi la card parla la stessa lingua
   delle schede. Ogni lettura si compone in due modi, che si possono mescolare:
     · le sei parti della Bibbia come pastiglie (Pentateuco, Storici, Poetici,
       Profeti, Vangeli e Atti, Lettere e Apocalisse) — il gesto grosso;
     · il singolo libro, uno per uno, se una parte non va bene così com'è:
       accendere un libro qui lo spegne nelle altre letture, perché un libro si
       legge una volta sola e il piano resta di 365 giorni.
     · e poi COME si alternano, e QUANTI alla volta. «Un libro per volta» è
       quello che fa l'app: si finisce Genesi e si passa all'Esodo, e fino ad
       allora niente altro. «A giro» invece mette in ballo più libri insieme, e
       qui si dice quanti: due, tre, o tutti. Con «due» si legge un salmo e un
       passo di Vangelo a giorni alterni, e quando il salmo è finito entra il
       libro successivo al suo posto — non si aspettano centocinquanta giorni
       per vedere il Vangelo dopo i Salmi. È questo che fa respirare la lettura
       di metà giornata.

   TRE COSE CHE CONTA SAPERE, e che la card dice a parole sue:
     1. Se il piano ha una lettura chiamata «Mezzodì», quella è la lettura
        CORTA: i suoi passi si fermano a una ventina di versetti invece che a
        un capitolo. È questo che la rende leggera, non solo la scelta dei
        libri. Le altre restano a capitolo.
     2. Niente si perde: i passi già letti restano letti, per etichetta
        («Salmo 23» resta «Salmo 23»). Se un passo che avevi letto non esiste
        più nel piano nuovo (per esempio «Genesi 41» diviso in due), finisce
        fra i «già letti», che l'app conta come fatti.
     3. «Le parti di sempre», o il pulsante «Torna com'era», rimettono le cose
        a posto: prima di scrivere la prima volta si tiene da parte una copia
        esatta del piano precedente.

   Perché un modulo a parte e non una modifica all'app: il sito è un pacchetto
   già compilato, senza sorgente. Tutto quello che si può aggiungere passa da
   qui — un modulo che legge la pagina, si mette accanto alle sue card e
   scrive solo dati che l'app conosce già.
   ============================================================================ */

(function () {
  'use strict';

  var ID = 'aurora-libri';
  var CHIAVE_PIANO = 'aut_local';
  var CHIAVE_PRIMA = 'aut_libri_prima';     // il piano com'era prima del primo cambio
  var CHIAVE_MSG = 'aut_libri_msg';         // il messaggio da mostrare dopo il ricaricamento
  var CHIAVE_SNAPS = 'aut_local_snaps';     // le copie giornaliere dell'app
  var CHIAVE_SCELTA = 'aut_libri_scelta';   // la scelta fatta (libri, partenze, alternanza)

  var D = window.AURORA_LIBRI_DATI;
  if (!D || !D.libri || !D.versi) return;   // senza i dati non si costruisce niente

  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function togli(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function piano() {
    try { return JSON.parse(leggi(CHIAVE_PIANO) || 'null'); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------- i libri, per parti */

  var SEZIONI = D.sezioni || [];

  function sezione(id) {
    for (var i = 0; i < SEZIONI.length; i++) if (SEZIONI[i].id === id) return SEZIONI[i];
    return null;
  }

  /* i libri di una parte, nell'ordine della Bibbia */
  function libriDi(id) {
    var s = sezione(id);
    if (!s) return [];
    var a = D.libri.indexOf(s.da), b = D.libri.indexOf(s.a);
    if (a < 0 || b < a) return [];
    return D.libri.slice(a, b + 1);
  }

  function unisciLibri(ids) {
    var dentro = {};
    for (var i = 0; i < ids.length; i++) {
      var libri = libriDi(ids[i]);
      for (var k = 0; k < libri.length; k++) dentro[libri[k]] = 1;
    }
    return ordinati(Object.keys(dentro));
  }

  /* sempre nell'ordine della Bibbia: due libri che si toccano hanno senso solo
     così, e la tendina «comincia da» si legge come un indice */
  function ordinati(libri) {
    var fuori = [], visti = {};
    for (var i = 0; i < D.libri.length; i++) {
      if (libri.indexOf(D.libri[i]) >= 0 && !visti[D.libri[i]]) { visti[D.libri[i]] = 1; fuori.push(D.libri[i]); }
    }
    return fuori;
  }

  /* --------------------------------------------------------- i passi di un libro ---
     Un passo è un capitolo; i capitoli lunghi si spezzano in parti uguali, così
     nessun giorno porta un mattone. Il tetto cambia da lettura a lettura: è
     quello che fa della lettura di mezzodì la lettura corta. */

  function passiLibro(libro, tetto) {
    var fuori = [];
    var versi = D.versi[libro] || [];
    for (var c = 1; c <= versi.length; c++) {
      var v = versi[c - 1];
      if (!v) continue;
      if (v <= tetto) { fuori.push(libro + ' ' + c); continue; }
      var parti = Math.ceil(v / tetto);
      var base = Math.floor(v / parti);
      var resto = v % parti;
      var v1 = 1;
      for (var k = 0; k < parti; k++) {
        var quanto = base + (k < resto ? 1 : 0);
        var v2 = v1 + quanto - 1;
        fuori.push(libro + ' ' + c + ':' + v1 + '-' + v2);
        v1 = v2 + 1;
      }
    }
    return fuori;
  }

  /* Versetti al massimo per passo. La lettura di mezzodì sta a venti, cioè un
     salmo o mezzo capitolo di Vangelo: è questo che la rende la lettura corta.
     Le altre restano vicine al passo dell'app (un capitolo, e si spezza solo il
     capitolo davvero lungo). Quale sia «mezzodì» lo dice il suo NOME, non la
     sua posizione: l'app la chiama così a metà giornata comunque sia fatto il
     piano, con tre letture come con quattro o cinque. */
  var TETTO_CORTO = 20;
  var TETTO_LUNGO = 50;

  /* I nomi delle letture, presi dall'app: sono gli stessi che compaiono nelle
     schede Oggi e Piano. Con il piano «orig» (due letture) l'app li chiama
     Aurora e Tramonto, non Mattino e Sera: anche qui. */
  var NOMI = {
    1: ['Giornata'],
    2: ['Mattino', 'Sera'],
    3: ['Aurora', 'Mezzodì', 'Tramonto'],
    4: ['Aurora', 'Mezzodì', 'Pomeriggio', 'Tramonto'],
    5: ['Aurora', 'Mattino', 'Mezzodì', 'Pomeriggio', 'Tramonto']
  };
  var COLORI = ['var(--dawn)', 'var(--noon)', 'var(--dusk)', 'var(--ok)', 'var(--accent)'];
  var MODI = ['seguiti', 'giro'];

  /* Quanti libri si alternano in una lettura. Uno vuol dire «un libro per
     volta»: si finisce e si passa al successivo. Da due in su si tengono in
     ballo quei libri soltanto, e chi finisce lascia il posto al successivo.
     Zero vuol dire tutti i libri della lettura, uno per turno. */
  function parDi(s, i) {
    var p = s && s.parallelo ? s.parallelo[i] : null;
    if (typeof p === 'number' && p >= 0) return p;
    return (s && s.alterna && s.alterna[i] === 'giro') ? 0 : 1;
  }

  function nomiLetture(n, orig) {
    if (orig && n === 2) return ['Aurora', 'Tramonto'];
    if (NOMI[n]) return NOMI[n].slice();
    var fuori = [];
    for (var i = 0; i < n; i++) fuori.push('Lettura ' + (i + 1));
    return fuori;
  }

  /* l'indice della lettura corta: quella che l'app chiama «Mezzodì». Se non
     c'è (una o due letture) nessuna è corta, e non si promette quello che non
     si può mantenere. */
  function indiceCorto(n, orig) {
    return nomiLetture(n, orig).indexOf('Mezzodì');
  }

  function tettoLettura(indice, n, orig) {
    return indice === indiceCorto(n, orig) ? TETTO_CORTO : TETTO_LUNGO;
  }

  /* ------------------------------------------------------------- le scelte pronte ---
     Una scelta pronta è solo una comodità: libri e alternanza di ogni lettura.
     Si possono poi cambiare libro per libro, come tutto il resto. */

  /* Le parti di sempre: la forma che dà l'app alle sue letture, per ogni numero
     di letture che l'app conosce. Serve come base per le scelte pronte e come
     pulsante per tornare alla forma di partenza. */
  var SEMPRE = {
    1: [['pentateuco', 'storici', 'poetici', 'profeti', 'vangeli', 'lettere']],
    2: [['pentateuco', 'storici'], ['poetici', 'profeti', 'vangeli', 'lettere']],
    3: [['pentateuco', 'storici'], ['vangeli', 'lettere'], ['poetici', 'profeti']],
    4: [['pentateuco', 'storici'], ['vangeli', 'lettere'], ['poetici'], ['profeti']],
    5: [['pentateuco'], ['storici'], ['vangeli', 'lettere'], ['poetici'], ['profeti']]
  };

  /* quanto è lontano, sullo scaffale della Bibbia, il libro più vicino che una
     lettura ha già */
  function distanza(libri, libro) {
    var i = D.libri.indexOf(libro), migliore = Infinity;
    for (var k = 0; k < libri.length; k++) {
      var d = Math.abs(D.libri.indexOf(libri[k]) - i);
      if (d < migliore) migliore = d;
    }
    return migliore;
  }

  function passiTot(libri, indice, n, orig) {
    var tetto = tettoLettura(indice, n, orig), tot = 0;
    for (var i = 0; i < libri.length; i++) tot += passiLibro(libri[i], tetto).length;
    return tot;
  }

  function presetStandard(n, orig) {
    var base = SEMPRE[n] || SEMPRE[3].slice(0, n);
    var libri = base.map(function (ids) { return unisciLibri(ids); });
    /* se la tabella è più corta del piano (non dovrebbe), il resto va all'ultima */
    while (libri.length < n) libri.push([]);
    return {
      libri: libri,
      alterna: libri.map(function () { return 'seguiti'; }),
      parallelo: libri.map(function () { return 1; })
    };
  }

  /* Una scelta pronta che toglie dei libri a una lettura: si parte dalle parti
     di sempre, si tolgono quei libri da tutte, si danno alla lettura corta, e
     i libri che restano senza posto vanno alla lettura più leggera. Niente
     sparisce, e nessun libro sta in due letture. */
  function presetCorto(n, orig, cortiLibri, modoCorto, parCorto) {
    var corto = indiceCorto(n, orig);
    var base = presetStandard(n, orig).libri;
    var tolti = ordinati(cortiLibri.slice());

    var libri = base.map(function (l) {
      return l.filter(function (b) { return tolti.indexOf(b) < 0; });
    });
    libri[corto] = tolti.slice();

    var dentro = {};
    libri.forEach(function (l) { for (var i = 0; i < l.length; i++) dentro[l[i]] = 1; });
    var orfani = D.libri.filter(function (b) { return !dentro[b]; });

    /* I libri rimasti senza posto vanno dove sono già i loro vicini di scaffale:
       le Lettere restano accanto ai Vangeli, non in mezzo al Pentateuco. A parità
       di vicinanza decide chi ha meno passi, così una lettura non si gonfia. */
    var pesi = libri.map(function (l, i) { return passiTot(l, i, n, orig); });
    orfani.forEach(function (b) {
      var dove = -1, migliore = Infinity;
      for (var i = 0; i < n; i++) {
        if (i === corto) continue;
        var d = libri[i].length ? distanza(libri[i], b) : -1;
        if (dove < 0 || d < migliore || (d === migliore && pesi[i] < pesi[dove])) {
          dove = i;
          migliore = d;
        }
      }
      if (dove < 0) return;
      libri[dove].push(b);
      pesi[dove] += passiLibro(b, tettoLettura(dove, n, orig)).length;
    });

    /* nessuna lettura resta vuota: se ne trova una, prende l'ultimo libro della
       più affollata */
    for (var v = 0; v < n; v++) {
      if (libri[v].length) continue;
      var da = -1;
      for (var w = 0; w < n; w++) {
        if (w === v || libri[w].length < 2) continue;
        if (da < 0 || libri[w].length > libri[da].length) da = w;
      }
      if (da >= 0) libri[v].push(libri[da].pop());
    }

    libri = libri.map(ordinati);
    var alterna = [], parallelo = [];
    for (var i = 0; i < n; i++) {
      var qui = i === corto;
      alterna.push(qui ? modoCorto : 'seguiti');
      /* le letture «di sempre» restano un libro per volta, come fa l'app: solo
         quella corta si alterna, e si porta dietro il numero chiesto */
      parallelo.push(qui && modoCorto === 'giro' ? Math.max(2, parCorto || 3) : 1);
    }
    return { libri: libri, alterna: alterna, parallelo: parallelo };
  }

  function presets(n, orig) {
    var fuori = [];
    var corto = indiceCorto(n, orig);
    if (corto >= 0) {
      fuori.push({
        id: 'giro',
        nome: 'Mezzodì leggero · Poetici e Vangeli, tre alla volta',
        fatto: function () { return presetCorto(n, orig, unisciLibri(['poetici', 'vangeli']), 'giro', 3); }
      });
      fuori.push({
        id: 'salmo-vangelo',
        nome: 'Salmo e Vangeli, due alla volta',
        fatto: function () {
          return presetCorto(n, orig, ordinati(['Salmo'].concat(libriDi('vangeli'))), 'giro', 2);
        }
      });
      fuori.push({
        id: 'corto',
        nome: 'Ancora più corto · solo Poetici',
        fatto: function () { return presetCorto(n, orig, unisciLibri(['poetici']), 'seguiti', 1); }
      });
    }
    fuori.push({
      id: 'standard',
      nome: 'Le parti di sempre',
      fatto: function () { return presetStandard(n, orig); }
    });
    return fuori;
  }

  /* ---------------------------------------------------------- leggere il piano --- */

  function libriDelPasso(passo) {
    var m = (passo || '').trim().match(/^(.+?)\s(\d+)/);
    return m && D.versi[m[1]] ? m[1] : null;
  }

  function uguali(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  /* Un piano dice già tutto, se lo si legge bene: quali libri stanno in ogni
     lettura (l'insieme dei libri dei suoi passi), da quale si parte e se sono
     «a giro» — e quest'ultima cosa non si indovina dai giri, si PROVA: si
     costruiscono i passi nei due modi e si guarda quale vien fuori identico al
     piano. Così la card si riapre come l'hai lasciata anche su un altro
     dispositivo, dopo la sincronizzazione, e il piano dell'app non viene
     scambiato per un'alternanza che non è la sua. */
  function statoDalPiano(nuovo, n, orig, letti) {
    /* quante volte un libro compare in ciascuna lettura: se l'app l'ha diviso a
       metà fra due letture, lo si tiene dove ne ha di più */
    var passiPerLibro = {};
    nuovo.forEach(function (passi, i) {
      for (var k = 0; k < passi.length; k++) {
        var b = libriDelPasso(passi[k]);
        if (!b) continue;
        if (!passiPerLibro[b]) {
          passiPerLibro[b] = [];
          for (var q = 0; q < n; q++) passiPerLibro[b].push(0);
        }
        passiPerLibro[b][i]++;
      }
    });

    var libri = [];
    for (var i0 = 0; i0 < n; i0++) libri.push([]);
    Object.keys(passiPerLibro).forEach(function (b) {
      var conta = passiPerLibro[b], dove = 0;
      for (var i = 1; i < conta.length; i++) if (conta[i] > conta[dove]) dove = i;
      libri[dove].push(b);
    });
    for (var j = 0; j < n; j++) libri[j] = ordinati(libri[j]);

    /* una lettura vuota non si può disegnare: prende l'ultimo libro della più
       affollata (le letture restano tutte piene) */
    for (var v = 0; v < n; v++) {
      if (libri[v].length) continue;
      var da = 0;
      for (var w = 0; w < n; w++) if (libri[w].length > libri[da].length) da = w;
      if (libri[da].length > 1) libri[v].push(libri[da].pop());
    }
    for (var j2 = 0; j2 < n; j2++) libri[j2] = ordinati(libri[j2]);

    var partenza = nuovo.map(function (passi, i) {
      var b = libriDelPasso(passi[0] || '');
      return (b && libri[i].indexOf(b) >= 0) ? b : (libri[i][0] || '');
    });

    var alterna = [], parallelo = [];
    nuovo.forEach(function (passi, i) {
      /* I passi letti DOPO la costruzione del piano non fanno parte del confronto:
         la costruzione li toglie, il piano salvato li ha ancora (spuntati), e
         senza questo filtro nessun modo tornerebbe uguale. */
      var resto = nonLetti(passi, letti);
      if (libri[i].length < 2) { alterna.push('seguiti'); parallelo.push(1); return; }
      if (uguali(passiLettura(libri[i], i, partenza[i], 'seguiti', n, orig, 1, letti).passi, resto)) {
        alterna.push('seguiti'); parallelo.push(1); return;
      }
      /* è un'alternanza: resta da capire fra quanti libri. Si prova prima
         «tutti» (il modo di prima) e poi due, tre, … fino a tutti: il primo che
         ricostruisce il piano identico è quello che l'ha fatto. */
      var prova = [0];
      for (var q = libri[i].length; q >= 2; q--) prova.push(q);
      for (var w2 = 0; w2 < prova.length; w2++) {
        if (uguali(passiLettura(libri[i], i, partenza[i], 'giro', n, orig, prova[w2], letti).passi, resto)) {
          alterna.push('giro'); parallelo.push(prova[w2]); return;
        }
      }
      /* Nessun modo ricostruisce questo piano: è un piano disegnato dall'app
         per conto suo (mescola due gruppi di libri, per esempio Matteo e
         Romani). Non si finge di averlo capito: si mostra «un libro per volta»,
         che è il modo più vicino all'app, e la pastiglia «Applica» dice il
         resto. */
      alterna.push('seguiti'); parallelo.push(1);
    });

    return { libri: libri, partenza: partenza, alterna: alterna, parallelo: parallelo };
  }

  /* La scelta salvata vale solo se è stata scritta insieme al piano che c'è
     adesso (`ts`): se l'app ha rifatto il piano, la scelta vecchia non vuol più
     dire niente e si riparte dal piano vero. */
  function sceltaSalvata(ts, n) {
    var o;
    try { o = JSON.parse(leggi(CHIAVE_SCELTA) || 'null'); } catch (e) { return null; }
    if (!o || o.ts !== ts) return null;
    if (!o.libri || o.libri.length !== n || !o.partenza || o.partenza.length !== n) return null;
    if (!o.alterna || o.alterna.length !== n) return null;
    var par = [];
    for (var i = 0; i < n; i++) {
      if (!o.libri[i] || !o.libri[i].length) return null;
      for (var k = 0; k < o.libri[i].length; k++) if (!D.versi[o.libri[i][k]]) return null;
      if (MODI.indexOf(o.alterna[i]) < 0) return null;
      /* «quanti alla volta»: se manca (scelta scritta da una versione di prima)
         si ricava dal modo, che è quello che faceva lei */
      var p = o.parallelo ? o.parallelo[i] : null;
      if (typeof p !== 'number' || p < 0) p = o.alterna[i] === 'giro' ? 0 : 1;
      par.push(Math.min(p, Math.max(1, o.libri[i].length)));
    }
    return {
      libri: o.libri.map(ordinati),
      partenza: o.partenza.slice(),
      alterna: o.alterna.slice(),
      parallelo: par
    };
  }

  /* ------------------------------------------------------------------ lo stato --- */

  var stato = null;      // { libri: [[…]], partenza: [...], alterna: [...], n, nomi }
  var aperto = -1;       // quale elenco di libri è aperto (-1: nessuno)

  function leggiStato() {
    var s = piano();
    if (!s || !s.plan || !s.plan.length) return null;
    var n = s.plan.length;
    /* l'app arriva a cinque letture: oltre, meglio dirlo che disegnare una card
       che poi l'app non saprebbe leggere */
    if (n > 5) return { libri: null, altro: n };
    var orig = !!(s.settings && s.settings.template === 'orig');
    var ts = s.ts || 0;

    /* i versetti già letti: si ricalcolano sempre, perché spuntare un passo non
       cambia `ts` ma cambia quello che il piano nuovo deve lasciar fuori */
    var lettiOra = lettiDelPiano(s);

    if (!stato || stato.nuovo !== ts || stato.n !== n || stato.orig !== orig) {
      var base = statoDalPiano(s.plan, n, orig, lettiOra);
      var salvata = sceltaSalvata(ts, n);
      /* due copie e non una: muovendo un libro si cambia lo stato, e il piano
         com'era deve restare com'era — se i due si dividessero gli stessi
         array, «Applica» non capirebbe più che c'è qualcosa da applicare */
      var copia = function (x) {
        var par = [];
        for (var i = 0; i < x.libri.length; i++) {
          var p = x.parallelo ? x.parallelo[i] : null;
          par.push(typeof p === 'number' && p >= 0 ? p : (x.alterna[i] === 'giro' ? 0 : 1));
        }
        return {
          libri: x.libri.map(function (l) { return l.slice(); }),
          partenza: x.partenza.slice(),
          alterna: x.alterna.slice(),
          parallelo: par
        };
      };
      stato = copia(salvata || base);
      stato.n = n;
      stato.orig = orig;
      stato.nomi = nomiLetture(n, orig);
      /* il piano com'è: serve a sapere se la scelta è ancora quella di partenza,
         cioè se c'è davvero qualcosa da applicare */
      stato.base = copia(base);
      stato.nuovo = ts;
    }
    stato.letti = lettiOra;
    return stato;
  }

  /* ------------------------------------------------------------ costruire il piano */

  function passiLettura(libri, indice, partenza, modo, n, orig, par, letti) {
    var ordine = ordinati(libri);
    if (partenza) {
      var k = ordine.indexOf(partenza);
      if (k > 0) ordine = ordine.slice(k).concat(ordine.slice(0, k));
    }
    var tetto = tettoLettura(indice, n, orig);
    /* PRIMA di alternare, si tolgono i passi già letti: così la lettura comincia
       da dove sei arrivato. Filtrando dopo l'alternanza il primo passo sarebbe
       quello di un altro libro, e soprattutto il piano comincerebbe con i
       capitoli già spuntati che l'app ripropone uno al giorno. */
    var perLibro = ordine.map(function (b) { return nonLetti(passiLibro(b, tetto), letti); });
    var qualcosa = false;
    for (var q0 = 0; q0 < perLibro.length; q0++) if (perLibro[q0].length) qualcosa = true;
    /* una lettura già letta tutta non può restare vuota: si mostra com'era, con
       i suoi passi spuntati, invece di una scheda senza niente dentro */
    if (!qualcosa) perLibro = ordine.map(function (b) { return passiLibro(b, tetto); });
    var passi = [];

    if (modo === 'giro' && perLibro.length > 1) {
      /* «a giro»: un passo da un libro, poi da un altro. Con `par` a zero si
         gira su TUTTI i libri della lettura; con `par` a due o tre si tengono
         in ballo solo quei libri, e chi finisce lascia il posto al successivo.
         È la differenza fra «leggo quaranta libri in parallelo» e «leggo tre
         libri, uno dei quali è Isaia». */
      var quanti = (par && par > 1 && par < perLibro.length) ? par : 0;
      if (!quanti) {
        var massimo = 0;
        for (var a = 0; a < perLibro.length; a++) if (perLibro[a].length > massimo) massimo = perLibro[a].length;
        for (var q = 0; q < massimo; q++) {
          for (var b2 = 0; b2 < perLibro.length; b2++) if (perLibro[b2][q]) passi.push(perLibro[b2][q]);
        }
      } else {
        var pos = perLibro.map(function () { return 0; });
        var attivi = [], prossimo = 0;
        while (attivi.length < quanti && prossimo < perLibro.length) attivi.push(prossimo++);
        while (attivi.length) {
          var girato = false;
          for (var s = 0; s < attivi.length; s++) {
            var i2 = attivi[s];
            if (pos[i2] < perLibro[i2].length) { passi.push(perLibro[i2][pos[i2]++]); girato = true; }
          }
          /* chi ha finito lascia il posto al libro successivo */
          var resta = [];
          for (var t = 0; t < attivi.length; t++) {
            if (pos[attivi[t]] < perLibro[attivi[t]].length) resta.push(attivi[t]);
            else if (prossimo < perLibro.length) resta.push(prossimo++);
          }
          attivi = resta;
          if (!girato) break;
        }
      }
    } else {
      for (var r = 0; r < perLibro.length; r++) passi = passi.concat(perLibro[r]);
    }
    return { libri: ordine, passi: passi };
  }

  function costruisci(s) {
    if (!s || !s.libri) return [];
    var n = s.libri.length;
    return s.libri.map(function (libri, i) {
      return passiLettura(libri, i, s.partenza && s.partenza[i], s.alterna && s.alterna[i], n, s.orig, parDi(s, i), s.letti);
    });
  }

  function versettiDeiPassi(passi) {
    var tot = 0;
    for (var i = 0; i < passi.length; i++) tot += versettiDelPasso(passi[i]);
    return tot;
  }

  function versettiDelPasso(passo) {
    var m = (passo || '').trim().match(/^(.+?)\s(\d+)(?::(\d+)-(\d+))?$/);
    if (!m) return 0;
    var libro = m[1], capitolo = +m[2];
    var v = (D.versi[libro] || [])[capitolo - 1] || 0;
    if (!m[3]) return v;
    return (+m[4]) - (+m[3]) + 1;
  }

  /* ------------------------------------------------------------- quello che è letto ---
     L'app tiene i passi letti come INDICI dentro ogni lettura: cambiando il piano
     quegli indici non vogliono più dire niente. Qui si passa alle etichette
     («Salmo 23»), che restano vere.

     E per sapere a che punto sei si marca capitolo per versetto: un passo è
     letto solo se tutti i suoi versetti lo sono. Così un «Genesi 41» letto
     prima resta letto anche se adesso è diviso in due passi. */

  function leggiPasso(passo) {
    var m = (passo || '').trim().match(/^(.+?)\s(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!m || !D.versi[m[1]]) return null;
    var libro = m[1], capitolo = +m[2];
    var v = (D.versi[libro] || [])[capitolo - 1] || 0;
    var v1 = m[3] ? +m[3] : 1;
    var v2 = m[4] ? +m[4] : (m[3] ? +m[3] : v);
    return { libro: libro, capitolo: capitolo, v1: v1, v2: Math.min(v2, v) };
  }

  function marca(mappa, passo) {
    var p = leggiPasso(passo);
    if (!p) return;
    if (!mappa[p.libro]) mappa[p.libro] = {};
    var capitoli = mappa[p.libro];
    if (!capitoli[p.capitolo]) capitoli[p.capitolo] = {};
    for (var i = p.v1; i <= p.v2; i++) capitoli[p.capitolo][i] = 1;
  }

  function lettoTutto(mappa, passo) {
    var p = leggiPasso(passo);
    if (!p) return false;
    var capitoli = mappa[p.libro];
    if (!capitoli || !capitoli[p.capitolo]) return false;
    for (var i = p.v1; i <= p.v2; i++) if (!capitoli[p.capitolo][i]) return false;
    return true;
  }

  /* Che cosa è già stato letto, preso dal piano che c'è: i passi spuntati dentro
     il piano (`done`) e quelli letti fuori piano (`pre`, `extra`). Serve a non
     rimettere nei passi nuovi i capitoli già letti. */
  function lettiDelPiano(vecchio) {
    var mappa = {};
    if (!vecchio) return mappa;
    (vecchio.plan || []).forEach(function (passi, i) {
      var fatti = (vecchio.done && vecchio.done[i]) || [];
      for (var k = 0; k < fatti.length; k++) marca(mappa, passi[fatti[k]]);
    });
    (vecchio.pre || []).forEach(function (p) { marca(mappa, p); });
    (vecchio.extra || []).forEach(function (p) { marca(mappa, p); });
    return mappa;
  }

  /* i passi che restano da leggere */
  function nonLetti(passi, letti) {
    if (!letti) return passi;
    var fuori = [];
    for (var i = 0; i < passi.length; i++) if (!lettoTutto(letti, passi[i])) fuori.push(passi[i]);
    return fuori;
  }

  function dataOggi() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function nuovoPiano(vecchio, costruito) {
    var n = costruito.length;
    var settings = {
      n: n,
      days: (vecchio && vecchio.settings && vecchio.settings.days) || 365
    };
    /* il piano «orig» ha due letture con nomi suoi (Aurora e Tramonto): si tiene
       il segno, altrimenti l'app tornerebbe a chiamarle Mattino e Sera */
    if (vecchio && vecchio.settings && vecchio.settings.template === 'orig' && n === 2) settings.template = 'orig';

    var nuovo = {
      v: 6,
      ts: Date.now(),
      settings: settings,
      plan: costruito.map(function (c) { return c.passi; }),
      pos: [],
      done: [],
      ovr: {},
      extra: (vecchio && vecchio.extra) || [],
      pre: ((vecchio && vecchio.pre) || []).slice(),
      act: (vecchio && vecchio.act) || [],
      rr: (vecchio && vecchio.rr) || {},
      start: (vecchio && vecchio.start) || ''
    };

    /* le etichette che l'app considera lette, prese dal piano di prima */
    var fatte = {};
    if (vecchio && vecchio.plan && vecchio.plan.length) {
      for (var i = 0; i < vecchio.plan.length; i++) {
        var fatti = (vecchio.done && vecchio.done[i]) || [];
        for (var k = 0; k < fatti.length; k++) {
          var et = vecchio.plan[i][fatti[k]];
          if (et) fatte[et] = 1;
        }
      }
    }

    /* 1) chi ha mantenuto la stessa etichetta resta letto al suo posto */
    nuovo.done = nuovo.plan.map(function (passi) {
      var out = [];
      for (var i = 0; i < passi.length; i++) if (fatte[passi[i]]) out.push(i);
      return out;
    });

    /* 2) chi non ha più posto diventa «già letto»: sparisce dal piano, non dai conti */
    var dentro = {};
    nuovo.plan.forEach(function (passi) { for (var i = 0; i < passi.length; i++) dentro[passi[i]] = 1; });
    Object.keys(fatte).forEach(function (et) {
      if (!dentro[et] && nuovo.pre.indexOf(et) < 0) nuovo.pre.push(et);
    });

    /* 3) a che punto sei: il primo passo che non risulta tutto letto */
    var mappa = {};
    nuovo.pre.forEach(function (et) { marca(mappa, et); });
    nuovo.extra.forEach(function (et) { marca(mappa, et); });
    nuovo.done.forEach(function (passi, i) {
      for (var k = 0; k < passi.length; k++) marca(mappa, nuovo.plan[i][passi[k]]);
    });
    nuovo.pos = nuovo.plan.map(function (passi) {
      for (var i = 0; i < passi.length; i++) if (!lettoTutto(mappa, passi[i])) return i;
      return Math.max(0, passi.length - 1);
    });
    return nuovo;
  }

  function aggiornaCopie(nuovo) {
    var copie = [];
    try { copie = JSON.parse(leggi(CHIAVE_SNAPS) || '[]'); } catch (e) { copie = []; }
    if (!Array.isArray(copie)) copie = [];
    var oggi = dataOggi();
    copie = copie.filter(function (c) { return c && c.d !== oggi; });
    copie.push({ d: oggi, s: nuovo });
    scrivi(CHIAVE_SNAPS, JSON.stringify(copie.slice(-14)));
  }

  /* ------------------------------------------------------------------ i mattoni --- */

  function pezzo(tag, testo, classe) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo != null) e.textContent = testo;
    return e;
  }

  function tasto(testo, azione, classe) {
    var b = pezzo('button', testo, classe || 'chip');
    b.type = 'button';
    b.addEventListener('click', azione);
    return b;
  }

  /* Il titolo della card in cui ci mettiamo: in italiano, e nelle traduzioni
     che l'app conosce già (il dizionario è a fianco, `AURORA_LINGUE`). Senza
     questo, a chi usa l'app in inglese, tedesco o spagnolo la card non
     comparirebbe affatto. */
  function titoliRitmo() {
    var t = ['Ritmo del piano'];
    try {
      var diz = window.AURORA_LINGUE && window.AURORA_LINGUE.diz;
      var v = diz && diz['Ritmo del piano'];
      if (v && typeof v === 'string') t = t.concat(v.split('|'));
    } catch (e) {}
    return t;
  }

  function cardCon(titolo) {
    var titoli = Array.isArray(titolo) ? titolo : [titolo];
    var cercati = titoli.map(function (t) { return String(t).trim().toLowerCase(); });
    var cards = document.querySelectorAll('main .card');
    for (var i = 0; i < cards.length; i++) {
      var h = cards[i].querySelector('h2');
      if (!h) continue;
      var testo = (h.textContent || '').trim().toLowerCase();
      if (cercati.indexOf(testo) >= 0) return cards[i];
    }
    return null;
  }

  /* ---------------------------------------------------------------- la card --- */

  var FR_INTRO = 'Scegli che cosa legge ogni momento: le parti della Bibbia, oppure i singoli libri, e se leggerli uno dopo l’altro o a giorni alterni.';
  var FR_CORTA = ' La lettura di mezzodì è quella corta: i suoi passi si fermano a una ventina di versetti, mentre le altre vanno a capitolo.';
  var FR_ALTRO = 'Questa scelta ha senso da una a cinque letture. Adesso il tuo piano ne ha';
  var FR_ALTRO_2 = 'Rifallo in «Ritmo del piano», poi torna qui.';
  var FR_APPLICA = 'Applica questa scelta';
  var FR_TORNA = 'Torna com’era';
  var FR_NOT = 'È un cambio di piano, non un ritocco: i passi già letti restano letti. Ogni libro sta in una lettura sola, quindi accenderlo qui lo toglie alle altre — e spegnerlo qui non lo cancella: va nella lettura più vicina, così nessun libro si perde. «Le parti di sempre» rimette i libri al loro posto; il piano esatto di prima lo rimette «Torna com’era». Attenzione: «Applica il nuovo piano», in «Ritmo del piano», rifà il piano dell’app e cancella questa scelta.';
  var FR_MULTI = 'Se usi l’app su più dispositivi, applicalo anche sugli altri: un piano diverso non si fonde con quello del cloud, e l’app te lo chiederà.';
  var FR_DA = 'comincia da';
  var FR_ALTRA = 'Libri di questa lettura';
  var FR_LIBRI = 'Scegli i libri';
  var FR_FATTO = 'Fatto';
  var FR_SPIEGA_LIBRI = 'Accendi i libri che vuoi in questa lettura: quelli che spegni qui restano nelle altre.';
  var FR_UNO = 'Un libro per volta';
  var FR_GIRO = 'A giro';
  var FR_SIM = 'in simultanea';
  var FR_SIM_T = 'Quanti libri si alternano insieme. Con 1 si legge un libro per volta e quando è finito si passa al successivo; con 2 o più i libri si danno il turno, e quando uno finisce entra quello dopo al suo posto.';
  var FR_DURATA = 'Ogni lettura va avanti un passo al giorno: più leggera è la giornata, più giorni dura. La fine del piano è quella della lettura più lunga, e la vedi nella scheda Oggi (per esempio dopo aver applicato: “Fine prevista”).';

  function riassunto(lettura) {
    var passi = lettura.passi;
    var versi = versettiDeiPassi(passi);
    var media = passi.length ? Math.round(versi / passi.length) : 0;
    var primo = lettura.libri[0] || '—';
    var ultimo = lettura.libri[lettura.libri.length - 1] || '—';
    return passi.length + ' passi · ≈' + media + ' versetti al giorno · ≈' + passi.length + ' giorni · ' + primo + ' → ' + ultimo;
  }

  function presenza(s, indice, libro) {
    return s.libri[indice].indexOf(libro) >= 0;
  }

  /* una parte è tutta dentro una lettura, tutta fuori, o divisa a metà — ed è
     proprio la metà che va mostrata, altrimenti la pastiglia mentirebbe */
  function statoParte(s, indice, id) {
    var libri = libriDi(id), dentro = 0;
    for (var i = 0; i < libri.length; i++) if (presenza(s, indice, libri[i])) dentro++;
    return dentro === 0 ? 'no' : (dentro === libri.length ? 'sì' : 'alcuni');
  }

  function riga(s, indice, calcolate) {
    var lettura = calcolate[indice];
    var letti = costruisci(s);
    var div = pezzo('div', null, 'aurora-libri-riga');

    var testa = pezzo('div', null, 'aurora-libri-testa');
    var punto = pezzo('i', null, 'dot');
    punto.style.background = COLORI[indice % COLORI.length] || 'var(--accent)';
    testa.appendChild(punto);
    testa.appendChild(pezzo('b', s.nomi[indice]));
    if (indice === indiceCorto(s.n, s.orig) && lettura) testa.appendChild(pezzo('span', 'lettura corta', 'aurora-libri-corta'));
    div.appendChild(testa);

    var sola = s.n < 2;   // una lettura sola: i libri ci sono già tutti
    var chips = pezzo('div', null, 'chips aurora-libri-parti');
    SEZIONI.forEach(function (sez) {
      var stato1 = statoParte(s, indice, sez.id);
      var b = tasto(sez.nome, function () { cambiaParte(indice, sez.id); }, 'chip');
      b.setAttribute('aria-pressed', stato1 === 'sì' ? 'true' : 'false');
      if (stato1 === 'alcuni') b.setAttribute('data-stato', 'alcuni');
      b.setAttribute('title', sola ? 'Con una lettura sola ci sono già tutti i libri'
        : (stato1 === 'alcuni'
          ? 'In questa lettura ce n’è solo una parte'
          : (stato1 === 'sì' ? 'Tutta la parte è in questa lettura' : 'Nessun libro di questa parte è qui')));
      if (sola) b.disabled = true;
      chips.appendChild(b);
    });
    div.appendChild(chips);

    /* il gesto fino: i singoli libri, uno per uno */
    var quanti = s.libri[indice].length;
    if (!sola) {
      var apri = pezzo('div', null, 'chips aurora-libri-apri');
      var t = tasto(FR_LIBRI + ' (' + quanti + ')', function () { alternaElenco(indice); });
      t.setAttribute('aria-expanded', aperto === indice ? 'true' : 'false');
      t.setAttribute('aria-controls', ID + '-elenco');
      apri.appendChild(t);
      div.appendChild(apri);
    }

    /* come si alternano: uno finisce e si passa al successivo, oppure un libro
       diverso ogni giorno */
    if (quanti > 1) {
      var modi = pezzo('div', null, 'chips aurora-libri-modo');
      [{ id: 'seguiti', nome: FR_UNO }, { id: 'giro', nome: FR_GIRO }].forEach(function (m) {
        var b = tasto(m.nome, function () { cambiaModo(indice, m.id); }, 'chip');
        b.setAttribute('aria-pressed', s.alterna[indice] === m.id ? 'true' : 'false');
        b.setAttribute('title', m.id === 'giro'
          ? 'A turno fra i libri di questa lettura: quanti alla volta lo dici qui sotto'
          : 'Un libro finisce e poi si passa al successivo, come fa l’app');
        modi.appendChild(b);
      });
      div.appendChild(modi);

      /* Quanti libri in simultanea. La manopola si vede SEMPRE, anche quando la
         lettura è «un libro per volta» — lì vale 1 e un tocco su + accende
         l'alternanza di due libri. Prima compariva soltanto DOPO aver scelto
         «a giro», e con meno di tre libri non compariva affatto: chi non lo
         sapeva non trovava il numero da nessuna parte. */
      var par = parDi(s, indice);
      if (!par || par > quanti) par = quanti;   // 0 e «oltre» vogliono dire tutti
      var tutti = par >= quanti;
      var riga2 = pezzo('div', null, 'aurora-libri-par');
      riga2.appendChild(pezzo('span', FR_SIM));

      var meno = tasto('−', function () { cambiaPar(indice, -1); }, 'chip aurora-libri-freccia');
      meno.setAttribute('aria-label', 'Un libro in meno in simultanea');
      if (par <= 1) meno.disabled = true;

      var piu = tasto('+', function () { cambiaPar(indice, 1); }, 'chip aurora-libri-freccia');
      piu.setAttribute('aria-label', 'Un libro in più in simultanea');
      if (tutti) piu.disabled = true;

      /* «tutti» solo da tre in su: con due libri è solo «2», e chiamarlo «tutti»
         farebbe pensare a un numero più grande di quello che è */
      var valore = pezzo('b', (tutti && quanti > 2) ? 'tutti' : String(par));
      valore.setAttribute('aria-live', 'polite');
      riga2.appendChild(meno);
      riga2.appendChild(valore);
      riga2.appendChild(piu);
      riga2.appendChild(pezzo('span', (tutti ? 'di ' : 'su ') + quanti, 'aurora-libri-par-su'));
      riga2.setAttribute('title', FR_SIM_T);
      div.appendChild(riga2);

      /* che cosa vuol dire quel numero, in chiaro: con 1 il conto non cambia
         niente di quello che fa l'app, da 2 in su i libri si alternano */
      div.appendChild(pezzo('p', par > 1
        ? (tutti ? 'Tutti questi libri, uno diverso ogni giorno.' : par + ' libri insieme, uno diverso ogni giorno: quando uno finisce entra il successivo.')
        : 'Un libro finisce, poi si passa al successivo. (Con + ne alterni due o più.)', 'msg aurora-libri-par-nota'));
    }

    var libriQui = ordinati(s.libri[indice]);
    var da = pezzo('label', null, 'aurora-libri-da');
    da.appendChild(pezzo('span', FR_DA));
    var sel = document.createElement('select');
    for (var i = 0; i < libriQui.length; i++) {
      var o = document.createElement('option');
      o.value = libriQui[i];
      o.textContent = libriQui[i];
      sel.appendChild(o);
    }
    var partenza = s.partenza[indice];
    if (partenza && libriQui.indexOf(partenza) >= 0) sel.value = partenza;
    else if (libriQui[0]) sel.value = libriQui[0];
    sel.addEventListener('change', function () { cambiaPartenza(indice, sel.value); });
    da.appendChild(sel);
    div.appendChild(da);

    div.appendChild(pezzo('p', riassunto(letti[indice]), 'msg aurora-libri-conto'));
    return div;
  }

  /* l'elenco dei singoli libri: uno solo alla volta, a tutta larghezza sotto le
     letture, perché in una colonna stretta sarebbe illeggibile */
  function elenco(s, indice) {
    var scatola = pezzo('div', null, 'aurora-libri-elenco');
    scatola.id = ID + '-elenco';
    var testa = pezzo('div', null, 'aurora-libri-testa');
    var punto = pezzo('i', null, 'dot');
    punto.style.background = COLORI[indice % COLORI.length] || 'var(--accent)';
    testa.appendChild(punto);
    testa.appendChild(pezzo('b', FR_ALTRA + ' · ' + s.nomi[indice]));
    scatola.appendChild(testa);
    scatola.appendChild(pezzo('p', FR_SPIEGA_LIBRI, 'msg'));

    SEZIONI.forEach(function (sez) {
      var gruppo = pezzo('div', null, 'aurora-libri-gruppo');
      gruppo.appendChild(pezzo('h3', sez.nome));
      var chips = pezzo('div', null, 'chips');
      libriDi(sez.id).forEach(function (libro) {
        var dentro = presenza(s, indice, libro);
        var b = tasto(libro, function () { cambiaLibro(indice, libro); }, 'chip');
        b.setAttribute('aria-pressed', dentro ? 'true' : 'false');
        chips.appendChild(b);
      });
      gruppo.appendChild(chips);
      scatola.appendChild(gruppo);
    });

    var azioni = pezzo('div', null, 'chips aurora-libri-azioni');
    azioni.appendChild(tasto(FR_FATTO, function () { alternaElenco(indice); }, 'btn full'));
    scatola.appendChild(azioni);
    return scatola;
  }

  function costruisciCard(s) {
    var card = pezzo('div', null, 'card');
    card.id = ID;
    card.appendChild(pezzo('h2', 'Libri di ogni lettura'));

    if (!s.libri) {
      card.appendChild(pezzo('p', FR_ALTRO + ' ' + s.altro + '. ' + FR_ALTRO_2, 'msg'));
      return card;
    }

    card.appendChild(pezzo('p', FR_INTRO + (indiceCorto(s.n, s.orig) >= 0 ? FR_CORTA : ''), 'msg'));

    var letti = costruisci(s);
    var scelte = pezzo('div', null, 'aurora-libri-scelte');
    for (var i = 0; i < s.n; i++) scelte.appendChild(riga(s, i, letti));
    card.appendChild(scelte);

    card.appendChild(pezzo('p', FR_DURATA, 'msg'));

    if (aperto >= 0 && aperto < s.n) card.appendChild(elenco(s, aperto));

    var preset = pezzo('div', null, 'chips aurora-libri-preset');
    presets(s.n, s.orig).forEach(function (p) {
      var attivo = presetDa(s) === p.id;
      var b = tasto(p.nome, function () { applicaPreset(p); }, 'chip');
      if (attivo) b.setAttribute('aria-pressed', 'true');
      preset.appendChild(b);
    });
    card.appendChild(preset);

    var azioni = pezzo('div', null, 'chips aurora-libri-azioni');
    var applica = tasto(FR_APPLICA, applicaScelta, 'btn pri full');
    if (!risultatoDiverso(s)) applica.disabled = true;
    azioni.appendChild(applica);
    if (leggi(CHIAVE_PRIMA)) azioni.appendChild(tasto(FR_TORNA, tornaComeEra, 'btn full'));
    card.appendChild(azioni);

    card.appendChild(pezzo('p', FR_NOT, 'msg'));
    card.appendChild(pezzo('p', FR_MULTI, 'msg'));

    var msg = leggi(CHIAVE_MSG);
    if (msg) {
      togli(CHIAVE_MSG);
      var avviso = pezzo('p', msg, 'msg ok');
      avviso.setAttribute('role', 'status');
      card.insertBefore(avviso, card.children[1]);
    }
    return card;
  }

  /* --------------------------------------------------------------- le interazioni --- */

  function firmaScelta(x) {
    return (x.alterna ? x.alterna.join('+') : '') + '/' + (x.parallelo || []).join(',') + '#' +
      x.libri.map(function (l) { return l.join(','); }).join('|');
  }

  function presetDa(s) {
    var mia = firmaScelta(s);
    var primi = s.libri.map(function (l, i) { return s.partenza[i] === (ordinati(l)[0] || ''); });
    if (primi.indexOf(false) >= 0) return null;
    var lista = presets(s.n, s.orig);
    for (var i = 0; i < lista.length; i++) {
      var p = lista[i].fatto();
      var firma = firmaScelta({ libri: p.libri.map(ordinati), alterna: p.alterna, parallelo: p.parallelo });
      if (firma === mia) return lista[i].id;
    }
    return null;
  }

  function risultatoDiverso(s) {
    if (!s || !s.libri) return false;
    var p = piano();
    if (!p || !p.plan) return false;
    if (p.plan.length !== s.n) return true;
    /* se la scelta è ancora quella del piano che c'è, non c'è niente da
       applicare: il pulsante resta spento anche se l'ordine dei passi è un
       altro (l'app mescola i libri a modo suo) */
    if (s.base && firmaScelta(s) === firmaScelta(s.base) &&
        s.partenza.join('|') === s.base.partenza.join('|')) return false;
    var costruito = costruisci(s);
    for (var i = 0; i < s.n; i++) {
      var a = costruito[i].passi, b = p.plan[i] || [];
      if (a.length !== b.length) return true;
      for (var k = 0; k < a.length; k++) if (a[k] !== b[k]) return true;
    }
    return false;
  }

  /* dopo ogni spostamento: se il libro di partenza se n'è andato, si riparte
     dal primo libro che è rimasto (nell'ordine della Bibbia) */
  function sistemaPartenze() {
    for (var i = 0; i < stato.libri.length; i++) {
      if (stato.libri[i].indexOf(stato.partenza[i]) < 0) {
        stato.partenza[i] = ordinati(stato.libri[i])[0] || '';
      }
    }
  }

  function normalizzaScelta() {
    stato.libri = stato.libri.map(ordinati);
    sistemaPartenze();
  }

  /* Dove può andare un libro che esce da una lettura: accanto ai suoi vicini di
     scaffale, e a parità di vicinanza dove ci sono meno passi. Un libro non
     sparisce mai dal piano: cambia lettura. */
  function altroveLibro(indice) {
    return function (libro) {
      var dove = -1, migliore = Infinity, peso = Infinity;
      for (var i = 0; i < stato.n; i++) {
        if (i === indice) continue;
        var d = stato.libri[i].length ? distanza(stato.libri[i], libro) : -1;
        var p = passiTot(stato.libri[i], i, stato.n, stato.orig);
        if (dove < 0 || d < migliore || (d === migliore && p < peso)) {
          dove = i; migliore = d; peso = p;
        }
      }
      return dove;
    };
  }

  function cambiaParte(indice, id) {
    if (!stato || !stato.libri) return;
    if (stato.n < 2) return;   // con una lettura sola non c'è dove spostare
    var libri = libriDi(id);
    if (statoParte(stato, indice, id) === 'sì') {
      var resta = stato.libri[indice].filter(function (b) { return libri.indexOf(b) < 0; });
      if (!resta.length) return;   // una lettura senza libri non si può disegnare
      stato.libri[indice] = resta;
      var cerca = altroveLibro(indice);
      libri.forEach(function (b) {
        if (stato.libri[indice].indexOf(b) >= 0) return;
        var dove = cerca(b);
        if (dove >= 0) stato.libri[dove].push(b);
      });
    } else {
      for (var i = 0; i < stato.n; i++) {
        stato.libri[i] = stato.libri[i].filter(function (b) { return libri.indexOf(b) < 0; });
      }
      stato.libri[indice] = stato.libri[indice].concat(libri);
    }
    normalizzaScelta();
    ridisegna();
  }

  function cambiaLibro(indice, libro) {
    if (!stato || !stato.libri) return;
    if (presenza(stato, indice, libro)) {
      if (stato.n < 2 || stato.libri[indice].length <= 1) return;
      stato.libri[indice] = stato.libri[indice].filter(function (b) { return b !== libro; });
      var dove = altroveLibro(indice)(libro);
      if (dove >= 0) stato.libri[dove] = stato.libri[dove].concat([libro]);
    } else {
      for (var i = 0; i < stato.n; i++) {
        if (i === indice) continue;
        stato.libri[i] = stato.libri[i].filter(function (b) { return b !== libro; });
      }
      stato.libri[indice] = stato.libri[indice].concat([libro]);
    }
    normalizzaScelta();
    ridisegna();
  }

  function cambiaModo(indice, modo) {
    if (!stato || !stato.libri) return;
    if (MODI.indexOf(modo) < 0) return;
    if (!stato.alterna) {
      stato.alterna = [];
      for (var i = 0; i < stato.n; i++) stato.alterna.push('seguiti');
    }
    if (!stato.parallelo) {
      stato.parallelo = [];
      for (var k0 = 0; k0 < stato.n; k0++) stato.parallelo.push(parDi(stato, k0));
    }
    stato.alterna[indice] = modo;
    /* Il numero va d'accordo con il modo: «un libro per volta» è uno, e «a giro»
       parte da due libri (chi ne vuole di più lo dice con +). Prima «a giro»
       metteva «tutti» e il numero sembrava cambiato da solo. */
    if (modo === 'giro' && !(stato.parallelo[indice] > 1)) stato.parallelo[indice] = 2;
    if (modo === 'seguiti') stato.parallelo[indice] = 1;
    ridisegna();
  }

  /* Quanti libri alla volta: uno, due, tre… fino a tutti quelli della lettura.
     Il numero è anche il modo — 1 è «un libro per volta», da 2 in su è «a giro» —
     così la riga delle frecce basta da sola e non c'è da indovinare dove si
     sceglie. */
  function cambiaPar(indice, delta) {
    if (!stato || !stato.libri) return;
    var quanti = stato.libri[indice].length;
    if (quanti < 2) return;
    var par = parDi(stato, indice);
    if (!par || par > quanti) par = quanti;   // «tutti» è un numero come gli altri
    var nuovo = par + delta;
    if (nuovo > quanti) nuovo = quanti;
    if (nuovo < 1) nuovo = 1;
    if (!stato.parallelo) {
      stato.parallelo = [];
      for (var i = 0; i < stato.n; i++) stato.parallelo.push(parDi(stato, i));
    }
    stato.parallelo[indice] = nuovo;
    if (!stato.alterna) {
      stato.alterna = [];
      for (var j = 0; j < stato.n; j++) stato.alterna.push('seguiti');
    }
    /* il numero e le pastiglie devono dire la stessa cosa */
    stato.alterna[indice] = nuovo > 1 ? 'giro' : 'seguiti';
    ridisegna();
  }

  function alternaElenco(indice) {
    aperto = (aperto === indice) ? -1 : indice;
    ridisegna();
  }

  function cambiaPartenza(indice, libro) {
    if (!stato || !stato.libri) return;
    stato.partenza[indice] = libro || '';
    ridisegna();
  }

  function applicaPreset(p) {
    if (!stato) return;
    var fatto = p.fatto();
    stato.libri = fatto.libri.map(ordinati);
    stato.alterna = fatto.alterna.slice();
    stato.parallelo = fatto.parallelo.slice();
    /* Una scelta pronta si prende com'è: ogni lettura ricomincia dal primo libro
       dei suoi, nell'ordine della Bibbia. (Chi vuole partire altrove lo dice
       dopo, con la tendina.) */
    stato.partenza = stato.libri.map(function (l) { return l[0] || ''; });
    aperto = -1;
    ridisegna();
  }

  function applicaScelta() {
    if (!stato || !stato.libri) return;
    var vecchio = piano();
    if (!vecchio || !vecchio.plan) return;
    if (!leggi(CHIAVE_PRIMA)) scrivi(CHIAVE_PRIMA, JSON.stringify(vecchio));
    var costruito = costruisci(stato);
    var nuovo = nuovoPiano(vecchio, costruito);
    scrivi(CHIAVE_PIANO, JSON.stringify(nuovo));
    /* la scelta viaggia insieme al piano: alla riapertura la card si ritrova
       com'era, anche se un libro si chiama in un modo che il piano non dice */
    scrivi(CHIAVE_SCELTA, JSON.stringify({
      ts: nuovo.ts,
      libri: stato.libri,
      partenza: stato.partenza,
      alterna: stato.alterna,
      parallelo: stato.parallelo
    }));
    aggiornaCopie(nuovo);
    scrivi(CHIAVE_MSG, 'Fatto: ' + descriviScelta() + (indiceCorto(stato.n, stato.orig) >= 0 ? ' La lettura di mezzodì si ferma a una ventina di versetti.' : ''));
    ricarica();
  }

  function descriviScelta() {
    var id = presetDa(stato);
    if (id) {
      var lista = presets(stato.n, stato.orig);
      for (var q = 0; q < lista.length; q++) if (lista[q].id === id) return lista[q].nome;
    }
    var pezzi = [];
    for (var i = 0; i < stato.n; i++) {
      var l = ordinati(stato.libri[i]);
      var coda = l.length <= 3 ? l.join(', ') : (l[0] + ' … ' + l[l.length - 1] + ' (' + l.length + ' libri)');
      var giro = stato.alterna[i] === 'giro' && l.length > 1;
      var par = parDi(stato, i);
      var come = giro ? (par && par < l.length ? ', ' + par + ' alla volta' : ', a giro') : '';
      pezzi.push(stato.nomi[i] + ': ' + coda + come);
    }
    return pezzi.join(' · ');
  }

  function tornaComeEra() {
    var prima = leggi(CHIAVE_PRIMA);
    if (!prima) return;
    scrivi(CHIAVE_PIANO, prima);
    togli(CHIAVE_PRIMA);
    togli(CHIAVE_SCELTA);
    scrivi(CHIAVE_MSG, 'Rimesso il piano di prima, esattamente com’era.');
    ricarica();
  }

  function ricarica() {
    setTimeout(function () { window.location.reload(); }, 60);
  }

  /* ------------------------------------------------------------------- il posto --- */

  var occupato = false;
  var ultimaFirma = null;

  /* La card si rifà solo quando cambia qualcosa di vero (i libri, le partenze,
     l'alternanza, l'elenco aperto o il piano): il ridisegno dell'app tocca il
     documento di continuo, e rifare la card a ogni tocco chiuderebbe la tendina
     proprio mentre la si usa. */
  function firma(s) {
    if (!s || !s.libri) return 'altro:' + (s ? s.altro : '?');
    return firmaScelta(s) + '#' + s.partenza.join('|') + '#' + s.n + '#' + s.orig + '#' + (s.nuovo || 0) + '#' + aperto;
  }

  function ridisegna() {
    var dove = cardCon(titoliRitmo());
    var mia = document.getElementById(ID);
    if (!dove) {
      if (mia && mia.parentElement) mia.parentElement.removeChild(mia);
      ultimaFirma = null;
      return;
    }
    var s = leggiStato();
    if (!s) {
      if (mia && mia.parentElement) mia.parentElement.removeChild(mia);
      ultimaFirma = null;
      return;
    }
    var f = firma(s);
    if (mia && mia.parentElement === dove.parentElement && f === ultimaFirma) return;
    var nuova = costruisciCard(s);
    if (mia && mia.parentElement) mia.parentElement.replaceChild(nuova, mia);
    else dove.parentElement.insertBefore(nuova, dove.nextSibling);
    ultimaFirma = f;
  }

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try { ridisegna(); } finally { occupato = false; }
  }

  var inCoda = 0;
  function fraPoco() {
    if (inCoda) return;
    inCoda = setTimeout(function () { inCoda = 0; aggiorna(); }, 160);
  }

  function avvia() {
    if (!document.body) return;
    aggiorna();

    if (window.MutationObserver) {
      var o = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          var n = recs[i].target;
          var dentro = n.nodeType === 1 ? n : n.parentElement;
          if (dentro && dentro.closest && dentro.closest('#' + ID)) continue;
          fraPoco();
          return;
        }
      });
      o.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('aurora-lingua', fraPoco);
    window.addEventListener('load', aggiorna);
    setTimeout(aggiorna, 400);
    setTimeout(aggiorna, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* sportello per il collaudo: costruisce il piano senza scriverlo */
  window.AuroraLibri = {
    aggiorna: aggiorna,
    piano: function (s) { return costruisci(s || stato).map(function (c) { return c.passi.length; }); },
    stato: function () { return leggiStato(); },
    costruisci: function (s) { return costruisci(s || stato); },
    presets: function () { return stato ? presets(stato.n, stato.orig).map(function (p) { return p.id; }) : []; },
    modo: function (i, m) { cambiaModo(i, m); },
    libro: function (i, b) { cambiaLibro(i, b); },
    parte: function (i, id) { cambiaParte(i, id); },
    apri: function (i) { alternaElenco(i); },
    par: function (i, delta) { cambiaPar(i, delta); }
  };
})();
