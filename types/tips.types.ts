export interface ActionItem {
  emoji: string;
  text: string;
}

export interface Step {
  number: number;
  text: string;
}

export interface Product {
  name: string;
  description: string;
}

export interface ExternalLink {
  text: string;
  url: string;
}

export interface Tip {
  id: string;
  title: string;
  icon: string;
  description: string;
  actionItems?: ActionItem[];
  steps?: Step[];
  products?: Product[];
  proTip?: string;
  commonMistakes?: string[];
  externalLink?: ExternalLink;
}
