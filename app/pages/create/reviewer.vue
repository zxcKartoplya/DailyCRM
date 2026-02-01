<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useDepartamentsStore } from '~/stores/departments'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload, Metric } from '~/types/reviewers'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()

const { loading } = toRefs(reviewersStore)

const departamentsStore = useDepartamentsStore()
const alertStore = useAlertStore()
const router = useRouter()

const metrics = ref<Metric[]>([])
const departamentsOptions = computed(() => {
	if (departamentsStore.departaments?.length) {
		return departamentsStore.departaments.map(dept => ({
			name: dept.name,
			value: dept.id,
		}))
	}
	return []
})

const isMetricModalOpen = ref(false)
const curretnMetric = ref<Metric | null>(null)

const { handleSubmit, values } = useForm<APIReviewerPayload>({
	validationSchema: reviewerSchema,
	initialValues: {
		name: '',
		description: '',
		department_id: 0,
	},
})

const add = handleSubmit(async formValues => {
	try {
		const created = await reviewersStore.addReviewer({
			...formValues,
			metrics: metrics.value,
		})
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

onMounted(() => {
	departamentsStore.fetchDepartaments()
})
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

			<Field
				v-slot="{ field, handleChange, errorMessage }"
				name="department_id"
			>
				<UISelect
					label="Закрепленный департамент"
					placeholder="Выберите департамент"
					:options="departamentsOptions"
					:modelValue="field.value"
					@update:model-value="handleChange"
				/>
			</Field>

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
				<div v-if="!loading" class="page__metrics">
					<MetricItem
						v-for="(metric, index) in metrics"
						:key="index"
						:display_name="metric.display_name"
						:value="metric.value"
						:description="metric.description"
						@open="openMetric(metric)"
						@close="deleteMetric(metric.display_name)"
					/>
					<UIButton size="full" color="grey" @click="openMetricModal">
						<IconAdd />
					</UIButton>
				</div>
				<div v-else class="page__metrics-loading">
					<UILoading size="lg" />
				</div>
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

	&__metrics {
		@include flex(column, null, null, rem(8));

		&-loading {
			@include flex(column, center, center);
			height: rem(100);
		}
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
