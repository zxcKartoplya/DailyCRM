<script lang="ts" setup>
type Props = {
	title: string
}

const { title } = defineProps<Props>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
	<div class="modal" @click="emit('close')">
		<div
			class="modal__inner"
			role="dialog"
			aria-modal="true"
			@click.stop="() => {}"
		>
			<div v-if="title" class="modal__head">
				<h2 class="modal__title">{{ title }}</h2>
				<button
					class="modal__close"
					type="button"
					aria-label="Закрыть"
					@click="emit('close')"
				>
					<IconClose size="18" />
				</button>
			</div>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.modal {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	inset: 0;
	z-index: 1000;
	padding: var(--s-5);
	background-color: rgba(6, 10, 16, 0.45);

	&__inner {
		width: 100%;
		max-width: 34rem;
		max-height: calc(100vh - var(--s-8));
		overflow-y: auto;
		padding: var(--s-5);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background-color: var(--surface);
	}

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
	}

	&__title {
		@include h3;
	}

	&__close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--control-h-sm);
		height: var(--control-h-sm);
		border: none;
		border-radius: var(--r-sm);
		background: transparent;
		color: var(--text-3);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) var(--ease),
			color var(--dur-fast) var(--ease);

		&:hover {
			background-color: var(--surface-hover);
			color: var(--text-1);
		}
	}
}
</style>
