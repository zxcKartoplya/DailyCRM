<script lang="ts" setup>
type Props = {
	title: string
}

const { title } = defineProps<Props>()

const emit = defineEmits<{
	(e: 'close'): void
}>()
</script>

<template>
	<div class="modal" @click="emit('close')">
		<div class="modal-inner" @click.stop="() => {}">
			<div v-if="title" class="modal-head">
				<div class="modal-title">{{ title }}</div>
				<IconClose class="modal-close" size="24" @click="emit('close')" />
			</div>
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.modal {
	position: absolute;
	overflow: hidden;
	top: 0;
	left: 0;
	z-index: 10;
	width: 100%;
	height: 100%;
	background-color: rgba(15, 23, 42, 0.25);
	@include flex(row, center, center);

	&-close {
		cursor: pointer;
	}

	&-head {
		@include flex(row, space-between, center);
	}

	&-title {
		@include h3;
	}

	&-inner {
		background-color: $bg-white;
		border-radius: 12px;
		padding: rem(20);
	}
}
</style>
