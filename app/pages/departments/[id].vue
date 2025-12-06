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
	<div class="page">
		<div class="form" v-if="departamentsStore.departament">
			<div class="form-title">
				Редактирование департамента - "{{ departamentsStore.departament.name }}"
			</div>
			<form @submit.prevent="update">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="name"
				>
					<UIInput
						label="Новое название департамента "
						placeholder="Введите название департамента"
						:modelValue="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
				<UIButton type="submit">Изменить</UIButton>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.form {
	@include flex(column, null, null, rem(21));
	&-title {
		@include h2;
	}
}
</style>
