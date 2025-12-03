<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { IconColors } from '~/types/icon'

type Props = {
	name: string
	path?: string
	icon?: string
	subLink?: Props[]
}

const { subLink } = defineProps<Props>()

const isOpen = ref(false)
const hasSubLinks = computed(() => Array.isArray(subLink) && subLink.length > 0)

const toggle = () => {
	if (!hasSubLinks.value) return
	isOpen.value = !isOpen.value
}
</script>

<template>
	<div class="item" :class="{ 'item--open': isOpen }">
		<NuxtLink v-if="path && !hasSubLinks" class="item__link" :to="path">
			<Icon
				v-if="icon"
				:icon="icon"
				width="24"
				height="24"
				:color="IconColors.GRAY_DEFAULT"
			/>
			<div class="item__text">{{ name }}</div>
		</NuxtLink>

		<button
			v-else
			class="item__link item__link--button"
			type="button"
			@click="toggle"
		>
			<Icon
				v-if="icon"
				:icon="icon"
				width="20"
				height="20"
				:color="IconColors.GRAY_DEFAULT"
			/>
			<div class="item__text">{{ name }}</div>
			<Icon
				icon="mdi:chevron-down"
				class="item__chevron"
				:class="{ 'item__chevron--open': isOpen }"
				:color="IconColors.GRAY_DEFAULT"
				width="20"
				height="20"
			/>
		</button>

		<Transition name="sublink">
			<div class="item__sublink" v-if="hasSubLinks && isOpen">
				<SideBarItem
					v-for="link in subLink"
					:key="link.path || link.name"
					v-bind="link"
					class="item__sublink--item"
				/>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.item {
	margin: rem(6) rem(10);
	border-radius: $radius-md;
	background-color: $white;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	&--open {
		background-color: $bg-blue;
	}
	&__link {
		width: 100%;
		padding: rem(14) rem(16);
		border: none;
		background: transparent;
		cursor: pointer;
		color: inherit;
		text-decoration: none;
		@include flex(row, space-between, center, rem(10));
		&--button {
			text-align: left;
		}
	}
	&__text {
		color: $cool-gray-medium;
		flex: 1;
		text-align: left;
	}
	&__chevron {
		transition: transform 0.2s ease;
		&--open {
			transform: rotate(180deg);
		}
	}
	&__sublink {
		padding: 0 0 rem(10) rem(30);
		@include flex(column, center, flex-start, rem(6));
		&--item {
			width: 90%;
		}
	}
}

.sublink-enter-active,
.sublink-leave-active {
	transition: all 0.15s ease;
}
.sublink-enter-from,
.sublink-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
