<script lang="ts" setup>
import type { UIStatItem } from '~/components/UI/StatRow.vue'
import { useWorkerStore } from '~/stores/workers'
import { DAY_STATE_LABEL, DayState, ENTRY_ITEM_STATUS_LABEL } from '~/types/dailies'
import { alertMessage } from '~/utils/alertMessage'
import { currentDayState, formatRate, hasSchedule, toIsoDate } from '~/utils/dailyStats'
import {
	WORKER_HEATMAP_RANGES,
	feedCountToReveal,
	formatDateTime,
	formatFeedDay,
	formatShortDate,
	workScheduleLabel,
	workerFeedDays,
	workerHeatmapRows,
} from '~/utils/workerCard'
import { formatAssessmentScore, workerAssessmentCards } from '~/utils/workerAssessments'

const PERIODS = [7, 14, 30, 90]
const FEED_PAGE_SIZE = 10
const STAT_SKELETONS = 6
const FEED_SKELETONS = 3
const ASSESSMENT_SKELETONS = 3
const LEGEND: DayState[] = [
	DayState.Submitted,
	DayState.Draft,
	DayState.Missing,
	DayState.Off,
	DayState.Rest,
]

const route = useRoute()
const router = useRouter()
const workerId = route.params.id as string
const workerNumericId = Number(workerId)
const workersStore = useWorkerStore()
const {
	worker,
	isLoading,
	workerPeriodDays,
	workerRange,
	workerStatistics,
	isWorkerStatisticsLoading,
	hasWorkerStatisticsError,
	workerDailies,
	isWorkerDailiesLoading,
	hasWorkerDailiesError,
	workerAssessments,
	isWorkerAssessmentsLoading,
	hasWorkerAssessmentsError,
	isWorkerAssessmentsMoreLoading,
	hasWorkerAssessmentsMoreError,
} = storeToRefs(workersStore)
const { pluralize } = usePluralize()
const reducedMotion = useReducedMotion()

const today = toIsoDate(new Date())

const workerError = ref('')

const isRequestingAssessment = ref(false)
const assessmentRequestError = ref('')
const assessmentSection = ref<HTMLElement | null>(null)
const expandedAssessments = ref<string[]>([])

const card = computed(() =>
	!isLoading.value && worker.value?.id === workerNumericId ? worker.value : null,
)

const statistics = computed(() =>
	!isWorkerStatisticsLoading.value && workerStatistics.value?.user_id === workerNumericId
		? workerStatistics.value
		: null,
)

const isStatisticsPending = computed(
	() => !hasWorkerStatisticsError.value && !statistics.value,
)

const dailies = computed(() =>
	!isWorkerDailiesLoading.value && workerDailies.value?.user_id === workerNumericId
		? workerDailies.value
		: null,
)

const isDailiesPending = computed(() => !hasWorkerDailiesError.value && !dailies.value)

const assessments = computed(() =>
	!isWorkerAssessmentsLoading.value &&
	workerAssessments.value?.worker_id === workerNumericId
		? workerAssessments.value
		: null,
)

const isAssessmentsPending = computed(
	() => !hasWorkerAssessmentsError.value && !assessments.value,
)

const assessmentCards = computed(() =>
	assessments.value ? workerAssessmentCards(assessments.value.items) : [],
)

const hasStatisticsData = computed(() => (statistics.value?.working_days ?? 0) > 0)

const statItems = computed<UIStatItem[]>(() => {
	const stats = statistics.value

	if (!stats) return []

	return [
		{ key: 'rate', label: 'Сдача', value: formatRate(stats.completion_rate ?? null) },
		{ key: 'streak', label: 'Текущая серия', value: stats.streak },
		{ key: 'missing', label: 'Пропусков', value: stats.missing_count },
		{
			key: 'blockers',
			label: 'Блокеров',
			value: stats.blockers_count,
			tone: stats.blockers_count > 0 ? 'err' : 'default',
		},
		{ key: 'done', label: 'Закрыто пунктов', value: stats.done_items_count },
		{
			key: 'last',
			label: 'Последний дейлик',
			value: stats.last_entry_at ? formatShortDate(stats.last_entry_at) : null,
		},
	]
})

