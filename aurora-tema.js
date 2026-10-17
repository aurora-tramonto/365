/* ============================================================================
   AURORA TEMA — Automatico · Chiaro · Scuro
   ============================================================================
   L'app segue sempre il tema del telefono: non c'e' un modo di sceglierlo. Il
   suo foglio di stile pero' i tre casi li prevede gia' tutti:

     :root { …chiaro… }                                    <- predefinito
     :root[data-theme=dark] { …scuro… }                    <- scelta esplicita
     @media (prefers-color-scheme: dark) {
       :root:not([data-theme=light]) { …scuro… }           <- sistema
     }

   Quindi non serve riscrivere un solo colore: basta mettere (o togliere)
   `data-theme` sull'elemento <html> e l'app fa il resto, compreso
   `color-scheme` per i controlli del browser.

   «Automatico» = nessun attributo = come oggi.
   La scelta resta su questo dispositivo (`aut_tema`), insieme ai dati del piano.

   Un dettaglio che si nota subito sul telefono: la barra di stato del browser
   prende il colore dai due <meta name="theme-color"> dell'app, uno per tema.
   Se scegli Scuro su un telefono chiaro, quei meta direbbero ancora "chiaro"
   e la barra resterebbe color crema sopra un'app scura. Qui vengono allineati
   alla scelta, e rimessi come stavano quando torni su Automatico.
   ============================================================================ */

