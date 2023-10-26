<template>
    <div v-if="userStore.user !== null" class="ticket-container">
        <div class="ticket">
            <router-link to="/" class="back">&laquo; Tillbaka</router-link>
            <h1>Hantera befintliga ärenden</h1>
            <div id="existing-tickets"></div>
        </div>
    </div>
    <div v-else>
      <div class="warning-box">
        <p>Du har inte behörighet att visa den här sidan. Vänligen logga in för att fortsätta.</p>
      </div>
    </div>
</template>

<script>
/* eslint no-undef: "off", no-unused-vars: "off" */
    import {useUserStore} from '../stores/UserStore'

    export default {
        name: 'ExistingTickets',
        setup() {
            const userStore = useUserStore()

            return {userStore}
        },
        data() {
            return {
                // backend: "http://localhost:1337"
            };
        },
        props: {
            backend: String
        },
        methods: {
            renderExistingTickets() {
                // SOCKET CREATED
                const self = this;
                const socket = io(this.backend);
                socket.on("tickets", (data) => {
        
                    let existingTickets = document.getElementById("existing-tickets");
                    existingTickets.innerHTML = '';
                    
                    data.forEach((ticket) => {
                        let element = document.createElement("div");
                        element.classList.add("single-ticket")

                        element.innerHTML = `<p><span class="ticket-number">${ticket.id}</span></p>
                                             <p><span class="ticket-field">Orsakskod:</span> ${ticket.code}</p>
                                             <p><span class="ticket-field">Tågnummer:</span>  ${ticket.trainnumber}</p>
                                             <p><span class="ticket-field">Skapad:</span>  ${ticket.traindate}</p>`;

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
                                        self.$router.push(`/update/${ticket.id}`);
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
        },
        mounted() {
            this.renderExistingTickets();
        }
    }
</script>

<style>

</style>