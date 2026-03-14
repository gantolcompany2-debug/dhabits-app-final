import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import HabitsPage from "./pages/HabitsPage";
import GoalsPage from "./pages/GoalsPage";
import ShopPage from "./pages/ShopPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/habits"} component={HabitsPage} />
      <Route path={"/goals"} component={GoalsPage} />
      <Route path={"/shop"} component={ShopPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <MainLayout>
              <Router />
            </MainLayout>
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
