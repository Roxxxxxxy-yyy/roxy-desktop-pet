# Roxy Desktop Pet · A Codex Creation Experiment

A Windows desktop pet created as an experiment with Codex. Choose Chinese, Japanese, or English for the interface and dialogue from the control bar that appears when you hover over the character.

This is an unofficial fan project featuring Roxy from *Mushoku Tensei*. It is not affiliated with the original rights holders. The character images are included to demonstrate this prototype; please do not present them as official assets or resell them separately.

## Features

- Transparent, always-on-top character you can drag around the desktop
- Six expressions and poses, occasional short walks, actions, and dialogue
- Random reactions to clicks, with dialogue in the selected language
- 70%–140% size adjustment, hide and quit controls, and a tray menu
- Language and size preferences saved locally

## Download and install

Download `RoxyDesktopPet-Setup-*-x64.exe` from [Releases](https://github.com/Roxxxxxxy-yyy/roxy-desktop-pet/releases) and run it. The installer includes Electron; Node.js and pnpm are not needed to use the installed app. This build is not code-signed, so Windows may show a security warning. Download it only from this repository's Releases.

## Run or build from source

Requires Windows, Node.js, and pnpm. From the project folder, run:

```powershell
pnpm install
pnpm start
```

After installation, you can also double-click `启动桌宠.cmd`. Hover over the character and choose `中文`, `日本語`, or `English` in the language menu.

On Windows, run `pnpm run build:win` to create an installer in `dist/`.

The character and original work remain the property of their respective rights holders. Original anime artwork and earlier image drafts are not included.

[中文](README.md) · [日本語](README.ja.md)