(function () {
  'use strict';

  var CHIAVE = 'aut_tema';        // 'auto' | 'light' | 'dark'
  var ID = 'aurora-aspetto';
  var COLORI = { light: '#f5f4f0', dark: '#141715' };   // gli stessi dell'app
  var SCELTE = [
    { v: 'auto', nome: 'Automatico', spiega: 'segue il tuo telefono' },
    { v: 'light', nome: 'Chiaro', spiega: 'sempre chiaro' },
    { v: 'dark', nome: 'Scuro', spiega: 'sempre scuro' }
  ];

  /* le due meta originali, così si possono rimettere come stavano */
  var metaOriginali = null;

  function temaDelTelefono() {
    try { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }

  function scelta() {
    try {
      var v = localStorage.getItem(CHIAVE);
      return v === 'light' || v === 'dark' ? v : 'auto';
    } catch (e) { return 'auto'; }
  }

  function ricorda(v) {
    try { localStorage.setItem(CHIAVE, v); } catch (e) {}
  }

  /* --------------------------------------------------------------- i colori */
  /* scrive solo quando cambia: nessun attributo toccato per niente, e nessuna
     raffica di modifiche se questa funzione passa più volte di seguito */
  function metti(el, nome, valore) {
    if (valore === null) {
      if (el.hasAttribute(nome)) el.removeAttribute(nome);
    } else if (el.getAttribute(nome) !== valore) {
      el.setAttribute(nome, valore);
    }
  }

  function originaliDi(m) {
    for (var i = 0; i < metaOriginali.length; i++) if (metaOriginali[i].nodo === m) return metaOriginali[i];
    return null;
  }

  function sistemaBarraBrowser(v) {
    var tutti = [].slice.call(document.querySelectorAll('meta[name="theme-color"]'));
    if (!tutti.length) return;

    /* la prima volta si annota com'erano, nodo per nodo: così tornare su
       Automatico significa rimettere esattamente lo stato di partenza */
    if (!metaOriginali) {
      metaOriginali = tutti.map(function (m) {
        return { nodo: m, content: m.getAttribute('content'), media: m.getAttribute('media') };
      });
    }
    var primo = (metaOriginali[0] && document.contains(metaOriginali[0].nodo)) ? metaOriginali[0].nodo : tutti[0];

    if (v === 'auto') {
      /* come erano: due meta, uno per tema, decide il sistema */
      var adesso = temaDelTelefono();
      tutti.forEach(function (m) {
        var o = originaliDi(m);
        if (o) {
          metti(m, 'content', o.content);
          metti(m, 'media', o.media);
        } else {
          /* Una meta aggiunta dopo (l'app ne mette una terza quando parte) non
             ha `media`: vince lei su tutte, e su un telefono scuro la barra di
             stato resterebbe color crema. Le si dà il colore del tema in uso,
             e la si aggiorna quando il telefono cambia (vedi avvia()). */
          metti(m, 'content', COLORI[adesso]);
          metti(m, 'media', null);
        }
      });
      return;
    }

    /* Scelta esplicita: una sola verità per la barra di stato. La prima meta
       resta senza `media` (quindi corrisponde sempre) e TUTTE le altre vengono
       spente: l'app ne ha due nel sorgente più una che rimette Next.js da solo,
       e alcuni browser guardano l'ultima invece della prima. */
    tutti.forEach(function (m) {
      if (m === primo) {
        metti(m, 'content', COLORI[v]);
        metti(m, 'media', null);
      } else {
        metti(m, 'media', 'not all');
      }
    });
  }

  /* ------------------------------------------------------------- l'applicazione */
  /* Scrive solo se serve, e non per pignoleria: il tema lo mette già lo script
     in linea in fondo alla testata, ma questo modulo arriva dopo (è `defer`) e
     deve poter cambiare idea senza ricaricare la pagina. Scrivendo solo quando
     il valore è diverso, l'osservatore qui sotto non resta mai in un giro
     infinito di riscritture. */
  function applica() {
    var v = scelta();
    var r = document.documentElement;

    if (v === 'auto') {
      if (r.getAttribute('data-theme') !== null) r.removeAttribute('data-theme');
      if (r.style.colorScheme !== '') r.style.colorScheme = '';
    } else {
      if (r.getAttribute('data-theme') !== v) r.setAttribute('data-theme', v);
      /* `color-scheme` sui controlli nativi: l'app lo mette solo per lo scuro,
         quindi scegliendo Chiaro su un telefono scuro va detto esplicitamente */
      if (r.style.colorScheme !== v) r.style.colorScheme = v;
    }
    sistemaBarraBrowser(v);
  }

  /* ------------------------------------------------------------------- il pannello */
  function costruisci() {
    var card = document.createElement('div');
    card.className = 'card';
    card.id = ID;
    card.innerHTML =
      '<h2 style="margin-top:0">Aspetto</h2>' +
      '<p class="msg">Automatico segue il tema del telefono. «Chiaro» e «Scuro» lo bloccano per questa app soltanto.</p>' +
      '<div class="seg" role="group" aria-label="Aspetto"></div>';

    var gruppo = card.querySelector('.seg');
    SCELTE.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.setAttribute('data-tema', s.v);
      b.setAttribute('aria-pressed', 'false');
      /* la spiegazione sotto il nome resta leggibile anche da uno screen reader */
      b.setAttribute('aria-label', s.nome + ' — ' + s.spiega);
      b.textContent = s.nome;
      b.addEventListener('click', function () {
        ricorda(s.v);
        applica();
        segnaScelta();
      });
      gruppo.appendChild(b);
    });
    return card;
  }

  function segnaScelta() {
    var card = document.getElementById(ID);
    if (!card) return;
    var v = scelta();
    [].slice.call(card.querySelectorAll('button[data-tema]')).forEach(function (b) {
      var premuto = b.getAttribute('data-tema') === v;
      var attuale = b.getAttribute('aria-pressed') === 'true';
      if (premuto !== attuale) b.setAttribute('aria-pressed', premuto ? 'true' : 'false');
    });
  }

  /* La scheda Impostazioni si riconosce dalla sua card «Ritmo del piano» — che
     però, cambiando lingua, diventa «Plan pace» / «Lesetempo» / «Ritmo del
     plan». Si riconosce in tutte e quattro le lingue e si segna il pannello con
     un attributo, che nessuna traduzione tocca. */
  var TITOLI = /Ritmo del piano|Plan pace|Lesetempo|Ritmo del plan/;

  function pannelloImpostazioni() {
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

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try {
      var dove = pannelloImpostazioni();
      var card = document.getElementById(ID);

      /* non siamo in Impostazioni: non deve restare niente in giro */
      if (!dove) { if (card) card.remove(); return; }

      if (!card) card = costruisci();
      /* La card deve essere la PRIMA delle Impostazioni. Il confronto e' con il
         primo figlio, non con la card «Ritmo del piano»: se un altro modulo
         mette una sua card li' in mezzo, un confronto con quel nodo la
         sposterebbe a ogni ridisegno — spostare un nodo fa ripartire la sua
         animazione d'ingresso, e la card resterebbe invisibile a forza di
         ripartire. Succedeva davvero, con il modulo dei promemoria. */
      if (card.parentElement !== dove.main || dove.main.firstElementChild !== card) {
        dove.main.insertBefore(card, dove.main.firstElementChild);
      }
      segnaScelta();
    } finally {
      occupato = false;
    }
  }

  /* --------------------------------------------------------------- l'avvio */
  applica();   /* prima di tutto: il tema non deve "scattare" dopo */

  function avvia() {
    /* il tema del telefono cambia mentre l'app è aperta: se sei su Automatico
       la barra di stato deve seguirla */
    try {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var ascolta = function () { if (scelta() === 'auto') applica(); };
      if (mq.addEventListener) mq.addEventListener('change', ascolta);
      else if (mq.addListener) mq.addListener(ascolta);
    } catch (e) {}

    /* Rete di sicurezza, non la difesa principale. Un tempo credevo che Next.js
       cancellasse `data-theme` alla fine del caricamento: la verità è che lo
       faceva solo quando la pagina non riusciva a idratarsi (vedi la nota su
       INIZIO_TEMA in proposte/applica-interfaccia.py), e in quel caso sparivano
       anche gli altri attributi di <html>. Se un giorno qualcuno tocca <html>,
       qui si rimette a posto nello stesso giro: i callback della
       MutationObserver girano prima del disegno successivo, quindi non si vede
       nessun lampo. Niente setTimeout: sarebbe un fotogramma col tema sbagliato. */
    if (window.MutationObserver) {
      var guardia = new MutationObserver(function () { applica(); });
      guardia.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    }

    /* e per sicurezza: dopo il caricamento completo, un paio di conferme */
    window.addEventListener('load', applica);
    setTimeout(applica, 300);
    setTimeout(applica, 1200);

    /* l'app ridisegna le schede quando si passa da una all'altra */
    if (window.MutationObserver) {
      var inCoda = false;
      var osservatore = new MutationObserver(function () {
        if (inCoda) return;
        inCoda = true;
        setTimeout(function () { inCoda = false; aggiorna(); }, 120);
      });
      osservatore.observe(document.body, { childList: true, subtree: true });

      /* Se la testata viene riscritta e ricompaiono <meta name="theme-color">
         nuove, la scelta esplicita va riportata anche su quelle. Le
         modifiche di attributo non fanno scattare questo osservatore (segue
         solo i nodi), quindi non c'è nessun anello. */
      if (document.head) {
        var inCoda2 = false;
        var testata = new MutationObserver(function () {
          if (inCoda2) return;
          inCoda2 = true;
          setTimeout(function () { inCoda2 = false; applica(); }, 120);
        });
        testata.observe(document.head, { childList: true });
      }
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

  /* sportello per il collaudo: così le prove girano sul file vero */
  window.AuroraTema = {
    scelta: scelta,
    scegli: function (v) { ricorda(v); applica(); segnaScelta(); },
    applica: applica,
    dati: function () {
      return {
        scelta: scelta(),
        attributo: document.documentElement.getAttribute('data-theme'),
        colorScheme: document.documentElement.style.colorScheme || '(nessuno)',
        barra: [].slice.call(document.querySelectorAll('meta[name="theme-color"]')).map(function (m) {
          return { content: m.getAttribute('content'), media: m.getAttribute('media') };
        })
      };
    }
  };
})();
