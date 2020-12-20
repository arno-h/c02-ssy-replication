Replikation von Daten
=====================

Verzeichnisse & Dateien
-----------------------

* bin/www ... Starten des Webservers, Error-Handling
* routes/ ... Hier stehen die einzelnen Controller
    * index.js ... Erzeugt eine einfache Start-Seite
    * store.js ... Einfache Key-Value-Datenbank, welche repliziert wird
* src/ ... Datenmodell und Geschäftslogik
    * database.js ... Datenbank und Fixtures mit Beispiel-Daten
* app.js ... Definition & Setup der Express-Applikation
* package.json ... Welche Bibliotheken sonst eingebunden werden sollen

Übersicht
---------

Das Beispiel stellt ein repliziertes Storage-Service dar: man kann über einen
Key `/store/<key>` ein beliebiges Objekt (JSON) speichern und wieder abrufen.
Alle drei Replicas sind gleichberechtigt, der Schreibrequest kann also an
jede Instanz gesendet werden und wird dann zu den anderen Instanzen
weitergeleitet/repliziert.

Aufgabe
-------

1) Machen Sie sich mit dem Code vertraut. Sehen Sie sich die Routen an
   (`GET/PUT/DELETE`) und wie diese umgesetzt werden. Starten Sie die
   drei Server und führen Sie mit einem REST-Client einige Lese- & Schreibzugriffe
   durch. Vergewissern Sie sich, dass Sie verstehen, wie die Replikation
   implementiert ist.
  
2) Implementieren Sie einen ersten Client (`client/same-replica.js`), der
   ein Objekt unter einem (frei gewählten) Key auf einer der drei Replicas
   abspeichert und von der selben Replica wieder ausliest.
   
3) Implementieren Sie einen Client (`client/different-replica.js`), der
   ein Objekt unter einem (frei gewählten) Key auf einer der drei Replicas
   speichert und *sofort danach* versucht, von einer *anderen* Replica diesen
   Key zu lesen.

   Welches Verhalten können Sie beobachten?

   Tipp: stellen Sie sicher, bei Axios die Option `validateStatus: null` zu
   setzen (siehe `store.js` für genaue Syntax), da ansonsten ein 4xx-Status
   eine Exception beim Client auslöst.
   
4) Implementieren Sie einen Client (`client/concurrent-put.js`), welcher
   auf *demselben* Key je Instanz einen unterschiedlichen Wert schreibt
   (also drei Schreibrequest). Lesen Sie nach einer Wartezeit den Wert
   des Keys von allen drei Instanzen aus. 
   
   Haben alle drei Instanzen denselben Wert gespeichert?
   Warum nicht? (--> Server-Logs ansehen)

   Tipp: senden Sie die Requests rasch hintereinander ab, also ohne
   auf die Antwort mit `await` zu warten. Verwenden Sie stattdessen
   Callback-Funktionen (`.then()`) oder `await Promise.all([...])`
   (siehe Kurzreferenz).
   
   Um abzuwarten, bevor Sie die Werte auslesen, verwenden Sie die
   Funktion `setTimeout(funktion, time_in_ms)`.
   
5) Ändern Sie die Replikation in `store.js` so, dass auf das
   Ergebnis des Axios-Calls mit `await` gewartet wird. Sehen Sie bei
   einem oder beiden der Clients aus Schritt 4 bzw. Schritt 5 nun
   einen Unterschied?
