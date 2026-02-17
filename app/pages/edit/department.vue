<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
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
			alertStore.showAlert(Alert.AddedError)
		}
	} catch (error) {
		alertStore.showAlert(Alert.AddedError)
	}
})
</script>

<template>
	<form class="page" @submit.prevent="add">
		<div class="page__text">Добавление нового департамента</div>
		<Field
			v-slot="{ field, errorMessage, handleChange, handleBlur }"
			name="name"
		>
			<UIInput
				label="Название департамента "
				placeholder="Введите название департамента"
				:modelValue="field.value"
				:error="errorMessage"
				@blur="handleBlur"
				@update:model-value="handleChange"
			/>
		</Field>
		<UIButton type="submit">Добавить</UIButton>
	</form>
</template>

<style lang="scss" scoped>
.page {
	@include flex(column, null, null);
	&__text {
		margin-bottom: rem(16);
		@include h1;
	}
}
</style>
