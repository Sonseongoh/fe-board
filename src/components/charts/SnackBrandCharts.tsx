import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { SnackBrandStat } from "../../api/mockCharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#7c3aed",
  "#0ea5e9",
];

interface SnackBrandChartsProps {
  data: SnackBrandStat[];
}

export function SnackBrandCharts({ data }: SnackBrandChartsProps) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 8 }}>/mock/popular-snack-brands</h2>
      <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
        스낵 브랜드별 선호도 – 바 차트 & 도넛 차트
      </p>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
        }}
      >
        {/* 바 차트 */}
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="share" name="선호도" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 도넛 차트 */}
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey="share"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
