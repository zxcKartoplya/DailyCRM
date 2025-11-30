<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'

const alertStore = useAlertStore()
</script>

<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtPage />
		<Transition name="fade">
			<Alert v-if="alertStore.isShowAlert" />
		</Transition>
	</div>
</template>

<style lang="scss"></style>
