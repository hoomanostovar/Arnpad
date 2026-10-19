import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ThemeStyle =
  | "bubble_jelly"
  | "cyber_hex"
  | "retro_studio"
  | "celestial_glass"
  | "neon_laser"
  | "unicorn_sparkle";

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  glowColor?: string;
  ledColor?: string;
  themeStyle?: ThemeStyle;
  icon?: React.ReactNode;
  symbol?: string;
  label?: string;
  sublabel?: string;
  badge?: string;
  variant?: "synth" | "pad" | "record" | "amber" | "toggle" | "danger";
  size?: "sm" | "md" | "lg" | "pad" | "icon" | "round";
  rounded?: "default" | "full" | "xl";
  children?: React.ReactNode;
}

export default function TactileButton({
  active = false,
  glowColor,
  ledColor,
  themeStyle = "bubble_jelly",
  icon,
  symbol,
  label,
  sublabel,
  badge,
  variant = "synth",
  size = "md",
  rounded = "default",
  className,
  children,
  ...props
}: TactileButtonProps) {
  const effectiveGlow = glowColor || (active ? "#f472b6" : "rgba(255,255,255,0.2)");
  const effectiveLed = ledColor || (active ? (glowColor || "#34d399") : "rgba(255,255,255,0.15)");

  // Dynamic geometry per theme
  const getRounding = () => {
    if (rounded === "full") return "rounded-full";
    if (themeStyle === "cyber_hex") return "rounded-md";
    if (themeStyle === "retro_studio") return "rounded-xl";
    if (themeStyle === "neon_laser") return "rounded-lg";
    return "rounded-2xl";
  };

  const roundingClass = getRounding();

  // Outer bezel container per theme
  const getOuterThemeStyles = () => {
    switch (themeStyle) {
      case "cyber_hex":
        return cn(
          "bg-black/90 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]",
          active && "border-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.5)]"
        );
      case "retro_studio":
        return cn(
          "bg-[#1c0f08] border border-amber-600/30 shadow-[0_3px_0_#2b1205,0_5px_8px_rgba(0,0,0,0.8)]",
          active && "border-amber-400 shadow-[0_2px_0_#2b1205,0_0_15px_rgba(251,146,60,0.4)]"
        );
      case "celestial_glass":
        return cn(
          "bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_4px_16px_rgba(192,170,253,0.18)]",
          active && "border-purple-300/60 shadow-[0_0_20px_rgba(192,170,253,0.4)]"
        );
      case "neon_laser":
        return cn(
          "bg-black border-2 border-[#ff00c8]/60 shadow-[0_0_12px_rgba(255,0,200,0.4)]",
          active && "border-[#ff00c8] shadow-[0_0_22px_#ff00c8]"
        );
      case "unicorn_sparkle":
        return cn(
          "bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-400/40 shadow-[0_0_15px_rgba(244,114,182,0.35)]",
          active && "border-pink-300 shadow-[0_0_24px_rgba(244,114,182,0.6)]"
        );
      case "bubble_jelly":
      default:
        return cn(
          "bg-black/80 border border-pink-400/30 shadow-[0_2px_10px_rgba(255,126,165,0.2)]",
          active && "border-pink-400/80 shadow-[0_0_20px_rgba(255,126,165,0.5)]"
        );
    }
  };

  // Inner tactile button style per theme
  const getInnerThemeStyles = () => {
    switch (themeStyle) {
      case "cyber_hex":
        return cn(
          "font-mono transition-all duration-100",
          !active && "bg-neutral-950 text-cyan-200 border border-cyan-900/50 hover:border-cyan-400 hover:text-white active:translate-y-0.5",
          active && "bg-cyan-500 text-black font-black border border-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
        );
      case "retro_studio":
        return cn(
          "transition-all duration-150",
          !active && "bg-gradient-to-b from-neutral-800 to-neutral-950 text-amber-100 border border-neutral-700/60 hover:brightness-120 active:translate-y-[2px]",
          active && "bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 text-white border-amber-300 shadow-[0_0_20px_rgba(251,146,60,0.6)]"
        );
      case "celestial_glass":
        return cn(
          "backdrop-blur-md transition-all duration-200",
          !active && "bg-white/10 text-purple-100 border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95",
          active && "bg-white/30 text-white font-bold border-purple-200 shadow-[0_0_22px_rgba(192,170,253,0.7)]"
        );
      case "neon_laser":
        return cn(
          "transition-all duration-100 uppercase font-black",
          !active && "bg-black text-pink-300 border border-[#ff00c8]/40 hover:text-white hover:border-[#ff00c8] active:scale-95",
          active && "bg-[#ff00c8] text-white shadow-[0_0_25px_#ff00c8,inset_0_0_10px_rgba(255,255,255,0.6)]"
        );
      case "unicorn_sparkle":
        return cn(
          "transition-all duration-150",
          !active && "bg-slate-950/80 text-pink-200 border border-purple-500/30 hover:border-pink-400 active:scale-95",
          active && "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_22px_rgba(244,114,182,0.8)]"
        );
      case "bubble_jelly":
      default:
        return cn(
          "transition-transform duration-150 ease-out hover:scale-110 active:scale-90",
          !active && "bg-gradient-to-b from-pink-950/40 via-neutral-900 to-black text-pink-200 border border-pink-500/20 hover:brightness-125",
          active && "bg-gradient-to-b from-pink-500 via-rose-600 to-purple-900 text-white font-bold border-pink-200 shadow-[0_0_20px_rgba(255,126,165,0.7)]"
        );
    }
  };

  return (
    <div
      className={cn(
        "relative group p-0.5 flex items-center justify-center transition-all",
        roundingClass,
        getOuterThemeStyles()
      )}
    >
      <button
        className={cn(
          "relative w-full cursor-pointer select-none outline-none flex items-center justify-center overflow-hidden p-0",
          roundingClass,
          // Sizing classes
          size === "sm" && "h-8 px-2 text-[10px]",
          size === "md" && "h-11 px-3 text-xs",
          size === "round" && "w-11 h-11 sm:w-12 sm:h-12 p-0 aspect-square",
          size === "pad" && "h-12 w-full px-1.5 flex-col justify-between py-1",
          size === "icon" && "w-11 h-11 p-0 aspect-square",
          getInnerThemeStyles(),
          variant === "record" && active && [
            "!bg-gradient-to-b !from-rose-600 !via-rose-700 !to-rose-950 !text-white animate-pulse",
            "!shadow-[0_0_25px_rgba(244,63,94,0.8)] !border-rose-400",
          ],
          variant === "record" && !active && [
            "text-rose-400 hover:text-white",
          ],
          className
        )}
        style={
          active && variant !== "record" && !getInnerThemeStyles()
            ? {
                boxShadow: `0 0 20px ${effectiveGlow}66`,
                borderColor: effectiveGlow,
              }
            : undefined
        }
        {...props}
      >
        {/* Status Indicator Jewel per Theme */}
        {themeStyle === "cyber_hex" ? (
          // Tech cyber micro-diamond dot (NO horizontal line)
          <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none">
            <div
              className={cn(
                "w-1.5 h-1.5 rotate-45 transition-all duration-200 border border-black/40",
                active ? "bg-cyan-300 shadow-[0_0_8px_#22d3ee] scale-125" : "bg-cyan-900/60 opacity-40"
              )}
            />
          </div>
        ) : themeStyle === "celestial_glass" ? (
          // Twinkling celestial star node
          <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                active ? "bg-white shadow-[0_0_8px_#ffffff] scale-125 animate-pulse" : "bg-purple-400/30"
              )}
            />
          </div>
        ) : (
          // Radiant LED dot
          <div
            className={cn(
              "absolute pointer-events-none flex items-center justify-center",
              rounded === "full" ? "top-1 left-1/2 -translate-x-1/2" : "top-1 right-1.5"
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 border border-black/40",
                active ? "scale-125 animate-pulse" : "opacity-30"
              )}
              style={{
                backgroundColor: effectiveLed,
                boxShadow: active ? `0 0 8px ${effectiveLed}, 0 0 2px #ffffff` : undefined,
              }}
            />
          </div>
        )}

        {/* Content Layout */}
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
            {/* Symbol and Icon */}
            <div className="flex items-center justify-center gap-1.5">
              {symbol && !label && !sublabel ? (
                <span
                  className={cn(
                    "text-[10px] font-mono select-none transition-transform duration-200 group-hover:scale-110",
                    active ? "opacity-100 font-bold" : "opacity-50"
                  )}
                  style={active ? { color: effectiveGlow } : undefined}
                >
                  {symbol}
                </span>
              ) : symbol && (
                <span
                  className={cn(
                    "text-xs font-mono select-none transition-transform duration-200 group-hover:scale-115",
                    active ? "opacity-100" : "opacity-50"
                  )}
                  style={active ? { color: effectiveGlow } : undefined}
                >
                  {symbol}
                </span>
              )}
              {icon && (
                <div
                  className={cn(
                    "transition-all duration-200 group-hover:scale-115 flex items-center justify-center",
                    active
                      ? "scale-115 drop-shadow-[0_0_8px_currentColor] animate-pulse"
                      : "opacity-80 group-hover:opacity-100"
                  )}
                  style={active ? { color: effectiveGlow } : undefined}
                >
                  {icon}
                </div>
              )}
            </div>

            {/* Optional Label */}
            {label && (
              <span className="text-[8px] font-mono font-black tracking-tighter leading-none uppercase truncate max-w-full">
                {label}
              </span>
            )}

            {/* Optional Sublabel */}
            {(sublabel || badge) && (
              <span
                className={cn(
                  "text-[7px] font-mono leading-none tracking-tight",
                  active ? "text-white/90" : "text-white/40"
                )}
              >
                {sublabel || badge}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
