<script setup>
const props = defineProps({
	items: Array,
})
</script>

<template>
	<div class="dropdown__wrap">
		<div class="dropdown">
			<div
				v-for="item in items"
				class="dropdown__item"
				:class="{ red: item.red }"
				@click="item.func()"
			>
				{{ item.title }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dropdown {
	display: flex;
	flex-direction: column;
	min-width: 11rem;
	padding: var(--s-1);
	border: 1px solid var(--border-strong);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;
}

.dropdown__item {
	display: flex;
	align-items: center;
	gap: var(--s-2);
	height: var(--control-h);
	padding: 0 var(--s-3);
	border: none;
	border-radius: var(--r-sm);
	background-color: transparent;
	color: var(--text-1);
	font-size: var(--t-md);
	white-space: nowrap;
	cursor: pointer;
	transition: background-color var(--dur-fast) var(--ease);

	&:hover {
		background-color: var(--surface-hover);
	}

	&:active {
		background-color: var(--surface-active);
	}
}

.red {
	color: var(--err);

	&:hover {
		background-color: var(--err-weak);
	}
}
</style>
