<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
import { alertMessage } from '~/utils/alertMessage'
import { departamentSchema } from '~/utils/validation/departamentSchema'

const departamentsStore = useDepartamentsStore()
const alertStore = useAlertStore()
const router = useRouter()

const { handleSubmit, errors } = useForm({
	validationSchema: departamentSchema,
	initialValues: {
		name: '',
	},
})

const add = handleSubmit(async formValues => {
	try {
		const created = await departamentsStore.addDepartament(formValues.name)
		if (created) {
			router.push('/departments')
			alertStore.showAlert(Alert.Added)
		}
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.AddedError))
	}
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Новый департамент</h1>
		</header>
		<form class="form" @submit.prevent="add">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Название"
					placeholder="Например, Разработка"
					:model-value="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<div class="form__actions">
				<UIButton type="submit">Добавить</UIButton>
				<UIButton variant="ghost" @click="router.push('/departments')">
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
