<script lang="ts" setup>
import type { DayState } from '~/types/dailies'

const {
	state = null,
	loading = false,
	error = false,
	emptyText = 'нет данных',
	errorText = 'не загрузилось',
	emptyHint = '',
} = defineProps<{
	state?: DayState | null
	loading?: boolean
	error?: boolean
	emptyText?: string
	errorText?: string
	emptyHint?: string
}>()
</script>

<template>
	<Skeleton
		v-if="loading"
		class="ui-day-state-cell__bone"
		preserveAspectRatio="none"
	>
		<rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" />
	</Skeleton>

	<span v-else-if="error" class="ui-day-state-cell__note">{{ errorText }}</span>

	<UIDayState v-else-if="state" :state="state" />

	<span v-else class="ui-day-state-cell__note" :title="emptyHint || undefined">
		{{ emptyText }}
	</span>
</template>

<style lang="scss" scoped>
.ui-day-state-cell {
	&__bone {
		width: 5.5rem;
		height: 1.375rem;
	}

	&__note {
		color: var(--text-3);
		font-size: var(--t-xs);
	}
}
</style>
