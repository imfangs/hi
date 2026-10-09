# 口号样例接续

独立实验，不在正式 Astro 路由中。目标是比较同一 Taste. Build. Sell. 的三种材质/互动，保留同字号、同基线和 Instrument Serif 字形。当前结果及验证边界以 README.md 为准。

`npm ci --registry=https://registry.npmjs.org`，`npm run dev`（127.0.0.1:4329），`npm run build`。没有常驻服务，关闭启动终端即可停止。依赖与锁文件仅属于本目录；不要向 Hi 根 package.json 添加。

改动后实际检查模式切换、像素化进度、指针/键盘回响、暂停、窄屏和字体加载。canvas 必须内联 width/height:100%，否则上游初始化会将 CSS 尺寸固定成桌面像素。手机字体遮罩需按容器比例重建。默认不发布，不替换正式首页。不要从构建成功推断GPU渲染或审美有效。
