---
title: The Long Road to Linux
date: 2026-01-09T01:20:54-05:00
draft: false
cover:
  image: fedora_hyprland.webp
tags:
  - linux
  - arch
---
I spent most of my life on Windows, with a few short stints on macOS. My only real exposure to Linux was via SSH sessions on CentOS VMs at work—purely command‑line, just enough to get the job done.

About a year ago I stumbled upon a collection of Hyprland *rices* (custom configurations) and was instantly hooked. The snappy feel, the satisfying workflow, and the keyboard‑centric approach drew me in. That curiosity led me to explore:

* Tiling window managers
* Fancy Bash prompts
* Linux desktop environments
* Custom status bars
* Powerful terminal tools
* A renewed love for Vim

## Starting from Windows

My first attempt at customization stayed on Windows. I installed a handful of tools:

* **Scoop** – a package manager that gave me utilities like `bat`, `tldr`, `fzf`, `zoxide`, etc.
* **Komorebi** – a tiling window manager for Windows.
* **Yasb** – a status bar.
* **Flow Launcher** – an application launcher.
* **oh‑my‑posh** – a prompt theme engine.
* **LazyVim** – a pre‑configured Neovim setup.

The desktop looked decent, but the tiling manager and status bar were buggy: windows would resize or reposition incorrectly, and the bar would often glitch. Still, I appreciated the tiling experience, especially since I was already comfortable with LazyGit’s Vim‑style keybindings.

## Transitioning to Linux

I had wanted to switch my laptop to Linux for a while, but I waited until I had a desktop as a safety net. I eventually chose **Pop!_OS Cosmic**, attracted by its built‑in tiling manager and user‑friendly nature. Pop!_OS was pleasant to set up and the tiler worked well, though it lacked deep customization (understandable for an alpha release). Over time I ran into power‑management issues—my laptop would crash whenever it tried to sleep—so I started looking for a new distro.

## Fedora: My First Step into Dotfiles

I wasn’t ready to dive straight into Arch, so I tried **Fedora Sway Spin**. It ships with the Sway tiling manager, which is stable and highly configurable. Because it avoids a full desktop environment, it gave me a great playground for tools like **Rofi** and **Waybar**, and for learning how to manage dotfiles.

I used Fedora for a few months and enjoyed it more than Pop!_OS, but Sway’s tiling style didn’t feel as natural to me as the Fibonacci‑like layouts I liked in Cosmic and Hyprland.

## Discovering Hyprland on Fedora

Eventually I learned that Hyprland could be installed on Fedora. The moment I tried it, I fell in love with its smooth animations and intelligent tiling logic. The *dwindle* layout is fun for demos, while the *master‑slave* layout proves far more practical for daily work.

{{< img src="fedora_hyprland.webp" >}}

## Moving onto Arch

At this point Arch became a bucket-list item for me, I felt like I had to try it at least once. My Fedora setup was becoming unstable because the fans spun up for no reason, the battery drained quickly, crashes became frequent, and package updates started conflicting. It was time for a fresh start.

During my research I discovered **Niri**, a scrolling window manager, which seemed better suited for a laptop with limited screen‑real‑estate. I also found **Quickshell**, a framework for building custom desktop environments, promising a polished look with minimal effort.

## The Arch + Niri + Quickshell End Game

I performed a minimal Arch installation and added **Niri** together with **Noctalia Quickshell** (a community‑maintained Quickshell configuration). The result blew me away: Noctalia provides a beautiful, cohesive UI out of the box, while still allowing deep customization of applets and colour schemes.

Niri’s scrolling behaviour feels natural on a laptop trackpad and lets me keep many windows on a single workspace without them becoming unusably small. This makes my workspaces feel far more logical.

In Hyprland I used multiple workspaces to group project windows. With Niri I can keep everything for a single project on one workspace, simplifying navigation. The only feature I miss is Hyprland’s scratchpad, which Niri lacks; however, I work around it by moving those windows to a dedicated workspace.

{{< video src="niri_noctalia.webm" >}}

## Extra

I also ran into [Wayfire](https://github.com/WayfireWM/wayfire) which is an absolutely crazy window manager.

{{< youtube NwBcCH1cJRI>}}
