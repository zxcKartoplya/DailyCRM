<template>
	<div class="table-column">
		<div
			class="table-text"
			:class="{
				'table-text--link': isLink,
				'table-text--ellipsis': isEllipsis,
			}"
		>
			{{ text }}
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	text: [String, Number],
	isLink: Boolean,
	isEllipsis: Boolean,
})
</script>

<style lang="scss" scoped>
.table-column {
	display: block;
	position: relative;
	padding: rem(17) rem(20);
}

.table-text {
	display: block;
	color: $color-surface;
	@include body-usual-regular;

	&--ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&--link {
		cursor: pointer;
		color: $blue;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
