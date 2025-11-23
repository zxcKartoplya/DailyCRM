<script lang="ts" setup>
import LoginService from '~/services/login.services'

const loginService = new LoginService()
// loginService.creatAdmin()
loginService.login()
</script>

<template>
	<div class="main-container">
		<h1>Welcome to DailyCRM</h1>
	</div>
</template>

<style lang="scss" scoped>
.main-container {
	width: 100%;
	height: 100vh;
	color: $color-secondary;
	@include flex-center(10px);
}
</style>
