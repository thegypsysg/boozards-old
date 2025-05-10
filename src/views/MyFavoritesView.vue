<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <div v-if="!isLoading" class="pt-16" :class="{ 'mt-8': !isSmall }">
      <v-container>
        <div>
          <v-slide-group class="w-100 mb-10 mt-2">
            <v-slide-group-item
              v-for="(item, index) in activeMallsItems"
              :key="index"
            >
              <v-btn class="ma-2 px-2 text-red-darken-4 font-weight-bold">
                {{ item.category_name }}
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>
          <template v-for="item in filteredMalls">
            <div
              v-if="item.ranges.length > 0"
              class="mb-4 px-2"
              :class="!isSmall ? 'w-70' : undefined"
            >
              <div
                v-for="range in item.ranges"
                class="d-flex align-center w-100 mb-2"
              >
                <div style="width: 15%" class="mr-2">
                  <router-link
                    class="text-decoration-none"
                    :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                  >
                    <div
                      style="
                        height: 45px;
                        width: 100%;
                        object-fit: cover;
                        object-position: center;
                      "
                    >
                      <v-img
                        height="45"
                        cover
                        :src="
                          range.image_1
                            ? $fileURL + range.image_1
                            : $fileURL + item.image
                        "
                      >
                        <template #placeholder>
                          <div class="skeleton" />
                        </template>
                      </v-img>
                    </div>
                  </router-link>
                </div>
                <div
                  class="d-flex align-center justify-space-between"
                  style="font-size: 12px; width: 85%"
                >
                  <div class="w-100">
                    <!-- Desktop -->
                    <div
                      v-if="!isSmall"
                      class="d-flex justify-space-between align-center"
                    >
                      <router-link
                        class="text-decoration-none text-black"
                        :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                      >
                        <p class="mb-1 font-weight-regular">
                          {{ `${item?.product_name}` }}
                          <span class="text-blue-lighten-1">{{
                            ` ${range?.quantity?.quantity_name}`
                          }}</span>
                        </p>
                      </router-link>
                      <div
                        class="d-flex justify-space-between align-center"
                        style="gap: 20px"
                      >
                        <span class="text-red-darken-1 font-weight-bold">
                          <template v-if="range?.price_list?.rate">
                            S$ {{ range?.price_list?.rate }}
                          </template>
                        </span>

                        <div class="d-flex align-center">
                          <span v-show="range?.price_list?.rate">
                            <v-btn
                              v-if="!isInCart(item, range)"
                              @click="addToCartData(item, range)"
                              size="xs"
                              color="black"
                              class="text-caption py-1 px-8"
                              variant="flat"
                              >Add</v-btn
                            >
                            <div
                              v-else="isInCart(item, range)"
                              class="d-flex align-center ga-2"
                            >
                              <v-btn
                                size="xs"
                                color="black"
                                class="text-caption pa-1 rounded-0"
                                variant="flat"
                                icon
                                @click="updateQuantity(item, 'decrease')"
                              >
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>

                              <span>
                                {{ cartQuantity(item, range) }}
                              </span>

                              <v-btn
                                size="xs"
                                color="black"
                                class="text-caption pa-1 rounded-0"
                                variant="flat"
                                icon
                                @click="updateQuantity(item, 'increase')"
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </div>
                          </span>
                          <p class="text-red-darken-1 ml-2">Remove</p>
                        </div>
                      </div>
                    </div>

                    <!-- Mobile -->
                    <div
                      v-if="isSmall"
                      class="d-flex justify-space-between align-top"
                    >
                      <div class="w-75">
                        <router-link
                          class="text-decoration-none text-black"
                          :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                        >
                          <p class="mb-1 font-weight-regular">
                            {{ `${item?.product_name}` }}
                            <span class="text-blue-lighten-1">{{
                              ` ${range?.quantity?.quantity_name}`
                            }}</span>
                          </p>
                        </router-link>

                        <span v-show="range?.price_list?.rate">
                          <v-btn
                            v-if="!isInCart(item, range)"
                            @click="addToCartData2(item)"
                            size="xs"
                            color="black"
                            class="text-caption py-1 px-8"
                            variant="flat"
                            >Add</v-btn
                          >
                          <div
                            v-else="isInCart(item, range)"
                            class="d-flex align-center ga-2"
                          >
                            <v-btn
                              size="xs"
                              color="black"
                              class="text-caption pa-1 rounded-0"
                              variant="flat"
                              icon
                              @click="updateQuantity(item, 'decrease')"
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>

                            <span>
                              {{ cartQuantity(item, range) }}
                            </span>

                            <v-btn
                              size="xs"
                              color="black"
                              class="text-caption pa-1 rounded-0"
                              variant="flat"
                              icon
                              @click="updateQuantity(item, 'increase')"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </div>
                        </span>
                      </div>

                      <div class="text-right w-25">
                        <p class="font-weight-bold text-nowrap mb-2">
                          <template v-if="range?.price_list?.rate">
                            S$ {{ range?.price_list?.rate }}
                          </template>
                        </p>
                        <p class="text-red-darken-1">Remove</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "@/util/axios";
