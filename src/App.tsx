import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Mic,
  Square,
  Upload,
  Waves,
  Palette,
  Music,
  Disc,
  Sliders,
  Flame,
  Activity,
  Layers,
  Repeat,
  Radio,
  Check,
  ChevronDown,
} from "lucide-react";
import GlowButton, { cn } from "./components/ui/GlowButton";

// Themes inspired by 21st.dev aesthetic palettes
export type ThemeId =
  | "sakura"
  | "unicorn"
  | "cyberkitty"
  | "pasteldreams"
  | "marshmallow"
  | "neonmagenta";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: string;
  bgGradient: string;
  chassisBg: string;
  chassisBorder: string;
  padBg: string;
  gridLine: string;
  primaryAccent: string;
  secondaryAccent: string;
  tertiaryAccent: string;
  glowColor: string;
  textColor: string;
  trailHue: number;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  sakura: {
    id: "sakura",
    name: "Sakura Dawn",
    tagline: "Cherry blossom blush & rose gold",
    icon: "🌸",
    bgGradient: "from-[#220d18] via-[#140810] to-[#0a0408]",
    chassisBg: "bg-[#180a13]/85 backdrop-blur-2xl",
    chassisBorder: "border-[#ff7ea5]/40 shadow-[0_0_50px_rgba(255,126,165,0.25)]",
    padBg: "#0f050b",
    gridLine: "rgba(255, 126, 165, 0.12)",
    primaryAccent: "#ff7ea5",
    secondaryAccent: "#f43f5e",
    tertiaryAccent: "#ffdbe4",
    glowColor: "#ff7ea5",
    textColor: "text-pink-100",
    trailHue: 345,
  },
  unicorn: {
    id: "unicorn",
    name: "Unicorn Sparkle",
    tagline: "Magical magenta & iridescent violet",
    icon: "🦄",
    bgGradient: "from-purple-950/60 via-slate-950 to-pink-950/50",
    chassisBg: "bg-slate-950/90 backdrop-blur-2xl",
    chassisBorder: "border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.28)]",
    padBg: "#11071c",
    gridLine: "rgba(244, 114, 182, 0.14)",
    primaryAccent: "#f472b6",
    secondaryAccent: "#c084fc",
    tertiaryAccent: "#818cf8",
    glowColor: "#f472b6",
    textColor: "text-pink-200",
    trailHue: 315,
  },
  cyberkitty: {
    id: "cyberkitty",
    name: "Cyber Kitty",
    tagline: "Neo-Tokyo cyan & mint matrix",
    icon: "🐱",
    bgGradient: "from-cyan-950/40 via-slate-950 to-emerald-950/40",
    chassisBg: "bg-[#050e13]/90 backdrop-blur-2xl",
    chassisBorder: "border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.25)]",
    padBg: "#031116",
    gridLine: "rgba(34, 211, 238, 0.13)",
    primaryAccent: "#22d3ee",
    secondaryAccent: "#34d399",
    tertiaryAccent: "#a855f7",
    glowColor: "#22d3ee",
    textColor: "text-cyan-200",
    trailHue: 185,
  },
  pasteldreams: {
    id: "pasteldreams",
    name: "Pastel Dreams",
    tagline: "21st.dev dreamy lilac & lavender",
    icon: "🌙",
    bgGradient: "from-[#201533] via-[#100a1c] to-[#07040d]",
    chassisBg: "bg-[#160d24]/90 backdrop-blur-2xl",
    chassisBorder: "border-[#c0aafd]/40 shadow-[0_0_50px_rgba(192,170,253,0.25)]",
    padBg: "#0d0716",
    gridLine: "rgba(192, 170, 253, 0.13)",
    primaryAccent: "#c0aafd",
    secondaryAccent: "#a78bfa",
    tertiaryAccent: "#f472b6",
    glowColor: "#c0aafd",
    textColor: "text-purple-100",
    trailHue: 265,
  },
  marshmallow: {
    id: "marshmallow",
    name: "Sunset Peach",
    tagline: "Anime golden hour & tangerine glow",
    icon: "🍑",
    bgGradient: "from-amber-950/40 via-neutral-950 to-rose-950/40",
    chassisBg: "bg-[#160b07]/90 backdrop-blur-2xl",
    chassisBorder: "border-amber-400/40 shadow-[0_0_50px_rgba(251,146,60,0.25)]",
    padBg: "#120603",
    gridLine: "rgba(251, 146, 60, 0.13)",
    primaryAccent: "#fb923c",
    secondaryAccent: "#f43f5e",
    tertiaryAccent: "#fbbf24",
    glowColor: "#fb923c",
    textColor: "text-amber-100",
    trailHue: 28,
  },
  neonmagenta: {
    id: "neonmagenta",
    name: "Neon Magenta",
    tagline: "High-voltage synthwave & laser cyan",
    icon: "⚡",
    bgGradient: "from-[#1a0117] via-black to-[#050c1c]",
    chassisBg: "bg-black/90 backdrop-blur-2xl",
    chassisBorder: "border-[#ff00c8]/40 shadow-[0_0_50px_rgba(255,0,200,0.3)]",
    padBg: "#080108",
    gridLine: "rgba(255, 0, 200, 0.15)",
    primaryAccent: "#ff00c8",
    secondaryAccent: "#00e5ff",
    tertiaryAccent: "#9000ff",
    glowColor: "#ff00c8",
    textColor: "text-pink-100",
    trailHue: 305,
  },
};

