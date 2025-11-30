import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: ReactNode;
  bottomContent?: ReactNode;
}

export function MobileLayout({
  children,
  className,
  showHeader = false,
  headerContent,
  bottomContent,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && headerContent && (
        <header className="sticky top-0 z-50 safe-top bg-background/80 backdrop-blur-lg border-b border-border">
          {headerContent}
        </header>
      )}
      <main className={cn("flex-1 flex flex-col", className)}>
        {children}
      </main>
      {bottomContent && (
        <footer className="sticky bottom-0 safe-bottom bg-background/80 backdrop-blur-lg border-t border-border">
          {bottomContent}
        </footer>
      )}
    </div>
  );
}
