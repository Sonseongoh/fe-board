import type {
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from "../api/mockCharts";

// 데이터 평탄화
export function buildCoffeeChartData(resp: CoffeeConsumptionResponse) {
  if (!resp.teams.length) return [];

  const length = resp.teams[0].series.length;
  const result: Array<Record<string, number>> = [];

  for (let i = 0; i < length; i++) {
    const row: Record<string, number> = {};
    row.cups = resp.teams[0].series[i].cups;

    for (const team of resp.teams) {
      const point = team.series[i];
      const prefix = team.team;

      row[`${prefix}_bugs`] = point.bugs;
      row[`${prefix}_productivity`] = point.productivity;
    }

    result.push(row);
  }

  return result;
}
// 데이터 평탄화
export function buildSnackImpactChartData(resp: SnackImpactResponse) {
  if (!resp.departments.length) return [];

  const length = resp.departments[0].metrics.length;
  const result: Array<Record<string, number>> = [];

  for (let i = 0; i < length; i++) {
    const row: Record<string, number> = {};
    row.snacks = resp.departments[0].metrics[i].snacks;

    for (const dept of resp.departments) {
      const point = dept.metrics[i];
      const prefix = dept.name;

      row[`${prefix}_meetingsMissed`] = point.meetingsMissed;
      row[`${prefix}_morale`] = point.morale;
    }

    result.push(row);
  }

  return result;
}
