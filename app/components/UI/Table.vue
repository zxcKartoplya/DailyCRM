<script lang="ts" setup>
import { computed } from 'vue'

type Column = {
	key: string
	label: string
	width?: string
	align?: 'left' | 'center' | 'right'
}

const props = withDefaults(
	defineProps<{
		columns: Column[]
		rows?: Record<string, any>[]
		rowKey?: string
		loading?: boolean
		emptyText?: string
	}>(),
	{
		rows: () => [],
		rowKey: 'id',
		loading: false,
		emptyText: 'No data yet',
	}
)

const columns = computed(() => props.columns)
const rows = computed(() => props.rows)
const isLoading = computed(() => props.loading)
const emptyText = computed(() => props.emptyText)

const gridTemplate = computed(() =>
	columns.value.map(column => column.width || '1fr').join(' ')
)

const getRowKey = (row: Record<string, any>, index: number) => {
	const candidate = row?.[props.rowKey as string]
	if (candidate === undefined || candidate === null || candidate === '') {
		return `row-${index}`
	}
	return candidate
}
</script>

<template>
	<div class="ui-table" role="table">
		<div
			class="ui-table__header"
			role="row"
			:style="{ gridTemplateColumns: gridTemplate }"
		>
			<div
				v-for="column in columns"
				:key="column.key"
				class="ui-table__cell ui-table__cell--head"
				:class="`ui-table__cell--${column.align || 'left'}`"
			>
				{{ column.label }}
			</div>
		</div>

		<div class="ui-table__body" role="rowgroup">
			<div v-if="isLoading" class="ui-table__state">Loading...</div>
			<div v-else-if="!rows.length" class="ui-table__state">
				{{ emptyText }}
			</div>
			<div v-else>
				<div
					v-for="(row, rowIndex) in rows"
					:key="getRowKey(row, rowIndex)"
					class="ui-table__row"
					role="row"
					:style="{ gridTemplateColumns: gridTemplate }"
				>
					<div
						v-for="column in columns"
						:key="column.key"
						class="ui-table__cell"
						:class="`ui-table__cell--${column.align || 'left'}`"
					>
						<slot
							:name="`cell-${column.key}`"
							:row="row"
							:value="row[column.key]"
						>
							{{ row[column.key] ?? '-' }}
						</slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ui-table {
	border: 1px solid $gray-light;
	border-radius: $radius-md;
	background: $white;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba($shadow-color, 0.12);

	&__header,
	&__row {
		display: grid;
		align-items: center;
		min-height: rem(48);
	}

	&__header {
		background: $cool-gray-light;
		border-bottom: 1px solid $gray-light;
		font-weight: 700;
		color: $color-surface;
	}

	&__row {
		border-bottom: 1px solid $gray-light;
		transition: background-color 0.15s ease;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: rgba($blue, 0.04);
		}
	}

	&__cell {
		padding: rem(12) rem(14);
		color: $color-surface;
		font-size: 0.95rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		&--head {
			font-size: 0.98rem;
			text-transform: uppercase;
			letter-spacing: 0.02em;
		}
		&--left {
			text-align: left;
		}
		&--center {
			text-align: center;
		}
		&--right {
			text-align: right;
		}
	}

	&__state {
		padding: rem(20);
		text-align: center;
		color: $gray-medium;
	}
}
</style>
