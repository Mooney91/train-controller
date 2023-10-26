<template>
  <div v-if="this.delayedData" id="delayed-trains" class="delayed-trains">
    <div v-for="item in delayedData" :key="item.OperationalTrainNumber">
                {{ assignItem(item) }}
            <div >
                <router-link class="ticket-view" :to="{ name: 'TicketView', params: { id: item.ActivityId} }">Skapa nytt ärende</router-link>
            </div>
            <div class="train-number">
            <router-link class="train-number" :to="{ name: 'SingleView', params: { id: item.OperationalTrainNumber } }">
                {{ item.OperationalTrainNumber }}
            </router-link>
            </div>
            
            <div class="current-station">
                <div><span class="table-info">Station: </span>{{ item.LocationSignature }}</div>
                <div><span class="table-info">Från: </span>{{ item.FromLocation ? item.FromLocation[0].LocationName : "" }}</div>
                <div><span class="table-info">Till: </span>{{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}</div>
            </div>
            <div class="delay">
                {{ outputDelay(item) }}
            </div>

        
    </div>
  </div>
</template>

<script>
    import {useUserStore} from '../stores/UserStore'
    
    export default {
        name: 'DelayedTable',
        setup() { 
            const userStore = useUserStore()

            return { userStore }
        },
        data() {
            return {
                item: []
            }
        },
        props: {
            delayedData: Object,
            router: Object
        },
        methods: {
            async renderDelayedTable() {

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
        watch: {
            delayedData: {
                immediate: true,
                handler(newData) {
                    if (newData) {
                        this.renderDelayedTable();

                    }
                }
            },
        },
        async mounted() {
            if (this.delayedData) {
                await this.renderDelayedTable();
            }
        }
    }
</script>

<style>

</style>