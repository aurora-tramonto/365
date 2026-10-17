/* ============================================================================
   AURORA LINGUE — il dizionario
   ============================================================================
   Qui ci sono SOLO i testi dell'interfaccia. Non c'e' una parola dei titoli dei
   capitoli, dei nomi dei libri, dei numeri o delle date del piano: quelli sono
   dati, restano come sono, e viaggiano identici nel backup e nella
   sincronizzazione.

   Formato:  "testo italiano": "english|deutsch|español"
   L'ordine e' sempre lo stesso: inglese, tedesco, spagnolo.

   Le voci con numeri o nomi dentro non stanno qui: sono in MOD, con le
   parentesi che si riportano nella frase tradotta ($1, $2, …).
   ============================================================================ */

(function () {
  'use strict';

  var DIZ = {

    /* ------------------------------------------------------- schede e piè di pagina */
    "Oggi": "Today|Heute|Hoy",
    "Libri": "Books|Bücher|Libros",
    "Serie": "Streak|Serie|Racha",
    "Piano": "Plan|Plan|Plan",
    "Impostazioni": "Settings|Einstellungen|Ajustes",
    "Introduzione": "Introduction|Einführung|Introducción",
    "Ringraziamenti": "Thanks|Danksagung|Agradecimientos",
    "Contatti": "Contact|Kontakt|Contacto",
    "Privacy": "Privacy|Datenschutz|Privacidad",
    "piano di lettura biblica in più momenti del giorno": "a Bible reading plan for several moments of the day|ein Bibelleseplan für mehrere Tageszeiten|un plan de lectura bíblica en varios momentos del día",
    "Creato da": "Created by|Erstellt von|Creado por",

    /* --------------------------------------------------------------- i momenti */
    "Aurora": "Dawn|Morgendämmerung|Amanecer",
    "Mattino": "Morning|Morgen|Mañana",
    "Mezzodì": "Midday|Mittag|Mediodía",
    "Pomeriggio": "Afternoon|Nachmittag|Tarde",
    "Tramonto": "Sunset|Sonnenuntergang|Atardecer",
    "Sera": "Evening|Abend|Noche",
    "Giornata": "Day|Tag|Día",
    "di fila": "in a row|in Folge|seguidos",
    "record": "best|Rekord|récord",
    "giorni di fila": "days in a row|Tage in Folge|días seguidos",

    /* ------------------------------------------------------------------ Oggi */
    "Modifica": "Edit|Bearbeiten|Editar",
    "‹ precedente": "‹ previous|‹ zurück|‹ anterior",
    "successiva ›": "next ›|weiter ›|siguiente ›",
    "Spunta quando hai letto, poi usa i pulsanti per cambiare lettura. Ogni momento del giorno va per conto suo. Fine prevista:": "Tick when you have read, then use the buttons to change reading. Each moment of the day goes its own way. Expected finish:|Abhaken, wenn du gelesen hast; mit den Tasten wechselst du die Lesung. Jeder Tageszeitpunkt zählt für sich. Voraussichtliches Ende:|Marca cuando hayas leído y usa los botones para cambiar de lectura. Cada momento del día va por su cuenta. Fin previsto:",
    "Cambia il ritmo": "Change the pace|Tempo ändern|Cambiar el ritmo",
    "Giornata completata": "Day completed|Tag abgeschlossen|Día completado",

    /* ------------------------------------------------------------------ Libri */
    "letto": "read|gelesen|leído",
    "in parte": "partly|teilweise|en parte",
    "da leggere": "to read|zu lesen|por leer",
    "tocca un capitolo per segnarlo come già letto": "tap a chapter to mark it as read|tippe ein Kapitel an, um es als gelesen zu markieren|toca un capítulo para marcarlo como leído",
    "Antico Testamento": "Old Testament|Altes Testament|Antiguo Testamento",
    "Nuovo Testamento": "New Testament|Neues Testament|Nuevo Testamento",
    "libri finiti": "books finished|Bücher fertig|libros terminados",
    "lettura completata": "reading completed|Lesung abgeschlossen|lectura completada",
    "rileggi": "read again|erneut lesen|volver a leer",
    "annulla lettura": "unmark reading|Lesung zurücksetzen|quitar la lectura",

    /* ------------------------------------------------------------------ Serie */
    "Calendario": "Calendar|Kalender|Calendario",
    "Anno": "Year|Jahr|Año",
    "Mese": "Month|Monat|Mes",
    "Tutto": "All|Alles|Todo",
    "Mese precedente": "Previous month|Voriger Monat|Mes anterior",
    "Mese successivo": "Next month|Nächster Monat|Mes siguiente",
    "Vista calendario": "Calendar view|Kalenderansicht|Vista de calendario",
    "Sistema la tua serie": "Fix your streak|Serie einstellen|Ajusta tu racha",
    "Ho iniziato a leggere il": "I started reading on|Ich lese seit|Empecé a leer el",
    "Leggo di fila da (giorni, fino a ieri)": "Reading for (days, up to yesterday)|Lese seit (Tage, bis gestern)|Leo desde hace (días, hasta ayer)",
    "Se l’app non aveva registrato i tuoi giorni: indica quando hai iniziato e l’app segna come letti tutti i giorni da allora fino a ieri (presume che tu abbia letto ogni giorno). Oppure scrivi da quanti giorni leggi di fila. Se sbagli, usa “Annulla” nel messaggio in basso.": "If the app missed your days: say when you started and it will mark every day from then until yesterday as read (it assumes you read every day). Or type how many days in a row you have been reading. If you get it wrong, use “Undo” in the message below.|Falls die App deine Tage nicht erfasst hat: Gib an, wann du begonnen hast, und sie markiert alle Tage von da bis gestern als gelesen (sie geht davon aus, dass du jeden Tag gelesen hast). Oder gib ein, wie viele Tage du in Folge liest. Bei einem Fehler nutze „Rückgängig“ in der Meldung unten.|Si la app no registró tus días: indica cuándo empezaste y marcará como leídos todos los días desde entonces hasta ayer (supone que leíste cada día). O lo que llevas leyendo seguido. Si te equivocas, usa «Deshacer» en el mensaje de abajo.",

    /* ------------------------------------------------------------------ Piano */
    "Tocca una riga per portare qui la lettura. Se vai avanti, le letture che salti vengono segnate come lette (puoi annullare subito).": "Tap a row to bring that reading here. If you move forward, the readings you skip are marked as read (you can undo straight away).|Tippe eine Zeile an, um die Lesung hierher zu holen. Wenn du vorrückst, werden übersprungene Lesungen als gelesen markiert (du kannst es sofort rückgängig machen).|Toca una fila para traer aquí esa lectura. Si avanzas, las lecturas que saltas se marcan como leídas (puedes deshacerlo enseguida).",
    "Salta a un altro punto del piano": "Jump to another point in the plan|An eine andere Stelle des Plans springen|Saltar a otro punto del plan",
    "Se hai letto per conto tuo o ti sei perso, scrivi dove vuoi riprendere (es. Isaia 22 o Galati 5:1). Sposta solo il segnaposto: non segna nulla come letto.": "If you read on your own or got lost, type where you want to pick up (e.g. Isaiah 22 or Galatians 5:1). It only moves the bookmark: nothing is marked as read.|Wenn du auf eigene Faust gelesen hast oder den Faden verloren hast, schreibe, wo du weiterlesen willst (z. B. Jesaja 22 oder Galater 5,1). Es verschiebt nur das Lesezeichen: nichts wird als gelesen markiert.|Si has leído por tu cuenta o te has perdido, escribe dónde quieres retomar (p. ej. Isaías 22 o Gálatas 5:1). Solo mueve el marcador: no marca nada como leído.",
    "Salta qui": "Jump here|Hierhin springen|Saltar aquí",
    "Non ho finito: mi sono fermato al versetto": "I did not finish: I stopped at the verse|Ich bin nicht fertig: ich blieb beim Vers stehen|No he terminado: me detuve en el versículo",
    "Libro capitolo:versetto": "Book chapter:verse|Buch Kapitel:Vers|Libro capítulo:versículo",

    /* ------------------------------------------- il salto di lettura (aurora-salta) */
    "Dove sei arrivato?": "Where are you?|Wo bist du?|¿Dónde estás?",
    "es. Isaia 22:15": "e.g. Isaiah 22:15|z. B. Jesaja 22,15|p. ej. Isaías 22:15",
    "Segna e riprendi": "Mark and continue|Markieren und weiter|Marcar y seguir",
    "Riprendi da qui": "Continue from here|Hier weiterlesen|Seguir desde aquí",
    "Sei già qui": "You are already here|Du bist schon hier|Ya estás aquí",
    "Scrivi un libro, un capitolo o un versetto — anche solo «Isaia», se ti basta.": "Type a book, a chapter or a verse — even just “Isaiah”, if that is enough.|Schreibe ein Buch, ein Kapitel oder einen Vers — auch nur „Jesaja“, wenn dir das reicht.|Escribe un libro, un capítulo o un versículo — aunque solo «Isaías», si te basta.",
    "Non riesco a leggere questo punto. Prova «Isaia 22» o «Galati 5:1».": "I cannot read this point. Try “Isaiah 22” or “Galatians 5:1”.|Ich kann diese Stelle nicht lesen. Versuche „Jesaja 22“ oder „Galater 5,1“.|No entiendo este punto. Prueba «Isaías 22» o «Gálatas 5:1».",
    "In questa lettura il segnaposto è uno solo: per fermarti a metà serve una lettura di un capitolo.": "In this reading the bookmark is a single one: to stop halfway you need a single-chapter reading.|In dieser Lesung gibt es nur ein Lesezeichen: um mittendrin aufzuhören, braucht es eine Lesung aus einem Kapitel.|En esta lectura el marcador es uno solo: para parar a mitad hace falta una lectura de un capítulo.",
    "Libro": "Book|Buch|Libro",
    "Capitolo": "Chapter|Kapitel|Capítulo",
    "Versetto": "Verse|Vers|Versículo",
    "Scegli il libro": "Choose the book|Wähle das Buch|Elige el libro",
    "Scegli": "Choose|Wählen|Elige",
    "Tutto": "All|Alles|Todo",
    "Cerca un libro": "Search a book|Buch suchen|Busca un libro",
    "Tutto il capitolo": "The whole chapter|Das ganze Kapitel|Todo el capítulo",
    "oppure scrivi il riferimento": "or type the reference|oder schreibe die Stelle|o escribe la referencia",
    "Tocca anche il capitolo.": "Tap the chapter too.|Tippe auch das Kapitel.|Toca también el capítulo.",
    "Tocca il libro, poi il capitolo, poi il versetto — oppure scrivi il riferimento.": "Tap the book, then the chapter, then the verse — or type the reference.|Tippe das Buch, dann das Kapitel, dann den Vers — oder schreibe die Stelle.|Toca el libro, luego el capítulo, luego el versículo — o escribe la referencia.",
    "Hai letto tutto fino a qui?": "Have you read everything up to here?|Hast du bis hierher alles gelesen?|¿Has leído todo hasta aquí?",
    "No, mi sono fermato prima": "No, I stopped earlier|Nein, ich blieb früher stehen|No, me detuve antes",
    "Ci torni indietro?": "Go back there?|Dorthin zurück?|¿Vuelves allí?",
    "No, resta": "No, stay here|Nein, bleib hier|No, quédate",
    "già letto": "already read|schon gelesen|ya leído",
    "letto in parte": "partly read|teilweise gelesen|leído en parte",
    "non ancora letto": "not read yet|noch nicht gelesen|aún no leído",
    "Questo è l’ultimo versetto: qui non resta niente da riprendere. Se hai finito il capitolo, spunta la casella.": "This is the last verse: nothing is left to continue from. If you finished the chapter, tick the box.|Das ist der letzte Vers: hier bleibt nichts mehr zum Weiterlesen. Wenn du das Kapitel beendet hast, hake die Kästchen an.|Este es el último versículo: aquí no queda nada por continuar. Si has terminado el capítulo, marca la casilla.",

    /* ------------------------------------------------------------- parole comuni */
    "letture,": "readings,|Lesungen,|lecturas,",
    "es. 12": "e.g. 12|z. B. 12|p. ej. 12",
    "Chiudi": "Close|Schließen|Cerrar",
    "Rileggi": "Read again|Erneut lesen|Volver a leer",
    "segna come letto": "mark as read|als gelesen markieren|marcar como leído",
    "Fatto": "Done|Fertig|Hecho",
    "Copia": "Copy|Kopieren|Copiar",
    "Copia il codice": "Copy the code|Code kopieren|Copiar el código",
    "Salva il codice": "Save the code|Code speichern|Guardar el código",
    "Apri": "Open|Öffnen|Abrir",
    "Scarica": "Download|Herunterladen|Descargar",
    "Invia": "Send|Senden|Enviar",
    "Condividi": "Share|Teilen|Compartir",

    /* ----------------------------------------------------------- Impostazioni */
    "Ritmo del piano": "Plan pace|Lesetempo|Ritmo del plan",
    "Ciò che hai già letto resta letto. Il nuovo piano riparte da ciò che manca.": "What you have read stays read. The new plan starts with what is left.|Was du gelesen hast, bleibt gelesen. Der neue Plan beginnt bei dem, was fehlt.|Lo que ya has leído sigue leído. El nuevo plan empieza por lo que falta.",
    "(facoltativo)": "(optional)|(optional)|(opcional)",
    "Durata": "Duration|Dauer|Duración",
    "Giorni": "Days|Tage|Días",
    "Letture al giorno": "Readings per day|Lesungen pro Tag|Lecturas al día",
    "Scegli da quale libro parte ogni lettura": "Choose where each reading starts|Wähle, wo jede Lesung beginnt|Elige dónde empieza cada lectura",
    "tutto già letto": "everything already read|schon alles gelesen|ya leído todo",
    /* L'avviso di aurora-inizi.js: quando una scelta di «inizia da» non si può
       fare, l'app la ignora senza dirlo. Queste quattro frasi lo dicono. */
    "Una lettura non può cominciare da un libro che è già l'inizio di un'altra: le scelte qui sotto restano senza effetto.": "A reading cannot start from a book that already begins another one: the choices below have no effect.|Eine Lesung kann nicht mit einem Buch beginnen, das schon eine andere beginnt: die Auswahl unten bleibt ohne Wirkung.|Una lectura no puede empezar por un libro que ya comienza otra: las elecciones de abajo no tienen efecto.",
    "non può cominciare da qui: è già l'inizio di un'altra lettura. Questa lettura resta da": "cannot start here: it already begins another reading. This reading stays at|kann hier nicht beginnen: es ist schon der Anfang einer anderen Lesung. Diese Lesung bleibt bei|no puede empezar aquí: ya es el comienzo de otra lectura. Esta lectura sigue en",
    "non può cominciare da qui: questa lettura ha già letto tutto.": "cannot start here: this reading has already read everything.|kann hier nicht beginnen: diese Lesung hat schon alles gelesen.|no puede empezar aquí: esta lectura ya ha leído todo.",
    "Per farlo cominciare da qui, metti «Come da piano» nella lettura che lo comincia adesso.": "To make it start here, set “As planned” on the reading that starts it now.|Damit es hier beginnt, stelle „Wie im Plan“ bei der Lesung ein, die jetzt damit beginnt.|Para que empiece aquí, pon «Según el plan» en la lectura que lo empieza ahora.",
    "Applica il nuovo piano": "Apply the new plan|Neuen Plan anwenden|Aplicar el nuevo plan",
    "I tuoi dati": "Your data|Deine Daten|Tus datos",
    "Genera codice di backup": "Create a backup code|Backup-Code erzeugen|Generar un código de copia",
    "Ripristina da codice": "Restore from code|Aus Code wiederherstellen|Restaurar desde un código",
    "Il codice appare qui. Per ripristinare incollalo qui.": "The code appears here. To restore, paste it here.|Der Code erscheint hier. Zum Wiederherstellen hier einfügen.|El código aparece aquí. Para restaurar, pégalo aquí.",
    "Importa dalla versione locale": "Import from the local version|Aus der lokalen Version importieren|Importar desde la versión local",
    "Hai usato la pagina locale? Incolla qui il suo codice di backup: i capitoli letti e i giorni di lettura vengono aggiunti.": "Did you use the local page? Paste its backup code here: the chapters read and the reading days are added.|Hast du die lokale Seite benutzt? Füge hier ihren Backup-Code ein: die gelesenen Kapitel und Lesetage werden ergänzt.|¿Usabas la página local? Pega aquí su código de copia: se añaden los capítulos leídos y los días de lectura.",
    "Incolla il codice della versione locale": "Paste the local version code|Code der lokalen Version einfügen|Pega el código de la versión local",
    "Importa": "Import|Importieren|Importar",
    "Il piano in PDF": "The plan as PDF|Der Plan als PDF|El plan en PDF",
    "Il documento originale “Dall’Aurora al Tramonto”, con l’introduzione e il piano di lettura completo.": "The original “Dall’Aurora al Tramonto” document, with the introduction and the complete reading plan.|Das Originaldokument „Dall’Aurora al Tramonto“ mit Einführung und dem vollständigen Leseplan.|El documento original «Dall’Aurora al Tramonto», con la introducción y el plan de lectura completo.",
    "Scarica il PDF": "Download the PDF|PDF herunterladen|Descargar el PDF",
    "Sostieni il progetto": "Support the project|Das Projekt unterstützen|Apoya el proyecto",
    "Questa app è gratuita e senza pubblicità, e resterà così. Se ti è utile e senti di farlo, puoi contribuire con un’offerta libera: aiuterà a mantenerla e a farla crescere. Grazie di cuore, che il Signore ti benedica! 🙏": "This app is free and has no ads, and it will stay that way. If it helps you and you feel like it, you can give a free contribution: it will help keep it alive and growing. Thank you, and may the Lord bless you! 🙏|Diese App ist kostenlos und werbefrei, und das bleibt so. Wenn sie dir hilft und du magst, kannst du freiwillig etwas beitragen: das hilft, sie zu erhalten und wachsen zu lassen. Danke von Herzen, der Herr segne dich! 🙏|Esta app es gratuita y sin publicidad, y así seguirá. Si te sirve y te nace, puedes aportar una ofrenda libre: ayudará a mantenerla y hacerla crecer. Gracias de corazón, ¡que el Señor te bendiga! 🙏",
    "Dona con PayPal": "Donate with PayPal|Mit PayPal spenden|Donar con PayPal",
    "Facoltativo: l’app funziona allo stesso modo anche senza donare.": "Optional: the app works exactly the same without donating.|Optional: die App funktioniert genauso auch ohne Spende.|Opcional: la app funciona igual sin donar.",
    "Hai trovato un errore, hai un’idea o vuoi solo scrivermi? Mi fa piacere leggerti.": "Found a mistake, have an idea, or just want to write? I am glad to hear from you.|Fehler gefunden, eine Idee, oder möchtest du einfach schreiben? Ich freue mich, von dir zu lesen.|¿Has encontrado un error, tienes una idea o solo quieres escribirme? Me alegra leerte.",
    "Scrivi una email": "Write an email|E-Mail schreiben|Escribir un correo",
    "Copia l’indirizzo": "Copy the address|Adresse kopieren|Copiar la dirección",
    "File di backup": "Backup file|Backup-Datei|Archivo de copia",
    "Salva un file sul tuo dispositivo: ti serve per cambiare telefono o se cancelli i dati del browser.": "Save a file on your device: you need it to change phone or if you clear the browser data.|Speichere eine Datei auf deinem Gerät: du brauchst sie für einen Telefonwechsel oder wenn du die Browserdaten löschst.|Guarda un archivo en tu dispositivo: te sirve para cambiar de teléfono o si borras los datos del navegador.",
    "Scarica il file di backup": "Download the backup file|Backup-Datei herunterladen|Descargar el archivo de copia",
    "Ripristina da file": "Restore from file|Aus Datei wiederherstellen|Restaurar desde un archivo",
    "Salvataggi automatici": "Automatic saves|Automatische Sicherungen|Copias automáticas",
    "Ogni giorno l’app tiene una copia dei tuoi progressi (le ultime 14). Se qualcosa si rovina, scegli una data e ripristina.": "Every day the app keeps a copy of your progress (the last 14). If something goes wrong, pick a date and restore.|Jeden Tag legt die App eine Kopie deines Fortschritts an (die letzten 14). Wenn etwas kaputtgeht, wähle ein Datum und stelle es wieder her.|Cada día la app guarda una copia de tu progreso (las últimas 14). Si algo se estropea, elige una fecha y restaura.",
    "Ripristina": "Restore|Wiederherstellen|Restaurar",
    "Nessuna copia ancora.": "No backup yet.|Noch keine Kopie.|Aún no hay copia.",
    "Non hai ancora un file di backup recente.": "You have no recent backup file yet.|Du hast noch keine aktuelle Backup-Datei.|Aún no tienes un archivo de copia reciente.",
    "Salvalo ora": "Save it now|Jetzt speichern|Guárdalo ahora",
    "File salvato.": "File saved.|Datei gespeichert.|Archivo guardado.",
    "Azzera": "Reset|Zurücksetzen|Reiniciar",
    "Cancella tutto su questo dispositivo e ricomincia dalla scelta del piano.": "Delete everything on this device and start again from the plan choice.|Löscht alles auf diesem Gerät und beginnt neu bei der Planauswahl.|Borra todo en este dispositivo y empieza de nuevo desde la elección del plan.",
    "Azzera i progressi": "Reset progress|Fortschritt zurücksetzen|Borrar el progreso",
    "Azzera tutto": "Reset everything|Alles zurücksetzen|Borrar todo",
    "Si cancella tutto: libri letti, serie, rilletture e copie automatiche. Per confermare scrivi": "Everything is deleted: books read, streak, re-reads and automatic copies. To confirm, type|Alles wird gelöscht: gelesene Bücher, Serie, erneutes Lesen und automatische Kopien. Zum Bestätigen tippe|Se borra todo: libros leídos, racha, relecturas y copias automáticas. Para confirmar escribe",
    "Guida": "Guide|Anleitung|Guía",
    "Rivedi la guida di benvenuto": "Review the welcome guide|Einführung erneut ansehen|Ver de nuevo la guía",
    "Guida di benvenuto": "Welcome guide|Willkommens-Guide|Guía de bienvenida",
    "Introduzione, FAQ e ringraziamenti": "Introduction, FAQ and thanks|Einführung, FAQ und Danksagung|Introducción, FAQ y agradecimientos",

    /* ------------------------------------------------------------- primo avvio */
    "Costruiamo il tuo piano": "Let’s build your plan|Bauen wir deinen Plan|Vamos a crear tu plan",
    /* Il versetto del primo avvio: è una citazione, non un'etichetta, ma resta
       un testo che si legge — e chi apre l'app in tedesco o spagnolo non deve
       trovarsi il Salmo in italiano. La stessa traduzione della pagina
       Introduzione, senza il termine ebraico che lì è commentato. */
    "«Se prendo le ali dell’aurora e vado ad abitare all’estremità del mare, anche là mi condurrà la Tua mano.»": "“If I take the wings of the dawn and dwell in the uttermost parts of the sea, even there your hand shall lead me.”|„Nehme ich Flügel der Morgenröte und wohne am äußersten Ende des Meeres, so wird mich doch deine Hand dort führen.“|«Si tomo las alas del alba y habito en el extremo del mar, aun allí me guiará tu mano.»",
    "Ci vuole un minuto": "It takes a minute|Es dauert eine Minute|Tarda un minuto",
    "Un cammino dall’aurora di Genesi al tramonto dell’Apocalisse, un passo al giorno.": "A journey from the dawn of Genesis to the sunset of Revelation, one step a day.|Ein Weg von der Morgendämmerung der Genesis bis zum Sonnenuntergang der Offenbarung, Schritt für Schritt.|Un camino desde el amanecer del Génesis hasta el atardecer del Apocalipsis, un paso al día.",
    "Leggi l’introduzione": "Read the introduction|Einführung lesen|Leer la introducción",
    "Leggi l’introduzione · FAQ": "Read the introduction · FAQ|Einführung · FAQ lesen|Leer la introducción · FAQ",
    "1. Quante letture al giorno?": "1. How many readings a day?|1. Wie viele Lesungen pro Tag?|1. ¿Cuántas lecturas al día?",
    "Da una a cinque, nei momenti della giornata che preferisci. Potrai cambiarle in ogni momento dalle Impostazioni.": "From one to five, at the moments of the day you prefer. You can change them any time in Settings.|Von einer bis fünf, zu den Tageszeiten, die dir passen. Du kannst sie jederzeit in den Einstellungen ändern.|De una a cinco, en los momentos del día que prefieras. Podrás cambiarlas en cualquier momento desde Ajustes.",
    "2. Quanto deve durare?": "2. How long should it last?|2. Wie lange soll es dauern?|2. ¿Cuánto debe durar?",
    "1 anno": "1 year|1 Jahr|1 año",
    "1 anno e mezzo": "1 and a half years|1,5 Jahre|1 año y medio",
    "2 anni": "2 years|2 Jahre|2 años",
    "3 anni": "3 years|3 Jahre|3 años",
    "oppure": "or|oder|o",
    "giorni": "days|Tage|días",
    "3. Hai già letto dei libri?": "3. Have you read any books yet?|3. Hast du schon Bücher gelesen?|3. ¿Has leído ya algunos libros?",
    "Tocca quelli che hai già letto per intero. Potrai correggere capitolo per capitolo dalla scheda Libri. Se non ne hai letto nessuno, lascia così: partirai dall’inizio.": "Tap the ones you have already read in full. You can correct chapter by chapter in the Books tab. If you have read none, leave it: you will start from the beginning.|Tippe die an, die du schon ganz gelesen hast. Kapitel für Kapitel kannst du im Tab Bücher korrigieren. Wenn du keine gelesen hast, lass es so: du beginnst am Anfang.|Toca los que ya hayas leído enteros. Podrás corregir capítulo a capítulo desde la pestaña Libros. Si no has leído ninguno, déjalo así: empezarás por el principio.",
    "4. Avevi già un backup?": "4. Did you have a backup?|4. Hattest du schon ein Backup?|4. ¿Tenías ya una copia de seguridad?",
    "Carica un file di backup": "Load a backup file|Backup-Datei laden|Cargar un archivo de copia",
    "oppure incolla un codice qui sotto": "or paste a code below|oder füge unten einen Code ein|o pega un código abajo",
    "Incolla qui il codice di backup (facoltativo)": "Paste the backup code here (optional)|Backup-Code hier einfügen (optional)|Pega aquí el código de copia (opcional)",
    "Crea il mio piano": "Create my plan|Meinen Plan erstellen|Crear mi plan",
    "Finirai il": "You will finish on|Du bist fertig am|Terminarás el",
    ", se leggi ogni giorno.": ", if you read every day.|, wenn du jeden Tag liest.|, si lees cada día.",
    ". Hai già letto dei libri?": ". Have you read any books yet?|. Hast du schon Bücher gelesen?|. ¿Has leído ya algunos libros?",
    ". Avevi già un backup?": ". Did you have a backup?|. Hattest du schon ein Backup?|. ¿Tenías ya una copia de seguridad?",

    /* ------------------------------------------------------------ la guida iniziale */
    "Benvenuto": "Welcome|Willkommen|Bienvenido",
    "Questo è un piano di lettura biblica pensato per accompagnarti ogni giorno, in uno, due o più momenti. Ti mostro in un minuto come funziona.": "This is a Bible reading plan made to walk with you every day, in one, two or more moments. Let me show you in a minute how it works.|Dies ist ein Bibelleseplan, der dich jeden Tag begleiten soll, zu einer, zwei oder mehr Zeiten. Ich zeige dir in einer Minute, wie es funktioniert.|Este es un plan de lectura bíblica pensado para acompañarte cada día, en uno, dos o más momentos. Te muestro en un minuto cómo funciona.",
    "Salta": "Skip|Überspringen|Omitir",
    "Avanti ›": "Next ›|Weiter ›|Siguiente ›",
    "‹ indietro": "‹ back|‹ zurück|‹ atrás",
    "Inizia": "Start|Loslegen|Empezar",
    "Oggi: leggi e spunta": "Today: read and tick|Heute: lesen und abhaken|Hoy: lee y marca",
    "Nella scheda Oggi trovi i passi da leggere. Quando hai finito, spunta il cerchio. Con ‹ precedente e successiva › cambi lettura, e “Modifica” ti permette di saltare a un altro punto o di fermarti a metà capitolo.": "In the Today tab you find the passages to read. When you are done, tick the circle. With ‹ previous and next › you change reading, and “Edit” lets you jump elsewhere or stop halfway through a chapter.|Im Tab Heute findest du die Lesungen. Wenn du fertig bist, hake den Kreis ab. Mit ‹ zurück und weiter › wechselst du die Lesung, und „Bearbeiten“ lässt dich woanders hinspringen oder mitten im Kapitel aufhören.|En la pestaña Hoy encuentras los pasajes que toca leer. Cuando termines, marca el círculo. Con ‹ anterior y siguiente › cambias de lectura, y «Editar» te permite saltar a otro punto o parar a mitad de capítulo.",
    "Libri e percentuale": "Books and percentage|Bücher und Prozent|Libros y porcentaje",
    "Nella scheda Libri vedi tutti i 66 libri e i loro capitoli. Tocca un capitolo per segnarlo come già letto, oppure usa “lettura completata”, “rileggi” e “annulla lettura”. In alto c’è sempre la percentuale di Bibbia letta.": "In the Books tab you see all 66 books and their chapters. Tap a chapter to mark it as read, or use “reading completed”, “read again” and “unmark reading”. The percentage of the Bible read is always at the top.|Im Tab Bücher siehst du alle 66 Bücher und ihre Kapitel. Tippe ein Kapitel an, um es als gelesen zu markieren, oder nutze „Lesung abgeschlossen“, „erneut lesen“ und „Lesung zurücksetzen“. Oben steht immer der gelesene Anteil der Bibel.|En la pestaña Libros ves los 66 libros y sus capítulos. Toca un capítulo para marcarlo como leído, o usa «lectura completada», «volver a leer» y «quitar la lectura». Arriba está siempre el porcentaje de Biblia leída.",
    "Serie e piano": "Streak and plan|Serie und Plan|Racha y plan",
    "La scheda Serie conta i giorni di fila e si colora da sola quando leggi. Nel Piano vedi tutte le letture. Dalle Impostazioni puoi cambiare quante letture fare al giorno (da 1 a 5) e la durata, senza perdere ciò che hai letto.": "The Streak tab counts the days in a row and colours itself as you read. In the Plan you see all the readings. In Settings you can change how many readings a day (from 1 to 5) and the duration, without losing what you have read.|Der Tab Serie zählt die Tage in Folge und färbt sich beim Lesen von selbst. Im Plan siehst du alle Lesungen. In den Einstellungen kannst du ändern, wie viele Lesungen pro Tag (1 bis 5) und wie lange, ohne das Gelesene zu verlieren.|La pestaña Racha cuenta los días seguidos y se colorea sola cuando lees. En el Plan ves todas las lecturas. En Ajustes puedes cambiar cuántas lecturas al día (de 1 a 5) y la duración, sin perder lo leído.",
    "Tutto resta salvato su questo dispositivo, senza account. Ogni tanto scarica il file di backup dalle Impostazioni: ti serve per cambiare telefono o se cancelli i dati del browser.": "Everything stays saved on this device, with no account. Now and then download the backup file from Settings: you need it to change phone or if you clear the browser data.|Alles bleibt auf diesem Gerät gespeichert, ohne Konto. Lade ab und zu die Backup-Datei aus den Einstellungen: du brauchst sie für einen Telefonwechsel oder wenn du die Browserdaten löschst.|Todo queda guardado en este dispositivo, sin cuenta. De vez en cuando descarga el archivo de copia desde Ajustes: te sirve para cambiar de teléfono o si borras los datos del navegador.",

    /* --------------------------------------------------------------- i miei moduli */
    "Aspetto": "Appearance|Darstellung|Apariencia",
    "Automatico": "Automatic|Automatisch|Automático",
    "Chiaro": "Light|Hell|Claro",
    "Scuro": "Dark|Dunkel|Oscuro",
    "Automatico segue il tema del telefono. «Chiaro» e «Scuro» lo bloccano per questa app soltanto.": "Automatic follows your phone’s theme. “Light” and “Dark” lock it for this app only.|Automatisch folgt dem Thema des Telefons. „Hell“ und „Dunkel“ legen es nur für diese App fest.|Automático sigue el tema del teléfono. «Claro» y «Oscuro» lo fijan solo para esta app.",
    "Automatico — segue il tuo telefono": "Automatic — follows your phone|Automatisch — folgt deinem Telefon|Automático — sigue tu teléfono",
    "Chiaro — sempre chiaro": "Light — always light|Hell — immer hell|Claro — siempre claro",
    "Scuro — sempre scuro": "Dark — always dark|Dunkel — immer dunkel|Oscuro — siempre oscuro",
    "Promemoria": "Reminders|Erinnerungen|Recordatorios",
    "Il calendario del telefono ti avvisa anche ad app chiusa: scegli un'ora per ogni momento, poi aggiungi i promemoria. Si ripetono ogni giorno da soli.": "Your phone’s calendar reminds you even when the app is closed: pick a time for each moment, then add the reminders. They repeat every day on their own.|Der Kalender des Telefons erinnert dich auch bei geschlossener App: wähle eine Uhrzeit für jede Tageszeit und füge dann die Erinnerungen hinzu. Sie wiederholen sich jeden Tag von selbst.|El calendario del teléfono te avisa aunque la app esté cerrada: elige una hora para cada momento y añade los recordatorios. Se repiten cada día solos.",
    "Il calendario non sa se hai già letto: l'avviso arriva comunque. E se cambi un'ora, aggiungi di nuovo il file.": "The calendar does not know whether you have read already: the reminder comes anyway. And if you change a time, add the file again.|Der Kalender weiß nicht, ob du schon gelesen hast: die Erinnerung kommt trotzdem. Und wenn du eine Uhrzeit änderst, füge die Datei erneut hinzu.|El calendario no sabe si ya has leído: el aviso llega igual. Y si cambias una hora, vuelve a añadir el archivo.",
    "Aggiungi al calendario": "Add to calendar|Zum Kalender hinzufügen|Añadir al calendario",
    "Nessun promemoria scelto": "No reminders chosen|Keine Erinnerung gewählt|Ningún recordatorio elegido",
    "Attivo": "On|An|Activado",
    "Spento": "Off|Aus|Desactivado",
    "Salva": "Save|Speichern|Guardar",
    "Imposta": "Set|Festlegen|Establecer",
    "Annulla": "Undo|Rückgängig|Deshacer",
    "Lingua": "Language|Sprache|Idioma",
    "L’app segue la lingua del telefono. Scegliendone un’altra vale solo per questa app: i titoli dei capitoli restano in italiano.": "The app follows your phone’s language. Another one applies to this app only: chapter titles stay in Italian.|Die App folgt der Sprache des Telefons. Eine andere gilt nur für diese App: die Kapiteltitel bleiben italienisch.|La app sigue el idioma del teléfono. Otro idioma vale solo para esta app: los títulos de los capítulos siguen en italiano.",
    "Italiano": "Italiano|Italiano|Italiano",

    /* ------------------------------------------ il tipo di piano (Impostazioni) */
    "Tipo di piano": "Type of plan|Art des Plans|Tipo de plan",
    "Generato dall’app": "Made by the app|Von der App erstellt|Generado por la app",
    "Piano originale · 4 anni": "Original plan · 4 years|Originalplan · 4 Jahre|Plan original · 4 años",
    "Il piano scritto da Marco Giraldi: 1460 giorni, Aurora e Tramonto, con la descrizione di ogni lettura.": "The plan written by Marco Giraldi: 1460 days, Dawn and Sunset, with a description of every reading.|Der Plan von Marco Giraldi: 1460 Tage, Morgendämmerung und Sonnenuntergang, mit einer Beschreibung jeder Lesung.|El plan escrito por Marco Giraldi: 1460 días, Aurora y Atardecer, con la descripción de cada lectura.",
    "Applicare il nuovo piano? Le letture già segnate restano lette; le posizioni di oggi cambiano. Potrai annullare subito dopo.": "Apply the new plan? Readings already ticked stay read; today’s positions change. You can undo straight away.|Neuen Plan anwenden? Bereits markierte Lesungen bleiben gelesen; die heutigen Positionen ändern sich. Du kannst es sofort rückgängig machen.|¿Aplicar el nuevo plan? Las lecturas ya marcadas siguen leídas; las posiciones de hoy cambian. Podrás deshacerlo enseguida.",
    "Sì, applica": "Yes, apply|Ja, anwenden|Sí, aplicar",
    "Nuovo piano applicato.": "New plan applied.|Neuer Plan angewendet.|Nuevo plan aplicado.",

    /* ------------------------------------------- dove vive il piano (aurora-dati) */
    "Dove vive il tuo piano": "Where your plan lives|Wo dein Plan lebt|Dónde vive tu plan",
    "Non hai un accesso, e va benissimo: tutto funziona lo stesso. Ma il piano è salvato solo dentro questo browser, su questo telefono: non esiste da nessun'altra parte.": "You have no account, and that is fine: everything works anyway. But the plan is saved only inside this browser, on this phone: it does not exist anywhere else.|Du hast kein Konto, und das ist in Ordnung: alles funktioniert trotzdem. Der Plan liegt aber nur in diesem Browser auf diesem Telefon: er existiert nirgendwo sonst.|No tienes cuenta, y está bien: todo funciona igual. Pero el plan solo está guardado dentro de este navegador, en este teléfono: no existe en ningún otro sitio.",
    "Non hai un file di backup recente. Se svuoti i dati del browser, cambi telefono o perdi il telefono, il piano non si può recuperare.": "You have no recent backup file. If you clear the browser data, change phone or lose the phone, the plan cannot be recovered.|Du hast keine aktuelle Backup-Datei. Wenn du die Browserdaten löschst, das Telefon wechselst oder verlierst, lässt sich der Plan nicht wiederherstellen.|No tienes un archivo de copia reciente. Si borras los datos del navegador, cambias de teléfono o pierdes el teléfono, el plan no se puede recuperar.",
    "Hai salvato un file di backup da poco: quella è la tua copia di sicurezza. Tienila dove tieni le cose importanti.": "You saved a backup file recently: that is your safety copy. Keep it where you keep important things.|Du hast vor Kurzem eine Backup-Datei gespeichert: das ist deine Sicherheitskopie. Bewahre sie dort auf, wo du Wichtiges aufbewahrst.|Has guardado un archivo de copia hace poco: esa es tu copia de seguridad. Guárdala donde guardas las cosas importantes.",
    "L'accesso è facoltativo: serve solo a ritrovare il piano su un altro telefono, e a non perderlo se questo si rompe.": "Signing in is optional: it only serves to find the plan again on another phone, and not to lose it if this one breaks.|Anmelden ist freiwillig: es dient nur dazu, den Plan auf einem anderen Telefon wiederzufinden und ihn nicht zu verlieren, wenn dieses kaputtgeht.|Iniciar sesión es opcional: solo sirve para encontrar el plan en otro teléfono y no perderlo si este se rompe.",
    "Hai l'accesso: il piano è anche nel tuo account. Su un altro telefono, entra con lo stesso indirizzo e lo ritrovi.": "You are signed in: the plan is also in your account. On another phone, sign in with the same address and you will find it.|Du bist angemeldet: der Plan liegt auch in deinem Konto. Auf einem anderen Telefon melde dich mit derselben Adresse an und du findest ihn.|Tienes sesión iniciada: el plan también está en tu cuenta. En otro teléfono, entra con la misma dirección y lo encontrarás.",
    "Portami al file di backup": "Take me to the backup file|Bring mich zur Backup-Datei|Llévame al archivo de copia",
    "Questo piano esiste solo su questo telefono: salvane una copia, o accedi per ritrovarlo ovunque.": "This plan exists only on this phone: save a copy, or sign in to find it anywhere.|Dieser Plan existiert nur auf diesem Telefon: speichere eine Kopie oder melde dich an, um ihn überall wiederzufinden.|Este plan solo existe en este teléfono: guarda una copia o inicia sesión para encontrarlo en cualquier parte.",
    "Salva una copia": "Save a copy|Kopie speichern|Guardar una copia",
    "Non ora": "Not now|Nicht jetzt|Ahora no",

    /* ------------------------------------- giri e riletture (aurora-giri) */
    "Quante volte hai letto": "How many times you have read|Wie oft du gelesen hast|Cuántas veces has leído",
    "Ancora nessuna rilettura: quando rileggi un capitolo, o quando parti con un giro nuovo, il conto si aggiorna da solo.": "No re-reading yet: when you read a chapter again, or start a new lap, the count updates on its own.|Noch keine Wiederholung: Wenn du ein Kapitel erneut liest oder eine neue Runde beginnst, zählt es sich selbst.|Todavía ninguna relectura: cuando releas un capítulo, o empieces una vuelta nueva, la cuenta se actualiza sola.",
    "letture oltre la prima": "readings beyond the first|Lesungen nach der ersten|lecturas más allá de la primera",
    "capitoli letti più di una volta": "chapters read more than once|Kapitel, mehr als einmal gelesen|capítulos leídos más de una vez",
    "In rilettura adesso": "Being re-read now|Jetzt in Wiederholung|En relectura ahora",
    "Il conto comincia da quando questa card esiste: i giri fatti prima non si possono ricostruire, ma puoi aggiungerli tu.": "The count starts from when this card exists: laps done before cannot be reconstructed, but you can add them yourself.|Die Zählung beginnt mit dieser Karte: frühere Runden lassen sich nicht rekonstruieren, aber du kannst sie selbst hinzufügen.|La cuenta empieza cuando existe esta tarjeta: las vueltas anteriores no se pueden reconstruir, pero puedes añadirlas tú.",
    "Azzera il conto delle letture": "Reset the reading count|Zählung zurücksetzen|Borrar la cuenta de lecturas",
    "ultima": "last|zuletzt|última",

    /* ---------------------------------------------------- l'accesso (aurora-sync) */
    "Accedi con Google": "Sign in with Google|Mit Google anmelden|Iniciar sesión con Google",
    "Esci": "Sign out|Abmelden|Salir",
    "Sincronizza adesso": "Sync now|Jetzt synchronisieren|Sincronizar ahora",
    "Piano sincronizzato": "Plan synced|Plan synchronisiert|Plan sincronizado",
    "Accedi per non perdere il piano": "Sign in so you don't lose your plan|Melde dich an, um den Plan nicht zu verlieren|Inicia sesión para no perder el plan",
    "Accesso in corso…": "Signing in…|Anmeldung läuft…|Iniciando sesión…",
    "Invio…": "Sending…|Senden…|Enviando…",
    "Non riesco a sincronizzare": "I cannot sync|Ich kann nicht synchronisieren|No puedo sincronizar",
    "Due piani diversi: decidi tu": "Two different plans: you decide|Zwei verschiedene Pläne: du entscheidest|Dos planes distintos: decides tú",
    "Non hai ancora accesso: il piano vive solo su questo dispositivo.": "You have no account yet: the plan lives only on this device.|Du hast noch kein Konto: der Plan lebt nur auf diesem Gerät.|Aún no tienes cuenta: el plan vive solo en este dispositivo.",
    "Tieni quello di questo dispositivo": "Keep the one on this device|Nimm den von diesem Gerät|Quédate con el de este dispositivo",
    "Prendi quello del cloud": "Take the one from the cloud|Nimm den aus der Cloud|Toma el de la nube",
    "Questo dispositivo vince": "This device wins|Dieses Gerät gewinnt|Gana este dispositivo",
    "Leggo il tuo piano dal cloud…": "Reading your plan from the cloud…|Ich lese deinen Plan aus der Cloud…|Leyendo tu plan de la nube…",
    "Firebase non risponde": "Firebase is not answering|Firebase antwortet nicht|Firebase no responde",
    "Il telefono non ha permesso di preparare il file. Riprova dal browser.": "The phone did not allow the file to be prepared. Try again from the browser.|Das Telefon hat das Erstellen der Datei nicht erlaubt. Versuche es erneut im Browser.|El teléfono no ha permitido preparar el archivo. Inténtalo de nuevo desde el navegador.",
    /* Gli stati della striscia e del pannello di accesso: cambiano da soli
       mentre si sincronizza, e sono le prime frasi che si leggono proprio
       quando si accende l'accesso. */
    "Salvo…": "Saving…|Speichern…|Guardando…",
    "Aggiornato dal cloud": "Updated from the cloud|Aus der Cloud aktualisiert|Actualizado desde la nube",
    "Non riesco a salvare": "I cannot save|Ich kann nicht speichern|No puedo guardar",
    "Non riesco a leggere": "I cannot read|Ich kann nicht lesen|No puedo leer",
    "Nel cloud non c’è ancora niente": "There is nothing in the cloud yet|In der Cloud ist noch nichts|En la nube todavía no hay nada",
    "Ti porto su Google…": "Taking you to Google…|Ich bringe dich zu Google…|Te llevo a Google…",
    "Accesso non riuscito": "Sign-in failed|Anmeldung fehlgeschlagen|No se pudo iniciar sesión",
    "I due piani sono diversi: scegli tu": "The two plans are different: you choose|Die beiden Pläne sind verschieden: du entscheidest|Los dos planes son distintos: eliges tú",
    "Ho trovato letture fatte altrove: aggiorno la pagina": "I found readings made elsewhere: reloading the page|Ich habe anderswo gemachte Lesungen gefunden: die Seite wird neu geladen|He encontrado lecturas hechas en otro sitio: recargo la página",
    "Un altro dispositivo ha letto: aggiorno la pagina": "Another device has read: reloading the page|Ein anderes Gerät hat gelesen: die Seite wird neu geladen|Otro dispositivo ha leído: recargo la página",
    "Prendo il piano dal cloud: aggiorno la pagina": "Taking the plan from the cloud: reloading the page|Ich hole den Plan aus der Cloud: die Seite wird neu geladen|Tomo el plan de la nube: recargo la página",
    "Prova: leggo il finto cloud…": "Test: reading the pretend cloud…|Test: ich lese die Schein-Cloud…|Prueba: leo la nube ficticia…",
    "Il tuo piano, su tutti i dispositivi": "Your plan, on all your devices|Dein Plan, auf allen deinen Geräten|Tu plan, en todos tus dispositivos",
    "Account e sincronizzazione": "Account and synchronisation|Konto und Synchronisierung|Cuenta y sincronización",
    "Le letture fatte su un dispositivo si uniscono a quelle fatte sull’altro: niente si perde. Per questo, se cancelli una lettura per sbaglio, al prossimo scambio torna: usa «Questo dispositivo vince» per imporre quello che vedi qui.": "Readings made on one device are joined with those made on the other: nothing is lost. That is why a reading you delete by mistake comes back at the next exchange: use “This device wins” to enforce what you see here.|Die auf einem Gerät gelesenen Abschnitte werden mit denen des anderen zusammengeführt: nichts geht verloren. Deshalb kommt eine versehentlich gelöschte Lesung beim nächsten Austausch zurück: nutze „Dieses Gerät gewinnt“, um das durchzusetzen, was du hier siehst.|Las lecturas hechas en un dispositivo se unen a las hechas en el otro: no se pierde nada. Por eso, una lectura que borres por error vuelve en el próximo intercambio: usa «Gana este dispositivo» para imponer lo que ves aquí.",

    /* --- fuori dal corpo: titolo della scheda e descrizione delle pagine --- */
    "Introduzione e FAQ · Dall'Aurora al Tramonto": "Introduction and FAQ · From Dawn to Sunset|Einführung und FAQ · Von der Morgendämmerung zum Sonnenuntergang|Introducción y preguntas frecuentes · De la Aurora al Atardecer",
    "Un piano di lettura biblica in più momenti del giorno, con progressi, serie e libri letti.": "A Bible reading plan for several moments of the day, with progress, streaks and books read.|Ein Bibelleseplan für mehrere Tageszeiten, mit Fortschritt, Serien und gelesenen Büchern.|Un plan de lectura bíblica en varios momentos del día, con progreso, rachas y libros leídos.",
    "Un piano di lettura biblica in più momenti del giorno, con progressi, serie e libri letti. Dall'aurora di Genesi al tramonto dell'Apocalisse, un passo al giorno.": "A Bible reading plan for several moments of the day, with progress, streaks and books read. From the dawn of Genesis to the sunset of Revelation, one step a day.|Ein Bibelleseplan für mehrere Tageszeiten, mit Fortschritt, Serien und gelesenen Büchern. Von der Morgendämmerung der Genesis bis zum Sonnenuntergang der Offenbarung, ein Schritt pro Tag.|Un plan de lectura bíblica en varios momentos del día, con progreso, rachas y libros leídos. De la aurora del Génesis al atardecer del Apocalipsis, un paso al día.",
    "Come funziona il piano di lettura: le tre vie (Storia, Vangelo, Dottrina), il senso dell'aurora e del tramonto, i consigli di lettura e le domande frequenti.": "How the reading plan works: the three ways (Story, Gospel, Doctrine), the meaning of dawn and sunset, reading tips and frequently asked questions.|Wie der Leseplan funktioniert: die drei Wege (Geschichte, Evangelium, Lehre), der Sinn von Morgendämmerung und Sonnenuntergang, Lesetipps und häufige Fragen.|Cómo funciona el plan de lectura: las tres vías (Historia, Evangelio, Doctrina), el sentido de la aurora y del atardecer, los consejos de lectura y las preguntas frecuentes.",

    /* --------------------------------------- la pagina «Introduzione e guide» */
    /* I testi di /info: versetti, introduzione, consigli, domande frequenti,
       ringraziamenti e contatti. Sono frasi intere: si sostituiscono così
       come sono, senza toccare numeri, date o nomi di libri. I blocchi di
       più righe (poesie e brani) stanno invece in RIGHE, in fondo al file. */
    "← Torna al piano": "← Back to the plan|← Zurück zum Plan|← Volver al plan",
    "Consigli": "Tips|Tipps|Consejos",
    "FAQ": "FAQ|FAQ|FAQ",
    "Dall’aurora al tramonto": "From dawn to sunset|Von der Morgendämmerung zum Sonnenuntergang|De la aurora al atardecer",
    "Consigli per la lettura": "Tips for reading|Tipps zum Lesen|Consejos para la lectura",
    "Domande frequenti": "Frequently asked questions|Häufige Fragen|Preguntas frecuentes",
    "Contatti e sostegno": "Contact and support|Kontakt und Unterstützung|Contacto y apoyo",
    "Scrivi a": "Write to|Schreibe an|Escribe a",
    ": ogni correzione o suggerimento è benvenuto.": ": every correction or suggestion is welcome.|: jede Korrektur oder Anregung ist willkommen.|: toda corrección o sugerencia es bienvenida.",
    "Per errori, suggerimenti o semplicemente per scrivermi:": "For errors, suggestions or simply to write to me:|Für Fehler, Anregungen oder einfach, um mir zu schreiben:|Para errores, sugerencias o simplemente para escribirme:",
    "L’app è gratuita e lo resterà. Se ti è stata utile e desideri contribuire con un’offerta libera, puoi farlo da": "The app is free and will stay free. If it has been useful to you and you wish to contribute with a free offering, you can do so via|Die App ist kostenlos und bleibt es. Wenn sie dir geholfen hat und du mit einer freien Gabe beitragen möchtest, kannst du das über|La app es gratuita y lo seguirá siendo. Si te ha sido útil y deseas contribuir con una ofrenda libre, puedes hacerlo desde",
    ". Grazie di cuore, il Signore ti benedica!": ". Thank you from the heart, may the Lord bless you!|. Danke von Herzen, der Herr segne dich!|. Gracias de corazón, ¡que el Señor te bendiga!",
    "Dall'Aurora al Tramonto": "From Dawn to Sunset|Von der Morgendämmerung zum Sonnenuntergang|De la Aurora al Atardecer",
    "«Se prendo le ali dell’aurora (שַׁחַר — shachar)": "“If I take the wings of the dawn (שַׁחַר — shachar)|„Nehme ich Flügel der Morgenröte (שַׁחַר — shachar)|«Si tomo las alas del alba (שַׁחַר — shachar)",
    "e vado ad abitare all’estremità del mare,": "and dwell in the uttermost parts of the sea,|und wohne am äußersten Ende des Meeres,|y habito en el extremo del mar,",
    "anche là mi condurrà la Tua mano.»": "even there your hand shall lead me.”|so wird mich doch deine Hand dort führen.“|aun allí me guiará tu mano.»",
    "— Salmo 139:9-10": "— Psalm 139:9-10|— Psalm 139,9-10|— Salmo 139:9-10",
    "«Ecco, susciterò a Davide un Germoglio giusto;": "“Behold, I will raise up for David a righteous Branch;|„Siehe, ich will David einen gerechten Spross erwecken;|«He aquí que levantaré a David un Retoño justo;",
    "egli regnerà da re e agirà con saggezza.»": "he shall reign as king and deal wisely.”|er wird als König regieren und weise handeln.“|reinará como rey y actuará con sabiduría.»",
    "— Geremia 23:5": "— Jeremiah 23:5|— Jeremia 23,5|— Jeremías 23:5",
    "«Non a noi, o SIGNORE, non a noi, ma al tuo nome da’ gloria,": "“Not to us, O LORD, not to us, but to your name give glory,|„Nicht uns, HERR, nicht uns, sondern deinem Namen gib Ehre,|«No a nosotros, oh SEÑOR, no a nosotros, sino a tu nombre da gloria,",
    "per la tua bontà e per la tua fedeltà.»": "for your mercy and for your faithfulness.”|um deiner Güte und deiner Treue willen.“|por tu bondad y por tu fidelidad.»",
    "— Salmo 115:1": "— Psalm 115:1|— Psalm 115,1|— Salmo 115:1",
    "«È una grazia del SIGNORE se non siamo stati completamente distrutti,": "“It is a grace of the LORD that we are not utterly consumed,|„Es ist eine Gnade des HERRN, dass wir nicht völlig aufgerieben sind,|«Es una gracia del SEÑOR que no hayamos sido del todo consumidos,",
    "perché le sue compassioni non sono esaurite.": "for his compassions are not exhausted.|denn seine Barmherzigkeit hat kein Ende.|porque sus misericordias no se han agotado.",
    "Si rinnovano ogni mattina; grande è la tua fedeltà.»": "They are renewed every morning; great is your faithfulness.”|Sie ist jeden Morgen neu; groß ist deine Treue.“|Se renuevan cada mañana; grande es tu fidelidad.»",
    "— Lamentazioni 3:22-23": "— Lamentations 3:22-23|— Klagelieder 3,22-23|— Lamentaciones 3:22-23",
    "«La tua parola è una lampada al mio piede e una luce sul mio sentiero.»": "“Your word is a lamp to my feet and a light to my path.”|„Dein Wort ist meines Fußes Leuchte und ein Licht auf meinem Weg.“|«Lámpara es a mis pies tu palabra y lumbre a mi camino.»",
    "— Salmo 119:105": "— Psalm 119:105|— Psalm 119,105|— Salmo 119:105",
    "«La sua venuta è certa come l’aurora; Egli verrà a noi come la pioggia, come la pioggia di primavera che annaffia la terra.»": "“His coming is as certain as the dawn; he will come to us like the rain, like the spring rain that waters the earth.”|„Sein Kommen ist so gewiss wie die Morgendämmerung; er wird zu uns kommen wie der Regen, wie der Frühlingsregen, der die Erde tränkt.“|«Su venida es tan cierta como la aurora; vendrá a nosotros como la lluvia, como la lluvia de primavera que riega la tierra.»",
    "— Osea 6:3": "— Hosea 6:3|— Hosea 6,3|— Oseas 6:3",
    "Tre giorni, tre vie, un solo Dio che parla:": "Three days, three ways, one God who speaks:|Drei Tage, drei Wege, ein Gott, der spricht:|Tres días, tres vías, un solo Dios que habla:",
    "Giorno 1 – La Storia": "Day 1 – The Story|Tag 1 – Die Geschichte|Día 1 – La Historia",
    "Dio costruisce popoli, regni e cuori.": "God builds peoples, kingdoms and hearts.|Gott baut Völker, Reiche und Herzen.|Dios construye pueblos, reinos y corazones.",
    "È la via dell’obbedienza e del ritorno.": "It is the way of obedience and of return.|Es ist der Weg des Gehorsams und der Umkehr.|Es la vía de la obediencia y del retorno.",
    "Giorno 2 – Il Vangelo": "Day 2 – The Gospel|Tag 2 – Das Evangelium|Día 2 – El Evangelio",
    "La Parola si fa carne;": "The Word becomes flesh;|Das Wort wird Fleisch;|La Palabra se hace carne;",
    "la Croce è il centro del tempo dove giustizia e misericordia si abbracciano.": "the Cross is the centre of time, where justice and mercy embrace.|das Kreuz ist die Mitte der Zeit, wo Gerechtigkeit und Barmherzigkeit sich umarmen.|la Cruz es el centro del tiempo, donde la justicia y la misericordia se abrazan.",
    "Giorno 3 – La Dottrina": "Day 3 – The Doctrine|Tag 3 – Die Lehre|Día 3 – La Doctrina",
    "Lo Spirito insegna attraverso gli apostoli;": "The Spirit teaches through the apostles;|Der Geist lehrt durch die Apostel;|El Espíritu enseña a través de los apóstoles;",
    "la fede diventa vita, speranza e amore.": "faith becomes life, hope and love.|der Glaube wird Leben, Hoffnung und Liebe.|la fe se vuelve vida, esperanza y amor.",
    "La sera comincia con i Poetici — Preghiera, Sapienza e Canto": "The evening begins with the Poetic Books — Prayer, Wisdom and Song|Der Abend beginnt mit den poetischen Büchern — Gebet, Weisheit und Gesang|La tarde comienza con los Poéticos — Oración, Sabiduría y Canto",
    "Il Tramonto — עֵת־עֶרֶב (‘erev)": "The Sunset — עֵת־עֶרֶב (‘erev)|Der Sonnenuntergang — עֵת־עֶרֶב (‘erev)|El Atardecer — עֵת־עֶרֶב (‘erev)",
    "Un fuoco arde sulla riva, un uomo chiama per nome, e il fallimento si trasforma in comunione.": "A fire burns on the shore, a man calls by name, and failure turns into communion.|Ein Feuer brennt am Ufer, ein Mann ruft beim Namen, und das Scheitern wird zur Gemeinschaft.|Un fuego arde en la orilla, un hombre llama por su nombre, y el fracaso se transforma en comunión.",
    "Non sono nessuno per dare indicazioni su come leggere la Scrittura; il mio desiderio è soltanto quello di offrire un piccolo aiuto a chi desidera approfondire lo studio sistematico della Parola di Dio.": "I am no one to give directions on how to read Scripture; my only wish is to offer a small help to those who want to go deeper into the systematic study of the Word of God.|Ich bin niemand, der Anweisungen geben könnte, wie man die Schrift liest; mein einziger Wunsch ist es, denen eine kleine Hilfe zu bieten, die das systematische Studium des Wortes Gottes vertiefen möchten.|No soy nadie para dar indicaciones sobre cómo leer la Escritura; mi único deseo es ofrecer una pequeña ayuda a quien quiera profundizar en el estudio sistemático de la Palabra de Dios.",
    "Questo piano nasce come un percorso personale, ma anche condivisibile: io stesso lo ricomincerò, giorno dopo giorno, per esaminarlo, correggerlo e scoprire insieme ad altri come possa essere migliorato.": "This plan was born as a personal journey, but also as one to share: I will begin it again myself, day after day, to examine it, correct it and discover together with others how it can be improved.|Dieser Plan entstand als persönlicher Weg, aber auch als ein teilbarer: Ich selbst werde ihn wieder von vorn beginnen, Tag für Tag, um ihn zu prüfen, zu korrigieren und mit anderen zu entdecken, wie er besser werden kann.|Este plan nace como un recorrido personal, pero también compartible: yo mismo lo volveré a empezar, día tras día, para examinarlo, corregirlo y descubrir junto a otros cómo puede mejorarse.",
    "Le sezioni proposte non sono vincolanti. Non è obbligatorio leggere ogni passo come indicato: l’ordine suggerito vuole solo favorire una lettura equilibrata e breve, che renda più agevole la consultazione parallela di commentari e strumenti biblici.": "The proposed sections are not binding. You are not obliged to read every passage as indicated: the suggested order only aims to encourage a balanced and short reading, which makes it easier to consult commentaries and Bible tools alongside.|Die vorgeschlagenen Abschnitte sind nicht verbindlich. Es ist nicht Pflicht, jeden Abschnitt so zu lesen, wie es angegeben ist: die vorgeschlagene Reihenfolge soll nur ein ausgewogenes und kurzes Lesen fördern, das das Nachschlagen in Kommentaren und biblischen Hilfsmitteln erleichtert.|Las secciones propuestas no son obligatorias. No es obligatorio leer cada pasaje como se indica: el orden sugerido solo quiere favorecer una lectura equilibrada y breve, que haga más fácil la consulta paralela de comentarios y herramientas bíblicas.",
    "Lo scopo non è “finire” la Bibbia, ma comprenderla, meditarla e lasciare che lo Spirito Santo parli ai nostri cuori, usando ciò che leggiamo per trasformarci.": "The goal is not to “finish” the Bible, but to understand it, to meditate on it and to let the Holy Spirit speak to our hearts, using what we read to transform us.|Das Ziel ist nicht, die Bibel „fertig“ zu lesen, sondern sie zu verstehen, über sie nachzudenken und den Heiligen Geist zu unseren Herzen sprechen zu lassen, damit das Gelesene uns verwandelt.|El objetivo no es “terminar” la Biblia, sino comprenderla, meditarla y dejar que el Espíritu Santo hable a nuestros corazones, usando lo que leemos para transformarnos.",
    "Consiglio di affiancare il piano a buoni strumenti di studio come i commentari Investigate le Scritture, Il Nuovo Discepolo, Matthew Henry e fonti di riferimento come il Dizionario Biblico, la Chiave Biblica, e, dove possibile, lo studio dei termini originali nei manoscritti antichi in ebraico, greco e — quando presenti — aramaico.": "I suggest pairing the plan with good study tools such as the commentaries Investigate le Scritture, Il Nuovo Discepolo, Matthew Henry, and reference works such as the Bible Dictionary, the Bible Key, and, where possible, the study of the original terms in the ancient manuscripts in Hebrew, Greek and — where present — Aramaic.|Ich empfehle, den Plan mit guten Studienhilfen zu verbinden, etwa den Kommentaren Investigate le Scritture, Il Nuovo Discepolo, Matthew Henry und Nachschlagewerken wie dem Bibellexikon, dem Bibelschlüssel und, wo möglich, dem Studium der ursprünglichen Begriffe in den alten Handschriften in Hebräisch, Griechisch und — wo vorhanden — Aramäisch.|Aconsejo acompañar el plan con buenas herramientas de estudio como los comentarios Investigate le Scritture, Il Nuovo Discepolo, Matthew Henry y fuentes de referencia como el Diccionario Bíblico, la Clave Bíblica y, cuando sea posible, el estudio de los términos originales en los manuscritos antiguos en hebreo, griego y — cuando los haya — arameo.",
    "Ogni parola della Scrittura è un tesoro inesauribile: non serve correre, ma restare, osservare, ascoltare. Ciò che conta non è il numero delle pagine lette, ma quanto la Parola riesce a penetrare nel cuore e produrre frutto nella vita.": "Every word of Scripture is an inexhaustible treasure: there is no need to run, but to stay, to observe, to listen. What matters is not the number of pages read, but how deeply the Word penetrates the heart and bears fruit in life.|Jedes Wort der Schrift ist ein unerschöpflicher Schatz: es geht nicht darum zu rennen, sondern zu bleiben, zu schauen, zu hören. Was zählt, ist nicht die Zahl der gelesenen Seiten, sondern wie tief das Wort ins Herz dringt und Frucht im Leben bringt.|Cada palabra de la Escritura es un tesoro inagotable: no hace falta correr, sino quedarse, observar, escuchar. Lo que cuenta no es el número de páginas leídas, sino cuánto logra la Palabra penetrar en el corazón y dar fruto en la vida.",
    "Sono aperto a ricevere consigli, correzioni o suggerimenti per migliorare questo cammino:": "I am open to advice, corrections or suggestions to improve this journey:|Ich bin offen für Ratschläge, Korrekturen oder Anregungen, um diesen Weg zu verbessern:|Estoy abierto a recibir consejos, correcciones o sugerencias para mejorar este camino:",
    "Come funziona il piano?": "How does the plan work?|Wie funktioniert der Plan?|¿Cómo funciona el plan?",
    "Ogni giorno trovi nella scheda Oggi una o più letture, a seconda del piano scelto. Quando hai finito, spunta il cerchio: la lettura viene segnata, la percentuale di Bibbia letta cresce e la serie dei giorni di fila si aggiorna.": "Every day you find one or more readings in the Today tab, depending on the plan you chose. When you have finished, tick the circle: the reading is marked, the percentage of the Bible read grows and your streak of days updates.|Jeden Tag findest du im Tab Heute eine oder mehrere Lesungen, je nach gewähltem Plan. Wenn du fertig bist, hake den Kreis an: die Lesung wird markiert, der Prozentsatz der gelesenen Bibel wächst und deine Serie aufeinanderfolgender Tage wird aktualisiert.|Cada día encuentras en la pestaña Hoy una o más lecturas, según el plan elegido. Cuando terminas, marca el círculo: la lectura queda registrada, el porcentaje de Biblia leída crece y la racha de días seguidos se actualiza.",
    "Che differenza c’è tra il piano originale e quello personalizzato?": "What is the difference between the original plan and the personalised one?|Was ist der Unterschied zwischen dem ursprünglichen und dem angepassten Plan?|¿Qué diferencia hay entre el plan original y el personalizado?",
    "Il piano originale è quello scritto da Marco Giraldi: 1460 giorni (4 anni), due letture al giorno, Aurora e Tramonto, con una breve descrizione di ogni lettura. Il piano personalizzato lo genera l’app: scegli da 1 a 5 letture al giorno e la durata che preferisci, e le letture vengono distribuite in modo equilibrato su tutta la Bibbia.": "The original plan is the one written by Marco Giraldi: 1460 days (4 years), two readings a day, Dawn and Sunset, with a short description of each reading. The personalised plan is generated by the app: choose from 1 to 5 readings a day and the duration you prefer, and the readings are spread evenly over the whole Bible.|Der ursprüngliche Plan ist der von Marco Giraldi geschriebene: 1460 Tage (4 Jahre), zwei Lesungen pro Tag, Morgendämmerung und Sonnenuntergang, mit einer kurzen Beschreibung jeder Lesung. Den angepassten Plan erzeugt die App: wähle 1 bis 5 Lesungen pro Tag und die gewünschte Dauer, und die Lesungen werden gleichmäßig über die ganze Bibel verteilt.|El plan original es el escrito por Marco Giraldi: 1460 días (4 años), dos lecturas al día, Amanecer y Atardecer, con una breve descripción de cada lectura. El plan personalizado lo genera la app: elige de 1 a 5 lecturas al día y la duración que prefieras, y las lecturas se reparten de forma equilibrada por toda la Biblia.",
    "Devo leggere tutti i giorni?": "Do I have to read every day?|Muss ich jeden Tag lesen?|¿Debo leer todos los días?",
    "No. Come si legge nei consigli, le sezioni non sono vincolanti: non è obbligatorio leggere ogni passo come indicato. L’app conta i giorni di fila per aiutarti a mantenere il ritmo, ma saltare un giorno non rovina nulla: riprendi da dove eri.": "No. As the tips say, the sections are not binding: you are not obliged to read every passage as indicated. The app counts your streak to help you keep the pace, but skipping a day ruins nothing: pick up where you were.|Nein. Wie in den Tipps steht, sind die Abschnitte nicht verbindlich: es ist nicht Pflicht, jeden Abschnitt wie angegeben zu lesen. Die App zählt deine Serie, um dir zu helfen, den Rhythmus zu halten, aber einen Tag zu überspringen verdirbt nichts: mach dort weiter, wo du warst.|No. Como se dice en los consejos, las secciones no son obligatorias: no es obligatorio leer cada pasaje como se indica. La app cuenta los días seguidos para ayudarte a mantener el ritmo, pero saltarte un día no arruina nada: retomas donde estabas.",
    "Posso cambiare il numero di letture al giorno?": "Can I change the number of readings a day?|Kann ich die Zahl der Lesungen pro Tag ändern?|¿Puedo cambiar el número de lecturas al día?",
    "Sì, in Impostazioni → Ritmo del piano. Puoi passare da 1 a 5 letture e cambiare la durata. Ciò che hai già letto resta letto: il nuovo piano riparte da quello che manca.": "Yes, in Settings → Plan pace. You can go from 1 to 5 readings and change the duration. What you have already read stays read: the new plan starts from what is left.|Ja, in Einstellungen → Lesetempo. Du kannst von 1 bis 5 Lesungen wechseln und die Dauer ändern. Was du schon gelesen hast, bleibt gelesen: der neue Plan beginnt bei dem, was fehlt.|Sí, en Ajustes → Ritmo del plan. Puedes pasar de 1 a 5 lecturas y cambiar la duración. Lo que ya has leído sigue leído: el nuevo plan empieza por lo que falta.",
    "Ho già letto dei libri. Come li segno?": "I have already read some books. How do I mark them?|Ich habe einige Bücher schon gelesen. Wie markiere ich sie?|Ya he leído algunos libros. ¿Cómo los marco?",
    "Nella scheda Libri tocca un capitolo per segnarlo come già letto, oppure usa “lettura completata” su un libro intero. Se ti sei sbagliato, “annulla lettura” riporta il libro da leggere (chiede conferma) e il messaggio in basso ti permette di tornare indietro.": "In the Books tab, tap a chapter to mark it as already read, or use “reading completed” on a whole book. If you made a mistake, “undo reading” puts the book back to be read (it asks for confirmation) and the message at the bottom lets you go back.|Tippe im Tab Bücher auf ein Kapitel, um es als schon gelesen zu markieren, oder nutze „Lesung abgeschlossen“ für ein ganzes Buch. Wenn du dich vertan hast, setzt „Lesung rückgängig“ das Buch wieder auf ungelesen (mit Nachfrage), und die Meldung unten lässt dich zurück.|En la pestaña Libros, toca un capítulo para marcarlo como ya leído, o usa “lectura completada” en un libro entero. Si te has equivocado, “anular lectura” devuelve el libro a por leer (pide confirmación) y el mensaje de abajo te permite volver atrás.",
    "Mi sono fermato a metà capitolo. Cosa faccio?": "I stopped halfway through a chapter. What do I do?|Ich bin mitten in einem Kapitel stehen geblieben. Was mache ich?|Me he detenido a mitad de capítulo. ¿Qué hago?",
    "Nella scheda Oggi premi “Modifica” sulla lettura e scrivi il versetto a cui sei arrivato. La parte letta viene segnata e il resto resta da fare.": "In the Today tab, press “Edit” on the reading and write the verse you reached. The part read is marked and the rest is left to do.|Drücke im Tab Heute bei der Lesung auf „Bearbeiten“ und schreibe den Vers, bei dem du angekommen bist. Der gelesene Teil wird markiert, der Rest bleibt offen.|En la pestaña Hoy pulsa “Editar” en la lectura y escribe el versículo al que has llegado. La parte leída queda registrada y el resto queda por hacer.",
    "A cosa serve “Salta a un altro punto del piano”?": "What is “Jump to another point of the plan” for?|Wozu dient „Zu einer anderen Stelle des Plans springen“?|¿Para qué sirve “Saltar a otro punto del plan”?",
    "A spostare la lettura di oggi su un altro passo (per esempio Isaia 22 o Galati 5:1) se hai letto per conto tuo o ti sei perso. Sposta solo il segnaposto: non segna nulla come letto.": "To move today's reading to another passage (for example Isaiah 22 or Galatians 5:1) if you have read on your own or got lost. It only moves the bookmark: it marks nothing as read.|Um die heutige Lesung auf eine andere Stelle zu verschieben (zum Beispiel Jesaja 22 oder Galater 5,1), wenn du auf eigene Faust gelesen hast oder dich verloren hast. Es verschiebt nur das Lesezeichen: es markiert nichts als gelesen.|Para mover la lectura de hoy a otro pasaje (por ejemplo Isaías 22 o Gálatas 5:1) si has leído por tu cuenta o te has perdido. Solo mueve el marcador: no marca nada como leído.",
    "Cosa vuol dire “rileggi”?": "What does “read again” mean?|Was bedeutet „erneut lesen“?|¿Qué significa “volver a leer”?",
    "Quando un libro è finito puoi iniziare un nuovo giro di lettura. La percentuale resta quella del primo giro e il libro mostra il numero del giro in corso.": "When a book is finished you can start a new lap of reading. The percentage stays that of the first lap and the book shows the number of the lap in progress.|Wenn ein Buch beendet ist, kannst du eine neue Leserunde beginnen. Der Prozentsatz bleibt der der ersten Runde, und das Buch zeigt die Nummer der laufenden Runde.|Cuando un libro termina puedes empezar una nueva vuelta de lectura. El porcentaje sigue siendo el de la primera vuelta y el libro muestra el número de la vuelta en curso.",
    "L’app non ha contato i miei giorni. Come sistemo la serie?": "The app did not count my days. How do I fix the streak?|Die App hat meine Tage nicht gezählt. Wie richte ich die Serie ein?|La app no ha contado mis días. ¿Cómo arreglo la racha?",
    "Nella scheda Serie, sotto il calendario: indica la data in cui hai iniziato (l’app segna come letti i giorni fino a ieri) oppure da quanti giorni leggi di fila. Il calendario non si modifica a mano, così la serie resta veritiera.": "In the Streak tab, under the calendar: enter the date you started (the app marks the days up to yesterday as read) or how many days you have read in a row. The calendar cannot be edited by hand, so the streak stays truthful.|Im Tab Serie, unter dem Kalender: gib das Datum an, an dem du begonnen hast (die App markiert die Tage bis gestern als gelesen) oder wie viele Tage du in Folge liest. Der Kalender lässt sich nicht von Hand ändern, so bleibt die Serie ehrlich.|En la pestaña Racha, bajo el calendario: indica la fecha en que empezaste (la app marca como leídos los días hasta ayer) o cuántos días llevas leyendo seguidos. El calendario no se modifica a mano, así la racha sigue siendo veraz.",
    "Dove sono salvati i miei dati?": "Where is my data saved?|Wo werden meine Daten gespeichert?|¿Dónde se guardan mis datos?",
    "Solo nel browser del tuo dispositivo: non c’è nessun account e nessun server che li conserva. Questo significa anche che non si sincronizzano tra telefono e computer.": "Only in your device's browser: there is no account and no server that keeps them. This also means they do not sync between phone and computer.|Nur im Browser deines Geräts: es gibt kein Konto und keinen Server, der sie aufbewahrt. Das heißt auch, dass sie nicht zwischen Telefon und Computer abgeglichen werden.|Solo en el navegador de tu dispositivo: no hay ninguna cuenta ni ningún servidor que los conserve. Esto significa también que no se sincronizan entre el teléfono y el ordenador.",
    "Cosa succede se cambio telefono o cancello i dati del browser?": "What happens if I change phone or clear the browser data?|Was passiert, wenn ich das Telefon wechsle oder die Browserdaten lösche?|¿Qué pasa si cambio de teléfono o borro los datos del navegador?",
    "I progressi si perdono, a meno che tu abbia un backup. In Impostazioni puoi scaricare un file di backup e, sul nuovo dispositivo, caricarlo dalla schermata iniziale o da Impostazioni → Ripristina da file. L’app tiene anche una copia automatica al giorno per le ultime due settimane.": "The progress is lost, unless you have a backup. In Settings you can download a backup file and, on the new device, load it from the first screen or from Settings → Restore from file. The app also keeps one automatic copy a day for the last two weeks.|Die Fortschritte gehen verloren, außer du hast eine Sicherung. In den Einstellungen kannst du eine Sicherungsdatei herunterladen und sie auf dem neuen Gerät vom Startbildschirm oder über Einstellungen → Aus Datei wiederherstellen laden. Die App legt außerdem jeden Tag eine automatische Kopie an, für die letzten zwei Wochen.|Los progresos se pierden, a menos que tengas una copia. En Ajustes puedes descargar un archivo de copia y, en el nuevo dispositivo, cargarlo desde la pantalla inicial o desde Ajustes → Restaurar desde archivo. La app guarda también una copia automática al día durante las últimas dos semanas.",
    "Come uso l’app come se fosse un’applicazione?": "How do I use the app as if it were an application?|Wie nutze ich die App wie eine Anwendung?|¿Cómo uso la app como si fuera una aplicación?",
    "Su iPhone apri il sito in Safari, tocca Condividi e poi “Aggiungi alla schermata Home”. Su Android usa il menu del browser e “Aggiungi a schermata Home”.": "On iPhone open the site in Safari, tap Share and then “Add to Home Screen”. On Android use the browser menu and “Add to Home screen”.|Öffne auf dem iPhone die Seite in Safari, tippe auf Teilen und dann auf „Zum Home-Bildschirm“. Nutze auf Android das Browsermenü und „Zum Startbildschirm hinzufügen“.|En iPhone abre el sitio en Safari, toca Compartir y luego “Añadir a pantalla de inicio”. En Android usa el menú del navegador y “Añadir a pantalla de inicio”.",
    "Il testo biblico è incluso?": "Is the Bible text included?|Ist der Bibeltext enthalten?|¿Está incluido el texto bíblico?",
    "No: l’app indica che cosa leggere, ma il testo lo leggi nella tua Bibbia, cartacea o digitale, nella traduzione che preferisci.": "No: the app says what to read, but you read the text in your own Bible, printed or digital, in the translation you prefer.|Nein: die App sagt, was zu lesen ist, aber den Text liest du in deiner eigenen Bibel, gedruckt oder digital, in der Übersetzung, die du bevorzugst.|No: la app indica qué leer, pero el texto lo lees en tu propia Biblia, en papel o digital, en la traducción que prefieras.",
    "I numeri dei versetti non coincidono con la mia Bibbia.": "The verse numbers do not match my Bible.|Die Versnummern stimmen nicht mit meiner Bibel überein.|Los números de los versículos no coinciden con mi Biblia.",
    "Alcuni libri (per esempio Levitico, Osea, Gioele o Malachia) e molti Salmi hanno una numerazione dei versetti diversa a seconda della traduzione. Se succede, usa il capitolo come riferimento principale.": "Some books (for example Leviticus, Hosea, Joel or Malachi) and many Psalms have a different verse numbering depending on the translation. If that happens, use the chapter as the main reference.|Einige Bücher (zum Beispiel Levitikus, Hosea, Joel oder Maleachi) und viele Psalmen haben je nach Übersetzung eine andere Verszählung. Wenn das passiert, nimm das Kapitel als Hauptbezug.|Algunos libros (por ejemplo Levítico, Oseas, Joel o Malaquías) y muchos Salmos tienen una numeración de versículos distinta según la traducción. Si ocurre, usa el capítulo como referencia principal.",
    "Ci saranno i promemoria?": "Will there be reminders?|Wird es Erinnerungen geben?|¿Habrá recordatorios?",
    "Per ora no. Se ti serve, puoi impostare una sveglia ricorrente sul telefono.": "For now, no. If you need one, you can set a recurring alarm on your phone.|Vorerst nicht. Wenn du eins brauchst, kannst du auf dem Telefon einen wiederkehrenden Wecker stellen.|Por ahora no. Si lo necesitas, puedes poner una alarma recurrente en el teléfono.",
    "Costa qualcosa?": "Does it cost anything?|Kostet es etwas?|¿Cuesta algo?",
    "No. L’app è gratuita e senza pubblicità.": "No. The app is free and has no advertising.|Nein. Die App ist kostenlos und ohne Werbung.|No. La app es gratuita y sin publicidad.",
    "Come segnalo un errore o un suggerimento?": "How do I report an error or a suggestion?|Wie melde ich einen Fehler oder eine Anregung?|¿Cómo informo de un error o una sugerencia?",
    "Ogni percorso nella Parola è un dono che non si compie da soli. Questo cammino, nato come un semplice desiderio di ordine e meditazione, è diventato un invito alla comunione: con Dio, con la Sua Parola e con tutti coloro che desiderano conoscerLo più profondamente.": "Every journey in the Word is a gift that is not completed alone. This path, born from a simple desire for order and meditation, has become an invitation to communion: with God, with His Word and with all who wish to know Him more deeply.|Jeder Weg im Wort ist eine Gabe, die nicht allein vollendet wird. Dieser Weg, entstanden aus einem einfachen Wunsch nach Ordnung und Besinnung, ist zu einer Einladung zur Gemeinschaft geworden: mit Gott, mit Seinem Wort und mit allen, die Ihn tiefer kennenlernen möchten.|Todo recorrido en la Palabra es un don que no se cumple en soledad. Este camino, nacido de un simple deseo de orden y meditación, se ha vuelto una invitación a la comunión: con Dios, con Su Palabra y con todos los que desean conocerlo más profundamente.",
    "Ringrazio il Signore, autore e compimento di ogni cosa buona, perché ogni versetto letto, ogni aurora e ogni tramonto di questo piano parlano prima di tutto di Lui. Se qualcosa in queste pagine può edificare o incoraggiare, la gloria non è dell’uomo, ma del Nome che è sopra ogni nome.": "I thank the Lord, author and fulfilment of every good thing, because every verse read, every dawn and every sunset of this plan speak first of all of Him. If anything in these pages can build up or encourage, the glory is not man's, but of the Name that is above every name.|Ich danke dem Herrn, dem Urheber und der Vollendung alles Guten, denn jeder gelesene Vers, jede Morgendämmerung und jeder Sonnenuntergang dieses Plans sprechen zuerst von Ihm. Wenn etwas auf diesen Seiten aufbauen oder ermutigen kann, gebührt die Ehre nicht dem Menschen, sondern dem Namen, der über alle Namen ist.|Doy gracias al Señor, autor y plenitud de todo lo bueno, porque cada versículo leído, cada aurora y cada atardecer de este plan hablan ante todo de Él. Si algo en estas páginas puede edificar o animar, la gloria no es del hombre, sino del Nombre que está sobre todo nombre.",
    "Un sincero ringraziamento a chi, con parole, suggerimenti o semplicemente con la preghiera, ha incoraggiato la realizzazione di questo piano.": "A sincere thank you to those who, with words, suggestions or simply with prayer, encouraged the making of this plan.|Ein aufrichtiger Dank an alle, die mit Worten, Anregungen oder einfach mit Gebet die Entstehung dieses Plans ermutigt haben.|Un sincero agradecimiento a quienes, con palabras, sugerencias o simplemente con la oración, animaron la realización de este plan.",
    "E un pensiero speciale va a chi, un giorno, potrà percorrerlo ancora: che possa trovare nella Parola la stessa luce che guida i miei passi, e che anche la mia Aurora, quando verrà il suo tempo, possa amarla e lasciarsi illuminare da essa.": "And a special thought goes to those who, one day, will walk it again: may they find in the Word the same light that guides my steps, and may my own Aurora too, when her time comes, love it and let herself be lighted by it.|Und ein besonderer Gedanke gilt denen, die ihn eines Tages noch einmal gehen dürfen: mögen sie im Wort dasselbe Licht finden, das meine Schritte führt, und möge auch meine Aurora, wenn ihre Zeit kommt, es lieben und sich von ihm erleuchten lassen.|Y un pensamiento especial va a quien, algún día, pueda recorrerlo de nuevo: que encuentre en la Palabra la misma luz que guía mis pasos, y que también mi Aurora, cuando llegue su tiempo, pueda amarla y dejarse iluminar por ella."
  };

  /* Le frasi con un numero, una data o un nome dentro.
     $1, $2… sono le stesse parentesi della frase italiana, nell'ordine. */
  var MOD = [
    ["^(\\d+) di (\\d+) capitoli letti$", "$1 of $2 chapters read|$1 von $2 Kapiteln gelesen|$1 de $2 capítulos leídos"],
    ["^(\\d+) al giorno$", "$1 a day|$1 pro Tag|$1 al día"],
    ["^(\\d+) letture$", "$1 readings|$1 Lesungen|$1 lecturas"],
    ["^(\\d+) giorni di fila$", "$1 days in a row|$1 Tage in Folge|$1 días seguidos"],
    ["^ultimi (\\d+) giorni$", "last $1 days|letzte $1 Tage|últimos $1 días"],
    ["^(\\d+) giorni letti su (\\d+)$", "$1 days read out of $2|$1 Tage von $2 gelesen|$1 días leídos de $2"],
    ["^(\\d+) giorni letti in tutto\\. Il calendario si colora da solo quando segni una lettura\\.$", "$1 days read in all. The calendar colours itself when you mark a reading.|$1 gelesene Tage insgesamt. Der Kalender färbt sich, wenn du eine Lesung markierst.|$1 días leídos en total. El calendario se colorea cuando marcas una lectura."],
    ["^(\\d{2})/(\\d{2})/(\\d{4}) · (\\d+) letture, (\\d+) giorni$", "$1/$2/$3 · $4 readings, $5 days|$1.$2.$3 · $4 Lesungen, $5 Tage|$1/$2/$3 · $4 lecturas, $5 días"],
    ["^Fine prevista: (.+)$", "Expected finish: $1|Voraussichtliches Ende: $1|Fin previsto: $1"],
    ["^Finirai il (.+), se leggi ogni giorno\\.$", "You will finish on $1 if you read every day.|Du bist am $1 fertig, wenn du jeden Tag liest.|Terminarás el $1 si lees cada día."],
    /* Prima la frase intera, poi quella spezzata: «Conferma Dawn — Adesso è
       il momento di Dawn.» è l'aria-label del pulsante, e la regola generica
       «Conferma …» la prenderebbe a metà. */
    ["^Conferma (.+?) — Adesso è il momento di (.+)\\.$", "Confirm $1 — It’s time for $2.|Bestätigen: $1 — Jetzt ist $2 dran.|Confirmar $1 — Es el momento de $2."],
    ["^Conferma (.+)$", "Confirm $1|Bestätigen: $1|Confirmar $1"],
    ["^Adesso è il momento di (.+)\\.$", "It’s time for $1.|Jetzt ist $1 dran.|Es el momento de $1."],
    ["^Ancora (\\d+) letture oggi · tocca per segnare (.+)\\.$", "$1 readings left today · tap to mark $2.|Noch $1 Lesungen heute · tippe, um $2 zu markieren.|Quedan $1 lecturas hoy · toca para marcar $2."],
    ["^Resta solo (.+)\\.$", "Only $1 is left.|Nur $1 fehlt noch.|Solo falta $1."],
    ["^Hai segnato tutte e (\\d+) le letture di oggi\\. Torna domani: la serie continua\\.$", "You marked all $1 readings for today. Come back tomorrow: the streak goes on.|Du hast alle $1 Lesungen von heute markiert. Komm morgen wieder: die Serie läuft weiter.|Has marcado las $1 lecturas de hoy. Vuelve mañana: la racha sigue."],
    ["^Segna (.+) come letto$", "Mark $1 as read|$1 als gelesen markieren|Marcar $1 como leído"],
    ["^Ora del promemoria (.+)$", "Reminder time for $1|Erinnerungszeit für $1|Hora del recordatorio de $1"],
    ["^Promemoria (.+): attivo$", "Reminder $1: on|Erinnerung $1: an|Recordatorio $1: activado"],
    ["^Promemoria (.+): spento$", "Reminder $1: off|Erinnerung $1: aus|Recordatorio $1: desactivado"],
    ["^Fatto: (\\d+) promemoria da aggiungere al calendario\\.$", "Done: $1 reminders to add to the calendar.|Fertig: $1 Erinnerungen zum Kalender hinzufügen.|Hecho: $1 recordatorios para añadir al calendario."],
    ["^Scaricato «(.+)»: aprilo per aggiungere i promemoria al calendario\\.$", "Downloaded “$1”: open it to add the reminders to the calendar.|„$1“ heruntergeladen: öffne sie, um die Erinnerungen zum Kalender hinzuzufügen.|Descargado «$1»: ábrelo para añadir los recordatorios al calendario."],
    ["^Come da piano \\((.+)\\)$", "As planned ($1)|Wie im Plan ($1)|Según el plan ($1)"],
    ["^inizia da: (.+)$", "starts at: $1|Start: $1|empieza en: $1"],
    ["^· giro (\\d+) · (\\d+)/(\\d+) nel giro$", "· lap $1 · $2/$3 this lap|· Runde $1 · $2/$3 in dieser Runde|· vuelta $1 · $2/$3 en esta vuelta"],
    ["^(\\d+)/(\\d+) nel giro$", "$1/$2 this lap|$1/$2 in dieser Runde|$1/$2 en esta vuelta"],
    ["^· (\\d+) volte ·$", "· $1 times ·|· $1-mal ·|· $1 veces ·"],
    ["^letto (\\d+) volte$", "read $1 times|$1-mal gelesen|leído $1 veces"],
    ["^Aggiungi i giri fatti prima \\((\\d+)\\)$", "Add the laps done before ($1)|Die früheren Runden hinzufügen ($1)|Añadir las vueltas anteriores ($1)"],
    ["^e altri (\\d+) capitoli, in fondo alla lista\\.$", "and $1 more chapters, at the end of the list.|und $1 weitere Kapitel, am Ende der Liste.|y $1 capítulos más, al final de la lista."],
    ["^Hai accesso come (.+)\\. (.+)\\.$", "Signed in as $1. $2.|Angemeldet als $1. $2.|Sesión iniciada como $1. $2."],
    ["^Salvato alle (\\d{2}:\\d{2}) · solo su questo dispositivo$", "Saved at $1 · on this device only|Gespeichert um $1 · nur auf diesem Gerät|Guardado a las $1 · solo en este dispositivo"],
    /* il salto di lettura (aurora-salta): frasi con un riferimento dentro */
    ["^Adesso: (.+) · lettura (\\d+) di (\\d+)$", "Now: $1 · reading $2 of $3|Jetzt: $1 · Lesung $2 von $3|Ahora: $1 · lectura $2 de $3"],
    ["^Segno (.+) come letto · riprendi da (.+)\\.$", "Marking $1 as read · continue from $2.|Ich markiere $1 als gelesen · weiter bei $2.|Marco $1 como leído · sigo desde $2."],
    ["^«(.+)» · lettura (\\d+) di (\\d+)\\. Il segnaposto si sposta lì, senza segnare niente\\.$", "“$1” · reading $2 of $3. The bookmark moves there, without marking anything.|„$1“ · Lesung $2 von $3. Das Lesezeichen wandert dorthin, ohne etwas zu markieren.|«$1» · lectura $2 de $3. El marcador se mueve allí, sin marcar nada."],
    ["^Non conosco «(.+)»\\.$", "I do not know “$1”.|Ich kenne „$1“ nicht.|No conozco «$1»."],
    ["^«(.+)» non esiste: (.+) ha (\\d+) capitoli\\.$", "“$1” does not exist: $2 has $3 chapters.|„$1“ gibt es nicht: $2 hat $3 Kapitel.|«$1» no existe: $2 tiene $3 capítulos."],
    ["^«(.+)» non esiste: (.+) (\\d+) ha (\\d+) versetti\\.$", "“$1” does not exist: $2 $3 has $4 verses.|„$1“ gibt es nicht: $2 $3 hat $4 Verse.|«$1» no existe: $2 $3 tiene $4 versículos."],
    ["^Tocca il versetto dove ti sei fermato e segno la parte letta, riprendendo da quello dopo\\.$", "Tap the verse where you stopped and I will mark the part read, continuing from the next one.|Tippe den Vers, bei dem du stehen geblieben bist, und ich markiere den gelesenen Teil, weiter geht es beim nächsten.|Toca el versículo donde te detuviste y marcaré la parte leída, siguiendo por el siguiente."],
    ["^(.+) non risulta letto: nessuna spunta lo copre\\.$", "$1 does not look read: no tick covers it.|$1 scheint nicht gelesen: kein Haken deckt es ab.|$1 no figura leído: ningún visto bueno lo cubre."],
    ["^«(.+)» non è in questo piano\\.$", "“$1” is not in this plan.|„$1“ ist nicht in diesem Plan.|«$1» no está en este plan."],
    ["^Fino al (\\d+)$", "Up to $1|Bis $1|Hasta $1"],
    ["^Torna a (.+)$", "Back to $1|Zurück zu $1|Volver a $1"],
    ["^Salterai una lettura \\((.+)\\): resta da leggere, non la segno io\\.$", "You will skip one reading ($1): it stays unread, I do not mark it.|Du überspringst eine Lesung ($1): sie bleibt ungelesen, ich markiere sie nicht.|Saltarás una lectura ($1): queda sin leer, no la marco."],
    ["^Salterai (\\d+) letture \\((.+) → (.+)\\): restano da leggere, non le segno io\\.$", "You will skip $1 readings ($2 → $3): they stay unread, I do not mark them.|Du überspringst $1 Lesungen ($2 → $3): sie bleiben ungelesen, ich markiere sie nicht.|Saltarás $1 lecturas ($2 → $3): quedan sin leer, no las marco."],
    ["^(.+) è già letto: si torna indietro, non si cancella niente\\.$", "$1 is already read: you go back, nothing is erased.|$1 ist schon gelesen: du gehst zurück, nichts wird gelöscht.|$1 ya está leído: vuelves atrás, no se borra nada."],
    ["^Di (.+) hai già letto una parte: il resto era rimasto indietro\\.$", "You have already read part of $1: the rest had been left behind.|Von $1 hast du schon einen Teil gelesen: der Rest war zurückgeblieben.|De $1 ya has leído una parte: el resto se había quedado atrás."],
    ["^(.+?) è prima di (.+?): quel pezzo è già letto, non c’è niente da segnare\\.$", "$1 comes before $2: that part is already read, there is nothing to mark.|$1 kommt vor $2: dieser Teil ist schon gelesen, es gibt nichts zu markieren.|$1 está antes de $2: esa parte ya está leída, no hay nada que marcar."],
    ["^Codice non valido: (.+)$", "Invalid code: $1|Ungültiger Code: $1|Código no válido: $1"],
    ["^Vuoi mettere in pausa (.+?) e iniziare da (.+?)\\? Scegli il libro: la lettura prosegue da lì e ciò che leggeva prima passa dopo, quindi (.+?) non si perde: viene letta più avanti\\. Se il libro era di un’altra lettura, passa a questa\\. Attenzione: così le letture possono diventare più lunghe o più corte di altre\\.$", "Pause $1 and start from $2? Pick the book: the reading goes on from there and what it was reading moves later, so $3 is not lost: it is read further on. If the book belonged to another reading, it moves to this one. Careful: readings may become longer or shorter than others.|$1 pausieren und bei $2 beginnen? Wähle das Buch: die Lesung läuft von dort weiter, und was sie vorher las, kommt später, $3 geht also nicht verloren: es wird weiter hinten gelesen. War das Buch Teil einer anderen Lesung, wechselt es zu dieser. Achtung: Lesungen können dadurch länger oder kürzer werden als andere.|¿Pausar $1 y empezar en $2? Elige el libro: la lectura sigue desde ahí y lo que leía antes pasa después, así $3 no se pierde: se lee más adelante. Si el libro era de otra lectura, pasa a esta. Ojo: así unas lecturas pueden quedar más largas o más cortas que otras."]
  ];

  /* Alcune frasi l'app le spezza in piu' pezzi, con i numeri in elementi
     accanto: «0 di 1189 capitoli letti» sono QUATTRO nodi. Qui ci sono i pezzi
     che restano identici — il numero lo mette l'app, e non va toccato. */
  var FRAM = {
    "capitoli letti": "chapters read|Kapitel gelesen|capítulos leídos",
    "giorni letti su": "days read out of|Tage gelesen von|días leídos de",
    "giorni letti in tutto. Il calendario si colora da solo quando segni una lettura.": "days read in all. The calendar colours itself when you mark a reading.|Tage gelesen insgesamt. Der Kalender färbt sich, wenn du eine Lesung markierst.|días leídos en total. El calendario se colorea cuando marcas una lectura.",
    "Fine prevista:": "Expected finish:|Voraussichtliches Ende:|Fin previsto:",
    "al giorno": "a day|pro Tag|al día",
    "Come da piano (": "As planned (|Wie im Plan (|Según el plan (",
    "· piano di lettura biblica in più momenti del giorno": "· a Bible reading plan for several moments of the day|· ein Bibelleseplan für mehrere Tageszeiten|· un plan de lectura bíblica en varios momentos del día"
  };

  /* Le iniziali dei giorni, lunedì → domenica: l'app le scrive italiane
     (L M M G V S D) e vanno lette per posizione, perché una lettera sola
     tradotta a caso sarebbe un pasticcio. */
  var GIORNI = [
    ["M", "T", "W", "T", "F", "S", "S"],
    ["M", "D", "M", "D", "F", "S", "S"],
    ["L", "M", "X", "J", "V", "S", "D"]
  ];

  /* I mesi, per le date che l'app scrive in italiano ("7 gennaio 2028") */
  var MESI = {
    gennaio: ["January", "Januar", "enero"],
    febbraio: ["February", "Februar", "febrero"],
    marzo: ["March", "März", "marzo"],
    aprile: ["April", "April", "abril"],
    maggio: ["May", "Mai", "mayo"],
    giugno: ["June", "Juni", "junio"],
    luglio: ["July", "Juli", "julio"],
    agosto: ["August", "August", "agosto"],
    settembre: ["September", "September", "septiembre"],
    ottobre: ["October", "Oktober", "octubre"],
    novembre: ["November", "November", "noviembre"],
    dicembre: ["December", "Dezember", "diciembre"]
  };

  /* I 66 NOMI DEI LIBRI. Sono i nomi come li scrive l'app nei riferimenti
     («Genesi 1», «Salmo 119:1-36», «1 Samuele 3»): la chiave è quello
     italiano, e la traduzione è il solo nome del libro — i numeri li mette
     l'app e restano dove sono. Il motore li riconosce in due posti: quando un
     nodo *è* un riferimento, e dentro i pezzi catturati da un modello
     («Salterai 185 letture (Esodo 29 → Isaia 17-21)»).

     Niente qui tocca il piano salvato, il backup o il PDF: la traduzione si
     applica solo al testo disegnato, quindi i riferimenti nelle date, nei
     documenti e nei codici restano quelli italiani che l'app conosce. */
  var LIBRI = {
    "Genesi": "Genesis|1. Mose|Génesis",
    "Esodo": "Exodus|2. Mose|Éxodo",
    "Levitico": "Leviticus|3. Mose|Levítico",
    "Numeri": "Numbers|4. Mose|Números",
    "Deuteronomio": "Deuteronomy|5. Mose|Deuteronomio",
    "Giosuè": "Joshua|Josua|Josué",
    "Giudici": "Judges|Richter|Jueces",
    "Rut": "Ruth|Rut|Rut",
    "1 Samuele": "1 Samuel|1. Samuel|1 Samuel",
    "2 Samuele": "2 Samuel|2. Samuel|2 Samuel",
    "1 Re": "1 Kings|1. Könige|1 Reyes",
    "2 Re": "2 Kings|2. Könige|2 Reyes",
    "1 Cronache": "1 Chronicles|1. Chronik|1 Crónicas",
    "2 Cronache": "2 Chronicles|2. Chronik|2 Crónicas",
    "Esdra": "Ezra|Esra|Esdras",
    "Neemia": "Nehemiah|Nehemia|Nehemías",
    "Ester": "Esther|Ester|Ester",
    "Giobbe": "Job|Hiob|Job",
    "Salmo": "Psalm|Psalm|Salmo",
    "Proverbi": "Proverbs|Sprüche|Proverbios",
    "Ecclesiaste": "Ecclesiastes|Prediger|Eclesiastés",
    "Cantico": "Song of Songs|Hoheslied|Cantar de los Cantares",
    "Isaia": "Isaiah|Jesaja|Isaías",
    "Geremia": "Jeremiah|Jeremia|Jeremías",
    "Lamentazioni": "Lamentations|Klagelieder|Lamentaciones",
    "Ezechiele": "Ezekiel|Ezechiel|Ezequiel",
    "Daniele": "Daniel|Daniel|Daniel",
    "Osea": "Hosea|Hosea|Oseas",
    "Gioele": "Joel|Joel|Joel",
    "Amos": "Amos|Amos|Amós",
    "Abdia": "Obadiah|Obadja|Abdías",
    "Giona": "Jonah|Jona|Jonás",
    "Michea": "Micah|Micha|Miqueas",
    "Naum": "Nahum|Nahum|Nahúm",
    "Abacuc": "Habakkuk|Habakuk|Habacuc",
    "Sofonia": "Zephaniah|Zefanja|Sofonías",
    "Aggeo": "Haggai|Haggai|Hageo",
    "Zaccaria": "Zechariah|Sacharja|Zacarías",
    "Malachia": "Malachi|Maleachi|Malaquías",
    "Matteo": "Matthew|Matthäus|Mateo",
    "Marco": "Mark|Markus|Marcos",
    "Luca": "Luke|Lukas|Lucas",
    "Giovanni": "John|Johannes|Juan",
    "Atti": "Acts|Apostelgeschichte|Hechos",
    "Romani": "Romans|Römer|Romanos",
    "1 Corinzi": "1 Corinthians|1. Korinther|1 Corintios",
    "2 Corinzi": "2 Corinthians|2. Korinther|2 Corintios",
    "Galati": "Galatians|Galater|Gálatas",
    "Efesini": "Ephesians|Epheser|Efesios",
    "Filippesi": "Philippians|Philipper|Filipenses",
    "Colossesi": "Colossians|Kolosser|Colosenses",
    "1 Tessalonicesi": "1 Thessalonians|1. Thessalonicher|1 Tesalonicenses",
    "2 Tessalonicesi": "2 Thessalonians|2. Thessalonicher|2 Tesalonicenses",
    "1 Timoteo": "1 Timothy|1. Timotheus|1 Timoteo",
    "2 Timoteo": "2 Timothy|2. Timotheus|2 Timoteo",
    "Tito": "Titus|Titus|Tito",
    "Filemone": "Philemon|Philemon|Filemón",
    "Ebrei": "Hebrews|Hebräer|Hebreos",
    "Giacomo": "James|Jakobus|Santiago",
    "1 Pietro": "1 Peter|1. Petrus|1 Pedro",
    "2 Pietro": "2 Peter|2. Petrus|2 Pedro",
    "1 Giovanni": "1 John|1. Johannes|1 Juan",
    "2 Giovanni": "2 John|2. Johannes|2 Juan",
    "3 Giovanni": "3 John|3. Johannes|3 Juan",
    "Giuda": "Jude|Judas|Judas",
    "Apocalisse": "Revelation|Offenbarung|Apocalipsis"
  };

  /* i nomi dei momenti in tutte e quattro le lingue: servono per riconoscere lo
     stesso momento quando la lingua cambia (una chiave salvata ieri non deve
     perdersi oggi) */
  var MOMENTI = {
    it: ["Giornata", "Mattino", "Aurora", "Mezzodì", "Pomeriggio", "Sera", "Tramonto"],
    en: ["Day", "Morning", "Dawn", "Midday", "Afternoon", "Evening", "Sunset"],
    de: ["Tag", "Morgen", "Morgendämmerung", "Mittag", "Nachmittag", "Abend", "Sonnenuntergang"],
    es: ["Día", "Mañana", "Amanecer", "Mediodía", "Tarde", "Noche", "Atardecer"]
  };

  /* I BLOCCHI DI PIÙ RIGHE. Una poesia o un brano non si traduce riga per
     riga: in tedesco il verbo va in fondo, in spagnolo l'aggettivo cambia
     posto, e riga per riga verrebbe un mosaico. Qui la chiave è TUTTO il
     blocco, con le righe separate da «\n» (le <br> della pagina), e la
     traduzione torna giù nelle righe: il motore ricostruisce le <br>. */
  var RIGHE = {
    "L’Aurora (שַׁחַר — shachar) è l’inizio del giorno,\nma anche il segno di una vita che rinasce.\nNel linguaggio ebraico, shachar proviene dalla stessa radice\nche significa cercare con ardore e spuntare come germoglio.\nÈ la luce che sorge dalla terra,\nl’alba del cuore che si volge verso Dio.\nCome un germoglio che rompe la notte e cerca il sole,\nl’aurora è la prima rivelazione della grazia.\nE questa immagine si compie nel Germoglio giusto\n(צֶמַח צַדִּיק — tsemach tsaddiq), annunciato dai profeti,\nil Messia stesso:":
      "The Dawn (שַׁחַר — shachar) is the beginning of the day,\nbut also the sign of a life born again.\nIn Hebrew, shachar comes from the same root\nthat means to seek eagerly and to sprout like a shoot.\nIt is the light that rises from the earth,\nthe dawn of the heart that turns to God.\nLike a shoot that breaks the night and seeks the sun,\nthe dawn is the first revelation of grace.\nAnd this image is fulfilled in the righteous Branch\n(צֶמַח צַדִּיק — tsemach tsaddiq), foretold by the prophets,\nthe Messiah himself:|Die Morgendämmerung (שַׁחַר — shachar) ist der Beginn des Tages,\naber auch das Zeichen eines Lebens, das neu geboren wird.\nIm Hebräischen stammt shachar aus derselben Wurzel,\ndie eifrig suchen und wie ein Schössling sprießen bedeutet.\nSie ist das Licht, das aus der Erde aufsteigt,\ndie Morgendämmerung des Herzens, das sich Gott zuwendet.\nWie ein Schössling, der die Nacht durchbricht und die Sonne sucht,\nist die Morgendämmerung die erste Offenbarung der Gnade.\nUnd dieses Bild erfüllt sich im gerechten Spross\n(צֶמַח צַדִּיק — tsemach tsaddiq), den die Propheten angekündigt haben,\ndem Messias selbst:|La Aurora (שַׁחַר — shachar) es el comienzo del día,\npero también la señal de una vida que renace.\nEn el lenguaje hebreo, shachar proviene de la misma raíz\nque significa buscar con ardor y brotar como un retoño.\nEs la luz que surge de la tierra,\nel alba del corazón que se vuelve hacia Dios.\nComo un retoño que rompe la noche y busca el sol,\nla aurora es la primera revelación de la gracia.\nY esta imagen se cumple en el Retoño justo\n(צֶמַח צַדִּיק — tsemach tsaddiq), anunciado por los profetas,\nel Mesías mismo:",
    "La stessa luce dell’aurora è il Cristo che viene:\nla promessa che germoglia, la giustizia che sorge.":
      "The same light of the dawn is the Christ who comes:\nthe promise that sprouts, the justice that rises.|Dasselbe Licht der Morgendämmerung ist der kommende Christus:\ndie Verheißung, die sprießt, die Gerechtigkeit, die aufsteigt.|La misma luz de la aurora es el Cristo que viene:\nla promesa que germina, la justicia que surge.",
    "Sotto il cielo stellato di Genesi 15,\nAbramo alza gli occhi e ascolta la voce che dice:\n«Guarda le stelle del cielo e contale se puoi contarle…»\nQuella promessa, sigillata nel fuoco e nel sonno,\ndiventa il filo dorato che attraversa tutta la Scrittura.":
      "Under the starry sky of Genesis 15,\nAbram lifts his eyes and hears the voice that says:\n“Look at the stars of the sky and count them if you can…”\nThat promise, sealed in fire and in sleep,\nbecomes the golden thread that runs through all Scripture.|Unter dem Sternenhimmel von 1. Mose 15\nerhebt Abram die Augen und hört die Stimme, die spricht:\n„Sieh die Sterne des Himmels und zähle sie, wenn du sie zählen kannst …“\nDiese Verheißung, in Feuer und Schlaf besiegelt,\nwird zum goldenen Faden, der die ganze Schrift durchzieht.|Bajo el cielo estrellado de Génesis 15,\nAbram levanta los ojos y escucha la voz que dice:\n«Mira las estrellas del cielo y cuéntalas, si puedes contarlas…»\nAquella promesa, sellada en el fuego y en el sueño,\nse convierte en el hilo dorado que atraviesa toda la Escritura.",
    "Ogni libro, ogni patto, ogni rinascita ne è un’eco:\nla fede che nasce allo spuntar del sole e che cresce fino al tramonto.":
      "Every book, every covenant, every rebirth is an echo of it:\nfaith that is born at sunrise and grows until sunset.|Jedes Buch, jeder Bund, jede Wiedergeburt ist ein Echo davon:\nder Glaube, der beim Sonnenaufgang entsteht und bis zum Sonnenuntergang wächst.|Cada libro, cada pacto, cada renacimiento es un eco de ello:\nla fe que nace al salir el sol y crece hasta el atardecer.",
    "L’intero cammino segue questo ritmo: quattro anni esatti,\ncome le stagioni di un’unica Rivelazione che nasce, cresce, fruttifica e riposa.":
      "The whole journey follows this rhythm: four exact years,\nlike the seasons of one single Revelation that is born, grows, bears fruit and rests.|Der ganze Weg folgt diesem Rhythmus: genau vier Jahre,\nwie die Jahreszeiten einer einzigen Offenbarung, die geboren wird, wächst, Frucht bringt und ruht.|Todo el camino sigue este ritmo: cuatro años exactos,\ncomo las estaciones de una única Revelación que nace, crece, da fruto y reposa.",
    "Dall’aurora di Genesi al tramonto dell’Apocalisse,\nogni giorno è un germoglio di luce,\nogni capitolo un passo nel campo della grazia,\nogni tramonto un ritorno al cuore del Messia.":
      "From the dawn of Genesis to the sunset of Revelation,\nevery day is a shoot of light,\nevery chapter a step in the field of grace,\nevery sunset a return to the heart of the Messiah.|Von der Morgendämmerung der Genesis bis zum Sonnenuntergang der Offenbarung\nist jeder Tag ein Schössling des Lichts,\njedes Kapitel ein Schritt auf dem Feld der Gnade,\njeder Sonnenuntergang eine Rückkehr zum Herzen des Messias.|De la aurora del Génesis al atardecer del Apocalipsis,\ncada día es un retoño de luz,\ncada capítulo un paso en el campo de la gracia,\ncada atardecer un regreso al corazón del Mesías.",
    "Con il tempo, le tre vie si intrecciano e diventano una sola strada:\nmetafora di Cristo — la Via, la Verità e la Vita.":
      "With time, the three ways weave together and become one single road:\na metaphor of Christ — the Way, the Truth and the Life.|Mit der Zeit verflechten sich die drei Wege und werden eine einzige Straße:\nein Bild für Christus — der Weg, die Wahrheit und das Leben.|Con el tiempo, las tres vías se entrelazan y se vuelven un solo camino:\nmetáfora de Cristo — el Camino, la Verdad y la Vida.",
    "Nelle stagioni del piano, specialmente al Tramonto,\nla voce si fa salmo, proverbio, poesia e canto.\nGiobbe grida, i Salmi pregano, i Proverbi educano,\nEcclesiaste interroga, il Cantico ama.":
      "In the seasons of the plan, especially at Sunset,\nthe voice becomes psalm, proverb, poetry and song.\nJob cries out, the Psalms pray, the Proverbs teach,\nEcclesiastes questions, the Song loves.|In den Jahreszeiten des Plans, besonders am Sonnenuntergang,\nwird die Stimme Psalm, Sprichwort, Dichtung und Gesang.\nHiob schreit, die Psalmen beten, die Sprüche erziehen,\nPrediger fragt, das Hohelied liebt.|En las estaciones del plan, especialmente al Atardecer,\nla voz se hace salmo, proverbio, poesía y canto.\nJob grita, los Salmos oran, los Proverbios educan,\nEclesiastés interroga, el Cantar ama.",
    "Qui il cuore impara a rispondere alla Parola:\ncon il lamento, con la lode, con la sapienza e con l’amore.":
      "Here the heart learns to answer the Word:\nwith lament, with praise, with wisdom and with love.|Hier lernt das Herz, dem Wort zu antworten:\nmit Klage, mit Lob, mit Weisheit und mit Liebe.|Aquí el corazón aprende a responder a la Palabra:\ncon el lamento, con la alabanza, con la sabiduría y con el amor.",
    "Per questo il percorso serale passa dapprima\ndai Libri Poetici (Giobbe → Cantico),\npoi dai Profeti, maggiori e minori —\nperché la preghiera e il canto preparano l’ascolto profetico.":
      "That is why the evening path passes first\nthrough the Poetic Books (Job → Song),\nthen through the Prophets, major and minor —\nbecause prayer and song prepare the ear for the prophets.|Darum führt der abendliche Weg zuerst\ndurch die poetischen Bücher (Hiob → Hohelied),\ndann durch die Propheten, die großen und die kleinen —\nweil Gebet und Gesang das Hören auf die Propheten vorbereiten.|Por eso el recorrido de la tarde pasa primero\npor los Libros Poéticos (Job → Cantar),\ndespués por los Profetas, mayores y menores —\nporque la oración y el canto preparan la escucha profética.",
    "Quando il giorno cala, la stessa voce che parlava dai monti\nscende nel silenzio del cuore.\nLa Parola cammina, guarisce, consola.\nNei Vangeli si compie ciò che l’Antico aveva annunciato,\ne il lettore trova pace nella grazia del Figlio.\nOgni sera, la Scrittura diventa respiro:\npane che sazia, luce che consola.":
      "When the day declines, the same voice that spoke from the mountains\ndescends into the silence of the heart.\nThe Word walks, heals, comforts.\nIn the Gospels what the Old had announced is fulfilled,\nand the reader finds peace in the grace of the Son.\nEvery evening, Scripture becomes breath:\nbread that satisfies, light that comforts.|Wenn der Tag sich neigt, steigt dieselbe Stimme, die von den Bergen sprach,\nin die Stille des Herzens hinab.\nDas Wort geht, heilt, tröstet.\nIn den Evangelien erfüllt sich, was das Alte angekündigt hatte,\nund der Leser findet Frieden in der Gnade des Sohnes.\nJeden Abend wird die Schrift zum Atem:\nBrot, das sättigt, Licht, das tröstet.|Cuando el día declina, la misma voz que hablaba desde los montes\ndesciende al silencio del corazón.\nLa Palabra camina, sana, consuela.\nEn los Evangelios se cumple lo que el Antiguo había anunciado,\ny el lector encuentra paz en la gracia del Hijo.\nCada tarde, la Escritura se vuelve aliento:\npan que sacia, luz que consuela.",
    "Così, l’Aurora e il Tramonto si rispondono:\nla Legge trova compimento, la Storia trova senso,\ne il lettore diventa pellegrino.\nNon si attraversa soltanto un libro,\nma l’intera trama della Redenzione:\ndal giardino perduto alla città celeste,\ndal primo respiro all’ultima promessa,\ndalla caduta dell’uomo al ritorno del Re.":
      "So Dawn and Sunset answer each other:\nthe Law is fulfilled, the Story finds meaning,\nand the reader becomes a pilgrim.\nOne does not walk through a book alone,\nbut through the whole fabric of Redemption:\nfrom the lost garden to the heavenly city,\nfrom the first breath to the last promise,\nfrom the fall of man to the return of the King.|So antworten Morgendämmerung und Sonnenuntergang einander:\ndas Gesetz wird erfüllt, die Geschichte bekommt Sinn,\nund der Leser wird zum Pilger.\nMan durchwandert nicht nur ein Buch,\nsondern den ganzen Stoff der Erlösung:\nvom verlorenen Garten bis zur himmlischen Stadt,\nvom ersten Atemzug bis zur letzten Verheißung,\nvom Fall des Menschen bis zur Rückkehr des Königs.|Así, la Aurora y el Atardecer se responden:\nla Ley se cumple, la Historia cobra sentido,\ny el lector se vuelve peregrino.\nNo se recorre solo un libro,\nsino toda la trama de la Redención:\ndel jardín perdido a la ciudad celestial,\ndel primer aliento a la última promesa,\nde la caída del hombre al retorno del Rey.",
    "Questo cammino non è una corsa,\nma un andare fedele, un passo al giorno,\ntra i libri e le stagioni della Rivelazione.":
      "This journey is not a race,\nbut a faithful walking, one step a day,\namong the books and the seasons of Revelation.|Dieser Weg ist kein Wettlauf,\nsondern ein treues Gehen, ein Schritt pro Tag,\nzwischen den Büchern und den Jahreszeiten der Offenbarung.|Este camino no es una carrera,\nsino un andar fiel, un paso al día,\nentre los libros y las estaciones de la Revelación.",
    "È una tavola imbandita due volte al giorno:\npane d’obbedienza al mattino,\npane di grazia alla sera.":
      "It is a table set twice a day:\nbread of obedience in the morning,\nbread of grace in the evening.|Es ist ein Tisch, der zweimal am Tag gedeckt ist:\nBrot des Gehorsams am Morgen,\nBrot der Gnade am Abend.|Es una mesa puesta dos veces al día:\npan de obediencia por la mañana,\npan de gracia por la tarde.",
    "E quando l’ultimo giorno sarà letto,\nquando l’ultima parola chiuderà il libro,\nil cuore comprenderà che non era solo lettura,\nma incontro.":
      "And when the last day has been read,\nwhen the last word closes the book,\nthe heart will understand that it was not only reading,\nbut an encounter.|Und wenn der letzte Tag gelesen ist,\nwenn das letzte Wort das Buch schließt,\nwird das Herz verstehen, dass es nicht nur Lesen war,\nsondern Begegnung.|Y cuando el último día sea leído,\ncuando la última palabra cierre el libro,\nel corazón comprenderá que no era solo lectura,\nsino encuentro.",
    "Perché ogni verso, ogni aurora, ogni tramonto\nnon parlavano d’altri — ma di Lui.":
      "Because every verse, every dawn, every sunset\ndid not speak of another — but of Him.|Denn jeder Vers, jede Morgendämmerung, jeder Sonnenuntergang\nsprachen nicht von einem anderen — sondern von Ihm.|Porque cada verso, cada aurora, cada atardecer\nno hablaban de otro — sino de Él.",
    "Nel silenzio di 2 Cronache 36 il giorno sembra spegnersi al termine dei 4 anni di questo piano.\nLe mura cadono, il tempio arde, la voce dei profeti tace: è il tramonto d’Israele, l’eco di un cuore che ha dimenticato il suo Dio.":
      "In the silence of 2 Chronicles 36 the day seems to die out at the end of the 4 years of this plan.\nThe walls fall, the temple burns, the voice of the prophets falls silent: it is the sunset of Israel, the echo of a heart that has forgotten its God.|In der Stille von 2. Chronik 36 scheint der Tag am Ende der 4 Jahre dieses Plans zu verlöschen.\nDie Mauern fallen, der Tempel brennt, die Stimme der Propheten verstummt: es ist der Sonnenuntergang Israels, das Echo eines Herzens, das seinen Gott vergessen hat.|En el silencio de 2 Crónicas 36 el día parece apagarse al final de los 4 años de este plan.\nCaen las murallas, arde el templo, calla la voz de los profetas: es el atardecer de Israel, el eco de un corazón que ha olvidado a su Dios.",
    "Ma mentre la Storia chiude le sue porte, la Grazia prepara la soglia di un nuovo mattino.\nNel Vangelo di Giovanni 21, l’alba torna a brillare sul mare di Tiberiade.":
      "But while the Story closes its doors, Grace prepares the threshold of a new morning.\nIn the Gospel of John 21, the dawn shines again on the sea of Tiberias.|Doch während die Geschichte ihre Türen schließt, bereitet die Gnade die Schwelle eines neuen Morgens.\nIm Evangelium nach Johannes 21 leuchtet die Morgendämmerung wieder auf dem See von Tiberias.|Pero mientras la Historia cierra sus puertas, la Gracia prepara el umbral de una nueva mañana.\nEn el Evangelio de Juan 21, el alba vuelve a brillar sobre el mar de Tiberíades.",
    "Là dove l’esilio aveva detto “fine”, il Risorto dice “seguimi”.\nCosì il cammino che inizia tra le rovine del tempio si compie tra le braci di un incontro.":
      "Where exile had said “the end”, the Risen One says “follow me”.\nSo the journey that begins among the ruins of the temple is completed among the embers of an encounter.|Dort, wo das Exil „Ende“ gesagt hatte, sagt der Auferstandene „folge mir nach“.\nSo vollendet sich der Weg, der zwischen den Trümmern des Tempels beginnt, in der Glut einer Begegnung.|Donde el exilio había dicho «fin», el Resucitado dice «sígueme».\nAsí el camino que empieza entre las ruinas del templo se cumple entre las brasas de un encuentro.",
    "Dal pianto di Gerusalemme alla luce del lago, la Rivelazione si chiude come era cominciata:\nnell’amore di un Dio che ricostruisce, redime e chiama ancora.":
      "From the weeping of Jerusalem to the light of the lake, Revelation closes as it had begun:\nin the love of a God who rebuilds, redeems and calls again.|Vom Weinen Jerusalems bis zum Licht des Sees schließt sich die Offenbarung, wie sie begonnen hatte:\nin der Liebe eines Gottes, der wieder aufbaut, erlöst und erneut ruft.|Del llanto de Jerusalén a la luz del lago, la Revelación se cierra como había comenzado:\nen el amor de un Dios que reconstruye, redime y llama de nuevo.",
    "Dall’aurora di Genesi al tramonto di Giovanni, la Parola non è mai tramontata:\nè il sole che sorge ogni volta che un cuore torna a Lui.":
      "From the dawn of Genesis to the sunset of John, the Word has never set:\nit is the sun that rises every time a heart returns to Him.|Von der Morgendämmerung der Genesis bis zum Sonnenuntergang des Johannes ist das Wort nie untergegangen:\nes ist die Sonne, die jedes Mal aufgeht, wenn ein Herz zu Ihm zurückkehrt.|De la aurora del Génesis al atardecer de Juan, la Palabra nunca se ha puesto:\nes el sol que sale cada vez que un corazón vuelve a Él."
  };

  window.AURORA_LINGUE = {
    diz: DIZ,
    mod: MOD,
    fram: FRAM,
    righe: RIGHE,
    giorni: GIORNI,
    mesi: MESI,
    momenti: MOMENTI,
    libri: LIBRI
  };
})();
