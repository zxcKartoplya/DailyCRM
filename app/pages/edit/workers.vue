<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { useJobStore } from '~/stores/role'
import { useWorkerStore } from '~/stores/workers'
import type { CreateUser } from '~/types/users'
import { Statuses } from '~/types/users'
import { mapForSelect } from '~/utils/mappers/select'
import { WorkerCreateSchema } from '~/utils/validation/WorkersSchema'

const departamentsStore = useDepartamentsStore()
const jobStore = useJobStore()
const workersStore = useWorkerStore()
const { worker } = storeToRefs(workersStore)
const route = useRoute()
const router = useRouter()
const workerId = route.query.id as string

if (workerId) {
	await workersStore.getWorker(workerId)
}

const statusOptions = [
	{ name: 'Активен', value: Statuses.ACTIVE },
	{ name: 'Неактивен', value: Statuses.INACTIVE },
	{ name: 'Приглашён', value: Statuses.INVITED },
]

const { handleSubmit, values } = useForm({
	validationSchema: WorkerCreateSchema,
	initialValues: {
		name: worker.value?.name,
		email: worker.value?.email,
		department_id: worker.value?.department_id,
		job_id: worker.value?.job_id,
		status: worker.value?.status,
	},
})

const departamentsOptions = computed(() =>
	mapForSelect(departamentsStore.departaments),
)
const jobOptions = computed(() => mapForSelect(jobStore.jobs ?? []))

const add = handleSubmit(() => {
	if (workerId) {
		workersStore.updateWorker(workerId, values as Partial<CreateUser>)
	} else {
		workersStore.createWorker(values as CreateUser)
	}
	router.push('/workers')
})

onMounted(() => {
	departamentsStore.fetchDepartaments()
	jobStore.fetchJobs()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">
				{{ workerId ? 'Редактирование сотрудника' : 'Новый сотрудник' }}
			</h1>
		</header>
		<form class="form" @submit.prevent="add">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Имя работника"
					placeholder="Введите имя работника"
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="email"
			>
				<UIInput
					label="Email"
					placeholder="Введите email"
					type="email"
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<div class="form__row">
				<Field v-slot="{ field, errorMessage, handleChange }" name="job_id">
					<UISelect
						label="Роль"
						placeholder="Выберите роль"
						:options="jobOptions"
						:modelValue="field.value"
						:error="errorMessage"
						@update:model-value="handleChange"
					/>
				</Field>
				<Field
					v-slot="{ field, errorMessage, handleChange }"
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
			<div class="form__row">
				<Field v-slot="{ field, errorMessage, handleChange }" name="status">
					<UISelect
						label="Статус"
						placeholder="Выберите статус"
						:options="statusOptions"
						:modelValue="field.value"
						:error="errorMessage"
						@update:model-value="handleChange"
					/>
				</Field>
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="password"
				>
					<UIInput
						label="Пароль"
						placeholder="Введите пароль"
						type="password"
						:modelValue="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
			</div>
			<div class="form__actions">
				<UIButton type="submit">
					{{ workerId ? 'Сохранить' : 'Добавить' }}
				</UIButton>
				<UIButton variant="ghost" @click="router.push('/workers')">
					Отмена
				</UIButton>
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
