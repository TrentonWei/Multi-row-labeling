//回调函数的示例
function excuteAfterTimer(excuFunc, funcParam, timerDelay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (typeof excuFunc === 'function') {
                resolve(excuFunc(...funcParam));
            }
        }, timerDelay);
    });
}

//res是函数add的返回值，res作为函数的入参
//function(res){}  等于 (res) => {} 都是函数的表达形式
excuteAfterTimer(add, [4,5], 1000).then(function(res) {
    console.log(res);
});


function add(a, b) {
    console.log(a + b);
    return a + b;
}

