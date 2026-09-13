<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload, Metric } from '~/types/reviewers'
import { alertMessage } from '~/utils/alertMessage'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const { isLoading, reviewer } = storeToRefs(reviewersStore)

const alertStore = useAlertStore()
const route = useRoute()
const router = useRouter()
const reviewerId = route.query.id as string

if (reviewerId) {
	try {
		await reviewersStore.fetchReviewer(reviewerId)
	} catch (error) {
		alertStore.showAlert(
			alertMessage(error, 'Не удалось загрузить оценщика'),
		)
	}
}

const editedReviewer = reviewerId ? reviewer.value : undefined

const metrics = ref<Metric[]>(
	editedReviewer?.metrics?.map(metric => ({ ...metric })) ?? [],
)

const isMetricModalOpen = ref(false)
const expandedMetricIndex = ref<number | null>(null)
const metricDraft = ref<Metric | null>(null)
const metricError = ref('')
const maximumWeight = computed(() =>
	Math.max(1, ...metrics.value.map(metric => metric.value)),
)

const metricWidth = (metric: Metric) =>
	`${Math.min(100, Math.max(0, (metric.value / maximumWeight.value) * 100))}%`

const { handleSubmit, values } = useForm<APIReviewerPayload>({
	validationSchema: reviewerSchema,
	initialValues: {
		name: editedReviewer?.name ?? '',
		description: editedReviewer?.description ?? '',
	},
})

const add = handleSubmit(async formValues => {
	if (expandedMetricIndex.value !== null) {
		metricError.value = 'Сначала примените или отмените изменения метрики.'
		return
	}
	const payload = { ...formValues, metrics: metrics.value }
	try {
		if (reviewerId) {
			await reviewersStore.putReviewer(reviewerId, payload)
			router.push('/reviewer')
			return
		}
		const created = await reviewersStore.addReviewer(payload)
		if (created) {
			router.push('/reviewer')
			alertStore.showAlert(Alert.Added)
		}
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.AddedError))
	}
})

const getDescription = async () => {
	const response = await reviewersStore.fetchDescription(
		values.name,
		values.description,
	)
	metrics.value = response
}

const metricToDeleteIndex = ref<number | null>(null)

const metricToDelete = computed(() =>
	metricToDeleteIndex.value === null
		? null
		: (metrics.value[metricToDeleteIndex.value] ?? null),
)

const askDeleteMetric = (index: number) => {
	metricToDeleteIndex.value = index
}

const cancelDeleteMetric = () => {
	metricToDeleteIndex.value = null
}

const deleteMetric = () => {
	const index = metricToDeleteIndex.value
	if (index !== null) {
		metrics.value = metrics.value.filter((_, i) => i !== index)
		cancelMetricEdit()
	}
	metricToDeleteIndex.value = null
}

const openMetricModal = () => {
	isMetricModalOpen.value = true
}

const cancelMetricEdit = () => {
	expandedMetricIndex.value = null
	metricDraft.value = null
	metricError.value = ''
}

const toggleMetric = (metric: Metric, index: number) => {
	if (expandedMetricIndex.value === index) {
		cancelMetricEdit()
		return
	}
	expandedMetricIndex.value = index
	metricDraft.value = { ...metric }
	metricError.value = ''
}

const applyMetric = () => {
	const index = expandedMetricIndex.value
	const edited = metricDraft.value
	if (index === null || !edited) return
	if (!edited.display_name.trim() || !edited.description.trim()) {
		metricError.value = 'Заполните название и описание метрики.'
		return
	}
	if (!Number.isInteger(edited.value) || edited.value < 1 || edited.value > 10) {
		metricError.value = 'Укажите важность от 1 до 10.'
		return
	}
	metrics.value[index] = {
		...edited,
		display_name: edited.display_name.trim(),
		description: edited.description.trim(),
	}
	cancelMetricEdit()
}

const closeMetricModal = () => {
	isMetricModalOpen.value = false
}

