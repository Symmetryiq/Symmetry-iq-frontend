import React from 'react';
import { Path, Svg } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

const EyeCloseIcon = ({ size = 24, color = '#000000' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={2}
        stroke={color}
        d="M3 10a13.358 13.358 0 0 0 3 2.685M21 10a13.358 13.358 0 0 1-3 2.685m-8 1.624L9.5 16.5m.5-2.19a10.59 10.59 0 0 0 4 0m-4 0a11.275 11.275 0 0 1-4-1.625m8 1.624.5 2.191m-.5-2.19a11.275 11.275 0 0 0 4-1.625m0 0 1.5 1.815M6 12.685 4.5 14.5"
      />
    </Svg>
  );
};

export default EyeCloseIcon;
