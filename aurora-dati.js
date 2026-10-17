/* ============================================================================
   AURORA DATI — dove vive il tuo piano
   ============================================================================
   Senza accesso il piano vive in un posto solo: questo browser, su questo
   telefono. Svuotare i dati del browser, cambiare telefono o perderlo significa
   perderlo per davvero, e la cosa non è detta da nessuna parte in modo chiaro:
   la card «Salvataggi automatici» spiega le copie interne, non il rischio.

   Questo modulo lo dice, con i fatti e non con le paure:
     - se non c'è un file di backup recente, dice cosa si perde e cosa fare;
     - se il file c'è (salvato da meno di 21 giorni, come li conta l'app), lo
       dice, e smette di insistere;
     - se c'è l'accesso, dice che il piano è anche nell'account e che su un
       altro telefono basta entrare con lo stesso indirizzo;
     - la riga in cima a «Oggi» compare solo quando il rischio è vero: c'è
       qualcosa da perdere (almeno una lettura segnata), non c'è un file recente
       e non c'è un accesso. E sparisce da sola appena salvi una copia.
   Non tocca il piano, non salva niente di suo tranne la data del «Non ora».
   ============================================================================ */

(function () {
  'use strict';

  var ID_CARD = 'aurora-dati';
  var ID_AVVISO = 'aurora-dati-avviso';
  var CHIAVE_ZITTO = 'aut_dati_avviso';   // quando hai detto «Non ora»
  var CHIAVE_PIANO = 'aut_local';
  var CHIAVE_FILE = 'aut_local_lastfile';
  var GIORNI_RECENTE = 21;                // come l'app: oltre 21 giorni non è più recente
  var GIORNI_ZITTO = 30;                  // «Non ora» vale un mese
  var GIORNO = 86400000;

  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function scrivi(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ------------------------------------------------------------- leggere lo stato */

  function piano() {
    try { return JSON.parse(leggi(CHIAVE_PIANO) || 'null'); } catch (e) { return null; }
  }

  /* quante letture sono state segnate: se è zero non c'è ancora niente da perdere */
  function segnate(p) {
    if (!p) return 0;
    var n = 0;
    var gruppi = ['done', 'pre', 'extra'];
    for (var g = 0; g < gruppi.length; g++) {
      var v = p[gruppi[g]];
      if (!v) continue;
      if (gruppi[g] === 'done') {
        for (var i = 0; i < v.length; i++) n += (v[i] || []).length;
      } else {
        n += v.length;
      }
    }
    return n;
  }

  function ultimoFile() {
    var v = Number(leggi(CHIAVE_FILE) || 0);
    return isFinite(v) && v > 0 ? v : 0;
  }

  function fileRecente() {
    var u = ultimoFile();
    return !!u && Date.now() - u < GIORNI_RECENTE * GIORNO;
  }

  /* L'accesso c'è solo se il modulo di sincronizzazione è configurato: senza
     chiavi Firebase `window.AuroraSync` non esiste affatto. */
  function accesso() {
    var S = window.AuroraSync;
    if (!S || !S.stato) return { disponibile: false, utente: null };
    try {
      var s = S.stato();
      return { disponibile: true, utente: s.utente || null, stato: s.stato };
    } catch (e) {
      return { disponibile: false, utente: null };
    }
  }

  function zitto() {
    var v = Number(leggi(CHIAVE_ZITTO) || 0);
    return !!v && Date.now() - v < GIORNI_ZITTO * GIORNO;
  }

  /* ---------------------------------------------------------------- i mattoni */

  function pezzo(tag, testo, classe) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo != null) e.textContent = testo;
    return e;
  }

  function tasto(testo, azione, classe) {
    var b = pezzo('button', testo, classe || 'chip aurora-dati-tasto');
    b.type = 'button';
    b.addEventListener('click', azione);
    return b;
  }

  /* La card dell'app con un certo titolo, in qualunque delle quattro lingue:
     il testo lo prende dal dizionario, così non ci sono titoli scritti a mano
     qui dentro che possano invecchiare. */
  function titoloInTutteLeLingue(chiave) {
    var fuori = [chiave];
    var D = window.AURORA_LINGUE;
    var v = D && D.diz ? D.diz[chiave] : null;
    if (v) fuori = fuori.concat(v.split('|'));
    return fuori.map(function (t) { return t.trim().toLowerCase(); });
  }

  function cardCon(chiave) {
    var voluti = titoloInTutteLeLingue(chiave);
    var cards = document.querySelectorAll('main .card');
    for (var i = 0; i < cards.length; i++) {
      var h = cards[i].querySelector('h2');
      if (!h) continue;
      var t = (h.textContent || '').trim().toLowerCase();
      if (voluti.indexOf(t) >= 0) return cards[i];
    }
    return null;
  }

  /* Porta la persona al file di backup e lo accende per un momento: così si
     capisce quale voce serve, senza duplicare qui l'esportazione dell'app. */
  var lampo = 0;
  function vaiAlFile(tentativi) {
    tentativi = tentativi || 0;
    var c = cardCon('File di backup');
    if (!c) {
      /* La card vive nelle Impostazioni: se siamo in un'altra scheda le sue
         card non sono nemmeno nel documento. Si cambia scheda e si riprova
         (l'ultimo pulsante della barra è sempre «Impostazioni»). */
      if (tentativi < 6) {
        var tasti = document.querySelectorAll('.tabs button');
        if (tasti.length) {
          tasti[tasti.length - 1].click();
          setTimeout(function () { vaiAlFile(tentativi + 1); }, 450);
        }
      }
      return;
    }
    c.scrollIntoView({ block: 'center', behavior: 'smooth' });
    c.classList.add('aurora-dati-lampo');
    if (lampo) clearTimeout(lampo);
    lampo = setTimeout(function () { c.classList.remove('aurora-dati-lampo'); }, 2600);
  }

  /* -------------------------------------------------------------------- la card */

  var FR_NIENTE = 'Non hai un accesso, e va benissimo: tutto funziona lo stesso. Ma il piano è salvato solo dentro questo browser, su questo telefono: non esiste da nessun\'altra parte.';
  var FR_FILE_NO = 'Non hai un file di backup recente. Se svuoti i dati del browser, cambi telefono o perdi il telefono, il piano non si può recuperare.';
  var FR_FILE_SI = 'Hai salvato un file di backup da poco: quella è la tua copia di sicurezza. Tienila dove tieni le cose importanti.';
  var FR_FACOLTATIVO = 'L\'accesso è facoltativo: serve solo a ritrovare il piano su un altro telefono, e a non perderlo se questo si rompe.';
  var FR_ACCESSO_SI = 'Hai l\'accesso: il piano è anche nel tuo account. Su un altro telefono, entra con lo stesso indirizzo e lo ritrovi.';
  var FR_VAI = 'Portami al file di backup';
  var FR_ENTRA = 'Accedi con Google';

  function costruisciCard() {
    var card = pezzo('div', null, 'card');
    card.id = ID_CARD;
    card.appendChild(pezzo('h2', 'Dove vive il tuo piano'));

    var a = accesso();

    if (a.utente) {
      card.appendChild(pezzo('p', FR_ACCESSO_SI, 'msg'));
      return card;
    }

    card.appendChild(pezzo('p', FR_NIENTE, 'msg'));
    card.appendChild(pezzo('p', fileRecente() ? FR_FILE_SI : FR_FILE_NO, 'msg' + (fileRecente() ? '' : ' err')));

    var riga = pezzo('div', null, 'chips aurora-dati-riga');
    riga.appendChild(tasto(FR_VAI, function () { vaiAlFile(); }));
    if (a.disponibile) {
      riga.appendChild(tasto(FR_ENTRA, function () { window.AuroraSync.accedi(); }));
    }
    card.appendChild(riga);

    if (a.disponibile) card.appendChild(pezzo('p', FR_FACOLTATIVO, 'msg'));
    return card;
  }

  /* ---------------------------------------------------------------- l'avviso */

  var FR_AVVISO = 'Questo piano esiste solo su questo telefono: salvane una copia, o accedi per ritrovarlo ovunque.';
  var FR_NON_ORA = 'Non ora';
  var FR_SALVA = 'Salva una copia';

  function costruisciAvviso() {
    var p = pezzo('div', null, 'card aurora-dati-avviso');
    p.id = ID_AVVISO;
    p.setAttribute('role', 'status');
    p.appendChild(pezzo('p', FR_AVVISO, 'msg'));
    var riga = pezzo('div', null, 'chips aurora-dati-riga');
    riga.appendChild(tasto(FR_SALVA, function () { vaiAlFile(); }, 'chip aurora-dati-tasto pri'));
    riga.appendChild(tasto(FR_NON_ORA, function () {
      scrivi(CHIAVE_ZITTO, String(Date.now()));
      aggiorna();
    }, 'chip aurora-dati-tasto'));
    p.appendChild(riga);
    return p;
  }

  /* -------------------------------------------------------------- il posto giusto */

  /* Rimettere a posto la card vuol dire spostarla, e una card spostata fa
     ripartire la sua animazione d'ingresso: quindi si tocca solo se il posto è
     davvero sbagliato, e solo quando c'è qualcosa di nuovo da dire. */
  /* La card vive nelle Impostazioni e in nessun altro posto: se la scheda
     aperta non è quella, l'ancora non c'è e la card non deve esistere. (Senza
     questo controllo finiva in fondo anche a «Oggi», dove non c'entra niente.) */
  function posizionaCard(mia) {
    var dove = cardCon('I tuoi dati') || cardCon('File di backup');
    if (!dove) {
      if (mia.parentElement) mia.parentElement.removeChild(mia);
      firmaCard = null;
      return;
    }
    if (dove.nextElementSibling === mia) return;
    dove.parentElement.insertBefore(mia, dove.nextElementSibling);
  }

  /* -------------------------------------------------------------------- il giro */

  var occupato = false;
  var firmaCard = null;

  function aggiorna() {
    if (occupato) return;
    occupato = true;
    try {
      var a = accesso();
      var oggi = document.querySelector('main .card.today');
      var serve = !!oggi && !a.utente && segnate(piano()) > 0 && !fileRecente() && !zitto();

      /* la card: si rifà solo se una delle tre cose che dice è cambiata */
      var seg = (a.utente ? (a.utente.email || 'acceso') : 'senza') + '|' +
        (a.disponibile ? 'auth' : 'noauth') + '|' + (fileRecente() ? 'file' : 'nofile');
      var dove = cardCon('I tuoi dati') || cardCon('File di backup');
      var mia = document.getElementById(ID_CARD);
      if (!dove) {
        if (mia && mia.parentElement) mia.parentElement.removeChild(mia);
        firmaCard = null;
      } else {
        if (!mia) {
          mia = costruisciCard();
          dove.parentElement.insertBefore(mia, dove.nextElementSibling);
          firmaCard = seg;
        } else if (seg !== firmaCard) {
          if (mia.parentElement) mia.parentElement.replaceChild(costruisciCard(), mia);
          firmaCard = seg;
        }
        if (mia && mia.parentElement) posizionaCard(mia);
      }

      /* la riga in cima a «Oggi»: vive solo quando c'è qualcosa da perdere */
      var mio = document.getElementById(ID_AVVISO);
      var main2 = document.querySelector('main');
      if (!serve || !main2) {
        if (mio && mio.parentElement) mio.parentElement.removeChild(mio);
      } else {
        if (!mio) mio = costruisciAvviso();
        if (main2.firstElementChild !== mio) main2.insertBefore(mio, main2.firstElementChild);
      }
    } finally {
      occupato = false;
    }
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
          if (dentro && dentro.closest && dentro.closest('#' + ID_CARD + ',#' + ID_AVVISO)) continue;
          fraPoco();
          return;
        }
      });
      o.observe(document.body, { childList: true, subtree: true });
    }

    /* il file di backup è un fatto che accade fuori dal DOM: si ricontrolla ogni
       tanto, e comunque quando si torna sulla pagina */
    setInterval(function () { if (!document.hidden) aggiorna(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) aggiorna(); });

    window.addEventListener('load', aggiorna);
    setTimeout(aggiorna, 400);
    setTimeout(aggiorna, 1500);
    setTimeout(aggiorna, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  window.AuroraDati = {
    aggiorna: aggiorna,
    segnate: function () { return segnate(piano()); },
    fileRecente: fileRecente,
    accesso: accesso
  };
})();
