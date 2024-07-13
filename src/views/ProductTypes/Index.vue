<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api";
import Pagination from "../../components/Pagination.vue";
import { deleteConfirm, successAlert } from '../../composables/useAlert'

const productTypes = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(10)

const name = ref("" || new URL(document.location).searchParams.get("name"));
const orderBy = ref("desc" || new URL(document.location).searchParams.get("orderBy"));
const sortBy = ref("" || new URL(document.location).searchParams.get("orderBy"));

const fetchDataProductTypes = async () => {
	await api
		.get(`/api/product-types?page=${currentPage.value}`, {
			params: {
				name: name.value,
				orderBy: orderBy.value,
				sortBy: sortBy.value,
			},
		})
		.then((response) => {
			productTypes.value = response.data.data;
			totalPages.value = response.data.totalPages;
		});
};

onMounted(() => {
	fetchDataProductTypes();
});

const deleteProductType = async (id) => {
	try {
		deleteConfirm().then((result) => {
			if (result.isConfirmed) {
				const deleteData = api.delete(`/api/product-types/${id}`).then(() => {
					fetchDataProductTypes();
				});

				if (deleteData) {
					successAlert('Product type', 'deleted')
				}
			}
		});
	} catch (error) {
		console.log(error)
	}
};

const handleFilter = async () => {
	currentPage.value = 1;
	await fetchDataProductTypes();
};

const resetFilter = async () => {
	name.value = "";
	sortBy.value = "";
	orderBy.value = "desc";

	currentPage.value = 1;
	await fetchDataProductTypes();
};

watch(currentPage, fetchDataProductTypes);

const onPageChanged = async (pageNumber) => {
	currentPage.value = pageNumber;
};

const rowNumber = (index) => {
	return (currentPage.value - 1) * itemsPerPage.value + index + 1;
}
</script>

<template>
	<div class="container mt-5 mb-5">
		<div class="row">
			<div class="col-md-12">
				<router-link :to="{ name: 'productTypes.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">Add
					New Product Type</router-link>
				<div class="card border-0 rounded shadow mb-2">
					<div class="card-body">
						<label class="form-label fw-bold">Filter</label>
						<div class="mt-2">
							<label class="form-label fw-bold">Search by product type name</label>
							<input type="text" class="form-control" placeholder="Input product type name..." v-model="name"
								@input="handleFilter()" />
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Sort product type by</label>
							<select class="form-select" v-model="sortBy" @change="handleFilter()">
								<option value="">Sort product type by:</option>
								<option value="name">Name</option>
								<option value="createdAt">Created date</option>
							</select>
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Order by</label>
							<select class="form-select" v-model="orderBy" @change="handleFilter()">
								<option value="">Order product type by:</option>
								<option value="desc">Descending (Z-A)</option>
								<option value="asc">Ascending (A-Z)</option>
							</select>
						</div>
						<div class="mt-2">
							<button class="btn btn-sm btn-danger rounded shadow border-0" @click="resetFilter()">
								Reset Filter
							</button>
						</div>
					</div>
				</div>
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<table class="table table-bordered">
							<thead class="bg-dark text-white">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Name</th>
									<th scope="col" style="width: 15%">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="productTypes.length == 0">
									<td colspan="6" class="text-center">
										<div class="alert alert-danger mb-0">Data not available!</div>
									</td>
								</tr>
								<tr v-else v-for="(productType, index) in productTypes" :key="index">
									<td>{{ rowNumber(index) }}</td>
									<td>{{ productType.name }}</td>
									<td class="text-center">
										<router-link :to="{ name: 'productTypes.edit', params: { id: productType.id } }"
											class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">Edit</router-link>
										<button @click.prevent="deleteProductType(productType.id)"
											class="btn btn-sm btn-danger rounded-sm shadow border-0">
											Delete
										</button>
									</td>
								</tr>
							</tbody>
						</table>
						<pagination :page="currentPage" :total-pages="totalPages" @page-changed="onPageChanged" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
