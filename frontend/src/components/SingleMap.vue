<template>
    <div>
    <div v-if="delayedData" id="map" class="map"></div>
</div>
</template>

<script>
/* eslint no-undef: "off" */
   export default {
       name: 'SingleMap',
       data() {
            return {
                delayedData: [],
            }
       },
       props: {
            id: String,
            backend: String
       },
       methods: {
            async fetchData() {
                const response = await fetch(`${this.backend}/position?train=${this.id}`);
                const result = await response.json();
                this.delayedData = result.data;
            },
            async renderMap() {
                const map = L.map('map').setView([62.173276, 14.942265], 5);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                            var roundRedMarker = L.divIcon({
                                className: "custom-icon",
                                iconSize: [20, 20],
                                html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                                <circle cx="20" cy="20" r="14" fill="#FF0000" stroke="#742227" stroke-width="2" />
                                <circle cx="20" cy="20" r="4" fill="#742227" />
                            </svg>`,
                            });

                L.marker(this.delayedData.position, { icon: roundRedMarker }).bindPopup(this.delayedData.trainnumber).addTo(map);
           },
       },
        async mounted() {

            this.fetchData() 
            .then(() => {
                console.log(this.delayedData)
                if (this.delayedData.position !== null) {
                    this.renderMap();
                } else {
                    alert("Observera att inga positionsdata finns tillgängliga för det här tåget.")
                }
                
            })
            .catch(error => {
                console.error('There is an error with fetchData:', error);
            });
       },
   }

</script>

<style>

</style>