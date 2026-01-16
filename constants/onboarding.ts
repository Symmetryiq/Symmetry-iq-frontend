export type StepType = 'text-input' | 'single-select' | 'multi-select';

export interface IOnboardingStep {
  id: string;
  type: StepType;
  title: string;
  subtitle: string;
  required: boolean;
}
