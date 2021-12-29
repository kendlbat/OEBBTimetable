const createClient = require("hafas-client");
const oebbProfile = require('hafas-client/p/oebb/index.js');
const express = require('express');

const app = express();

const client = createClient(oebbProfile, 'kendlbat-htlvil-timetable');

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

async function getNDepartures(station, n) {
    // Can only get 10 departures at a time, so we need to fetch them in batches
    const departures = [];
    for (let i = 0; i < n; i += 10) {
        const batch = await client.departures(station, { products: {bus: false}, results: 10, duration: 120, when: (departures.length == 0 ? new Date() : departures[departures.length - 1].when)});
        for (let departure of batch) {
            departures.push(departure);
        }
    }
    return departures;
}

app.get("/departures", async function (req, res) {
    try {
        var { station, amount } = req.query;
    } catch (error) {
        res.send(error);
        return false;
    }

    // check if station and amount are set
    if (!station || !amount) {
        res.send("Please set station and amount");
        return false;
    }

    console.log(req.query);

    client.locations(station).then((data) => {
        console.log(data[0]);
        var stationID = data[0].id;
        getNDepartures(stationID, amount).then((departures) => {
            console.log(departures);
            res.send(departures);
        });
    });
});

app.use(express.static("static"));

app.listen(80, () => {
    console.log('OEBB Timetable reachable on http://localhost:80');
});
