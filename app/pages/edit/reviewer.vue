<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload, Metric } from '~/types/reviewers'
import { alertMessage } from '~/utils/alertMessage'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const { isLoading } = storeToRefs(reviewersStore)

const alertStore = useAlertStore()
const router = useRouter()

const metrics = ref<Metric[]>([])

const isMetricModalOpen = ref(false)
const currentMetric = ref<Metric | null>(null)

const { handleSubmit, values } = useForm<APIReviewerPayload>({
	validationSchema: reviewerSchema,
	initialValues: {
		name: '',
		description: '',
	},
})

const add = handleSubmit(async formValues => {
	try {
		const created = await reviewersStore.addReviewer({
			...formValues,
			metrics: metrics.value,
		})
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

const deleteMetric = (display_name: string) => {
	metrics.value = metrics.value.filter(
		metric => metric.display_name !== display_name,
	)
}

const openMetricModal = () => {
	isMetricModalOpen.value = true
}

const openMetric = (metric: Metric) => {
	currentMetric.value = metric
	isMetricModalOpen.value = true
}

const closeMetricModal = () => {
	isMetricModalOpen.value = false
	currentMetric.value = null
}

const createMetric = (metric: Metric) => {
	if (currentMetric.value) {
		const index = metrics.value.findIndex(
			m => m.display_name === currentMetric.value?.display_name,
		)
		metrics.value[index] = metric
		closeMetricModal()
		return
	}
	metrics.value.push(metric)
	closeMetricModal()
}
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Новый оценщик</h1>
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
						:is-disabled="values.name === '' || values.description === ''"
						>{{ metrics?.length ? 'Обновить' : 'Заполнить' }}</UIButton
					>
				</div>
				<p class="metrics__hint">
					Заполните название и описание — метрики предложит модель. Всё, что она
					предложит, можно исправить или удалить.
				</p>
				<div v-if="!isLoading" class="metrics__list">
					<MetricItem
						v-for="(metric, index) in metrics"
						:key="index"
						:display_name="metric.display_name"
						:value="metric.value"
						:description="metric.description"
						@open="openMetric(metric)"
						@close="deleteMetric(metric.display_name)"
					/>
					<UIButton variant="secondary" is-block @click="openMetricModal">
						<template #icon-left><IconAdd size="18" /></template>
						Добавить метрику
					</UIButton>
				</div>
				<div v-else class="metrics__loading">
					<UILoading size="lg" />
				</div>
			</div>

			<div class="form__actions">
				<UIButton type="submit">Создать</UIButton>
				<UIButton variant="ghost" @click="router.push('/reviewer')">
					Отмена
				</UIButton>
			</div>
		</form>
		<Transition name="fade">
			<ModalMetric
				v-if="isMetricModalOpen"
				:metric="currentMetric ?? undefined"
				@close="closeMetricModal"
				@create="createMetric"
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

	&__loading {
		display: flex;
		justify-content: center;
		padding: var(--s-6);
	}
}
</style>
