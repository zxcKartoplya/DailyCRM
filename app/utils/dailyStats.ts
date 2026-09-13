import type { Schemas } from '~/types/api'
import type { DailyEntry, DepartmentDailyDay } from '~/types/dailies'
import { DayState, dayState } from '~/types/dailies'

export type WorkSchedule = {
	schedule_type: Schemas['ScheduleType']
	work_days?: number[] | null
}

export type PeriodRange = {
	from: string
	to: string
}

export type PeriodStats = {
	workingDays: number
	submitted: number
	draft: number
	missing: number
	off: number
	rate: number | null
}

export type CompletionPoint = {
	label: string
	value: number | null
}

export type DayStateCounts = Record<DayState, number>

export type TodayStats = {
	counts: DayStateCounts
	expected: number
	known: number
}

const WEEKLY_SCHEDULE: Schemas['ScheduleType'] = 'weekly'
const SUNDAY_ISO = 7
const TREND_BUCKET_DAYS = 7

const dayLabelFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
})

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

export const eachDate = ({ from, to }: PeriodRange): string[] => {
	const cursor = fromIsoDate(from)
	const end = fromIsoDate(to)
	const dates: string[] = []

	while (cursor <= end) {
		dates.push(toIsoDate(cursor))
		cursor.setDate(cursor.getDate() + 1)
	}

	return dates
}

export const hasSchedule = (schedule?: WorkSchedule | null): boolean =>
	schedule?.schedule_type === WEEKLY_SCHEDULE && Boolean(schedule.work_days?.length)

export const isWorkingDay = (
	date: string,
	schedule?: WorkSchedule | null,
): boolean => {
	if (!hasSchedule(schedule)) return false

	const weekday = fromIsoDate(date).getDay()

	return Boolean(schedule?.work_days?.includes(weekday === 0 ? SUNDAY_ISO : weekday))
}

export const groupEntriesByUser = (
	entries: DailyEntry[],
): Map<number, Map<string, DailyEntry>> => {
	const grouped = new Map<number, Map<string, DailyEntry>>()

	for (const entry of entries) {
		const byDate = grouped.get(entry.user_id) ?? new Map<string, DailyEntry>()
		byDate.set(entry.date, entry)
		grouped.set(entry.user_id, byDate)
	}

	return grouped
}

export const buildDays = (
	dates: string[],
	schedule?: WorkSchedule | null,
	entries?: Map<string, DailyEntry>,
): DepartmentDailyDay[] =>
	dates.map(date => ({
		date,
		is_working_day: isWorkingDay(date, schedule),
		entry: entries?.get(date) ?? null,
	}))

export const currentDayState = (
	day?: DepartmentDailyDay,
	schedule?: WorkSchedule | null,
): DayState | null => {
	if (!day) return null
	if (hasSchedule(schedule)) return dayState(day)
	if (!day.entry) return null

	return dayState({ ...day, is_working_day: true })
}

export const stateOnDate = (
	date: string,
	schedule?: WorkSchedule | null,
	entries?: Map<string, DailyEntry>,
): DayState | null =>
	currentDayState(buildDays([date], schedule, entries)[0], schedule)

export const countDayStates = (states: (DayState | null)[]): DayStateCounts => {
	const counts: DayStateCounts = {
		[DayState.Submitted]: 0,
		[DayState.Draft]: 0,
		[DayState.Missing]: 0,
		[DayState.Off]: 0,
		[DayState.Rest]: 0,
	}

	for (const state of states) {
		if (state) counts[state] += 1
	}

	return counts
}

export const dayStats = <T extends WorkSchedule & { id: number }>(
	date: string,
	people: T[],
	entriesByUser: Map<number, Map<string, DailyEntry>>,
): TodayStats => {
	const counts = countDayStates(
		people.map(person =>
			stateOnDate(date, person, entriesByUser.get(person.id)),
		),
	)

	const expected =
		counts[DayState.Submitted] + counts[DayState.Draft] + counts[DayState.Missing]

	return {
		counts,
		expected,
		known: expected + counts[DayState.Off],
	}
}

export const periodStats = (days: DepartmentDailyDay[]): PeriodStats => {
	const working = days.filter(day => day.is_working_day)
	const states = working.map(dayState)
	const count = (state: DayState) => states.filter(item => item === state).length
	const submitted = count(DayState.Submitted)

	return {
		workingDays: working.length,
		submitted,
		draft: count(DayState.Draft),
		missing: count(DayState.Missing),
		off: count(DayState.Off),
		rate: working.length ? submitted / working.length : null,
	}
}

const bucketLabel = (dates: string[]): string => {
	const first = dates[0]
	const last = dates[dates.length - 1]

	if (!first || !last) return ''

	const start = dayLabelFormat.format(fromIsoDate(first))

	if (first === last) return start

	return `${start} — ${dayLabelFormat.format(fromIsoDate(last))}`
}

export const completionTrend = (
	dates: string[],
	rows: DepartmentDailyDay[][],
	bucketDays: number = TREND_BUCKET_DAYS,
): CompletionPoint[] => {
	const points: CompletionPoint[] = []

	for (let end = dates.length; end > 0; end -= bucketDays) {
		const start = Math.max(0, end - bucketDays)
		const bucket = rows.flatMap(days => days.slice(start, end))
		const { rate } = periodStats(bucket)

		points.unshift({
			label: bucketLabel(dates.slice(start, end)),
			value: rate === null ? null : Math.round(rate * 100),
		})
	}

	return points
}

export const formatRate = (rate: number | null): string =>
	rate === null ? '' : `${Math.round(rate * 100)}%`

export const groupWorkersByDepartment = <T extends { department_id?: number | null }>(
	workers: T[],
): Map<number, T[]> => {
	const grouped = new Map<number, T[]>()

	for (const worker of workers) {
		if (worker.department_id === null || worker.department_id === undefined) continue

		const list = grouped.get(worker.department_id) ?? []
		list.push(worker)
		grouped.set(worker.department_id, list)
	}

	return grouped
}
