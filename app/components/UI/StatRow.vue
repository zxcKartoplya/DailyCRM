<script lang="ts">
export type UIStatItem = {
	label: string
	value?: string | number | null
	key?: string
	tone?: 'default' | 'ok' | 'warn' | 'err'
}
</script>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		items: UIStatItem[]
		size?: 'sm' | 'md'
	}>(),
	{
		size: 'md',
	},
)

const EMPTY_VALUE = '—'
const EMPTY_TITLE = 'Нет данных'

const stats = computed(() =>
	props.items.map(item => {
		const isEmpty =
			item.value === null || item.value === undefined || item.value === ''

		return {
			key: item.key ?? item.label,
			label: item.label,
			value: isEmpty ? EMPTY_VALUE : String(item.value),
			title: isEmpty ? EMPTY_TITLE : undefined,
			isEmpty,
			tone: item.tone ?? 'default',
		}
	}),
)
</script>

<template>
	<dl class="ui-stat-row" :class="`ui-stat-row--${size}`">
		<div v-for="stat in stats" :key="stat.key" class="ui-stat-row__item">
			<dt class="ui-stat-row__label">{{ stat.label }}</dt>
			<dd
				class="ui-stat-row__value"
				:class="[
					`ui-stat-row__value--${stat.tone}`,
					{ 'ui-stat-row__value--empty': stat.isEmpty },
				]"
				:title="stat.title"
			>
				{{ stat.value }}
			</dd>
		</div>
	</dl>
</template>

<style lang="scss" scoped>
.ui-stat-row {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: var(--s-3) var(--s-5);
	margin: 0;

	&__item {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: var(--s-1);
		min-width: 0;
	}

	&__value {
		@include numeric;
		margin: 0;
		color: var(--text-1);
		font-size: var(--t-xl);
		font-weight: 600;
		line-height: var(--lh-tight);
		white-space: nowrap;

		&--ok {
			color: var(--ok);
		}

		&--warn {
			color: var(--warn);
		}

		&--err {
			color: var(--err);
		}

		&--empty {
			color: var(--text-3);
		}
	}

	&__label {
		color: var(--text-2);
		font-size: var(--t-xs);
		line-height: var(--lh-base);
	}

	&--sm {
		gap: var(--s-2) var(--s-4);

		.ui-stat-row__value {
			font-size: var(--t-md);
		}
	}
}
</style>
