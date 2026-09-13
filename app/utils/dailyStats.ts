import type { Schemas } from '~/types/api'
import type { DepartmentDailyDay } from '~/types/dailies'
import { DayState, dayState } from '~/types/dailies'

export type WorkSchedule = {
	schedule_type: Schemas['ScheduleType']
	work_days?: number[] | null
}

export type PeriodRange = {
	from: string
	to: string
}

const WEEKLY_SCHEDULE: Schemas['ScheduleType'] = 'weekly'

export const toIsoDate = (date: Date): string => {
	const month = `${date.getMonth() + 1}`.padStart(2, '0')
	const day = `${date.getDate()}`.padStart(2, '0')

	return `${date.getFullYear()}-${month}-${day}`
}

export const fromIsoDate = (value: string): Date => {
	const [year, month, day] = value.split('-').map(Number)

	return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export const periodRange = (days: number, end: Date = new Date()): PeriodRange => {
	const from = new Date(end)
	from.setDate(end.getDate() - (days - 1))

	return { from: toIsoDate(from), to: toIsoDate(end) }
}

export const hasSchedule = (schedule?: WorkSchedule | null): boolean =>
	schedule?.schedule_type === WEEKLY_SCHEDULE && Boolean(schedule.work_days?.length)

export const currentDayState = (
	day?: DepartmentDailyDay,
	schedule?: WorkSchedule | null,
): DayState | null => {
	if (!day) return null
	if (hasSchedule(schedule)) return dayState(day)
	if (!day.entry) return null

	return dayState({ ...day, is_working_day: true })
}

export const formatRate = (rate: number | null): string =>
	rate === null ? '' : `${Math.round(rate * 100)}%`
