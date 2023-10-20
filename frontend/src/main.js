import './assets/main.css'

import { createApp, onRenderTracked, render } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// const backend = "https://jsramverk-train-zamo22.azurewebsites.net"
const backend = "http://localhost:1337"

// let isExistingTicketsView = true; // Add this flag to track the view

function renderMainView() {
    let container = document.getElementById("container");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    container.innerHTML = `<div class="delayed">
                <button id="tickets-button">Hantera befintliga ärenden</button>
                <h1 id="logo">Försenade tåg</h1> 
                <div id="delayed-trains" class="delayed-trains"></div>
            </div>
            <div id="map" class="map"></div>`;

    // FOR TICKETS
    let existingTickets = document.getElementById("tickets-button")
    existingTickets.addEventListener("click", function(e) { 
        return renderExistingTickets()
    })

    // FOR MAP
    fetch(`${backend}/delayed`)
        .then((response) => response.json())
        .then(function(result) {
            return renderMap(result.data);
        });
    
    // FOR TABLE
    let delayed = document.getElementById("delayed-trains");

    fetch(`${backend}/delayed`)
        .then((response) => response.json())
        .then(function(result) {
            return renderDelayedTable(result.data, delayed);
        });
}

function renderMap(delayedData) {
    const socket = io(backend);
    let delayedTrains = []
    delayedData.forEach((item) => {
        delayedTrains.push(item.OperationalTrainNumber);
    })

    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let markers = {};

    socket.on("message", (data) => {
        if (delayedTrains.includes(data.trainnumber)) {
            if (markers.hasOwnProperty(data.trainnumber)) {
                let marker = markers[data.trainnumber]

                marker.setLatLng(data.position);
            } else {
                var roundRedMarker = L.divIcon({
                    className: "custom-icon",
                    iconSize: [20, 20],
                    // html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"></div>',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                    <circle cx="20" cy="20" r="14" fill="#FF0000" stroke="#742227" stroke-width="2" />
                    <circle cx="20" cy="20" r="4" fill="#742227" />
                  </svg>`,
                  });
                let marker = L.marker(data.position, { icon: roundRedMarker }).addTo(map);
                marker.bindPopup(data.trainnumber);
                markers[data.trainnumber] = marker
                marker.on('click', function (e) {
                    // EVENT LISTENER TO SHOW A SPECIFIC TRAIN
                    renderSingleView(undefined, data);
                });
                map.addLayer(marker);
            }
        }
    });     
}

function renderDelayedTable(data, table) {
    data.forEach((item) => {
        let element = document.createElement("div");

        element.innerHTML = `
            <div class="train-number">
                ${item.OperationalTrainNumber}
            </div>
            <div class="current-station">
                <div>${item.LocationSignature}</div>
                <div>${item.FromLocation ? item.FromLocation[0].LocationName + " -> " : ""} ${item.ToLocation ? item.ToLocation[0].LocationName : ""}</div>
            </div>
            <div class="delay">
                ${outputDelay(item)}
            </div>
            `;

        element.addEventListener("click", function() {
            renderSingleView(item.OperationalTrainNumber, undefined)
        });

        let createTicket = document.createElement("div");
        createTicket.innerHTML = `<div>
        <button class="ticket-view">Skapa nytt ärende</button>
        </div>`;

        let ticketView = createTicket.getElementsByClassName("ticket-view")[0];
        ticketView.addEventListener("click", function() {
            renderTicketView(item);
        });

        table.appendChild(element);
        table.appendChild(createTicket);
    });
}

function outputDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
}

function renderTicketView(item) {
    let container = document.getElementById("container");
    let newTicketId = 0;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    var locationString = "";
    if (item.FromLocation) {
         locationString = `<h3>Tåg från ${item.FromLocation[0].LocationName} till ${item.ToLocation[0].LocationName}. Just nu i ${item.LocationSignature}.</h3>`;
    }

    container.innerHTML = `<div class="ticket-container">
            <div class="ticket">
                <a href="" id="back"><- Tillbaka</a>
                <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
                ${locationString}
                <p><strong>Försenad:</strong> ${outputDelay(item)}</p>
                <form id="new-ticket-form">
                    <label>Orsakskod</label><br>
                    <select id="reason-code"></select><br><br>
                    <input type="submit" value="Skapa nytt ärende" />
                </form>
            </div>
            <br>
            <div class="old-tickets" id="old-tickets">
                <h2>Befintliga ärenden</h2>
            </div>
        </div>`;

    let backButton = document.getElementById("back");
    let reasonCodeSelect = document.getElementById("reason-code");
    let newTicketForm = document.getElementById("new-ticket-form");
    let oldTickets = document.getElementById("old-tickets");

    backButton.addEventListener("click", function(event) {
        event.preventDefault();

        renderMainView();
    });

    newTicketForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var newTicket = {
            code: reasonCodeSelect.value,
            trainnumber: item.OperationalTrainNumber,
            traindate: item.EstimatedTimeAtLocation.substring(0, 10),
        };

        fetch(`${backend}/tickets`, {
            body: JSON.stringify(newTicket),
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST'
        })
            .then((response) => response.json())
            .then((result) => {
                renderTicketView(item);
            });
    });

    fetch(`${backend}/tickets`)
        .then((response) => response.json())
        .then((result) => {
            // var lastId = result.data[1] ? result.data[1].id : 0;
            // ID OF NEW "ERRAND" IS THE NUMBER OF TICKETS
            var lastId = result.data.length;

            newTicketId = lastId + 1;

            let newTicketIdSpan = document.getElementById("new-ticket-id");

            newTicketIdSpan.textContent = newTicketId;

            result.data.forEach((ticket) => {
                let element = document.createElement("div");

                element.innerHTML = `${ticket.id} - ${ticket.code} - ${ticket.trainnumber} - ${ticket.traindate}`;

                oldTickets.appendChild(element);
            });
        });

    fetch(`${backend}/codes`)
        .then((response) => response.json())
        .then((result) => {
            result.data.forEach((code) => {
                let element = document.createElement("option");

                element.textContent = `${code.Code} - ${code.Level3Description}`;
                element.value = code.Code;

                reasonCodeSelect.appendChild(element);
            });
        });
}

function renderSingleView(delayedTrainNumber = "", data = {}) {
    const socket = io(backend);
    let container = document.getElementById("container");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    container.innerHTML = `<div class="delayed">
                <h1>Försenade tåg</h1>
                <button id="main-view">Alla tåg</button>
                <div id="delayed-trains" class="delayed-trains"></div>
            </div>
            <div id="map" class="map"></div>`;

    // BUTTON TO RETURN USER TO THE MAINVIEW
    let mainView = document.getElementById("main-view");
    mainView.addEventListener("click", function(e) {
        renderMainView()
    })

    // FIND DATA
    if (!data || Object.keys(data).length === 0) {
        // USER HAS CLICKED ON A DELAYED TRAIN FROM THE LIST - DATA UNKNOWN
        fetch(`${backend}/position?train=${delayedTrainNumber}`)
            .then((response) => response.json())
            .then(function(result) {
                data = result;
                renderSingleTable(data.data);
                if   (data.data && data.data.position) {
                    renderSingleMap(data.data);
                } else {
                    alert("There is no position listed for this train.")
                }
            });
    } else {
        // USER HAS CLICKED ON A MARKER - DATA IS KNOWN
        renderSingleTable(data);
        renderSingleMap(data);
    }
}

function renderSingleMap(data) {
    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker(data.position).bindPopup(data.trainnumber).addTo(map);
}

function renderSingleTable(data) {
    let delayed = document.getElementById("delayed-trains");

    fetch(`${backend}/delayed`)
        .then((response) => response.json())
        .then(function(result) {
            const items = result.data.filter((item) => item.OperationalTrainNumber === data.trainnumber);
            return renderDelayedTable(items, delayed);
        });
}

function renderExistingTickets() {
    // SOCKET CREATED
    const socket = io(backend);
    socket.on("tickets", (data) => {
 
        let container = document.getElementById("container");

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        container.innerHTML = `<div class="ticket-container">
            <div class="ticket">
                <a href="" id="back"><- Tillbaka</a>
                <h1>Hantera befintliga ärenden</h1>
                <div id="existing-tickets"></div>

            </div>`;

        let backButton = document.getElementById("back");
        let existingTickets = document.getElementById("existing-tickets");

        backButton.addEventListener("click", function(event) {
            event.preventDefault();

            renderMainView();
        });
        
        data.forEach((ticket) => {
            let element = document.createElement("div");
            element.classList.add("single-ticket")

            element.innerHTML = `${ticket.id} - ${ticket.code} - ${ticket.trainnumber} - ${ticket.traindate}`;

            // IF THE TICKET IS LOCKED, ADD ÄNDRA STATUS BUTTON WHICH CHANGES LOCKED TO FALSE
            if (ticket.locked) {
                element.classList.add("locked")
                let buttonElement = document.createElement("button");
                buttonElement.classList.add("changeStatusButton");
                buttonElement.textContent = "Ändra status";
                buttonElement.addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    // CHANGE LOCKED TO FALSE
                    socket.emit("changeStatus", ticket._id);
                })
                element.appendChild(buttonElement);
            } 

            // IF THE TICKET IS CLICKED AND ALERT WILL APPEAR IF LOCKED, OTHERWISE ALLOW TICKET UPDATE
            element.addEventListener("click", function(e) {
                if (ticket.locked) {
                    alert("Det här ärendet är för närvarande låst av en annan användare.")
                } else {
                    // CHANGE LOCKED TO TRUE AND ENSURE THAT SOCKET IS COMPLETE BEFORE RENDERING PAGE
                    socket.emit("changeStatus", ticket._id, function(response) {
                        // CHECK IF THE SOCKET.ON IS DONE ON THE BACKEND
                        if (response.success) {
                            renderUpdateTicket(ticket);
                        } else {
                            alert("Ett fel uppstod under uttagets drift.");
                        };
                    });
                };
            })

            existingTickets.appendChild(element);
        })
    });
}

function renderUpdateTicket(ticket) {
    // isExistingTicketsView = false;
    let container = document.getElementById("container");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    container.innerHTML = `<div class="ticket-container">
        <div class="ticket">
            <a href="" id="back"><- Tillbaka</a>
            <h1>Uppdatera ärende ${ticket.id}</h1>
            <form id="update-ticket-form">
                <label for="trainnumber">Tåg nummer:</label><br>
                <input type="text" id="trainnumber" name="trainnumber" value="${ticket.trainnumber}"><br>
                <label>Orsakskod</label><br>
                <select id="reason-code"></select><br><br>
                <label for="traindate">Datum:</label><br>
                <input type="date" id="traindate" name="traindate" value="${ticket.traindate}"><br>
                <input type="submit" value="Uppdaterat ärende" />
            </form>
        </div>`;

    let backButton = document.getElementById("back");
    let reasonCodeSelect = document.getElementById("reason-code");
    // let trainnumberInput = document.getElementById("trainnumber");
    // let traindateInput = document.getElementById("traindate");
    let updateTicketForm = document.getElementById("update-ticket-form");

    backButton.addEventListener("click", function(event) {
        event.preventDefault();

        renderMainView();
    });

    fetch(`${backend}/codes`)
    .then((response) => response.json())
    .then((result) => {
        result.data.forEach((code) => {
            let element = document.createElement("option");

            element.textContent = `${code.Code} - ${code.Level3Description}`;
            element.value = code.Code;

            reasonCodeSelect.appendChild(element);
        });
    });

    updateTicketForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var updateTicket = {
            _id: ticket._id,
            code: reasonCodeSelect.value,
            trainnumber: trainnumber.value,
            traindate: traindate.value,
        };

        fetch(`${backend}/tickets`, {
            body: JSON.stringify(updateTicket),
            headers: {
              'content-type': 'application/json'
            },
            method: 'PUT'
        })
            .then((response) => response.json())
            .then((result) => {
                renderMainView();
            });
    });
};

renderMainView();
