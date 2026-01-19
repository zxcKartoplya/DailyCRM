<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload, Metric } from '~/types/reviewers'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const alertStore = useAlertStore()
const router = useRouter()

const assignedDepartment = ref('')
const metrics = ref<Metric[]>([])

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
					@close="deleteMetric(metric.display_name)"
				/>
				<UIButton color="grey"><IconAdd /></UIButton>
			</div>
		</div>

		<UIButton type="submit" class="page__button">Создать</UIButton>
	</form>
</template>

<style lang="scss" scoped>
.page {
	@include flex(column, null, null);
	gap: rem(16);

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
