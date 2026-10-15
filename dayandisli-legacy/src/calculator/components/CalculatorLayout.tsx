import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Scale, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorLayoutProps {
  children: ReactNode;
}

export function CalculatorLayout({ children }: CalculatorLayoutProps) {
  const location = useLocation();
  const embeddedInErp = location.pathname.startsWith("/apps/calculator");

  const navItems = [
    { href: "/apps/calculator", label: "Ana Sayfa", icon: Home },
    { href: "/apps/calculator/machines", label: "Makineler", icon: Settings },
    { href: "/apps/calculator/weight", label: "Ağırlık Hesaplama", icon: Scale },
  ];

  // Single fixed top bar: the three primary destinations ARE the header, no
  // separate brand/logo row above them (matches the native app's AppScaffold,
  // which removed the old redundant title bar). Equal-width segments with a
  // solid accent background block on the selected one.
  const header = (
    <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
      <nav className={embeddedInErp ? "px-2 py-2" : "container mx-auto px-2 py-2 sm:px-4"}>
        <div className="flex items-stretch gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Ana Sayfa only matches its exact root; Makineler and Ağırlık Hesaplama
            // also stay highlighted on every nested subpage (machine detail, Spur,
            // Helical, REISHAUER forms/receipts) so primary navigation always shows
            // where the user actually is, not just on the list screen itself.
            const isActive =
              item.href === "/apps/calculator"
                ? location.pathname === item.href
                : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-1 basis-0 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-center text-xs font-medium transition-all sm:flex-row sm:text-sm",
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );

  if (embeddedInErp) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 shadow-sm">
        {header}
        <main className="px-4 py-6 md:px-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {header}
      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-slate-700/50 bg-slate-900/50 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Dayan Dişli Sanayi - DAYAN CALCULATOR
          </p>
        </div>
      </footer>
    </div>
  );
}
