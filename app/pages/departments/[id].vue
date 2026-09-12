<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { putDepartamentSchema } from '~/utils/validation/putDepartamentSchema'

const departamentsStore = useDepartamentsStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

await departamentsStore.fetchDepartament(id)

const { handleSubmit, values } = useForm({
	validationSchema: putDepartamentSchema,
	initialValues: {
		name: departamentsStore.departament?.name,
	},
})

const update = handleSubmit(() => {
	departamentsStore.putDepartament(id, values)
	router.push('/departments')
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
					<UIButton type="submit">Сохранить</UIButton>
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
