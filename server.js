const createClient = require("hafas-client");
const oebbProfile = require('hafas-client/p/oebb/index.js');
const express = require('express');
const cors = require('cors');

const app = express();

const client = createClient(oebbProfile, 'kendlbat-htlvil-timetable');

app.use(require('cookie-parser')());
app.use(cors({
    origin: /\.kendlbat\.dev/,
    optionsSuccessStatus: 200
}));

app.get(["/", "/index", "/home"], (req, res) => {
    res.redirect("/index.html");
});

async function getNDepartures(station, n, showBusses) {
    // Can only get 10 departures at a time, so we need to fetch them in batches
    let departures = [];
    for (let i = 0; i < n; i += 10) {
        try {
            var batch = await client.departures(station, { products: {bus: showBusses, tram: showBusses}, results: 10, duration: 600, when: (departures.length == 0 ? new Date() : departures[departures.length - 1].when)});
        } catch (e) {
            var batch = [{direction: "Station not found", platform: "N/A", line: {mode: "special"}, when: new Date(2069, 1, 1)}];
        }
        for (let departure of batch) {
            departures.push(departure);
        }
    }
    // Delete any duplicate departures
    const uniqueDepartures = [];
    for (let departure of departures) {
        if (!uniqueDepartures.some(d => new Date(d.when).getTime() == new Date(departure.when).getTime())) {
            uniqueDepartures.push(departure);
        }
    }
    return uniqueDepartures;
}

app.get("/departures", async function (req, res) {
    try {
        var { station, amount } = req.query;
    } catch (error) {
        res.send(error);
        return false;
    }

    try {
        var { bus } = req.query;
    } catch (error) {
        bus = false;
    }

    if (bus == 1 || bus == "1") {
        bus = true;
    } else {
        bus = false;
    }

    // check if station and amount are set
    if (!station || !amount) {
        res.status(400).send([{direction: "Please enter a station name!", id: "0", platform: "400", line: {mode: "special"}, when: new Date(2069, 1, 1)}]);
        return false;
    }

    if (station == "kendlbat--nostation") {
        res.status(400).send([{direction: "Please enter a station name!", id: "0", platform: "400", line: {mode: "special"}, when: new Date(2069, 1, 1)}]);
        return false;
    }

    // Check if a cookie with the station name already exists
    if (req.cookies && req.cookies.stationName) {
        res.status(429).send([{direction: "Too many requests!", id: "0", platform: "429", line: {mode: "special"}, when: new Date(2069, 1, 1)}]);
        return;
    } else {
        res.cookie("stationName", station, { maxAge: 1000, sameSite: true });
    }

    console.log(String("New request for: " + station).padEnd(30) + "\tBusses: " + bus);
    client.locations(station).then((data) => {
        var stationID = data[0].id;
        getNDepartures(stationID, amount, bus).then((departures) => {
            res.send(departures);
        });
    });
});

app.use(express.static("static"));

app.listen(process.env.PORT || 80, () => {
    console.log('OEBB Timetable reachable on http://localhost:' + (process.env.PORT || 80));
});
