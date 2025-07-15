// src/router.tsx
import {
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router';

import AuthForm from './components/dentists/AuthForm';
import App from './App';

// Create the root route
const rootRoute = new RootRoute();

// Auth route (/)
const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthForm,
});

// Chart route (/chart)
const chartRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/chart',
  component: App,
});

// Combine routes
const routeTree = rootRoute.addChildren([authRoute, chartRoute]);

// Create and export the router
export const router = new Router({ routeTree });

// ✅ Optional: Type-safe route hooks (recommended for TS projects)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
