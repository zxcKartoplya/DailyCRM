<script lang="ts" setup></script>

<template>
	<form class="form">
		<UIInput
			label="Название департамента "
			placeholder="Введите название департамента"
		/>
		<UIButton>Добавить</UIButton>
	</form>
</template>

<style lang="scss" scoped>
.form {
	width: rem(550);
	height: 100%;
	margin-left: rem(20);
	background-color: $white;
	border-radius: $radius-md;
	@include flex(column, center, center);
}
</style>
