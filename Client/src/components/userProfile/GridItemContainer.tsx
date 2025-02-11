import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface GridItemContainerProps {
  children: ReactNode;
}

export const GridItemContainer = ({ children }: GridItemContainerProps) => {
  return (
    <div className="border border-slate-500 md:col-span-1 p-4">
      <Card className="h-full">
        <div className="flex flex-col justify-between h-full py-6">{children}</div>
      </Card>
    </div>
  );
};


