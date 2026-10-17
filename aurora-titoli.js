/* ============================================================================
   AURORA TITOLI — i titoli delle letture del piano originale
   ============================================================================
   Il piano scritto da Marco Giraldi ha un titolo per ogni lettura: 2920 in
   tutto (1460 per la corsia Aurora, 1460 per il Tramonto), di cui 2663
   distinti. Qui ci sono le traduzioni, a blocchi: questo file cresce, e i
   titoli che non ci sono ancora restano in italiano — l'app non si rompe, si
   vede solo che quel titolo non è ancora tradotto.

   La chiave è il titolo italiano ESATTO, come sta nel piano compilato (con
   l'apostrofo tipografico: «L’uomo e la donna»). Il motore (aurora-lingua.js)
   le unisce al dizionario all'avvio. Formato, come tutto il resto:
   "italiano": "english|deutsch|español".

   Questi sono i titoli del piano, non dati dell'utente: nessuna scrittura,
   nessun effetto sul piano salvato, sul backup o sulla sincronizzazione.
   ========================================================================== */

(function () {
  'use strict';

  var TITOLI = {

    /* ---- corsia Aurora — giorni 1-30 (30 titoli) ---- */
    "La creazione": "The creation|Die Schöpfung|La creación",
    "Genealogia e nascita di Gesù": "Genealogy and birth of Jesus|Stammbaum und Geburt Jesu|Genealogía y nacimiento de Jesús",
    "Il Vangelo potenza di Dio": "The Gospel, power of God|Das Evangelium, Kraft Gottes|El Evangelio, poder de Dios",
    "L’uomo e la donna": "The man and the woman|Der Mann und die Frau|El hombre y la mujer",
    "La fuga in Egitto": "The flight into Egypt|Die Flucht nach Ägypten|La huida a Egipto",
    "Il peccato dell’uomo": "The sin of man|Die Sünde des Menschen|El pecado del hombre",
    "Il peccato e la caduta": "Sin and the fall|Sünde und Fall|El pecado y la caída",
    "Il battesimo di Gesù": "The baptism of Jesus|Die Taufe Jesu|El bautismo de Jesús",
    "Il giusto giudizio": "The righteous judgment|Das gerechte Gericht|El justo juicio",
    "Caino e Abele": "Cain and Abel|Kain und Abel|Caín y Abel",
    "Le tentazioni nel deserto": "The temptations in the desert|Die Versuchungen in der Wüste|Las tentaciones en el desierto",
    "I veri circoncisi": "The truly circumcised|Die wahre Beschneidung|Los verdaderos circuncisos",
    "Discendenze di Adamo": "The descendants of Adam|Die Nachkommen Adams|Los descendientes de Adán",
    "Le beatitudini e la legge": "The Beatitudes and the Law|Die Seligpreisungen und das Gesetz|Las bienaventuranzas y la Ley",
    "Tutti sotto peccato": "All under sin|Alle unter der Sünde|Todos bajo el pecado",
    "Corruzione e diluvio": "Corruption and the flood|Verderben und Sintflut|Corrupción y diluvio",
    "Il compimento della Legge": "The fulfilment of the Law|Die Erfüllung des Gesetzes|El cumplimiento de la Ley",
    "Giustificazione per fede": "Justification by faith|Rechtfertigung aus dem Glauben|Justificación por la fe",
    "Il diluvio": "The flood|Die Sintflut|El diluvio",
    "Elemosina, preghiera e digiuno": "Almsgiving, prayer and fasting|Almosen, Gebet und Fasten|Limosna, oración y ayuno",
    "Abramo giustificato per fede": "Abraham justified by faith|Abraham, aus dem Glauben gerechtfertigt|Abraham justificado por la fe",
    "Fine del diluvio": "The end of the flood|Das Ende der Sintflut|El fin del diluvio",
    "Tesori e ansie": "Treasures and worries|Schätze und Sorgen|Tesoros y afanes",
    "Promessa e fede": "Promise and faith|Verheißung und Glaube|Promesa y fe",
    "Alleanza con Noè": "The covenant with Noah|Der Bund mit Noah|El pacto con Noé",
    "Giudicare e chiedere": "Judging and asking|Richten und bitten|Juzgar y pedir",
    "Giustificati in Cristo": "Justified in Christ|Gerechtfertigt in Christus|Justificados en Cristo",
    "I discendenti di Noè": "The descendants of Noah|Die Nachkommen Noahs|Los descendientes de Noé",
    "Alberi e fondamento": "Trees and foundation|Bäume und Fundament|Árboles y fundamento",
    "Adamo e Cristo": "Adam and Christ|Adam und Christus|Adán y Cristo",

    /* ---- corsia Tramonto — giorni 1-30 (30 titoli) ---- */
    "Il giusto e l’empio": "The righteous and the wicked|Der Gerechte und der Gottlose|El justo y el impío",
    "Il dialogo tra Dio e Satana": "The dialogue between God and Satan|Der Dialog zwischen Gott und Satan|El diálogo entre Dios y Satanás",
    "Le prove di Giobbe": "The trials of Job|Die Prüfungen Hiobs|Las pruebas de Job",
    "Fedeltà di Giobbe": "The faithfulness of Job|Hiobs Treue|La fidelidad de Job",
    "Lamento di Giobbe": "The lament of Job|Hiobs Klage|El lamento de Job",
    "Desiderio di morire": "The wish to die|Der Wunsch zu sterben|El deseo de morir",
    "Discorso di Elifaz": "The speech of Eliphaz|Die Rede des Elifas|El discurso de Elifaz",
    "Rivelazione notturna": "A revelation in the night|Eine nächtliche Offenbarung|Revelación nocturna",
    "Esortazione di Elifaz": "The exhortation of Eliphaz|Die Ermahnung des Elifas|La exhortación de Elifaz",
    "Lamento e dolore": "Lament and sorrow|Klage und Schmerz|Lamento y dolor",
    "Rimprovero agli amici": "The reproach to his friends|Der Vorwurf an die Freunde|El reproche a los amigos",
    "Giobbe parla a Dio": "Job speaks to God|Hiob spricht zu Gott|Job habla con Dios",
    "Perché mi osservi, Signore?": "Why do you watch me, Lord?|Warum beobachtest du mich, Herr?|¿Por qué me observas, Señor?",
    "Risposta di Bildad": "The answer of Bildad|Die Antwort Bildads|La respuesta de Bildad",
    "La grandezza di Dio": "The greatness of God|Die Größe Gottes|La grandeza de Dios",
    "Nessuno è giusto davanti a Lui": "No one is righteous before him|Niemand ist gerecht vor ihm|Nadie es justo delante de él",
    "Perché soffro, Signore?": "Why do I suffer, Lord?|Warum leide ich, Herr?|¿Por qué sufro, Señor?",
    "Dal grembo alla tomba": "From the womb to the grave|Vom Mutterleib bis zum Grab|Del vientre a la tumba",
    "Risposta di Zofar": "The answer of Zophar|Die Antwort Zofars|La respuesta de Sofar",
    "La sapienza degli anziani": "The wisdom of the elders|Die Weisheit der Alten|La sabiduría de los ancianos",
    "La potenza di Dio": "The power of God|Die Macht Gottes|El poder de Dios",
    "Fiducia di Giobbe": "The trust of Job|Hiobs Vertrauen|La confianza de Job",
    "Silenzio, e lasciami parlare": "Be silent, and let me speak|Schweigt, und lasst mich reden|Callad y dejadme hablar",
    "Speranza nella risurrezione": "Hope in the resurrection|Hoffnung auf die Auferstehung|Esperanza en la resurrección",
    "La fragilità dell’uomo": "The frailty of man|Die Gebrechlichkeit des Menschen|La fragilidad del hombre",
    "Secondo discorso di Elifaz": "The second speech of Eliphaz|Die zweite Rede des Elifas|El segundo discurso de Elifaz",
    "Destino degli empi": "The fate of the wicked|Das Schicksal der Gottlosen|El destino de los impíos",
    "Giobbe si lamenta": "Job complains|Hiob klagt|Job se lamenta",
    "Testimone nei cieli": "A witness in the heavens|Ein Zeuge im Himmel|Un testigo en los cielos",
    "Speranza del giusto": "The hope of the righteous|Die Hoffnung des Gerechten|La esperanza del justo",

    /* ---- corsia Aurora — giorni 31-60 (30 titoli) ---- */
    "La torre di Babele": "The tower of Babel|Der Turmbau zu Babel|La torre de Babel",
    "Guarigioni e autorità": "Healings and authority|Heilungen und Vollmacht|Curaciones y autoridad",
    "Morti al peccato": "Dead to sin|Der Sünde gestorben|Muertos al pecado",
    "Discendenza di Sem fino ad Abramo": "Shem’s line down to Abraham|Der Stammbaum Sems bis Abraham|La descendencia de Sem hasta Abraham",
    "Tempesta sedata e demoni": "The storm calmed and the demons|Der Sturm gestillt und die Dämonen|La tempestad calmada y los demonios",
    "Schiavi della giustizia": "Slaves of righteousness|Sklaven der Gerechtigkeit|Esclavos de la justicia",
    "Chiamata di Abramo": "The call of Abram|Die Berufung Abrahams|El llamado de Abraham",
    "Perdono e chiamata di Matteo": "Forgiveness and the call of Matthew|Vergebung und die Berufung des Matthäus|El perdón y la llamada de Mateo",
    "La Legge rivela il peccato": "The Law reveals sin|Das Gesetz deckt die Sünde auf|La Ley revela el pecado",
    "Abramo e Lot si separano": "Abram and Lot part ways|Abraham und Lot trennen sich|Abraham y Lot se separan",
    "Fede e compassione": "Faith and compassion|Glaube und Erbarmen|Fe y compasión",
    "Lotta interiore": "The inner struggle|Der innere Kampf|La lucha interior",
    "Abramo libera Lot": "Abram rescues Lot|Abraham befreit Lot|Abraham libera a Lot",
    "I dodici inviati": "The twelve sent out|Die zwölf Gesandten|Los doce enviados",
    "Nessuna condanna": "No condemnation|Keine Verurteilung|Ninguna condenación",
    "Alleanza e promessa": "Covenant and promise|Bund und Verheißung|Pacto y promesa",
    "Discepolo e croce": "The disciple and the cross|Jünger und Kreuz|El discípulo y la cruz",
    "Speranza nella gloria": "Hope in glory|Hoffnung auf die Herrlichkeit|Esperanza en la gloria",
    "Agar e Ismaele": "Hagar and Ishmael|Hagar und Ismael|Agar e Ismael",
    "Il giogo leggero": "The easy yoke|Das leichte Joch|El yugo ligero",
    "Più che vincitori": "More than conquerors|Mehr als Überwinder|Más que vencedores",
    "Alleanza della circoncisione": "The covenant of circumcision|Der Bund der Beschneidung|El pacto de la circuncisión",
    "Il Signore del sabato": "The Lord of the Sabbath|Der Herr des Sabbats|El Señor del sábado",
    "La sovranità di Dio": "The sovereignty of God|Die Souveränität Gottes|La soberanía de Dios",
    "Promessa del figlio": "The promise of the son|Die Verheißung des Sohnes|La promesa del hijo",
    "Le parole e il cuore": "Words and the heart|Worte und Herz|Las palabras y el corazón",
    "Il vasaio e l’argilla": "The potter and the clay|Der Töpfer und der Ton|El alfarero y el barro",
    "Abramo intercede per Sodoma": "Abram intercedes for Sodom|Abraham tritt für Sodom ein|Abraham intercede por Sodoma",
    "La parabola del seminatore": "The parable of the sower|Das Gleichnis vom Sämann|La parábola del sembrador",
    "La Parola è vicina a te": "The word is near you|Das Wort ist dir nahe|La palabra está cerca de ti",
    /* ---- corsia Tramonto — giorni 31-60 (29 titoli) ---- */
    "Fine delle illusioni": "The end of illusions|Das Ende der Illusionen|El fin de las ilusiones",
    "Parole di Bildad": "The words of Bildad|Die Worte Bildads|Las palabras de Bildad",
    "Perché mi perseguitate?": "Why do you persecute me?|Warum verfolgt ihr mich?|¿Por qué me perseguís?",
    "«Io so che il mio Redentore vive»": "I know that my Redeemer lives|Ich weiß, dass mein Erlöser lebt|Yo sé que mi Redentor vive",
    "Destino del malvagio": "The fate of the wicked|Das Schicksal des Gottlosen|El destino del malvado",
    "Prosperità degli empi": "The prosperity of the wicked|Der Wohlstand der Gottlosen|La prosperidad de los impíos",
    "Fine degli empi": "The end of the wicked|Das Ende der Gottlosen|El fin de los impíos",
    "Accusa di Elifaz": "The accusation of Eliphaz|Die Anklage des Elifas|La acusación de Elifaz",
    "Ritorna al Signore": "Return to the Lord|Kehre zum Herrn zurück|Vuelve al Señor",
    "Giobbe cerca Dio": "Job seeks God|Hiob sucht Gott|Job busca a Dios",
    "Ingiustizie del mondo": "The injustices of the world|Das Unrecht der Welt|Las injusticias del mundo",
    "Dio vede tutto": "God sees everything|Gott sieht alles|Dios lo ve todo",
    "Breve risposta di Bildad": "Bildad’s brief answer|Bildads kurze Antwort|La breve respuesta de Bildad",
    "Integrità di Giobbe": "The integrity of Job|Hiobs Rechtschaffenheit|La integridad de Job",
    "Fine degli ipocriti": "The end of the hypocrites|Das Ende der Heuchler|El fin de los hipócritas",
    "La vera sapienza": "True wisdom|Die wahre Weisheit|La verdadera sabiduría",
    "Ricordi del passato": "Memories of the past|Erinnerungen an die Vergangenheit|Recuerdos del pasado",
    "L’onore perduto": "Honour lost|Verlorene Ehre|El honor perdido",
    "Derisione e dolore": "Mockery and pain|Spott und Schmerz|Burla y dolor",
    "Lamento profondo": "A deep lament|Eine tiefe Klage|Un lamento profundo",
    "Integrità personale": "Personal integrity|Persönliche Rechtschaffenheit|Integridad personal",
    "Giustizia davanti a Dio": "Justice before God|Gerechtigkeit vor Gott|Justicia delante de Dios",
    "Eliu comincia a parlare": "Elihu begins to speak|Elihu beginnt zu reden|Eliú empieza a hablar",
    "Lo zelo di Eliu": "The zeal of Elihu|Der Eifer Elihus|El celo de Eliú",
    "Dio parla all’uomo": "God speaks to man|Gott spricht zum Menschen|Dios habla al hombre",
    "Redenzione e grazia": "Redemption and grace|Erlösung und Gnade|Redención y gracia",
    "La giustizia di Dio": "The justice of God|Die Gerechtigkeit Gottes|La justicia de Dios",
    "Dio non fa favoritismi": "God shows no partiality|Gott bevorzugt niemanden|Dios no hace acepción de personas",
    /* ---- qui i blocchi successivi, in ordine ---- */
  };

  window.AURORA_TITOLI = TITOLI;
})();
