import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { Play, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import WatchPage from "./pages/WatchPage";

// Root layout with nav + footer
function RootLayout() {
  const location = useLocation();
  const isSettings = location.pathname === "/settings";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="YT Viewer home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <Play
                className="w-4 h-4 text-primary-foreground ml-0.5"
                fill="currentColor"
              />
            </div>
            <span className="font-display font-black text-lg tracking-tight hidden sm:block">
              YT<span className="text-primary"> Viewer</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {!isSettings && (
              <Link
                to="/settings"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-all duration-150"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Content with animation */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono-custom">
            © {new Date().getFullYear()} YT Viewer — watch YouTube your way
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SearchPage,
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watch/$videoId",
  component: WatchPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  watchRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.15 0.012 270)",
            border: "1px solid oklch(0.22 0.014 270)",
            color: "oklch(0.95 0.005 90)",
          },
        }}
      />
    </>
  );
}
