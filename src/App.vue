<!--主页面(根元素)——组件组合的输出-->
<!--Html-->
<template>
  <!--<img src="./assets/logo.png" alt="示例图片">-->
  <!--<LeafletMapBoxComponent />-->
  <!--<LeafletMapComponent />-->
  <!--<LeafletGaodeMapComponent />-->
  <!--<LeafletCustomedGaodeMapComponent />-->
  <!--<MainGaodeMapComponent />-->
  <userStudyGaodeMapComponent />-->
  <!--<MapboxMap />-->
  <!--<HelloWporld msg="Welcome to Your Vue.js App"/>-->
</template>

<!--JavaScript-->
<script>
// import HelloWorld from './components/exampleComponents/HelloWorld.vue'
// import MapboxMap from './components/exampleComponents/MapBoxLabel.vue'
// import LeafletMapComponent from './components/exampleComponents/LeafLetLabel.vue'
// import LeafletMapBoxComponent from './components/exampleComponents/LeafLetMapbox.vue'
// import LeafletGaodeMapComponent from './components/exampleComponents/LeafLetGaode.vue'
//import LeafletCustomedGaodeMapComponent from './components/LeafletCustomedGaode.vue'
//import MainGaodeMapComponent from './components/MainGaode.vue'
import userStudyGaodeMapComponent from './components/CustomedGaode_User.vue'


export default {
  name: 'App',
  components: {
    //HelloWorld
    //MapboxMap
    //LeafletMapComponent
    //LeafletMapBoxComponent
    //LeafletGaodeMapComponent
    //LeafletCustomedGaodeMapComponent
    //MainGaodeMapComponent
    userStudyGaodeMapComponent
  }
}
</script>

<!--CSS-->
<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
