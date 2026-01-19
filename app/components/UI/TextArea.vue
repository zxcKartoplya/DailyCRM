<script setup lang="ts">
defineProps({
	placeholder: String,
})

const model = defineModel<string>()
</script>

<template>
	<textarea
		v-model="model"
		name="description"
		:placeholder="placeholder"
		class="custom-textarea"
		type="text"
	></textarea>
</template>

<style lang="scss" scoped>
.custom-textarea {
	height: 8rem;
	padding: 1rem;
	border-radius: 10px;
	background-color: $bg-grey;
	&:focus {
		outline: none;
	}
}
</style>
