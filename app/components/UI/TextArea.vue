<script setup lang="ts">
type Props = {
	placeholder: string
	label: string
}

const { label, placeholder } = defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
	<div class="custom-textarea-wrapper">
		<label v-if="label" class="custom-textarea__label">{{ label }}</label>
		<textarea
			v-model="model"
			name="description"
			:placeholder="placeholder"
			class="custom-textarea"
			type="text"
		></textarea>
	</div>
</template>

<style lang="scss" scoped>
.custom-textarea {
	height: 8rem;
	padding: 1rem;
	width: 100%;
	box-sizing: border-box;
	border-radius: 10px;
	background-color: $bg-grey;
	&:focus {
		outline: none;
	}

	&__label {
		display: inline-flex;
		align-items: center;
		padding-bottom: rem(6);
		font-size: 0.95rem;
		font-weight: 600;
		color: $text-grey;
		letter-spacing: 0.01em;
	}
}
</style>
