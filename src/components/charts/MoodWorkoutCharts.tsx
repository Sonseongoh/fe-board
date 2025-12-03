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
  AreaChart,
  Area,
} from "recharts";
import type { WeeklyMoodTrend, WeeklyWorkoutTrend } from "../../api/mockCharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#7c3aed",
  "#0ea5e9",
];

interface MoodWorkoutChartsProps {
  moodData: WeeklyMoodTrend[];
  workoutData: WeeklyWorkoutTrend[];
  moodSummary: { mood: string; value: number }[];
}

export function MoodWorkoutCharts({
  moodData,
  workoutData,
  moodSummary,
}: MoodWorkoutChartsProps) {
  return (
    <>
      {/* 주간 기분 트렌드 - 바 차트 & 도넛 차트 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>주간 기분 분포</h2>
        <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
          주간 기분 분포 – 주차별 바 차트 & 전체 비율 도넛 차트
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
          {/* 주차별  차트 */}
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={moodData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="happy" name="행복(happy)" fill="#22c55e" />
                <Bar dataKey="tired" name="피곤(tired)" fill="#3b82f6" />
                <Bar
                  dataKey="stressed"
                  name="스트레스(stressed)"
                  fill="#f97316"
                />
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
                  data={moodSummary}
                  dataKey="value"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {moodSummary.map((entry, index) => (
                    <Cell
                      key={entry.mood}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/*주간 기분 트렌드 - 스택형 바 / 면적 차트 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>주간 기분 분포-스택,면적</h2>
        <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
          happy / tired / stressed 비율을 누적(stacked) 형태로 표현한 차트
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
          {/* 스택형 바 차트 */}
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={moodData}>
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="happy"
                  name="행복(happy)"
                  stackId="mood"
                  fill="#22c55e"
                />
                <Bar
                  dataKey="tired"
                  name="피곤(tired)"
                  stackId="mood"
                  fill="#3b82f6"
                />
                <Bar
                  dataKey="stressed"
                  name="스트레스(stressed)"
                  stackId="mood"
                  fill="#f97316"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 스택형 면적 차트 */}
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={moodData}>
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="happy"
                  name="행복(happy)"
                  stackId="moodArea"
                  fill="#22c55e"
                  stroke="#22c55e"
                />
                <Area
                  type="monotone"
                  dataKey="tired"
                  name="피곤(tired)"
                  stackId="moodArea"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                />
                <Area
                  type="monotone"
                  dataKey="stressed"
                  name="스트레스(stressed)"
                  stackId="moodArea"
                  fill="#f97316"
                  stroke="#f97316"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 주간 운동 트렌드 - 스택형 바 / 면적 차트 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>주간 운동 트렌드-스택,면적</h2>
        <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
          running / cycling / stretching 비율을 누적(stacked) 형태로 표현한 차트
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
          {/* 스택형 바 차트 */}
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={workoutData}>
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="running"
                  name="러닝(running)"
                  stackId="workout"
                  fill="#2563eb"
                />
                <Bar
                  dataKey="cycling"
                  name="사이클(cycling)"
                  stackId="workout"
                  fill="#16a34a"
                />
                <Bar
                  dataKey="stretching"
                  name="스트레칭(stretching)"
                  stackId="workout"
                  fill="#f97316"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 스택형 면적 차트 */}
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={workoutData}>
                <XAxis dataKey="week" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="running"
                  name="러닝(running)"
                  stackId="workoutArea"
                  fill="#2563eb"
                  stroke="#2563eb"
                />
                <Area
                  type="monotone"
                  dataKey="cycling"
                  name="사이클(cycling)"
                  stackId="workoutArea"
                  fill="#16a34a"
                  stroke="#16a34a"
                />
                <Area
                  type="monotone"
                  dataKey="stretching"
                  name="스트레칭(stretching)"
                  stackId="workoutArea"
                  fill="#f97316"
                  stroke="#f97316"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}
