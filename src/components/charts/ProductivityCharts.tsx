import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#7c3aed",
  "#0ea5e9",
];

const TEAM_COLOR_MAP: Record<string, string> = {
  Frontend: COLORS[0],
  Backend: COLORS[1],
  AI: COLORS[2],
  Marketing: COLORS[0],
  Sales: COLORS[1],
  HR: COLORS[2],
};

interface DotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
}

interface CustomTooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: CustomTooltipPayloadItem[];
}

function CircleDot(props: DotProps) {
  if (props.cx == null || props.cy == null) return null;
  return (
    <circle cx={props.cx} cy={props.cy} r={4} fill={props.stroke ?? "#000"} />
  );
}

function SquareDot(props: DotProps) {
  if (props.cx == null || props.cy == null) return null;
  const size = 8;
  return (
    <rect
      x={props.cx - size / 2}
      y={props.cy - size / 2}
      width={size}
      height={size}
      fill={props.stroke ?? "#000"}
    />
  );
}

// 커피용 툴팁
function CoffeeTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const hovered = payload[0];
  const dataKey = String(hovered.dataKey ?? "");
  const [team] = dataKey.split("_");

  const bugsItem = payload.find((p) => p.dataKey === `${team}_bugs`);
  const prodItem = payload.find((p) => p.dataKey === `${team}_productivity`);

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        padding: "8px 10px",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{team}</div>
      <div>커피: {label} 잔/일</div>
      {bugsItem?.value != null && <div>버그 수: {bugsItem.value}</div>}
      {prodItem?.value != null && <div>생산성: {prodItem.value}</div>}
    </div>
  );
}

// 스낵용 툴팁
function SnackTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const hovered = payload[0];
  const dataKey = String(hovered.dataKey ?? "");
  const [team] = dataKey.split("_");

  const missItem = payload.find((p) => p.dataKey === `${team}_meetingsMissed`);
  const moraleItem = payload.find((p) => p.dataKey === `${team}_morale`);

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        padding: "8px 10px",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{team}</div>
      <div>스낵: {label} 개/일</div>
      {missItem?.value != null && <div>회의 불참: {missItem.value}</div>}
      {moraleItem?.value != null && <div>사기: {moraleItem.value}</div>}
    </div>
  );
}

/** 팀별 Legend  */
interface TeamLegendProps {
  title?: string;
  teams: string[];
  visibility: Record<string, boolean>;
  colors: Record<string, string>;
  defaultColors: Record<string, string>;
  onToggle: (team: string) => void;
  onColorChange: (team: string, color: string) => void;
}

function TeamLegend({
  title,
  teams,
  visibility,
  colors,
  defaultColors,
  onToggle,
  onColorChange,
}: TeamLegendProps) {
  if (!teams.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        fontSize: 12,
        padding: "4px 0",
      }}
    >
      {title && (
        <span style={{ fontWeight: 600, marginRight: 8 }}>{title}</span>
      )}
      {teams.map((team) => {
        const checked = visibility[team] ?? true;
        const color = colors[team] ?? defaultColors[team] ?? "#000000";

        return (
          <label
            key={team}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 6px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: checked ? "#f9fafb" : "#f3f4f6",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(team)}
              style={{ marginRight: 2 }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: color,
                border: "1px solid #d1d5db",
              }}
            />
            <span>{team}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(team, e.target.value)}
              style={{
                marginLeft: 4,
                border: "none",
                background: "transparent",
                padding: 0,
                width: 18,
                height: 18,
                cursor: "pointer",
              }}
            />
          </label>
        );
      })}
    </div>
  );
}

interface ProductivityChartsProps {
  coffeeData: Record<string, number>[];
  snackData: Record<string, number>[];
}

