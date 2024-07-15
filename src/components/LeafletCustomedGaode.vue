<template>
<div id="container">

</div>
</template>

<script>

//import {
    //carData
//} from "../assets/data/car.js";
//import axios from "axios";
import AMapLoader from "@amap/amap-jsapi-loader";
//import AMap from "AMap";
import { Label } from "@/utils/LabelProcess.js";
import { markSymbol } from "@/utils/LabelProcess.js";
//import { Conflict } from "@/utils/LabelProcess.js";
//import { Cost } from "@/utils/LabelProcess.js";
import { getElementRect } from "@/utils/LabelProcess.js";
import { boolInView } from "@/utils/LabelProcess.js";
import { boolInView_2 } from "@/utils/LabelProcess.js";
import { getTextImportance } from "@/utils/LabelProcess.js";
import { lifeData } from "@/assets/data/life.js";
//import { QHData } from "@/assets/data/QHData.js";
//import { getSymbolRect } from "@/utils/LabelProcess.js";
import { getPointSymbolRect } from "@/utils/LabelProcess.js";
import { labelIntersect } from "@/utils/LabelProcess.js";
import { markerSymbolIntersect } from "@/utils/LabelProcess.js";

export default {
    name: "LeafletCustomedGaodeMapComponent",
    //格式問題(VUE)
    //#region 代碼塊等問題
    mounted() { //组件的生命周期 mounted表示插入div
        this.initAMap();
    },
    unmounted() { //组件的生命周期 unmounted表示从Dom树中移除div
        this.map?.destroy();
    },
    methods: {
        initAMap() {
            //The key Code should be included, unless it can't display costumed map
            window._AMapSecurityConfig = {
                securityJsCode: 'ade93aad1b5eb60b557718b10086c079'
            }
            //
            AMapLoader.load({
                    key: "90491b176164b78fdcf474669e9dace0", // 申请好的Web端开发者Key，首次调用 load 时必填
                    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
                })
                .then((AMap) => { //AMap是函数AMapLoader的输出值，作为新函数的入参         
                    this.map = new AMap.Map("container", {
                        mapStyle: "amap://styles/9a5db21aebe86ba51a953f0f42b9d77b", //设置地图的显示样式
                        //mapStyle: "amap://styles/whitesmoke",
                        // 设置地图容器id
                        // 单一种类要素显示
                        viewMode: "3D", // 是否为3D地图模式
                        zoom: 16, // 初始化地图级别
                        center: [116.32158522262032,40.00036860056113], // 初始化地图中心点位置
                        draggable: true
                    });
                    //this.map.setFeatures(["road","building","bg"]);
                    //this.map.setMapStyle('amap://styles/9a5db21aebe86ba51a953f0f42b9d77b');
                    //普通的GeoJson
                    //console.log("carData====", carData);
                    
                    //#region 数据读取并计算重要性
                    //获取数据并实现初始标注//axios异步的从服务其中读取数据处理axios为异步操作，不阻塞后续代码执行
                    
                    //axios.get('/mygeodata/Life.geojson').then(res => {                   
                        //console.log(res.data, 'res');   
                    const itemImportanceMap=new Map();//存储每一个item的importance  //objects对象的键只能是字符串或symbols，ES6新特性map的键可以是任意值
                    //console.log(lifeData);
                    let GeoJSONData = lifeData;   
                    console.log(GeoJSONData);                   
                    GeoJSONData.features.forEach((item) => {
                        //console.log(item);
                        //console.log(item);
                        itemImportanceMap.set(item,getTextImportance(item.properties.pre_name,item.geometry.coordinates[0], item.geometry.coordinates[1],this.map.getCenter().lng,this.map.getCenter().lat));
                    });
                     
                    //});
                    //#endregion
                         
                    //console.log("Here");
                    //console.log(itemImportanceMap);

                    //#region 依据各要素的重要性依次添加Label       
                    let labelList=[];//标注的文本对象  
                    let symbolList=[];//标注的符号对象          
                    const sortedEntries = Array.from(itemImportanceMap.entries()).sort((a, b) => a[1] - b[1]);  // 将Map转换为数组，并根据值进行排序
                    const sortedItemImportanceMap = new Map(sortedEntries);  // 根据排序后的数组创建一个新的有序Map  
                    //console.log(sortedItemImportanceMap);
                    sortedItemImportanceMap.forEach((value, key) => {
                        let item=key;
                        let symbolAcc=true;//true表示点符号可添加，false表示不可添加
                        let labelAcc=true;//true表示label可添加，false表示不可添加
                        //console.log(item);console.log(value);

                        //#region 判断可添加的点要素
                        // 创建一个新的Size对象，定义标记的大小  
                        //const size = new AMap.Size(20, 20); // width和height是您想要的宽度和高度值，单位是像素  
                        const marker = new AMap.Marker({
                            position: new AMap.LngLat(item.geometry.coordinates[0], item.geometry.coordinates[1]), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                            // size: size, // 设置标记的大小
                        });
                        //将创建的点标记添加到已有的地图实例：
                        this.map.add(marker);

                        //每次添加前，需要判断这个符号1. 是否在视图内；2. 是否与已有的注记和符号冲突 ——————否则要从当前视图移除
                        let markerSymbol=new markSymbol(marker.getPosition().lat,marker.getPosition().lng);
                        if(boolInView_2(marker,this.map)){                        
                            //console.log("bound=========",getPointSymbolRect(marker,this.map,4,4));
                            markerSymbol.bound=getPointSymbolRect(marker,this.map,100,20); //这里需要根据设置的点符号大小调整——可能还得自适应屏幕分辨率
                            //console.log(JSON.stringify(markerSymbol));
                           
                            //判断是否与已有符号冲突
                            if(!(symbolList.length==0||!markerSymbolIntersect(markerSymbol,labelList,symbolList))){
                                symbolAcc=false;
                                //marker.setMap(null); //移除对象
                            }
                        }

                        else{
                            symbolAcc=false;
                            //marker.setMap(null); //移除对象
                        }
                        
                        
                        //console.log("Here");
                        //console.log(marker.getPosition());
                        //var latlng = marker.getPosition();  
                        // 将地理坐标转换为屏幕坐标  
                        //var pixel = this.map.lngLatToContainer(latlng); //获得符号的中心
                        //console.log(this.map.lngLatToContainer(marker.getBounds().southWest));//获得符号的绑定矩形
                        //console.log(this.map.lngLatToContainer(marker.getBounds().northEast));
                        //console.log(getSymbolRect(marker,this.map));
                        //#endregion                        

                        //#region 判断可添加得注记要素
                        //每次添加前，需要判断这个符号是否1.在视图内；2.是否与已有的注记和符号冲突
                        let pLabel=new Label(item.properties.pre_name,item.properties.Text_1,item.properties.Text_2,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记
                        let textList=[];
                        //console.log(pLabel);

                        //依次判断多有的location和break
                        for(let locationValue=0;locationValue<=2;locationValue++){
                            for(let breakValue=0;breakValue<pLabel.textCandidate.length;breakValue++){  
                                //console.log("pLabel========",pLabel,pLabel.textCandidate.length);                       
                                pLabel.location=locationValue;
                                pLabel.textCut=breakValue;
                                pLabel.bound=[];//Label占据的范围需要清空
                                textList=[];//每次都需要清空
                                console.log("pLabel========",pLabel,pLabel.textCandidate.length,pLabel.location); 
                                textList=this.getText(pLabel,AMap);//生成对应的注记
                                
                                let labelInview=true;
                                for(let i=0;i<textList.length;i++){
                                    if(textList[i]!=null){
                                        textList[i].setMap(this.map); //将文本标记设置到地图上
                                        //console.log(textList[i]);
                                        if(textList[i]!==""){
                                            if(boolInView(textList[i].getOptions().content)){
                                                pLabel.bound.push(getElementRect(textList[i].getOptions().content));
                                            } 
                                            else{
                                                labelAcc=false;//表示不可添加
                                                labelInview=false;//表示不在视图内
                                                //textList[i].setMap(null);//文本从视图中删除 
                                            }
                                        }
                                    }
                                }
                                //对视图内的Label判断是否可放置
                                if(labelInview){
                                //判断重叠
                                    if(!(labelList.length==0 || !labelIntersect(pLabel,labelList,symbolList))){                                          
                                        labelAcc=false;
                                    }
                                    else{
                                        labelAcc=true;
                                    }
                                } 
                                
                                
                                if(!labelAcc){ //不能放置的要删除
                                    for(let i=0;i<textList.length;i++){
                                        textList[i].setMap(null);
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                            if(labelAcc){
                                break;
                            }
                        }              
                        //#endregion

                        //#region 添加可放置的符号和注记列表
                        if(symbolAcc && labelAcc){
                            //console.log("markerSymbol=======",markerSymbol);
                            //console.log("pLabel=======",pLabel);
                            symbolList.push(markerSymbol);
                            labelList.push(pLabel);
                        }
                        //#endregion

                        //#region 删除不能放置的符号
                        if(!labelAcc||!symbolAcc){
                            for(let i=0;i<textList.length;i++){
                                textList[i].setMap(null);
                            }
                            marker.setMap(null);
                        }
                        //#endregion
                    });
                    //#endregion  
                    
                  
                    
                    //console.log(labelList);
                    //console.log(symbolList);
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        ///mygeodata/Car.geojson 正確的路徑

        //GetText 按照注记Label的属性生成对应的Text
        getText(cacheLabel,AMap){
            let textList=[];
            //添加Text
            for(let i=0;i<cacheLabel.Count;i++){
                let anchor;
                let offset;
                //右侧
                if(cacheLabel.location==0){
                    anchor = 'middle-left';
                    offset = new AMap.Pixel(10, -20); // 向右偏移10px,向上偏移20px
                }

                //下侧中心
                if(cacheLabel.location==1){
                    anchor = 'center'; //设置文本标记锚点位置
                    offset = new AMap.Pixel(0, 8); // 向下偏移8px 
                }

                //左侧
                if(cacheLabel.location==2){
                    anchor = 'middle-right';
                    offset = new AMap.Pixel(-10, -20); // 向左偏移10px,向上偏移20px
                }

                //#region 添加點要素註記
                let text = new AMap.Text({
                    text: cacheLabel.finalText[i], //标记显示的文本内容
                    // anchor value 'top-left'|'top-center'|'top-right'|'middle-left'|'center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right'
                    //Center
                    //anchor: "center", //设置文本标记锚点位置
                    //offset: new AMap.Pixel(0, 8), // 向下偏移8px 
                    //left
                    //anchor:'middle-right',
                    //offset: new AMap.Pixel(-10, -20), // 向左偏移10px,向上偏移20px
                    //Right
                    anchor: anchor,
                    offset: offset, // 向右偏移10px,向上偏移20px
                    
                    draggable: false, //是否可拖拽
                    cursor: "pointer", //指定鼠标悬停时的鼠标样式。
                    angle: 0, //点标记的旋转角度
                    style: {
                        //设置文本样式，Object 同 css 样式表
                        "padding": "0rem 0rem",
                        "margin-bottom": "0rem",
                        "border-radius": ".0rem",
                        "background-color": "rgba(255, 255, 255, 0)",
                        "width": "auto",
                        "border-width": 0,
                        "box-shadow": "0 1px 0px 0 rgba(114, 124, 245, .5)",
                        "text-align": "center",
                        "font-size": "12px",
                        "color": "blue",
                    },
                    position: [cacheLabel.x,cacheLabel.y], //点标记在地图上显示的位置
                });

                textList.push(text)
            }

            //依据数量调整textList中Text的位置
            if(textList.length==2){ //数量为2时Text的调整
                if(textList[0].location!=1){
                    let curOffset_1=textList[0].getOffset();
                    let curOffset_2=textList[1].getOffset();

                    // 修改垂直偏移量，向上、下偏移6.5px  
                    curOffset_1.y -= 6.5;  
                    curOffset_2.y += 6.5;  
                    
                    // 更新注记的偏移量  
                    textList[0].setOffset(curOffset_1);
                    textList[1].setOffset(curOffset_2);
                }
                else{
                    let curOffset_1=textList[1].getOffset();

                    // 修改垂直偏移量，向下偏移13px  
                    curOffset_1.y += 13;  

                    // 更新注记的偏移量  
                    textList[1].setOffset(curOffset_1);
                }
            }

            if(textList.length==3){ //数量为3时Text的调整
                if(textList[0].location!=1){
                    let curOffset_1=textList[0].getOffset();
                    let curOffset_2=textList[2].getOffset();

                    // 修改垂直偏移量，向上、下偏移5px  
                    curOffset_1.y -= 13;  
                    curOffset_2.y += 13;  
                    
                    // 更新注记的偏移量  
                    textList[0].setOffset(curOffset_1);
                    textList[2].setOffset(curOffset_2);
                }
                else{
                    let curOffset_1=textList[1].getOffset();
                    let curOffset_2=textList[2].getOffset();

                    // 修改垂直偏移量，向上、下偏移5px  
                    curOffset_1.y += 13;  
                    curOffset_2.y += 26;  
                    
                    // 更新注记的偏移量  
                    textList[1].setOffset(curOffset_1);
                    textList[2].setOffset(curOffset_2);
                }
            }

            return textList;
        },
    },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 1200px;
}
</style>
