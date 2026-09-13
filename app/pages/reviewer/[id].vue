<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { useWorkerStore } from '~/stores/workers'
import type { Metric } from '~/types/reviewers'
import { alertMessage } from '~/utils/alertMessage'
import {
	reviewerAvgScores,
	reviewerUsageByMonth,
	reviewerUsageStatItems,
} from '~/utils/reviewerUsage'

const USAGE_STAT_SKELETONS = 4
const USAGE_CHART_HEIGHT = 240

const route = useRoute()
const router = useRouter()
const reviewersStore = useReviewersStore()
const workersStore = useWorkerStore()
const alertStore = useAlertStore()
const { reviewer, isLoading, usage, isUsageLoading, hasUsageError } = storeToRefs(reviewersStore)
const { workers, isWorkersLoading, hasWorkersError } = storeToRefs(workersStore)
const { pluralize } = usePluralize()
const reviewerId = route.params.id as string

const jobsCount = computed(() => reviewer.value?.jobs?.length ?? 0)
const usageStatItems = computed(() => (usage.value ? reviewerUsageStatItems(usage.value) : []))
const usageByMonth = computed(() => reviewerUsageByMonth(usage.value?.by_month ?? []))
const avgScores = computed(() => reviewerAvgScores(usage.value?.avg_scores ?? []))
const pageError = ref('')
const expandedMetricIndex = ref<number | null>(null)
const draft = ref<Metric | null>(null)
const draftError = ref('')
const actionError = ref('')
const isSaving = ref(false)
const isMetricModalOpen = ref(false)
const metricToDeleteIndex = ref<number | null>(null)

const metrics = computed(() => reviewer.value?.metrics ?? [])
const maximumWeight = computed(() =>
	Math.max(1, ...metrics.value.map(metric => metric.value)),
)
const metricToDelete = computed(() =>
	metricToDeleteIndex.value === null
		? null
		: (metrics.value[metricToDeleteIndex.value] ?? null),
)

const metricWidth = (metric: Metric) =>
	`${Math.min(100, Math.max(0, (metric.value / maximumWeight.value) * 100))}%`

const assignedCount = (jobId: number) =>
	workers.value.filter(worker => worker.job_id === jobId).length

const loadReviewer = async () => {
	pageError.value = ''
	try {
		await reviewersStore.fetchReviewer(reviewerId)
	} catch (error) {
		pageError.value = alertMessage(error, 'Не удалось загрузить оценщика')
	}
}

const loadUsage = () => reviewersStore.fetchReviewerUsage(reviewerId)

onMounted(() => {
	void loadReviewer()
	void loadUsage()
	void workersStore.getWorkers()
})

const cancelEdit = () => {
	if (isSaving.value) return
	expandedMetricIndex.value = null
	draft.value = null
	draftError.value = ''
}

const toggleMetric = (metric: Metric, index: number) => {
	if (isSaving.value) return
	if (expandedMetricIndex.value === index) {
		cancelEdit()
		return
	}
	expandedMetricIndex.value = index
	draft.value = { ...metric }
	draftError.value = ''
	actionError.value = ''
}

const persistMetrics = async (nextMetrics: Metric[]) => {
	if (!reviewer.value || isSaving.value) return false
	const current = reviewer.value
	isSaving.value = true
	actionError.value = ''
	try {
		await reviewersStore.putReviewer(reviewerId, {
			name: current.name,
			description: current.description,
			metrics: nextMetrics,
		})
		reviewer.value = { ...current, metrics: nextMetrics }
		return true
	} catch (error) {
		actionError.value = alertMessage(error, 'Не удалось сохранить метрики. Попробуйте ещё раз.')
		alertStore.showAlert(actionError.value)
		return false
	} finally {
		isSaving.value = false
	}
}

const saveMetric = async () => {
	const index = expandedMetricIndex.value
	const edited = draft.value
	if (index === null || !edited || isSaving.value) return
	if (!edited.display_name.trim() || !edited.description.trim()) {
		draftError.value = 'Заполните название и описание метрики.'
		return
	}
	if (!Number.isInteger(edited.value) || edited.value < 1 || edited.value > 10) {
		draftError.value = 'Укажите важность от 1 до 10.'
		return
	}
	draftError.value = ''
	const nextMetrics = metrics.value.map((metric, metricIndex) =>
		metricIndex === index
			? {
				...edited,
				display_name: edited.display_name.trim(),
				description: edited.description.trim(),
			}
			: metric,
	)
	if (await persistMetrics(nextMetrics)) cancelEdit()
}

const createMetric = async (metric: Metric) => {
	if (await persistMetrics([...metrics.value, metric])) {
		isMetricModalOpen.value = false
		cancelEdit()
	}
}

const closeMetricModal = () => {
	if (!isSaving.value) isMetricModalOpen.value = false
}

const confirmDeleteMetric = async () => {
	const index = metricToDeleteIndex.value
	if (index === null || isSaving.value) return
	if (await persistMetrics(metrics.value.filter((_, metricIndex) => metricIndex !== index))) {
		metricToDeleteIndex.value = null
		cancelEdit()
	}
}

