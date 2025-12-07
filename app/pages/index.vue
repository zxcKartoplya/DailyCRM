<script lang="ts" setup>
import adminService from '~/services/admin.servies'

await adminService.fetchAdmins()
// await adminService.addAdmin()
</script>

<template>
	<div class="main-container">
		<h1>Welcome to DailyCRM</h1>
	</div>
</template>

<style lang="scss" scoped>
.main-container {
	width: 100%;
	height: 100%;
	color: $color-secondary;
	@include flex-center(10px);
}
</style>
