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
        return this.activeMallsItems;
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

<template>
  <div class="pt-16 px-2 px-md-16">
    <div
      class="d-flex flex-column flex-md-row bg-white pt-4 pt-md-12 pb-2"
      :class="!isSmall ? 'w-70 gap40' : 'w-100 gap10'"
      style="position: fixed; top: 50; z-index: 2"
    >
      <v-autocomplete
        clearable
        density="compact"
        placeholder="=== Select Category ==="
        :items="categories"
        item-title="name"
        item-value="id"
        class="border-sm"
        v-model="category"
        variant="outlined"
      ></v-autocomplete>
      <form class="navbar__search">
        <v-text-field
          id="product_name"
          v-model="search"
          class="form-control mr-sm-2 ml-md-n3 search-input"
          style="font-style: italic"
          placeholder="Type your brands... Chivas,Monkey,Roku,"
          density="compact"
          color="blue-grey-lighten-2"
        >
        </v-text-field>
        <button class="btn btn--search" type="submit">
          <v-icon color="white"> mdi-magnify </v-icon>
        </button>
      </form>
    </div>
    <div class="mt-16 pt-16">
      <template v-for="item in filteredMalls">
        <div
          v-if="item.ranges.length > 0"
          class="mb-4 px-2"
          :class="!isSmall ? 'w-60' : undefined"
        >
          <h4
            v-if="item.showCategoryName"
            class="font-weight-bold text-blue-darken-4 mb-2"
          >
            {{ item.category_name }}
          </h4>
          <router-link
            class="text-decoration-none"
            :to="`/product/${item.product_id}`"
          >
            <p
              v-if="item.showBrandName"
              style="font-size: 12px"
              class="font-weight-bold text-red-darken-4 mb-2"
            >
              {{ item.brand_name }}
            </p>
          </router-link>
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
                <!-- <router-link
                class="text-decoration-none text-black font-weight-bold"
                :to="`/${item.slug}`"
              > -->
                <div
                  v-if="!isSmall"
                  class="d-flex justify-space-between align-center"
                >
                  <router-link
                    class="text-decoration-none text-black"
                    :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                  >
                    <p class="mb-1 font-weight-regular">
                      {{
                        `${item?.product_name} ${range?.quantity?.quantity_name}`
                      }}
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
                  </div>
                </div>
                <router-link
                  v-else
                  class="text-decoration-none text-black"
                  :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                >
                  <p class="mb-1 font-weight-regular">
                    {{
                      `${item?.product_name} ${range?.quantity?.quantity_name}`
                    }}
                  </p>
                </router-link>

                <router-link
                  class="text-decoration-none text-black"
                  :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                >
                  <p class="font-weight-regular">
                    <span>{{
                      item.percentage && item.country_name
                        ? `${item.percentage}% | ${item.country_name}`
                        : item.percentage
                          ? `${item.percentage}%`
                          : item.country_name
                            ? `${item.country_name}`
                            : ""
                    }}</span>
                  </p>
                </router-link>
                <!-- </router-link> -->
                <div
                  v-if="isSmall"
                  class="d-flex justify-space-between align-center"
                >
                  <router-link
                    class="text-decoration-none"
                    :to="`/product/${item.encrypted_id}?range_id=${range?.range_id}`"
                  >
                    <span class="text-red-darken-1 font-weight-bold">
                      <template v-if="range?.price_list?.rate">
                        S$ {{ range?.price_list?.rate }}
                      </template>
                    </span>
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
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

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
</style>
