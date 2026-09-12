<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { useReviewersStore } from '~/stores/reviewers'
import { useJobStore } from '~/stores/role'
import { mapForSelect } from '~/utils/mappers/select'
import { Alert } from '~/types/alert'
import { alertMessage } from '~/utils/alertMessage'
import { JobCreateSchema } from '~/utils/validation/JobCreateSchema'

const reviewersStore = useReviewersStore()
const departamentsStore = useDepartamentsStore()
const jobStore = useJobStore()
const alertStore = useAlertStore()
const { job } = storeToRefs(jobStore)
const route = useRoute()
const router = useRouter()
const jobId = route.query.id as string

if (jobId) {
	await jobStore.fetchJob(jobId)
}

const { handleSubmit, values } = useForm({
	validationSchema: JobCreateSchema,
	initialValues: {
		name: job.value?.name,
		reviewer_id: job.value?.reviewer_id,
		department_id: job.value?.department_id,
		description: job.value?.description ?? undefined,
	},
})

const departamentsOptions = computed(() => {
	return mapForSelect(departamentsStore.departaments)
})
const reviewersOptions = computed(() => {
	return mapForSelect(reviewersStore.reviewers)
})

const add = handleSubmit(async () => {
	try {
		if (jobId) {
			await jobStore.putJob(jobId, values)
		} else {
			await jobStore.addJob(values)
		}
		router.push('/role')
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.AddedError))
	}
})

onMounted(() => {
	departamentsStore.fetchDepartaments()
	reviewersStore.fetchReviewers()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">
				{{ jobId ? 'Редактирование роли' : 'Новая роль' }}
			</h1>
		</header>
		<form class="form" @submit.prevent="add">
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
			<div class="form__row">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="reviewer_id"
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
					name="department_id"
				>
					<UISelect
						label="Департамент"
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
			<div class="form__actions">
				<UIButton type="submit">
					{{ jobId ? 'Сохранить' : 'Добавить' }}
				</UIButton>
				<UIButton variant="ghost" @click="router.push('/role')">Отмена</UIButton>
			</div>
		</form>
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
</style>
