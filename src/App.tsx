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
} from "lucide-react";

// Themes: Unicorn Sparkle, Cyber Kitty, Sunset Marshmallow
type ThemeId = "unicorn" | "cyberkitty" | "marshmallow";

interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  bgGradient: string;
  chassisBg: string;
  chassisBorder: string;
  padBg: string;
  gridLine: string;
  primaryAccent: string;
  secondaryAccent: string;
  glowColor: string;
  btnActive: string;
  btnInactive: string;
  textColor: string;
  trailHue: number;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  unicorn: {
    id: "unicorn",
    name: "Unicorn Sparkle",
    icon: "🦄",
    bgGradient: "from-pink-900/40 via-purple-950/60 to-indigo-950",
    chassisBg: "bg-slate-950/90 backdrop-blur-md",
    chassisBorder: "border-pink-400/40 shadow-[0_0_40px_rgba(244,114,182,0.25)]",
    padBg: "#120a1f",
    gridLine: "rgba(244, 114, 182, 0.15)",
    primaryAccent: "#f472b6", // pink-400
    secondaryAccent: "#c084fc", // purple-400
    glowColor: "#f472b6",
    btnActive: "bg-pink-500 text-white shadow-[0_0_15px_rgba(244,114,182,0.8)] border-pink-300",
    btnInactive: "bg-purple-950/40 text-pink-300 hover:bg-pink-900/40 border-pink-900/50",
    textColor: "text-pink-200",
    trailHue: 320,
  },
  cyberkitty: {
    id: "cyberkitty",
    name: "Cyber Kitty",
    icon: "🐱",
    bgGradient: "from-cyan-950/40 via-emerald-950/40 to-slate-950",
    chassisBg: "bg-neutral-950/90 backdrop-blur-md",
    chassisBorder: "border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.25)]",
    padBg: "#05161c",
    gridLine: "rgba(34, 211, 238, 0.15)",
    primaryAccent: "#22d3ee", // cyan-400
    secondaryAccent: "#34d399", // emerald-400
    glowColor: "#22d3ee",
    btnActive: "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.8)] border-cyan-200",
    btnInactive: "bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 border-cyan-900/50",
    textColor: "text-cyan-200",
    trailHue: 185,
  },
  marshmallow: {
    id: "marshmallow",
    name: "Sunset Peach",
    icon: "🍑",
    bgGradient: "from-amber-950/40 via-rose-950/40 to-neutral-950",
    chassisBg: "bg-stone-950/90 backdrop-blur-md",
    chassisBorder: "border-amber-400/40 shadow-[0_0_40px_rgba(251,191,36,0.25)]",
    padBg: "#190f0c",
    gridLine: "rgba(251, 146, 60, 0.15)",
    primaryAccent: "#fb923c", // orange-400
    secondaryAccent: "#f43f5e", // rose-500
    glowColor: "#fb923c",
    btnActive: "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_0_15px_rgba(251,146,60,0.8)] border-amber-200",
    btnInactive: "bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 border-amber-900/50",
    textColor: "text-amber-200",
    trailHue: 28,
  },
};

type ProgramMode = "sampler_grain" | "synth_lead" | "bass_wobble" | "ambient_space" | "filter_noise";
type ModType = "off" | "flanger" | "tremolo_slicer" | "tape_flutter";

