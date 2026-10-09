# 洛琪希桌宠

基于 Codex 的 Windows 桌宠创作试验。支持中文、日文和英文三种界面与对话文字，可在桌宠上方控制栏中随时切换。

这是《无职转生》角色洛琪希的非官方粉丝作品，和原作方无任何关联。项目中的角色形象用于展示桌宠原型；勿将其作为官方素材或单独转售。

## 功能

- 透明、置顶的桌面角色；拖动移动位置
- 六种表情与姿态，随机小范围移动、动作与对话
- 点击时随机回应，文字随语言同步切换
- 70%～140% 大小调整；隐藏、退出及托盘操作
- 语言与大小选择保存在本机

## 下载与安装

在 [Releases](https://github.com/Roxxxxxxy-yyy/roxy-desktop-pet/releases) 下载 `RoxyDesktopPet-Setup-*-x64.exe`，双击安装。安装包包含运行所需的 Electron，不必另外安装 Node.js 或 pnpm。此版本尚未进行代码签名，Windows 可能显示安全提示；请只从本仓库的 Releases 下载。

## 从源码运行或构建

需要 Windows、Node.js 和 pnpm。在项目目录运行：

```powershell
pnpm install
pnpm start
```

安装完成后，可双击 `启动桌宠.cmd`。将鼠标移到角色上即可显示控制栏，在左侧的语言菜单选择 `中文`、`日本語` 或 `English`。

要在 Windows 上生成安装包，运行 `pnpm run build:win`，输出位于 `dist/`。

## 素材与说明

桌宠代码与六张当前使用的 Q 版动作图片位于 `src/` 和 `assets/chibi-v4/`。本项目没有包含原始动画立绘、原图或早期素材草稿。角色及原作相关权利归各自权利方所有。

[日本語](README.ja.md) · [English](README.en.md)
