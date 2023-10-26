<template>
    <div class="container" id="container">
      <div class="delayed">
        <h1 id="logo">Försenade tåg</h1> 
        <DelayedTable v-if="delayedData" :delayedData="delayedData" :router="$router"></DelayedTable>
      </div>
       <MapComponent v-if="delayedData" id="map" class="map" :backend="backend"></MapComponent>
     
      
    </div>
</template>
  
<script>
  import DelayedTable from '../components/DelayedTable.vue';
  import MapComponent from '../components/MapComponent.vue';

  export default {
    name: 'TrafficController',
    data() {
      return {
        delayedData: [],
      };
    },
    props: {
      msg: String,
      backend: String
    },
    components: {
      DelayedTable,
      MapComponent
    },

    async created() {
      await fetch(`${this.backend}/delayed`)
        .then((response) => response.json())
        .then((result) => {
          this.delayedData = result.data;
          
        });
    }
  }

</script>

<style scoped>
</style>
