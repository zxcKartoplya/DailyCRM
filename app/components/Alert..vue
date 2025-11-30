<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'

const alertStore = useAlertStore()
</script>

<template>
	<div class="alert">
		<div>!</div>
		<div class="alert__text">{{ alertStore.alert }}</div>
	</div>
</template>

<style lang="scss" scoped>
.alert {
	background-color: $bg-black;
	border-radius: rem(8);
	bottom: rem(24);
	padding: rem(13) rem(20);
	right: rem(24);
	position: fixed;
	z-index: 1200;
	@include flex(row, center, center, rem(12));
	&__text {
		color: $bg-white;
	}
}
</style>
