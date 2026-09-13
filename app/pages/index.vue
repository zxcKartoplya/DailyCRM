<script lang="ts" setup>
import type { ChartColorToken } from '~/composables/useChartTheme'
import { useAnalyticsStore } from '~/stores/analytics'
import { useWorkerStore } from '~/stores/workers'
import { DAY_STATE_LABEL, DayState } from '~/types/dailies'
import { Statuses } from '~/types/users'
import type { ChartSeries } from '~/utils/chart'
import { completionTimeseries } from '~/utils/completionTimeseries'
import { completionRate } from '~/utils/completionTrend'
import { formatRate } from '~/utils/dailyStats'
import { summarizeToday, todayLede } from '~/utils/todayState'

const PERIOD_DAYS = 30
const TOP_DEPARTMENTS = 6
const RECENT_WORKERS = 6
const SKELETON_ROWS = 4
const DONUT_HEIGHT = 220
const TREND_HEIGHT = 240

const DONUT_STATES = [
	DayState.Submitted,
	DayState.Draft,
	DayState.Missing,
	DayState.Off,
]

const DONUT_COLORS: ChartColorToken[] = ['ok', 'warn', 'err', 'muted']

const router = useRouter()
const analyticsStore = useAnalyticsStore()
const workersStore = useWorkerStore()

const {
	overview,
	isOverviewLoading,
	hasOverviewError,
	departments: departmentAnalytics,
	isLoading: isDepartmentAnalyticsLoading,
	hasError: hasDepartmentAnalyticsError,
	teamTrend,
	isTeamTrendLoading,
	hasTeamTrendError,
	today: todayStates,
	todayByUser,
	isTodayLoading,
	hasTodayError,
} = storeToRefs(analyticsStore)
const { workers, isWorkersLoading, hasWorkersError } = storeToRefs(workersStore)

const { pluralize } = usePluralize()

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'long',
})

const todayStats = computed(() => summarizeToday(todayStates.value))

const daySegments = computed(() =>
	DONUT_STATES.map(state => ({
		state,
		label: DAY_STATE_LABEL[state],
		value: todayStats.value.counts[state],
	})),
)

const donutLabels = computed(() => daySegments.value.map(item => item.label))

const donutData = computed(() => daySegments.value.map(item => item.value))

const lede = computed(() =>
	hasTodayError.value ? 'Состояние дня не загрузилось' : todayLede(todayStats.value),
)

const summary = computed(() => {
	const data = overview.value
	if (!data) return []

	const facts = [
		`${data.employees_count} ${pluralize(data.employees_count, ['сотрудник', 'сотрудника', 'сотрудников'])}`,
		`${data.departments_count} ${pluralize(data.departments_count, ['департамент', 'департамента', 'департаментов'])}`,
		`${data.entries_count} ${pluralize(data.entries_count, ['дейлик', 'дейлика', 'дейликов'])} всего`,
	]

	if (data.last_entry_at) {
		facts.push(
			`последний — ${dateFormat.format(new Date(data.last_entry_at))}`,
		)
	}

	return facts
})

const trendChart = computed(() => completionTimeseries(teamTrend.value))

const trendSeries = computed<ChartSeries[]>(() => [
	{ name: 'Сдача', data: trendChart.value.values, color: 'ok' },
])

const trendTooltip = (index: number) => trendChart.value.tooltips[index] ?? ''

const reloadTrend = () => analyticsStore.fetchTeamTrend(PERIOD_DAYS)

const reloadToday = () => analyticsStore.fetchToday()

const departmentRows = computed(() =>
	departmentAnalytics.value
		.map(item => ({
			id: item.department_id,
			name: item.department_name,
			employees: item.employees_count,
			rate: completionRate(item),
		}))
		.sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1))
		.slice(0, TOP_DEPARTMENTS),
)

