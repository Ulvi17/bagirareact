import React from 'react';

// SVG module declarations
declare module '*.svg' {
  const content: string;
  export default content;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface EcosystemNewsItem {
  id: string;
  text: string;
  icon: string;
}

export interface FeatureCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
}

export interface MetricData {
  percentage: string;
  totalValue: string;
  label: string;
} 