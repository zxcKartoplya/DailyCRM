<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useAnalyticsStore } from '~/stores/analytics'
import { useDailiesStore } from '~/stores/dailies'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
import { DayState } from '~/types/dailies'
import { alertMessage } from '~/utils/alertMessage'
import type { ChartSeries } from '~/utils/chart'
import { completionTimeseries } from '~/utils/completionTimeseries'
import { formatRate, hasSchedule, toIsoDate } from '~/utils/dailyStats'
import {
	departmentCompletion,
	employeeDayState,
	hasPeriodData,
	submissionSeries,
} from '~/utils/departmentDailies'

type SortKey = 'name' | 'job' | 'today' | 'rate' | 'streak' | 'missing' | 'blockers'
type SortDirection = 'asc' | 'desc'

const departamentsStore = useDepartamentsStore()
const dailiesStore = useDailiesStore()
const alertStore = useAlertStore()
const analyticsStore = useAnalyticsStore()
const { dailies, isLoading, hasDailiesError, periodDays } = storeToRefs(dailiesStore)
const { departmentTrend, isDepartmentTrendLoading, hasDepartmentTrendError } =
	storeToRefs(analyticsStore)
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const periods = [7, 14, 30]

const SKELETON_ROWS = 4
const GRID_SKELETON_ROWS = 3
const SPARK_WIDTH = 96
const SPARK_HEIGHT = 24
const STATS_COLUMNS = 5
const TREND_HEIGHT = 240
const TODAY_ORDER: DayState[] = [
	DayState.Submitted,
	DayState.Draft,
	DayState.Missing,
	DayState.Off,
	DayState.Rest,
]

await departamentsStore.fetchDepartament(id)
await Promise.all([
	dailiesStore.fetchDepartmentDailies(id),
	analyticsStore.fetchDepartmentTrend(id, periodDays.value),
])

const isRenaming = ref(false)
const renameError = ref('')

const rename = async (name: string) => {
	isRenaming.value = true
	renameError.value = ''

	try {
		await departamentsStore.putDepartament(id, { name })
		alertStore.showAlert(Alert.Added)
	} catch (error) {
		const message = alertMessage(error, Alert.AddedError)
		alertStore.showAlert(message)
		renameError.value = message
	} finally {
		isRenaming.value = false
	}
}

const cancelRename = () => {
	renameError.value = ''
}

const table: { heads: { title: string; sortId: SortKey | null }[]; gridColumns: string } = {
	heads: [
		{ title: 'Сотрудник', sortId: 'name' },
		{ title: 'Должность', sortId: 'job' },
		{ title: 'Сегодня', sortId: 'today' },
		{ title: 'Сдача', sortId: 'rate' },
		{ title: 'Серия', sortId: 'streak' },
		{ title: 'Пропуски', sortId: 'missing' },
		{ title: 'Блокеры', sortId: 'blockers' },
		{ title: 'Динамика', sortId: null },
		{ title: '', sortId: null },
	],
	gridColumns:
		'minmax(220px, 1.4fr) minmax(160px, 1fr) minmax(130px, 150px) minmax(150px, 180px) minmax(90px, 110px) minmax(100px, 120px) minmax(100px, 120px) 128px 56px',
}

const today = toIsoDate(new Date())

const employees = computed(() => dailies.value?.employees ?? [])

const summary = computed(() => departmentCompletion(employees.value))

const rows = computed(() =>
	employees.value.map(employee => {
		const hasData = hasPeriodData(employee.stats)

		return {
			employee,
			hasData,
			rate: hasData ? (employee.stats.completion_rate ?? null) : null,
			today: employeeDayState(employee, today),
			todayHint: hasSchedule(employee)
				? 'За сегодня данных нет'
				: 'У сотрудника не задан график работы',
			series: submissionSeries(employee.days),
		}
	}),
)

type Row = (typeof rows.value)[number]

const sortKey = ref<SortKey>('name')
const sortDirection = ref<SortDirection>('asc')

const sortValue = (row: Row, key: SortKey): string | number | null => {
	switch (key) {
		case 'name':
			return row.employee.user_name
		case 'job':
			return row.employee.job_name || null
		case 'today':
			return row.today ? TODAY_ORDER.indexOf(row.today) : null
		case 'rate':
			return row.rate
		case 'streak':
			return row.hasData ? row.employee.stats.streak : null
		case 'missing':
			return row.hasData ? row.employee.stats.missing : null
		case 'blockers':
			return row.hasData ? row.employee.stats.blockers : null
	}
}

