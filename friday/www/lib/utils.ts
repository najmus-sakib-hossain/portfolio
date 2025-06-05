
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Locale text utilities
import { Locale, i18n } from '@/i18n-config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  if (window === undefined) return;
  window.navigator.clipboard.writeText(text);
};

export function getComponentName(name: string) {
  // convert kebab-case to title case
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getRandomIndex(array: any[]) {
  return Math.floor(Math.random() * array.length);
}

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
  };
  [key: string]: any;
};

// Global locale cache for client-side usage
let localeCache: Partial<Record<Locale, LocaleKeys>> = {};

/**
 * Load locale data dynamically
 */
async function loadLocaleData(locale: Locale): Promise<LocaleKeys> {
  if (localeCache[locale]) {
    return localeCache[locale]!;
  }

  try {
    const localeData = await import(`@/locales/${locale}.json`);
    localeCache[locale] = localeData.default;
    return localeData.default;
  } catch (error) {
    console.warn(`Failed to load locale ${locale}, falling back to English`);
    // Fallback to English
    if (!localeCache.en) {
      const fallback = await import('@/locales/en.json');
      localeCache.en = fallback.default;
    }
    return localeCache.en!;
  }
}

/**
 * Get current locale from route
 */
function getCurrentLocale(): Locale {
  if (typeof window !== 'undefined') {
    // Client-side: get from URL
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const routeLocale = segments[0];
    
    if (i18n.locales.includes(routeLocale as Locale)) {
      return routeLocale as Locale;
    }
  } else {
    // Server-side: try to get from global context or use default
    // This won't work perfectly but provides a fallback
    return i18n.defaultLocale;
  }
  
  // Fallback to default locale
  return i18n.defaultLocale;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Locale Text (lt) function - simple utility like cn() but for localized text
 * 
 * @param key - Dot notation key (e.g., 'friday.title')
 * @param fallback - Fallback text if key not found
 */
export function lt(key: string, fallback?: string): string {
  const currentLocale = getCurrentLocale();
  
  // Try to get from window cache first (set by LocaleInitializer)
  if (typeof window !== 'undefined' && (window as any).__LOCALE_CACHE__) {
    const windowCache = (window as any).__LOCALE_CACHE__;
    if (windowCache[currentLocale]) {
      const value = getNestedValue(windowCache[currentLocale], key);
      if (value !== undefined) {
        return value;
      }
    }
  }
  
  // Fallback to module cache
  const cachedData = localeCache[currentLocale];
  if (cachedData) {
    const value = getNestedValue(cachedData, key);
    if (value !== undefined) {
      return value;
    }
  }
  
  return fallback || key.split('.').pop() || key;
}

/**
 * Async version that ensures locale data is loaded
 * Use this for server-side or when you need guaranteed fresh data
 */
export async function lta(key: string, fallback?: string): Promise<string> {
  const currentLocale = getCurrentLocale();
  const localeData = await loadLocaleData(currentLocale);
  
  const value = getNestedValue(localeData, key);
  return value !== undefined ? value : (fallback || key.split('.').pop() || key);
}

/**
 * Preload current locale data for instant lt() access
 * Call this in your app initialization
 */
export async function preloadCurrentLocale(): Promise<void> {
  const currentLocale = getCurrentLocale();
  await loadLocaleData(currentLocale);
}

/**
 * Preload specific locale data
 */
export async function preloadLocale(locale: Locale): Promise<void> {
  await loadLocaleData(locale);
}

/**
 * Clear locale cache (useful for development)
 */
export function clearLocaleCache(): void {
  localeCache = {};
}

export function stripPrefixes(text: string): string {
  // Check for all standard prefixes
  const prefixes = [
    "Image: ", 
    "Thinking: ", 
    "Search: ", 
    "Research: ", 
    "Canvas: "
  ];
  
  // Remove the prefix if found at the start of the text
  for (const prefix of prefixes) {
    if (text.startsWith(prefix)) {
      return text.substring(prefix.length);
    }
  }
  
  return text;
}