const noStatisticsText = computed(() =>
	hasSchedule(card.value)
		? 'Нет данных за период: по графику у сотрудника не было рабочих дней.'
		: 'Нет данных за период: у сотрудника не задан график работы, поэтому рабочие дни не определены.',
)

const todayState = computed(() =>
	dailies.value
		? currentDayState(
				dailies.value.days.find(day => day.date === today),
				dailies.value,
			)
		: null,
)

const todayHint = computed(() =>
	hasSchedule(dailies.value ?? card.value)
		? 'За сегодня данных нет'
		: 'У сотрудника не задан график работы',
)

const heatmapRows = computed(() =>
	dailies.value
		? workerHeatmapRows(
				{ from: dailies.value.date_from, to: dailies.value.date_to },
				dailies.value,
				dailies.value.days,
			)
		: workerHeatmapRows(workerRange.value),
)

const feedDays = computed(() =>
	dailies.value ? workerFeedDays(dailies.value.days, dailies.value) : [],
)

const visibleCount = ref(FEED_PAGE_SIZE)
const expandedDates = ref<string[]>([])
const selectedDate = ref<string | null>(null)
const selectedNote = ref('')

const visibleFeedDays = computed(() => feedDays.value.slice(0, visibleCount.value))

watch(feedDays, days => {
	visibleCount.value = FEED_PAGE_SIZE
	expandedDates.value = days[0] ? [days[0].date] : []
	selectedDate.value = null
	selectedNote.value = ''
})

const feedDayId = (date: string) => `worker-daily-${date}`

const isExpanded = (date: string) => expandedDates.value.includes(date)

const toggleDay = (date: string) => {
	expandedDates.value = isExpanded(date)
		? expandedDates.value.filter(item => item !== date)
		: [...expandedDates.value, date]
}

const showMore = () => {
	visibleCount.value += FEED_PAGE_SIZE
}

const scrollBehavior = (): ScrollBehavior => (reducedMotion.value ? 'auto' : 'smooth')

const selectCell = async (rowIndex: number, cellIndex: number) => {
	const cell = heatmapRows.value[rowIndex]?.cells[cellIndex]

	if (!cell?.date) return

	const date = cell.date
	const index = feedDays.value.findIndex(day => day.date === date)

	if (index === -1) {
		selectedDate.value = null
		selectedNote.value = `${formatFeedDay(date)}: ${
			cell.state ? DAY_STATE_LABEL[cell.state] : 'нет данных'
		}, пунктов в дейлике нет.`
		return
	}

	selectedDate.value = date
	selectedNote.value = ''
	visibleCount.value = feedCountToReveal(index, visibleCount.value, FEED_PAGE_SIZE)

	if (!isExpanded(date)) expandedDates.value = [...expandedDates.value, date]

	await nextTick()

	const element = document.getElementById(feedDayId(date))

	element?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
	element?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
}

const loadWorker = async () => {
	workerError.value = ''

	try {
		await workersStore.getWorker(workerId)
	} catch (error) {
		workerError.value = alertMessage(
			error,
			'Не удалось загрузить сотрудника. Попробуйте ещё раз.',
		)
	}
}

const reloadStatistics = () => workersStore.fetchWorkerStatistics(workerId)

const reloadDailies = () => workersStore.fetchWorkerDailies(workerId)

const reloadAssessments = () => workersStore.fetchWorkerAssessments(workerId)

const showMoreAssessments = () => workersStore.fetchMoreWorkerAssessments(workerId)

onMounted(() => {
	void loadWorker()
	void workersStore.fetchWorkerPeriod(workerId)
	void reloadAssessments()
})

const isAssessmentExpanded = (key: string) => expandedAssessments.value.includes(key)

const toggleAssessment = (key: string) => {
	expandedAssessments.value = isAssessmentExpanded(key)
		? expandedAssessments.value.filter(item => item !== key)
		: [...expandedAssessments.value, key]
}

