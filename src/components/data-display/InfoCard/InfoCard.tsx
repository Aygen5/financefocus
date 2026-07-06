import React from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/utils/styles";

export interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  className = "",
  children,
}) => {
  return (
    <Card className={cn("p-6 text-left w-full", className)}>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1 select-none">
        {title}
      </h3>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-4 select-none">
        {description}
      </p>
      {children && <div className="w-full">{children}</div>}
    </Card>
  );
};

export default InfoCard;
