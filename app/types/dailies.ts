import type { Schemas } from '~/types/api'

export type DepartmentDailies = Schemas['DepartmentDailies']
export type DepartmentDailyEmployee = Schemas['DepartmentDailyEmployee']
export type DepartmentDailyDay = Schemas['DepartmentDailyDay']
export type DailyEntry = Schemas['DailyEntry']

export enum DayState {
	Off = 'off',
	Rest = 'rest',
	Submitted = 'submitted',
	Draft = 'draft',
	Missing = 'missing',
}

export const DAY_STATE_LABEL: Record<DayState, string> = {
	[DayState.Off]: 'Отгул',
	[DayState.Rest]: 'Выходной',
	[DayState.Submitted]: 'Работает',
	[DayState.Draft]: 'Заполняет',
	[DayState.Missing]: 'Пропускает',
}

export function dayState(day: DepartmentDailyDay): DayState {
	if (!day.is_working_day) return DayState.Rest
	if (!day.entry) return DayState.Missing
	if (day.entry.day_type === 'off') return DayState.Off
	return day.entry.status === 'submitted' ? DayState.Submitted : DayState.Draft
}
