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

/** Maps each theme style to its CSS skin defined in index.css */
const SKIN_CLASS: Record<ThemeStyle, string> = {
  bubble_jelly: "arn-pop",
  unicorn_sparkle: "arn-prism",
  cyber_hex: "arn-cyber",
  celestial_glass: "arn-glass",
  retro_studio: "arn-retro",
  neon_laser: "arn-neon",
};

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  glowColor?: string;
  /** Kept for API compatibility; skins render their own state indicators */
  ledColor?: string;
  themeStyle?: ThemeStyle;
  icon?: React.ReactNode;
  /** Fallback glyph, only shown when no icon is supplied */
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
  ledColor: _ledColor,
  themeStyle = "bubble_jelly",
  icon,
  symbol,
  label,
  sublabel,
  badge,
  variant = "synth",
  size = "md",
  rounded: _rounded,
  className,
  children,
  style,
  ...props
}: TactileButtonProps) {
  const isRound = size === "round" || size === "icon" || size === "pad";
  const isRecord = variant === "record" || variant === "danger";

  return (
    <div
      className={cn(
        "arn-outer",
        SKIN_CLASS[themeStyle],
        active && "is-on",
        isRound && "is-round",
        isRecord && (active ? "rec-on" : "rec-off")
      )}
      style={{ ["--acc" as string]: glowColor || "#ff7ea5" }}
    >
      <div className="arn-frame">
        <button
          className={cn(
            "arn-face select-none p-0",
            size === "sm" && "h-8 px-2.5 text-[10px]",
            size === "md" && "h-11 px-3 text-xs",
            size === "lg" && "h-14 px-4 text-sm",
            isRound && "w-11 h-11 sm:w-12 sm:h-12 aspect-square",
            className
          )}
          style={style}
          {...props}
        >
          <span className="arn-content">
            {children ? (
              children
            ) : (
              <>
                {icon ? (
                  <span className="arn-icon">{icon}</span>
                ) : symbol ? (
                  <span className="arn-icon text-sm font-bold leading-none">{symbol}</span>
                ) : null}
                {label && (
                  <span className="text-[8px] font-mono font-black tracking-tighter leading-none uppercase truncate">
                    {label}
                  </span>
                )}
                {(sublabel || badge) && (
                  <span className="text-[7px] font-mono leading-none tracking-tight opacity-70">
                    {sublabel || badge}
                  </span>
                )}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