const attention = computed(() => {
	const data = overview.value
	if (!data) return []

	return [
		{
			key: 'blockers',
			value: data.blocked_items_last_30_days,
			label: `${pluralize(data.blocked_items_last_30_days, ['блокер', 'блокера', 'блокеров'])} за 30 дней`,
			to: '/departments',
			linkText: 'Департаменты',
		},
		{
			key: 'chains',
			value: data.open_chains_count,
			label: `${pluralize(data.open_chains_count, ['зависшая цепочка', 'зависшие цепочки', 'зависших цепочек'])}`,
			to: '/departments',
			linkText: 'Департаменты',
		},
	].filter(item => item.value > 0)
})

const isAttentionVisible = computed(
	() => isOverviewLoading.value || hasOverviewError.value || attention.value.length > 0,
)

const recentWorkers = computed(() =>
	[...workers.value]
		.sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		)
		.slice(0, RECENT_WORKERS)
		.map(worker => ({
			worker,
			accessMark: worker.status === Statuses.ACTIVE ? null : worker.status,
			state: todayByUser.value.get(worker.id)?.state ?? null,
		})),
)

const goDayState = (state: DayState) => {
	router.push({ path: '/workers', query: { state } })
}

const selectSegment = (index: number) => {
	const segment = daySegments.value[index]
	if (segment) goDayState(segment.state)
}

onMounted(() => {
	analyticsStore.fetchOverview()
	analyticsStore.fetchDepartments()
	analyticsStore.fetchTeamTrend(PERIOD_DAYS)
	analyticsStore.fetchToday()
	workersStore.getWorkers()
})

