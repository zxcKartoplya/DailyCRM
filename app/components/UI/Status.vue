<script lang="ts" setup>
import { Statuses } from '~/types/users'

const { status } = defineProps<{ status: Statuses | string }>()

const labels: Record<string, string> = {
	[Statuses.ACTIVE]: 'Активен',
	[Statuses.INACTIVE]: 'Неактивен',
	[Statuses.INVITED]: 'Приглашён',
}

const label = computed(() => labels[status] ?? status)
</script>

<template>
	<span class="status" :class="`status--${status}`">
		<span class="status__dot" aria-hidden="true" />
		{{ label }}
	</span>
</template>

<style lang="scss" scoped>
.status {
	display: inline-flex;
	align-items: center;
	gap: var(--s-2);
	color: var(--text-2);
	font-size: var(--t-sm);
	white-space: nowrap;

	&__dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: currentColor;
	}

	&--active {
		color: var(--ok);
	}

	&--invited {
		color: var(--warn);
	}

	&--inactive {
		color: var(--text-3);
	}
}
</style>
