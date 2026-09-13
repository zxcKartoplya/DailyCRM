import type { DepartmentDailyDay, DepartmentDailyEmployee } from '~/types/dailies'
import { DayState, dayState } from '~/types/dailies'
import { currentDayState, fromIsoDate } from '~/utils/dailyStats'

export type DepartmentDailyStats = DepartmentDailyEmployee['stats']

export type DepartmentCompletion = {
	workingDays: number
	submitted: number
	rate: number | null
	blockers: number | null
}

export type SubmissionSeries = {
	labels: string[]
	values: (number | null)[]
	points: number
}

const SUBMITTED_VALUE = 100
const NOT_SUBMITTED_VALUE = 0

const seriesLabelFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
})

export const hasPeriodData = (stats: DepartmentDailyStats): boolean =>
	stats.working_days > 0 &&
	stats.completion_rate !== null &&
	stats.completion_rate !== undefined

export const departmentCompletion = (
	employees: DepartmentDailyEmployee[],
): DepartmentCompletion => {
	const totals = employees.reduce(
		(sum, { stats }) => ({
			workingDays: sum.workingDays + stats.working_days,
			submitted: sum.submitted + stats.submitted,
			blockers: sum.blockers + stats.blockers,
		}),
		{ workingDays: 0, submitted: 0, blockers: 0 },
	)

	return {
		workingDays: totals.workingDays,
		submitted: totals.submitted,
		rate: totals.workingDays ? totals.submitted / totals.workingDays : null,
		blockers: employees.length ? totals.blockers : null,
	}
}

export const employeeDayState = (
	employee: DepartmentDailyEmployee,
	date: string,
): DayState | null =>
	currentDayState(
		employee.days.find(day => day.date === date),
		employee,
	)

const submissionValue = (day: DepartmentDailyDay): number | null => {
	const state = dayState(day)

	if (state === DayState.Rest || state === DayState.Off) return null

	return state === DayState.Submitted ? SUBMITTED_VALUE : NOT_SUBMITTED_VALUE
}

export const submissionSeries = (days: DepartmentDailyDay[]): SubmissionSeries => {
	const values = days.map(submissionValue)

	return {
		labels: days.map(day => seriesLabelFormat.format(fromIsoDate(day.date))),
		values,
		points: values.filter(value => value !== null).length,
	}
}
