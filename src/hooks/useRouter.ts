// Client-side Router Hook for FORGE
// Manages history state, URL synchronization, deep routing, and back/forward navigation.
// Implements unified global route state so all components stay perfectly synchronized.

import { useState, useEffect, useCallback } from 'react';

export interface RouteMatch {
  path: string;
  name: string;
  params: Record<string, string>;
  search: URLSearchParams;
}

type RouteListener = (path: string, search: URLSearchParams) => void;

let globalPath = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';
let globalSearch = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const routeListeners: Set<RouteListener> = new Set();

function notifyRouteListeners() {
  globalPath = window.location.pathname || '/';
  globalSearch = new URLSearchParams(window.location.search);
  routeListeners.forEach((l) => l(globalPath, globalSearch));
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', notifyRouteListeners);
}

export function navigate(to: string, replace = false) {
  if (replace) {
    window.history.replaceState(null, '', to);
  } else {
    window.history.pushState(null, '', to);
  }
  notifyRouteListeners();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(globalPath);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(globalSearch);

  useEffect(() => {
    const listener: RouteListener = (path, search) => {
      setCurrentPath(path);
      setSearchParams(search);
    };

    routeListeners.add(listener);

    return () => {
      routeListeners.delete(listener);
    };
  }, []);

  // Parse path matching
  const matchRoute = useCallback(
    (pattern: string): { match: boolean; params: Record<string, string> } => {
      const patternParts = pattern.split('/').filter(Boolean);
      const currentParts = currentPath.split('/').filter(Boolean);

      if (patternParts.length !== currentParts.length) {
        return { match: false, params: {} };
      }

      const params: Record<string, string> = {};
      for (let i = 0; i < patternParts.length; i++) {
        const p = patternParts[i];
        const c = currentParts[i];

        if (p.startsWith(':')) {
          params[p.slice(1)] = decodeURIComponent(c);
        } else if (p !== c) {
          return { match: false, params: {} };
        }
      }

      return { match: true, params };
    },
    [currentPath]
  );

  return {
    path: currentPath,
    searchParams,
    navigate,
    matchRoute
  };
}
