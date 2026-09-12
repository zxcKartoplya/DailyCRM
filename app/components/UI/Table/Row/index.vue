<script setup>
const props = defineProps({
	columnTemplates: {
		type: String,
		required: false,
	},
})

const columnTemplatesStyle = props.columnTemplates
</script>

<template>
	<div class="table-row">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.table-row {
	display: grid;
	position: relative;
	min-width: 100%;
	align-items: center;
	border-bottom: 1px solid var(--border);
	color: var(--text-1);
	grid-template-columns: v-bind(columnTemplatesStyle);
	transition: background-color var(--dur-fast) var(--ease);

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: var(--surface-hover);
	}
}
</style>