const fetchAssessment = async () => {
	if (isRequestingAssessment.value) return

	isRequestingAssessment.value = true
	assessmentRequestError.value = ''

	try {
		const created = await workersStore.requestWorkerAssessment(workerId)
		const [card] = workerAssessmentCards([created])

		if (card && !isAssessmentExpanded(card.key)) {
			expandedAssessments.value = [card.key, ...expandedAssessments.value]
		}
	} catch {
		assessmentRequestError.value = 'Не удалось получить оценку. Попробуйте ещё раз.'
	} finally {
		isRequestingAssessment.value = false
	}
}

const requestAssessment = () => {
	assessmentSection.value?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
	void fetchAssessment()
}
</script>

<template>
	<div class="page-stage">
		<Transition name="swap">
			<section v-if="card" class="page">
				<header class="page__head">
					<div class="person">
						<UIAvatar :name="card.name" :id="card.id" size="lg" />
						<div class="person__body">
							<h1 class="page__title">{{ card.name }}</h1>
							<p class="page__lede person__meta">
								<span>{{ card.job_name || 'Должность не назначена' }}</span>
								<span aria-hidden="true">·</span>
								<NuxtLink
									v-if="card.department_id && card.department_name"
									class="person__link"
									:to="`/departments/${card.department_id}`"
								>
									{{ card.department_name }}
								</NuxtLink>
								<span v-else>Без департамента</span>
							</p>
							<div class="person__marks">
								<span class="person__label">Сегодня</span>
								<UIDayStateCell
									:state="todayState"
									:loading="isDailiesPending"
									:error="hasWorkerDailiesError"
									:empty-hint="todayHint"
								/>
								<UIStatus class="person__access" :status="card.status" />
							</div>
						</div>
					</div>

					<div class="actions">
						<UIButton
							variant="secondary"
							@click="router.push(`/edit/workers?id=${card.id}`)"
						>
							Редактировать
						</UIButton>
						<UIButton
							variant="secondary"
							:is-loading="isRequestingAssessment"
							@click="requestAssessment"
						>
							Запросить оценку
						</UIButton>
					</div>
				</header>

				<div class="toolbar">
					<span id="worker-period" class="toolbar__label">Период</span>
					<div class="periods" role="group" aria-labelledby="worker-period">
						<UIButton
							v-for="period in PERIODS"
							:key="period"
							:variant="period === workerPeriodDays ? 'primary' : 'ghost'"
							@click="workersStore.setWorkerPeriod(period, workerId)"
						>
							{{ period }} дней
						</UIButton>
					</div>
				</div>

				<section class="summary" aria-label="Статистика за период">
					<div v-if="isStatisticsPending" class="summary__bones" aria-hidden="true">
						<div v-for="index in STAT_SKELETONS" :key="index" class="summary__bone">
							<Skeleton class="summary__bone-value" preserveAspectRatio="none">
								<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
							</Skeleton>
							<Skeleton class="summary__bone-label" preserveAspectRatio="none">
								<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
							</Skeleton>
						</div>
					</div>

					<div v-else-if="hasWorkerStatisticsError" class="state">
						<p class="state__text">Статистика за период не загрузилась.</p>
						<UIButton variant="outline" @click="reloadStatistics">Повторить</UIButton>
					</div>

					<p v-else-if="!hasStatisticsData" class="summary__empty">
						{{ noStatisticsText }}
					</p>

					<UIStatRow v-else :items="statItems" />
				</section>

				<section class="section" aria-labelledby="worker-calendar-title">
					<div class="section__head">
						<h2 id="worker-calendar-title" class="section__title">Календарь</h2>
						<span class="section__hint">
							цвет клетки — состояние дня, клик открывает дейлик в ленте
						</span>
					</div>

					<div v-if="hasWorkerDailiesError" class="state">
						<p class="state__text">
							Календарь и дейлики за период не загрузились. Попробуйте ещё раз или
							выберите другой период.
						</p>
						<UIButton variant="outline" @click="reloadDailies">Повторить</UIButton>
					</div>

					<template v-else>
						<UIChartHeatmap
							:rows="heatmapRows"
							:ranges="WORKER_HEATMAP_RANGES"
							:loading="isDailiesPending"
							@select="selectCell"
						/>

						<ul v-if="dailies" class="legend">
							<li v-for="state in LEGEND" :key="state">
								<UIDayState :state="state" />
							</li>
							<li class="legend__outside">
								<span class="legend__swatch" aria-hidden="true" />
								нет данных или вне периода
							</li>
						</ul>

						<p v-if="dailies && !hasSchedule(dailies)" class="note">
							У сотрудника не задан график работы, поэтому рабочие дни за период не
							определены.
						</p>

						<p v-if="selectedNote" class="note" role="status">{{ selectedNote }}</p>
					</template>
				</section>

				<section class="section" aria-labelledby="worker-feed-title">
					<div class="section__head">
						<h2 id="worker-feed-title" class="section__title">Дейлики</h2>
						<span v-if="feedDays.length" class="section__hint">
							{{ feedDays.length }}
							{{ pluralize(feedDays.length, ['день', 'дня', 'дней']) }} с пунктами за
							период
						</span>
					</div>

					<div v-if="isDailiesPending" class="feed-skeleton" aria-hidden="true">
						<Skeleton
							v-for="index in FEED_SKELETONS"
							:key="index"
							class="feed-skeleton__row"
							preserveAspectRatio="none"
						>
							<rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
						</Skeleton>
					</div>

					<p v-else-if="hasWorkerDailiesError" class="note">
						Лента не загрузилась вместе с календарём.
					</p>

					<p v-else-if="!feedDays.length" class="empty">
						За выбранный период нет ни одного дейлика с пунктами.
					</p>

					<template v-else>
						<ul class="feed">
							<li
								v-for="day in visibleFeedDays"
								:id="feedDayId(day.date)"
								:key="day.date"
								class="feed__day"
								:class="{ 'feed__day--selected': selectedDate === day.date }"
							>
								<button
									type="button"
									class="feed__toggle"
									:aria-expanded="isExpanded(day.date)"
									:aria-controls="`${feedDayId(day.date)}-items`"
									@click="toggleDay(day.date)"
								>
									<span class="feed__date">{{ formatFeedDay(day.date) }}</span>
									<UIDayState :state="day.state" />
									<span class="feed__summary">
										<span
											v-for="entry in day.summary"
											:key="entry.status"
											class="feed__count"
											:class="`feed__count--${entry.status}`"
										>
											{{ ENTRY_ITEM_STATUS_LABEL[entry.status] }}
											<span class="feed__count-value">{{ entry.count }}</span>
										</span>
									</span>
								</button>

								<ul
									v-if="isExpanded(day.date)"
									:id="`${feedDayId(day.date)}-items`"
									class="items"
								>
									<li v-for="item in day.items" :key="item.id" class="items__item">
										<span class="item-status" :class="`item-status--${item.status}`">
											{{ ENTRY_ITEM_STATUS_LABEL[item.status] }}
										</span>
										<div class="items__body">
											<p v-if="item.text" class="items__text">{{ item.text }}</p>
											<p v-else class="items__text items__text--empty">Без текста</p>
											<a
												v-if="item.href"
												class="items__link"
												:href="item.href"
												target="_blank"
												rel="noopener noreferrer"
											>
												{{ item.linkText }}
											</a>
											<span v-else-if="item.linkText" class="items__link items__link--plain">
												{{ item.linkText }}
											</span>
										</div>
									</li>
								</ul>
							</li>
						</ul>

						<UIButton
							v-if="feedDays.length > visibleCount"
							class="feed__more"
							variant="ghost"
							@click="showMore"
						>
							Показать ещё
						</UIButton>
					</template>
				</section>

				<section
					ref="assessmentSection"
					class="section assessment"
					aria-labelledby="worker-assessment-title"
				>
					<div class="section__head">
						<h2 id="worker-assessment-title" class="section__title">Оценки</h2>
						<span v-if="assessmentCards.length" class="section__hint">
							новые сверху, клик раскрывает полный текст
						</span>
					</div>

					<div v-if="isRequestingAssessment" class="assessment__pending" role="status">
						<Skeleton
							class="assessment__bone"
							preserveAspectRatio="none"
							aria-hidden="true"
						>
							<rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
						</Skeleton>
						<span class="assessment__pending-text">Запрашиваем оценку…</span>
					</div>

					<div
						v-else-if="assessmentRequestError"
						class="state assessment__request-error"
						role="alert"
					>
						<p class="state__text">{{ assessmentRequestError }}</p>
						<UIButton variant="outline" @click="fetchAssessment">Повторить</UIButton>
					</div>

					<div v-if="isAssessmentsPending" class="feed-skeleton" aria-hidden="true">
						<Skeleton
							v-for="index in ASSESSMENT_SKELETONS"
							:key="index"
							class="assessment__bone"
							preserveAspectRatio="none"
						>
							<rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
						</Skeleton>
					</div>

					<div v-else-if="hasWorkerAssessmentsError" class="state">
						<p class="state__text">История оценок не загрузилась.</p>
						<UIButton variant="outline" @click="reloadAssessments">Повторить</UIButton>
					</div>

					<template v-else-if="assessments">
						<ul v-if="assessmentCards.length" class="feed">
							<li
								v-for="assessment in assessmentCards"
								:id="assessment.key"
								:key="assessment.key"
								class="feed__day"
							>
								<button
									type="button"
									class="feed__toggle"
									:aria-expanded="isAssessmentExpanded(assessment.key)"
									:aria-controls="`${assessment.key}-text`"
									@click="toggleAssessment(assessment.key)"
								>
									<span class="feed__date">
										{{ assessment.date ?? 'дата не указана' }}
									</span>
									<span
										class="assessment__reviewer"
										:class="{ 'assessment__reviewer--empty': !assessment.reviewerName }"
									>
										{{ assessment.reviewerName ?? 'оценщик не указан' }}
									</span>
									<span v-if="assessment.period" class="assessment__period">
										{{ assessment.period }}
									</span>
									<span
										v-if="!isAssessmentExpanded(assessment.key)"
										class="assessment__excerpt"
									>
										{{ assessment.excerpt }}
									</span>
								</button>

								<div
									v-if="isAssessmentExpanded(assessment.key)"
									:id="`${assessment.key}-text`"
									class="assessment__body"
								>
									<p class="assessment__text">{{ assessment.feedback }}</p>
									<ul
										v-if="assessment.metrics.length"
										class="assessment__metrics"
										aria-label="Баллы по метрикам"
									>
										<li
											v-for="metric in assessment.metrics"
											:key="metric.json_name"
											class="assessment__metric"
										>
											<span>{{ metric.display_name }}</span>
											<span class="assessment__score">
												{{ formatAssessmentScore(metric.score) }}
											</span>
										</li>
									</ul>
								</div>
							</li>
						</ul>

						<p
							v-else-if="!isRequestingAssessment && !assessmentRequestError"
							class="empty"
						>
							Оценок пока не было. Нажмите «Запросить оценку» в шапке карточки.
						</p>

						<div v-if="hasWorkerAssessmentsMoreError" class="assessment__more-error">
							<p class="state__text">Следующие оценки не загрузились.</p>
							<UIButton variant="outline" @click="showMoreAssessments">
								Повторить
							</UIButton>
						</div>

						<UIButton
							v-else-if="assessments.hasMore"
							class="feed__more"
							variant="ghost"
							:is-loading="isWorkerAssessmentsMoreLoading"
							@click="showMoreAssessments"
						>
							Показать ещё
						</UIButton>
					</template>

					<p class="assessment__hint">
						Оценка собирается по метрикам должности и формулируется моделью.
						Это черновик — читайте его как мнение, а не как вердикт.
					</p>
				</section>

				<details class="details">
					<summary class="details__summary">
						<span class="details__title">Реквизиты</span>
						<span class="details__hint">
							ID, почта, график работы, даты создания и изменения
						</span>
					</summary>

					<dl class="details__body facts">
						<div class="facts__item">
							<dt class="facts__label">ID</dt>
							<dd class="facts__value facts__value--numeric">{{ card.id }}</dd>
						</div>
						<div class="facts__item">
							<dt class="facts__label">Почта</dt>
							<dd v-if="card.email" class="facts__value">{{ card.email }}</dd>
							<dd v-else class="facts__value facts__value--empty">не указана</dd>
						</div>
						<div class="facts__item">
							<dt class="facts__label">График работы</dt>
							<dd v-if="workScheduleLabel(card)" class="facts__value">
								{{ workScheduleLabel(card) }}
							</dd>
							<dd v-else class="facts__value facts__value--empty">не задан</dd>
						</div>
						<div class="facts__item">
							<dt class="facts__label">Создан</dt>
							<dd class="facts__value">{{ formatDateTime(card.created_at) }}</dd>
						</div>
						<div class="facts__item">
							<dt class="facts__label">Изменён</dt>
							<dd class="facts__value">{{ formatDateTime(card.updated_at) }}</dd>
						</div>
					</dl>
				</details>
			</section>

			<div v-else-if="workerError" class="page-error" role="alert">
				<p>{{ workerError }}</p>
				<UIButton variant="secondary" @click="loadWorker">Повторить</UIButton>
			</div>

			<SkeletonPage v-else />
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.page-stage {
	position: relative;
	min-height: 26rem;
}