import { appId } from "@/main";
import cartMixin from "@/mixins/cartMixin";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "PriceListView",
  mixins: [cartMixin],
  data() {
    return {
      isLoading: false,
      search: null,
      category: null,
      categories: [],
      activeMallsItems: [],
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    filteredMalls() {
      if (!this.search && !this.category) {
        return this.activeMallsItems.slice(0, 5);
      } else if (this.search && !this.category) {
        const searchTextLower = this.search.toLowerCase();
        return this.activeMallsItems.filter(
          (item) =>
            item.brand_name.toLowerCase().includes(searchTextLower) ||
            item.product_name.toLowerCase().includes(searchTextLower),
        );
      } else if (!this.search && this.category) {
        return this.activeMallsItems.filter(
          (item) => item.category_id == this.category,
        );
      } else {
        const searchTextLower = this.search.toLowerCase();
        return this.activeMallsItems.filter(
          (item) =>
            (item.brand_name.toLowerCase().includes(searchTextLower) ||
              item.product_name.toLowerCase().includes(searchTextLower)) &&
            item.category_id == this.category,
        );
      }
      // const searchTextLower = this.search.toLowerCase();
      // return this.activeMallsItems.filter(
      //   (item) =>
      //     item.brand_name.toLowerCase().includes(searchTextLower) ||
      //     item.product_name.toLowerCase().includes(searchTextLower),
      // );
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.search = null;
    this.getProductCategoryListData();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    async getProductCategoryListData() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/categories-with-products/app/${appId}`,
        );
        const data = response.data.data;

        const groupedCategories = {};
        const groupedBrands = {};
        const processedMalls = [];

        data.forEach((category) => {
          const categoryKey = category.category_id;

          category.brands.forEach((brand) => {
            const brandKey = brand.brand_id;
            let isFirstBrandInCategory = false;

            // Jika ini adalah pertama kalinya category_id muncul, tandai
            if (!groupedCategories[categoryKey]) {
              groupedCategories[categoryKey] = true;
              isFirstBrandInCategory = true;
            }

            brand.products.forEach((product, index) => {
              let isFirstProductInBrand = false;

              // Jika ini adalah pertama kalinya brand_id muncul, tandai
              if (!groupedBrands[brandKey]) {
                groupedBrands[brandKey] = true;
                isFirstProductInBrand = true;
              }

              processedMalls.push({
                ...product,
                brand_id: brand.brand_id,
                brand_name: brand.brand_name,
                product_id: product.product_id,
                category_id: category.category_id,
                category_name: category.category_name,
                slug: product.product_name.toLowerCase().replace(/\s+/g, "-"),
                country_id: brand?.country?.country_id,
                country_name: brand?.country?.country_name,
                showBrandName: isFirstProductInBrand, // Hanya produk pertama dalam brand yang menampilkan nama brand
                showCategoryName: isFirstBrandInCategory, // Hanya produk pertama dalam kategori yang menampilkan nama kategori
                isCount: false,
                count: 1,
              });

              // Setelah produk pertama, kategori tidak perlu ditampilkan lagi untuk brand yang sama
              isFirstBrandInCategory = false;
            });
          });
        });

        this.categories = data.map((item) => ({
          id: item.category_id,
          name: item.category_name,
        }));

        this.activeMallsItems = processedMalls;
        // console.log("ini lhoooo", this.activeMallsItems);
      } catch (error) {
        console.error("Error fetching product categories:", error);
      } finally {
        this.isLoading = false;
      }
    },

    toggleIsCount(product) {
      if (product) {
        product.isCount = true;
      }
    },
    decreaseCount(product) {
      if (product && product.count > 1) {
        product.count--;
      }
    },
    increaseCount(product) {
      if (product) {
        product.count++;
      }
    },
  },
};
</script>

<script setup>
import { useStore } from "vuex";
import { useCart } from "@/composables/useCart";
import { watch, computed } from "vue";

const store = useStore();
const { isInCart, cartQuantity, addToCart, updateQuantity } = useCart();

const token = computed(() => {
  return localStorage.getItem("token");
});

const addToCartData = (data, range) => {
  // console.log(token.value);
  if (token.value == "null") {
    store.commit("setIsNotLoggedIn", true);
  } else {
    addToCart(data, range);
  }
};
const addToCartData2 = (data) => {
  // console.log(token.value);
  if (token.value == "null") {
    store.commit("setIsNotLoggedIn", true);
  } else {
    addToCart(data);
  }
};
</script>

<style scoped>
.w-70 {
  width: 70%;
}
.w-60 {
  width: 60%;
}

.gap40 {
  gap: 40px;
}
.gap10 {
  gap: 10px;
}

.scroll-hidden {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.scroll-hidden::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}
</style>
