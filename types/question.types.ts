import { KeyboardTypeOptions } from 'react-native';

type IconComponent = React.FC<{ size?: number; color?: string }>;

type OptionIcon =
  | { type: 'emoji'; value: string }
  | { type: 'icon'; value: IconComponent };

type SelectOption = {
  label: string;
  value: string;
  icon?: OptionIcon;
};

type TextQuestion = {
  id: string;
  type: 'text';
  title: string;
  subtitle: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
};

type SelectQuestion = {
  id: string;
  type: 'single' | 'multi';
  title: string;
  subtitle: string;
  options: SelectOption[];
};

export type Question = TextQuestion | SelectQuestion;
