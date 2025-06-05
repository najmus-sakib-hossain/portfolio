"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLocaleStore } from '@/store/locale-store';
import { Locale, i18n } from '@/i18n-config';

// Import the utility functions
import { loadLocaleData, getNestedValue } from './utils-internal';

// Type definitions for locale text structure
type LocaleKeys = {
  friday: {
    title: string;
    welcome: string;
    prompt: string;
    help: string;
  };
  navigation: {
    new: string;
    home: string;
    automations: string;
    varients: string;
    projects: string;
    spaces: string;
    library: string;
    more: string;
    settings: string;
    profile: string;
    dashboard: string;
    analytics: string;
  };  authentication: {
    "sign-in": string;
    "sign-up": string;
    "forgot-password": string;
    "remember-me": string;
    "or-continue-with": string;
    "no-account": string;
    "already-have-account": string;
    "create-account": string;
    "enter-login-details": string;
    "enter-signup-details": string;
    "sign-up-success": string;
    "upload-failed": string;
  };
  [key: string]: any;
};


/**
 * Hook version of lt for React components
 */
export function useLt() {
  const { currentLocale } = useLocaleStore();
  const pathname = usePathname();
  
  // Get route locale
  const routeLocale = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    return i18n.locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : i18n.defaultLocale;
  }, [pathname]);
  
  // Use route locale as primary, store locale as fallback
  const activeLocale = routeLocale || currentLocale;
  
  const [localeData, setLocaleData] = React.useState<LocaleKeys | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  React.useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    loadLocaleData(activeLocale).then(data => {
      if (mounted) {
        setLocaleData(data);
        setIsLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, [activeLocale]);
  
  const lt = React.useCallback((key: string, fallback?: string) => {
    if (!localeData) {
      return fallback || key.split('.').pop() || key;
    }
    
    const value = getNestedValue(localeData, key);
    return value !== undefined ? value : (fallback || key.split('.').pop() || key);
  }, [localeData]);
  
  return {
    lt,
    locale: activeLocale,
    isLoading,
    localeData
  };
}
