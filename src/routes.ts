export type AppRoute = 'lab' | 'privacy' | 'instructions';

const ROUTE_PATHS: Record<AppRoute, string> = {
  lab: '/',
  privacy: '/privacy',
  instructions: '/instructions',
};

export function getRouteFromPath(pathname: string): AppRoute {
  if (pathname === ROUTE_PATHS.privacy) return 'privacy';
  if (pathname === ROUTE_PATHS.instructions) return 'instructions';
  return 'lab';
}

export function getPathForRoute(route: AppRoute): string {
  return ROUTE_PATHS[route];
}

function createPopStateEvent(): Event {
  if (typeof PopStateEvent === 'function') {
    return new PopStateEvent('popstate');
  }
  return new Event('popstate');
}

export function navigateToRoute(route: AppRoute): void {
  if (typeof window === 'undefined') return;
  const nextPath = getPathForRoute(route);
  if (window.location.pathname === nextPath) return;

  window.history.pushState({}, '', nextPath);
  window.dispatchEvent(createPopStateEvent());
  if (typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}
