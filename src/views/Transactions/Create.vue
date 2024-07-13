<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api";
import { successAlert } from '../../composables/useAlert'

const router = useRouter();

const transaction = reactive({
	buyerName: "",
	productId: "",
	amountSold: 0,
	transactionDate: "",
});

const products = ref([]);
const errors = ref([]);

const storeTransaction = async () => {
	let buyerName = transaction.buyerName;
	let productId = transaction.productId;
	let amountSold = transaction.amountSold;
	let totalPrice = transaction.totalPrice;
	let transactionDate = transaction.transactionDate;

	await api
		.post("/api/transactions", { buyerName, productId, amountSold, totalPrice, transactionDate })
		.then(() => {
			successAlert('Transaction', 'added')
			router.push({ path: "/transactions" });
		})
		.catch((error) => {
			if (error.response.data.errors) {
				errors.value = error.response.data.errors["0"].message;
			} else {
				errors.value = error.response.data.message;
			}
		});
};

const getProducts = async () => {
	await api.get("/api/products").then((response) => {
		products.value = response.data.data;
	});
};

onMounted(() => {
	getProducts();
});
</script>

<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<form @submit.prevent="storeTransaction()">
							<div class="mb-3">
								<label class="form-label fw-bold">Buyer Name<span class="text-danger">*</span></label>
								<input type="text" class="form-control" v-model="transaction.buyerName" placeholder="Buyer name" />
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Product<span class="text-danger">*</span></label>
								<select class="form-select" v-model="transaction.productId">
									<option value="">Select product:</option>
									<option v-for="product in products" :key="product.id" :value="product.id"
										:disabled="product.stock === 0">
										{{ product.productName }} (Stock: {{ product.stock }})
									</option>
								</select>
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Amount Sold<span class="text-danger">*</span></label>
								<input type="number" class="form-control" v-model="transaction.amountSold" placeholder="Stock" />
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Transaction Date<span class="text-danger">*</span></label>
								<input type="date" class="form-control" v-model="transaction.transactionDate" placeholder="Stock" />
							</div>
							<button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Save</button>&nbsp;
							<button type="button" class="btn btn-md btn-secondary rounded-sm shadow border-0"
								@click="router.push({ path: '/transactions' })">Cancel</button>
						</form>
						<div class="mt-3">
							<ul v-if="errors.length" class="list-group">
								<li class="list-group-item list-group-item-danger">
									{{ errors }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
