<script setup lang="ts">
defineProps({
	placeholder: String,
})

const model = defineModel<string>()
</script>

<template>
	<textarea
		v-model="model"
		:placeholder="placeholder"
		class="custom-textarea"
	></textarea>
</template>

<style lang="scss" scoped>
.custom-textarea {
	width: 100%;
	height: 8rem;
	padding: 1rem;
	border-radius: 10px;
	background-color: $bg-grey;
	&:focus {
		outline: none;
	}
}
</style>
