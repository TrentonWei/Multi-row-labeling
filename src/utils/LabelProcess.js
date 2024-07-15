//函數、變量等應用


//#region 定義Label  //可以用class定义类(ES6新特性)
class Label {
    //构造函数(传入参数：text1=传入的注记第一行text；bound1：传入的注记第一行范围经纬度坐标)
    constructor(pre_text,text1, text2, text3,locX,locY) {
        this.pre_text=pre_text;//注记名
        this.x=locX;//表示注记对应点的坐标[x,y]
        this.y=locY;
        this.textCandidate=[text1,text2,text3];//存储潜在的分割candidates
        this.location = 0;//location表示注记相对图标的放置位置，0=右侧；1=下侧；2=左；3=表示删除
        this.textCut = 0;//textCut表示textCut选的位置，0=第一顺位；1=第二顺位；2=第三顺位
        this.bound = [];//bound存储注记的文本范围，[top,right,bottom,left] top=yMin,right=xMax,bottom=yMax,left=xMin
        this.getLinesText();//获得行数Count和finalText
        this.allCost = 0;//表示Label的状态得分
        this.importantValue=0;//表示注记的重要性得分
    }

    getLinesText(){
       let cacheFinalText=this.textCandidate[this.textCut];//获得注记对应的Text
       if(cacheFinalText!=null){
        let arrayText = cacheFinalText.split(";"); 
        this.Count=arrayText.length;//表示文本的行数
        this.finalText=arrayText;//分行和每行文字
        this.charCount=cacheFinalText.replace(/;/g, '').length;//字符的个数 
        this.textCandidate=this.textCandidate.filter(item => item !== null);//去除列表中的null
       } 
    }
}

//表示符号的类
class markSymbol {
    //构造函数(传入参数：locX,locY 位置——经纬度；bound：传入的符号范围 屏幕坐标)
    constructor(locX,locY) {
        this.x=locX;//表示注记对应点的坐标[x,y]
        this.y=locY;
        this.bound;//bound存储注记的文本范围，[top,right,bottom,left] top=yMin,right=xMax,bottom=yMax,left=xMin
    }
}