.page-error {
	display: flex;
	align-items: center;
	gap: var(--s-4);
	padding: var(--s-6);

	p {
		color: var(--err);
	}
}

.person {
	display: flex;
	align-items: flex-start;
	gap: var(--s-4);
	min-width: 0;

	&__body {
		min-width: 0;
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
	}

	&__link {
		color: var(--accent-text);
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__marks {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2) var(--s-3);
		margin-top: var(--s-3);
	}

	&__label {
		@include label;
	}

	&__access {
		color: var(--text-3);
		font-size: var(--t-xs);
	}
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: var(--s-2);
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
	flex-wrap: wrap;
	gap: var(--s-2);
}

.summary {
	padding: var(--s-4) var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);

	.state {
		padding: 0;
		border: 0;
	}

	&__bones {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3) var(--s-5);
	}

	&__bone {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	&__bone-value {
		width: 4.5rem;
		height: 1.75rem;
	}

	&__bone-label {
		width: 6rem;
		height: 0.875rem;
	}

	&__empty {
		color: var(--text-3);
		font-size: var(--t-md);
	}
}

.section {
	margin-top: var(--s-6);
	padding-top: var(--s-5);
	border-top: 1px solid var(--border);

	&__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--s-1) var(--s-3);
		margin-bottom: var(--s-4);
	}

	&__title {
		@include h4;
	}

	&__hint {
		color: var(--text-3);
		font-size: var(--t-xs);
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

.empty {
	padding: var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	color: var(--text-3);
	font-size: var(--t-md);
}

.note {
	margin-top: var(--s-3);
	color: var(--text-3);
	font-size: var(--t-xs);
}

.legend {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--s-2) var(--s-3);
	margin: var(--s-3) 0 0;
	padding: 0;
	list-style: none;

	&__outside {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__swatch {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: var(--r-sm);
		background-color: var(--surface-sunken);
	}
}

.feed-skeleton {
	display: grid;
	gap: var(--s-2);

	&__row {
		width: 100%;
		height: 3.25rem;
	}
}

.feed {
	margin: 0;
	padding: 0;
	list-style: none;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;

	&__day {
		scroll-margin-top: var(--s-5);
		transition: box-shadow var(--dur-fast) var(--ease);

		& + & {
			border-top: 1px solid var(--border);
		}

		&--selected {
			box-shadow: inset 3px 0 0 var(--accent);
		}
	}

	&__toggle {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2) var(--s-3);
		width: 100%;
		padding: var(--s-3) var(--s-4);
		border: 0;
		background: transparent;
		color: var(--text-1);
		text-align: left;
		cursor: pointer;
		transition: background-color var(--dur-fast) var(--ease);

		&::before {
			content: '';
			width: 0.4rem;
			height: 0.4rem;
			border-right: 1.5px solid var(--text-3);
			border-bottom: 1.5px solid var(--text-3);
			transform: rotate(-45deg);
			transition: transform var(--dur-fast) var(--ease);
		}

		&[aria-expanded='true']::before {
			transform: rotate(45deg);
		}

		&:hover {
			background-color: var(--surface-hover);
		}

		&:focus-visible {
			@include focus-ring;
		}
	}

	&__date {
		min-width: 8rem;
		font-size: var(--t-md);
		font-weight: 500;
	}

	&__summary {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1) var(--s-3);
		margin-left: auto;
	}

	&__count {
		color: var(--text-3);
		font-size: var(--t-xs);

		&--blocked {
			color: var(--err);
		}
	}

	&__count-value {
		@include numeric;
		font-weight: 500;
	}

	&__more {
		margin-top: var(--s-3);
	}
}

