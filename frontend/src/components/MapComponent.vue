<template>
    <div>
    <div v-if="delayedData" id="map" class="map"></div>
</div>
</template>

<script>
/* eslint no-undef: "off", no-prototype-builtins: "off", no-unused-vars: "off" */
   import io from "socket.io-client";

   export default {
       name: 'MapComponent',
       data() {
            return {
                delayedData: [],
                socket: null
            }
       },
       props: {
           backend: String
       },
       methods: {
            async fetchData() {
                await fetch(`${this.backend}/delayed`)
                .then((response) => response.json())
                .then((result) => {
                    this.delayedData = result.data;
                });
            },
            async renderMap() {

                this.socket.on('connect', () => {
                    console.log('Connected to socket server');
                });

                // CREATE AN AREA OF NUMBERS
                let delayedTrains = []
                this.delayedData.forEach((item) => {
                    delayedTrains.push(item.OperationalTrainNumber);
                })

                const map = L.map('map').setView([62.173276, 14.942265], 5);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);

                let markers = {};
                const self = this;
                this.socket.on("message", (data) => {
                    console.log("Connected to message")
                    if (delayedTrains.includes(data.trainnumber)) {
                        if (markers.hasOwnProperty(data.trainnumber)) {
                            let marker = markers[data.trainnumber]

                            marker.setLatLng(data.position);
                        } else {
                            var roundRedMarker = L.divIcon({
                                className: "custom-icon",
                                iconSize: [20, 20],
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
                                self.$router.push(`/train/${data.trainnumber}`);;
                            });
                            map.addLayer(marker);
                        }
                    }
               });     
           }
       },
        async mounted() {
            this.fetchData() 
            .then(() => {
                this.socket = io(this.backend);
                this.renderMap();
            })
            .catch(error => {
                console.error('There is an error with fetchData:', error);
            });
       },
       beforeUnmount() {
            if (this.socket) {
            this.socket.disconnect();
            }
        },
   }

</script>

<style>

</style>