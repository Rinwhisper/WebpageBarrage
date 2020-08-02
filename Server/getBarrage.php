<?php


require_once("function.php");
header('Content-type: application/json'); 

//将会返回的json
//因为 chrome 识别不了 json_encode() 出来的 json 对象，所以只能用下面这种奇怪的方式
//将会返回的格式为
/*
[
    statu,
    message,
    [
        {
            "data" : data,
            "width" : width
        }
        ......
    ]
]

*/
$response  = array(
    null,  //statu 状态信息，0 为发生错误，1 为成功
    null,  //message 保存错误信息
    array()   //保存取出的弹幕，statu = 0 时为空
);

$url = $_GET["url"];
$id;

$db = new mysqli("localhost", "root", "", "");
$db->select_db("页弹");

$index_table = "index_table";
$command = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='$index_table'";
$result = $db -> query($command);

if($result->num_rows == 0)
{
    //没有索引表 return 
    $response[0] = 0;
    $response[1] = "尚未建立索引表";
    echo json_encode($response);
    exit;
}

$command = "
select id from $index_table where url = '$url'
";
$result = $db->query($command);

if($result->num_rows == 0)
{
    //索引表中没有当前页面 return
    $response[0] = 0;
    $response[1] = "索引表中没有当前页面";
    echo json_encode($response);
    exit;
}

$id = getOneResult($result);

$command = "select * from barrage_".$id;
$result = $db->query($command);
//向response 中的 barrage 填充数据
pushtoArray($response[2], $result);

$response[0] = 1;
$response[1] = "成功";

echo json_encode($response);