export function ProductivityCharts({
  coffeeData,
  snackData,
}: ProductivityChartsProps) {
  // 커피 / 스낵 멀티라인용 Legend 상태
  const [coffeeTeamVisible, setCoffeeTeamVisible] = useState<
    Record<string, boolean>
  >({});
  const [coffeeTeamColors, setCoffeeTeamColors] = useState<
    Record<string, string>
  >({});

  const [snackTeamVisible, setSnackTeamVisible] = useState<
    Record<string, boolean>
  >({});
  const [snackTeamColors, setSnackTeamColors] = useState<
    Record<string, string>
  >({});

  const coffeeTeams = useMemo(() => {
    if (coffeeData.length === 0) return [];
    const sample = coffeeData[0];
    const keys = Object.keys(sample).filter((k) => k !== "cups");
    return Array.from(new Set(keys.map((k) => k.split("_")[0])));
  }, [coffeeData]);

  const snackTeams = useMemo(() => {
    if (snackData.length === 0) return [];
    const sample = snackData[0];
    const keys = Object.keys(sample).filter((k) => k !== "snacks");
    return Array.from(new Set(keys.map((k) => k.split("_")[0])));
  }, [snackData]);

  const getCoffeeColor = (team: string) =>
    coffeeTeamColors[team] ?? TEAM_COLOR_MAP[team] ?? "#000000";

  const getSnackColor = (team: string) =>
    snackTeamColors[team] ?? TEAM_COLOR_MAP[team] ?? "#000000";

  return (
    <>
      {/* 커피 소비 vs 버그/생산성 – 멀티라인 차트 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>
          커피 섭취량에 따른 팀별 버그 수 및 생산성
        </h2>
        <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
          커피 섭취량에 따른 팀별 버그 수(왼쪽 Y) 및 생산성(오른쪽 Y)
        </p>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={coffeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="cups"
                  label={{
                    value: "커피 잔수(잔/일)",
                    position: "insideBottom",
                    offset: -4,
                  }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "버그 수",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "생산성 점수",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip content={<CoffeeTooltip />} />
                <Legend
                  content={() => (
                    <TeamLegend
                      title="팀별 표시 / 색상"
                      teams={coffeeTeams}
                      visibility={coffeeTeamVisible}
                      colors={coffeeTeamColors}
                      defaultColors={TEAM_COLOR_MAP}
                      onToggle={(team) =>
                        setCoffeeTeamVisible((prev) => ({
                          ...prev,
                          [team]: !(prev[team] ?? true),
                        }))
                      }
                      onColorChange={(team, color) =>
                        setCoffeeTeamColors((prev) => ({
                          ...prev,
                          [team]: color,
                        }))
                      }
                    />
                  )}
                />
                {coffeeTeams.map((team) => {
                  const visible = coffeeTeamVisible[team] ?? true;
                  if (!visible) return null;

                  const color = getCoffeeColor(team);

                  return (
                    <g key={team}>
                      <Line
                        type="monotone"
                        dataKey={`${team}_bugs`}
                        name={`${team} - 버그`}
                        stroke={color}
                        strokeWidth={2}
                        dot={<CircleDot />}
                        yAxisId="left"
                      />

                      <Line
                        type="monotone"
                        dataKey={`${team}_productivity`}
                        name={`${team} - 생산성`}
                        stroke={color}
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={<SquareDot />}
                        yAxisId="right"
                      />
                    </g>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 스낵 섭취 vs 회의불참/사기 – 멀티라인 차트 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 8 }}>
          스낵 섭취량에 따른 부서별 회의 불참 및 사기
        </h2>
        <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
          스낵 섭취량에 따른 부서별 회의 불참(왼쪽 Y) 및 사기(오른쪽 Y)
        </p>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={snackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="snacks"
                  label={{
                    value: "스낵 수(개/일)",
                    position: "insideBottom",
                    offset: -4,
                  }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "회의 불참 수",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "사기 점수",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip content={<SnackTooltip />} />
                <Legend
                  content={() => (
                    <TeamLegend
                      title="부서별 표시 / 색상"
                      teams={snackTeams}
                      visibility={snackTeamVisible}
                      colors={snackTeamColors}
                      defaultColors={TEAM_COLOR_MAP}
                      onToggle={(team) =>
                        setSnackTeamVisible((prev) => ({
                          ...prev,
                          [team]: !(prev[team] ?? true),
                        }))
                      }
                      onColorChange={(team, color) =>
                        setSnackTeamColors((prev) => ({
                          ...prev,
                          [team]: color,
                        }))
                      }
                    />
                  )}
                />
                {snackTeams.map((team) => {
                  const visible = snackTeamVisible[team] ?? true;
                  if (!visible) return null;

                  const color = getSnackColor(team);

                  return (
                    <g key={team}>
                      <Line
                        type="monotone"
                        dataKey={`${team}_meetingsMissed`}
                        name={`${team} - 회의 불참`}
                        stroke={color}
                        strokeWidth={2}
                        dot={<CircleDot />}
                        yAxisId="left"
                      />

                      <Line
                        type="monotone"
                        dataKey={`${team}_morale`}
                        name={`${team} - 사기`}
                        stroke={color}
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={<SquareDot />}
                        yAxisId="right"
                      />
                    </g>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}
