---
outline: deep

prev:
  text: "自定义模型(线条-贴图-第三方模型)"
  link: "/threejs/02自定义模型(线条-贴图-第三方模型)"
next:
  text: "第三方模型操作"
  link: "/threejs/04第三方模型操作"
---

## blender

`blender`是一个开源的 3D 建模软件，广泛用于游戏开发、动画制作和教育。它支持多种文件格式，包括`.blend`文件，这是 Blender 3D 的默认文件格式。<br/>
[官网下载](https://www.blender.org/download/?utm_medium=nav-global)

## 设置中文

`edit` -> `preferences` -> `interface` -> `language` -> `中文`

## 删除

1. `windows`
   选择对应的`物体` -> 按`Delete`键。

2. `mac`
   选择对应的`物体` -> 按`x`键 -> `enter`键确认删除

## 添加插件

`编辑` -> `偏好设置` -> `插件` -> `勾选对应的插件(正常来说90%都勾选)`

## 添加物体

1. 点击`左上角`的`添加`, 选择对应的物体

2. `shift + a`键，快捷选择

## 左边操作栏(以及操作的快捷方式)

### 物体模式(左上角可选)

![物体模式-左边操作栏](/public/03blender-物体模式-操作栏.jpg)

1. `框选`: 选中物体
2. `游标(shift + 鼠标右键)`: 设置物体的中心点(也就是物体的位置)
3. `移动( g + 鼠标移动)`: 移动物体，可以使用上面的`辅助线`进行移动
4. `旋转( r + 鼠标移动)`: 旋转物体，可以使用上面的`辅助线`进行旋转
5. `缩放( s + 鼠标移动)`: 缩放物体，可以使用上面的`辅助线`进行缩放，横向缩放和纵向缩放; `长按缩放`可以切换模式
6. `变换( t + 鼠标点击目标体)`: 结合`移动`、`旋转`、`缩放`多种功能进行变换
7. `标注( d + 鼠标)`: 标注，只有开发时可以看到, 使用`control + 鼠标`进行`擦除`
8. `测量`: 测量`角度`、`长宽`等,

- `x`: 删除标尺;
- `移动 + shift`: 测量表面长宽;
- `移动 + conctrol`: 吸附

9. `快捷添加物体`: 通过鼠标自定义添加物体， `长按添加物体`可以切换模式

### 编辑模式

切换编辑模式有两种: 1. `左上角手动选择切换`; 2. `按 tab 切换`

1. `模式`: 左上角手动选择切换, 有`点`、`线`、`面`三种模式

2. `框选`: 选中目标，`快捷键`: 按 `g + 鼠标移动`进行拖拽，

- `多选`： `快捷键`: 按 `shift + 鼠标左键`进行多选
- `取消多选`: `快捷键`: 按 `control + 鼠标左键`选中取消多选
- `球体循环点线面`: `快捷键`: 按 `alt + 鼠标左键`进行选中循环`点线面`, 选择`上下还是左右`, 取决于你的鼠标在目标`点线面`的`上下还是左右`

3. `挤出选区`: `快捷键`: 按 `e + 鼠标移动`即可

4. `内插面`: 先拉动，然后按`e + 鼠标移动` 即可

5. `倒角`: 将`点`平滑，`线和面`会有平滑切面, 直接拉动`指导线`调整, 或者`快捷键`: 按 `control + b (mac: command + b)`进行倒角

6. `环切`: 拉动`环切线`进行环切，或者`快捷键`: `control + r (mac: command + r)`移动鼠标进行自定义环切线,然后按 `e + 鼠标移动` 即可操作切出来的环切面

7. `切割`: 其实和`环切差不多`，`快捷键`: 按 `k` , 出现`小刀`图标后，开始切割，`双击鼠标左键`会自动将`首尾`进行连接，然后按`enter`确认切割

- `取消`: `esc`或者`鼠标右键`
- `刀切工具的快捷键和选项`:
  - `C`：启用“约束角度”模式，切割时会沿 45° 或 90° 角度对齐
  - `z`: 启用“穿透切割”，允许切割穿过模型的背面
  - `a`: 在切割时按住，启用角度吸附
  - `ctrl`: 吸附到顶点或边的中点，方便精确切割
  - `Spacebar(空格)`: 在切割过程中快速确认

## 布尔计算

先安装`插件`, `编辑` -> `偏好设置` -> `插件` -> 搜索`bool` -> 勾选`物体:Bool Tool`插件

### 差值(difference)

`差值`就是`两个`或者`多个物体`, 以某个物体为主体，其他物体为占位体，利用占位体在主体上进行裁剪。<br />

`例子`：放一个正方体作为`主体`，在正方体中间放一根圆柱体作为`裁剪的对象`，按`shift`选择裁剪对象，`主体`一定是最后选择，这样`bool`插件会根据前面所选的`裁剪目标`在`主体`上进行裁剪，也就是在`正方体中利用圆柱体的模型占位裁剪出一个洞`,按键是：

1. `window`: `ctrl + shift + 键盘-`
2. `mac`: `command + shift + 键盘-`

- 如果按了是场景的缩放，那么就需要重新设置，`编辑` -> `偏好设置` -> `键位映射` -> 搜索`bool` -> 找到`difference` -> 重新设置`command + shift + -`，因为原本是的`command + shift + 数字键盘-`，mac 无法识别
- 也可以按`command + shift + b` 呼出 `bool 插件`选项栏，然后选择`difference`进行裁剪

### 交集(union)

`交集`就是`两个`或者`多个物体`,合成一个物体，图层也只有一个。<br />

`例子`: 一个球体, 在球体下放置一个`圆锥体`, 利用`交集`进行合并, 按键是:

1. `window`: `ctrl + shift + 键盘+`
2. `mac`: `command + shift + 键盘+`

- 如果按了是场景的缩放，那么就需要重新设置，`编辑` -> `偏好设置` -> `键位映射` -> 搜索`bool` -> 找到`union` -> 重新设置`command + shift + +`，因为原本是的`command + shift + 数字键盘+`，mac 无法识别
- 也可以按`command + shift + b` 呼出 `bool 插件`选项栏，然后选择`union`进行裁剪

### 并集(intersect)

`并集`就是`两个`或者`多个物体`重合部分，裁剪出重合部分，图层也只有一个。<br />

`例子`: 一个正方体, 一个圆柱体，将圆柱体的部分放在正方体的部分上，让其部分重叠，按键是:

1. `window`: `ctrl + shift + *`
2. `mac`: `command + shift + *`

- 如果按了是场景的缩放，那么就需要重新设置，`编辑` -> `偏好设置` -> `键位映射` -> 搜索`bool` -> 找到`intersect` -> 重新设置`command + shift + *`，因为原本是的`command + shift + *`，mac 无法识别
- 也可以按`command + shift + b` 呼出 `bool 插件`选项栏，然后选择`intersect`进行裁剪

## 动画

`blender`的`动画`功能非常强大，可以创建各种复杂的动画效果，包括平滑动画、旋转动画、缩放动画等。<br />

### 简易例子

1. 创建一个球体
2. 点击左下角`编辑器类型`, 选择`动画摄影表`
3. 拉高底下的`帧数表`
4. 选择目标帧数, 移动`球体`到某个位置, `右键`选择插入`关键帧`,重复操作确定几个位置和动画效果
5. 展开右上角`场景集合`底下所有项，找到对应物体的动画
6. 双击`目标体动画的子项`, 可以修改`动画名称`
7. 点击左上角`菜单栏`, 选择`导出`, 选择`gltf2.0(.glb/.gltf)`格式导出动画, `注意`: 该模型是`黑色的`,与你在`blender`
8. 利用`threejs`去渲染模型

- `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>blender 自定义动画模型</title>
    <script type="module" src="./index.ts"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="800" height="800"></canvas>
  </body>
</html>
```

- `index.ts`

```ts
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const width = 800;
const height = 800;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

// 创建场景
const scene = new THREE.Scene();

// 创建灯光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 0);
scene.add(light);

// 创建辅助线
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建动画混合器, 利用动画混合器去控制模型的动画
let mixer: THREE.AnimationMixer;

// 加载模型
const loader = new GLTFLoader();
loader.load("./test-ball.glb", (gltf) => {
  // 将模型放大
  // gltf.scene.scale.set(100, 100, 100) // 放大100倍
  // 初始化动画混合器
  mixer = new THREE.AnimationMixer(gltf.scene);
  // 获取对应的动画
  // 因为可能有多个动画，所以gltf.animations这是一个数组
  const action = mixer.clipAction(gltf.animations[0]);
  // 这就是你导出动画的名称
  console.log(gltf.animations[0].name);
  // 播放动画, 此时动画还不会动，需要在animate函数中进行实时更新
  action.play();

  // 将加载的模型的场景添加到当前场景中
  scene.add(gltf.scene);
});

// 创建相机
const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
scene.add(camera);

// 创建渲染器
const render = new THREE.WebGLRenderer({
  canvas: canvas,
  // 抗锯齿
  antialias: true,
});
render.setSize(width, height);
render.setPixelRatio(window.devicePixelRatio); // 设置像素比
render.setClearColor(0xffc0cb, 1); // 设置背景颜色

// 创建控制器
const controls = new OrbitControls(camera, render.domElement);

// 创建时钟
// 根据系统是30帧还是60帧自动计算
const clock = new THREE.Clock();

// 动画
const animate = () => {
  requestAnimationFrame(animate);
  render.render(scene, camera);
  controls.update();
  // 更新动画
  if (mixer) {
    mixer.update(clock.getDelta());
  }
};
animate();
```
