<script setup>
defineProps({
	title: String,
	sortId: String,
	isSortable: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	direction: {
		type: String,
		default: 'asc',
	},
})

defineEmits(['sort'])

const DIRECTION_LABEL = {
	asc: 'по возрастанию',
	desc: 'по убыванию',
}
</script>

<template>
	<div class="table-head__item">
		<button
			v-if="isSortable"
			type="button"
			class="table-head__sort"
			:class="{ 'table-head__sort--active': isActive }"
			@click="$emit('sort', sortId)"
		>
			{{ title }}
			<span class="table-head__arrow" aria-hidden="true">
				{{ isActive ? (direction === 'desc' ? '↓' : '↑') : '↕' }}
			</span>
			<span v-if="isActive" class="table-head__state">
				, сортировка {{ DIRECTION_LABEL[direction] }}
			</span>
		</button>
		<template v-else>{{ title }}</template>
	</div>
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

.table-head__sort {
	display: inline-flex;
	align-items: center;
	gap: var(--s-1);
	margin: 0;
	padding: 0;
	border: 0;
	border-radius: var(--r-sm);
	background: none;
	color: inherit;
	font: inherit;
	letter-spacing: inherit;
	text-transform: inherit;
	cursor: pointer;
	transition: color var(--dur-fast) var(--ease);

	&:hover,
	&--active {
		color: var(--text-1);
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.table-head__arrow {
	opacity: 0.5;

	.table-head__sort--active & {
		opacity: 1;
	}
}

.table-head__state {
	@include visually-hidden;
}

@media (prefers-reduced-motion: reduce) {
	.table-head__sort {
		transition: none;
	}
}
</style>
