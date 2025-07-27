import React from 'react';

// SVG module declarations
declare module '*.svg' {
  const content: string;
  export default content;
}

// External ESM module declarations
declare module 'https://esm.sh/@vapi-ai/web' {
  const Vapi: any;
  export default Vapi;
}

declare module 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm' {
  export function createClient(url: string, key: string): any;
}

// Global window declarations
declare global {
  interface Window {
    Vapi: any;
    Supabase: {
      createClient: (url: string, key: string) => any;
    };
  }
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