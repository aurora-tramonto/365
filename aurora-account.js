/* ============================================================================
   AURORA ACCOUNT — il tasto in alto, e i dati della persona
   ============================================================================
   Un tasto tondo in cima alla pagina (accanto all'anello del progresso) e un
   pannello con quello che riguarda la persona: la foto, il nome, la data di
   nascita, l'email dell'account. Nient'altro: qui non si legge e non si scrive
   il piano — quello è lavoro di aurora-sync.js, e resta suo.

   Dove finiscono i dati:
     - sempre, in `aut_profilo` nel browser: il profilo funziona anche senza
       accesso, e senza accesso non esce di qui;
     - se hai l'accesso, anche in `utenti/<uid>/profilo/dati` su Firestore, un
       documento SUO, separato dal piano. Così la fusione fra due dispositivi
       (che confronta il documento del piano) non si accorge del profilo, e
       cambiare il nome non diventa mai un conflitto da risolvere.
     La foto si riduce a 160 px quadrati in JPEG prima di uscire dal telefono:
     circa 8-20 KB, che stanno comodamente in un documento.

   Unione fra due dispositivi, quando accedi: il profilo del cloud riempie i
   vuoti, il locale riempie i suoi. Niente si sovrascrive con il vuoto — la
   stessa regola del piano.

   Quando NON fa niente: se aurora-sync.js non è configurato (nessuna chiave
   Firebase) il tasto non compare, esattamente come non compare la striscia.
   Per vedere il pannello prima di configurare: `?aurora-account=1`; per
   collaudarlo con un finto accesso: `?aurora-prova=1`.
   ============================================================================ */

