<script setup lang="ts">
import { getCurrentInstance } from 'vue'

type Props = {
	placeholder?: string
	label?: string
	error?: string
	rows?: number
}

const { label, placeholder, error, rows = 5 } = defineProps<Props>()

const model = defineModel<string>()

const uid = getCurrentInstance()?.uid ?? 0
const fieldId = `ui-textarea-${uid}`
</script>

<template>
	<div class="ui-textarea" :class="{ 'ui-textarea--error': !!error }">
		<label v-if="label" class="ui-textarea__label" :for="fieldId">
			{{ label }}
		</label>
		<textarea
			:id="fieldId"
			v-model="model"
			name="description"
			class="ui-textarea__field"
			:rows="rows"
			:placeholder="placeholder"
			:aria-invalid="!!error"
		/>
		<p v-if="error" class="ui-textarea__message">{{ error }}</p>
	</div>
</template>

<style lang="scss" scoped>
.ui-textarea {
	display: flex;
	flex-direction: column;
	width: 100%;

	&__label {
		padding-bottom: var(--s-2);
		font-size: var(--t-sm);
		font-weight: 500;
		color: var(--text-2);
	}

	&__field {
		width: 100%;
		padding: var(--s-3);
		border: 1px solid var(--border-strong);
		border-radius: var(--r-md);
		background-color: var(--surface);
		font-size: var(--t-md);
		line-height: var(--lh-base);
		color: var(--text-1);
		resize: vertical;
		outline: none;
		transition:
			border-color var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);

		&::placeholder {
			color: var(--text-3);
		}

		&:hover {
			border-color: var(--text-3);
		}

		&:focus {
			border-color: var(--accent);
			box-shadow: 0 0 0 3px var(--accent-weak);
		}
	}

	&__message {
		padding-top: var(--s-2);
		font-size: var(--t-xs);
		color: var(--err);
	}

	&--error &__field {
		border-color: var(--err);

		&:focus {
			box-shadow: 0 0 0 3px var(--err-weak);
		}
	}
}
</style>
