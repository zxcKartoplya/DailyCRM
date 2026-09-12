<script lang="ts" setup>
type Props = {
	size?: string
}

const { size = '24' } = defineProps<Props>()
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:height="`${size}px`"
		viewBox="0 -960 960 960"
		:width="`${size}px`"
		fill="currentColor"
	>
		<path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" />
	</svg>
</template>

<style lang="scss" scoped></style>
