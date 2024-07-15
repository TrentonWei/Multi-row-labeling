<template>  
  <div id="mapContainer" ref="mapContainer" style="width: 100%; height: 1200px;"></div>  
</template>  
  
<script>  
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css'; // 引入Leaflet样式  
  
export default {  
  name: 'LeafletMapComponent',  
  mounted() {  
    this.initMap();  
  },  
  methods: {  
    initMap() {  
      // 创建地图实例并添加到DOM容器中  
      const map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 13); // 设置初始视图的经纬度和缩放级别  
  
      // 添加一个OpenStreetMap图层  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {  
        maxZoom: 19,  
      }).addTo(map);  
  
      // 你可以在这里添加其他图层、控件或地图交互  
    },  
  },  
  beforeUnmount() {  
    // 在组件卸载前销毁地图实例  
    if (this.map) {  
      this.map.remove();  
    }  
  },  
};  
</script>  
  
<style scoped>  
#mapContainer {  
  width: 100%;  
  height: 100%;  
}  
</style>