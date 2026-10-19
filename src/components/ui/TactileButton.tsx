import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  glowColor?: string;
  ledColor?: string;
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
  // Theme color defaults
  const effectiveGlow = glowColor || (active ? "#f472b6" : "rgba(255,255,255,0.2)");
  const effectiveLed = ledColor || (active ? (glowColor || "#34d399") : "rgba(255,255,255,0.15)");

  const roundingClass =
    rounded === "full"
      ? "rounded-full"
      : "rounded-2xl";

  return (
    <div
      className={cn(
        "relative group p-0.5 bg-black/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.06)] border border-white/10 flex items-center justify-center transition-all",
        roundingClass
      )}
    >
      <button
        className={cn(
          // Hardware button base: tactile 3D travel, bevels, and micro-texture
          "relative w-full cursor-pointer select-none outline-none font-sans flex items-center justify-center transition-all duration-150 ease-out",
          // Physical 3D keycap sink on click
          "active:translate-y-[2px] active:shadow-[0_1px_0_#050508,inset_0_3px_6px_rgba(0,0,0,0.85)]",
          roundingClass,
          // Sizing classes
          size === "sm" && "h-8 px-2 text-[10px]",
          size === "md" && "h-11 px-3 text-xs",
          size === "round" && "w-11 h-11 sm:w-12 sm:h-12 p-0 aspect-square",
          size === "pad" && "h-12 w-full px-1.5 flex-col justify-between py-1",
          size === "icon" && "w-11 h-11 p-0 aspect-square",
          // Tactile unpressed 3D keycap elevation
          !active && [
            "bg-gradient-to-b from-neutral-800/90 via-neutral-900/95 to-neutral-950 text-white/80",
            "border border-t-white/20 border-b-black/80 border-x-white/10",
            "shadow-[0_3px_0_#0a0a0f,0_5px_10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.6)]",
            "hover:brightness-115 hover:-translate-y-[1px] hover:shadow-[0_4px_0_#0a0a0f,0_7px_12px_rgba(0,0,0,0.8)]",
          ],
          // Active backlit state: illuminated tactile keycap with glowing diffuse halo
          active && [
            "text-white font-bold",
            "border border-t-white/40 border-b-black/60 border-x-white/20",
            "translate-y-[1px]",
          ],
          variant === "record" && active && [
            "bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 text-white animate-pulse",
            "shadow-[0_2px_0_#4c0519,0_0_20px_rgba(244,63,94,0.7),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.5)]",
          ],
          variant === "record" && !active && [
            "bg-gradient-to-b from-rose-950/60 via-neutral-900 to-neutral-950 text-rose-300 hover:text-white",
          ],
          variant === "amber" && [
            "bg-gradient-to-b from-amber-600/30 via-neutral-900 to-neutral-950 text-amber-300 hover:text-amber-200",
            "hover:from-amber-600/40 hover:to-neutral-900",
          ],
          className
        )}
        style={
          active && variant !== "record"
            ? {
                background: `linear-gradient(180deg, ${effectiveGlow}55 0%, rgba(20,20,28,0.95) 75%, rgba(10,10,15,1) 100%)`,
                boxShadow: `0 2px 0 #050508, 0 0 22px ${effectiveGlow}66, inset 0 0 14px ${effectiveGlow}33, inset 0 1px 2px rgba(255,255,255,0.35)`,
                borderColor: `${effectiveGlow}99`,
              }
            : undefined
        }
        {...props}
      >
        {/* Status LED Jewel */}
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

        {/* Content Layout */}
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
            {/* Top Symbol and Icon */}
            <div className="flex items-center justify-center gap-1.5">
              {symbol && !label && !sublabel ? (
                // In pure iconic mode, symbol is a sleek companion to icon
                <span
                  className={cn(
                    "text-[10px] font-mono select-none transition-transform duration-200 group-hover:scale-110",
                    active ? "opacity-100 font-bold" : "opacity-45"
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
                    "transition-all duration-300 group-hover:scale-115 flex items-center justify-center",
                    active
                      ? "scale-115 drop-shadow-[0_0_8px_currentColor] animate-pulse"
                      : "opacity-75 group-hover:opacity-100"
                  )}
                  style={active ? { color: effectiveGlow } : undefined}
                >
                  {icon}
                </div>
              )}
            </div>

            {/* Optional Label (rendered only if provided) */}
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
