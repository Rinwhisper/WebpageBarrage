//保存浏览器窗口的尺寸
var w_width;
var w_height;

//保存当前页面最大 z-index
var max_z_index;

//保存弹幕的 z-index
var z_index;

//容器 container，用来装入弹幕，测量 弹幕的宽度
var container;

//弹幕发送间隔时间，ms
var spaced_time;

//弹幕从屏幕划过所需要的时间，ms
var through_time;

//弹幕缓存，离开当前页面的时候发送到服务器
//barage_cache 的格式为
/*
{
	"url" : url,
	"barrage" : [
		{
			"data" : data,
			"width" : width
		},
		......
	]
}
*/
var barrage_cache ={
	"url" : null,
	"barrage" : []
};

//设置输入框，按钮距离 bottom 的高度, 格式为 百分比
//var bottom;

//初始化函数，用于初始化一些必要变量
function init()
{
	//得到浏览器窗口的尺寸
	w_width = window.innerWidth;
	w_height = window.innerHeight;

	//得到当前页面最大 z-index,防止重复获取，依次递增
	max_z_index = getMaxZIndex();

	//设置弹幕的 z-index
	z_index = max_z_index + 1;

	//创建 container(div)
	container = createContainer();

	//保存当前URL
	barrage_cache.url = getCurrentURL();
	
	//设置与弹幕相关的时间
	through_time = 15000;
	spaced_time = 1000;
}




//这个函数用于得到当前页面的最大 z-index
function getMaxZIndex() 
{
  var maxZ = Math.max.apply(null,
    $.map($('body *'), function (e, n) {
      if ($(e).css('position') != 'static') {
        //运算符 || 用于短路求值，如果 z-index 没有定义，将会返回 auto ==> NAN
    	return parseInt($(e).css('z-index')) || 1;
      }
    }));
  return maxZ;
}


//得到弹幕在 html 中的实际长度 ，这里用的是 div, 在 span 和 div 里，默认 font-size 和 font-family 是一样的
function getBarrageWidth(data, fontSize = "14px", fontFamily = '"Microsoft YaHei", "SF Pro Display", \
Roboto, Noto, Arial, "PingFang SC", sans-serif') 
{
	container.css({
		"font-size" : fontSize,
		"font-family" : fontFamily
	});
	container.text(data);

	return container.width();
}

//创建 div
function createContainer() 
{
    var container = $("<div id = 'container__123'></div>");
    container.css({
		"position" : "fixed",
		"top" : "0%",
		"left" : "0%",
		"visibility" : "hidden"
	});
	$("body").append(container);
	return container;
}

//创建输入框
function createInput()
{
	var input = $("<input type = 'text'></input>");
    input.css({
				"position" : "fixed",
				"z-index" : z_index,
        "left" : "20%",
        "bottom" : "10%",
        "width" : "35%",
        "height" : "50px"
    });
	$("body").append(input);
	
	return input;
}

//创建发送按钮
function createButton()
{
	var button = $("<button>发送</button>");
    button.css({
        "position" : "fixed",
				"z-index" : z_index,
        "left" : "60%",
        "bottom" : "10%",
        "width" : "10%",
        "height" : "50px"
    });
	$("body").append(button);
	
	return button;
}

//得到随机的颜色，根据 defa 的值确定是否设置透明度
// defa = 0，不设置透明度， defa = 1 设置透明度
//默认为 0
function setRandomColorOrOpacity(defa = 0)
{
    var red = parseInt(Math.random() * (256 + 1));
    var green = parseInt(Math.random() * (256 + 1));
    var blue = parseInt(Math.random() * (256 + 1));
	var opacity = parseInt(Math.random() * (10 + 1)) / 10;

	if(!defa)
	{
		//不设置透明度
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}
	else
	{
		//设置透明度
		return "rgba(" + red + ", " + green + ", " + blue + ", " + opacity + ")";
	}
}

//设置弹幕在屏幕上的垂直位置
function setTopCoordinates()
{
	var top = Math.random() * (w_height - w_height * 0.1 - 100);

	return top;
}

//设置弹幕在右边的起始位置
function setRightCoordinates(width)
{
	return "-" + (width + width) + "px";
}

//设置弹幕在左边停止的位置
function setLeftCoordinates(width)
{
	return w_width + width + 50 + "px";
}

//设置 span 的宽度
function setSpanWidth(width)
{
	return width + 100 + "px";
}

//把弹幕送到屏幕
function sendtoScreen(data, width)
{
	//这里有个奇葩的操作，getBarrageWidth 居然是异步执行的，所以我不得不在这里
	//设置一个 width 变量来储存 弹幕的宽度，并且把 createContainer 函数从 getBarrageWidth
	//函数移到 init 函数去，因为下面需要多次调用 getBarrageWidth 函数，它会创建多个 Container
	//但是为什么呢?
	//感觉设置一个 width 变量好处还多一点呢
	//但是还是为什么呢
	width = width || getBarrageWidth(data);

	var barrage = $("<span></span>");
	barrage.text(data);
	barrage.css({
		"position" : "fixed",
		"z-index" : z_index,
		"top" : setTopCoordinates(),
		"right" : setRightCoordinates(width),
		"color" : setRandomColorOrOpacity(),
		"width" : setSpanWidth(width)
	});
	$("body").append(barrage);

	barrage.animate({
		right : setLeftCoordinates(width)
	}, through_time, "linear", function(){
		this.remove();
	});


}

//把弹幕送到缓存
function sendtoCache(data)
{
	var width = getBarrageWidth(data);
	barrage_cache.barrage.push({
		"data" : data,
		"width" : width
	});
	console.log("执行Cache");


}

//得到当前页面URL
function getCurrentURL()
{
	//使用不带协议类型的 URL 
	var url = window.location.host + window.location.pathname;

	return url;
}

//发送缓存到服务器
function sendCachetoServer()
{
	console.log("执行ajax");
	//缓存为空不发送
	if(emptyArray(barrage_cache.barrage)) return;
	$.ajax({
		url : "http://127.0.0.1:8081/WebpageBarrage/Storage.php",
		type : "POST",
		dataType : "text",
		data : barrage_cache,
		success : function(reaponse)
		{
			console.dir(reaponse);
		},
		error : function(err){
			console.dir(err);
			alert("shibai1");
		}
	});
}

//判断数组为空
function emptyArray(array)
{
	if(Array.isArray(array)&&array.length == 0)
	{
		return true;
	}
	return false;
}

//页面加载的时候从服务器接收弹幕
function recvBarragefromServer()
{
	$.ajax({
		url : "http://127.0.0.1:8081/WebpageBarrage/getBarrage.php",
		type : "GET",
		dataType : "json",
		data : {
			"url" : getCurrentURL()
		},
		success : function(response){
			if(!response[0])
			{
				console.log("错误：",response[1]);
				return;
			}
			sendServerBarragetoScreen(response[2]);
//			console.log(response);

		}
	});
}

//把 response 里的弹幕发送到屏幕
function sendServerBarragetoScreen(barrage)
{
	for(var i = 0; i < barrage.length; i++)
	{
		(function(i){
			setTimeout(function(){
				sendtoScreen(barrage[i]['data'], Number(barrage[i]['width']));
			}, (i + 1) * spaced_time);
			
		})(i)
	}
}



