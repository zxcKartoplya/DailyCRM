<script lang="ts" setup>
import loginSchema from '@/utils/validation/loginSchema'
import { Field, useForm } from 'vee-validate'

const { values, errors } = useForm({
	validationSchema: loginSchema,
	initialValues: {
		email: '',
		password: '',
	},
})
</script>

<template>
	<div class="login">
		<div class="login__form">
			<form @submit.prevent="console.log(values)">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="email"
				>
					<UIInput
						label="Email Address"
						placeholder="Enter email address"
						:modelValue="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="password"
				>
					<UIInput
						label="Password"
						placeholder="Enter the password"
						:modelValue="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
				<UIButton
					type="submit"
					variant="primary"
					size="md"
					:is-disabled="!!errors.email || !!errors.password"
				>
					Login
				</UIButton>
			</form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.login {
	@include container;
	&__form {
		@include flex(column, center, center, rem(10));
	}
}
</style>
