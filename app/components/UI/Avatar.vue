<script lang="ts" setup>
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
	defineProps<{
		name?: string
		id?: string | number | null
		size?: Size
		isDecorative?: boolean
	}>(),
	{
		name: '',
		id: null,
		size: 'md',
		isDecorative: true,
	},
)

const PALETTE_SIZE = 8
const FALLBACK_INITIALS = '?'

const words = computed(() =>
	props.name.trim().split(/\s+/).filter(Boolean),
)

const initials = computed(() => {
	const [first, second] = words.value

	if (!first) return FALLBACK_INITIALS
	if (second) return `${first[0]}${second[0]}`.toUpperCase()

	return first.slice(0, 2).toUpperCase()
})

const seed = computed(() => {
	if (props.id !== null && props.id !== undefined && props.id !== '') {
		return String(props.id)
	}

	return props.name.trim()
})

const paletteIndex = computed(() => {
	const value = seed.value

	if (!value) return 1

	let hash = 0

	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) | 0
	}

	return (Math.abs(hash) % PALETTE_SIZE) + 1
})

const classes = computed(() => [
	'ui-avatar',
	`ui-avatar--${props.size}`,
	`ui-avatar--palette-${paletteIndex.value}`,
])

const label = computed(() => props.name.trim() || 'Без имени')
</script>

<template>
	<span
		:class="classes"
		:aria-hidden="isDecorative ? 'true' : undefined"
		:role="isDecorative ? undefined : 'img'"
		:aria-label="isDecorative ? undefined : label"
	>
		{{ initials }}
	</span>
</template>

<style lang="scss" scoped>
.ui-avatar {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: none;
	width: var(--avatar-size);
	height: var(--avatar-size);
	border-radius: var(--r-full);
	background-color: var(--avatar-bg);
	color: var(--avatar-fg);
	font-size: var(--avatar-font);
	font-weight: 600;
	line-height: 1;
	letter-spacing: var(--tracking-wide);
	text-transform: uppercase;
	user-select: none;

	&--sm {
		--avatar-size: 1.5rem;
		--avatar-font: var(--t-xs);
	}

	&--md {
		--avatar-size: 2rem;
		--avatar-font: var(--t-sm);
	}

	&--lg {
		--avatar-size: 2.75rem;
		--avatar-font: var(--t-lg);
	}

	&--palette-1 {
		--avatar-bg: var(--avatar-1-bg);
		--avatar-fg: var(--avatar-1-fg);
	}

	&--palette-2 {
		--avatar-bg: var(--avatar-2-bg);
		--avatar-fg: var(--avatar-2-fg);
	}

	&--palette-3 {
		--avatar-bg: var(--avatar-3-bg);
		--avatar-fg: var(--avatar-3-fg);
	}

	&--palette-4 {
		--avatar-bg: var(--avatar-4-bg);
		--avatar-fg: var(--avatar-4-fg);
	}

	&--palette-5 {
		--avatar-bg: var(--avatar-5-bg);
		--avatar-fg: var(--avatar-5-fg);
	}

	&--palette-6 {
		--avatar-bg: var(--avatar-6-bg);
		--avatar-fg: var(--avatar-6-fg);
	}

	&--palette-7 {
		--avatar-bg: var(--avatar-7-bg);
		--avatar-fg: var(--avatar-7-fg);
	}

	&--palette-8 {
		--avatar-bg: var(--avatar-8-bg);
		--avatar-fg: var(--avatar-8-fg);
	}
}
</style>
