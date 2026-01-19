<script lang="ts" setup>
type Props = {
	size?: string
	color?: string
}

const { size = '24', color } = defineProps<Props>()
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:height="`${size}px`"
		viewBox="0 -960 960 960"
		:width="`${size}px`"
		fill="#e3e3e3"
	>
		<path
			d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"
		/>
	</svg>
</template>

<style lang="scss" scoped></style>