type ProgramMode =
  | "sampler_grain"
  | "synth_lead"
  | "bass_wobble"
  | "ambient_space"
  | "filter_noise";
type ModType = "off" | "flanger" | "tremolo_slicer" | "tape_flutter";

interface ProgramConfig {
  id: ProgramMode;
  name: string;
  label: string;
  badge: string;
  xLabel: string;
  yLabel: string;
  icon: React.ReactNode;
}

// Pentatonic scale frequencies in Hz
const PENTATONIC_FREQS = [
  65.41, 73.42, 82.41, 98.0, 110.0,
  130.81, 146.83, 164.81, 196.0, 220.0,
  261.63, 293.66, 329.63, 392.0, 440.0,
  523.25, 587.33, 659.25, 783.99, 880.0,
  1046.5, 1174.66, 1318.51, 1567.98, 1760.0
];

export default function KaossPad() {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("sakura");
  const [themeMenuOpen, setThemeMenuOpen] = useState<boolean>(false);
  const theme = THEMES[currentTheme];

  // Core Pad State
  const [activeProgram, setActiveProgram] = useState<ProgramMode>("sampler_grain");
  const [activeModType, setActiveModType] = useState<ModType>("flanger");
  const [modDepth] = useState<number>(0.7);
  const [holding, setHolding] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [bpm, setBpm] = useState<number>(120);

  // Sampler State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activePadSlot, setActivePadSlot] = useState<number>(0);
  const [sampleNames, setSampleNames] = useState<string[]>([
    "Sakura Chime",
    "Sub Kitty Drop",
    "Candy Rim Break",
    "Cloud Stab M9",
  ]);

  // Audio Context and Node Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const touchGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // DSP Nodes
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const delayGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  // FX Modulation Refs
  const modOscRef = useRef<OscillatorNode | null>(null);
  const modOscGainRef = useRef<GainNode | null>(null);
  const tremoloOscRef = useRef<OscillatorNode | null>(null);
  const tremoloDepthGainRef = useRef<GainNode | null>(null);

  // Noise generator
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // Sampler buffers
  const sampleBankRef = useRef<(AudioBuffer | null)[]>([null, null, null, null]);
  const activeSampleSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Canvas visualizer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const trailPointsRef = useRef<{ x: number; y: number; alpha: number; radius: number; hue: number }[]>([]);

  // State synchronization refs
  const touchPosRef = useRef<{ x: number; y: number } | null>(null);
  const holdingRef = useRef<boolean>(false);
  const programRef = useRef<ProgramMode>(activeProgram);
  const isMutedRef = useRef<boolean>(isMuted);
  const activePadSlotRef = useRef<number>(activePadSlot);
  const themeRef = useRef<ThemeConfig>(theme);
  const isPointerDownRef = useRef<boolean>(false);
  const isEngagedRef = useRef<boolean>(false);
  const lastSliceRef = useRef<number>(-1);

  touchPosRef.current = touchPos;
  holdingRef.current = holding;
  programRef.current = activeProgram;
  isMutedRef.current = isMuted;
  activePadSlotRef.current = activePadSlot;
  themeRef.current = theme;

  // Synthesize factory sustained & loopable presets
  const generateFactoryPresets = useCallback((ctx: AudioContext) => {
    const sRate = ctx.sampleRate;

    // Slot 0: Sakura Chime / Sparkling Drone
    const dur0 = 2.0;
    const buf0 = ctx.createBuffer(1, Math.floor(sRate * dur0), sRate);
    const data0 = buf0.getChannelData(0);
    for (let i = 0; i < data0.length; i++) {
      const t = i / sRate;
      const b1 = Math.sin(2 * Math.PI * 523.25 * t) * 0.35;
      const b2 = Math.sin(2 * Math.PI * 1046.5 * t) * 0.25;
      const b3 = Math.sin(2 * Math.PI * 1567.98 * t) * 0.15;
      const b4 = Math.sin(2 * Math.PI * 2093.0 * t) * 0.1;
      const shimmer = Math.sin(t * 24) * 0.1;
      const env = 0.45 + 0.55 * Math.exp(-((t % 1.0) * 2.0));
      data0[i] = (b1 + b2 + b3 + b4 + shimmer) * env;
    }
    sampleBankRef.current[0] = buf0;

    // Slot 1: Sub Kitty Drop / Bass Synth
    const dur1 = 1.5;
    const buf1 = ctx.createBuffer(1, Math.floor(sRate * dur1), sRate);
    const data1 = buf1.getChannelData(0);
    for (let i = 0; i < data1.length; i++) {
      const t = i / sRate;
      const freq = 65 + 30 * Math.sin(t * 8);
      const sub = Math.sin(2 * Math.PI * freq * t) * 0.65;
      const sub2 = Math.sin(4 * Math.PI * freq * t) * 0.2;
      const env = 0.5 + 0.5 * Math.sin(t * 4);
      data1[i] = (sub + sub2) * env;
    }
    sampleBankRef.current[1] = buf1;

    // Slot 2: Sweet Candy Rim Percussion & Groove
    const dur2 = 1.0;
    const buf2 = ctx.createBuffer(1, Math.floor(sRate * dur2), sRate);
    const data2 = buf2.getChannelData(0);
    for (let i = 0; i < data2.length; i++) {
      const t = i / sRate;
      const beatEnv = Math.exp(-((t % 0.25) * 16));
      const tonal = (Math.sin(2 * Math.PI * 880 * t) + Math.sin(2 * Math.PI * 1760 * t) * 0.5) * 0.4;
      const noise = (Math.random() * 2 - 1) * Math.exp(-((t % 0.25) * 28)) * 0.25;
      data2[i] = (tonal + noise) * beatEnv + (Math.sin(2 * Math.PI * 220 * t) * 0.15);
    }
    sampleBankRef.current[2] = buf2;

    // Slot 3: Dreamy Cloud Stab (Major 7th Sustained Pad)
    const dur3 = 2.0;
    const buf3 = ctx.createBuffer(1, Math.floor(sRate * dur3), sRate);
    const data3 = buf3.getChannelData(0);
    for (let i = 0; i < data3.length; i++) {
      const t = i / sRate;
      const c = Math.sin(2 * Math.PI * 329.63 * t);
      const e = Math.sin(2 * Math.PI * 392.0 * t);
      const g = Math.sin(2 * Math.PI * 493.88 * t);
      const b = Math.sin(2 * Math.PI * 587.33 * t);
      const shimmer = Math.sin(t * 18) * 0.1;
      const env = 0.5 + 0.5 * Math.sin(t * 3.14159);
      data3[i] = (c + e + g + b + shimmer) * 0.2 * env;
    }
    sampleBankRef.current[3] = buf3;
  }, []);

  // Initialize Web Audio graph
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    generateFactoryPresets(ctx);

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMutedRef.current ? 0 : 0.85, ctx.currentTime);

    // Analyser Node for live visual feedback
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.8;
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);
    masterGainRef.current = masterGain;
    analyserRef.current = analyser;

    // Touch Gate
    const touchGain = ctx.createGain();
    touchGain.gain.setValueAtTime(0, ctx.currentTime);
    touchGain.connect(masterGain);
    touchGainRef.current = touchGain;

    // Main Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(5, ctx.currentTime);
    filter.connect(touchGain);
    filterRef.current = filter;

    // Delay Bus
    const delay = ctx.createDelay(2.0);
    delay.delayTime.setValueAtTime(0.3, ctx.currentTime);
    const delayFb = ctx.createGain();
    delayFb.gain.setValueAtTime(0.4, ctx.currentTime);
    const delayDryWet = ctx.createGain();
    delayDryWet.gain.setValueAtTime(0.35, ctx.currentTime);

    delay.connect(delayFb);
    delayFb.connect(delay);
    delay.connect(delayDryWet);
    delayDryWet.connect(masterGain);

    delayNodeRef.current = delay;
    delayFeedbackRef.current = delayFb;
    delayGainRef.current = delayDryWet;

    // Modulation Oscillator (Flanger / Tape Flutter)
    const modOsc = ctx.createOscillator();
    modOsc.type = "sine";
    modOsc.frequency.setValueAtTime(0.6, ctx.currentTime);
    const modOscGain = ctx.createGain();
    modOscGain.gain.setValueAtTime(0.0035, ctx.currentTime);
    modOsc.connect(modOscGain);
    modOscGain.connect(delay.delayTime);
    modOsc.start();
    modOscRef.current = modOsc;
    modOscGainRef.current = modOscGain;

    // Slicer Tremolo
    const tremoloOsc = ctx.createOscillator();
    tremoloOsc.type = "square";
    tremoloOsc.frequency.setValueAtTime(8, ctx.currentTime);
    const tremoloDepthGain = ctx.createGain();
    tremoloDepthGain.gain.setValueAtTime(0, ctx.currentTime);
    tremoloOsc.connect(tremoloDepthGain);
    tremoloDepthGain.connect(touchGain.gain);
    tremoloOsc.start();
    tremoloOscRef.current = tremoloOsc;
    tremoloDepthGainRef.current = tremoloDepthGain;

    // LFO for Bass
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(4, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;

    // Synthesizer Dual Oscillators
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(220, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(222, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(delay);

    osc1.start();
    osc2.start();
    osc1Ref.current = osc1;
    osc2Ref.current = osc2;

    // Noise Generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);
    noiseSource.start();
    noiseSourceRef.current = noiseSource;
    noiseGainRef.current = noiseGain;
  }, [generateFactoryPresets]);

  // Trigger sample loop or slice
  const triggerSamplePlayback = useCallback((x: number, y: number, loop: boolean) => {
    if (!audioCtxRef.current || !filterRef.current) return;
    const ctx = audioCtxRef.current;
    const currentBuf = sampleBankRef.current[activePadSlotRef.current];
    if (!currentBuf) return;

    if (activeSampleSourceRef.current) {
      try {
        activeSampleSourceRef.current.stop();
        activeSampleSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      activeSampleSourceRef.current = null;
    }

    const source = ctx.createBufferSource();
    source.buffer = currentBuf;
    source.loop = loop;

    const rate = 0.35 + Math.pow(y, 1.8) * 3.65;
    source.playbackRate.setValueAtTime(rate, ctx.currentTime);

    const offset = Math.min(x * currentBuf.duration, Math.max(0, currentBuf.duration - 0.05));
    source.connect(filterRef.current);
    source.start(0, offset);
    activeSampleSourceRef.current = source;
  }, []);

  // Update sound synthesis params from touch
  const updateAudioParams = useCallback((x: number, y: number, isEngaged: boolean) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const p = programRef.current;

    // Gate control: ramp smoothly on state change, never cut off during move
    if (touchGainRef.current) {
      if (isEngaged && !isEngagedRef.current) {
        isEngagedRef.current = true;
        touchGainRef.current.gain.cancelScheduledValues(now);
        touchGainRef.current.gain.setValueAtTime(touchGainRef.current.gain.value, now);
        touchGainRef.current.gain.linearRampToValueAtTime(0.85, now + 0.015);
      } else if (!isEngaged && isEngagedRef.current) {
        isEngagedRef.current = false;
        touchGainRef.current.gain.cancelScheduledValues(now);
        touchGainRef.current.gain.setValueAtTime(touchGainRef.current.gain.value, now);
        touchGainRef.current.gain.linearRampToValueAtTime(0.0, now + 0.035);
      }
    }

    if (!osc1Ref.current || !osc2Ref.current || !filterRef.current) return;

    if (p === "sampler_grain") {
      if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      if (lfoGainRef.current) lfoGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      osc1Ref.current.frequency.setTargetAtTime(0, now, 0.01);
      osc2Ref.current.frequency.setTargetAtTime(0, now, 0.01);

      filterRef.current.type = "lowpass";
      filterRef.current.frequency.setTargetAtTime(350 + y * 9500, now, 0.02);
      filterRef.current.Q.setTargetAtTime(2 + x * 8, now, 0.02);

      if (isEngaged && activeSampleSourceRef.current) {
        const rate = 0.35 + Math.pow(y, 1.8) * 3.65;
        activeSampleSourceRef.current.playbackRate.setTargetAtTime(rate, now, 0.02);
      }
    } else if (p === "synth_lead") {
      if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      if (lfoGainRef.current) lfoGainRef.current.gain.setTargetAtTime(0, now, 0.05);

      osc1Ref.current.type = "sawtooth";
      osc2Ref.current.type = "triangle";

      const noteIdx = Math.floor(x * (PENTATONIC_FREQS.length - 1));
      const freq = PENTATONIC_FREQS[Math.min(Math.max(0, noteIdx), PENTATONIC_FREQS.length - 1)];

      osc1Ref.current.frequency.setTargetAtTime(freq, now, 0.015);
      osc2Ref.current.frequency.setTargetAtTime(freq * 1.006, now, 0.015);

      const cutoff = 120 + Math.pow(y, 2.3) * 11000;
      filterRef.current.type = "lowpass";
      filterRef.current.frequency.setTargetAtTime(cutoff, now, 0.02);
      filterRef.current.Q.setTargetAtTime(2 + y * 16, now, 0.02);
    } else if (p === "bass_wobble") {
      if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(0, now, 0.05);

      osc1Ref.current.type = "sawtooth";
      osc2Ref.current.type = "square";

      const baseFreq = 42 + x * 95;
      osc1Ref.current.frequency.setTargetAtTime(baseFreq, now, 0.02);
      osc2Ref.current.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.02);

      const lfoSpeed = 0.5 + Math.pow(y, 2) * 18;
      if (lfoRef.current) lfoRef.current.frequency.setTargetAtTime(lfoSpeed, now, 0.02);
      if (lfoGainRef.current) lfoGainRef.current.gain.setTargetAtTime(700 + y * 3200, now, 0.02);

      filterRef.current.type = "lowpass";
      filterRef.current.frequency.setTargetAtTime(500 + y * 1400, now, 0.02);
      filterRef.current.Q.setTargetAtTime(6 + y * 12, now, 0.02);
    } else if (p === "ambient_space") {
      if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      if (lfoGainRef.current) lfoGainRef.current.gain.setTargetAtTime(0, now, 0.05);

      osc1Ref.current.type = "sine";
      osc2Ref.current.type = "triangle";

      const noteIdx = Math.floor(x * (PENTATONIC_FREQS.length - 1));
      const freq = PENTATONIC_FREQS[Math.min(Math.max(0, noteIdx), PENTATONIC_FREQS.length - 1)];

      osc1Ref.current.frequency.setTargetAtTime(freq, now, 0.03);
      osc2Ref.current.frequency.setTargetAtTime(freq * 1.5, now, 0.03);

      filterRef.current.type = "bandpass";
      filterRef.current.frequency.setTargetAtTime(300 + y * 3500, now, 0.03);
      filterRef.current.Q.setTargetAtTime(3.5, now, 0.03);

      if (delayNodeRef.current && delayFeedbackRef.current && delayGainRef.current) {
        delayNodeRef.current.delayTime.setTargetAtTime(0.15 + (1 - y) * 0.65, now, 0.04);
        delayFeedbackRef.current.gain.setTargetAtTime(0.5 + y * 0.45, now, 0.04);
        delayGainRef.current.gain.setTargetAtTime(0.65, now, 0.04);
      }
    } else if (p === "filter_noise") {
      if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(0.5, now, 0.02);
      if (lfoGainRef.current) lfoGainRef.current.gain.setTargetAtTime(0, now, 0.05);

      osc1Ref.current.type = "triangle";
      osc1Ref.current.frequency.setTargetAtTime(65, now, 0.05);
      osc2Ref.current.frequency.setTargetAtTime(0, now, 0.05);

      const sweep = 120 + Math.pow(x, 2) * 8500;
      filterRef.current.type = "bandpass";
      filterRef.current.frequency.setTargetAtTime(sweep, now, 0.02);
      filterRef.current.Q.setTargetAtTime(2 + y * 24, now, 0.02);
    }
  }, []);

  // Pointer event listeners on Touch Surface
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    initAudio();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isPointerDownRef.current = true;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));

    setTouchPos({ x, y });

    if (programRef.current === "sampler_grain") {
      lastSliceRef.current = Math.floor(x * 16);
      triggerSamplePlayback(x, y, true);
    }
    updateAudioParams(x, y, true);

    trailPointsRef.current.push({ x, y, alpha: 1.0, radius: 32, hue: themeRef.current.trailHue });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Allow dragging when pointer is captured, primary button is pressed, or in HOLD mode
    const isActive = isPointerDownRef.current || e.buttons === 1 || holdingRef.current;
    if (!isActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));

    setTouchPos({ x, y });

    if (programRef.current === "sampler_grain") {
      const slice = Math.floor(x * 16);
      if (slice !== lastSliceRef.current) {
        lastSliceRef.current = slice;
        triggerSamplePlayback(x, y, true);
      }
    }

    updateAudioParams(x, y, true);

    trailPointsRef.current.push({
      x,
      y,
      alpha: 1.0,
      radius: 24,
      hue: (themeRef.current.trailHue + x * 50) % 360,
    });
    if (trailPointsRef.current.length > 45) {
      trailPointsRef.current.shift();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isPointerDownRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (!holdingRef.current) {
      setTouchPos(null);
      updateAudioParams(0, 0, false);
      if (activeSampleSourceRef.current) {
        try {
          activeSampleSourceRef.current.stop((audioCtxRef.current?.currentTime ?? 0) + 0.05);
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1 || holdingRef.current) return;
    handlePointerUp(e);
  };

  // Toggle Hold
  const toggleHold = () => {
    const nextHold = !holding;
    setHolding(nextHold);
    if (!nextHold && !isPointerDownRef.current) {
      setTouchPos(null);
      updateAudioParams(0, 0, false);
      if (activeSampleSourceRef.current) {
        try {
          activeSampleSourceRef.current.stop();
        } catch {
          // ignore
        }
      }
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(nextMute ? 0 : 0.85, audioCtxRef.current.currentTime, 0.02);
    }
  };

  // Tap tempo
  const lastTapRef = useRef<number>(0);
  const handleTapTempo = () => {
    const now = performance.now();
    if (lastTapRef.current > 0) {
      const diff = now - lastTapRef.current;
      if (diff > 250 && diff < 2000) {
        const calculatedBpm = Math.round(60000 / diff);
        setBpm(calculatedBpm);
        if (delayNodeRef.current && audioCtxRef.current) {
          const beatSec = 60 / calculatedBpm;
          delayNodeRef.current.delayTime.setTargetAtTime(beatSec * 0.75, audioCtxRef.current.currentTime, 0.05);
        }
      }
    }
    lastTapRef.current = now;
  };

  // Microphone recording
  const toggleRecordSample = async () => {
    initAudio();
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });

        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          const arrayBuf = await audioBlob.arrayBuffer();

          if (audioCtxRef.current) {
            try {
              const decodedBuf = await audioCtxRef.current.decodeAudioData(arrayBuf);
              sampleBankRef.current[activePadSlotRef.current] = decodedBuf;
              setSampleNames((prev) => {
                const next = [...prev];
                next[activePadSlotRef.current] = `Mic Take #${activePadSlotRef.current + 1}`;
                return next;
              });
            } catch (err) {
              console.error("Audio decoding failed", err);
            }
          }
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied", err);
      }
    }
  };

  // Upload custom file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    initAudio();

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const arrayBuf = ev.target?.result as ArrayBuffer;
      if (arrayBuf && audioCtxRef.current) {
        try {
          const decoded = await audioCtxRef.current.decodeAudioData(arrayBuf);
          sampleBankRef.current[activePadSlotRef.current] = decoded;
          setSampleNames((prev) => {
            const next = [...prev];
            next[activePadSlotRef.current] = file.name.replace(/\.[^/.]+$/, "");
            return next;
          });
        } catch (err) {
          console.error("Failed to decode uploaded audio file", err);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // FX Modulation switch
  const selectModType = (mod: ModType) => {
    setActiveModType(mod);
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (modOscGainRef.current) {
      if (mod === "flanger") {
        modOscGainRef.current.gain.setTargetAtTime(0.0035 * modDepth, now, 0.05);
        if (modOscRef.current) modOscRef.current.frequency.setTargetAtTime(0.6, now, 0.05);
      } else if (mod === "tape_flutter") {
        modOscGainRef.current.gain.setTargetAtTime(0.0015 * modDepth, now, 0.05);
        if (modOscRef.current) modOscRef.current.frequency.setTargetAtTime(4.5, now, 0.05);
      } else {
        modOscGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      }
    }

    if (tremoloDepthGainRef.current) {
      if (mod === "tremolo_slicer") {
        tremoloDepthGainRef.current.gain.setTargetAtTime(0.9 * modDepth, now, 0.05);
        if (tremoloOscRef.current) tremoloOscRef.current.frequency.setTargetAtTime((bpm / 60) * 4, now, 0.05);
      } else {
        tremoloDepthGainRef.current.gain.setTargetAtTime(0, now, 0.05);
      }
    }
  };

  // Canvas 60FPS Reactive Graphics Loop with real-time audio visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;
    const freqData = new Uint8Array(32);

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const curTheme = themeRef.current;

      // Dark theme background
      ctx.fillStyle = curTheme.padBg;
      ctx.fillRect(0, 0, width, height);

      // Real-time audio frequency data
      let audioEnergy = 0;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) {
          sum += freqData[i];
        }
        audioEnergy = sum / (freqData.length * 255);
      }

      // Live Audio Reactive Waves in background
      if (audioEnergy > 0.02) {
        ctx.beginPath();
        for (let i = 0; i < freqData.length; i++) {
          const barHeight = (freqData[i] / 255) * (height * 0.35);
          const x = (width / (freqData.length - 1)) * i;
          const y = height / 2 - barHeight / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `${curTheme.primaryAccent}44`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < freqData.length; i++) {
          const barHeight = (freqData[i] / 255) * (height * 0.35);
          const x = (width / (freqData.length - 1)) * i;
          const y = height / 2 + barHeight / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `${curTheme.secondaryAccent}33`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Aesthetic cyber grid lines
      const gridCols = 10;
      const gridRows = 8;
      ctx.strokeStyle = curTheme.gridLine;
      ctx.lineWidth = 1;

      for (let i = 1; i < gridCols; i++) {
        const gx = (width / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      for (let j = 1; j < gridRows; j++) {
        const gy = (height / gridRows) * j;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Center glowing crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Render colorful sparkling particle trails
      for (let i = trailPointsRef.current.length - 1; i >= 0; i--) {
        const pt = trailPointsRef.current[i];
        pt.alpha -= 0.025;
        pt.radius *= 0.96;

        if (pt.alpha <= 0) {
          trailPointsRef.current.splice(i, 1);
          continue;
        }

        const px = pt.x * width;
        const py = (1 - pt.y) * height;

        ctx.fillStyle = `hsla(${pt.hue}, 90%, 65%, ${pt.alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra cute sparkles on touches
        if (i % 2 === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(px + Math.sin(pt.alpha * 10) * 10, py + Math.cos(pt.alpha * 10) * 10, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Active touch pointer & laser crosshair
      const currentPos = touchPosRef.current;
      if (currentPos) {
        const cx = currentPos.x * width;
        const cy = (1 - currentPos.y) * height;

        // Radial glowing aura
        const auraRadius = 80 + audioEnergy * 60;
        const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, auraRadius);
        grad.addColorStop(0, curTheme.primaryAccent);
        grad.addColorStop(0.35, curTheme.secondaryAccent);
        grad.addColorStop(0.7, `${curTheme.primaryAccent}33`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crosshairs
        ctx.strokeStyle = curTheme.primaryAccent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.stroke();

        // Center jewel
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = curTheme.secondaryAccent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const PROGRAMS: ProgramConfig[] = [
    {
      id: "sampler_grain",
      name: "SAMPLER",
      label: "Touch Sampler",
      badge: "GRAIN",
      xLabel: "Slice / Start Offset",
      yLabel: "Pitch / Playback Rate",
      icon: <Music className="w-4 h-4" />,
    },
    {
      id: "synth_lead",
      name: "LEAD",
      label: "Pentatonic Synth",
      badge: "PENTA",
      xLabel: "Pitch (Pentatonic Scale)",
      yLabel: "Cutoff / Resonance",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "bass_wobble",
      name: "BASS",
      label: "Wobble Sub Bass",
      badge: "SUB",
      xLabel: "Sub Frequency (42-137 Hz)",
      yLabel: "LFO Speed & Drive",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "ambient_space",
      name: "SHIMMER",
      label: "Ambient Space Reverb",
      badge: "CHORD",
      xLabel: "Harmonic Chords",
      yLabel: "Delay Time / Feedback",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "filter_noise",
      name: "NOISE",
      label: "Vinyl / Resonance Sweep",
      badge: "CRUSH",
      xLabel: "Bandpass Sweep",
      yLabel: "Noise Resonance / Q",
      icon: <Flame className="w-4 h-4" />,
    },
  ];

  const currentProgConfig = PROGRAMS.find((p) => p.id === activeProgram) || PROGRAMS[0];

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-gradient-to-br flex flex-col items-center justify-center p-1 sm:p-2.5 select-none overflow-hidden touch-none font-sans transition-colors duration-500",
        theme.bgGradient
      )}
    >
      {/* Main Fullscreen Chassis Container */}
      <div
        className={cn(
          "w-full max-w-[99vw] h-[98vh] border-2 rounded-3xl p-2 sm:p-3 flex flex-col gap-2 shadow-2xl relative transition-all duration-300",
          theme.chassisBg,
          theme.chassisBorder
        )}
      >
        {/* Subtle Decorative Corner Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-white/20 bg-white/10" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-black/50 rounded-2xl border border-white/10 text-xs backdrop-blur-md shadow-inner relative z-30">
          {/* Logo & Synth Info */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
              style={{ backgroundColor: `${theme.primaryAccent}33` }}
            >
              <span className="text-base leading-none select-none">{theme.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-400">
                  ARNPAD
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                  TOUCH SYNTH
                </span>
              </div>
            </div>
          </div>

          {/* Center Info Display Displaying Live Parameter Status */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
              <span className="text-white/50 text-[10px]">PROG:</span>
              <span
                className="font-bold tracking-tight px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  color: theme.primaryAccent,
                  backgroundColor: `${theme.primaryAccent}22`,
                }}
              >
                {currentProgConfig.name}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
              <span className="text-white/50 text-[10px]">SLOT {activePadSlot + 1}:</span>
              <span className="font-semibold text-white/90 truncate max-w-[130px] text-[10px]">
                {sampleNames[activePadSlot]}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="font-bold text-amber-300 text-[11px]">{bpm} BPM</span>
            </div>
          </div>

          {/* Quick Header Utilities */}
          <div className="flex items-center gap-2 relative">
            {/* Theme Picker Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] flex items-center gap-2 transition-all active:scale-95 shadow"
                style={{
                  boxShadow: themeMenuOpen ? `0 0 15px ${theme.glowColor}44` : undefined,
                }}
              >
                <Palette className="w-3.5 h-3.5" style={{ color: theme.primaryAccent }} />
                <span className="hidden sm:inline font-bold">{theme.name}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", themeMenuOpen && "rotate-180")} />
              </button>

              {/* Theme Menu Dropdown Popover */}
              {themeMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-neutral-950/95 border border-white/20 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] font-mono text-white/40 uppercase tracking-wider border-b border-white/10 mb-1">
                    Select Aesthetic Theme
                  </div>
                  {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                    const item = THEMES[tId];
                    const isSelected = currentTheme === tId;
                    return (
                      <button
                        key={tId}
                        onClick={() => {
                          setCurrentTheme(tId);
                          setThemeMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all text-xs font-mono group",
                          isSelected
                            ? "bg-white/15 text-white border border-white/20 font-bold"
                            : "hover:bg-white/10 text-white/70 hover:text-white border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <div className="text-white text-xs leading-none">{item.name}</div>
                            <div className="text-[9px] text-white/40 group-hover:text-white/60">
                              {item.tagline}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: item.primaryAccent }}
                          />
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mute Button */}
            <GlowButton
              size="sm"
              variant={isMuted ? "danger" : "ghost"}
              onClick={toggleMute}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="p-2 h-8 w-8 rounded-xl"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </GlowButton>
          </div>
        </div>

        {/* Central Workspace: Left Icon Column + Main XY Pad + Right Icon Column */}
        <div className="flex-1 flex gap-2 sm:gap-2.5 w-full min-h-0 relative">
          {/* LEFT COLUMN: Programs & Utility Actions (Vertical Icon Stack) */}
          <div className="w-14 sm:w-16 flex flex-col justify-between py-1.5 px-1 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            {/* Program Selection Icons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-center text-white/40 uppercase tracking-tighter">
                PROG
              </span>
              {PROGRAMS.map((prog) => {
                const isSelected = prog.id === activeProgram;
                return (
                  <GlowButton
                    key={prog.id}
                    active={isSelected}
                    glowColor={theme.glowColor}
                    onClick={() => {
                      setActiveProgram(prog.id);
                      if (touchPosRef.current) {
                        updateAudioParams(
                          touchPosRef.current.x,
                          touchPosRef.current.y,
                          holdingRef.current || isPointerDownRef.current
                        );
                      }
                    }}
                    title={`${prog.name}: ${prog.label}`}
                    className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center p-0"
                  >
                    <div
                      style={{
                        color: isSelected ? theme.primaryAccent : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {prog.icon}
                    </div>
                    <span className="text-[8px] font-mono font-bold mt-0.5 tracking-tighter">
                      {prog.badge}
                    </span>
                  </GlowButton>
                );
              })}
            </div>

            {/* Utility Performance Toggles */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              {/* Tap Tempo */}
              <GlowButton
                size="sm"
                variant="amber"
                onClick={handleTapTempo}
                title="Tap Tempo (BPM)"
                className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center p-0"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[8px] font-mono font-bold text-amber-300">TAP</span>
              </GlowButton>

              {/* Hold Toggle */}
              <GlowButton
                size="sm"
                active={holding}
                glowColor={theme.secondaryAccent}
                variant={holding ? "danger" : "ghost"}
                onClick={toggleHold}
                title={`Hold Position: ${holding ? "ON" : "OFF"}`}
                className="w-12 h-11 rounded-2xl flex flex-col items-center justify-center p-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[8px] font-mono font-bold">
                  {holding ? "HOLD" : "FREE"}
                </span>
              </GlowButton>
            </div>
          </div>

          {/* CENTER: Maximized Interactive XY Touch Surface */}
          <div className="flex-1 relative h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black flex flex-col justify-between">
            {/* Top Y Axis Metric Tag */}
            <div className="absolute top-2.5 left-3 right-3 flex justify-between items-center pointer-events-none z-10 text-[10px] font-mono tracking-wider">
              <span className="bg-black/75 px-3 py-1 rounded-full border border-white/15 text-white/90 backdrop-blur-md shadow">
                ▲ Y: {currentProgConfig.yLabel}
              </span>
              {touchPos && (
                <span
                  className="px-3.5 py-1 rounded-full font-bold shadow-lg backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5"
                  style={{
                    backgroundColor: `${theme.primaryAccent}dd`,
                    boxShadow: `0 0 20px ${theme.primaryAccent}88`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  X: {Math.round(touchPos.x * 100)}% | Y: {Math.round(touchPos.y * 100)}%
                </span>
              )}
            </div>

            {/* Canvas Surface with Pointer Events */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="absolute inset-0 cursor-crosshair touch-none select-none"
            >
              <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
            </div>

            {/* Bottom X Axis Metric Tag */}
            <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center pointer-events-none z-10 text-[10px] font-mono tracking-wider">
              <span className="bg-black/75 px-3 py-1 rounded-full border border-white/15 text-white/90 backdrop-blur-md shadow">
                ◄ X: {currentProgConfig.xLabel} ►
              </span>
              <span className="bg-black/75 px-3 py-1 rounded-full border border-white/15 text-white/60 backdrop-blur-md hidden sm:inline">
                Touch & drag across pad to modulate synthesis
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Sampler Pads & FX Modulation (Vertical Icon Stack) */}
          <div className="w-14 sm:w-16 flex flex-col justify-between py-1.5 px-1 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            {/* Sample Pad Selectors (1 to 4) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-center uppercase tracking-tighter" style={{ color: theme.primaryAccent }}>
                PADS
              </span>
              {[0, 1, 2, 3].map((slot) => {
                const isSelected = activePadSlot === slot;
                return (
                  <GlowButton
                    key={slot}
                    active={isSelected}
                    glowColor={theme.primaryAccent}
                    onClick={() => setActivePadSlot(slot)}
                    title={`Select Sample ${slot + 1}: ${sampleNames[slot]}`}
                    className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center p-0"
                  >
                    <Disc className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-mono font-bold">P{slot + 1}</span>
                  </GlowButton>
                );
              })}

              {/* Sample Mic Recording Button */}
              <GlowButton
                size="sm"
                active={isRecording}
                variant={isRecording ? "danger" : "ghost"}
                onClick={toggleRecordSample}
                title={isRecording ? "Stop Recording" : "Record Mic into active slot"}
                className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center p-0"
              >
                {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="text-[8px] font-mono font-bold">
                  {isRecording ? "STOP" : "REC"}
                </span>
              </GlowButton>

              {/* Sample File Upload Button */}
              <label
                title="Load Audio File into active slot"
                className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center transition-all border bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer active:scale-95 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[8px] font-mono font-bold">FILE</span>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* FX Modulation Switchers (Flanger, Slicer, Tape) */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <span className="text-[9px] font-mono text-center uppercase tracking-tighter" style={{ color: theme.secondaryAccent }}>
                FX MOD
              </span>
              {[
                { id: "off", icon: <Sliders className="w-3 h-3" />, label: "OFF" },
                { id: "flanger", icon: <Waves className="w-3 h-3" />, label: "FLNG" },
                { id: "tremolo_slicer", icon: <Repeat className="w-3 h-3" />, label: "SLC" },
                { id: "tape_flutter", icon: <Layers className="w-3 h-3" />, label: "TAPE" },
              ].map((fx) => {
                const isActive = activeModType === fx.id;
                return (
                  <GlowButton
                    key={fx.id}
                    active={isActive}
                    glowColor={theme.secondaryAccent}
                    onClick={() => selectModType(fx.id as ModType)}
                    title={`Mod FX: ${fx.label}`}
                    className="w-12 h-9 rounded-2xl flex flex-col items-center justify-center p-0"
                  >
                    {fx.icon}
                    <span className="text-[8px] font-mono font-bold">{fx.label}</span>
                  </GlowButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Status Footer Bar */}
        <div className="flex items-center justify-between px-3 text-[10px] font-mono text-white/50 bg-black/40 rounded-xl py-1 border border-white/5">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: theme.primaryAccent }}
            />
            <span className="truncate">REALTIME WEB AUDIO TOUCH SAMPLER & MULTI-FX</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">THEME: {theme.name.toUpperCase()}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              MULTI-TOUCH READY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
