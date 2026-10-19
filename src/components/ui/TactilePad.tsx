import React from "react";
import { cn } from "./GlowButton";
import { Disc } from "lucide-react";

export interface TactilePadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  padNumber: number;
  sampleName?: string;
  glowColor?: string;
}

export default function TactilePad({
  active = false,
  padNumber,
  sampleName,
  glowColor = "#f472b6",
  className,
  ...props
}: TactilePadProps) {
  return (
    <div className="relative group p-1 rounded-full bg-black/85 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_2px_5px_rgba(0,0,0,0.6)] border border-white/10 w-full aspect-square flex items-center justify-center transition-transform hover:scale-[1.03]">
      <button
        className={cn(
          // Hardware Drum Pad: Pure circular silicone touch button (100% round, zero text)
          "relative w-full h-full rounded-full cursor-pointer select-none outline-none flex items-center justify-center transition-all duration-150 ease-out overflow-hidden p-0",
          // Physical 3D keycap sink on click
          "active:scale-95 active:shadow-[0_1px_0_#050508,inset_0_3px_8px_rgba(0,0,0,0.9)]",
          // Unpressed state
          !active && [
            "bg-gradient-to-b from-neutral-800/90 via-neutral-900/95 to-black text-white/70",
            "border border-t-white/20 border-b-black/90 border-x-white/5",
            "shadow-[0_3px_0_#060609,0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.5)]",
            "hover:brightness-120 hover:-translate-y-[1px]",
          ],
          // Active Illuminated State: Glowing through translucent silicone
          active && [
            "text-white font-bold border border-t-white/40 border-b-black/50 border-x-white/20 translate-y-[1px]",
          ],
          className
        )}
        style={
          active
            ? {
                background: `radial-gradient(circle at 50% 50%, ${glowColor}77 0%, rgba(25,18,32,0.95) 75%, rgba(10,5,15,1) 100%)`,
                boxShadow: `0 2px 0 #050508, 0 0 24px ${glowColor}88, inset 0 0 18px ${glowColor}66, inset 0 1px 2px rgba(255,255,255,0.45)`,
                borderColor: `${glowColor}cc`,
              }
            : undefined
        }
        title={sampleName ? `Slot ${padNumber}: ${sampleName}` : `Slot ${padNumber}`}
        {...props}
      >
        {/* Center Icon: Animated Vinyl / Pad Disc */}
        <div className="relative flex items-center justify-center pointer-events-none">
          <Disc
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
              active
                ? "scale-110 text-white drop-shadow-[0_0_10px_currentColor] animate-[spin_6s_linear_infinite]"
                : "opacity-45 text-neutral-400 group-hover:opacity-85 group-hover:scale-105"
            )}
            style={active ? { color: glowColor } : undefined}
          />
          {/* Subtle center core jewel */}
          <div
            className={cn(
              "absolute w-2 h-2 rounded-full transition-all duration-300",
              active
                ? "bg-white scale-125 shadow-[0_0_8px_#ffffff]"
                : "bg-neutral-600 opacity-60"
            )}
          />
        </div>

        {/* Illuminated Jewel LED at top */}
        <div className="absolute top-1.5 pointer-events-none flex items-center justify-center">
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
