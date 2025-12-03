import { apiRequest } from "./client";

export interface SnackBrandStat {
  name: string;
  share: number;
  [key: string]: string | number;
}

export interface WeeklyMoodTrend {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
  [key: string]: string | number;
}

export interface WeeklyWorkoutTrend {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
  [key: string]: string | number;
}

export interface CoffeeSeriesPoint {
  cups: number;
  bugs: number;
  productivity: number;
  [key: string]: number;
}

export interface CoffeeTeamSeries {
  team: string;
  series: CoffeeSeriesPoint[];
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeTeamSeries[];
}

export interface SnackMetricPoint {
  snacks: number;
  meetingsMissed: number;
  morale: number;
  [key: string]: number;
}

export interface SnackDepartmentSeries {
  name: string;
  metrics: SnackMetricPoint[];
}

export interface SnackImpactResponse {
  departments: SnackDepartmentSeries[];
}

export async function fetchPopularSnackBrands() {
  return apiRequest<SnackBrandStat[]>("/mock/popular-snack-brands", {
    method: "GET",
    auth: false,
  });
}

export async function fetchWeeklyMoodTrend() {
  return apiRequest<WeeklyMoodTrend[]>("/mock/weekly-mood-trend", {
    method: "GET",
    auth: false,
  });
}

export async function fetchWeeklyWorkoutTrend() {
  return apiRequest<WeeklyWorkoutTrend[]>("/mock/weekly-workout-trend", {
    method: "GET",
    auth: false,
  });
}

export async function fetchCoffeeConsumption() {
  return apiRequest<CoffeeConsumptionResponse>("/mock/coffee-consumption", {
    method: "GET",
    auth: false,
  });
}

export async function fetchSnackImpact() {
  return apiRequest<SnackImpactResponse>("/mock/snack-impact", {
    method: "GET",
    auth: false,
  });
}
