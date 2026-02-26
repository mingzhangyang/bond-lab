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