useSeoMeta({
	title: 'Главная страница - DailyCRM',
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<div>
				<h1 class="page__title">Команда</h1>
				<p class="page__lede">
					<Skeleton v-if="isTodayLoading" class="lede-bone" preserveAspectRatio="none">
						<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
					</Skeleton>
					<template v-else>{{ lede }}</template>
				</p>
			</div>
			<UIButton @click="router.push('/edit/workers')">
				Добавить сотрудника
			</UIButton>
		</header>

		<p class="summary">
			<Skeleton v-if="isOverviewLoading" class="summary__bone" preserveAspectRatio="none">
				<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
			</Skeleton>
			<template v-else-if="hasOverviewError">Сводка не загрузилась</template>
			<template v-else>{{ summary.join(' · ') }}</template>
		</p>

		<div class="columns">
			<div class="columns__side">
				<section class="block">
					<header class="block__head">
						<h2 class="block__title">Сегодня</h2>
						<NuxtLink class="block__link" to="/workers">Все сотрудники</NuxtLink>
					</header>

					<UIChartSkeleton v-if="isTodayLoading" :height="DONUT_HEIGHT" />

					<div v-else-if="hasTodayError" class="block__error">
						<p class="block__empty">Состояние дня не загрузилось.</p>
						<UIButton variant="outline" @click="reloadToday">Повторить</UIButton>
					</div>

					<p v-else-if="!todayStats.total" class="block__empty">
						Сотрудников пока нет — состояние дня появится вместе с ними.
					</p>

					<p v-else-if="!todayStats.known" class="block__empty">
						Сегодня у всех выходной по графику.
					</p>

					<div v-else class="today">
						<UIChartDonut
							class="today__chart"
							:labels="donutLabels"
							:data="donutData"
							:colors="DONUT_COLORS"
							:height="DONUT_HEIGHT"
							:show-legend="false"
							total-label="Всего"
							:total-value="todayStats.known"
							@select="selectSegment"
						/>

						<ul class="today__list">
							<li v-for="segment in daySegments" :key="segment.state">
								<NuxtLink
									class="today__row"
									:to="{ path: '/workers', query: { state: segment.state } }"
								>
									<UIDayState :state="segment.state" />
									<span class="today__value">{{ segment.value }}</span>
								</NuxtLink>
							</li>
						</ul>
					</div>
				</section>

				<section class="block">
					<header class="block__head">
						<h2 class="block__title">Тренд за {{ PERIOD_DAYS }} дней</h2>
					</header>

					<UIChartSkeleton v-if="isTeamTrendLoading" :height="TREND_HEIGHT" />

					<div v-else-if="hasTeamTrendError" class="block__error">
						<p class="block__empty">Тренд сдачи за {{ PERIOD_DAYS }} дней не загрузился.</p>
						<UIButton variant="outline" @click="reloadTrend">Повторить</UIButton>
					</div>

					<p v-else-if="!trendChart.hasData" class="block__empty">
						Нет данных за период: за {{ PERIOD_DAYS }} дней ни у кого не было рабочих
						дней по графику.
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

				<section class="block">
					<header class="block__head">
						<h2 class="block__title">Департаменты</h2>
						<NuxtLink class="block__link" to="/departments">Все</NuxtLink>
					</header>

					<ul v-if="isDepartmentAnalyticsLoading" class="bars">
						<li v-for="index in SKELETON_ROWS" :key="`bar-${index}`" class="bars__item">
							<div class="bars__row">
								<Skeleton class="bone" preserveAspectRatio="none">
									<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
								</Skeleton>
							</div>
						</li>
					</ul>

					<p v-else-if="hasDepartmentAnalyticsError" class="block__empty">
						Аналитика по департаментам не загрузилась. Обновите страницу.
					</p>

					<ul v-else-if="departmentRows.length" class="bars">
						<li
							v-for="(department, index) in departmentRows"
							:key="department.id"
							class="bars__item"
							:style="{ '--delay': `${index * 40}ms` }"
						>
							<NuxtLink class="bars__link" :to="`/departments/${department.id}`">
								<span class="bars__name" :title="department.name">
									{{ department.name }}
								</span>
								<span class="bars__track">
									<span
										v-if="department.rate !== null"
										class="bars__fill"
										:style="{ inlineSize: `${department.rate * 100}%` }"
									/>
								</span>
								<span class="bars__value">
									<span v-if="department.rate === null" class="bars__note">
										нет данных
									</span>
									<template v-else>{{ formatRate(department.rate) }}</template>
								</span>
								<span class="bars__meta">
									{{ department.employees }}
									{{
										pluralize(department.employees, [
											'сотрудник',
											'сотрудника',
											'сотрудников',
										])
									}}
								</span>
							</NuxtLink>
						</li>
					</ul>

					<p v-else class="block__empty">Департаментов пока нет.</p>
				</section>
			</div>

			<div class="columns__side">
				<section v-if="isAttentionVisible" class="block">
					<header class="block__head">
						<h2 class="block__title">Требует внимания</h2>
					</header>

					<ul v-if="isOverviewLoading" class="attention">
						<li v-for="index in 2" :key="`attention-${index}`" class="attention__item">
							<Skeleton class="bone" preserveAspectRatio="none">
								<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
							</Skeleton>
						</li>
					</ul>

					<p v-else-if="hasOverviewError" class="block__empty">
						Блокеры и цепочки не загрузились. Обновите страницу.
					</p>

					<ul v-else class="attention">
						<li v-for="item in attention" :key="item.key" class="attention__item">
							<NuxtLink class="attention__link" :to="item.to">
								<span class="attention__value">{{ item.value }}</span>
								<span class="attention__label">{{ item.label }}</span>
								<span class="attention__more">{{ item.linkText }}</span>
							</NuxtLink>
						</li>
					</ul>
				</section>

				<section class="block">
					<header class="block__head">
						<h2 class="block__title">Последние сотрудники</h2>
						<NuxtLink class="block__link" to="/workers">Все сотрудники</NuxtLink>
					</header>

					<ul v-if="isWorkersLoading" class="people">
						<li v-for="index in SKELETON_ROWS" :key="`person-${index}`" class="people__item">
							<Skeleton class="bone" preserveAspectRatio="none">
								<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
							</Skeleton>
						</li>
					</ul>

					<p v-else-if="hasWorkersError" class="block__empty">
						Список сотрудников не загрузился. Обновите страницу.
					</p>

					<ul v-else-if="recentWorkers.length" class="people">
						<li v-for="row in recentWorkers" :key="row.worker.id" class="people__item">
							<div class="people__person">
								<UIAvatar :name="row.worker.name" :id="row.worker.id" size="sm" />
								<NuxtLink class="people__name" :to="`/workers/${row.worker.id}`">
									{{ row.worker.name }}
								</NuxtLink>
								<UIStatus
									v-if="row.accessMark"
									class="people__access"
									:status="row.accessMark"
									:with-subject="false"
								/>
							</div>
							<UIDayStateCell
								:state="row.state"
								:loading="isTodayLoading"
								:error="hasTodayError"
								empty-hint="Сервер не вернул состояние дня по этому сотруднику"
							/>
							<span class="people__meta">
								{{ row.worker.job_name ?? '—' }} ·
								{{ row.worker.department_name ?? '—' }}
							</span>
						</li>
					</ul>

					<p v-else class="block__empty">Сотрудников пока нет.</p>
				</section>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.lede-bone {
	width: 14rem;
	height: 1rem;
}

.summary {
	margin: 0 0 var(--s-6);
	padding-bottom: var(--s-5);
	border-bottom: 1px solid var(--border);
	color: var(--text-3);
	font-size: var(--t-sm);

	&__bone {
		width: 22rem;
		height: 0.875rem;
	}
}

.columns {
	display: grid;
	grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
	gap: var(--s-6);
	align-items: start;

	&__side {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
		min-width: 0;
	}
}

.block {
	min-width: 0;

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-3);
	}

	&__title {
		@include h4;
	}

	&__link {
		color: var(--accent-text);
		font-size: var(--t-sm);
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__empty {
		padding: var(--s-4) 0;
		color: var(--text-3);
		font-size: var(--t-sm);
	}

	&__error {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-3);
	}
}

