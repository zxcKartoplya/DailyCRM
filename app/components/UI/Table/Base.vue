<script setup>
const props = defineProps({
	headList: {
		type: Array,
		required: true,
	},
	columnTemplates: {
		type: String,
		required: false,
	},
	isEmpty: {
		type: Boolean,
		default: false,
	},
	emptyText: {
		type: String,
		default: 'Пока ничего нет',
	},
	tableName: String,
	sortable: {
		type: Boolean,
		default: false,
	},
	sortKey: {
		type: String,
		default: null,
	},
	sortDirection: {
		type: String,
		default: 'asc',
	},
})

const emit = defineEmits(['sort'])

const columnTemplatesStyle = props.columnTemplates

const scrollContainer = ref(null)
const tableEl = ref(null)
const hasHiddenColumns = ref(false)

const syncOverflow = () => {
	const el = scrollContainer.value
	if (!el) return
	hasHiddenColumns.value =
		el.scrollWidth - el.clientWidth - el.scrollLeft > 1
}

let observer = null

onMounted(() => {
	syncOverflow()
	window.addEventListener('resize', syncOverflow)
	if (typeof ResizeObserver !== 'undefined') {
		observer = new ResizeObserver(syncOverflow)
		if (scrollContainer.value) observer.observe(scrollContainer.value)
		if (tableEl.value) observer.observe(tableEl.value)
	}
})

onUnmounted(() => {
	window.removeEventListener('resize', syncOverflow)
	observer?.disconnect()
})

watch(() => props.headList, syncOverflow, { flush: 'post' })

const handleWheel = event => {
	if (!scrollContainer.value) return

	const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value

	if (scrollWidth <= clientWidth) return

	if (
		(scrollLeft === 0 && event.deltaY < 0) ||
		(scrollLeft === scrollWidth - clientWidth && event.deltaY > 0)
	) {
		return
	}

	event.preventDefault()
	scrollContainer.value.scrollLeft += event.deltaY
}
</script>

<template>
	<div class="table-shell" :class="{ 'table-shell--clipped': hasHiddenColumns }">
		<div
			ref="scrollContainer"
			class="table-wrapper"
			@wheel="handleWheel"
			@scroll="syncOverflow"
		>
			<div ref="tableEl" class="table">
				<div class="table-head">
					<UITableHeadItem
						v-for="element in headList"
						:key="element.title"
						:title="element.title"
						:sort-id="element.sortId"
						:is-sortable="sortable && Boolean(element.sortId)"
						:is-active="sortable && Boolean(element.sortId) && element.sortId === sortKey"
						:direction="sortDirection"
						@sort="emit('sort', $event)"
					/>
				</div>
				<slot />
			</div>
		</div>
		<p v-if="isEmpty" class="table-empty">{{ emptyText }}</p>
	</div>
</template>

<style lang="scss" scoped>
.table-shell {
	position: relative;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;

	&--clipped::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: var(--s-6);
		pointer-events: none;
		background: linear-gradient(to right, transparent, var(--surface) 85%);
	}
}

.table-wrapper {
	width: 100%;
	overflow-x: auto;
}

.table {
	width: 100%;
	min-width: max-content;
}

.table-head {
	display: grid;
	min-width: 100%;
	background-color: var(--surface-nav);
	border-bottom: 1px solid var(--border);
	grid-template-columns: v-bind(columnTemplatesStyle);
}

.table-empty {
	padding: var(--s-7) var(--s-4);
	text-align: center;
	color: var(--text-3);
}
</style>
