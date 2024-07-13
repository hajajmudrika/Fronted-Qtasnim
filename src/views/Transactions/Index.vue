<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api";
import Pagination from "../../components/Pagination.vue";
import { deleteConfirm, successAlert } from '../../composables/useAlert'
import { formatCurrency, formatDate } from '../../helpers'

const transactions = ref([]);
const products = ref([]);
const productTypes = ref([]);
const mostSoldProducts = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(10)

const buyerName = ref("" || new URL(document.location).searchParams.get("buyerName"));
const sortBy = ref("" || new URL(document.location).searchParams.get("sortBy"));
const orderBy = ref("desc" || new URL(document.location).searchParams.get("orderBy"));
const productId = ref("" || new URL(document.location).searchParams.get("productId"));
const productTypeId = ref("" || new URL(document.location).searchParams.get("productTypeId"));
const productTypeIdForMostSold = ref("" || new URL(document.location).searchParams.get("productTypeIdForMostSold"));
const startDate = ref("" || new URL(document.location).searchParams.get("startDate"));
const endDate = ref("" || new URL(document.location).searchParams.get("endDate"));

const fetchDataTransactions = async () => {
	await api
		.get(`/api/transactions?page=${currentPage.value}`, {
			params: {
				buyerName: buyerName.value,
				sortBy: sortBy.value,
				orderBy: orderBy.value,
				productId: productId.value,
				productTypeId: productTypeId.value,
				startDate: startDate.value ? startDate.value.substring(0, 10) : "",
				endDate: endDate.value ? endDate.value.substring(0, 10) : "",
			},
		})
		.then((response) => {
			transactions.value = response.data.data;
			totalPages.value = response.data.totalPages;
		});
};

const mostSoldProduct = async () => {
	await api
		.get(`/api/transactions/${productTypeIdForMostSold.value}/most-sold-product`)
		.then((response) => {
			mostSoldProducts.value = response.data.data;
		});
}

const getProducts = async () => {
	let currentPage = 1;
	let moreData = true;

	while (moreData) {
		const response = await api.get(`api/products?page=${currentPage}`);
		const { data } = response;

		products.value = products.value.concat(data.data);

		if (!data.hasNextPage) {
			moreData = false;
		} else {
			currentPage++;
		}
	}
}

const getProductTypes = async () => {
	let currentPage = 1;
	let moreData = true;

	while (moreData) {
		const response = await api.get(`api/product-types?page=${currentPage}`);
		const { data } = response;

		productTypes.value = productTypes.value.concat(data.data);

		if (!data.hasNextPage) {
			moreData = false;
		} else {
			currentPage++;
		}
	}
}

onMounted(() => {
	getProductTypes()
	getProducts()
	fetchDataTransactions();
});

const deleteTransaction = async (id) => {
	try {
		deleteConfirm().then((result) => {
			if (result.isConfirmed) {
				const deleteData = api.delete(`/api/transactions/${id}`).then(() => {
					fetchDataTransactions();
				});

				if (deleteData) {
					successAlert('Transaction', 'deleted')
				}
			}
		});
	} catch (error) {
		console.log(error)
	}
};

const handleFilter = async () => {
	currentPage.value = 1;
	await fetchDataTransactions();
};

const resetFilter = async () => {
	buyerName.value = "";
	sortBy.value = "";
	orderBy.value = "desc";
	productId.value = "";
	productTypeId.value = "";
	startDate.value = "";
	endDate.value = "";

	currentPage.value = 1;
	await fetchDataTransactions();
};

watch(currentPage, fetchDataTransactions);

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
				<router-link :to="{ name: 'transactions.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">Add
					New
					Transaction</router-link>
				<div class="card border-0 rounded shadow mb-2">
					<div class="card-body">
						<label class="form-label fw-bold">Filter</label>
						<div class="row">
							<div class="col-6">
								<label class="form-label fw-bold">Search by buyer name</label>
								<input type="text" class="form-control" placeholder="Search product by name" v-model="buyerName"
									@input="handleFilter()" />
							</div>
							<div class="col-6">
								<label class="form-label fw-bold">Sort transaction by</label>
								<select class="form-select" v-model="sortBy" @change="handleFilter()">
									<option value="">Sort transaction by:</option>
									<option value="buyerName">Buyer name</option>
									<option value="productName">Product name</option>
									<option value="amountSold">Amount Sold</option>
									<option value="totalPrice">Total Price</option>
									<option value="transactionDate">Transaction Date</option>
								</select>
							</div>
						</div>
						<div class="row mt-2">
							<div class="col-6">
								<label class="form-label fw-bold">Select by product</label>
								<select class="form-select" v-model="productId" @change="handleFilter()">
									<option value="">Select product:</option>
									<option v-for="product in products" :key="product.id" :value="product.id">
										{{ product.productName }}
									</option>
								</select>
							</div>
							<div class="col-6">
								<label class="form-label fw-bold">Select by product type</label>
								<select class="form-select" v-model="productTypeId" @change="handleFilter()">
									<option value="">Select product type:</option>
									<option v-for="productType in productTypes" :key="productType.id" :value="productType.id">
										{{ productType.name }}
									</option>
								</select>
							</div>
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Filter by transaction date range</label>
							<div class="row">
								<div class="col-6">
									<input type="date" class="form-control" placeholder="Start date" v-model="startDate"
										@input="handleFilter()" />
									<small class="text-muted">*Start date</small>
								</div>
								<div class="col-6">
									<input type="date" class="form-control" placeholder="End date" v-model="endDate"
										@input="handleFilter()" />
									<small class="text-muted">*End date</small>
								</div>
							</div>
						</div>
						<div class="mt-2">
							<label class="form-label fw-bold">Order by</label>
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
				<div class="card border-0 rounded shadow mb-2">
					<div class="card-body">
						<label class="form-label fw-bold">Show the most product sold by product type</label>
						<div class="mt-2">
							<div class="col-12">
								<label class="form-label fw-bold">Select product type</label>
								<select class="form-select" v-model="productTypeIdForMostSold" @change="mostSoldProduct()">
									<option value="">Select product type:</option>
									<option v-for="productType in productTypes" :key="productType.id" :value="productType.id">
										{{ productType.name }}
									</option>
								</select>
							</div>
						</div>
						<div class="mt-2">
							<ul>
								<li v-for="item in mostSoldProducts" :key="item.id">
									{{ item.product.productName }} - {{ item.amountSold }} pcs
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<table class="table table-bordered">
							<thead class="bg-dark text-white">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Buyer Name</th>
									<th scope="col">Product Name</th>
									<th scope="col">Product Type</th>
									<th scope="col">Amount Sold</th>
									<th scope="col">Total Price</th>
									<th scope="col">Transaction Date</th>
									<th scope="col" style="width: 15%">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="transactions.length == 0">
									<td colspan="8" class="text-center">
										<div class="alert alert-danger mb-0">Data not available!</div>
									</td>
								</tr>
								<tr v-else v-for="(transaction, index) in transactions" :key="index">
									<td>{{ rowNumber(index) }} </td>
									<td>{{ transaction.buyerName }} </td>
									<td>{{ transaction.product.productName }} </td>
									<td>{{ transaction.product.productType.name }} </td>
									<td>{{ transaction.amountSold }} </td>
									<td>{{ formatCurrency(transaction.totalPrice) }} </td>
									<td>{{ formatDate(transaction.transactionDate) }} </td>
									<td class="text-center">
										<router-link :to="{ name: 'transactions.edit', params: { id: transaction.id } }"
											class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">Edit</router-link>
										<button @click.prevent="deleteTransaction(transaction.id)"
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
