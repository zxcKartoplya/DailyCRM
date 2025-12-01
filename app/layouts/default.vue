<script lang="ts" setup>
const route = useRoute()

const isNotLayout = computed(() => {
	if (route.path === '/login') {
		return true
	}
	return false
})
</script>

<template>
	<SideBar v-if="!isNotLayout" />
</template>

<style lang="scss" scoped></style>