const compareValues = (a: string | number, b: string | number): number =>
	typeof a === 'number' && typeof b === 'number'
		? a - b
		: String(a).localeCompare(String(b), 'ru')

const sortedRows = computed(() => {
	const direction = sortDirection.value === 'asc' ? 1 : -1

	return [...rows.value].sort((left, right) => {
		const a = sortValue(left, sortKey.value)
		const b = sortValue(right, sortKey.value)

		if (a === null && b !== null) return 1
		if (a !== null && b === null) return -1

		const order = a === null || b === null ? 0 : compareValues(a, b) * direction

		return order || compareValues(left.employee.user_name, right.employee.user_name)
	})
})

const toggleSort = (key: SortKey) => {
	if (sortKey.value === key) {
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
		return
	}

	sortKey.value = key
	sortDirection.value = 'asc'
}

const reloadDailies = () => dailiesStore.fetchDepartmentDailies(id)

const selectPeriod = (days: number) =>
	Promise.all([
		dailiesStore.setPeriod(days, id),
		analyticsStore.fetchDepartmentTrend(id, days),
	])

const trendChart = computed(() => completionTimeseries(departmentTrend.value))

const trendSeries = computed<ChartSeries[]>(() => [
	{ name: 'Сдача', data: trendChart.value.values, color: 'ok' },
])

const trendTooltip = (index: number) => trendChart.value.tooltips[index] ?? ''

const reloadTrend = () => analyticsStore.fetchDepartmentTrend(id, periodDays.value)

const goWorker = (userId: number) => {
	router.push(`/workers/${userId}`)
}

const editWorker = (userId: number) => {
	router.push(`/edit/workers?id=${userId}`)
}
</script>

