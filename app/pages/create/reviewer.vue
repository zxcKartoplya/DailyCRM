<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload } from '~/types/reviewers'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const alertStore = useAlertStore()
const router = useRouter()

const assignedDepartment = ref('')
const scoringModel = ref('')
const maxWorkers = ref<number | null>(null)
const metricsFocus = ref('')

const { handleSubmit } = useForm<APIReviewerPayload>({
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
				@update:model-value="assignedDepartment = $event"
			/>

			<UIInput
				label="Модель скоринга"
				placeholder="Например: A/B/C, 5-балльная шкала"
				:modelValue="scoringModel"
				@update:model-value="scoringModel = $event"
			/>

			<UIInput
				label="Максимум работников в сопровождении"
				type="number"
				placeholder="Например: 12"
				:modelValue="maxWorkers"
				@update:model-value="maxWorkers = $event as number"
			/>

			<div class="page__textarea">
				<div class="page__label">Метрики, которые отслеживает оценщик</div>
				<UITextArea
					v-model="metricsFocus"
					placeholder="Например: полнота дейлика, качество формулировок, наличие блокеров"
				/>
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