const createMetric = (metric: Metric) => {
	metrics.value.push(metric)
	closeMetricModal()
}
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">
				{{ reviewerId ? 'Редактирование оценщика' : 'Новый оценщик' }}
			</h1>
		</header>
		<form class="form" @submit.prevent="add">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Название"
					placeholder="Например: Тимлид, Старший менеджер"
					required
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>

			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="description"
			>
				<UIInput
					label="Что оценивает"
					placeholder="Что именно оценивает данный тип оценщика"
					required
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>

			<div class="metrics">
				<div class="metrics__head">
					<h2 class="metrics__title">Метрики</h2>
					<UIButton
						@click="getDescription"
						variant="secondary"
						:is-disabled="values.name === '' || values.description === '' || expandedMetricIndex !== null"
						>{{ metrics?.length ? 'Обновить' : 'Заполнить' }}</UIButton
					>
				</div>
				<p class="metrics__hint">
					Заполните название и описание — метрики предложит модель. Всё, что она
					предложит, можно исправить или удалить. Изменения метрик сохранятся
					вместе с оценщиком по кнопке
					{{ reviewerId ? '«Сохранить»' : '«Создать»' }} внизу страницы.
				</p>
				<div v-if="!isLoading" class="metrics__list">
					<ul v-if="metrics.length" class="metrics__cards">
						<li v-for="(metric, index) in metrics" :key="index" class="metrics__card">
							<button
								type="button"
								class="metrics__toggle"
								:aria-expanded="expandedMetricIndex === index"
								:aria-controls="`edit-metric-panel-${index}`"
								@click="toggleMetric(metric, index)"
							>
								<span class="metrics__name">{{ metric.display_name }}</span>
								<span class="metrics__weight">{{ metric.value }}</span>
								<span class="metrics__track" aria-hidden="true">
									<span class="metrics__bar" :style="{ width: metricWidth(metric) }" />
								</span>
							</button>
							<div
								v-if="expandedMetricIndex === index && metricDraft"
								:id="`edit-metric-panel-${index}`"
								class="metrics__panel"
							>
								<p class="metrics__description">
									{{ metric.description || 'Описание не заполнено.' }}
								</p>
								<div class="metrics__fields">
									<UIInput
										v-model="metricDraft.display_name"
										label="Название"
										required
										@keydown.enter.stop.prevent
									/>
									<UITextArea v-model="metricDraft.description" label="Описание" :rows="3" />
									<UIInput
										:model-value="metricDraft.value"
										label="Важность (от 1 до 10)"
										type="number"
										required
										@update:model-value="metricDraft.value = Number($event)"
										@keydown.enter.stop.prevent
									/>
								</div>
								<p v-if="metricError" class="metrics__error" role="alert">{{ metricError }}</p>
								<div class="metrics__actions">
									<UIButton variant="secondary" size="sm" @click="applyMetric">Применить</UIButton>
									<UIButton variant="ghost" size="sm" @click="cancelMetricEdit">Отмена</UIButton>
									<UIButton variant="ghost" color="red" size="sm" @click="askDeleteMetric(index)">Удалить метрику</UIButton>
								</div>
							</div>
						</li>
					</ul>
					<UIButton
						variant="secondary"
						is-block
						:is-disabled="expandedMetricIndex !== null"
						@click="openMetricModal"
					>
						<template #icon-left><IconAdd size="18" /></template>
						Добавить метрику
					</UIButton>
				</div>
				<div v-else class="metrics__loading">
					<UILoading size="lg" />
				</div>
			</div>

			<div class="form__actions">
				<UIButton type="submit" :is-disabled="expandedMetricIndex !== null">
					{{ reviewerId ? 'Сохранить' : 'Создать' }}
				</UIButton>
				<UIButton variant="ghost" @click="router.push('/reviewer')">
					Отмена
				</UIButton>
			</div>
		</form>
		<Transition name="fade">
			<ModalMetric
				v-if="isMetricModalOpen"
				@close="closeMetricModal"
				@create="createMetric"
			/>
		</Transition>
		<Transition name="fade">
			<ModalConfirm
				v-if="metricToDelete"
				title="Удалить метрику?"
				:text="`Метрика «${metricToDelete.display_name}» будет удалена из списка. Сохраните оценщика, чтобы применить изменение.`"
				@confirm="deleteMetric"
				@close="cancelDeleteMetric"
			/>
		</Transition>
	</section>
</template>

<style lang="scss" scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: var(--s-4);
	max-width: 36rem;

	&__row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: var(--s-4);
	}

	&__actions {
		display: flex;
		gap: var(--s-3);
		margin-top: var(--s-2);
		padding-top: var(--s-4);
		border-top: 1px solid var(--border);
	}
}

.metrics {
	display: flex;
	flex-direction: column;
	gap: var(--s-3);
	margin-top: var(--s-2);
	padding-top: var(--s-4);
	border-top: 1px solid var(--border);

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
	}

	&__title {
		@include h4;
	}

	&__hint {
		max-width: 60ch;
		color: var(--text-3);
		font-size: var(--t-sm);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	&__cards {
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background-color: var(--surface);
		overflow: hidden;
	}

	&__card + &__card {
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

		&:hover {
			background-color: var(--surface-hover);
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
	}

	&__description {
		margin-bottom: var(--s-4);
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__fields {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
		margin-top: var(--s-3);
	}

	&__error {
		margin-top: var(--s-2);
		color: var(--err);
		font-size: var(--t-sm);
	}

	&__loading {
		display: flex;
		justify-content: center;
		padding: var(--s-6);
	}
}
</style>