<template>
	<section v-if="departamentsStore.departament" class="page">
		<header class="page__head">
			<h1 class="page__title">
				<UIInlineEdit
					:value="departamentsStore.departament.name"
					placeholder="Введите название департамента"
					aria-label="Название департамента"
					edit-label="Переименовать департамент"
					empty-text="Без названия"
					:error="renameError"
					:is-saving="isRenaming"
					@save="rename"
					@cancel="cancelRename"
				/>
			</h1>
		</header>

		<div class="toolbar">
			<span id="department-period" class="toolbar__label">Период</span>
			<div class="periods" role="group" aria-labelledby="department-period">
				<UIButton
					v-for="period in periods"
					:key="period"
					:variant="period === periodDays ? 'primary' : 'ghost'"
					@click="selectPeriod(period)"
				>
					{{ period }} дней
				</UIButton>
			</div>
		</div>

		<dl class="facts">
			<div class="facts__item">
				<dt class="facts__label">Сотрудников</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.employees_count ?? 0 }}
				</dd>
			</div>
			<div class="facts__item">
				<dt class="facts__label">Ролей</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.jobs_count ?? 0 }}
				</dd>
			</div>
			<div class="facts__item">
				<dt class="facts__label">Сдача за {{ periodDays }} дней</dt>
				<dd class="facts__value facts__value--numeric">
					<Skeleton v-if="isLoading" class="facts__bone" preserveAspectRatio="none">
						<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
					</Skeleton>
					<span v-else-if="hasDailiesError" class="facts__note">не загрузилось</span>
					<span
						v-else-if="summary.rate === null"
						class="facts__note"
						title="Ни у кого из сотрудников нет рабочих дней по графику за период"
					>
						нет данных за период
					</span>
					<template v-else>{{ formatRate(summary.rate) }}</template>
				</dd>
			</div>
			<div class="facts__item">
				<dt class="facts__label">Блокеров за {{ periodDays }} дней</dt>
				<dd
					class="facts__value facts__value--numeric"
					:class="{ 'facts__value--alert': !isLoading && (summary.blockers ?? 0) > 0 }"
				>
					<Skeleton v-if="isLoading" class="facts__bone" preserveAspectRatio="none">
						<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
					</Skeleton>
					<span v-else-if="hasDailiesError" class="facts__note">не загрузилось</span>
					<span v-else-if="summary.blockers === null" class="facts__note">
						нет данных за период
					</span>
					<template v-else>{{ summary.blockers }}</template>
				</dd>
			</div>
		</dl>

		<section class="section">
			<h2 class="section__title">Тренд за {{ periodDays }} дней</h2>

			<UIChartSkeleton v-if="isDepartmentTrendLoading" :height="TREND_HEIGHT" />

			<div v-else-if="hasDepartmentTrendError" class="state">
				<p class="state__text">
					Тренд сдачи за период не загрузился. Попробуйте ещё раз или выберите
					другой период.
				</p>
				<UIButton variant="outline" @click="reloadTrend">Повторить</UIButton>
			</div>

			<p v-else-if="!trendChart.hasData" class="section__empty">
				Нет данных за период: ни у кого из сотрудников не было рабочих дней по
				графику.
			</p>

			<UIChartLine
				v-else
				:series="trendSeries"
				:categories="trendChart.categories"
				:height="TREND_HEIGHT"
				:min="0"
				:max="100"
				value-suffix="%"
				:show-legend="false"
				:tooltip-value="trendTooltip"
			/>
		</section>

		<section class="section">
			<h2 class="section__title">Сотрудники</h2>

			<div v-if="hasDailiesError" class="state">
				<p class="state__text">
					Работа сотрудников за период не загрузилась. Попробуйте ещё раз или
					выберите другой период.
				</p>
				<UIButton variant="outline" @click="reloadDailies">Повторить</UIButton>
			</div>

			<UITableBase
				v-else
				:headList="table.heads"
				:columnTemplates="table.gridColumns"
				:is-empty="!isLoading && !rows.length"
				empty-text="В департаменте пока нет сотрудников. Когда их добавят, здесь появится, кто как работает."
				sortable
				:sort-key="sortKey"
				:sort-direction="sortDirection"
				@sort="toggleSort"
			>
				<template v-if="isLoading">
					<UITableRow
						v-for="index in SKELETON_ROWS"
						:key="`skeleton-${index}`"
						:columnTemplates="table.gridColumns"
					>
						<UITableColumn v-for="column in table.heads.length" :key="column">
							<Skeleton class="bone" preserveAspectRatio="none">
								<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
							</Skeleton>
						</UITableColumn>
					</UITableRow>
				</template>

				<UITableRow
					v-for="row in isLoading ? [] : sortedRows"
					:key="row.employee.user_id"
					:columnTemplates="table.gridColumns"
				>
					<UITableColumn>
						<div class="person">
							<UIAvatar
								:name="row.employee.user_name"
								:id="row.employee.user_id"
								size="sm"
							/>
							<NuxtLink class="person__name" :to="`/workers/${row.employee.user_id}`">
								{{ row.employee.user_name }}
							</NuxtLink>
						</div>
					</UITableColumn>
					<UITableColumn v-if="row.employee.job_name" :text="row.employee.job_name" isEllipsis />
					<UITableColumn v-else>
						<span class="note">не назначена</span>
					</UITableColumn>
					<UITableColumn>
						<UIDayStateCell :state="row.today" :empty-hint="row.todayHint" />
					</UITableColumn>

					<UITableColumn
						v-if="!row.hasData"
						:style="{ gridColumn: `span ${STATS_COLUMNS}` }"
					>
						<span
							class="note"
							title="За период у сотрудника нет ни одного рабочего дня по графику"
						>
							нет данных за период
						</span>
					</UITableColumn>
					<template v-else>
						<UITableColumn>
							<div class="completion">
								<span class="completion__track" aria-hidden="true">
									<span
										class="completion__fill"
										:style="{ width: formatRate(row.rate) }"
									/>
								</span>
								<span class="completion__value">{{ formatRate(row.rate) }}</span>
							</div>
						</UITableColumn>
						<UITableColumn :text="row.employee.stats.streak" isNumeric />
						<UITableColumn :text="row.employee.stats.missing" isNumeric />
						<UITableColumn>
							<span
								class="blockers"
								:class="{ 'blockers--alert': row.employee.stats.blockers > 0 }"
							>
								{{ row.employee.stats.blockers }}
							</span>
						</UITableColumn>
						<UITableColumn>
							<UIChartSparkline
								v-if="row.series.points > 1"
								:data="row.series.values"
								:labels="row.series.labels"
								:width="SPARK_WIDTH"
								:height="SPARK_HEIGHT"
								type="line"
								color="ok"
								series-name="Сдача"
								value-suffix="%"
							/>
							<span
								v-else
								class="note"
								title="Для графика нужно хотя бы два рабочих дня за период"
							>
								мало дней
							</span>
						</UITableColumn>
					</template>

					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть карточку',
									func: () => goWorker(row.employee.user_id),
								},
								{
									title: 'Изменить',
									func: () => editWorker(row.employee.user_id),
								},
							]"
						/>
					</UITableColumn>
				</UITableRow>
			</UITableBase>

			<details class="details">
				<summary class="details__summary">
					<span class="details__title">Дейлики по дням</span>
					<span class="details__hint">в какой именно день сдан, пропущен или был выходной</span>
				</summary>

				<div class="details__body">
					<div v-if="isLoading" class="grid-skeleton" aria-hidden="true">
						<Skeleton
							v-for="index in GRID_SKELETON_ROWS"
							:key="index"
							class="grid-skeleton__row"
							preserveAspectRatio="none"
						>
							<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
						</Skeleton>
					</div>
					<p v-else-if="hasDailiesError" class="note">
						Сетка не загрузилась вместе с данными за период.
					</p>
					<DailiesDepartmentGrid v-else-if="dailies" :dailies="dailies" />
				</div>
			</details>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.page__title {
	min-width: 0;

	:deep(.ui-inline-edit__text) {
		font: inherit;
		letter-spacing: inherit;
	}
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--s-3);
	margin-bottom: var(--s-4);

	&__label {
		@include label;
	}
}

