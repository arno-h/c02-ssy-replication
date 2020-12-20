const util = require('util');
const cluster = require('cluster');
const express = require('express');
const database = require('../src/database');
const Axios = require('axios');
const axios = Axios.create({validateStatus: null});
const router = express.Router();

// Drei Routen für typische CRUD-Operationen
router.get('/:id', getItem);
router.put('/:id', putItem);
router.delete('/:id', delItem);

const collection = database.getCollection('store');

function getItem(req, res) {
    // wir liefern immer von der lokalen DB aus
    let item = collection.findOne({key: req.params.id});
    if (item === null) {
        res.status(404).end();
    } else {
        res.json(item.value);
    }
}

function putItem(req, res) {
    let item = collection.findOne({key: req.params.id});
    if (item === null) {
        item = collection.insert({key: req.params.id, value: req.body});
    } else {
        item.value = req.body;
        collection.update(item);
    }
    // wir antworten schon, *bevor* wir Antwort von den Replikas haben.
    // Implikation?
    res.json(item.value);
    replicate(req);
}

function delItem(req, res) {
    let item = collection.findOne({key: req.params.id});
    if (item === null) {
        res.status(404).end();
    } else {
        collection.remove(item);
        res.json(item.value);
    }
    replicate(req)
}


function replicate(req) {
    // falls die URL schon ?source angegeben hat, ist diese Instanz *Ziel* einer Replikation
    // --> nicht nochmal weiter replizieren
    if ('source' in req.query) {
        return;
    }

    // sonst alle Server durchgehen
    for (let i = 1; i <= global.server_count; i++) {
        if (i == cluster.worker.id) {
            // mit Ausnahme des eigenen
            continue;
        }

        // und selben Request dorthin senden
        let port = 3000 + i;
        let url = util.format('http://127.0.0.1:%d/store/%s?source=%d', port, req.params.id, cluster.worker.id);
        // asynchron: wir warten Antwort *nicht* mit await ab.
        // Stattdessen werden Callback-Funktionen logResponse und errResponse angegeben.
        axios({
            method: req.method,
            url: url,
            data: req.body,
            timeout: 500
        })
        .then(logResponse)
        .catch(errResponse);

        function logResponse(response) {
            console.log(util.format('server %d => %d: %s /store/%s STATUS: %d',
                cluster.worker.id, i, req.method, req.params.id, response.status));
        }

        function errResponse(error) {
            // wir werten nichts aus, sondern in einem Fehlerfall geben wir nur eine Log-Meldung aus.
            // was bedeutet das für die Datensicherheit im Cluster?
            console.log(util.format('server %d => %d: %s /store/%s ERROR: %s',
                cluster.worker.id, i, req.method, req.params.id, error.message));
        }
    }
}


module.exports = router;
