<template>
	<div class="pagination">
		<button :disabled="page === 1" @click="changePage(page - 1)">Previous</button>
		<span v-for="pageNumber in pageNumbers" :key="pageNumber">
			<button :class="{ active: pageNumber === page }" @click="changePage(pageNumber)">
				{{ pageNumber }}
			</button>
		</span>
		<button :disabled="page === totalPages" @click="changePage(page + 1)">Next</button>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	page: {
		type: Number,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
});

const pageNumbers = computed(() => {
	const numbers = [];
	for (let i = 1; i <= props.totalPages; i++) {
		numbers.push(i);
	}
	return numbers;
});

const emit = defineEmits(["page-changed"]);

const changePage = (pageNumber) => {
	if (pageNumber >= 1 && pageNumber <= props.totalPages) {
		emit("page-changed", pageNumber);
	}
};
</script>

<style scoped>
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 1rem;
}

button {
	padding: 0.5rem 1rem;
	margin: 0 0.5rem;
	border: none;
	border-radius: 0.25rem;
	background-color: #eee;
	cursor: pointer;
}

button:hover:not(:disabled) {
	background-color: #ccc;
}

button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

button.active {
	background-color: #007bff;
	color: #fff;
}
</style>
