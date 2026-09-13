import type { Schemas } from '~/types/api'
import type { DayState } from '~/types/dailies'

export type DepartmentAnalytics = Schemas['DepartmentAnalytics']
export type AnalyticsOverview = Schemas['AnalyticsOverview']
export type AnalyticsTimeseriesPoint = Schemas['AnalyticsTimeseriesPoint']
export type TodayState = Omit<Schemas['TodayState'], 'state'> & { state: DayState }
