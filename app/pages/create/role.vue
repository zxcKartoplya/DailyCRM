<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { useReviewersStore } from '~/stores/reviewers'
import { useJobStore } from '~/stores/role'
import { mapForSelect } from '~/utils/mappers/select'
import { JobCreateSchema } from '~/utils/validation/JobCreateSchema'

const jobStore = useJobStore()
const reviewersStore = useReviewersStore()
const departamentsStore = useDepartamentsStore()

const { handleSubmit, values } = useForm({
	validationSchema: JobCreateSchema,
	initialValues: {
		name: '',
	},
})

const departamentsOptions = computed(() => {
	return mapForSelect(departamentsStore.departaments)
})
const reviewersOptions = computed(() => {
	return mapForSelect(reviewersStore.reviewers)
})

const add = handleSubmit(() => {
	jobStore.addJob(values)
})

onMounted(() => {
	departamentsStore.fetchDepartaments()
	reviewersStore.fetchReviewers()
})
</script>

<template>
	<form class="page" @submit.prevent="add">
		<div class="page__text">Добавление новой роли работника</div>
		<div class="page__field">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Название роли"
					placeholder="Введите название роли"
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<div class="page__field-row">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="department_id"
				>
					<UISelect
						label="Оценщик"
						placeholder="Выберите оценщика"
						:options="reviewersOptions"
						:modelValue="field.value"
						:error="errorMessage"
						@update:model-value="handleChange"
					/>
				</Field>
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="reviewer_id"
				>
					<UISelect
						label="Закрепленный департамент"
						placeholder="Выберите департамент"
						:options="departamentsOptions"
						:modelValue="field.value"
						:error="errorMessage"
						@update:model-value="handleChange"
					/>
				</Field>
			</div>
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="description"
			>
				<UIInput
					label="Описание роли"
					placeholder="Введите описание роли"
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
		</div>
		<UIButton class="page__button" type="submit">Добавить</UIButton>
	</form>
</template>

<style lang="scss" scoped>
.page {
	&__text {
		@include h2;
	}
	&__field {
		padding-top: rem(20);
		@include flex(col, null, null, rem(12));

		&-row {
			@include flex(row, space-between, center, rem(20));
		}
	}
	&__button {
		margin: 0 auto;
	}
}
</style>
