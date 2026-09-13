<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		value: string
		placeholder?: string
		ariaLabel?: string
		editLabel?: string
		emptyText?: string
		error?: string
		isSaving?: boolean
		isDisabled?: boolean
		isEditing?: boolean
	}>(),
	{
		placeholder: '',
		ariaLabel: '',
		editLabel: 'Изменить',
		emptyText: '—',
		error: '',
		isSaving: false,
		isDisabled: false,
	},
)

const emit = defineEmits<{
	(e: 'save', value: string): void
	(e: 'cancel'): void
	(e: 'update:isEditing', value: boolean): void
}>()

const localEditing = ref(false)
const draft = ref(props.value)
const pending = ref<string | null>(null)
const inputRef = useTemplateRef<HTMLInputElement>('input')
const editButtonRef = useTemplateRef<HTMLButtonElement>('editButton')

const uid = useId()
const inputId = `ui-inline-edit-${uid}`
const errorId = computed(() => (props.error ? `${inputId}-error` : undefined))

const editing = computed(() => props.isEditing ?? localEditing.value)
const trimmed = computed(() => draft.value.trim())
const canSave = computed(() => trimmed.value.length > 0 && !props.isSaving)
const displayValue = computed(() => props.value.trim() || props.emptyText)
const isEmpty = computed(() => props.value.trim().length === 0)

const setEditing = (next: boolean) => {
	localEditing.value = next
	emit('update:isEditing', next)
}

const startEditing = () => {
	if (props.isDisabled) return

	draft.value = props.value
	pending.value = null
	setEditing(true)

	nextTick(() => {
		inputRef.value?.focus()
		inputRef.value?.select()
	})
}

const closeEditing = () => {
	pending.value = null
	setEditing(false)

	nextTick(() => editButtonRef.value?.focus())
}

const cancel = () => {
	draft.value = props.value
	closeEditing()
	emit('cancel')
}

const save = () => {
	if (!canSave.value) return

	if (trimmed.value === props.value.trim()) {
		closeEditing()
		return
	}

	pending.value = trimmed.value
	emit('save', trimmed.value)
}

watch(
	() => props.value,
	value => {
		if (!editing.value) {
			draft.value = value
			return
		}

		if (pending.value !== null && value.trim() === pending.value) {
			closeEditing()
		}
	},
)

watch(editing, value => {
	if (!value) pending.value = null
})
</script>

<template>
	<div class="ui-inline-edit" :class="{ 'ui-inline-edit--editing': editing }">
		<div v-if="!editing" class="ui-inline-edit__view">
			<span
				class="ui-inline-edit__text"
				:class="{ 'ui-inline-edit__text--empty': isEmpty }"
			>
				{{ displayValue }}
			</span>

			<button
				ref="editButton"
				class="ui-inline-edit__pencil"
				type="button"
				:disabled="isDisabled"
				:aria-label="editLabel"
				@click="startEditing"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16px"
					height="16px"
					viewBox="0 -960 960 960"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
					/>
				</svg>
			</button>
		</div>

		<div v-else class="ui-inline-edit__form">
			<div class="ui-inline-edit__row">
				<div
					class="ui-inline-edit__field"
					:class="{ 'ui-inline-edit__field--error': !!error }"
				>
					<input
						:id="inputId"
						ref="input"
						v-model="draft"
						class="ui-inline-edit__input"
						type="text"
						:placeholder="placeholder"
						:aria-label="ariaLabel || undefined"
						:aria-invalid="!!error"
						:aria-describedby="errorId"
						:readonly="isSaving"
						@keydown.enter.prevent="save"
						@keydown.esc.prevent="cancel"
					/>
				</div>

				<div class="ui-inline-edit__actions">
					<UIButton
						size="sm"
						:is-loading="isSaving"
						:is-disabled="!canSave"
						@click="save"
					>
						Сохранить
					</UIButton>

					<UIButton
						variant="ghost"
						size="sm"
						:is-disabled="isSaving"
						@click="cancel"
					>
						Отмена
					</UIButton>
				</div>
			</div>

			<p v-if="error" :id="errorId" class="ui-inline-edit__error" role="alert">
				{{ error }}
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ui-inline-edit {
	display: flex;
	flex-direction: column;
	min-width: 0;

	&__view {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		min-width: 0;
	}

	&__text {
		min-width: 0;
		overflow: hidden;
		color: var(--text-1);
		font-size: var(--t-md);
		text-overflow: ellipsis;
		white-space: nowrap;

		&--empty {
			color: var(--text-3);
		}
	}

	&__pencil {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: none;
		border-radius: var(--r-sm);
		background: transparent;
		color: var(--text-3);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) var(--ease),
			color var(--dur-fast) var(--ease);

		&:hover:not(:disabled) {
			background-color: var(--surface-hover);
			color: var(--text-1);
		}

		&:focus-visible {
			@include focus-ring;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		min-width: 0;
	}

	&__row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2);
	}

	&__field {
		display: flex;
		align-items: center;
		flex: 1 1 12rem;
		min-width: 0;
		height: var(--control-h-sm);
		padding: 0 var(--s-2);
		border: 1px solid var(--border-strong);
		border-radius: var(--r-md);
		background-color: var(--surface);
		transition:
			border-color var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);

		&:focus-within {
			border-color: var(--accent);
			box-shadow: 0 0 0 3px var(--accent-weak);
		}

		&--error {
			border-color: var(--err);

			&:focus-within {
				box-shadow: 0 0 0 3px var(--err-weak);
			}
		}
	}

	&__input {
		width: 100%;
		min-width: 0;
		border: none;
		background: transparent;
		color: var(--text-1);
		font-family: inherit;
		font-size: var(--t-md);
		outline: none;

		&::placeholder {
			color: var(--text-3);
		}

		&:read-only {
			color: var(--text-2);
		}
	}

	&__actions {
		display: inline-flex;
		align-items: center;
		gap: var(--s-1);
		flex: none;
	}

	&__error {
		margin: 0;
		color: var(--err);
		font-size: var(--t-xs);
	}
}
</style>