const closeDeleteMetric = () => {
	if (!isSaving.value) metricToDeleteIndex.value = null
}
</script>

<template>
	<div class="page-stage">
		<Transition name="swap">
			<SkeletonPage v-if="isLoading" />
			<section v-else-if="reviewer" class="page">
				<header class="page__head">
					<div>
						<h1 class="page__title">{{ reviewer.name }}</h1>
						<p class="page__lede">
							Закреплён за {{ jobsCount }}
							{{ pluralize(jobsCount, ['ролью', 'ролями', 'ролями']) }}
							<template v-if="usage">
								· охватывает {{ usage.employees_covered }}
								{{ pluralize(usage.employees_covered, ['живого сотрудника', 'живых сотрудников', 'живых сотрудников']) }}
							</template>
							<template v-else-if="!isUsageLoading"> · охват сотрудников недоступен</template>
						</p>
					</div>
					<UIButton
						variant="secondary"
						@click="router.push(`/edit/reviewer?id=${reviewer.id}`)"
					>
						Редактировать
					</UIButton>
				</header>

				<section class="section">
					<h2 class="section__title">Что оценивает</h2>
					<p v-if="reviewer.description" class="section__text">
						{{ reviewer.description }}
					</p>
					<p v-else class="section__empty">Описание не заполнено.</p>
				</section>

				<section class="section" aria-labelledby="reviewer-usage-title">
					<h2 id="reviewer-usage-title" class="section__title">Использование</h2>

					<div v-if="isUsageLoading" class="usage" aria-hidden="true">
						<div class="usage__bones">
							<div v-for="index in USAGE_STAT_SKELETONS" :key="index" class="usage__bone">
								<Skeleton class="usage__bone-value" preserveAspectRatio="none">
									<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
								</Skeleton>
								<Skeleton class="usage__bone-label" preserveAspectRatio="none">
									<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
								</Skeleton>
							</div>
						</div>
						<UIChartSkeleton class="usage__chart" :height="USAGE_CHART_HEIGHT" />
					</div>

					<div v-else-if="hasUsageError || !usage" class="state" role="alert">
						<p class="state__text">Данные использования не загрузились</p>
						<UIButton variant="outline" @click="loadUsage">Повторить</UIButton>
					</div>

					<p v-else-if="usage.assessments_count === 0" class="section__empty">
						Оценок по этому оценщику ещё не было
					</p>

					<div v-else class="usage">
						<UIStatRow :items="usageStatItems" />
						<div class="usage__chart">
							<h3 class="usage__subtitle">Оценок по месяцам</h3>
							<UIChartBars
								v-if="usageByMonth.categories.length"
								:categories="usageByMonth.categories"
								:data="usageByMonth.data"
								:horizontal="false"
								:height="USAGE_CHART_HEIGHT"
								series-name="Оценок"
							/>
							<p v-else class="section__empty">Помесячной разбивки в ответе нет.</p>
						</div>
					</div>
				</section>

				<section class="section">
					<h2 class="section__title">Метрики</h2>
					<ul v-if="metrics.length" class="metrics">
						<li
							v-for="(metric, index) in metrics"
							:key="metric.json_name"
							class="metrics__item"
						>
							<button
								type="button"
								class="metrics__toggle"
								:aria-expanded="expandedMetricIndex === index"
								:aria-controls="`metric-panel-${index}`"
								:disabled="isSaving"
								@click="toggleMetric(metric, index)"
							>
								<span class="metrics__name">{{ metric.display_name }}</span>
								<span class="metrics__weight">{{ metric.value }}</span>
								<span class="metrics__track" aria-hidden="true">
									<span class="metrics__bar" :style="{ width: metricWidth(metric) }" />
								</span>
							</button>
							<div v-if="expandedMetricIndex === index && draft" :id="`metric-panel-${index}`" class="metrics__panel">
								<p v-if="metric.description" class="metrics__description">{{ metric.description }}</p>
								<p v-else class="section__empty">Описание не заполнено.</p>
								<form class="metrics__form" @submit.prevent="saveMetric">
									<fieldset class="metrics__fields" :disabled="isSaving">
										<UIInput v-model="draft.display_name" label="Название" required />
										<UITextArea v-model="draft.description" label="Описание" :rows="3" />
										<UIInput
											:model-value="draft.value"
											label="Важность (от 1 до 10)"
											type="number"
											required
											@update:model-value="draft.value = Number($event)"
										/>
									</fieldset>
									<p v-if="draftError" class="metrics__error" role="alert">{{ draftError }}</p>
									<div class="metrics__actions">
										<UIButton type="submit" size="sm" :is-loading="isSaving">Сохранить</UIButton>
										<UIButton variant="ghost" size="sm" :is-disabled="isSaving" @click="cancelEdit">Отмена</UIButton>
										<UIButton variant="ghost" color="red" size="sm" :is-disabled="isSaving" @click="metricToDeleteIndex = index">Удалить метрику</UIButton>
									</div>
								</form>
							</div>
						</li>
					</ul>
					<p v-else class="section__empty">
						У оценщика пока нет метрик. Без них он ничего не измеряет.
					</p>
					<UIButton variant="secondary" class="metrics__add" :is-disabled="isSaving || expandedMetricIndex !== null" @click="isMetricModalOpen = true">
						Добавить метрику
					</UIButton>
					<p v-if="actionError" class="metrics__error" role="alert">{{ actionError }}</p>
				</section>

				<section v-if="usage?.avg_scores.length" class="section" aria-labelledby="reviewer-scores-title">
					<h2 id="reviewer-scores-title" class="section__title">Средние оценки по метрикам</h2>
					<UIChartBars
						:categories="avgScores.categories"
						:data="avgScores.data"
						series-name="Средняя оценка"
					/>
				</section>

				<section class="section">
					<h2 class="section__title">Роли</h2>
					<ul v-if="reviewer.jobs.length" class="roles">
						<li v-for="job in reviewer.jobs" :key="job.id" class="roles__item">
							<NuxtLink class="roles__link" :to="`/role/${job.id}`">{{ job.name }}</NuxtLink>
							<span class="roles__department">{{ job.department_name }}</span>
							<span v-if="hasWorkersError" class="roles__count">Число сотрудников недоступно</span>
							<span v-else-if="isWorkersLoading" class="roles__count">Загружаем число сотрудников…</span>
							<span v-else class="roles__count">
								Назначено:
								<span class="roles__number">{{ assignedCount(job.id) }}</span>
								{{ pluralize(assignedCount(job.id), ['сотрудник', 'сотрудника', 'сотрудников']) }}
							</span>
						</li>
					</ul>
					<p v-else class="section__empty">К оценщику пока не привязаны роли.</p>
				</section>
			</section>
			<div v-else-if="pageError" class="page-error" role="alert">
				<p>{{ pageError }}</p>
				<UIButton variant="secondary" @click="loadReviewer">Повторить</UIButton>
			</div>
		</Transition>
		<ModalMetric
			v-if="isMetricModalOpen"
			:is-saving="isSaving"
			@close="closeMetricModal"
			@create="createMetric"
		/>
		<ModalConfirm
			v-if="metricToDelete"
			title="Удалить метрику?"
			:text="`Метрика «${metricToDelete.display_name}» будет удалена у оценщика после подтверждения.`"
			@confirm="confirmDeleteMetric"
			@close="closeDeleteMetric"
		/>
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

