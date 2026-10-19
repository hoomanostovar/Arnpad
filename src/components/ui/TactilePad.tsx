import React from "react";
import { cn } from "./GlowButton";
import { Disc, Activity } from "lucide-react";

export interface TactilePadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  padNumber: number;
  sampleName: string;
  glowColor?: string;
  accentColor?: string;
}

export default function TactilePad({
  active = false,
  padNumber,
  sampleName,
  glowColor = "#f472b6",
  accentColor = "#c084fc",
  className,
  ...props
}: TactilePadProps) {
  return (
    <div className="relative group p-0.5 rounded-2xl bg-black/75 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.06)] border border-white/10 w-full">
      <button
        className={cn(
          // Hardware Drum Pad: Thick silicone keycap with physical tactile sink
          "relative w-full h-11 sm:h-12 rounded-xl cursor-pointer select-none outline-none font-sans flex flex-col justify-between p-1.5 transition-all duration-150 ease-out overflow-hidden",
          // Physical 3D keycap sink on click
          "active:translate-y-[2px] active:shadow-[0_1px_0_#050508,inset_0_3px_8px_rgba(0,0,0,0.9)]",
          // Unpressed state
          !active && [
            "bg-gradient-to-b from-neutral-800/80 via-neutral-900/95 to-black text-white/80",
            "border border-t-white/15 border-b-black/80 border-x-white/5",
            "shadow-[0_3px_0_#060609,0_5px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)]",
            "hover:brightness-110 hover:-translate-y-[1px]",
          ],
          // Active Illuminated State: Glowing through translucent rubber
          active && [
            "text-white font-bold border border-t-white/30 border-b-black/50 border-x-white/15 translate-y-[1px]",
          ],
          className
        )}
        style={
          active
            ? {
                background: `radial-gradient(circle at 50% 35%, ${glowColor}55 0%, rgba(25,18,32,0.95) 80%, rgba(10,5,15,1) 100%)`,
                boxShadow: `0 2px 0 #050508, 0 0 20px ${glowColor}66, inset 0 0 16px ${glowColor}44, inset 0 1px 2px rgba(255,255,255,0.3)`,
                borderColor: `${glowColor}99`,
              }
            : undefined
        }
        {...props}
      >
        {/* Soft top highlight sheen */}
        <div className="absolute top-0.5 left-2 right-2 h-[1.5px] bg-white/20 rounded-full pointer-events-none blur-[0.5px]" />

        {/* Top Header: Pad index + LED jewel */}
        <div className="flex items-center justify-between w-full pointer-events-none">
          <div className="flex items-center gap-1">
            <Disc
              className={cn(
                "w-3 h-3 transition-transform duration-300",
                active ? "rotate-90 scale-110 text-white" : "opacity-40 text-neutral-400 group-hover:opacity-75"
              )}
              style={active ? { color: glowColor } : undefined}
            />
            <span
              className={cn(
                "text-[8px] font-mono font-black tracking-tight",
                active ? "text-white" : "text-neutral-400 group-hover:text-white"
              )}
            >
              PAD {padNumber}
            </span>
          </div>

          {/* Illuminated Jewel LED */}
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

        {/* Bottom Label: Truncated Sample Name */}
        <div className="w-full text-left pointer-events-none">
          <div
            className={cn(
              "text-[8px] font-mono font-medium truncate max-w-full leading-tight",
              active ? "text-white drop-shadow" : "text-neutral-400 group-hover:text-neutral-200"
            )}
          >
            {sampleName}
          </div>
        </div>
      </button>
    </div>
  );
}
