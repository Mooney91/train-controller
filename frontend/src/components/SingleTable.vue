<template>
    <div v-if="this.delayedData" id="delayed-trains" class="delayed-trains">
      <div v-for="item in delayedData" :key="item.OperationalTrainNumber">
        
                  {{ assignItem(item) }}
              <div>
                  <router-link class="ticket-view" :to="{ name: 'TicketView', params: { id: item.ActivityId} }">Skapa nytt ärende</router-link>
              </div>
              <div class="train-number">
              <router-link class="train-number" :to="{ name: 'SingleView', params: { id: item.OperationalTrainNumber } }">
                  {{ item.OperationalTrainNumber }}
              </router-link>
              </div>
              
              <div class="current-station">
                  <div>{{ item.LocationSignature }}</div>
                  <div>{{ item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "" }}{{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}</div>
              </div>
              <div class="delay">
                  {{ outputDelay(item) }}
              </div>
              
      </div>
    </div>
  </template>
  
  <script>
      export default {
          name: 'SingleTable',
          data() {
              return {
                delayedData:[],
                  item: []
              }
          },
          props: {
            backend: String,
              router: Object,
              id: String
          },
          methods: {
             
            async fetchData() {
                const response = await fetch(`${this.backend}/delayed`);
                const result = await response.json();
                result.data.forEach((item) => {
                    if (item.OperationalTrainNumber === this.id) {
                    this.delayedData.push(item);
                    }
                });
              },
              outputDelay(item) {
                  let advertised = new Date(item.AdvertisedTimeAtLocation);
                  let estimated = new Date(item.EstimatedTimeAtLocation);
  
                  const diff = Math.abs(estimated - advertised);
  
                  return Math.floor(diff / (1000 * 60)) + " minuter";
              },
              assignItem(item) {
                  this.item = item;
              }
  
          },
          async mounted() {
            await this.fetchData() 
          }
      }
  </script>
  
  <style>
  
  </style>