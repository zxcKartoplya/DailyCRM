<script setup>
defineProps({
	title: String,
	sortId: String,
})
</script>

<template>
	<div class="table-head__item">{{ title }}</div>
</template>

<style lang="scss" scoped>
.table-head__item {
	display: flex;
	align-items: center;
	min-height: var(--row-h);
	padding: 0 var(--s-4);
	white-space: nowrap;
	user-select: none;
	@include label;
}
</style>
