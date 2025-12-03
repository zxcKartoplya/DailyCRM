<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'

const alertStore = useAlertStore()
</script>

<template>
	<div>
		<NuxtLayout />
		<NuxtPage class="main" />
		<Transition name="fade">
			<Alert v-if="alertStore.isShowAlert" />
		</Transition>
	</div>
</template>

<style lang="scss">
.main {
	padding-top: rem(20);
	padding-left: rem(270);
}
</style>
