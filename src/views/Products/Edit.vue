<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api";
import { successAlert } from '../../composables/useAlert'

const router = useRouter();
const route = useRoute();

const product = reactive({
	productName: "",
	stock: 0,
	price: 0,
	productTypeId: "",
});

const productTypes = ref([]);
const errors = ref([]);

onMounted(async () => {
	await api.get(`/api/products/${route.params.id}`).then((response) => {
		product.productName = response.data.data.productName;
		product.stock = response.data.data.stock;
		product.price = response.data.data.price;
		product.productTypeId = response.data.data.productTypeId;
	});
});

const updateProduct = async () => {
	let productName = product.productName;
	let stock = product.stock;
	let price = product.price;
	let productTypeId = product.productTypeId;

	await api
		.put(`/api/products/${route.params.id}`, { productName, stock, price, productTypeId })
		.then(() => {
			successAlert('Product', 'updated')
			router.push({ path: "/products" });
		})
		.catch((error) => {
			if (error.response.data.errors) {
				errors.value = error.response.data.errors["0"].message;
			} else {
				errors.value = error.response.data.message;
			}
		});
};

const getProductTypes = async () => {
	await api.get("/api/product-types").then((response) => {
		productTypes.value = response.data.data;
	});
};

onMounted(() => {
	getProductTypes();
});
</script>

<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<form @submit.prevent="updateProduct()">
							<div class="mb-3">
								<label class="form-label fw-bold">Product Name<span class="text-danger">*</span></label>
								<input type="text" class="form-control" v-model="product.productName" placeholder="Product name" />
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Stock<span class="text-danger">*</span></label>
								<input type="number" class="form-control" v-model="product.stock" placeholder="Stock" />
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Price<span class="text-danger">*</span></label>
								<input type="number" class="form-control" v-model="product.price" placeholder="Price" />
							</div>
							<div class="mb-3">
								<label class="form-label fw-bold">Product Type<span class="text-danger">*</span></label>
								<select class="form-select" v-model="product.productTypeId">
									<option value="">Select product type:</option>
									<option v-for="productType in productTypes" :key="productType.id" :value="productType.id">
										{{ productType.name }}
									</option>
								</select>
							</div>
							<button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Update</button>&nbsp;
							<button type="button" class="btn btn-md btn-secondary rounded-sm shadow border-0"
								@click="router.push({ path: '/products' })">Cancel</button>
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
