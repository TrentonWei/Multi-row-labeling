<template>  
  <div id="mapContainer" ref="mapContainer" style="width: 100%; height: 800px;"></div>  
</template>  
  
<script>  
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css'; // 引入Leaflet样式  
  
export default {  
  name: 'LeafletMapBoxComponent',  
  mounted() {  
    this.initMap();  
  },  
  methods: {  
    initMap() {  
      // 创建地图实例并添加到DOM容器中  
      var map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 13); // 设置初始视图的经纬度和缩放级别  
 
      L.tileLayer('https://api.mapbox.com/styles/v1/{your-mapbox-style-id}/tiles/{z}/{x}/{y}?access_token={pk.eyJ1IjoidHJlbnRvbndlaSIsImEiOiJjbHVzZnNqdGowa214MmpuMGVhZWRnZzdyIn0.yFLlXWjdfYFK1IQyVgZvBw}', {  
        maxZoom: 18, // 可选：设置最大缩放级别  
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +  
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // 可选：添加地图数据来源说明  
        id: 'mapbox/streets-v11', // 可选：设置默认的Mapbox样式ID（如果你不想使用自定义样式ID）  
        accessToken: '{pk.eyJ1IjoidHJlbnRvbndlaSIsImEiOiJjbHVzZnNqdGowa214MmpuMGVhZWRnZzdyIn0.yFLlXWjdfYFK1IQyVgZvBw}' // 替换为你的Mapbox访问令牌  
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