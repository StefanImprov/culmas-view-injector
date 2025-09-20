import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TenantConfig {
  name: string;
  apiUrl: string;
  domain: string;
  bookingUrl: string;
}

interface TenantContextType {
  config: TenantConfig;
  updateConfig: (updates: Partial<TenantConfig>) => void;
}

const defaultConfig: TenantConfig = {
  name: "Globe Theatre",
  apiUrl: "https://api.dev.culmas.io/",
  domain: "globe-dance.dev.culmas.io",
  bookingUrl: "https://globe-dance.dev.culmas.io"
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [config, setConfig] = useState<TenantConfig>(defaultConfig);

  const updateConfig = (updates: Partial<TenantConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <TenantContext.Provider value={{ config, updateConfig }}>
      {children}
    </TenantContext.Provider>
  );
};