# 作品入口悬停反馈

2026-10-09。用户要求给作品区块加hover。目的为点击入口反馈，高频浏览采用轻量CSS过渡，未引入JS或Shader。

鼠标经过封面或题签：封面整体上移3px、放大1.2%，阴影opacity显现；标题朱砂、箭头右移4px。220ms ease过渡可在移入/移出时自然打断。变换位于整个封面链接，保持内部object-fit:contain与8:5原比例，内容不裁切，布局不重排。

只在hover:hover且pointer:fine生效。外部体验链接保留独立反馈；键盘focus-visible让封面出现静态细边框、标题/箭头着色，不做位移动画。减少动态关闭封面/箭头变换与阴影，只保留静态颜色/焦点。

本地IAB回读：scale1.012/translateY(-3)、箭头translateX(4)、阴影opacity1、标题朱砂与contain；受控前后图确认作品仍为主视觉。减少动态回读transform none、shadow0；Shift+Tab实际聚焦题签，封面outline solid且无变换；Enter进入晨间花园。没有修改字体、内容、图片、原有链接或六种口号。

发布状态回CURRENT。真实触屏/Safari体验及用户手感反馈未验。
