<script lang="ts" setup>
import { Statuses } from '~/types/users'

const { status, withSubject = true } = defineProps<{
	status: Statuses | string
	withSubject?: boolean
}>()

const labels: Record<string, { subject: string; short: string }> = {
	[Statuses.ACTIVE]: { subject: 'Доступ включён', short: 'Включён' },
	[Statuses.INACTIVE]: { subject: 'Доступ выключен', short: 'Выключен' },
	[Statuses.INVITED]: { subject: 'Не заходил', short: 'Не заходил' },
}

const label = computed(() => {
	const entry = labels[status]
	if (!entry) return status

	return withSubject ? entry.subject : entry.short
})

const title = computed(() =>
	status === Statuses.INVITED
		? 'Доступ включён, сотрудник ещё ни разу не входил в систему'
		: undefined,
)
</script>

<template>
	<span class="status" :class="`status--${status}`" :title="title">
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
		flex: none;
		width: 6px;
		height: 6px;
		border: 1px solid currentColor;
		border-radius: 50%;
		background-color: currentColor;
	}

	&--active {
		color: var(--text-2);

		.status__dot {
			border-color: var(--ok);
			background-color: var(--ok);
		}
	}

	&--invited {
		padding: var(--s-1) var(--s-2);
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		color: var(--text-3);
		font-size: var(--t-xs);

		.status__dot {
			border-color: var(--border-strong);
			background-color: transparent;
		}
	}

	&--inactive {
		color: var(--text-3);

		.status__dot {
			border-color: var(--text-3);
			background-color: var(--text-3);
		}
	}
}
</style>
