import React from "react";
import { cn, type ThemeStyle } from "./TactileButton";
import { Disc, Radio, Orbit, Activity, Shield, Sparkles } from "lucide-react";

export interface TactilePadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  padNumber: number;
  sampleName?: string;
  glowColor?: string;
  themeStyle?: ThemeStyle;
}

export default function TactilePad({
  active = false,
  padNumber,
  sampleName,
  glowColor = "#f472b6",
  themeStyle = "bubble_jelly",
  className,
  ...props
}: TactilePadProps) {
  // Shape & outer styling per theme
  const getOuterStyles = () => {
    switch (themeStyle) {
      case "cyber_hex":
        return cn(
          "rounded-md bg-black/90 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]",
          active && "border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
        );
      case "retro_studio":
        return cn(
          "rounded-xl bg-[#1b0d06] border border-amber-600/30 shadow-[0_3px_0_#2b1205,0_5px_8px_rgba(0,0,0,0.8)]",
          active && "border-amber-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]"
        );
      case "celestial_glass":
        return cn(
          "rounded-full bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_4px_16px_rgba(192,170,253,0.2)]",
          active && "border-purple-300/60 shadow-[0_0_24px_rgba(192,170,253,0.5)]"
        );
      case "neon_laser":
        return cn(
          "rounded-lg bg-black border-2 border-[#ff00c8]/60 shadow-[0_0_15px_rgba(255,0,200,0.4)]",
          active && "border-[#ff00c8] shadow-[0_0_25px_#ff00c8]"
        );
      case "unicorn_sparkle":
        return cn(
          "rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-400/40 shadow-[0_0_15px_rgba(244,114,182,0.35)]",
          active && "border-pink-300 shadow-[0_0_25px_rgba(244,114,182,0.7)]"
        );
      case "bubble_jelly":
      default:
        return cn(
          "rounded-full bg-black/85 border border-pink-400/30 shadow-[0_2px_12px_rgba(255,126,165,0.25)]",
          active && "border-pink-400/80 shadow-[0_0_22px_rgba(255,126,165,0.6)]"
        );
    }
  };

  const getInnerStyles = () => {
    switch (themeStyle) {
      case "cyber_hex":
        return cn(
          "rounded-sm transition-all duration-100",
          !active && "bg-neutral-950 text-cyan-300 border border-cyan-900/50 hover:border-cyan-400 hover:text-white active:translate-y-0.5",
          active && "bg-cyan-500 text-black font-black border border-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
        );
      case "retro_studio":
        return cn(
          "rounded-lg transition-all duration-150",
          !active && "bg-gradient-to-b from-neutral-800 to-neutral-950 text-amber-100 border border-neutral-700/60 hover:brightness-120 active:translate-y-[2px]",
          active && "bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 text-white border-amber-300 shadow-[0_0_22px_rgba(251,146,60,0.7)]"
        );
      case "celestial_glass":
        return cn(
          "rounded-full backdrop-blur-md transition-all duration-200",
          !active && "bg-white/10 text-purple-100 border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95",
          active && "bg-white/30 text-white font-bold border-purple-200 shadow-[0_0_25px_rgba(192,170,253,0.8)]"
        );
      case "neon_laser":
        return cn(
          "rounded-md transition-all duration-100",
          !active && "bg-black text-pink-300 border border-[#ff00c8]/40 hover:text-white hover:border-[#ff00c8] active:scale-95",
          active && "bg-[#ff00c8] text-white shadow-[0_0_25px_#ff00c8,inset_0_0_10px_rgba(255,255,255,0.6)]"
        );
      case "unicorn_sparkle":
        return cn(
          "rounded-full transition-all duration-150",
          !active && "bg-slate-950/80 text-pink-200 border border-purple-500/30 hover:border-pink-400 active:scale-95",
          active && "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_25px_rgba(244,114,182,0.8)]"
        );
      case "bubble_jelly":
      default:
        return cn(
          "rounded-full transition-transform duration-150 ease-out hover:scale-105 active:scale-95",
          !active && "bg-gradient-to-b from-pink-950/40 via-neutral-900 to-black text-pink-200 border border-pink-500/20 hover:brightness-125",
          active && "bg-gradient-to-b from-pink-500 via-rose-600 to-purple-900 text-white font-bold border-pink-200 shadow-[0_0_22px_rgba(255,126,165,0.75)]"
        );
    }
  };

  // Icon per theme
  const renderThemeIcon = () => {
    switch (themeStyle) {
      case "cyber_hex":
        return (
          <Radio
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
              active ? "scale-110 text-black animate-pulse" : "opacity-45 text-cyan-400 group-hover:opacity-90"
            )}
          />
        );
      case "retro_studio":
        return (
          <Activity
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
              active ? "scale-110 text-white animate-pulse" : "opacity-45 text-amber-400 group-hover:opacity-90"
            )}
          />
        );
      case "celestial_glass":
        return (
          <Orbit
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500",
              active ? "scale-110 text-white animate-[spin_8s_linear_infinite]" : "opacity-45 text-purple-300 group-hover:opacity-90"
            )}
          />
        );
      case "neon_laser":
        return (
          <Shield
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200",
              active ? "scale-110 text-white animate-pulse" : "opacity-45 text-pink-400 group-hover:opacity-90"
            )}
          />
        );
      case "unicorn_sparkle":
        return (
          <Sparkles
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
              active ? "scale-110 text-white animate-[spin_6s_linear_infinite]" : "opacity-45 text-pink-300 group-hover:opacity-90"
            )}
          />
        );
      case "bubble_jelly":
      default:
        return (
          <Disc
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
              active
                ? "scale-110 text-white drop-shadow-[0_0_10px_currentColor] animate-[spin_6s_linear_infinite]"
                : "opacity-45 text-neutral-400 group-hover:opacity-85 group-hover:scale-105"
            )}
            style={active ? { color: glowColor } : undefined}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "relative group p-0.5 flex items-center justify-center transition-transform hover:scale-[1.03]",
        getOuterStyles()
      )}
    >
      <button
        className={cn(
          "relative w-full h-full cursor-pointer select-none outline-none flex items-center justify-center overflow-hidden p-0 aspect-square",
          getInnerStyles(),
          className
        )}
        title={sampleName ? `Slot ${padNumber}: ${sampleName}` : `Slot ${padNumber}`}
        {...props}
      >
        {/* Theme Icon */}
        <div className="relative flex items-center justify-center pointer-events-none">
          {renderThemeIcon()}
          {/* Subtle center core jewel */}
          <div
            className={cn(
              "absolute w-1.5 h-1.5 rounded-full transition-all duration-300",
              active ? "bg-white scale-125 shadow-[0_0_8px_#ffffff]" : "bg-neutral-600 opacity-60"
            )}
          />
        </div>

        {/* LED Indicator */}
        <div className="absolute top-1 pointer-events-none flex items-center justify-center">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300 border border-black/50",
              active ? "scale-125 animate-pulse" : "opacity-30 bg-neutral-600"
            )}
            style={
              active
                ? {
                    backgroundColor: glowColor,
                    boxShadow: `0 0 8px ${glowColor}, 0 0 2px #ffffff`,
                  }
                : undefined
            }
          />
        </div>
      </button>
    </div>
  );
}
