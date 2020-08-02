<?php
//返回查询结果集中查询到的 首个 数据
function getOneResult($result)
{
    return ($result->fetch_row())[0];
}

//$result 为 mysql 查询结果集，这个函数的作用是把结果集中的数据
//以关联数组的形式追加到 array 末尾，一个关联数组是 array 中的一项
function pushtoArray(&$array, $result)
{
    $length = count($array);
    for($i = 0; $i < $result->num_rows; $i++)
    {
        $array[$length] = $result->fetch_assoc();
        $length++;
    }
}