.section {
	margin-bottom: var(--s-6);

	&__title {
		@include h4;
		margin-bottom: var(--s-3);
	}

	&__text {
		max-width: 70ch;
		line-height: var(--lh-base);
	}

	&__empty {
		color: var(--text-3);
	}
}

.state {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: var(--s-3);
	padding: var(--s-4) var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);

	&__text {
		color: var(--err);
	}
}

.usage {
	padding: var(--s-4) var(--s-5);
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);

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

	&__chart {
		margin-top: var(--s-5);
	}

	&__subtitle {
		margin-bottom: var(--s-2);
		color: var(--text-2);
		font-size: var(--t-sm);
		font-weight: 500;
	}
}

.metrics {
	margin: 0;
	padding: 0;
	list-style: none;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;

	&__item + &__item {
		border-top: 1px solid var(--border);
	}

	&__toggle {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--s-2) var(--s-4);
		width: 100%;
		padding: var(--s-4);
		border: 0;
		background: transparent;
		color: var(--text-1);
		text-align: left;
		cursor: pointer;

		&:hover:not(:disabled) {
			background-color: var(--surface-hover);
		}

		&:disabled {
			cursor: wait;
		}
	}

	&__name {
		font-weight: 500;
	}

	&__weight {
		@include numeric;
		font-size: var(--t-sm);
	}

	&__track {
		grid-column: 1 / -1;
		height: 4px;
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		overflow: hidden;
	}

	&__bar {
		display: block;
		height: 100%;
		border-radius: inherit;
		background-color: var(--accent);
	}

	&__panel {
		padding: 0 var(--s-4) var(--s-4);

		> .section__empty {
			margin-bottom: var(--s-4);
		}
	}

	&__description {
		max-width: 70ch;
		margin-bottom: var(--s-4);
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__form,
	&__fields {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	&__form {
		max-width: 36rem;
	}

	&__fields {
		margin: 0;
		padding: 0;
		border: 0;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
	}

	&__add {
		margin-top: var(--s-3);
	}

	&__error {
		margin-top: var(--s-2);
		color: var(--err);
		font-size: var(--t-sm);
	}
}

.roles {
	margin: 0;
	padding: 0;
	list-style: none;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3) var(--s-4);

		& + & {
			border-top: 1px solid var(--border);
		}
	}

	&__link {
		font-weight: 500;
		text-decoration: underline;
		text-decoration-color: var(--border-strong);
		text-underline-offset: 3px;

		&:hover {
			color: var(--accent-text);
			text-decoration-color: currentColor;
		}
	}

	&__department {
		color: var(--text-2);
	}

	&__count {
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__number {
		@include numeric;
	}
}

@media (max-width: 700px) {
	.roles__item {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.roles__department {
		grid-column: 1 / -1;
		grid-row: 2;
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
</style>