.today {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(9rem, auto);
	align-items: center;
	gap: var(--s-5);

	&__chart {
		min-width: 0;
	}

	&__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	&__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-3);
		padding: var(--s-2) 0;

		&:hover,
		&:focus-visible {
			.today__value {
				text-decoration: underline;
			}
		}
	}

	&__value {
		@include numeric;
		color: var(--text-1);
		font-size: var(--t-lg);
		font-weight: 500;
		text-underline-offset: 3px;
	}
}

.people {
	margin: 0;
	padding: 0;
	list-style: none;

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--s-1) var(--s-4);
		padding: var(--s-3) 0;
		border-top: 1px solid var(--border);
	}

	&__person {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		min-width: 0;
	}

	&__name {
		min-width: 0;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__access {
		flex: none;
	}

	&__meta {
		grid-column: 1;
		color: var(--text-3);
		font-size: var(--t-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.bars {
	margin: 0;
	padding: 0;
	list-style: none;

	&__item {
		border-top: 1px solid var(--border);
	}

	&__row {
		padding: var(--s-3) 0;
	}

	&__link {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(4rem, 6rem) minmax(3rem, auto);
		align-items: center;
		gap: var(--s-1) var(--s-3);
		padding: var(--s-3) 0;

		&:hover,
		&:focus-visible {
			.bars__name {
				text-decoration: underline;
			}
		}
	}

	&__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-underline-offset: 3px;
	}

	&__track {
		height: 6px;
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		overflow: hidden;
	}

	&__fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background-color: var(--accent);
		transform-origin: left center;
		animation: bar-reveal var(--dur-slow) var(--ease) backwards;
		animation-delay: var(--delay, 0ms);
	}

	&__value {
		@include numeric;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__note {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__meta {
		grid-column: 1;
		color: var(--text-3);
		font-size: var(--t-xs);
	}
}

.attention {
	margin: 0;
	padding: 0;
	list-style: none;

	&__item {
		border-top: 1px solid var(--border);
	}

	&__link {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: baseline;
		gap: var(--s-3);
		padding: var(--s-3) 0;

		&:hover,
		&:focus-visible {
			.attention__more {
				text-decoration: underline;
			}
		}
	}

	&__value {
		@include numeric;
		color: var(--err);
		font-size: var(--t-xl);
		font-weight: 600;
	}

	&__label {
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__more {
		color: var(--accent-text);
		font-size: var(--t-sm);
		text-underline-offset: 3px;
	}
}

.bone {
	width: 100%;
	height: 1rem;
}

@keyframes bar-reveal {
	from {
		transform: scaleX(0);
	}
}

@media (max-width: 1100px) {
	.columns {
		grid-template-columns: minmax(0, 1fr);
	}

	.today {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
