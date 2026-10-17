/* ============================================================================
   AURORA OGGI — un solo pulsante per la lettura di adesso
   ============================================================================
   Il pulsante del prototipo: «Conferma Tramonto», «Conferma Mezzodì»,
   «Conferma Aurora», a seconda dell'ora. Un gesto invece di tre scelte.

   Come funziona, ed e' la parte importante: NON tocca i dati. Trova la casella
   che l'app ha gia' disegnato per quel momento e la tocca al posto tuo —
   `input.chk.click()`. Cosi' l'app fa tutto il suo lavoro: salva, aggiorna la
   percentuale, la serie, la copia di sicurezza e il messaggio in basso. Se un
   giorno l'app cambia il modo di salvare, questo pulsante non se ne accorge
   nemmeno: continua a premere la stessa casella.

   Se non trova la scheda Oggi (perche' sei su un'altra scheda), non crea
   niente. Se l'app ridisegna la scheda, il pulsante si rimette al suo posto.
   ============================================================================ */

(function () {
  'use strict';

  var BTN = 'aurora-conferma';
  var ID = 'aurora-conferma-oggi';

  /* stesso orologio dello script in index.html: le due cose devono dire la
     stessa verità, altrimenti la riga accesa e il pulsante si contraddicono */
  function oraAdesso() {
    var h = new Date().getHours();
    return h >= 4 && h < 11 ? 'dawn' : (h >= 11 && h < 17 ? 'noon' : 'dusk');
  }

  /* `data-ora` è quello che accende la riga del momento. Lo mette lo script in
     linea nella testata, ma questo modulo deve poterlo rinfrescare: il momento
     cambia mentre l'app è aperta, e un giorno potrebbe cambiarlo anche
     l'app stessa. Qui si rimette se manca, e il modulo ripassa a ogni ridisegno,
     quindi la riga resta accesa. */
  function sistemaOra() {
    var r = document.documentElement;
    var adesso = oraAdesso();
    if (r.getAttribute('data-ora') !== adesso) r.setAttribute('data-ora', adesso);
  }

  /* e chi lo cancella viene ripreso nello stesso giro: la MutationObserver
     reagisce prima del disegno successivo, quindi non si vede nessuno sfarfallio */
  function guardiaOra() {
    if (!window.MutationObserver) return;
    var g = new MutationObserver(function () { sistemaOra(); });
    g.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ora'] });
  }

  /* Il nome del momento sta nel primo nodo di testo dentro `.lab`, prima del
     contatore «1/212». Si legge da lì e non dall'aria-label: quell'etichetta
     viene tradotta (la lingua si sceglie in Impostazioni) e una regex italiana
     non la riconoscerebbe più. Il testo invece è nella lingua scelta, che è
     proprio quella da mostrare. */
  function nomeMomento(riga) {
    var lab = riga.querySelector('.lab');
    if (lab) {
      for (var i = 0; i < lab.childNodes.length; i++) {
        var n = lab.childNodes[i];
        if (n.nodeType === 3) {
          var t = (n.nodeValue || '').trim();
          if (t) return t;
        }
      }
    }
    var c = riga.querySelector('input.chk');
    var etichetta = c && c.getAttribute('aria-label');
    if (etichetta) {
      var m = etichetta.match(/Segna\s+(.+?)\s+come\s+letto/i) ||
              etichetta.match(/Mark\s+(.+?)\s+as\s+read/i);
      if (m) return m[1];
    }
    var piccolo = riga.querySelector('small');
    return piccolo ? (piccolo.textContent || '').trim() : '';
  }

  function momentoDellaRiga(riga) {
    var punto = riga.querySelector('.dot');
    if (!punto) return null;
    var stile = punto.getAttribute('style') || '';
    if (stile.indexOf('--dawn') >= 0) return 'dawn';
    if (stile.indexOf('--noon') >= 0) return 'noon';
    if (stile.indexOf('--dusk') >= 0) return 'dusk';
    return null;
  }

  /* le righe della scheda Oggi, ciascuna con: casella, nome, momento, letto */
  function leggiRighe() {
    var card = document.querySelector('.card.today');
    if (!card) return null;
    var righe = [];
    var nodi = card.querySelectorAll('.row');
    for (var i = 0; i < nodi.length; i++) {
      var c = nodi[i].querySelector('input.chk');
      if (!c) continue;
      /* se un giorno l'app cambiasse le etichette, il pulsante non resta muto:
         ripiega sull'ordine della giornata invece di scrivere «Conferma» e basta */
      var nome = nomeMomento(nodi[i]);
      righe.push({
        nodo: nodi[i],
        casella: c,
        nome: nome || ('la ' + (i + 1) + 'ª lettura'),
        momento: momentoDellaRiga(nodi[i]),
        letto: !!c.checked
      });
    }
    return righe.length ? { card: card, righe: righe } : null;
  }

  /* quale lettura tocca adesso: quella del momento che stai vivendo se e'
     ancora da fare; altrimenti la prima rimasta, in ordine di giornata */
  function scegli(righe) {
    var adesso = oraAdesso();
    var i;
    for (i = 0; i < righe.length; i++) {
      if (!righe[i].letto && righe[i].momento === adesso) return righe[i];
    }
    for (i = 0; i < righe.length; i++) {
      if (!righe[i].letto) return righe[i];
    }
    return null;
  }

  function costruisci() {
    var b = document.createElement('button');
    b.type = 'button';
    b.id = ID;
    b.className = BTN;
    b.innerHTML =
      '<span class="' + BTN + '-riga"><i></i>' +
      '<span class="' + BTN + '-testo"></span></span>' +
      '<span class="' + BTN + '-spiega"></span>';
    return b;
  }

  /* Scrive solo se il testo cambia — ma il confronto si fa con quello che
     VOGLIAMO scrivere, non con quello che si legge: se la lingua non è
     l'italiano, il nodo contiene già la traduzione, e confrontarsi con il testo
     visibile farebbe riscrivere «Conferma Aurora» sopra «Confirm Dawn» a ogni
     giro, per sempre. L'italiano voluto si ricorda in un attributo, che nessuna
     traduzione tocca. */
  function testo(el, t) {
    if (!el) return;
    if (el.getAttribute('data-t') === t) return;
    el.setAttribute('data-t', t);
    el.textContent = t;
  }

  var occupato = false;   /* evita che l'osservatore si richiami da solo */

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try {
      sistemaOra();
      var stato = leggiRighe();
      var b = document.getElementById(ID);
      var card = document.querySelector('.card.today');

      if (!stato || !card) {
        if (b) b.remove();
        return;
      }

      if (!b) b = costruisci();
      /* dopo la scheda: e' il posto in cui nel prototipo sta l'azione */
      if (b.previousElementSibling !== card || b.parentElement !== card.parentElement) {
        card.parentElement.insertBefore(b, card.nextSibling);
      }

      var scelta = scegli(stato.righe);
      var testoEl = b.querySelector('.' + BTN + '-testo');
      var spiegaEl = b.querySelector('.' + BTN + '-spiega');
      var fatte = stato.righe.filter(function (r) { return r.letto; }).length;

      var t1, t2;
      if (!scelta) {
        b.disabled = true;
        t1 = 'Giornata completata';
        t2 = 'Hai segnato tutte e ' + stato.righe.length +
          ' le letture di oggi. Torna domani: la serie continua.';
      } else {
        b.disabled = false;
        t1 = 'Conferma ' + scelta.nome;
        var resto = stato.righe.length - fatte;
        if (resto === 1) {
          t2 = 'Resta solo ' + scelta.nome + '.';
        } else if (fatte > 0) {
          t2 = 'Ancora ' + resto + ' letture oggi · tocca per segnare ' + scelta.nome + '.';
        } else {
          t2 = 'Adesso è il momento di ' + scelta.nome + '.';
        }
      }
      if (b.disabled) b.setAttribute('data-completo', 'sì');
      else b.removeAttribute('data-completo');
      testo(testoEl, t1);
      testo(spiegaEl, t2);
      var etichetta = t1 + ' — ' + t2;
      if (b.getAttribute('aria-label') !== etichetta) b.setAttribute('aria-label', etichetta);
      var momento = scelta ? (scelta.momento || '') : '';
      if (b.getAttribute('data-momento') !== momento) b.setAttribute('data-momento', momento);
    } finally {
      occupato = false;
    }
  }

  function premi() {
    var stato = leggiRighe();
    if (!stato) return;
    var scelta = scegli(stato.righe);
    if (!scelta) return;
    /* il gesto vero: la casella dell'app, non una scrittura nei dati */
    scelta.casella.click();
    aggiorna();
  }

  function avvia() {
    /* delegato: il pulsante viene creato e ricreato, il gestore resta valido */
    document.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== document) {
        if (t.id === ID) { premi(); return; }
        t = t.parentNode;
      }
    });

    /* le caselle possono cambiare per mano dell'app (o di un'altra scheda):
       si ascolta il cambiamento, che parte sempre da una casella vera */
    document.addEventListener('change', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('chk')) aggiorna();
    }, true);

    /* le schede si aprono e si chiudono, e l'app ridisegna: ci si rimette */
    if (window.MutationObserver) {
      var inCoda = false;
      var osservatore = new MutationObserver(function () {
        if (inCoda) return;
        inCoda = true;
        setTimeout(function () { inCoda = false; aggiorna(); }, 120);
      });
      osservatore.observe(document.body, { childList: true, subtree: true });
    }

    guardiaOra();

    /* se cambia la lingua, il pulsante si riscrive con il nome tradotto */
    document.addEventListener('aurora-lingua', aggiorna);

    /* l'ora cambia mentre l'app e' aperta: alle 11 il pulsante deve dire
       «Conferma Mezzodì», non restare su Aurora */
    setInterval(aggiorna, 60000);

    aggiorna();
    /* la prima volta l'app puo' finire di disegnare dopo di noi */
    setTimeout(aggiorna, 400);
    setTimeout(aggiorna, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }
})();
