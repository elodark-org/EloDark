import { Icon } from "@/components/ui/icon";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  iconColor?: string;
}

export function StatCard({ icon, label, value, trend, iconColor = "text-primary" }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${iconColor}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </div>
  );
}
