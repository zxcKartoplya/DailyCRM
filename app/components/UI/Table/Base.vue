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
})

const columnTemplatesStyle = props.columnTemplates

const scrollContainer = ref(null)

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
	<div class="table-shell">
		<div class="table-wrapper" ref="scrollContainer" @wheel="handleWheel">
			<div class="table">
				<div class="table-head">
					<UITableHeadItem
						v-for="element in headList"
						:key="element.title"
						:title="element.title"
						:sort-id="element.sortId"
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
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--surface);
	overflow: hidden;
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
