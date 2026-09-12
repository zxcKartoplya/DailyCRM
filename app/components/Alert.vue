<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useAlertStore } from '~/stores/alert'

const alertStore = useAlertStore()
</script>

<template>
	<div class="alert" role="status" aria-live="polite">
		<Icon
			icon="material-symbols:error-outline-rounded"
			class="alert__icon"
			width="18"
			height="18"
		/>
		<div class="alert__text">{{ alertStore.alert }}</div>
	</div>
</template>

<style lang="scss" scoped>
.alert {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	position: fixed;
	right: var(--s-5);
	bottom: var(--s-5);
	z-index: 1200;
	max-width: 26rem;
	padding: var(--s-3) var(--s-4);
	border: 1px solid var(--border-strong);
	border-radius: var(--r-lg);
	background-color: var(--surface);

	&__icon {
		flex: none;
		color: var(--err);
	}

	&__text {
		color: var(--text-1);
		font-size: var(--t-md);
	}
}
</style>
