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
    //import { boolInView_2 } from "@/utils/LabelProcess.js";
    import { getTextImportance } from "@/utils/LabelProcess.js";
    //import { lifeData } from "@/assets/data/life.js";
    //import { testData } from "@/assets/data/QHData";
    //import { testData20 } from "@/assets/data/QHData";
    import { userStudy_1 } from "@/assets/data/QHData";
    //import { userStudy_2 } from "@/assets/data/QHData";
    //import { getSymbolRect } from "@/utils/LabelProcess.js";
    import { getPointSymbolRect } from "@/utils/LabelProcess.js";
    import { labelIntersect } from "@/utils/LabelProcess.js";
    //import { markerSymbolIntersect } from "@/utils/LabelProcess.js";
    

    // 40个views示例
    //zoom: 16, center: [116.326759, 40.003304]
    //zoom: 16, center: [116.326759, 40.003304]
    //zoom: 16, center: [116.326759, 40.003304]
    //zoom: 16, center: [116.326759, 40.003304]
    //zoom: 16, center: [116.326759, 40.003304]


    export default {
        //地图中的数据
        data(){
            return{
                map:null, //地图实例
                markers:[], //存储Marker的数组
                texts:[],  //存储Text的数组
            }
        },

        name: "userStudyGaodeMapComponent",
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
                };
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
                            center: [116.3256436876086,40.001845137724534], // 初始化地图中心点位置1
                            //center: [116.3195388666221,39.99943636137005], // 初始化地图中心点位置2
                            draggable: true
                        });


                        //console.log(testData);
                        const itemImportanceMap=this.getLabelImportant(userStudy_1,this.map);//计算每一个Label的重要性
                        this.interactiveLabeling(itemImportanceMap,this.map,AMap); //动态更新注记 

                        //#region 监听地图缩放和平移事件  动态更新地图
                        this.map.on("zoomend",()=>{
                            console.log("==========zoomed");
                            this.interactiveLabeling(itemImportanceMap,this.map,AMap);
                        });
                        this.map.on("moveend",()=>{
                            console.log("==========moveend");
                            this.interactiveLabeling(itemImportanceMap,this.map,AMap);
                        });
                        this.map.on("click",()=>{
                            console.log("==========click");
                            this.interactiveLabeling(itemImportanceMap,this.map,AMap);
                        });
                        //#endregion                 
                    })
                    .catch((e) => {
                        console.log(e);
                    });   
            },
    
            //GetText 按照注记Label的属性生成对应的Text
            getText(cacheLabel,AMap){
                let textList=[];
                //console.log(cacheLabel);
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
                        offset = new AMap.Pixel(0, 13); // 向下偏移8px 
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
                            "box-shadow": "0 0px 0px 0 rgba(114, 124, 245, .5)",
                            "text-align": "center",
                            "font-size": "12px",
                            "color": "blue",
                            "text-decoration": "none", 
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

            //读取数据并计算Label的重要性 DataName 数据集的名字 map当前地图 字段名称：默认读取的是item.properties.pre_name AMap 高德地图对象
            //key是要素-item(包括要素的各类特征)，Value是重要性
            getLabelImportant(DataName,map){
                const itemImportanceMap=new Map();//存储每一个item的importance  //objects对象的键只能是字符串或symbols，ES6新特性map的键可以是任意值
                console.log(DataName);
                let GeoJSONData = DataName;   
                //console.log(GeoJSONData);                   
                GeoJSONData.features.forEach((item) => {
                    //console.log(item);
                    //console.log(item);
                    itemImportanceMap.set(item,getTextImportance(item.properties.pre_name,item.geometry.coordinates[0], item.geometry.coordinates[1],map.getCenter().lng,map.getCenter().lat));
                });
                return itemImportanceMap;
            },

            //依据视图自动更新Labeling itemImportanceMap 要素 map 当前地图  AMap 高德地图对象 （Multi-row labeling）
            interactiveLabeling(itemImportanceMap,map,AMap){  
                let viewInLabels=0;//视图内需检测的Labels
                let displayedLabels=0;//视图内可放置的Labels
                let preferredLoction=0;//视图内放置在最佳位置的Labels
                let charCounts=0;//视图内方式的Char数量
                let consumedTime=0;//算法耗时
                let startTime = performance.now();  
                
                //#region 每次处理前需要清楚当前地图中的所有Markers和Texts
                 for(var mi=0;mi<this.markers.length;mi++){
                    this.markers[mi].setMap(null);
                 } 
                 for(var ti=0;ti<this.texts.length;ti++){
                    this.texts[ti].setMap(null);
                 }
                 //#endregion

                //#region 依据各要素的重要性依次添加Label       
                let labelList=[];//标注的文本对象  
                let symbolList=[];//标注的符号对象          
                const sortedEntries = Array.from(itemImportanceMap.entries()).sort((a, b) => a[1] - b[1]);  // 将Map转换为数组，并根据值进行排序
                const sortedItemImportanceMap = new Map(sortedEntries);  // 根据排序后的数组创建一个新的有序Map  
                //console.log(sortedItemImportanceMap);
                sortedItemImportanceMap.forEach((value, key) => {
                    let item=key;
                    //let symbolAcc=true;//true表示点符号可添加，false表示不可添加
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
                    map.add(marker);

                    //每次添加前，需要判断这个符号1. 是否在视图内；2. 是否与已有的注记和符号冲突 ——————否则要从当前视图移除
                    let markerSymbol=new markSymbol(marker.getPosition().lat,marker.getPosition().lng);
                    //if(boolInView_2(marker,map)){                        
                        markerSymbol.bound=getPointSymbolRect(marker,map,100,20); //这里需要根据设置的点符号大小调整——可能还得自适应屏幕分辨率
                        //console.log(JSON.stringify(markerSymbol));
                    
                        /* 不判断是否在视图内
                        //判断是否与已有符号冲突
                        if(!(symbolList.length==0||!markerSymbolIntersect(markerSymbol,labelList,symbolList))){
                            symbolAcc=false;
                        }*/
                    //}

                    /* 不判断是否在视图内
                    else{
                        symbolAcc=false;
                        //viewInLabels=viewInLabels+1;//视图内Label+1
                    } */
                    //#endregion                 

                    //#region 判断可添加的注记要素
                    //每次添加前，需要判断这个符号是否1.在视图内；2.是否与已有的注记和符号冲突
                    //存在预处理
                    //let pLabel=new Label(item.properties.pre_name,item.properties.Par_name1,item.properties.Par_name2,item.properties.Par_name3,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Parsing-based Multi-row labeling)
                    let pLabel=new Label(item.properties.pre_name,item.properties.Token_name,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Token-based Multi-row labeling)
                    //let pLabel=new Label(item.properties.pre_name,item.properties.Rule_name,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Rule-based Multi-row labeling)
                    //let pLabel=new Label(item.properties.pre_name,item.properties.pre_name,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (oNE-row labeling)

                    //不存在预处理
                    //let pLabel=new Label(item.properties.name,item.properties.Non_Par,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Parsing-based Multi-row labeling)
                    //let pLabel=new Label(item.properties.name,item.properties.Non_Token,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Token-based Multi-row labeling)
                    //let pLabel=new Label(item.properties.name,item.properties.Non_Rule,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (Rule-based Multi-row labeling)
                    //let pLabel=new Label(item.properties.name,item.properties.name,null,null,item.geometry.coordinates[0], item.geometry.coordinates[1]);//生成注记 (oNE-row labeling)
                    //console.log(pLabel);
                    let textList=[];
                    //console.log(pLabel);

                    //依次判断添加的location和break
                    let addLabel=false;
                    for(let locationValue=0;locationValue<=2;locationValue++){
                        for(let breakValue=0;breakValue<pLabel.textCandidate.length;breakValue++){                        
                            pLabel.location=locationValue;
                            pLabel.textCut=breakValue;
                            pLabel.bound=[];//Label占据的范围需要清空
                            textList=[];//每次都需要清空
                            //console.log("pLabel========",pLabel,pLabel.textCandidate.length,pLabel.location); 
                            textList=this.getText(pLabel,AMap);//生成对应的注记
                            
                            let labelInview=true;
                            for(let i=0;i<textList.length;i++){
                                if(textList[i]!=null){
                                    //console.log(textList[i]);
                                    //console.log(textList[i].getText());
                                    textList[i].setMap(map); //将文本标记设置到地图上
                                    //console.log(textList[i]);
                                    if(textList[i]!==""){
                                        if(boolInView(textList[i].getOptions().content)){
                                            pLabel.bound.push(getElementRect(textList[i].getOptions().content));                                         
                                        } 
                                        else{
                                            labelAcc=false;//表示不可添加
                                            labelInview=false;//表示不在视图内
                                        }
                                    }
                                }
                            }

                            //对视图内的Label判断是否可放置
                            if(labelInview){
                                if(!addLabel){
                                    viewInLabels=viewInLabels+1;//视图内Label+1
                                    addLabel=true;//表示判断过程中已加过一次
                                }
                                //判断重叠
                                if(!(labelList.length==0 || !labelIntersect(pLabel,labelList,symbolList))){                                          
                                    labelAcc=false;
                                }
                                else{
                                    labelAcc=true;
                                }
                            }                            
                            
                            if(!labelAcc){ //不能放置的需要删除
                                /*不能放置的放在默认位置
                                pLabel.location=0;
                                pLabel.textCut=0;
                                pLabel.bound=[];//Label占据的范围需要清空
                                textList=[];//每次都需要清空
                                //console.log("pLabel========",pLabel,pLabel.textCandidate.length,pLabel.location); 
                                textList=this.getText(pLabel,AMap);//生成对应的注记
                                for(let i=0;i<textList.length;i++){
                                    textList[i].setMap(map); //将文本标记设置到地图上
                                }
                                */

                                //不能放置的需要删除
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

                    if(!labelAcc){ //不能放置的放在默认位置 如果注记不能放置，则将注记放置在默认位置 备注：由于UserStudy的原因，符号和注记不删除
                        pLabel.location=0;
                        pLabel.textCut=0;
                        pLabel.bound=[];//Label占据的范围需要清空
                        textList=[];//每次都需要清空
                        //console.log("pLabel========",pLabel,pLabel.textCandidate.length,pLabel.location); 
                        textList=this.getText(pLabel,AMap);//生成对应的注记
                        for(let i=0;i<textList.length;i++){
                            textList[i].setMap(map); //将文本标记设置到地图上
                        }
                    }

                    //#region 添加可放置（所有）的符号和注记列表 备注：由于UserStudy的原因，符号和注记不删除
                    //console.log("markerSymbol=======",markerSymbol);
                    //console.log("pLabel=======",pLabel);

                    symbolList.push(markerSymbol);
                    labelList.push(pLabel);
                    displayedLabels=displayedLabels+1;//能放置的Labels+1
                    if(pLabel.location==0){
                        preferredLoction=preferredLoction+1;//最佳位置+1
                    }
                    charCounts=pLabel.pre_text.length+charCounts;//计算总的字符数

                    for(let i=0;i<textList.length;i++){
                        this.texts.push(textList[i]);
                    }
                    this.markers.push(marker);
                    //#endregion
                
                    //#region 删除不能放置的符号 (User Study的原因，不删除不能放置的符号)
                    /*
                    if(!labelAcc||!symbolAcc){
                        for(let i=0;i<textList.length;i++){
                            textList[i].setMap(null);
                        }
                        marker.setMap(null);
                    }
                    */
                    //#endregion
                });
                //#endregion  
                
                let endTime = performance.now();
                consumedTime = endTime - startTime; // 这将返回毫秒数  

                console.log("viewInLabels=========",viewInLabels);
                console.log("displayedLabels=========",displayedLabels);
                console.log("preferredLoction=========",preferredLoction);
                console.log("charCounts=========",charCounts);
                console.log("consumedTime=========",consumedTime);

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
    