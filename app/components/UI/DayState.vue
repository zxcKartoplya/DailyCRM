<script lang="ts">
import { DayState } from '~/types/dailies'

export const UI_DAY_STATE_LABEL: Record<DayState, string> = {
	[DayState.Submitted]: 'Работает',
	[DayState.Draft]: 'Заполняет',
	[DayState.Missing]: 'Пропускает',
	[DayState.Off]: 'Отгул',
	[DayState.Rest]: 'Выходной',
}
</script>

<script lang="ts" setup>
const { state } = defineProps<{ state: DayState }>()

const label = computed(() => UI_DAY_STATE_LABEL[state])
</script>

<template>
	<span class="ui-day-state" :class="`ui-day-state--${state}`">
		<span class="ui-day-state__dot" aria-hidden="true" />
		{{ label }}
	</span>
</template>

<style lang="scss" scoped>
.ui-day-state {
	--day-state-tone: var(--text-3);
	--day-state-bg: var(--surface-sunken);
	--day-state-dot: var(--border-strong);
	--day-state-dot-fill: var(--day-state-dot);
	--day-state-dot-style: solid;

	display: inline-flex;
	align-items: center;
	gap: var(--s-2);
	padding: var(--s-1) var(--s-2);
	border-radius: var(--r-full);
	background-color: var(--day-state-bg);
	color: var(--day-state-tone);
	font-size: var(--t-xs);
	font-weight: 500;
	line-height: var(--lh-base);
	white-space: nowrap;

	&__dot {
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		border: 1px solid var(--day-state-dot);
		border-style: var(--day-state-dot-style);
		border-radius: var(--r-full);
		background-color: var(--day-state-dot-fill);
	}

	&--submitted {
		--day-state-tone: var(--ok);
		--day-state-bg: var(--ok-weak);
		--day-state-dot: var(--ok);
	}

	&--draft {
		--day-state-tone: var(--warn);
		--day-state-bg: var(--warn-weak);
		--day-state-dot: var(--warn);
	}

	&--missing {
		--day-state-tone: var(--err);
		--day-state-bg: var(--err-weak);
		--day-state-dot: var(--err);
	}

	&--off {
		--day-state-tone: var(--text-2);
		--day-state-bg: var(--surface-sunken);
		--day-state-dot: var(--text-3);
	}

	&--rest {
		--day-state-tone: var(--text-3);
		--day-state-bg: transparent;
		--day-state-dot: var(--border-strong);
		--day-state-dot-fill: transparent;
		--day-state-dot-style: dashed;

		box-shadow: inset 0 0 0 1px var(--border);
	}
}
</style>
