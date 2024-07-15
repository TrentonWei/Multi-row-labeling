//data文件夹放静态文件
const carData = {
    "type": "FeatureCollection",
    "name": "汽车销售",
};

//导出的是对象
export {
    carData,
};

//导出的是一个
export const car = carData; //name=export的值

    