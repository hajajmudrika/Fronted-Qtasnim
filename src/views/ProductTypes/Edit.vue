<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api";
import { successAlert } from '../../composables/useAlert'

const router = useRouter();
const route = useRoute();

const productType = reactive({
	name: "",
});

const errors = ref([]);

onMounted(async () => {
	await api.get(`/api/product-types/${route.params.id}`).then((response) => {
		productType.name = response.data.data.name;
	});
});

const updateProductType = async () => {
	let name = productType.name;

	await api
		.put(`/api/product-types/${route.params.id}`, { name })
		.then(() => {
			successAlert('Product type', 'updated')
			router.push({ path: "/product-types" });
		})
		.catch((error) => {
			if (error.response.data.errors) {
				errors.value = error.response.data.errors["0"].message;
			} else {
				errors.value = error.response.data.message;
			}
		});
};
</script>

<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<form @submit.prevent="updateProductType()">
							<div class="mb-3">
								<label class="form-label fw-bold">Product Type Name<span class="text-danger">*</span></label>
								<input type="text" class="form-control" v-model="productType.name" placeholder="Product type name" />
							</div>
							<button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Update</button>&nbsp;
							<button type="button" class="btn btn-md btn-secondary rounded-sm shadow border-0"
								@click="router.push({ path: '/product-types' })">Cancel</button>
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