.periods {
	display: flex;
	gap: var(--s-2);
}

.facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	gap: 1px;
	margin: 0;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--border);
	overflow: hidden;

	&__item {
		padding: var(--s-4);
		background-color: var(--surface);
	}

	&__label {
		@include label;
	}

	&__value {
		display: flex;
		align-items: center;
		min-height: 2rem;
		margin: var(--s-2) 0 0;
		font-size: var(--t-xl);
		font-weight: 500;

		&--numeric {
			@include numeric;
		}

		&--alert {
			color: var(--err);
		}
	}

	&__note {
		font-family: var(--font-ui);
		color: var(--text-3);
		font-size: var(--t-sm);
		font-weight: 400;
	}

	&__bone {
		width: 4rem;
		height: 1.5rem;
	}
}

.section {
	margin-top: var(--s-6);
	padding-top: var(--s-5);
	border-top: 1px solid var(--border);

	&__title {
		@include h4;
		margin-bottom: var(--s-4);
	}

	&__empty {
		padding: var(--s-4) 0;
		color: var(--text-3);
		font-size: var(--t-sm);
	}
}

.state {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: var(--s-3);
	padding: var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);

	&__text {
		color: var(--err);
		font-size: var(--t-md);
	}
}

.person {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	min-width: 0;

	&__name {
		min-width: 0;
		color: var(--accent-text);
		font-size: var(--t-md);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}
}

.note {
	color: var(--text-3);
	font-size: var(--t-xs);
}

.completion {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	min-width: 0;

	&__track {
		flex: 1;
		min-width: 3rem;
		height: 0.375rem;
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		overflow: hidden;
	}

	&__fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background-color: var(--ok);
	}

	&__value {
		@include numeric;
		flex: none;
		min-width: 2.75rem;
		color: var(--text-1);
		font-size: var(--t-md);
		font-weight: 500;
		text-align: right;
	}
}

.blockers {
	@include numeric;
	color: var(--text-2);
	font-size: var(--t-md);

	&--alert {
		color: var(--err);
		font-weight: 500;
	}
}

.bone {
	width: 100%;
	height: 1rem;
}

.details {
	margin-top: var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);

	&__summary {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--s-1) var(--s-3);
		padding: var(--s-3) var(--s-4);
		border-radius: var(--r-lg);
		cursor: pointer;
		list-style: none;
		transition: background-color var(--dur-fast) var(--ease);

		&::-webkit-details-marker {
			display: none;
		}

		&::before {
			content: '';
			align-self: center;
			width: 0.4rem;
			height: 0.4rem;
			border-right: 1.5px solid var(--text-3);
			border-bottom: 1.5px solid var(--text-3);
			transform: rotate(-45deg);
			transition: transform var(--dur-fast) var(--ease);
		}

		&:hover {
			background-color: var(--surface-hover);
		}

		&:focus-visible {
			@include focus-ring;
		}
	}

	&[open] > &__summary {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;

		&::before {
			transform: rotate(45deg);
		}
	}

	&__title {
		color: var(--text-1);
		font-size: var(--t-md);
		font-weight: 500;
	}

	&__hint {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__body {
		padding: 0 var(--s-4) var(--s-4);
	}
}

.grid-skeleton {
	display: grid;
	gap: var(--s-2);

	&__row {
		width: 100%;
		height: 2.5rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.details__summary,
	.details__summary::before {
		transition: none;
	}
}
</style>
