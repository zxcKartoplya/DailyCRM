<script setup>
import { vOnClickOutside } from '@vueuse/components'
import { ref } from 'vue'
// import IconDots from '../icons/IconDots.vue'

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
		<button class="table-popover__button" @click="toggleDropdown">
			<IconDots />
		</button>
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
	padding: rem(6);
	border: none;
	background: transparent;
	border-radius: rem(8);
	transition: background-color 0.15s ease;
	cursor: pointer;

	&:hover {
		background-color: rgba($gray-medium, 0.18);
	}
}

.dropdown {
	position: absolute;
	left: v-bind('dropdownPosition.left');
	transform: translate(calc(-100% - 5px), 10px);
	top: v-bind('dropdownPosition.top');
	z-index: 100;
}
</style>
