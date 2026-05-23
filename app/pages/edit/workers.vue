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
	<form class="page" @submit.prevent="add">
		<div class="page__text">
			{{ workerId ? 'Редактирование' : 'Добавление нового' }} работника
		</div>
		<div class="page__field">
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
			<div class="page__field-row">
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
			<div class="page__field-row">
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
		</div>
		<UIButton class="page__button" type="submit">{{
			workerId ? 'Сохранить' : 'Добавить'
		}}</UIButton>
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
