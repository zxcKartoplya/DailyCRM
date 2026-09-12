<script lang="ts" setup>
import type { DepartmentDailies } from '~/types/dailies'
import { DAY_STATE_LABEL, DayState, dayState } from '~/types/dailies'

const { dailies } = defineProps<{ dailies: DepartmentDailies }>()

const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })

const columns = computed(() => {
	const first = dailies.employees[0]
	return (first?.days ?? []).map(day => ({
		date: day.date,
		label: dayFormat.format(new Date(day.date)),
		weekday: weekdayFormat.format(new Date(day.date)),
	}))
})

const legend = [DayState.Submitted, DayState.Draft, DayState.Missing, DayState.Off, DayState.Rest]

const cellTitle = (date: string, state: DayState) =>
	`${dayFormat.format(new Date(date))} — ${DAY_STATE_LABEL[state]}`

const missingCount = (employee: DepartmentDailies['employees'][number]) =>
	employee.days.filter(day => dayState(day) === DayState.Missing).length
</script>

<template>
	<div v-if="!dailies.employees.length" class="empty">
		В департаменте нет сотрудников
	</div>

	<div v-else class="grid">
		<div class="grid__scroll">
			<table class="sheet">
				<thead>
					<tr>
						<th class="sheet__name">Сотрудник</th>
						<th v-for="column in columns" :key="column.date" class="sheet__day">
							<span class="sheet__weekday">{{ column.weekday }}</span>
							<span class="sheet__date">{{ column.label }}</span>
						</th>
						<th class="sheet__total">Пропусков</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="employee in dailies.employees" :key="employee.user_id">
						<td class="sheet__name">{{ employee.user_name }}</td>
						<td v-for="day in employee.days" :key="day.date" class="sheet__cell">
							<span
								class="mark"
								:class="`mark--${dayState(day)}`"
								:title="cellTitle(day.date, dayState(day))"
							/>
						</td>
						<td class="sheet__total">{{ missingCount(employee) }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<ul class="legend">
			<li v-for="state in legend" :key="state" class="legend__item">
				<span class="mark" :class="`mark--${state}`" aria-hidden="true" />
				{{ DAY_STATE_LABEL[state] }}
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.empty {
	padding: var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	color: var(--text-3);
	font-size: var(--t-md);
}

.grid {
	&__scroll {
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
	}
}

.sheet {
	width: 100%;
	border-collapse: collapse;
	background-color: var(--surface);
	font-size: var(--t-sm);

	th,
	td {
		padding: var(--s-3) var(--s-2);
		border-bottom: 1px solid var(--border);
		text-align: center;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	&__name {
		width: 1%;
		padding-left: var(--s-4);
		white-space: nowrap;
		text-align: left;
	}

	&__day {
		min-width: 3.5rem;
	}

	&__weekday,
	&__date {
		display: block;
	}

	&__weekday {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__date {
		@include numeric;
		color: var(--text-2);
		font-size: var(--t-xs);
	}

	&__total {
		width: 1%;
		padding-right: var(--s-4);
		white-space: nowrap;

		@include numeric;
	}

	thead th {
		background-color: var(--surface-sunken);
		font-weight: 500;
	}
}

.mark {
	display: inline-block;
	width: 0.75rem;
	height: 0.75rem;
	border-radius: var(--r-sm);
	background-color: var(--surface-sunken);
	border: 1px solid var(--border-strong);

	&--submitted {
		background-color: var(--ok);
		border-color: var(--ok);
	}

	&--draft {
		background-color: var(--warn-weak);
		border-color: var(--warn);
	}

	&--missing {
		background-color: var(--err-weak);
		border-color: var(--err);
	}

	&--off {
		background-color: var(--surface-sunken);
		border-color: var(--border-strong);
	}

	&--rest {
		background-color: transparent;
		border-style: dashed;
	}
}

.legend {
	display: flex;
	flex-wrap: wrap;
	gap: var(--s-4);
	margin: var(--s-3) 0 0;
	padding: 0;
	list-style: none;
	color: var(--text-2);
	font-size: var(--t-xs);

	&__item {
		display: flex;
		align-items: center;
		gap: var(--s-2);
	}
}
</style>
