export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
  description: string;
  suggestedQuestions: string[];
}

export interface ProductDetail {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  description: string;
  features: string[];
  colorClass: string;
  buttonText: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  queriesLimit: number;
  highlighted: boolean;
}

export interface QualificationResult {
  recommendedStack: string[];
  efficiencyBoost: number;
  keyIdeas: string[];
  welcomeMessage: string;
}
