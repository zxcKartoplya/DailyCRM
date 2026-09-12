<script lang="ts" setup>
import { Icon } from '@iconify/vue'

type Props = {
	name: string
	path: string
	icon: string
}

const { name, path, icon } = defineProps<Props>()
const route = useRoute()

const isActive = computed(() =>
	path === '/' ? route.path === '/' : route.path.startsWith(path),
)
</script>

<template>
	<NuxtLink class="item" :class="{ 'item--active': isActive }" :to="path">
		<Icon :icon="icon" class="item__icon" width="18" height="18" />
		<span class="item__text">{{ name }}</span>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.item {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	height: var(--control-h);
	padding: 0 var(--s-3);
	border-radius: var(--r-md);
	color: var(--text-2);
	transition:
		background-color var(--dur-fast) var(--ease),
		color var(--dur-fast) var(--ease);

	&__icon {
		flex: none;
		color: var(--text-3);
		transition: color var(--dur-fast) var(--ease);
	}

	&__text {
		font-size: var(--t-md);
		font-weight: 500;
	}

	&:hover {
		background-color: var(--surface-hover);
		color: var(--text-1);

		.item__icon {
			color: var(--text-2);
		}
	}

	&--active,
	&--active:hover {
		background-color: var(--accent-weak);
		color: var(--accent-text);

		.item__icon {
			color: var(--accent-text);
		}
	}
}
</style>
