---
outline: deep

prev:
  text: "lua安装和介绍"
  link: "/node/redis/index"
next:
  text: "ioredis、express、lua脚本实现限流阀"
  link: "/node/ioredis_express_lua"
---

## 代码

### index.lua

```lua
-- 全局变量
-- name = "小新"
-- print(name)

-- 局部变量
-- local age = 18
-- print(age)

-- 作用域
-- do
--     local age = 20
--     print(age)
-- end

-- 数据类型
do
    -- 会自动推断类型

    -- nil：空值，也就是前端的null和undefind
    local emt = nil
    -- print(emt)

    -- number：数字
    local num = 18
    -- print(num)

    -- string：字符串
    local str = '小白'
    -- print(str)

    -- 拼接字符串 ..
    -- print(str .. "name")

    -- boolean: 布尔值
    local isTrue = false
    -- print(isTrue)

    -- table：表, 也就是数组和对象
    -- 数组: 大部分语言的数组是从 0 开始，但是lua是从 1 开始
    local arr = {1, 2, 3}
    -- print(arr[1]) -- 输出 1
    -- 对象
    local obj = {
        name = "小新",
        age = 5,
        isBoy = true
    }
    -- print(obj.name, obj.age, obj.isBoy)

    -- function：函数
    local fn = function(name, age)
        print(name, age)
    end
    -- fn(obj.name, obj.age)

    -- thread：线程

    -- userdata：用户数据
end

-- if判断
local age = 18
-- if age >= 50 then
--     print("老年人")
-- elseif age >= 18 and age < 50 then
--     print("中青年人")
-- else
--     print("未成年人")
-- end

-- 函数
function add(num)
    local result = num + 1
    return result
end
local result = add(age)
-- print(result)

-- for循环
--  i = 1:初始值
-- 10: 循环次数
-- 1:步长，也就是 i + 1
for i = 1, 10, 1 do
    -- print(i)
end

-- 遍历数组, ipairs: 迭代器
local arr = {'haha', 'ooo', 'aaa'}
for index, value in ipairs(arr) do
    -- print(index .. '----' .. value)
end

-- 遍历对象
local obj = {
    name = "小新",
    age = 5,
    address = '日本'
}
for key, value in pairs(obj) do
    -- print(key .. '的值是' .. value)
end

-- 模块化
local modules = require("./utils")
print(modules.name)

-- 操作文件
-- io.open(文件路径, "模式"), 模式有: r(读) w(写) a(追加)
-- local files = io.open("./test.txt", "r")
-- 读取全部内容
-- files:read("*a")是一个语法糖， 完整的写法是 files.read(files, "*a")
-- *a 是读取全部的意思
-- local content = files:read("*a")
-- print(content)

-- 写入文件
-- local files1 = io.open("./test.txt", "w")
-- files1:write(
--     "啊司法所法师法师法拉盛发快手了合法看手机发康师傅哈刷卡积分哈开机费哈夫节撒开")

-- 追加文件内容
-- local files2 = io.open("./test.txt", "a")
-- files2:write('124124124124124')

```

### utils.lua

模块化

```lua
local modules = {
    name = "小新",
    age = 18,
    a = 1,
    b = 2
}

-- 给对象添加方法
function modules.add(a, b)
    local result = a + b
    print(result)
    return result
end

-- 添加属性
modules.address = "日本"

-- 导出模块
return modules

```

### test.txt

```txt
随便写点内容
```

## 运行 index.lua 文件

```sh
lua index.lua
```
