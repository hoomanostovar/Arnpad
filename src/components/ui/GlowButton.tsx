import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  glowColor?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export default function GlowButton({
  active = false,
  glowColor,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs rounded-xl",
    md: "px-3.5 py-1.5 text-xs rounded-2xl",
    lg: "px-4 py-2.5 text-sm rounded-2xl",
    icon: "w-11 h-11 p-0 rounded-2xl flex items-center justify-center",
  };

  const variantStyles = {
    primary: active
      ? "bg-white/20 text-white border-white/40 shadow-lg"
      : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10 hover:border-white/20",
    secondary: active
      ? "bg-purple-500/30 text-purple-200 border-purple-400/50 shadow-lg"
      : "bg-white/5 hover:bg-purple-900/30 text-white/70 hover:text-purple-200 border-white/10",
    danger: active
      ? "bg-rose-500 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse"
      : "bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border-rose-800/30",
    amber: active
      ? "bg-amber-500 text-black font-bold border-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.7)]"
      : "bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border-amber-800/30",
    ghost: "bg-transparent hover:bg-white/10 text-white/70 hover:text-white border-transparent",
  };

  return (
    <button
      className={cn(
        "group relative select-none font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 backdrop-blur-md border",
        sizeClasses[size],
        variantStyles[variant],
        className
      )}
      style={
        active && glowColor
          ? {
              boxShadow: `0 0 20px ${glowColor}66, inset 0 0 10px ${glowColor}33`,
              borderColor: glowColor,
            }
          : undefined
      }
      {...props}
    >
      {/* 21st.dev Animated Glow Underlay */}
      {active && (
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-60 blur-sm -z-10 transition-opacity duration-300 animate-pulse pointer-events-none"
          style={{
            background: glowColor
              ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
              : "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
      )}
      <div className="relative flex items-center justify-center gap-1.5 z-10 w-full h-full">
        {children}
      </div>
    </button>
  );
}
