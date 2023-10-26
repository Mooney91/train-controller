<template>
  <div class="container" id="container">
    <div class="delayed">
      <h1 id="logo">Försenade tåg</h1> 
      <SingleTable  :id="id" :backend="backend"></SingleTable>
    </div>
     <SingleMap  :delayedData="delayedData" :id="id" id="map" class="map" :backend="backend"></SingleMap>
  </div>
</template>

<script>
/* eslint vue/no-duplicate-attributes: "off" */
import SingleTable from '../components/SingleTable.vue';
import SingleMap from '../components/SingleMap.vue';

export default {
  name: 'SingleView',
  data() {
    return {
      id: this.$route.params.id
    };
  },
  props: {
    msg: String,
    data: Object,
    delayedTrainNumber: String,
    backend: String
  },
  components: {
    SingleTable,
    SingleMap
  },
}

</script>

<style scoped>
</style>
