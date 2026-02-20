import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
      <h1 className="text-xl font-bold">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
