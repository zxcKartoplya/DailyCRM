<script lang="ts" setup>
type Props = {
	name: string
	path: string
}

const { name, path } = defineProps<Props>()
</script>

<template>
	<NuxtLink class="item" :to="path">
		!
		<div class="item__text">{{ name }}</div>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.item {
	cursor: pointer;
	padding: rem(20);
	margin: rem(6) rem(10);
	border-radius: $radius-md;
	background-color: $bg-blue;
	@include flex(row, center, center, rem(12));
	&__text {
	}
}
</style>
