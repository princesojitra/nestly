import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = { color: string; size?: number };

// Stroke-style icon set (24px grid, 1.75px stroke) — see docs/DESIGN_SYSTEM.md.
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24' });

export function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m3 10 9-7 9 7" />
      <Path d="M5 9v11h14V9" />
    </Svg>
  );
}

export function BoxIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <Path d="M3 8v9l9 5 9-5V8" />
      <Path d="M12 13v9" />
    </Svg>
  );
}

export function WrenchIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z" />
    </Svg>
  );
}

export function ChartIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 20V10M12 20V4M20 20v-7" />
    </Svg>
  );
}

export function UserIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </Svg>
  );
}