.items {
	display: grid;
	gap: var(--s-3);
	margin: 0;
	padding: 0 var(--s-4) var(--s-4);
	list-style: none;

	&__item {
		display: grid;
		grid-template-columns: 7.5rem minmax(0, 1fr);
		align-items: baseline;
		gap: var(--s-3);
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
		min-width: 0;
	}

	&__text {
		max-width: 72ch;
		line-height: var(--lh-base);
		word-break: break-word;

		&--empty {
			color: var(--text-3);
		}
	}

	&__link {
		overflow: hidden;
		color: var(--accent-text);
		font-size: var(--t-sm);
		white-space: nowrap;
		text-overflow: ellipsis;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}

		&--plain {
			color: var(--text-2);

			&:hover {
				text-decoration: none;
			}
		}
	}
}

.item-status {
	justify-self: start;
	padding: var(--s-1) var(--s-2);
	border-radius: var(--r-full);
	background-color: var(--surface-sunken);
	color: var(--text-2);
	font-size: var(--t-xs);
	font-weight: 500;
	white-space: nowrap;

	&--in_progress {
		background-color: var(--accent-weak);
		color: var(--accent-text);
	}

	&--blocked {
		background-color: var(--err-weak);
		color: var(--err);
	}

	&--done {
		background-color: var(--ok-weak);
		color: var(--ok);
	}

	&--dropped {
		color: var(--text-3);
		text-decoration: line-through;
	}
}

