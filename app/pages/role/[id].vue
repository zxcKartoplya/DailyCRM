<script lang="ts" setup>
import { useJobStore } from '~/stores/role'

const route = useRoute()
const jobStore = useJobStore()
const { job } = storeToRefs(jobStore)

const roleId = route.params.id as string

const role = {
	id: roleId,
	name: 'Аналитик дейликов',
	reviewer: 'Тимлид',
	department: 'Операционный анализ',
	description:
		'Отвечает за анализ ежедневных отчетов, выявляет риски и формирует рекомендации.',
}

const responsibilities = [
	'Проверка полноты и структуры дейликов',
	'Оценка качества формулировок задач',
	'Согласование приоритетов с оценщиком',
	'Фиксация блокеров и рисков',
	'Подготовка еженедельного отчета',
]

const linkedWorkers = [
	{ id: 101, name: 'Анна Маркова', rating: 'A' },
	{ id: 102, name: 'Дмитрий Соловьев', rating: 'B+' },
	{ id: 103, name: 'Екатерина Горина', rating: 'A-' },
]

onMounted(() => {
	jobStore.fetchJob(roleId)
})
</script>

<template>
	<section v-if="job" class="page">
		<div class="header">
			<div class="header__title">Профиль роли</div>
			<div class="header__name">{{ job.name }}</div>
			<div class="header__meta">
				<span>ID: {{ job.id }}</span>
				<span>Оценщик: {{ job.reviewer_name }}</span>
				<span>Департамент: {{ role.department }}</span>
			</div>
		</div>

		<div class="grid">
			<div class="card">
				<div class="card__title">Описание роли</div>
				<div class="card__text">{{ role.description }}</div>
			</div>

			<div class="card">
				<div class="card__title">Ключевые обязанности</div>
				<div class="list">
					<div class="list__item" v-for="item in responsibilities" :key="item">
						{{ item }}
					</div>
				</div>
			</div>

			<div class="card card--wide">
				<div class="card__title">Сотрудники с этой ролью</div>
				<div class="worker" v-for="worker in linkedWorkers" :key="worker.id">
					<div class="worker__id">#{{ worker.id }}</div>
					<div class="worker__name">{{ worker.name }}</div>
					<div class="worker__rating">{{ worker.rating }}</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.page {
	padding: rem(20);
	@include flex(column, null, null, rem(20));
}

.header {
	padding: rem(20);
	border-radius: rem(16);
	background: linear-gradient(120deg, #f7f8fc 0%, #eef1f8 100%);
	@include flex(column, null, null, rem(8));

	&__title {
		font-size: rem(14);
		color: #6b7280;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	&__name {
		margin-top: rem(6);
		font-size: rem(28);
		font-weight: 700;
	}

	&__meta {
		margin-top: rem(10);
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 1fr));
		gap: rem(8);
		color: #374151;
	}
}

.grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(240px, 1fr));
	gap: rem(20);
}

.card {
	padding: rem(18);
	background: #ffffff;
	border-radius: rem(16);
	box-shadow: 0 rem(10) rem(30) rgba(15, 23, 42, 0.08);

	&__title {
		margin-bottom: rem(16);
		font-size: rem(16);
		font-weight: 600;
	}

	&--wide {
		grid-column: span 2;
	}
}

.card__text {
	color: #374151;
	font-size: rem(14);
	line-height: 1.6;
}

.list {
	display: grid;
	gap: rem(10);

	&__item {
		padding: rem(10) rem(12);
		border-radius: rem(10);
		background: #f3f4f6;
		font-size: rem(14);
		color: #111827;
	}
}

.metric-list {
	display: grid;
	grid-template-columns: repeat(2, minmax(160px, 1fr));
	gap: rem(12);
}

.metric {
	padding: rem(12);
	border-radius: rem(12);
	background: #f9fafb;
	border: rem(1) solid #eef2f7;

	&__title {
		color: #6b7280;
		font-size: rem(13);
	}

	&__value {
		margin-top: rem(6);
		font-size: rem(18);
		font-weight: 700;
	}
}

.worker {
	display: grid;
	grid-template-columns: 80px 1fr 80px;
	gap: rem(12);
	align-items: center;
	padding: rem(12) 0;
	border-bottom: rem(1) solid #eef2f7;

	&:last-child {
		border-bottom: none;
	}
}

.worker__id {
	color: #6b7280;
	font-size: rem(13);
}

.worker__name {
	font-weight: 600;
	color: #111827;
}

.worker__rating {
	font-weight: 700;
	color: #111827;
}

@media (max-width: 900px) {
	.header__meta {
		grid-template-columns: 1fr;
	}
	.grid {
		grid-template-columns: 1fr;
	}
	.card--wide {
		grid-column: span 1;
	}
	.worker {
		grid-template-columns: 1fr;
		align-items: flex-start;
	}
}
</style>
