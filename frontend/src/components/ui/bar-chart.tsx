
import * as React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  return (
    <ChartContainer className={className} config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey="value"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
