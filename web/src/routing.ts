export function routeForPath(pathname: string): 'landing' | 'app' {
  return pathname === '/app' || pathname.startsWith('/app/') ? 'app' : 'landing';
}
