import React from "react";
import { cn, type ThemeStyle } from "./TactileButton";
import {
  Flower2,
  Sparkles,
  Cat,
  Radio,
  Orbit,
  Moon,
  Activity,
  Flame,
  Zap,
  Shield,
  Disc,
} from "lucide-react";

export interface TactilePadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  padNumber: number;
  sampleName?: string;
  glowColor?: string;
  themeStyle?: ThemeStyle;
}

const SKIN_CLASS: Record<ThemeStyle, string> = {
  bubble_jelly: "arn-pop",
  unicorn_sparkle: "arn-prism",
  cyber_hex: "arn-cyber",
  celestial_glass: "arn-glass",
  retro_studio: "arn-retro",
  neon_laser: "arn-neon",
};

export default function TactilePad({
  active = false,
  padNumber,
  sampleName,
  glowColor = "#f472b6",
  themeStyle = "bubble_jelly",
  className,
  ...props
}: TactilePadProps) {
  // Theme-specific animated icon per slot
  const renderThemeIcon = () => {
    switch (themeStyle) {
      case "bubble_jelly":
        return padNumber % 2 === 1 ? (
          <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-45" />
        ) : (
          <Disc className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
        );
      case "unicorn_sparkle":
        return (
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-125" />
        );
      case "cyber_hex":
        return padNumber === 1 ? (
          <Cat className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-115" />
        ) : (
          <Radio className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-115" />
        );
      case "celestial_glass":
        return padNumber % 2 === 1 ? (
          <Orbit className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-180 duration-500" />
        ) : (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-rotate-12" />
        );
      case "retro_studio":
        return padNumber % 2 === 1 ? (
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-115" />
        ) : (
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-115" />
        );
      case "neon_laser":
      default:
        return padNumber % 2 === 1 ? (
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-125" />
        ) : (
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-115" />
        );
    }
  };

  return (
    <div
      className={cn(
        "arn-outer",
        SKIN_CLASS[themeStyle],
        active && "is-on",
        "is-round"
      )}
      style={{ ["--acc" as string]: glowColor }}
    >
      <div className="arn-frame">
        <button
          className={cn(
            "arn-face select-none p-0 w-9 h-9 sm:w-10 sm:h-10 aspect-square",
            className
          )}
          title={sampleName ? `Slot ${padNumber}: ${sampleName}` : `Slot ${padNumber}`}
          {...props}
        >
          <span className="arn-content">
            <span className="arn-icon">{renderThemeIcon()}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
