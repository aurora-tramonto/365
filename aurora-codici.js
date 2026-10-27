/* ============================================================================
   AURORA CODICI — un solo codice, non due
   ============================================================================
   In Impostazioni il codice compare due volte, e sembra un errore:

     · «I tuoi dati»            → genera e ripristina il codice del piano
     · «Importa dalla versione locale» → incolla un codice della vecchia pagina

   Non è un errore: la seconda card legge i codici della pagina HTML che c'era
   prima dell'app (un formato diverso, con `d0`, `d1`, `d2`). Ma quella pagina
   non esiste più da tempo, e a chiunque altro le due card sembrano la stessa
   cosa scritta due volte — con un campo uguale in mezzo alle altre schede.

   Che cosa fa questo modulo, in una frase: nasconde la seconda card, così il
   campo del codice resta uno solo, quello di «I tuoi dati».

   Chi ha ancora un codice della vecchia pagina non resta fuori: aprendo l'app
   con `?codice-vecchio=1` la card torna, e da lì si importa come prima.

   Non tocca il piano, non legge e non salva niente: aggiunge una classe e
   basta. Se non parte, l'app resta esattamente come prima (due campi).
   ============================================================================ */

(function () {
  'use strict';

  var CLASSE = 'aurora-codici-via';
  var VECCHIO = /(?:\?|&)codice-vecchio=1(?:&|$)/.test(location.search);

  if (VECCHIO) return;          // chi ha un codice vecchio trova ancora la card

  /* Il titolo e il segnaposto del campo, in tutte e quattro le lingue: la card
     la scrive l'app e la traduce il motore delle lingue, quindi cercarla in
     italiano soltanto funzionerebbe solo a metà. */
  function varianti(chiave) {
    var fuori = [chiave];
    var D = window.AURORA_LINGUE;
    var v = D && D.diz ? D.diz[chiave] : null;
    if (v) fuori = fuori.concat(v.split('|'));
    return fuori.map(function (t) { return t.trim().toLowerCase(); }).filter(Boolean);
  }

  var TITOLI = varianti('Importa dalla versione locale');
  var CAMPI = varianti('Incolla il codice della versione locale');

  function eLaCard(card) {
    var h = card.querySelector('h2');
    if (h && TITOLI.indexOf((h.textContent || '').trim().toLowerCase()) >= 0) return true;
    /* secondo indizio: il campo, se il titolo non fosse ancora tradotto */
    var campi = card.querySelectorAll('textarea, input[type="text"]');
    for (var i = 0; i < campi.length; i++) {
      var p = (campi[i].getAttribute('placeholder') || '').trim().toLowerCase();
      if (p && CAMPI.indexOf(p) >= 0) return true;
    }
    return false;
  }

  function nascondi() {
    var cards = document.querySelectorAll('main .card');
    for (var i = 0; i < cards.length; i++) {
      if (!eLaCard(cards[i])) continue;
      if (!cards[i].classList.contains(CLASSE)) cards[i].classList.add(CLASSE);
    }
  }

  /* React ridisegna le schede a ogni cambio di scheda: la card nascosta torna
     nel documento nuova, senza la classe. Quindi si riguarda, ma non a ogni
     briciola di DOM: solo quando qualcosa è davvero cambiato. */
  var inCoda = 0;
  function fraPoco() {
    if (inCoda) return;
    inCoda = setTimeout(function () { inCoda = 0; nascondi(); }, 120);
  }

  function avvia() {
    if (!document.body) return;
    nascondi();

    if (window.MutationObserver) {
      var o = new MutationObserver(fraPoco);
      o.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', nascondi);
    setTimeout(nascondi, 400);
    setTimeout(nascondi, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }
})();
