<script setup>
import { Icon } from '@iconify/vue'
import { vOnClickOutside } from '@vueuse/components'
import { ref } from 'vue'

defineProps({
	items: Array,
})

const dropdownIsActive = ref(false)
const dropdownPosition = ref({ top: '0px', left: '0px' })

const toggleDropdown = async event => {
	dropdownIsActive.value = !dropdownIsActive.value

	if (dropdownIsActive.value) {
		const { clientX, clientY } = event
		dropdownPosition.value = {
			top: `${clientY + window.scrollY}px`,
			left: `${clientX + window.scrollX}px`,
		}
	}
}
</script>

<template>
	<div class="table-popover">
		<div class="table-popover__button" @click="toggleDropdown">
			<Icon
				icon="material-symbols:settings-ethernet"
				width="16"
				height="16"
				
			/>
		</div>
		<Teleport to="body">
			<Transition name="fade">
				<UIDropdown
					ref="dropdownRef"
					class="dropdown"
					v-show="dropdownIsActive"
					v-on-click-outside="() => (dropdownIsActive = false)"
					@click="dropdownIsActive = false"
					:items="items"
				/>
			</Transition>
		</Teleport>
	</div>
</template>

<style lang="scss" scoped>
.table-popover {
	position: relative;
	display: inline-flex;
}

.table-popover__button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--control-h-sm);
	height: var(--control-h-sm);
	border-radius: var(--r-sm);
	background: transparent;
	color: var(--text-3);
	cursor: pointer;
	transition:
		background-color var(--dur-fast) var(--ease),
		color var(--dur-fast) var(--ease);

	&:hover {
		background-color: var(--surface-active);
		color: var(--text-1);
	}
}

.dropdown {
	position: absolute;
	left: v-bind('dropdownPosition.left');
	top: v-bind('dropdownPosition.top');
	transform: translate(calc(-100% - 5px), 10px);
	z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
	transition:
		opacity var(--dur-fast) var(--ease),
		transform var(--dur-fast) var(--ease);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translate(calc(-100% - 5px), 4px);
}
</style>
