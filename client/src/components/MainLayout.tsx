import { useLocation } from "wouter";
import { Home, Zap, Target, ShoppingBag, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import CoinDisplay from "@/components/CoinDisplay";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, navigate] = useLocation();
  const { coins, exportBackup, importBackup } = useApp();

  const navItems = [
    { path: "/", label: "Main", icon: Home },
    { path: "/habits", label: "Habits", icon: Zap },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/shop", label: "Shop", icon: ShoppingBag },
  ];

  const handleExportBackup = () => {
    exportBackup();
  };

  const handleImportBackup = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const success = await importBackup(file);
        if (success) {
          console.log("Backup imported successfully");
        } else {
          console.error("Failed to import backup");
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-accent">dHabits</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
            <CoinDisplay amount={coins} size="lg" showLabel={true} />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleExportBackup}
              title="Export backup"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleImportBackup}
              title="Import backup"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-20 bg-card border-r border-border flex flex-col items-center py-4 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
