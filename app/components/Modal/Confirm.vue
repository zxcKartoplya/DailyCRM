<script lang="ts" setup>
type Props = {
	title: string
	text: string
	confirmLabel?: string
	cancelLabel?: string
}

const {
	title,
	text,
	confirmLabel = 'Удалить',
	cancelLabel = 'Отмена',
} = defineProps<Props>()

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'close'): void
}>()
</script>

<template>
	<Modal :title="title" @close="emit('close')">
		<p class="confirm__text">{{ text }}</p>
		<div class="confirm__buttons">
			<UIButton is-block color="red" @click="emit('confirm')">
				{{ confirmLabel }}
			</UIButton>
			<UIButton is-block variant="secondary" @click="emit('close')">
				{{ cancelLabel }}
			</UIButton>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.confirm {
	&__text {
		color: var(--text-2);
		font-size: var(--t-md);
	}

	&__buttons {
		display: flex;
		gap: var(--s-3);
		margin-top: var(--s-5);
	}
}
</style>
