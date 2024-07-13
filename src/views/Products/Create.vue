<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api";
import { successAlert } from "../../composables/useAlert";

const router = useRouter();

const product = reactive({
  productName: "",
  stock: 0,
  price: 0,
  productTypeId: "",
});

const productTypes = ref([]);
const errors = ref([]);

const storePost = async () => {
  let productName = product.productName;
  let stock = product.stock;
  let price = product.price;
  let productTypeId = product.productTypeId;

  await api
    .post("/api/products", { productName, stock, price, productTypeId })
    .then(() => {
      successAlert("Product", "added");
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
            <form @submit.prevent="storePost()">
              <div class="mb-3">
                <label class="form-label fw-bold"
                  >Nama Produk<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="product.productName"
                  placeholder="Nama Produk"
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold"
                  >Stok<span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="product.stock"
                  placeholder="Stok"
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold"
                  >Harga<span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="product.price"
                  placeholder="Harga"
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold"
                  >Tipe Produk<span class="text-danger">*</span></label
                >
                <select class="form-select" v-model="product.productTypeId">
                  <option value="">Pilih Tipe Produk:</option>
                  <option
                    v-for="productType in productTypes"
                    :key="productType.id"
                    :value="productType.id"
                  >
                    {{ productType.name }}
                  </option>
                </select>
              </div>
              <button
                type="submit"
                class="btn btn-md btn-primary rounded-sm shadow border-0"
              >
                Save</button
              >&nbsp;
              <button
                type="button"
                class="btn btn-md btn-secondary rounded-sm shadow border-0"
                @click="router.push({ path: '/products' })"
              >
                Cancel
              </button>
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