//判断输出的两个Label1和Label2是否相交
//通过屏幕坐标来判断
//true表示相交，false表示不相交
function Conflict(Label1, Label2) {
    for (let i = 0; i < Label1.bound.length; i++) {
        if (Label1.bound[0] != null) {
            let yMin_i = Label1.bound[i].top; 
            let xMin_i = Label1.bound[i].left; 
            let xMax_i = Label1.bound[i].right;           
            let yMax_i = Label1.bound[i].bottom;

            for (let j = 0; j < Label2.Count; j++) {
                if (Label2.bound[j] != null) {
                    let yMin_j = Label2.bound[j].top; let xMin_j = Label2.bound[j].left; let xMax_j = Label2.bound[j].right; let yMax_j = Label2.bound[j].bottom;

                    if (!(xMax_i < xMin_j || xMax_j < xMin_i || yMax_i < yMin_j || yMax_j < yMin_i)) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

//判断输出的两个Label1和symbo2是否相交
//通过屏幕坐标来判断
//true表示相交，false表示不相交
function Conflict_2(Label1, markSymbol2) {
    //console.log("==== conflict v2", JSON.stringify(markSymbol2));
    for (let i = 0; i < Label1.bound.length; i++) {
        if (Label1.bound[0] != null) {
            let yMin_i = Label1.bound[i].top; 
            let xMin_i = Label1.bound[i].left; 
            let xMax_i = Label1.bound[i].right; 
            let yMax_i = Label1.bound[i].bottom;  

            let yMin_j = markSymbol2.bound.top; 
            let xMin_j = markSymbol2.bound.left;
             let xMax_j = markSymbol2.bound.right; 
             let yMax_j = markSymbol2.bound.bottom;

            if (!(xMax_i < xMin_j || xMax_j < xMin_i || yMax_i < yMin_j || yMax_j < yMin_i)) {
                return true;
            }
        }
    }

    return false;
}

//判断输出的两个symbo11和symbol2是否相交
//通过屏幕坐标来判断
//true表示相交，false表示不相交
function Conflict_3(markSymbol1, markSymbol2) {
    let yMin_i = markSymbol1.bound.top;
    let xMin_i = markSymbol1.bound.left;
    let xMax_i = markSymbol1.bound.right;
    let yMax_i = markSymbol1.bound.bottom;           
    let yMin_j = markSymbol2.bound.top;
    let xMin_j = markSymbol2.bound.left;
    let xMax_j = markSymbol2.bound.right;
    let yMax_j = markSymbol2.bound.bottom;

    if (!(xMax_i < xMin_j || xMax_j < xMin_i || yMax_i < yMin_j || yMax_j < yMin_i)) {
        return true;
    }

    return false;
}

//获取Dom元素在屏幕视图内的范围[top,right,bottom,left] top=yMin,right=xMax,bottom=yMax,left=xMin 这里Min和Max是相对于屏幕左上角而言
function getElementRect(element) {
    var rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY, //Top yMin
        right: rect.right + window.scrollX, //Right xMax
        bottom: rect.bottom + window.scrollY, //Bottom yMax
        left: rect.left + window.scrollX //Left xMin
    };
}
//计算符号的范围
function getSymbolRect(symbol,map) {
    var southWest=map.lngLatToContainer(symbol.getBounds().southWest);//获得符号的绑定矩形
    var northEast=map.lngLatToContainer(symbol.getBounds().northEast);
    //console.log("southWest=======",southWest);
    //console.log("northEast=======",northEast);

    return {
        top: (southWest.y < northEast.y) ? southWest.y : northEast.y, // 等于x和y中较小的值 Top yMin
        right: (southWest.x > northEast.x) ? southWest.x : northEast.x, //Right xMax
        bottom: (southWest.y > northEast.y) ? southWest.y : northEast.y, // 等于x和y中较大的值, Bottom yMax
        left: (southWest.x < northEast.x) ? southWest.x : northEast.x //Left xMin
    };
}


//计算点符号的范围
function getPointSymbolRect(symbol,map,symbolWidth,symbolLength) {
    //console.log("Position=========",symbol.getPosition());
    let symbolPosition=map.lngLatToContainer(symbol.getPosition());//获得符号的中心
    //console.log("southWest=======",southWest);
    //console.log("northEast=======",northEast);

    return {
        top: symbolPosition.y-0.5*symbolWidth, //Top yMin  //这里需要依据符号定位点进行调整
        right: symbolPosition.x+0.5*symbolLength,  //Right xMax
        bottom: symbolPosition.y+0.5*symbolWidth,  //Bottom yMax
        left: symbolPosition.x-0.5*symbolLength //Left xMin
    };
}

//计算模拟退火中Label的Cost
//Cost=位置得分+Text得分+2*重叠得分
function Cost(label, labelList) {
    let locCost = label.location;//位置得分 右侧得分0，下侧得分1，左侧得分2，删除得分为3
    if (locCost == 3) {
        locCost = 4;//若表示删除，则cost加倍
    }
    let textCost =label.textCut;//词分割得分 第一顺位得分0，第二顺位得分1，第三顺位得分2 (可能还需要考虑附属词和主词等的区分)
    let conflictCount = 0;
    for (let i = 0; i < labelList.length; i++) {
        //console.log(i);
        if (Conflict(label, labelList[i])) {
            conflictCount++;
            //console.log(conflictCount);
        }
    }

    let allCost = locCost + textCost + conflictCount * 2;
    return allCost;
}

//产生注记的新状态
function getNewState(Label) {
    let locNewState = Math.floor(Math.random() * 4);//生成0-3的一个随机数
    let textNewState = Math.floor(Math.random() * 3);//生成0-2的一个随机数

    Label.location = locNewState;
    Label.textCut = textNewState;
}

//判断是否接受当前状态
//在较高温度时，有较大概率接受恶化解；随着温度降低，接受恶化解的概率降低 概率为1-exp(-stateValue/T)
//stateValue<0 表示良好解；stateValue>0 表示恶化解
//初温：10。
//这里的T需要确定，初始概率确定为0.6，差值为5，T以10为宜
function stateAccepte(oldStateLabel, newStateLabel, T) {
    //若新状态更好，接受新状态
    if ((newStateLabel.allCost - oldStateLabel.allCost) < 0) {
        return newStateLabel;
    }
    //若新状态不好，以一定概率接受新状态
    else {
        let proValue = Math.pow(Math.E, -(newStateLabel - oldStateLabel) / T);//计算接受恶化解的概率
        if (proValue > Math.random()) {
            return newStateLabel;
        }
        else {
            return oldStateLabel;
        }
    }
}

//降温操作
//step迭代次数，curT当前温度，reduceSpeed表示温度下降的速率,maxStep表示最大迭代次数
function reduceTem(step, curT, reduceSpeed, maxStep) {
    if (step % 3 == 0 && step<maxStep) {
        curT = curT * reduceSpeed;
    }
    return curT;
}

//判断要素是否在视窗内
//true=元素在视窗内；false=元素不在视窗内
function boolInView(element) {
    let rect = element.getBoundingClientRect();
    return (
        rect.top > 0 &&
        rect.left > 0 &&
        rect.bottom < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right < (window.innerWidth || document.documentElement.clientWidth)
    );
}

//判断符号是否在视窗内
//true=元素在视窗内；false=元素不在视窗内
function boolInView_2(markerSymbol,map) {
    var latlng = markerSymbol.getPosition();  
    // 将地理坐标转换为屏幕坐标  
    var pixel = map.lngLatToContainer(latlng); //获得符号的中心
    return (
        pixel.y > 0 &&
        pixel.x > 0 &&
        pixel.y < (window.innerHeight || document.documentElement.clientHeight) &&
        pixel.x < (window.innerWidth || document.documentElement.clientWidth)
    );
}

//获取给定注记的重要性(传入的是Label对象)
//Label=注记
//centerX和centerY=视图中心
//Value越小越重要
function getLabelImportance(Label,centerX,centerY){
   let imValue=Label.charCount*100+Math.sqrt((Label.x-centerX)*(Label.x-centerX)+(Label.y-centerY)*(Label.y-centerY));//imValue越小表示越重要
   return imValue;
}

//获取给定注记的重要性(传入的Text对象)——文本
//Label=注记
//textX和textY对应的点要素中心
//centerX和centerY=视图中心
//Value越小越重要
function getTextImportance(Text,textX,textY,centerX,centerY){
    //console.log(Text);
    if(Text!=null){
        let imValue=Text.replace(/;/g, '').length*100+Math.sqrt((textX-centerX)*(textX-centerX)+(textY-centerY)*(textY-centerY));//imValue越小表示越重要
        return imValue;
    }
    return 0;
 }

 //判断添加的注记是否与已有的注记或符号冲突
 //label 给定的Label，labelList视图内的Labels，symbolList视图内的symbols
 //Label也可能换成对应的symbols
 //返回true是相交；false是不相交
function labelIntersect(label,labelList,symbolList){
    if(labelList.length>0){
        for(let i=0;i<labelList.length;i++){
            if(Conflict(label,labelList[i])){
                return true;
            }
        }
    }

    if(symbolList.length>0){
        for(let i=0;i<symbolList.length;i++){
            if(Conflict_2(label,symbolList[i])){
                return true;
            }
        }
    }

    return false;
}

//返回true是相交；false是不相交
function markerSymbolIntersect(markerSymbol,labelList,symbolList){
    //console.log("====marker symbol intersect", markerSymbol);
    if(labelList.length>0){
        for(let i=0;i<labelList.length;i++){
            if(Conflict_2(labelList[i],markerSymbol)){
                //console.log("labelList[i]=========",i,labelList[i]);
                //console.log("markerSymbo==========",markerSymbol);
                return true;
            }
        }
    }

    if(symbolList.length>0){
        for(let i=0;i<symbolList.length;i++){
            if(Conflict_3(symbolList[i],markerSymbol)){
                //console.log("symbolList[i]=========",i,symbolList[i]);
                //console.log("markerSymbol==========",markerSymbol);
                return true;
            }
        }
    }

    return false;
}


//Export和import类似C++的Include//一个大文件中只有几个export即可
export {
    Label,markSymbol,
    Conflict,Conflict_2,
    Cost,
    getElementRect,
    boolInView, boolInView_2,
    getNewState,
    stateAccepte,
    reduceTem,
    getTextImportance,
    getLabelImportance,
    labelIntersect,markerSymbolIntersect,
    getSymbolRect,getPointSymbolRect
};



