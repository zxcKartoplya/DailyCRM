<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useDailiesStore } from '~/stores/dailies'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
import { alertMessage } from '~/utils/alertMessage'
import { putDepartamentSchema } from '~/utils/validation/putDepartamentSchema'

const departamentsStore = useDepartamentsStore()
const dailiesStore = useDailiesStore()
const alertStore = useAlertStore()
const { dailies, isLoading, periodDays } = storeToRefs(dailiesStore)
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const periods = [7, 14, 30]

await departamentsStore.fetchDepartament(id)
await dailiesStore.fetchDepartmentDailies(id)

const isSubmitting = ref(false)

const { handleSubmit } = useForm({
	validationSchema: putDepartamentSchema,
	initialValues: {
		name: departamentsStore.departament?.name,
	},
})

const update = handleSubmit(async formValues => {
	isSubmitting.value = true
	try {
		await departamentsStore.putDepartament(id, formValues)
		alertStore.showAlert(Alert.Added)
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.AddedError))
	} finally {
		isSubmitting.value = false
	}
})
</script>

<template>
	<section v-if="departamentsStore.departament" class="page">
		<header class="page__head">
			<h1 class="page__title">{{ departamentsStore.departament.name }}</h1>
		</header>

		<dl class="facts">
			<div class="facts__item">
				<dt class="facts__label">Сотрудников</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.employees_count ?? 0 }}
				</dd>
			</div>
			<div class="facts__item">
				<dt class="facts__label">Ролей</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.jobs_count ?? 0 }}
				</dd>
			</div>
		</dl>

		<section class="section">
			<div class="section__head">
				<h2 class="section__title">Дейлики</h2>
				<div class="periods">
					<UIButton
						v-for="period in periods"
						:key="period"
						:variant="period === periodDays ? 'primary' : 'ghost'"
						@click="dailiesStore.setPeriod(period, id)"
					>
						{{ period }} дней
					</UIButton>
				</div>
			</div>

			<UILoading v-if="isLoading" />
			<DailiesDepartmentGrid v-else-if="dailies" :dailies="dailies" />
		</section>

		<section class="section">
			<h2 class="section__title">Переименовать департамент</h2>
			<form class="form" @submit.prevent="update">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="name"
				>
					<UIInput
						label="Название"
						placeholder="Введите название департамента"
						:model-value="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
				<div class="form__actions">
					<UIButton type="submit" :is-loading="isSubmitting">Сохранить</UIButton>
					<UIButton variant="ghost" @click="router.push('/departments')">
						Отмена
					</UIButton>
				</div>
			</form>
		</section>
	</section>
</template>

<style lang="scss" scoped>
.facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	gap: 1px;
	margin: 0;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--border);
	overflow: hidden;

	&__item {
		padding: var(--s-4);
		background-color: var(--surface);
	}

	&__label {
		@include label;
	}

	&__value {
		margin: var(--s-2) 0 0;
		font-size: var(--t-xl);
		font-weight: 500;

		&--numeric {
			@include numeric;
		}
	}
}

.section {
	margin-top: var(--s-6);
	padding-top: var(--s-5);
	border-top: 1px solid var(--border);

	&__title {
		@include h4;
		margin-bottom: var(--s-4);
	}

	&__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-3);

		.section__title {
			margin-bottom: 0;
		}
	}
}

.periods {
	display: flex;
	gap: var(--s-2);
	margin-bottom: var(--s-4);
}

.form {
	max-width: 26rem;

	&__actions {
		display: flex;
		gap: var(--s-3);
		margin-top: var(--s-4);
	}
}
</style>
