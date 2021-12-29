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

var amount = 30;
var stationName = document.getElementById("station-name-input").value;
var cooldown = Date.now();

async function updateTimetable() {
    console.log("Updating timetable...");
    fetch(`/departures?station=${stationName}&amount=${amount}`, {
        method: "GET"
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        var table = document.getElementById("departures-wrapper");
        var tableBody = document.createElement("ul");

        let i = 0;
        for (let departure of data) {
            if (i > amount) {
                break;
            }
            var row = document.createElement("li");
            var time = document.createElement("div");
            time.innerHTML = formatTime(departure.when);
            var destination = document.createElement("div");
            destination.innerHTML = departure.direction;
            var platform = document.createElement("div");
            platform.innerHTML = departure.platform;
            row.appendChild(time);
            row.appendChild(destination);
            row.appendChild(platform);
            tableBody.appendChild(row);
            i++;
        }

        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        table.appendChild(tableBody);
    });
}

setInterval(async function () {
    // update the clock with the current time in the format HH:MM:SS
    var date = new Date();
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    var time = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerHTML = time;
}, 10);

document.getElementById("station-name-input").onkeyup = async function (e) {
    if (e.key == "Enter") {
        if (cooldown > Date.now()) {
            return false;
        }
        e.preventDefault();
        stationName = document.getElementById("station-name-input").value;
        await updateTimetable();
        cooldown = Date.now() + 10000;
    }
};


updateTimetable();
setInterval(updateTimetable, 60000);
