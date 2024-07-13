<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api";
import Pagination from "../../components/Pagination.vue";
import { deleteConfirm, successAlert } from '../../composables/useAlert'
import { formatCurrency } from '../../helpers'

const products = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(10)
const productTypes = ref([]);

const productName = ref("" || new URL(document.location).searchParams.get("productName"));
const sortBy = ref("" || new URL(document.location).searchParams.get("sortBy"));
const orderBy = ref("desc" || new URL(document.location).searchParams.get("orderBy"));
const productTypeId = ref("" || new URL(document.location).searchParams.get("productTypeId"));
const price = ref("" || new URL(document.location).searchParams.get("price"));

const fetchDataProducts = async () => {
	await api
		.get(`/api/products?page=${currentPage.value}`, {
			params: {
				productName: productName.value,
				sortBy: sortBy.value,
				orderBy: orderBy.value,
				productTypeId: productTypeId.value,
				price: price.value,
			},
		})
		.then((response) => {
			products.value = response.data.data;
			totalPages.value = response.data.totalPages;
		});
};

const getProductTypes = async () => {
	await api.get("/api/product-types").then((response) => {
		productTypes.value = response.data.data;
	});
};

onMounted(() => {
	getProductTypes()
	fetchDataProducts();
});

const deleteProduct = async (id) => {
	try {
		deleteConfirm().then((result) => {
			if (result.isConfirmed) {
				const deleteData = api.delete(`/api/products/${id}`).then(() => {
					fetchDataProducts();
				});

				if (deleteData) {
					successAlert('Product', 'deleted')
				}
			}
		});
	} catch (error) {
		console.log(error)
	}
};

const handleFilter = async () => {
	currentPage.value = 1;
	await fetchDataProducts();
};

const resetFilter = async () => {
	productName.value = "";
	sortBy.value = "";
	orderBy.value = "desc";
	productTypeId.value = "";

	currentPage.value = 1;
	await fetchDataProducts();
};

watch(currentPage, fetchDataProducts);

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
				<router-link :to="{ name: 'products.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">Add New
					Product</router-link>
				<div class="card border-0 rounded shadow mb-2">
					<div class="card-body">
						<label class="form-label fw-bold">Filter</label>
						<div class="mt-2">
							<label class="form-label fw-bold">Search by product name</label>
							<input type="text" class="form-control" placeholder="Input product name..." v-model="productName"
								@input="handleFilter()" />
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Sort product by</label>
							<select class="form-select" v-model="sortBy" @change="handleFilter()">
								<option value="">Sort product by:</option>
								<option value="productName">Product name</option>
								<option value="stock">Stock</option>
								<option value="price">Price</option>
							</select>
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Select by product type</label>
							<select class="form-select" v-model="productTypeId" @change="handleFilter()">
								<option value="">Select product type:</option>
								<option v-for="productType in productTypes" :key="productType.id" :value="productType.id">
									{{ productType.name }}
								</option>
							</select>
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Order product by</label>
							<select class="form-select" v-model="orderBy" @change="handleFilter()">
								<option value="">Order product by:</option>
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
									<th scope="col">Product Name</th>
									<th scope="col">Stock</th>
									<th scope="col">Price</th>
									<th scope="col">Product Type</th>
									<th scope="col" style="width: 15%">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="products.length == 0">
									<td colspan="6" class="text-center">
										<div class="alert alert-danger mb-0">Data not available!</div>
									</td>
								</tr>
								<tr v-else v-for="(product, index) in products" :key="index">
									<td>{{ rowNumber(index) }}</td>
									<td>{{ product.productName }}</td>
									<td>{{ product.stock }}</td>
									<td>{{ formatCurrency(product.price) }}</td>
									<td>{{ product.productType.name }}</td>
									<td class="text-center">
										<router-link :to="{ name: 'products.edit', params: { id: product.id } }"
											class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">Edit</router-link>
										<button @click.prevent="deleteProduct(product.id)"
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