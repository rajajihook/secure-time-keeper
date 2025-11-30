import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        active: "bg-success/15 text-success",
        paused: "bg-warning/15 text-warning",
        ended: "bg-muted text-muted-foreground",
        error: "bg-destructive/15 text-destructive",
        info: "bg-info/15 text-info",
      },
    },
    defaultVariants: {
      variant: "active",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ children, variant, pulse = false, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === "active" && "bg-success",
            variant === "paused" && "bg-warning",
            variant === "error" && "bg-destructive",
            variant === "info" && "bg-info"
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === "active" && "bg-success",
            variant === "paused" && "bg-warning",
            variant === "error" && "bg-destructive",
            variant === "info" && "bg-info"
          )} />
        </span>
      )}
      {children}
    </span>
  );
}
