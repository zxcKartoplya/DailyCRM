<script setup>
defineProps({
	text: [String, Number],
	isLink: Boolean,
	isEllipsis: Boolean,
	isNumeric: Boolean,
})
</script>

<template>
	<div class="table-column">
		<div
			class="table-text"
			:class="{
				'table-text--link': isLink,
				'table-text--ellipsis': isEllipsis,
				'table-text--numeric': isNumeric,
			}"
		>
			{{ text }}
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.table-column {
	display: flex;
	align-items: center;
	min-height: var(--row-h);
	padding: var(--s-2) var(--s-4);
	min-width: 0;
}

.table-text {
	min-width: 0;
	color: var(--text-1);
	font-size: var(--t-md);

	&--ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&--numeric {
		@include numeric;
		color: var(--text-2);
	}

	&--link {
		cursor: pointer;
		color: var(--accent-text);
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
