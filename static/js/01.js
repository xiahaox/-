let audio = document.getElementById("audios");
console.log(audio.__proto__);
audio.play();
document.addEventListener(
    "WeixinJSBridgeReady",
    function () {
        audio.play();
    },
    false
);


var page1 = document.getElementById('page1'),        //滑动item
    page2 = document.getElementById('page2'),
    page3 = document.getElementById('page3'),
    wraper = document.getElementById('wraper'),
    content = document.getElementById('content');    //滑动容器
var itemHeight = wraper.offsetHeight;                //滑动item高度         
var index = 0;                                       //滑动计数
var moveY,                                           //滑动距离
    endY,                                            //滑动停止的Y坐标
    startY;                                          //滑动开始的Y坐标
// content.style.height = (itemHeight * 3) + 'px'
// 触摸开始
function boxTouchStart(e) {
    console.log(e)
    var touch = e.touches[0];
    startY = touch.pageY;
    endY = content.style.webkitTransform;
    if (!endY) {
        endY = 0;
    } else {
        endY = parseInt(endY.replace('translateY(', ''))
    }
}

// 触摸结束
function boxTouchEnd(e) {
    // var touch = e.touches[0];
}
// 触摸移动
function boxTouchMove(e) {
    var touch = e.touches[0];
    moveY = touch.pageY - startY;
    index = Number(e.target.id.split('page')[1])
    console.log(index, e.target.parentNode.id, moveY, "---------boxTouchMove");
    if (e.target.parentNode.id == "container" || e.target.parentNode.id == "page2") {
        index = 2;
    }
    if (e.target.parentNode.id == "page3") {
        index = 3;
    }
    //下一页
    if (moveY < -50) {
        if (index == 3) {
            return false;
        }
        if (index == 2) {
            window.page3N = true;
            window.addPage3Fn();
        }
        content.style.webkitTransform = 'translateY(-' + (itemHeight * index) + 'px)'
    }
    //上一页
    else if (moveY > 50) {
        if (index == 1 || !index) {
            return false;
        }
        if (index == 3) {
            window.page3N = false;
            window.removePage3Fn()

        }
        content.style.webkitTransform = 'translateY(' + (itemHeight + endY) + 'px)'
    }
}
content.addEventListener('touchstart', boxTouchStart, false)
content.addEventListener('touchmove', boxTouchMove, true)
content.addEventListener('touchend', boxTouchEnd, false)