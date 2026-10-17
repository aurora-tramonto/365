/* ============================================================================
   AURORA LOGO — il marchio che si accende
   ============================================================================
   Scelta: «alba e tramonto».
     · le due luci dei lati salgono sull'arco verso il centro e tornano;
     · quella di mezzo respira;
     · il segno si illumina per un attimo.

   Perché non è solo CSS (e perché è meglio così): i tre puntini sono <circle>
   dentro l'SVG della testata, e l'app li usa anche per l'entrata del marchio
   (`.ld` con `transform-box: fill-box`). Ruotarli con `transform` vorrebbe dire
   spostare anche il loro centro di scala, e l'entrata partirebbe dal centro
   dell'arco. Qui si muovono invece le coordinate: cx/cy calcolate sull'arco,
   quindi il puntino resta ESATTAMENTE sulla linea, per costruzione.

   Quando parte: al passaggio del mouse sul marchio o sul titolo (sono dentro lo
   stesso .brand), e una volta sola all'apertura — anche sul telefono, dove il
   mouse non c'è. Chi ha chiesto al telefono di ridurre i movimenti non vede
   nessuno spostamento: solo la luce che si accende.

   Non tocca lo stato dell'app, non scrive niente, non chiede niente.
   ============================================================================ */

(function () {
  'use strict';

  var DURATA = 1150;          // ms, andata e ritorno
  var ATTESA = 1250;          // ms dall'apertura: dopo l'entrata del marchio
  var CX = 24, CY = 33, R = 16;
  var GRADI = Math.PI / 180;
  var CLASS = 'aurora-logo-acceso';

  var inCorso = false;
  var timer = 0;

  function ridotto() {
    return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function logo() { return document.querySelector('.brand .logo'); }

  function gradiDa(cx, cy) {
    // angolo sul cerchio, in gradi, con lo zero a destra e il senso antiorario
    return Math.atan2(CY - cy, cx - CX) / GRADI;
  }

  function punto(a, r) {
    var raggio = r == null ? R : r;
    return {
      x: CX + raggio * Math.cos(a * GRADI),
      y: CY - raggio * Math.sin(a * GRADI)
    };
  }

  /* Un giro: 0 → 1 → 0 con partenza e arrivo morbidi (niente scatto all'inizio) */
  function onda(t) {
    return (1 - Math.cos(2 * Math.PI * t)) / 2;
  }

  function suona() {
    var svg = logo();
    if (!svg || inCorso) return;
    var a = svg.querySelector('.l0');   // alba, a sinistra
    var b = svg.querySelector('.l1');   // mezzodì
    var c = svg.querySelector('.l2');   // tramonto, a destra
    if (!a || !b || !c) return;

    inCorso = true;
    svg.classList.add(CLASS);

    if (ridotto()) {
      /* nessun movimento: solo la luce, e si spegne da sola */
      clearTimeout(timer);
      timer = setTimeout(function () {
        svg.classList.remove(CLASS);
        inCorso = false;
      }, 1000);
      return;
    }

    /* ogni puntino ha il suo raggio: si torna esattamente dov'era, senza
       spostare il marchio di un millimetro */
    var xa = Number(a.getAttribute('cx')), ya = Number(a.getAttribute('cy'));
    var xc = Number(c.getAttribute('cx')), yc = Number(c.getAttribute('cy'));
    var partenzaA = gradiDa(xa, ya);
    var partenzaC = gradiDa(xc, yc);
    var raggioA = Math.hypot(xa - CX, ya - CY);
    var raggioC = Math.hypot(xc - CX, yc - CY);
    var inizio = 0;

    function disegna(adesso) {
      if (!inizio) inizio = adesso;
      var t = Math.min(1, (adesso - inizio) / DURATA);
      var e = onda(t);

      var pa = punto(partenzaA - 22 * e, raggioA);   // l'alba sale verso il mezzodì
      var pc = punto(partenzaC + 22 * e, raggioC);   // il tramonto sale verso il mezzodì
      a.setAttribute('cx', pa.x.toFixed(3));
      a.setAttribute('cy', pa.y.toFixed(3));
      c.setAttribute('cx', pc.x.toFixed(3));
      c.setAttribute('cy', pc.y.toFixed(3));

      /* il puntino di mezzo respira: scala intorno al proprio centro.
         Si usa `scale`, non `transform`: l'entrata del marchio (`.ld`,)
         tiene `transform` occupato con fill-mode both, e con `scale`
         i due si sommano invece di darsi fastidio. */
      b.style.scale = String((1 + 0.26 * e).toFixed(3));

      if (t < 1) {
        requestAnimationFrame(disegna);
        return;
      }
      /* si torna esattamente dove si era partiti */
      a.setAttribute('cx', String(xa));
      a.setAttribute('cy', String(ya));
      c.setAttribute('cx', String(xc));
      c.setAttribute('cy', String(yc));
      b.style.scale = '';
      clearTimeout(timer);
      timer = setTimeout(function () {
        svg.classList.remove(CLASS);
        inCorso = false;
      }, 380);
    }

    requestAnimationFrame(disegna);
  }

  function avvia() {
    /* Sul telefono l'animazione è una sola, all'apertura: lì il "mouse" non
       esiste e un tocco non deve farla ripartire. */
    var colMouse = !window.matchMedia || matchMedia('(hover: hover)').matches;

    if (colMouse) {
      /* sulla testata intera, non sul solo logo: così vale anche per il titolo,
         e se l'app ridisegna la testata il listener resta al suo posto */
      document.addEventListener('mouseover', function (e) {
        var dentro = e.target && e.target.closest ? e.target.closest('.brand') : null;
        if (!dentro) return;
        var da = e.relatedTarget;
        if (da && dentro.contains(da)) return;   // si sta muovendo dentro il marchio
        suona();
      });
    }

    /* una volta all'apertura, quando il marchio ha finito di entrare */
    setTimeout(suona, ATTESA);

    /* se l'app ridisegna la testata e sostituisce l'SVG, il prossimo giro
       ritrova da solo i puntini: non c'è niente da riagganciare */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* utile per provarlo senza aspettare: window.AuroraLogo.prova() */
  window.AuroraLogo = { prova: suona };
})();
