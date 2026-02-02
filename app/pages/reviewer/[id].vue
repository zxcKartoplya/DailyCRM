<script lang="ts" setup>
import { useReviewersStore } from '~/stores/reviewers'

const route = useRoute()
const reviewersStore = useReviewersStore()
const { reviewer } = storeToRefs(reviewersStore)
const reviewerId = route.params.id as string

const metrics = [
	'Полнота дейлика',
	'Качество формулировок',
	'Скорость закрытия задач',
	'Стабильность прогресса',
	'Наличие блокеров',
]

const workers = [
	{
		id: 101,
		name: 'Анна Маркова',
		rating: 'A',
		trend: 'up',
		delta: '+4%',
	},
	{
		id: 102,
		name: 'Дмитрий Соловьев',
		rating: 'B+',
		trend: 'down',
		delta: '-2%',
	},
	{
		id: 103,
		name: 'Екатерина Горина',
		rating: 'A-',
		trend: 'up',
		delta: '+1%',
	},
	{
		id: 104,
		name: 'Кирилл Романов',
		rating: 'B',
		trend: 'down',
		delta: '-3%',
	},
	{
		id: 105,
		name: 'Ольга Сафонова',
		rating: 'A-',
		trend: 'up',
		delta: '+2%',
	},
]

onMounted(() => {
	reviewersStore.fetchReviewer(reviewerId)
})
</script>

<template>
	<section class="page">
		<div class="header">
			<div class="header__title">Профиль оценщика</div>
			<div class="header__name">{{ reviewer?.name }}</div>
			<div class="header__meta">
				<span>ID: {{ reviewer?.id }}</span>
				<span>Департамент: {{ reviewer?.department }}</span>
			</div>
		</div>
		<div class="grid">
			<div class="card">
				<div class="card__title">Краткое описание</div>
				<div class="card__text">{{ reviewer?.description }}</div>
			</div>

			<div class="card">
				<div class="card__title">Метрики оценщика</div>
				<div class="metric-list">
					<div
						class="metric"
						v-for="metric in reviewer?.metrics"
						:key="metric.json_name"
					>
						{{ metric.display_name }}
					</div>
				</div>
			</div>

			<!-- TODO доразбираться с логикой привязки оценщика -->
			<!-- <div class="card">
				<div class="card__title">Закрепленный департамент</div>
				<div class="department">{{ reviewer?.department }}</div>
			</div> -->

			<div class="card card--wide">
				<div class="card__title">Сотрудники и динамика рейтинга</div>
				<div class="worker" v-for="worker in workers" :key="worker.id">
					<div class="worker__id">#{{ worker.id }}</div>
					<div class="worker__name">{{ worker.name }}</div>
					<div class="worker__rating">{{ worker.rating }}</div>
					<div class="worker__trend" :class="worker.trend">
						<span>{{ worker.trend === 'up' ? 'Рост' : 'Падение' }}</span>
						<span class="worker__delta">
							{{ worker.trend === 'up' ? '▲' : '▼' }} {{ worker.delta }}
						</span>
					</div>
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
	background: linear-gradient(120deg, #f8fafc 0%, #eef2ff 100%);
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

.metric-list {
	display: grid;
	gap: rem(10);
}

.metric {
	padding: rem(10) rem(12);
	border-radius: rem(10);
	background: #f3f4f6;
	font-size: rem(14);
	color: #111827;
}

.department {
	padding: rem(14);
	border-radius: rem(12);
	background: #eef2ff;
	font-weight: 600;
	color: #111827;
}

.worker {
	display: grid;
	grid-template-columns: 80px 1fr 80px 160px;
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

.worker__trend {
	display: flex;
	flex-direction: column;
	gap: rem(4);
	font-size: rem(12);
	text-transform: uppercase;
	letter-spacing: 0.04em;

	&.up {
		color: #059669;
	}

	&.down {
		color: #dc2626;
	}
}

.worker__delta {
	font-weight: 600;
	letter-spacing: 0;
}

@media (max-width: 900px) {
	.header {
		align-items: flex-start;
	}
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
