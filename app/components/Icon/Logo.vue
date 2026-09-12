<script lang="ts" setup>
type Props = {
	size?: string
	color?: string
}

const { size = '24', color = 'currentColor' } = defineProps<Props>()
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:height="`${size}px`"
		viewBox="0 -960 960 960"
		:width="`${size}px`"
		:fill="color"
	>
		<path
			d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"
		/>
	</svg>
</template>

<style lang="scss" scoped></style>