.assessment {
	&__bone {
		width: 100%;
		height: 4.75rem;
	}

	&__pending {
		display: grid;
		gap: var(--s-2);
		margin-bottom: var(--s-3);
	}

	&__pending-text {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__request-error {
		margin-bottom: var(--s-3);
	}

	&__reviewer {
		color: var(--text-2);
		font-size: var(--t-sm);

		&--empty {
			color: var(--text-3);
		}
	}

	&__period {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__excerpt {
		flex-basis: 100%;
		overflow: hidden;
		padding-left: calc(0.4rem + var(--s-3));
		color: var(--text-2);
		font-size: var(--t-sm);
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__body {
		display: grid;
		gap: var(--s-4);
		padding: 0 var(--s-4) var(--s-4);
	}

	&__text {
		max-width: 72ch;
		line-height: var(--lh-base);
		white-space: pre-line;
		word-break: break-word;
	}

	&__metrics {
		display: grid;
		gap: var(--s-1);
		max-width: 40rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	&__metric {
		display: flex;
		justify-content: space-between;
		gap: var(--s-3);
		padding: var(--s-1) 0;
		border-bottom: 1px solid var(--border);
		font-size: var(--t-sm);
	}

	&__score {
		@include numeric;
		font-weight: 500;
	}

	&__more-error {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-3);
		margin-top: var(--s-3);
	}

	&__hint {
		max-width: 60ch;
		margin-top: var(--s-3);
		color: var(--text-3);
	}
}

.details {
	margin-top: var(--s-6);
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
		margin: 0 var(--s-4) var(--s-4);
	}
}

.facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	gap: 1px;
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
		margin: var(--s-2) 0 0;
		font-size: var(--t-md);
		font-weight: 500;
		word-break: break-word;

		&--numeric {
			@include numeric;
		}

		&--empty {
			color: var(--text-3);
			font-weight: 400;
		}
	}
}

.swap-enter-active,
.swap-leave-active {
	transition: opacity var(--dur-slow) var(--ease);
}

.swap-leave-active {
	position: absolute;
	inset: 0;
}

.swap-enter-from,
.swap-leave-to {
	opacity: 0;
}

@media (max-width: 700px) {
	.items__item {
		grid-template-columns: minmax(0, 1fr);
	}

	.feed__summary {
		margin-left: 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.feed__day,
	.feed__toggle,
	.feed__toggle::before,
	.details__summary,
	.details__summary::before,
	.swap-enter-active,
	.swap-leave-active {
		transition: none;
	}
}
</style>
