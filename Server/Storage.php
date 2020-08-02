<?php
require_once("function.php");

$url = $_POST["url"];
$id;

//连接到数据库
$db = new mysqli("localhost", "root", "", "");
$db->select_db("页弹");

//索引表，表项为url和对应的id, 以id 做弹幕表表名
$index_table = "index_table";
$command = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='$index_table'";
$result = $db -> query($command);

if($result->num_rows == 0)//数据库中没有索引表, 就创建一个
{
    $command = "
    create table $index_table(
        id int primary key not null auto_increment,
        url varchar(200) not null unique
        )
        ";

    $db->query($command);//创建 索引表
        
}

//url 对应的id
$command = "
select id from $index_table where url = '$url'
";
$result = $db->query($command);
if($result->num_rows == 0)//索引表中没有这个url
{
    //向索引表中插入新url
    $command = "
    insert into $index_table values(NULL, '$url')
    ";
    if(!$db->query($command)) exit("向索引表中添加数据错误");
    $command = "
    select id from $index_table where url = '$url'
    ";
    $result = $db->query($command);//查询mysql为这个url分配的id
    $id = getOneResult($result);

    //依据这个id 给这个url新建一个弹幕表
    $command = "
    create table barrage_".$id."(
        data varchar(200) not null,
        width float not null
        )
    ";
    if(!$db->query($command)) exit("建弹幕表错误");
    
}
else
{
    $id = getOneResult($result);
}

//这个url对应的弹幕表中插入数据
foreach($_POST["barrage"] as $data)
{
    $data_ = $data["data"];
    $width_ = $data["width"];
    $command = "insert into barrage_".$id." values('$data_', $width_)";
    $db->query($command);
}

$db->close();


