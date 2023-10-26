<template>
    <router-link to="/" class="back">&laquo; Tillbaka</router-link>
    <div id="container"></div>
</template>

<script>
/* eslint no-undef: "off" */
    import {useUserStore} from '../stores/UserStore'

    export default {
        name: 'TicketView',
        data()  {
            return {
                id: null,
                item: null,
                tickets: null,
            }
        },
        props: {
           backend: String
        },
        methods: { 
            async fetchTrains() {
                this.item = await fetch(`${this.backend}/delayed/single?train=${this.id}`)
                        .then((response) => response.json())
                        .then(function(result) {
                            return result.data
                        })
            },
            async createNewTicket(newTicket) {
                console.log(newTicket)
                await fetch(`${this.backend}/tickets`, {
                        body: JSON.stringify(newTicket),
                        headers: {
                        'x-access-token': useUserStore().user.token,
                        'content-type': 'application/json'
                        },
                        method: 'POST'
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            return result.data
                        });
            },
            async fetchTickets() {
                this.tickets = await fetch(`${this.backend}/tickets`, {
                    headers: {
                    'x-access-token': useUserStore().user.token,
                    'content-type': 'application/json'
                    }
                })
                        .then((response) => response.json())
                        .then((result) => {
                            return result.data
                        });
        
            },    
            async renderTicketView() {
                const socket = io(this.backend);
                const self = this;
                socket.on("tickets", (data) => {
                    let container = document.getElementById("container");
                    let newTicketId = 0;
                  
                    var locationString = "";
                    if (this.item[0].FromLocation) {
                        locationString = `<h3>Tåg från <span class="info-bold">${this.item[0].FromLocation[0].LocationName}</span> till <span class="info-bold">${this.item[0].ToLocation[0].LocationName}</span>.</h3>
                         <h3>Just nu i <span class="info-bold">${this.item[0].LocationSignature}</span>.</h3>`;
                    }

                    container.innerHTML = `<div class="ticket-container">
                            <div class="ticket">
                                <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
                                <div class="train-info">
                                    ${locationString}
                                    <p><span class="info-bold">Försenad:</span> <span class="red">${this.outputDelay(this.item[0])}</span></p>
                                </div>
                                <form id="new-ticket-form">
                                    <label class="input-label">Orsakskod</label><br>
                                    <select id="reason-code" class="input"></select><br><br>
                                    <input class="button loginButton" type="submit" value="Skapa nytt ärende" />
                                </form>
                            </div>
                            <br>
                            <div class="old-tickets" id="old-tickets">
                                <h2>Befintliga ärenden</h2>
                            </div>
                        </div>`;

                    let reasonCodeSelect = document.getElementById("reason-code");
                    let newTicketForm = document.getElementById("new-ticket-form");
                    let oldTickets = document.getElementById("old-tickets");

                    let trainnumber = this.item[0].OperationalTrainNumber
                    let traindate = this.item[0].EstimatedTimeAtLocation.substring(0, 10)

                    // ADD NEW TICKET TO DATABASE
                    newTicketForm.addEventListener("submit", function(event) {
                        event.preventDefault();

                        var newTicket = {
                            code: reasonCodeSelect.value,
                            trainnumber: trainnumber,
                            traindate: traindate,
                        };

                        console.log(reasonCodeSelect.value)
                        console.log(trainnumber)
                        console.log(traindate)

                        self.createNewTicket(newTicket);

                        self.$router.push(`/existing-tickets`);
                    });
                    
                    // ADD CURRENT TICKETS VIEW
                    var lastId = data.length;

                    newTicketId = lastId + 1;

                    let newTicketIdSpan = document.getElementById("new-ticket-id");

                    newTicketIdSpan.textContent = newTicketId;

                    data.forEach((ticket) => {
                        let element = document.createElement("div");
                        element.classList.add("single-ticket-view")
                        element.innerHTML = `<p><span class="ticket-number">${ticket.id}</span></p>
                                             <p><span class="ticket-field">Orsakskod:</span> ${ticket.code}</p>
                                             <p><span class="ticket-field">Tågnummer:</span>  ${ticket.trainnumber}</p>
                                             <p><span class="ticket-field">Skapad:</span>  ${ticket.traindate}</p>`;

                        oldTickets.appendChild(element);
                    })

                    fetch(`${this.backend}/codes`)
                        .then((response) => response.json())
                        .then((result) => {
                            result.data.forEach((code) => {
                                let element = document.createElement("option");

                                element.textContent = `${code.Code} - ${code.Level3Description}`;
                                element.value = code.Code;

                                reasonCodeSelect.appendChild(element);
                            });
                        });

                })
            },
            outputDelay(item) {
                let advertised = new Date(item.AdvertisedTimeAtLocation);
                let estimated = new Date(item.EstimatedTimeAtLocation);

                const diff = Math.abs(estimated - advertised);

                return Math.floor(diff / (1000 * 60)) + " minuter";
            }
        },
        async mounted() {
            this.id = this.$route.params.id
            if (useUserStore().user === null) {
                let container = document.getElementById("container");
                container.innerHTML = `<div class="warning-box">
                                      <p>Du har inte behörighet att visa den här sidan. Vänligen logga in för att fortsätta.</p>
                                      </div>`
            } else {
                    this.fetchTrains() 
                        .then(() => {   
                            this.renderTicketView();
                        })
                        .catch(error => {
                            console.error('There is an error with fetchData:', error);
                        });
            }
        }
    }

</script>

<style>
</style>
