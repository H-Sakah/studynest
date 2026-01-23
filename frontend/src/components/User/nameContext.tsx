'use client';
import React, { createContext, useContext, ReactNode } from 'react';

export type name_props = {
  firstName: string;
  lastName?: string;
};

const NameContext = createContext<name_props | undefined>(undefined);
interface NameProviderProps {
  children: ReactNode;
  value: name_props;
}
export const NameProvider = ({ children, value }: NameProviderProps) => {
  return <NameContext.Provider value={value}>{children}</NameContext.Provider>;
};

export const useName = () => {
  const context = useContext(NameContext);

  if (!context) {
    throw new Error(
      'useName muss innerhalb eines NameProviders verwendet werden'
    );
  }

  return context;
};
