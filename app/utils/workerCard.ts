import type { ChartColorToken } from '~/composables/useChartTheme'
import type { DepartmentDailyDay, EntryItem, EntryItemStatus } from '~/types/dailies'
import { DAY_STATE_LABEL, DayState } from '~/types/dailies'
import type { ChartHeatmapCell, ChartHeatmapRange, ChartHeatmapRow } from '~/utils/chart'
import type { PeriodRange, WorkSchedule } from '~/utils/dailyStats'
import { currentDayState, fromIsoDate, hasSchedule, toIsoDate } from '~/utils/dailyStats'

export type WorkerHeatmapCell = ChartHeatmapCell & {
	date: string | null
	state: DayState | null
}

export type WorkerHeatmapRow = ChartHeatmapRow & {
	cells: WorkerHeatmapCell[]
}

export type WorkerFeedItem = EntryItem & {
	href: string | null
	linkText: string | null
}

export type WorkerFeedStatusCount = {
	status: EntryItemStatus
	count: number
}

export type WorkerFeedDay = {
	date: string
	state: DayState
	items: WorkerFeedItem[]
	summary: WorkerFeedStatusCount[]
}

const WEEK_LENGTH = 7
const SUNDAY_ISO = 7
const OUTSIDE_PERIOD_VALUE = -1
const NO_DATA_VALUE = -2
const MONDAY_REFERENCE = new Date(2024, 0, 1)
const SAFE_PROTOCOLS = ['http:', 'https:']
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export const ENTRY_ITEM_STATUS_ORDER: EntryItemStatus[] = [
	'blocked',
	'in_progress',
	'done',
	'dropped',
]

const DAY_STATE_HEATMAP: Record<DayState, { value: number; color: ChartColorToken }> = {
	[DayState.Rest]: { value: 0, color: 'neutral' },
	[DayState.Off]: { value: 1, color: 'muted' },
	[DayState.Missing]: { value: 2, color: 'err' },
	[DayState.Draft]: { value: 3, color: 'warn' },
	[DayState.Submitted]: { value: 4, color: 'ok' },
}

export const WORKER_HEATMAP_RANGES: ChartHeatmapRange[] = [
	{
		from: NO_DATA_VALUE,
		to: NO_DATA_VALUE,
		color: 'neutralWeak',
		label: 'Нет данных',
	},
	{
		from: OUTSIDE_PERIOD_VALUE,
		to: OUTSIDE_PERIOD_VALUE,
		color: 'neutralWeak',
		label: 'Вне периода',
	},
	...Object.values(DayState).map(state => ({
		from: DAY_STATE_HEATMAP[state].value,
		to: DAY_STATE_HEATMAP[state].value,
		color: DAY_STATE_HEATMAP[state].color,
		label: DAY_STATE_LABEL[state],
	})),
]

const shortDateFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
})

const shortDateWithYearFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
})

const feedDayFormat = new Intl.DateTimeFormat('ru-RU', {
	weekday: 'short',
	day: 'numeric',
	month: 'long',
})

const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
})

const weekdayFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })

const isoWeekday = (date: Date): number => date.getDay() || SUNDAY_ISO

const parseDateValue = (value: string): Date | null => {
	const date = DATE_ONLY.test(value) ? fromIsoDate(value) : new Date(value)

	return Number.isNaN(date.getTime()) ? null : date
}

export const weekdayLabel = (isoDay: number): string => {
	const date = new Date(MONDAY_REFERENCE)
	date.setDate(MONDAY_REFERENCE.getDate() + isoDay - 1)

	return weekdayFormat.format(date)
}

export const formatShortDate = (value: string, now: Date = new Date()): string => {
	const date = parseDateValue(value)

	if (!date) return ''

	const format =
		date.getFullYear() === now.getFullYear() ? shortDateFormat : shortDateWithYearFormat

	return format.format(date)
}

export const formatDateTime = (value: string): string => {
	const date = parseDateValue(value)

	return date ? dateTimeFormat.format(date) : ''
}

