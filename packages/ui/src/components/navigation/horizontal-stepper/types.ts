export interface StepData {
  id?: string;
  label: string;
  description?: string;
  icon?: string;
  status?: 'completed' | 'active' | 'pending' | 'error';
  optional?: boolean;
  disabled?: boolean;
}

export interface HorizontalStepperProps {
  steps: StepData[] | string[];
  activeStep?: number;
  variant?: 'dots' | 'gradient' | 'outline' | 'arrow' | 'numbered' | 'icon';
  size?: 'small' | 'medium' | 'large';
  gradient?: string;
  color?: string;
  stepLineColor?: string;
  showButtons?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  onStepClick?: (stepId: string, stepIndex: number) => void;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  connectorGap?: number;
  // Legacy props for backward compatibility
  icons?: string[];
  stepDescriptions?: string[];
}

export interface StepperVariantProps {
  steps: StepData[];
  activeStep: number;
  gradient?: string;
  color?: string;
  stepLineColor?: string;
  size?: 'small' | 'medium' | 'large';
}
