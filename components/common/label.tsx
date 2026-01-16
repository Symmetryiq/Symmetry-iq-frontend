import { TypographyProps } from '@/helpers/types';
import Typography from './typography';

export function Label(props: TypographyProps) {
  return <Typography {...props}>{props.children}</Typography>;
}
