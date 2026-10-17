/* ============================================================================
   AURORA INIZI — «Scegli da quale libro parte ogni lettura»
   ============================================================================
   Nelle Impostazioni si può dire da quale libro comincia ogni lettura. L'app
   però non accetta tutto: un libro può essere l'inizio di UNA sola lettura, e
   solo se quella che lo possiede non è già stata sistemata prima (le letture
   vengono servite in ordine, dalla prima all'ultima).

   Il guaio è che quando una scelta non si può fare l'app la ignora in silenzio:
   il menù resta su «Genesi», la riga sotto continua a dire «inizia da: Matteo 1»
   e non c'è un solo messaggio che spieghi perché. Chi prova a mettere lo stesso
   libro su tutte le letture vede che «non lo fa» e non sa cosa ha sbagliato.

   Qui non si tocca la scelta di nessuno: si legge quello che l'app ha già
   scritto sotto ogni menù («inizia da: …») e, quando non corrisponde a quello
   che è stato scelto, si scrive il perché — con il libro che verrà usato davvero
   e con il modo per ottenere quello che si voleva.

   Nessuna scrittura nel piano, nessuna modifica ai menù: solo una riga di
   spiegazione, che sparisce appena la scelta ridiventa possibile.
   ============================================================================ */

(function () {
  'use strict';

  var ID = 'aurora-inizi';
  var ATTESA = 120;                 // il ridisegno dell'app non è istantaneo

  /* il testo italiano di un nodo, anche se sullo schermo è tradotto */
  function testoItaliano(nodo) {
    try {
      var L = window.AuroraLingua;
      if (L && L.italiano) return L.italiano(nodo) || '';
    } catch (e) {}
    return (nodo && nodo.textContent) || '';
  }

  /* ------------------------------------------------------------- leggere la riga */

  /* Il menù dell'app è dentro un <label class="sp">: nome del momento, menù, e
     sotto la riga «inizia da: Matteo 1» (o «tutto già letto»). Quella riga è
     l'unica verità disponibile: è il piano che l'app userebbe DAVVERO. */
  function righe(blocco) {
    var etichette = blocco.querySelectorAll('label.sp');
    var fuori = [];
    for (var i = 0; i < etichette.length; i++) {
      var l = etichette[i];
      var sel = l.querySelector('select');
      if (!sel) continue;
      var nome = l.querySelector('span');
      var piccolo = l.querySelector('small');
      /* La riga «inizia da: Matteo 1» può essere tradotta sullo schermo
         («starts at: Matthew 1»): qui serve l'originale, perché va confrontata
         con il valore dei menù e con i dati dell'app, che sono italiani. */
      var testo = piccolo ? testoItaliano(piccolo).replace(/\s+/g, ' ').trim() : '';
      /* Il libro che l'app userà davvero: la riga è «…: Matteo 1» in tutte e
         quattro le lingue, quindi si prende quello che sta dopo i due punti. */
      var vero = null;
      var m = testo.match(/[:：]\s*(.+)$/);
      if (m) vero = m[1].trim();
      fuori.push({
        nome: nome ? nome.textContent.trim() : '',
        scelta: sel.value || '',
        vero: vero,
        tutto: !m && /./.test(testo)      // «tutto già letto»: nessun libro, e lo dice
      });
    }
    return fuori;
  }

  /* «ok» = la scelta verrà rispettata · «ignorata» = il libro è già di un'altra
     lettura · «vuoto» = questa lettura non ha più niente da leggere */
  function esito(r) {
    if (!r.scelta) return 'ok';
    if (r.tutto) return 'vuoto';
    if (r.vero === null) return 'ok';
    if (r.vero === r.scelta || r.vero.indexOf(r.scelta + ' ') === 0) return 'ok';
    return 'ignorata';
  }

  /* ------------------------------------------------------------------ il testo */

  var FR_TITOLO = 'Una lettura non può cominciare da un libro che è già l\'inizio di un\'altra: le scelte qui sotto restano senza effetto.';
  var FR_IGNORATA = 'non può cominciare da qui: è già l\'inizio di un\'altra lettura. Questa lettura resta da';
  var FR_VUOTO = 'non può cominciare da qui: questa lettura ha già letto tutto.';
  var FR_RIMEDIO = 'Per farlo cominciare da qui, metti «Come da piano» nella lettura che lo comincia adesso.';

  function pezzo(tag, testo, classe) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    e.textContent = testo;
    return e;
  }

  function costruisci(righe) {
    var p = document.createElement('p');
    p.className = 'msg err aurora-inizi';
    p.id = ID;
    p.setAttribute('role', 'status');

    p.appendChild(pezzo('span', FR_TITOLO, 'aurora-inizi-titolo'));

    for (var i = 0; i < righe.length; i++) {
      var r = righe[i];
      var d = pezzo('span', '', 'aurora-inizi-riga');
      d.appendChild(pezzo('b', r.nome));
      d.appendChild(document.createTextNode(': '));
      d.appendChild(pezzo('b', r.scelta));
      d.appendChild(pezzo('span', ' ' + (r.motivo === 'vuoto' ? FR_VUOTO : FR_IGNORATA) + ' '));
      if (r.motivo !== 'vuoto') {
        d.appendChild(pezzo('b', r.vero));
        d.appendChild(document.createTextNode('.'));
      }
      p.appendChild(d);
    }

    /* Il rimedio si scrive solo quando serve a qualcosa: se nessuna scelta è
       stata ignorata, non c'è niente da rimediare. */
    var ignorate = righe.filter(function (r) { return r.motivo === 'ignorata'; });
    if (ignorate.length) p.appendChild(pezzo('span', FR_RIMEDIO, 'aurora-inizi-rimedio'));
    return p;
  }

  /* Firma delle righe da avvisare: serve a capire se c'è qualcosa di nuovo da
     dire. Se è la stessa di prima non si scrive niente — e quindi il giro non
     si richiama da solo. */
  function firma(righe) {
    var a = [];
    for (var i = 0; i < righe.length; i++) {
      a.push(righe[i].nome + '|' + righe[i].scelta + '|' + righe[i].vero + '|' + righe[i].motivo);
    }
    return a.join('§');
  }

  /* ------------------------------------------------------------------- il giro */

  var ultima = null;

  function blocco() {
    var tutti = document.querySelectorAll('.startp');
    for (var i = 0; i < tutti.length; i++) {
      if (tutti[i].querySelector('select')) return tutti[i];
    }
    return null;
  }

  function aggiorna() {
    var b = blocco();
    var avviso = document.getElementById(ID);

    if (!b) {
      ultima = null;
      if (avviso && avviso.parentNode) avviso.parentNode.removeChild(avviso);
      return;
    }

    var lette = righe(b);
    var problemi = [];
    for (var i = 0; i < lette.length; i++) {
      var e = esito(lette[i]);
      if (e !== 'ok') {
        problemi.push({
          nome: lette[i].nome,
          scelta: lette[i].scelta,
          vero: lette[i].vero,
          motivo: e
        });
      }
    }

    var nuova = firma(problemi);
    if (nuova === ultima && avviso && avviso.parentNode === b) return;
    ultima = nuova;

    if (avviso && avviso.parentNode) avviso.parentNode.removeChild(avviso);
    if (!problemi.length) return;

    b.appendChild(costruisci(problemi));
  }

  /* L'app ridisegna la riga «inizia da: …» a ogni cambio di menù: si aspetta un
     attimo e poi si guarda il risultato, senza mai scrivere dentro i menù. */
  var inCoda = 0;
  function fraPoco() {
    if (inCoda) return;
    inCoda = setTimeout(function () {
      inCoda = 0;
      aggiorna();
    }, ATTESA);
  }

  function avvia() {
    if (!document.body) return;
    aggiorna();

    /* i cambi dei menù (anche da tastiera) */
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.tagName === 'SELECT' && t.closest && t.closest('.startp')) fraPoco();
    }, true);

    /* il ridisegno dell'app: cambia la riga sotto il menù, o cambia il numero di
       letture (1…5) e con esso le righe */
    if (window.MutationObserver) {
      /* Le modifiche nostre (l'avviso che entra o esce) non devono far partire
         un altro giro: si riconoscono da sé, perché l'unico nodo che tocchiamo
         è quello con id `aurora-inizi` e i suoi figli. */
      var nostro = function (rec) {
        var n = rec.target;
        var dentro = n.nodeType === 1 ? n : n.parentElement;
        if (dentro && dentro.closest && dentro.closest('#' + ID)) return true;
        var toccati = [].slice.call(rec.addedNodes || []).concat([].slice.call(rec.removedNodes || []));
        if (!toccati.length) return false;
        for (var i = 0; i < toccati.length; i++) {
          if (!(toccati[i].nodeType === 1 && toccati[i].id === ID)) return false;
        }
        return true;
      };
      var o = new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) {
          if (!nostro(recs[i])) { fraPoco(); return; }
        }
      });
      o.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    window.addEventListener('load', aggiorna);
    setTimeout(aggiorna, 300);
    setTimeout(aggiorna, 1200);
    setTimeout(aggiorna, 2500);

    /* la lingua cambia: le frasi dell'avviso si ritraducono da sole (passano dal
       dizionario come tutto il resto), ma il rimedio va ricalcolato se serve */
    document.addEventListener('aurora-lingua', fraPoco);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* sportello per il collaudo */
  window.AuroraInizi = {
    aggiorna: aggiorna,
    righe: function () {
      var b = blocco();
      return b ? righe(b) : [];
    }
  };
})();