interface ProgramConfig {
  id: ProgramMode;
  name: string;
  label: string;
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
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("unicorn");
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
    "Sparkle Chime",
    "Kitty Sub Drop",
    "Candy Rim Break",
    "Cloud Stab",
  ]);

  // Audio Context and Node Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const touchGainRef = useRef<GainNode | null>(null);
  
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

  touchPosRef.current = touchPos;
  holdingRef.current = holding;
  programRef.current = activeProgram;
  isMutedRef.current = isMuted;
  activePadSlotRef.current = activePadSlot;
  themeRef.current = theme;

  // Synthesize factory cute preset audio buffers
  const generateFactoryPresets = useCallback((ctx: AudioContext) => {
    const sRate = ctx.sampleRate;

    // Slot 0: Sparkle Chime / Bell Hit
    const dur0 = 1.6;
    const buf0 = ctx.createBuffer(1, Math.floor(sRate * dur0), sRate);
    const data0 = buf0.getChannelData(0);
    for (let i = 0; i < data0.length; i++) {
      const t = i / sRate;
      const b1 = Math.sin(2 * Math.PI * 523.25 * t) * 0.4;
      const b2 = Math.sin(2 * Math.PI * 1046.5 * t) * 0.3;
      const b3 = Math.sin(2 * Math.PI * 1567.98 * t) * 0.2;
      const b4 = Math.sin(2 * Math.PI * 2093.0 * t) * 0.1;
      const shimmer = Math.sin(t * 30) * 0.1;
      const env = Math.exp(-t * 2.5);
      data0[i] = (b1 + b2 + b3 + b4 + shimmer) * env;
    }
    sampleBankRef.current[0] = buf0;

    // Slot 1: Cute Sub Kitty Drop
    const dur1 = 1.0;
    const buf1 = ctx.createBuffer(1, Math.floor(sRate * dur1), sRate);
    const data1 = buf1.getChannelData(0);
    for (let i = 0; i < data1.length; i++) {
      const t = i / sRate;
      const freq = 135 * Math.exp(-t * 12) + 42;
      const env = Math.exp(-t * 3.2);
      data1[i] = Math.sin(2 * Math.PI * freq * t) * env;
    }
    sampleBankRef.current[1] = buf1;

    // Slot 2: Sweet Candy Rim Percussion
    const dur2 = 0.7;
    const buf2 = ctx.createBuffer(1, Math.floor(sRate * dur2), sRate);
    const data2 = buf2.getChannelData(0);
    for (let i = 0; i < data2.length; i++) {
      const t = i / sRate;
      const tonal = Math.sin(2 * Math.PI * 880 * t) * 0.4 + Math.sin(2 * Math.PI * 1760 * t) * 0.2;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 30);
      const env = Math.exp(-t * 8);
      data2[i] = (tonal + noise) * env;
    }
    sampleBankRef.current[2] = buf2;

    // Slot 3: Dreamy Cloud Stab (Major 7th)
    const dur3 = 1.8;
    const buf3 = ctx.createBuffer(1, Math.floor(sRate * dur3), sRate);
    const data3 = buf3.getChannelData(0);
    for (let i = 0; i < data3.length; i++) {
      const t = i / sRate;
      const c = Math.sin(2 * Math.PI * 329.63 * t);
      const e = Math.sin(2 * Math.PI * 392.0 * t);
      const g = Math.sin(2 * Math.PI * 493.88 * t);
      const b = Math.sin(2 * Math.PI * 587.33 * t);
      const env = Math.exp(-t * 2.0);
      data3[i] = (c + e + g + b) * 0.22 * env;
    }
    sampleBankRef.current[3] = buf3;
  }, []);

  // Initialize Web Audio graph
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    generateFactoryPresets(ctx);

    // Master
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMutedRef.current ? 0 : 0.85, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Touch Gate
    const touchGain = ctx.createGain();
    touchGain.gain.setValueAtTime(0, ctx.currentTime);
    touchGain.connect(masterGain);
    touchGainRef.current = touchGain;

    // Filter
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

    if (touchGainRef.current) {
      if (isEngaged) {
        touchGainRef.current.gain.cancelScheduledValues(now);
        touchGainRef.current.gain.setTargetAtTime(0.8, now, 0.02);
      } else {
        touchGainRef.current.gain.cancelScheduledValues(now);
        touchGainRef.current.gain.setTargetAtTime(0, now, 0.05);
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
    initAudio();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));

    setTouchPos({ x, y });

    if (programRef.current === "sampler_grain") {
      triggerSamplePlayback(x, y, true);
    }
    updateAudioParams(x, y, true);

    trailPointsRef.current.push({ x, y, alpha: 1.0, radius: 30, hue: themeRef.current.trailHue });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));

    setTouchPos({ x, y });
    updateAudioParams(x, y, true);

    trailPointsRef.current.push({
      x,
      y,
      alpha: 1.0,
      radius: 22,
      hue: (themeRef.current.trailHue + x * 60) % 360,
    });
    if (trailPointsRef.current.length > 40) {
      trailPointsRef.current.shift();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!holdingRef.current) {
      setTouchPos(null);
      if (touchPosRef.current) {
        updateAudioParams(touchPosRef.current.x, touchPosRef.current.y, false);
      }
      if (activeSampleSourceRef.current) {
        try {
          activeSampleSourceRef.current.stop((audioCtxRef.current?.currentTime ?? 0) + 0.05);
        } catch {
          // ignore
        }
      }
    }
  };

  // Switch Themes
  const cycleTheme = () => {
    const keys: ThemeId[] = ["unicorn", "cyberkitty", "marshmallow"];
    const nextIdx = (keys.indexOf(currentTheme) + 1) % keys.length;
    setCurrentTheme(keys[nextIdx]);
  };

  // Toggle Hold
  const toggleHold = () => {
    const nextHold = !holding;
    setHolding(nextHold);
    if (!nextHold && !touchPos) {
      if (touchPosRef.current) {
        updateAudioParams(touchPosRef.current.x, touchPosRef.current.y, false);
      }
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

  // Canvas 60FPS Reactive Graphics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
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
        pt.alpha -= 0.03;
        pt.radius *= 0.96;

        if (pt.alpha <= 0) {
          trailPointsRef.current.splice(i, 1);
          continue;
        }

        const px = pt.x * width;
        const py = (1 - pt.y) * height;

        ctx.fillStyle = `hsla(${pt.hue}, 90%, 65%, ${pt.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra cute sparkles on touches
        if (i % 2 === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(px + Math.sin(pt.alpha * 10) * 8, py + Math.cos(pt.alpha * 10) * 8, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Active touch pointer & laser crosshair
      const currentPos = touchPosRef.current;
      if (currentPos) {
        const cx = currentPos.x * width;
        const cy = (1 - currentPos.y) * height;

        // Radial glowing aura
        const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 90);
        grad.addColorStop(0, curTheme.primaryAccent);
        grad.addColorStop(0.3, curTheme.secondaryAccent);
        grad.addColorStop(0.7, `${curTheme.primaryAccent}33`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 90, 0, Math.PI * 2);
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
      xLabel: "Slice / Start Offset",
      yLabel: "Pitch / Playback Rate",
      icon: <Music className="w-5 h-5" />,
    },
    {
      id: "synth_lead",
      name: "LEAD",
      label: "Pentatonic Synth",
      xLabel: "Pitch (Pentatonic)",
      yLabel: "Cutoff / Resonance",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "bass_wobble",
      name: "BASS",
      label: "Wobble Sub",
      xLabel: "Sub Note Frequency",
      yLabel: "LFO Speed & Drive",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: "ambient_space",
      name: "SHIMMER",
      label: "Space Reverb",
      xLabel: "Chords / Harmonic Pitch",
      yLabel: "Delay Time / Feedback",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: "filter_noise",
      name: "NOISE",
      label: "Vinyl / Resonance",
      xLabel: "Bandpass Sweep",
      yLabel: "Noise Crush / Resonance",
      icon: <Flame className="w-5 h-5" />,
    },
  ];

  const currentProgConfig = PROGRAMS.find((p) => p.id === activeProgram) || PROGRAMS[0];

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bgGradient} flex flex-col items-center justify-center p-1 sm:p-2 select-none overflow-hidden touch-none font-sans`}>
      {/* Main Fullscreen Chassis Container */}
      <div className={`w-full max-w-[99vw] h-[98vh] ${theme.chassisBg} border-2 ${theme.chassisBorder} rounded-3xl p-2 sm:p-3 flex flex-col gap-1.5 shadow-2xl relative transition-all duration-300`}>
        
        {/* Compact Title Bar (<40px) */}
        <div className="flex items-center justify-between px-3 py-1 bg-black/40 rounded-xl border border-white/10 text-xs backdrop-blur-sm">
          {/* Logo & Current Theme Badge */}
          <div className="flex items-center gap-2">
            <span className="text-base select-none">{theme.icon}</span>
            <span className="font-black tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-400">
              CHAOSPAD
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 hidden sm:inline">
              TOUCH FX
            </span>
          </div>

          {/* Center Info Display */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-white/70">PROG:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-white/15">
              {currentProgConfig.name}
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/70 hidden sm:inline">SAMPLE:</span>
            <span className="font-semibold text-white/90 hidden sm:inline truncate max-w-[120px]">
              {sampleNames[activePadSlot]}
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="font-bold text-amber-300">{bpm} BPM</span>
          </div>

          {/* Quick Header Utilities */}
          <div className="flex items-center gap-1.5">
            {/* Theme Picker Button */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${theme.name} (Click to switch)`}
              className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow"
            >
              <Palette className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline font-bold">{theme.name}</span>
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className={`p-1.5 rounded-lg border transition-all ${
                isMuted
                  ? "bg-red-600/80 border-red-400 text-white animate-pulse"
                  : "bg-white/10 border-white/15 text-white/80 hover:text-white"
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Central Workspace: Left Icon Column + Main XY Pad + Right Icon Column */}
        <div className="flex-1 flex gap-2 w-full min-h-0 relative">
          
          {/* LEFT COLUMN: Programs & Utility Actions (Vertical Icon Stack) */}
          <div className="w-14 sm:w-16 flex flex-col justify-between py-1 px-1 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md">
            
            {/* Program Selection Icons */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-center text-white/40 uppercase tracking-tighter">
                PROG
              </span>
              {PROGRAMS.map((prog) => {
                const isSelected = prog.id === activeProgram;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setActiveProgram(prog.id);
                      if (touchPosRef.current) {
                        updateAudioParams(touchPosRef.current.x, touchPosRef.current.y, holdingRef.current || !!touchPos);
                      }
                    }}
                    title={`${prog.name}: ${prog.label}`}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all border ${
                      isSelected
                        ? theme.btnActive
                        : theme.btnInactive
                    }`}
                  >
                    {prog.icon}
                    <span className="text-[8px] font-mono font-bold mt-0.5 tracking-tighter">
                      {prog.name.slice(0, 4)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Utility Performance Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              {/* Tap Tempo */}
              <button
                onClick={handleTapTempo}
                title="Tap Tempo"
                className="w-12 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 flex flex-col items-center justify-center transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-[8px] font-mono font-bold">TAP</span>
              </button>

              {/* Hold Toggle */}
              <button
                onClick={toggleHold}
                title={`Hold Position: ${holding ? "ON" : "OFF"}`}
                className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  holding
                    ? "bg-red-500 text-white border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse"
                    : "bg-white/10 text-white/60 border-white/15 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[8px] font-mono font-bold">{holding ? "HOLD" : "FREE"}</span>
              </button>
            </div>
          </div>

          {/* CENTER: Maximized Interactive XY Touch Surface */}
          <div className="flex-1 relative h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner bg-black flex flex-col justify-between">
            
            {/* Top Y Axis Metric Tag */}
            <div className="absolute top-2.5 left-3 right-3 flex justify-between items-center pointer-events-none z-10 text-[10px] font-mono tracking-wider">
              <span className="bg-black/70 px-2.5 py-1 rounded-full border border-white/15 text-white/80 backdrop-blur-md shadow">
                ▲ Y: {currentProgConfig.yLabel}
              </span>
              {touchPos && (
                <span
                  className="px-3 py-1 rounded-full font-bold shadow-lg backdrop-blur-md border border-white/20 text-white"
                  style={{ backgroundColor: `${theme.primaryAccent}cc` }}
                >
                  X: {Math.round(touchPos.x * 100)}% | Y: {Math.round(touchPos.y * 100)}%
                </span>
              )}
            </div>

            {/* Canvas Surface with Pointer Events */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 cursor-crosshair touch-none select-none"
            >
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Bottom X Axis Metric Tag */}
            <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center pointer-events-none z-10 text-[10px] font-mono tracking-wider">
              <span className="bg-black/70 px-2.5 py-1 rounded-full border border-white/15 text-white/80 backdrop-blur-md shadow">
                ◄ X: {currentProgConfig.xLabel} ►
              </span>
              <span className="bg-black/70 px-2.5 py-1 rounded-full border border-white/15 text-white/50 backdrop-blur-md hidden sm:inline">
                Touch & drag across pad to modulate
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Sampler Pads & FX Modulation (Vertical Icon Stack) */}
          <div className="w-14 sm:w-16 flex flex-col justify-between py-1 px-1 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md">
            
            {/* Sample Pad Selectors (1 to 4) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-center text-pink-300 uppercase tracking-tighter">
                PADS
              </span>
              {[0, 1, 2, 3].map((slot) => {
                const isSelected = activePadSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setActivePadSlot(slot)}
                    title={`Select Sample ${slot + 1}: ${sampleNames[slot]}`}
                    className={`w-12 h-10 rounded-xl flex flex-col items-center justify-center transition-all border ${
                      isSelected
                        ? "bg-pink-500 text-white font-bold border-pink-200 shadow-[0_0_12px_rgba(244,114,182,0.8)]"
                        : "bg-pink-950/20 text-pink-300/80 hover:bg-pink-900/30 border-pink-900/40"
                    }`}
                  >
                    <Disc className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-mono font-bold">P{slot + 1}</span>
                  </button>
                );
              })}

              {/* Sample Mic Recording Button */}
              <button
                onClick={toggleRecordSample}
                title={isRecording ? "Stop Recording" : "Record Mic into active slot"}
                className={`w-12 h-10 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  isRecording
                    ? "bg-red-600 border-red-300 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.9)]"
                    : "bg-red-950/30 border-red-800/40 text-red-400 hover:bg-red-900/40"
                }`}
              >
                {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="text-[8px] font-mono font-bold">{isRecording ? "STOP" : "REC"}</span>
              </button>

              {/* Sample File Upload */}
              <label
                title="Load Audio File into active slot"
                className="w-12 h-10 rounded-xl flex flex-col items-center justify-center transition-all border bg-white/10 border-white/15 text-white/70 hover:text-white cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[8px] font-mono font-bold">FILE</span>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* FX Modulation Switchers (Flanger, Slicer, Tape) */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <span className="text-[9px] font-mono text-center text-cyan-300 uppercase tracking-tighter">
                FX MOD
              </span>
              {[
                { id: "off", icon: <Sliders className="w-3.5 h-3.5" />, label: "OFF" },
                { id: "flanger", icon: <Waves className="w-3.5 h-3.5" />, label: "FLNG" },
                { id: "tremolo_slicer", icon: <Repeat className="w-3.5 h-3.5" />, label: "SLC" },
                { id: "tape_flutter", icon: <Layers className="w-3.5 h-3.5" />, label: "TAPE" },
              ].map((fx) => {
                const isActive = activeModType === fx.id;
                return (
                  <button
                    key={fx.id}
                    onClick={() => selectModType(fx.id as ModType)}
                    title={`Mod FX: ${fx.label}`}
                    className={`w-12 h-9 rounded-xl flex flex-col items-center justify-center transition-all border ${
                      isActive
                        ? "bg-cyan-500 text-black font-bold border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                        : "bg-cyan-950/20 text-cyan-300/70 hover:bg-cyan-900/30 border-cyan-900/40"
                    }`}
                  >
                    {fx.icon}
                    <span className="text-[8px] font-mono font-bold">{fx.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ultra-slim Bottom Status Footer (<24px) */}
        <div className="flex items-center justify-between px-3 text-[10px] font-mono text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate">REALTIME WEB AUDIO TOUCH SAMPLER & MULTI-FX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">THEME: {theme.name.toUpperCase()}</span>
            <span>MULTI-TOUCH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
