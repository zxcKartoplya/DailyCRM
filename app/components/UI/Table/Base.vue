<script setup>
// import { useSortStore } from '@/stores/sort'

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
	tableName: String,
})

const columnTemplatesStyle = props.columnTemplates
// const sortStore = useSortStore()

// const clickOnHead = id => {
// 	id ? sortStore.setSort(props.tableName, id) : null
// }

const scrollContainer = ref(null)

const handleWheel = event => {
	if (scrollContainer.value) {
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value

		if (
			(scrollLeft === 0 && event.deltaY < 0) ||
			(scrollLeft === scrollWidth - clientWidth && event.deltaY > 0)
		) {
			return
		}

		event.preventDefault()
		scrollContainer.value.scrollLeft += event.deltaY
	}
}
</script>

<template>
	<div ref="scrollContainer" class="table-wrapper" @wheel="handleWheel">
		<div class="table">
			<div class="table-head">
				<UITableHeadItem
					v-for="element in headList"
					:key="element"
					:title="element.title"
					:sort-id="element.sortId"
					@click="clickOnHead(element.sortId)"
				/>
			</div>
			<slot></slot>
			<p v-if="isEmpty" class="table-empty">Нет данных</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.table-wrapper {
	width: 100%;
	overflow-x: auto;
	scrollbar-color: #adadad #f6f6f6;
	scrollbar-width: thin;
	min-height: max-content;
}

.table {
	width: 100%;
}

.table-head {
	display: grid;
	min-width: 100%;
	width: fit-content;
	background-color: $cool-gray-light;
	color: $color-surface;
	@include body-usual-medium;
	grid-template-columns: v-bind(columnTemplatesStyle);
}

.table-empty {
	margin: rem(20) 0;
	font-size: rem(24);
	line-height: 1.2;
	text-align: center;
	color: $gray-medium;
}
</style>
