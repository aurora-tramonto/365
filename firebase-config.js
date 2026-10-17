/* ============================================================================
   AURORA — configurazione pubblica di Firebase
   ============================================================================
   COME SI USA (la guida passo passo è in proposte/accesso-come-si-fa.md)
   1. Crea il progetto Firebase e l'applicazione web.
   2. Copia l'oggetto `firebaseConfig` che Firebase ti mostra e incollalo qui
      sotto, al posto del segnaposto: le sei voci, tutte e sei.
   3. Da terminale, nella cartella del progetto:

        python3 proposte/applica-interfaccia.py

      Lo strumento si accorge che la configurazione è vera e la inserisce in
      index.html. Da quel momento l'accesso con Google è attivo.

   QUESTE CHIAVI SONO PUBBLICHE — e va bene così
   Firebase è fatto apposta perché questo oggetto stia nel sito: identifica il
   progetto, non autorizza niente da solo. Chi protegge i dati sono le regole di
   sicurezza di Firestore (ogni utente vede solo i suoi dati). Quello che NON
   deve mai finire qui — né nel sito, né su GitHub — è una chiave di servizio
   (`private_key`, `serviceAccount`): quella dà accesso a tutto.

   FINCHÉ C'È IL SEGNAPOSTO NON SUCCEDE NIENTE
   Lo strumento riconosce il segnaposto e non inserisce la configurazione: il
   modulo resta spento, la striscia non compare e nessuno contatta la rete.
   Se dopo averla compilata il comando dice ancora «assenti», vuol dire che una
   delle sei voci è rimasta al segnaposto: il messaggio ti dice quale.
   ============================================================================ */

window.AURORA_FIREBASE = {
  /* Sostituisci ciascun valore con quello che Firebase ti ha dato.
     Il segnaposto da rimpiazzare si chiama INCOLLA_QUI — compare fra le
     virgolette alle sei righe qui sotto, e da nessun'altra parte. */
  apiKey: "INCOLLA_QUI",
  authDomain: "INCOLLA_QUI.firebaseapp.com",
  projectId: "INCOLLA_QUI",
  storageBucket: "INCOLLA_QUI.appspot.com",
  messagingSenderId: "INCOLLA_QUI",
  appId: "INCOLLA_QUI"
};
