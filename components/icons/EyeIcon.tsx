import React from 'react';
import { Path, Svg } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

const EyeIcon = ({ size = 24, color = '#000000' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        strokeLinejoin="round"
        strokeWidth={2}
        stroke={color}
        d="M3 12c5.4-8 12.6-8 18 0-5.4 8-12.6 8-18 0z"
      />
      <Path
        strokeLinejoin="round"
        strokeWidth={2}
        stroke={color}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </Svg>
  );
};

export default EyeIcon;
