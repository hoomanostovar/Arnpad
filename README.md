# 🎛️ Arnpad - Real-Time Touch Synthesizer & Sampler

A modern, responsive, multi-touch synthesizer, sampler, and multi-FX performance workstation built with **React**, **TypeScript**, **Tailwind CSS**, and the native **Web Audio API**, wrapped into native **Android (APK)** via **Capacitor**.

![Arnpad Preview](https://img.shields.io/badge/Platform-Web%20%7C%20Android-blue)
![Build Status](https://github.com/hoomanostovar/Arnpad/actions/workflows/build-apk.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📱 Android APK Download

Every commit automatically triggers a GitHub Actions CI pipeline that compiles the native Android APK.

- **Download APK**: Check out the latest [GitHub Releases](https://github.com/hoomanostovar/Arnpad/releases) or the Artifacts section in [GitHub Actions](https://github.com/hoomanostovar/Arnpad/actions).
- Download `Arnpad-debug.apk` directly to your Android device to install and play.

---

## ✨ Features

- **Dynamic Interactive XY Touch Surface**:
  - Continuous pitch and cutoff modulation with live audio oscilloscope wave feedback.
  - Multi-touch capable with smooth gate envelopes and audio buffer slicing.
  - Floating fairy stardust and reactive sparkling trails following touch movements.
  - Calibrated horizontal division line and half-speed atmospheric tempo pulse.

- **5 Synthesis & Sampling Engines**:
  - `SAMPLER`: Touch granular sampler with slice offset and variable playback rate.
  - `LEAD`: Dual-oscillator pentatonic lead synthesizer with lowpass sweep and resonance.
  - `BASS`: Sub-bass wobble generator with variable LFO rate and saturation drive.
  - `SHIMMER`: Ambient space reverb with harmonic chord voicings and feedback delay.
  - `NOISE`: Vinyl resonance sweep and bandpass filter frequency sweep.

- **4-Slot Sample Bank & Microphone Recording**:
  - 4 sustained, loopable factory presets.
  - Live microphone sampling directly onto any slot with instant Web Audio decoding.
  - Custom audio file drag-and-drop / file upload.

- **Real-Time Multi-FX Bus**:
  - Sinuous Flanger
  - Tempo-synced Tremolo Slicer
  - Analog Tape Flutter

- **6 Distinct 21st.dev-Inspired Aesthetic Themes**:
  - **🌸 Sakura Dawn**: Neo-Tokyo arcade with plump jelly buttons, blossom petal physics, and rose gold highlights.
  - **🦄 Unicorn Sparkle**: Iridescent prism theme with spinning rainbow rings, fluid aurora ribbons, and star crystals.
  - **🐱 Cyber Kitty**: High-tech cyber-deck with chamfered scanline keycaps, matrix digital rain, and cyan telemetry.
  - **🌙 Pastel Dreams**: Frosted celestial glass with starlight sheen sweep, moon orbs, and interconnected constellations.
  - **🍑 Sunset Peach**: 80s analog console with chunky beveled keycaps, rolling twilight horizon waves, and glowing firefly embers.
  - **⚡ Neon Magenta**: Outrun synthwave with 45° diamond wireframes, 3D laser perspective grid, and electric cyan/magenta glow.

- **Synthesized UI Audio Feedback**:
  - Low-latency synthesized micro-clicks, pops, thuds, and blips customized to each theme style.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Android Studio / JDK 17 (optional, for local Android APK builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/hoomanostovar/Arnpad.git
cd Arnpad

# Install dependencies
pnpm install

# Start local dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building the Android APK Locally

```bash
# Build web production bundle
pnpm build

# Sync assets to native Android project
npx cap sync android

# Build Debug APK with Gradle
cd android
./gradlew assembleDebug

# Output APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📄 License

MIT License. Crafted with ❤️ by [hoomanostovar](https://github.com/hoomanostovar).
