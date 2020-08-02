$(document).ready(function(){

    //初始化函数，用于初始化一些必要变量
    init();
    
    //创建输入框
    var input = createInput();
    
    //创建发送按钮
    var button = createButton();

    //接受弹幕
    button.click(function(){
        var data = input.val();
        sendtoScreen(data);
        sendtoCache(data);
        input.val("");
    });

    window.onpagehide = function(){
        sendCachetoServer();
    };

    window.onpageshow = function(){
//        alert("dasda");
        recvBarragefromServer();
    };

})