export const formatFeedDay = (date: string): string =>
	feedDayFormat.format(fromIsoDate(date))

const weekLabel = (dates: string[]): string => {
	const first = dates[0]
	const last = dates[dates.length - 1]

	if (!first || !last) return ''

	const start = shortDateFormat.format(fromIsoDate(first))

	if (first === last) return start

	return `${start} — ${shortDateFormat.format(fromIsoDate(last))}`
}

const heatmapValue = (inPeriod: boolean, state: DayState | null): number => {
	if (!inPeriod) return OUTSIDE_PERIOD_VALUE

	return state ? DAY_STATE_HEATMAP[state].value : NO_DATA_VALUE
}

export const workerHeatmapRows = (
	range: PeriodRange,
	schedule?: WorkSchedule | null,
	days: DepartmentDailyDay[] = [],
): WorkerHeatmapRow[] => {
	const byDate = new Map(days.map(day => [day.date, day]))
	const end = fromIsoDate(range.to)
	const cursor = fromIsoDate(range.from)
	const rows: WorkerHeatmapRow[] = []

	cursor.setDate(cursor.getDate() - (isoWeekday(cursor) - 1))

	while (cursor <= end) {
		const cells: WorkerHeatmapCell[] = []
		const periodDates: string[] = []

		for (let weekday = 1; weekday <= WEEK_LENGTH; weekday += 1) {
			const date = toIsoDate(cursor)
			const inPeriod = date >= range.from && date <= range.to
			const state = inPeriod ? currentDayState(byDate.get(date), schedule) : null

			if (inPeriod) periodDates.push(date)

			cells.push({
				label: weekdayLabel(weekday),
				value: heatmapValue(inPeriod, state),
				date: inPeriod ? date : null,
				state,
			})

			cursor.setDate(cursor.getDate() + 1)
		}

		rows.unshift({ name: weekLabel(periodDates), cells })
	}

	return rows
}

const safeHref = (link?: string | null): string | null => {
	const value = link?.trim()

	if (!value) return null

	try {
		const url = new URL(value)

		return SAFE_PROTOCOLS.includes(url.protocol) ? url.href : null
	} catch {
		return null
	}
}

const hrefLabel = (href: string): string => {
	const url = new URL(href)
	const path = url.pathname === '/' ? '' : url.pathname

	return `${url.host}${path}${url.search}`
}

const toFeedItem = (item: EntryItem): WorkerFeedItem => {
	const href = safeHref(item.link)

	return {
		...item,
		href,
		linkText: href ? hrefLabel(href) : item.link?.trim() || null,
	}
}

const statusSummary = (items: EntryItem[]): WorkerFeedStatusCount[] =>
	ENTRY_ITEM_STATUS_ORDER.map(status => ({
		status,
		count: items.filter(item => item.status === status).length,
	})).filter(({ count }) => count > 0)

export const workerFeedDays = (
	days: DepartmentDailyDay[],
	schedule?: WorkSchedule | null,
): WorkerFeedDay[] =>
	days
		.flatMap((day): WorkerFeedDay[] => {
			const items = day.entry?.items ?? []
			const state = currentDayState(day, schedule)

			if (!items.length || !state) return []

			return [
				{
					date: day.date,
					state,
					items: [...items]
						.sort((left, right) => left.position - right.position)
						.map(toFeedItem),
					summary: statusSummary(items),
				},
			]
		})
		.sort((left, right) => right.date.localeCompare(left.date))

export const feedCountToReveal = (
	index: number,
	current: number,
	pageSize: number,
): number => Math.max(current, Math.ceil((index + 1) / pageSize) * pageSize)

export const workScheduleLabel = (schedule?: WorkSchedule | null): string | null => {
	if (!hasSchedule(schedule)) return null

	return [...(schedule?.work_days ?? [])]
		.sort((left, right) => left - right)
		.map(weekdayLabel)
		.join(', ')
}
