// This file is not Node.js compatible.

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.');
}

function formatTime(date) {
    var d = new Date(date),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes();

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return [hours, minutes].join(':');
}

var anchor = decode(window.location.hash.slice(1));

// Replace %xx with character
function decode(str) {
    return decodeURIComponent(String(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decode(results[1].replace(/\+/g, ' '));
}

var amount = 30;
var stationName = (anchor != false) ? anchor : String(document.getElementById("station-name-input").value) || "kendlbat--nostation";
var cooldown = Date.now();
var departures = [];
var currentStation = String(stationName);
var timeLastFetched = Date.now();
var showBusses = false;
var prev_showBusses = showBusses;

if (anchor) {
    document.getElementById("station-name-input").value = anchor;
    stationName = anchor;
}

window.addEventListener("hashchange", (e) => {
    if (window.location.hash == undefined) return;
    if (window.location.hash === stationName) return;
    if (window.location.hash.trim() === "") return;

    anchor = decode(window.location.hash.slice(1));
    document.getElementById("station-name-input").value = anchor;
    stationName = anchor;
    updateTimetable(true);
});

if (localStorage.getItem("showBusses") == "true") {
    showBusses = true;
    document.getElementById("show-busses").innerHTML = "Hide busses";
} else {
    // try to get busses from url
    var urlBusses = getUrlParameter("bus");
    if (urlBusses == "1" || urlBusses == "true") {
        showBusses = true;
        document.getElementById("show-busses").innerHTML = "Hide busses";
    }
    document.getElementById("show-busses").innerHTML = "Show busses";
}

async function updateTimetable(force) {
    console.log("Updating timetable...");
    // Remove all past departures
    document.getElementById("station-name-input").disabled = true;
    document.getElementById("station-name-input").blur();
    document.body.style.cursor = 'progress';

    for (let departure of departures) {
        if (departure.when < Date.now()) {
            departures = departures.filter(d => d.id != departure.id);
        }
    }

    if (force) {
        await getTimetableFromServer();
    }

    if (document.cookie.includes("stationName")) {
        console.log("Stopped updating because of throttle!");
        currentStation = "kendlbat--throttlestation";
        await updateHTMLTimetable(departures);
    } else if (new Date(timeLastFetched).getDay() != new Date(Date.now()).getDay()) {
        await getTimetableFromServer();
    } else if (prev_showBusses != showBusses) {
        prev_showBusses = showBusses;
        await getTimetableFromServer();
    } else if (departures.length == 0) {
        await getTimetableFromServer();
        if (departures.length = 0) {
            departures = [
                {
                    id: 0,
                    direction: "No departures found",
                    platform: "N/A",
                    when: new Date(2069, 1, 1)
                }
            ];
        }
    }

    document.body.style.cursor = "";
    document.getElementById("station-name-input").disabled = false;
    document.getElementById("station-name-input").focus();
}

async function getTimetableFromServer() {
    console.log("Making timetable request to server...");
    timeLastFetched = Date.now();
    await fetch(`/departures?station=${stationName}&amount=${amount}` + String(showBusses ? "&bus=1" : ""), {
        method: "GET"
    }).then(function (response) {
        console.log(response);
        return response.json();
    }).then(function (data) {
        console.log(data);
        departures = data;
        updateHTMLTimetable(departures);
    });
}

async function updateHTMLTimetable(data) {
    var table = document.getElementById("departures-wrapper");
    var tableBody = document.createElement("ul");

    let i = 0;

    if (data.length == 0) {
        data.push({
            id: 0,
            direction: "No departures found",
            platform: "-",
            when: new Date(2069, 1, 1),
            line: {
                productName: "-",
                mode: "special"
            }
        });
    }

    for (let departure of data) {
        if (i > amount) {
            break;
        }
        var row = document.createElement("li");
        var time = document.createElement("div");
        time.innerHTML = formatTime(departure.when);

        var name = document.createElement("div");
        name.style.fontFamily = "\"Roboto Mono\", monospace";
        let nameString = departure.line.productName || (departure.line.product == "subway" ? "U" : "-");
        name.innerHTML += nameString;
        
        // For every character below length 3, insert <span class="hidden-dot">.</span>
        for (let i = nameString.length; i < 4; i++) {
            name.innerHTML += "<span class=\"hidden-dot\">.</span>";
        }
        name.classList.add("product-name");

        var destination = document.createElement("div");
        destination.innerHTML = departure.line.mode == "bus" ? "<span class=\"bus\">" + String(departure.direction || "N/A") + "</span>" : (departure.line.productName == "Tram" ? "<span class=\"tram\">" + String(departure.direction || "N/A") + "</span>" : String(departure.direction || "N/A"));
        var platform = document.createElement("div");
        platform.innerHTML = departure.platform || "-";
        row.appendChild(time);
        row.appendChild(name);
        row.appendChild(destination);
        row.appendChild(platform);
        tableBody.appendChild(row);
        i++;
    }

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    table.appendChild(tableBody);
}

setInterval(async function () {
    // update the clock with the current time in the format HH:MM:SS
    var date = new Date();
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    var time = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerHTML = time;
}, 30);

document.getElementById("station-name-input").onkeyup = async function (e) {
    if (e.key == "Enter") {
        e.preventDefault();
        stationName = document.getElementById("station-name-input").value;
        window.location.hash = "#" + stationName;
        window.dispatchEvent(new HashChangeEvent(stationName));
        anchor = stationName;
    }
};

document.getElementById("show-busses").onclick = async function () {
    showBusses = !showBusses;
    if (showBusses) {
        document.getElementById("show-busses").innerHTML = "Hide busses";
    } else {
        document.getElementById("show-busses").innerHTML = "Show busses";
    }
    localStorage.setItem("showBusses", showBusses);
    await updateTimetable(true);
};


updateTimetable(true);
setInterval(async function () {
    updateTimetable(true);
}, 60000);

if (showBusses) {
    document.getElementById("footer").innerHTML = "Made with &#10084;&#65039; by <a href=\"https://github.com/kendlbat\">Tobias Kendlbacher</a> <span class=\"bus\">(*Busses shown in orange)</span>";
} else {
    document.getElementById("footer").innerHTML = "Made with &#10084;&#65039; by <a href=\"https://github.com/kendlbat\">Tobias Kendlbacher</a>";
}
