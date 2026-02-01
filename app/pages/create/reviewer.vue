<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useDepartamentsStore } from '~/stores/departments'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload, Metric } from '~/types/reviewers'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const departamentsStore = useDepartamentsStore()
const alertStore = useAlertStore()
const router = useRouter()

const assignedDepartment = ref('')
const metrics = ref<Metric[]>([
	{
		value: 9,
		json_name: 'productivity',
		display_name: 'Продуктивность разработки',
		description: 'Скорость выполнения задач и достижение целей в срок',
	},
	{
		value: 8,
		json_name: 'teamwork',
		display_name: 'Командная работа',
		description: 'Умение эффективно взаимодействовать с командой и коллегами',
	},
	{
		value: 7,
		json_name: 'code_quality',
		display_name: 'Качество кода',
		description: 'Соответствие стандартам написания кода и отсутствие багов',
	},
	{
		value: 6,
		json_name: 'technical_skills',
		display_name: 'Технические навыки',
		description: 'Уровень владения инструментами и технологиями разработки',
	},
])

const isMetricModalOpen = ref(false)
const curretnMetric = ref<Metric | null>(null)

const { handleSubmit, values } = useForm<APIReviewerPayload>({
	validationSchema: reviewerSchema,
	initialValues: {
		name: '',
		description: '',
	},
})

const add = handleSubmit(async formValues => {
	try {
		const created = await reviewersStore.addReviewer(formValues)
		if (created) {
			router.push('/reviewers')
			alertStore.showAlert(Alert.Added)
		}
	} catch (error) {
		alertStore.showAlert(Alert.AddedError)
	}
})

const getDescription = async () => {
	const responce = await reviewersStore.fetchDescription(
		values.name,
		values.description,
	)

	metrics.value = responce
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
	curretnMetric.value = metric
	isMetricModalOpen.value = true
}

const closeMetricModal = () => {
	isMetricModalOpen.value = false
	curretnMetric.value = null
}

const createMetric = (metric: Metric) => {
	if (curretnMetric.value) {
		const index = metrics.value.findIndex(
			m => m.display_name === curretnMetric.value?.display_name,
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
	<form class="page" @submit.prevent="add">
		<div class="page__text">Создание оценщика</div>
		<div class="page__fields">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Роль оценщика"
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
					label="Краткое описание роли"
					placeholder="Что именно оценивает данный тип оценщика"
					required
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>

			<UIInput
				label="Закрепленный департамент"
				placeholder="Например: Операционный анализ"
				:modelValue="assignedDepartment"
			/>

			<div class="page__textarea">
				<div class="page__row">
					<div class="page__label">Метрики, которые отслеживает оценщик</div>
					<UIButton
						@click="getDescription"
						variant="secondary"
						:is-disabled="values.name === '' || values.description === ''"
						>{{ metrics.length ? 'Обновить' : 'Заполнить' }}</UIButton
					>
				</div>
				<MetricItem
					v-for="(metric, index) in metrics"
					:key="index"
					:display_name="metric.display_name"
					:value="metric.value"
					:description="metric.description"
					@open="openMetric(metric)"
					@close="deleteMetric(metric.display_name)"
				/>
				<UIButton color="grey" @click="openMetricModal">
					<IconAdd />
				</UIButton>
			</div>
		</div>

		<UIButton type="submit" class="page__button">Создать</UIButton>
		<Transition name="fade">
			<ModalMetric
				v-if="isMetricModalOpen"
				:metric="curretnMetric ?? undefined"
				@close="closeMetricModal"
				@create="createMetric"
			/>
		</Transition>
	</form>
</template>

<style lang="scss" scoped>
.page {
	gap: rem(16);
	@include flex(column, null, null);

	&__text {
		@include h1;
	}

	&__fields {
		@include flex(column, null, null, rem(12));
	}

	&__textarea {
		@include flex(column, null, null, rem(8));
	}

	&__row {
		@include flex(row, space-between, center);
	}

	&__label {
		font-size: rem(14);
		font-weight: 600;
		color: $text-grey;
	}

	&__button {
		align-self: flex-start;
	}
}
</style>
