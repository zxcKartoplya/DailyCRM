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
	border-radius: $radius-md;
	overflow: hidden;
	background-color: $white;
	@include shadow($shadow-color);
}

.dropdown__item {
	display: flex;
	align-items: center;
	gap: rem(8);
	padding: rem(12) rem(16);
	white-space: nowrap;
	color: $color-surface;
	background-color: transparent;
	border: none;
	cursor: pointer;
	@include body-usual-regular;
	transition: background-color 0.15s ease;

	&:hover {
		background-color: $cool-gray-light;
	}

	&:active {
		background-color: $gray-light;
	}
}

.red {
	color: #e11d48;
}
</style>
