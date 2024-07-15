<!--Html-->
<template>
    <div ref="mapContainer" class="map-container"></div>  <!--ref表示给元素一个引用名(VUE特有)，也可以用ID-->
</template>

<!--JavaScript-->
<script>
import mapboxgl from 'mapbox-gl';  
  
  export default {  
    name: 'MapboxMap',  
    data() {  
      return {  
        map: null,  
      };  
    },  
    mounted() {  
      this.initMap();  
    },  
    methods: {  
      initMap() {  
        mapboxgl.accessToken = 'pk.eyJ1IjoidHJlbnRvbndlaSIsImEiOiJjbHVzZHJvbWMwbDYyMmlrYzh3cjNhYTBlIn0.jfCroy0RJFzfs8a4oN-GEA'; // 替换为你的访问令牌  
    
        this.map = new mapboxgl.Map({  
          container: this.$refs.mapContainer,  
          style: 'mapbox://styles/mapbox/streets-v11', // 使用Mapbox的街道样式，你也可以选择其他样式或自定义样式  
          center: [116.40, 39.90], // 设置地图的中心点经纬度  
          zoom: 13, // 设置初始缩放级别  
        });  
      },  
    },  
  };  
</script>

<!--CSS-->
<style scoped>
.map-container {  
    width: 100%;  
    height: 100%; /* 或者你想要的任何高度 */  
}  
</style>
