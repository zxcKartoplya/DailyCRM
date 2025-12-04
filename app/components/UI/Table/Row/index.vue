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
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
.table-row {
	display: grid;
	min-width: 100%;
	width: fit-content;
	align-items: center;
	position: relative;
	border-bottom: 1px solid $gray-light;
	color: $color-surface;
	@include body-usual-regular;
	grid-template-columns: v-bind(columnTemplatesStyle);
}
</style>