(function () {
  'use strict';

  var CHIAVE = 'aut_profilo';
  var PROVA = /[?&]aurora-prova=1(?:&|$)/.test(location.search);
  var SGUARDO = /[?&]aurora-account=1(?:&|$)/.test(location.search);
  var LATO = 160;          // px: lato della foto ridotta
  var QUALITA = 0.82;
  var ATTESA = 700;        // ms: quanto aspettare prima di mandare al cloud

  var profilo = leggi() || { foto: '', nome: '', nascita: '' };
  var attesa = null;      // orologio dell'invio al cloud
  var orologioAvviso = null;

  var tasto, testo, sfera, sfondo, pannello, stato, campoNome, campoNascita, campoFile, rigaEmail, annuncio;

  function leggi() {
    try { return JSON.parse(localStorage.getItem(CHIAVE) || 'null'); } catch (e) { return null; }
  }
  function scrivi() {
    try { localStorage.setItem(CHIAVE, JSON.stringify(profilo)); } catch (e) {}
  }
  function T(t) {
    try { if (window.AuroraLingua && window.AuroraLingua.traduci) return window.AuroraLingua.traduci(t); } catch (e) {}
    return t;
  }
  function SY() { return window.AuroraSync || null; }
  function dentro() {
    var s = SY();
    return !!(s && s.utente && s.utente());
  }
  function attivo(s) {
    if (!s) return SGUARDO;                 /* senza il modulo: solo se lo chiedi tu */
    return SGUARDO || s.configurato || !!s.prova;
  }

  /* ------------------------------------------------------------- la foto ---
     Una foto da 4 MB non può viaggiare in un documento, e non serve: in un
     cerchio di 34 px non si vede la differenza. Si ritaglia al centro un
     quadrato e si riduce a 160 px; da lì in poi è lunga 8-20 KB. */

  function riduci(f, poi) {
    var lettore = new FileReader();
    lettore.onerror = function () { poi(null); };
    lettore.onload = function () {
      var img = new Image();
      img.onerror = function () { poi(null); };
      img.onload = function () {
        try {
          var lato = Math.min(img.width, img.height);
          var tela = document.createElement('canvas');
          tela.width = tela.height = LATO;
          var g = tela.getContext('2d');
          g.drawImage(img, (img.width - lato) / 2, (img.height - lato) / 2, lato, lato, 0, 0, LATO, LATO);
          poi(tela.toDataURL('image/jpeg', QUALITA));
        } catch (e) { poi(null); }
      };
      img.src = lettore.result;
    };
    lettore.readAsDataURL(f);
  }

  /* ------------------------------------------------------------ il tasto ---
     Il tasto si mette dentro la testata dell'app, accanto all'anello. La
     testata è di React, che ogni tanto la ridisegna: se il tasto sparisce
     (perché React l'ha ricostruita) si rimette, e lo si vede sparire solo per
     un istante. */

  function assicura() {
    var head = document.querySelector('.head');
    if (!head || !tasto) return;
    if (tasto.isConnected && tasto.parentElement === head) return;
    var anello = head.querySelector('.pct');
    if (anello) head.insertBefore(tasto, anello);
    else head.appendChild(tasto);
  }

  function costruisciTasto() {
    document.documentElement.classList.add('aurora-con-tasto');
    tasto = document.createElement('button');
    tasto.type = 'button';
    tasto.className = 'aurora-top-tasto';
    /* `translate="no"`: qui c'è il nome della persona. Nel dizionario ci sono i
       nomi dei libri della Bibbia — «Marco» fra questi — e senza questo segno
       chi si chiama Marco si vedrebbe scritto «Markus». Il testo che scrivo io
       è già tradotto (passa da T()), quindi non ci perde niente. */
    tasto.innerHTML =
      '<span class="aurora-top-sfera" aria-hidden="true" translate="no"></span>' +
      '<span class="aurora-top-testo" translate="no"></span>';
    tasto.setAttribute('translate', 'no');   /* né il nome né l'email si traducono */
    sfera = tasto.querySelector('.aurora-top-sfera');
    testo = tasto.querySelector('.aurora-top-testo');
    tasto.addEventListener('click', apri);
    assicura();

    if (!window.MutationObserver) return;
    var g = new MutationObserver(function () { assicura(); });
    g.observe(document.body, { childList: true, subtree: true });
  }

  /* ----------------------------------------------------------- il pannello --- */

  function costruisciPannello() {
    sfondo = document.createElement('div');
    sfondo.className = 'aurora-foglio-bg';
    sfondo.hidden = true;
    sfondo.innerHTML =
      '<div class="aurora-foglio" role="dialog" aria-modal="true" aria-labelledby="aurora-acc-titolo">' +
        '<h2 id="aurora-acc-titolo">Il tuo account</h2>' +
        /* Solo con `?aurora-prova=1`: dice a chiare lettere che l'account è
           finto. Senza, l'email «prova@esempio.it» sembrava un account vero
           che non funzionava. */
        '<p class="aurora-acc-prova" hidden></p>' +
        '<p class="aurora-foglio-stato"></p>' +
        '<p class="aurora-foglio-spiega"></p>' +

        '<div class="aurora-acc-foto">' +
          '<span class="aurora-acc-sfera" aria-hidden="true" translate="no"></span>' +
          '<span class="aurora-acc-foto-azioni">' +
            /* il <label> è il pulsante che si vede e che si raggiunge con la
               tastiera; l'ingresso vero resta nascosto (tabindex -1) perché
               non si può disegnare un fuoco visibile su un campo invisibile */
            '<label class="aurora-foglio-tasto" for="aurora-acc-file" role="button" tabindex="0" ' +
              'id="aurora-acc-scelta">Scegli una foto</label>' +
            '<button type="button" class="aurora-foglio-tasto piano aurora-acc-togli" hidden>Togli la foto</button>' +
          '</span>' +
          '<input id="aurora-acc-file" class="aurora-nascosto" type="file" accept="image/*" tabindex="-1">' +
        '</div>' +

        '<div class="aurora-acc-riga">' +
          '<label for="aurora-acc-nome">Nome</label>' +
          '<input id="aurora-acc-nome" type="text" autocomplete="name" spellcheck="false" ' +
            'placeholder="Il tuo nome">' +
        '</div>' +

        '<div class="aurora-acc-riga">' +
          '<label for="aurora-acc-nascita">Data di nascita</label>' +
          '<input id="aurora-acc-nascita" type="date">' +
        '</div>' +

        '<p class="aurora-acc-email"></p>' +
        '<p class="aurora-acc-salvato" role="status" aria-live="polite" aria-atomic="true"></p>' +

        '<div class="aurora-foglio-azioni"></div>' +
        '<button type="button" class="aurora-foglio-chiudi">Chiudi</button>' +
      '</div>';

    pannello = sfondo.querySelector('.aurora-foglio');
    stato = sfondo.querySelector('.aurora-foglio-stato');
    campoNome = sfondo.querySelector('#aurora-acc-nome');
    campoNascita = sfondo.querySelector('#aurora-acc-nascita');
    campoFile = sfondo.querySelector('#aurora-acc-file');
    rigaEmail = sfondo.querySelector('.aurora-acc-email');
    annuncio = sfondo.querySelector('.aurora-acc-salvato');

    sfondo.querySelector('.aurora-foglio-chiudi').addEventListener('click', chiudi);
    sfondo.addEventListener('click', function (e) { if (e.target === sfondo) chiudi(); });
    document.addEventListener('keydown', function (e) {
      if (sfondo && !sfondo.hidden && e.key === 'Escape') chiudi();
    });

    /* il <label> si comporta da pulsante anche da tastiera */
    var scelta = sfondo.querySelector('#aurora-acc-scelta');
    scelta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); campoFile.click(); }
    });

    /* Un pannello che si dichiara «modale» deve meritarlo: il fuoco non deve
       uscire di qui con Tab e finire dietro, sulla pagina che non si vede. */
    sfondo.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || sfondo.hidden) return;
      var candidati = sfondo.querySelectorAll(
        'button:not([hidden]), input:not([hidden]):not([tabindex="-1"]), [href], [tabindex="0"]:not([hidden])'
      );
      var elenco = [].filter.call(candidati, function (el) { return el.offsetParent !== null || el === document.activeElement; });
      if (!elenco.length) return;
      var primo = elenco[0], ultimo = elenco[elenco.length - 1];
      if (e.shiftKey && document.activeElement === primo) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primo.focus(); }
    });

    /* Mentre si scrive il nome NON si ridisegna il pannello: riempire il campo
       mentre la persona scrive le sposterebbe il cursore, e ricostruire i
       pulsanti le porterebbe via il fuoco. Si aggiorna il tasto, e basta. */
    campoNome.addEventListener('input', function () {
      profilo.nome = campoNome.value;
      scrivi(); aggiornaTasto(); programmaInvio(); annunciaDopo(T('Salvato'));
    });
    campoNascita.addEventListener('change', function () {
      profilo.nascita = campoNascita.value;
      scrivi(); aggiornaTasto(); programmaInvio(); annuncia(T('Salvato'));
    });
    campoFile.addEventListener('change', function () {
      var f = campoFile.files && campoFile.files[0];
      if (!f) return;
      annuncia(T('Riduco la foto…'));
      riduci(f, function (data) {
        if (!data) { annuncia(T('Non riesco a leggere questa foto: provane un’altra.')); return; }
        profilo.foto = data;
        campoFile.value = '';
        scrivi(); dipingi(); programmaInvio(); annuncia(T('Salvato'));
      });
    });
    sfondo.querySelector('.aurora-acc-togli').addEventListener('click', function () {
      profilo.foto = '';
      scrivi(); dipingi(); programmaInvio(); annuncia(T('Salvato'));
    });

    document.body.appendChild(sfondo);
  }

  function apri() {
    if (!sfondo) costruisciPannello();
    /* prima si mostra, poi si disegna: dipingi() salta i campi quando il
       pannello è chiuso, quindi disegnare prima lo lascerebbe vuoto */
    sfondo.hidden = false;
    dipingi();
    document.documentElement.classList.add('aurora-acc-aperto');
    /* il fuoco entra nel pannello: chi usa la tastiera non deve cercarlo */
    var primo = dentro() ? campoNome : sfondo.querySelector('.aurora-foglio-azioni .aurora-foglio-tasto');
    if (primo) setTimeout(function () { primo.focus(); }, 30);
  }

  function chiudi() {
    if (!sfondo) return;
    sfondo.hidden = true;
    document.documentElement.classList.remove('aurora-acc-aperto');
    if (tasto) tasto.focus();
  }

  /* -------------------------------------------------------------- disegno --- */

  function lettera() {
    var n = (profilo.nome || '').trim();
    return n ? n.charAt(0).toUpperCase() : '';
  }

  function sfere() {
    var tutti = [sfera, sfondo ? sfondo.querySelector('.aurora-acc-sfera') : null];
    tutti.forEach(function (s) {
      if (!s) return;
      if (profilo.foto) {
        s.style.backgroundImage = 'url("' + profilo.foto + '")';
        s.classList.add('con-foto');
        s.textContent = '';
      } else {
        s.style.backgroundImage = '';
        s.classList.remove('con-foto');
        s.textContent = lettera();
      }
    });
  }

  /* il tasto: la foto (o l'iniziale) e una parola che dice cosa fa */
  function aggiornaTasto() {
    if (!tasto) return;
    var u = dentro() ? SY().utente() : null;
    var nome = (profilo.nome || '').trim();
    sfere();
    testo.textContent = u ? (nome || T('Il tuo account')) : T('Accedi');
    tasto.dataset.accesso = u ? 'si' : 'no';
    tasto.setAttribute('aria-label', u
      ? T('Il tuo account') + ': ' + (u.email || nome || T('sei entrato'))
      : T('Accedi con Google'));
  }

  function dipingi() {
    if (!tasto) return;
    var u = dentro() ? SY().utente() : null;
    var nome = (profilo.nome || '').trim();
    aggiornaTasto();
    if (!sfondo || sfondo.hidden) return;

    var statoP = pannello.dataset;
    statoP.accesso = u ? 'si' : 'no';

    /* «Sei entrato come» e il nome in due pezzi: la frase si traduce, il nome
       no. In un pezzo solo, «Sei entrato come Marco» diventerebbe «... als
       Markus», perché Marco nel dizionario c'è. */
    stato.textContent = '';
    if (u) {
      stato.appendChild(document.createTextNode(T('Sei entrato come') + ' '));
      var chi = document.createElement('span');
      chi.setAttribute('translate', 'no');
      chi.textContent = u.email || nome || '';
      stato.appendChild(chi);
    } else {
      stato.textContent = T('Non hai ancora un accesso.');
    }
    var prova = sfondo.querySelector('.aurora-acc-prova');
    var inProva = !!(SY() && SY().prova);
    prova.hidden = !inProva;
    if (inProva) prova.textContent = T('Accesso di prova: questo account è finto. Non è su Google e non salva niente fuori da questo browser.');

    sfondo.querySelector('.aurora-foglio-spiega').textContent = u
      ? T('Foto, nome e data di nascita li vedi tu: sul database c’è una regola che li lascia leggere e scrivere solo a te, e si allineano sugli altri dispositivi dove hai lo stesso accesso.')
      : T('Senza accesso, il piano e questi dati restano su questo telefono: se svuoti i dati del browser o cambi telefono non si ritrovano. Con l’accesso si ritrovano, e li vedi solo tu.');

    campoNome.value = nome;
    campoNascita.value = profilo.nascita || '';
    rigaEmail.textContent = u ? T('Email: ' + (u.email || '—')) : '';
    rigaEmail.hidden = !u;
    sfondo.querySelector('.aurora-acc-togli').hidden = !profilo.foto;

    var az = sfondo.querySelector('.aurora-foglio-azioni');
    az.textContent = '';
    if (u) {
      az.appendChild(tastoFoglio(T('Esci'), function () {
        scrivi();   /* il profilo resta qui: uscire non cancella niente */
        if (SY() && SY().esci) SY().esci();
        dipingi();
        annuncia(T('Uscita fatta. Il profilo resta su questo telefono.'));
      }));
    } else {
      az.appendChild(tastoFoglio(T('Accedi con Google'), function () {
        if (SY() && SY().accedi) { annuncia(T('Ti porto su Google…')); SY().accedi(); }
        else annuncia(T('L’accesso non è ancora configurato: vedi proposte/accesso-come-si-fa.md'));
      }, 'piano'));
    }
  }

  function tastoFoglio(testo2, azione, tipo) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'aurora-foglio-tasto' + (tipo === 'piano' ? ' piano' : '');
    b.textContent = testo2;
    b.addEventListener('click', azione);
    return b;
  }

  /* Una riga sola per dire com'è andata, e niente ripetizioni: a ogni lettera
     del nome non si annuncia niente (sarebbe «Salvato, salvato, salvato»). */
  function annuncia(t) {
    if (!annuncio || annuncio.textContent === t) return;
    annuncio.textContent = t;
  }

  function annunciaDopo(t) {
    clearTimeout(orologioAvviso);
    orologioAvviso = setTimeout(function () { annuncia(t); }, 900);
  }

  /* ------------------------------------------------------------- salvare ---
     Locale subito (il profilo non deve mai dipendere dal cloud), e al cloud
     dopo una pausa: scrivere a ogni lettera del nome sarebbe uno spreco, e
     sciame di avvisi per chi ascolta. */

  function impacchetta() {
    return { foto: profilo.foto || '', nome: (profilo.nome || '').trim(), nascita: profilo.nascita || '' };
  }

  function programmaInvio() {
    if (!dentro()) return;
    clearTimeout(attesa);
    attesa = setTimeout(function () {
      var s = SY();
      if (!s || !dentro()) return;
      s.profilo.scrivi(impacchetta()).then(function (ok) {
        annuncia(ok ? T('Salvato anche sul cloud') : T('Salvato qui: il cloud non risponde'));
      });
    }, ATTESA);
  }

  /* --------------------------------------------------- accesso e fusione ---
     Entrando: si legge il profilo dal cloud e si unisce al locale (il cloud
     riempie i vuoti, il locale i suoi). Se l'unione ha qualcosa che il cloud
     non ha, si manda. Da quel momento si ascolta: se lo cambi da un altro
     dispositivo, arriva qui. */

  function unisciProfili(locale, remoto) {
    var fuori = {};
    ['foto', 'nome', 'nascita'].forEach(function (k) {
      fuori[k] = (remoto && remoto[k]) || (locale && locale[k]) || '';
    });
    return fuori;
  }

  var ascoltando = false;

  function quandoCambia(u) {
    dipingi();
    if (!u) return;
    var s = SY();
    if (!s || !s.profilo) return;
    s.profilo.leggi().then(function (remoto) {
      var unito = unisciProfili(profilo, remoto);
      var diversoDaRemoto = JSON.stringify(unito) !== JSON.stringify(remoto || { foto: '', nome: '', nascita: '' });
      profilo = unito;
      scrivi();
      dipingi();
      if (diversoDaRemoto) s.profilo.scrivi(impacchetta());
      if (ascoltando) return;
      ascoltando = true;
      s.profilo.osserva(function (r) {
        if (!r) return;
        var u2 = unisciProfili(profilo, r);
        if (JSON.stringify(u2) !== JSON.stringify(profilo)) {
          profilo = u2;
          scrivi();
          dipingi();
        }
      });
    });
  }

  /* ---------------------------------------------------------------- avvio --- */

  function parte(s) {
    costruisciTasto();
    dipingi();
    if (s && s.osservatore) {
      s.osservatore(quandoCambia);
      quandoCambia(s.utente ? s.utente() : null);
    }
  }

  function avvia() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', avvia); return; }

    /* aurora-sync.js è un modulo ES: può arrivare dopo di noi. Si aspetta — con
       un limite — prima di decidere se il tasto ci deve essere: senza la sua
       configurazione il tasto non compare, come non compare la striscia. */
    var tentativi = 0;
    (function aspettaLo() {
      var s = SY();
      if (s) {
        if (!attivo(s)) return;         /* non configurato: non si vede niente */
        parte(s);
        return;
      }
      if (tentativi++ > 40) {           /* ~6 s e poi basta */
        if (SGUARDO) parte(null);
        return;
      }
      setTimeout(aspettaLo, 150);
    })();
  }

  /* sportello per il collaudo: così le prove girano sul file vero */
  window.AuroraAccount = {
    profilo: function () { return profilo; },
    imbianca: function () { profilo = { foto: '', nome: '', nascita: '' }; scrivi(); dipingi(); },
    quandoCambia: quandoCambia,
    unisciProfili: unisciProfili,
    riduci: riduci,
    apri: apri,
    chiudi: chiudi
  };

  avvia();
})();
