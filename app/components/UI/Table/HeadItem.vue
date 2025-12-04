<script setup>
// import { useSortStore } from '@/stores/sort.js';

const props = defineProps({
	title: String,
	sortId: String,
})

// const sortStore = useSortStore();

const sorted = computed(() => {
	if (sortStore.sortBy === props.sortId) {
		return sortStore.sortDirection
	} else {
		return 'none'
	}
})
</script>

<template>
	<div
		class="table-head__item"
		:class="{
			'table-head__item--sortable': sortId,
			'table-head__item--static': !sortId,
		}"
	>
		{{ title }}
		<button class="table-head__button">
			<!-- <IconSort v-if="sortId" :sorted="sorted" /> -->
		</button>
	</div>
</template>

<style lang="scss" scoped>
.table-head__item {
	display: flex;
	align-items: center;
	gap: rem(4);
	padding: rem(17) rem(20);
	white-space: nowrap;
	user-select: none;
}

.table-head__item--sortable {
	cursor: pointer;
}

.table-head__item--static {
	cursor: default;
}

.table-head__button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: rem(20);
	height: rem(20);
	background: transparent;
	border: none;
	padding: 0;
}
</style>
