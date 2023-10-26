<template>
    <div id="container">
        <div class="ticket-container">
        <div class="ticket">
            <router-link to="/existing-tickets" class="back">&laquo; Tillbaka</router-link>
            <h1>Uppdatera ärende {{ this.id }}</h1>
            <h2>{{ this.ticket.code }} - {{ this.ticket.trainnumber }} - {{this.ticket.traindate }}</h2>
            <form id="update-ticket-form">
                <label class="input-label" for="trainnumber">Tåg nummer:</label><br>
                <input class="input" type="text" id="trainnumber" name="trainnumber" v-model="this.ticket.trainnumber"><br>
                <label class="input-label">Orsakskod</label><br>
                <select class="input" id="reason-code"></select><br><br>
                <label class="input-label" for="traindate">Datum:</label><br>
                <input class="input" type="date" id="traindate" name="traindate" v-model="this.ticket.traindate"><br>
                <input class="button loginButton" type="submit" value="Uppdatera ärende" />
            </form>
        </div>
        </div>
    </div>

</template>

<script>
/* eslint no-undef: "off" */
    import {useUserStore} from '../stores/UserStore'
     
    export default {
        name: 'UpdateTicket',
        setup() {
            const userStore = useUserStore()

            return {userStore}
        },
        data() {
            return {
                id: this.$route.params.id,
                ticket: [],
                // backend: "http://localhost:1337"
            }
        },
        props: {
            backend: String
        },
        methods: {
            updateTicket() {
                const self = this;
                let reasonCodeSelect = document.getElementById("reason-code");
                let updateTicketForm = document.getElementById("update-ticket-form");

                // RETRIEVE CODES
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

                // SUBMIT BUTTON - UPDATE TICKET
                updateTicketForm.addEventListener("submit", function(event) {
                    event.preventDefault();

                    var updateTicket = {
                        _id: self.ticket._id,
                        code: reasonCodeSelect.value,
                        trainnumber: trainnumber.value,
                        traindate: traindate.value,
                    };

                    fetch(`${self.backend}/tickets`, {
                        body: JSON.stringify(updateTicket),
                        headers: {
                        'x-access-token': useUserStore().user.token,
                        'content-type': 'application/json'
                        },
                        method: 'PUT'
                    })
                    .then((response) => {
                            if (!response.ok) {
                                throw new Error("Token is incorrect or the request failed.");
                            }
                            return response.json();
                        })
                        .then((result) => {
                            console.log(result);
                            self.$router.push(`/existing-tickets`);
                        })
                        .catch((error) => {
                            
                            alert(error.message);
                        });
                });
            },
        },
        mounted() {
            // RETRIEVE TICKETS
            const socket = io(this.backend);
                socket.on("tickets", (data) => {
                    data.forEach((datum) => {
                        if (datum.id == this.id) {
                            this.ticket = datum
                        }
                    })
                })
            this.updateTicket()
        },
    }
</script>

<style>
</style>
