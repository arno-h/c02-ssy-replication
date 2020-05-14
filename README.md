Replikation von Daten
========================

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
