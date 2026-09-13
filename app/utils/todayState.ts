import type { TodayState } from '~/types/analytics'
import { DayState } from '~/types/dailies'

export type DayStateCounts = Record<DayState, number>

export type TodaySummary = {
	counts: DayStateCounts
	total: number
	expected: number
	known: number
}

export const countTodayStates = (states: TodayState[]): DayStateCounts => {
	const counts: DayStateCounts = {
		[DayState.Submitted]: 0,
		[DayState.Draft]: 0,
		[DayState.Missing]: 0,
		[DayState.Off]: 0,
		[DayState.Rest]: 0,
	}

	for (const item of states) {
		counts[item.state] += 1
	}

	return counts
}

export const summarizeToday = (states: TodayState[]): TodaySummary => {
	const counts = countTodayStates(states)

	const expected =
		counts[DayState.Submitted] + counts[DayState.Draft] + counts[DayState.Missing]

	return {
		counts,
		total: states.length,
		expected,
		known: expected + counts[DayState.Off],
	}
}

export const todayLede = ({ counts, total, expected, known }: TodaySummary): string => {
	if (!total) return 'Сотрудников пока нет'
	if (!known) return 'Сегодня у всех выходной'
	if (!expected) return 'Сегодня у всех отгул или выходной'

	return `Сегодня сдали ${counts[DayState.Submitted]} из ${expected}`
}

export const todayStatesByUser = (states: TodayState[]): Map<number, TodayState> =>
	new Map(states.map(item => [item.user_id, item]))
