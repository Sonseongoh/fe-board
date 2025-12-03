import { useEffect, useMemo, useState } from "react";
import {
  fetchPopularSnackBrands,
  fetchWeeklyMoodTrend,
  fetchWeeklyWorkoutTrend,
  fetchCoffeeConsumption,
  fetchSnackImpact,
  type SnackBrandStat,
  type WeeklyMoodTrend,
  type WeeklyWorkoutTrend,
} from "../api/mockCharts";
import {
  buildCoffeeChartData,
  buildSnackImpactChartData,
} from "../utils/prepareMultiLineData";

import { SnackBrandCharts } from "../components/charts/SnackBrandCharts";
import { MoodWorkoutCharts } from "../components/charts/MoodWorkoutCharts";
import { ProductivityCharts } from "../components/charts/ProductivityCharts";

export function ChartsPage() {
  const [snackData, setSnackData] = useState<SnackBrandStat[]>([]);
  const [moodData, setMoodData] = useState<WeeklyMoodTrend[]>([]);
  const [workoutData, setWorkoutData] = useState<WeeklyWorkoutTrend[]>([]);

  const [coffeeChartData, setCoffeeChartData] = useState<
    Record<string, number>[]
  >([]);
  const [snackChartData, setSnackChartData] = useState<
    Record<string, number>[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [snacks, mood, workout, coffee, snackImpact] = await Promise.all([
          fetchPopularSnackBrands(),
          fetchWeeklyMoodTrend(),
          fetchWeeklyWorkoutTrend(),
          fetchCoffeeConsumption(),
          fetchSnackImpact(),
        ]);

        setSnackData(snacks);
        setMoodData(mood);
        setWorkoutData(workout);

        const coffeeData = buildCoffeeChartData(coffee);
        const snackData2 = buildSnackImpactChartData(snackImpact);

        setCoffeeChartData(coffeeData);
        setSnackChartData(snackData2);
      } catch (err) {
        console.error(err);
        setError("차트 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const moodSummary = useMemo(() => {
    if (moodData.length === 0) return [];
    let happy = 0;
    let tired = 0;
    let stressed = 0;

    for (const row of moodData) {
      happy += row.happy;
      tired += row.tired;
      stressed += row.stressed;
    }

    return [
      { mood: "happy", value: happy },
      { mood: "tired", value: tired },
      { mood: "stressed", value: stressed },
    ];
  }, [moodData]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>데이터 시각화 대시보드</h1>

      {loading && <p>로딩중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <SnackBrandCharts data={snackData} />
      <MoodWorkoutCharts
        moodData={moodData}
        workoutData={workoutData}
        moodSummary={moodSummary}
      />
      <ProductivityCharts
        coffeeData={coffeeChartData}
        snackData={snackChartData}
      />
    </div>
  );
}
