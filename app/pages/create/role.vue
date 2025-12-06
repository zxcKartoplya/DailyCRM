<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useJobStore } from '~/stores/role'
import { RoleCreateSchema } from '~/utils/validation/RoleCreateSchema'

const jobStore = useJobStore()

const { handleSubmit, errors, values } = useForm({
	validationSchema: RoleCreateSchema,
	initialValues: {
		name: '',
	},
})

const add = handleSubmit(() => {
	jobStore.addJob(values)
})
</script>

<template>
	<form class="page" @submit.prevent="add">
		{{ values }}
		<div class="page__text">Добавление новой роли работника</div>
		<div class="page__field">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="department_id"
			>
				<UIInput
					label="Департамент роли"
					placeholder="Выберите департамент"
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
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
		@include flex(row, space-between, center, rem(20));
	}
	&__button {
		margin: 0 auto;
	}
}
</style>
