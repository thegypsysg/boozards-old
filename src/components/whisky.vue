<script setup>
import { onMounted, ref, nextTick, onUnmounted, computed } from "vue";
import { useCart } from "@/composables/useCart";
import axios from "@/util/axios";
import { fileURL, appId } from "@/main";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  desktop: Boolean,
  title: {
    type: String,
    default: "Whisky",
  },
  products: {
    type: Array,
    default: () => [],
  },
  countries: {
    type: Array,
    default: () => [],
  },
  viewAll: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const store = useStore();
const { isInCart, cartQuantity, addToCart, updateQuantity } = useCart();

const loading = ref(false);
const listFavorite = ref([]);
const selected = ref(null);
const splideRef = ref(null);
const isBeginning = ref(true);
const isBestViewed = ref(false);
const isEnd = ref(false);
const isMobile = ref(false);

const token = computed(() => {
  return localStorage.getItem("token");
});

const userName = computed(() => {
  return store.state.userName;
});

const splideOptions = computed(() => ({
  type: "slide",
  perPage: isMobile.value ? 1.3 : 3.5,
  arrows: false,
  pagination: false,
  gap: isMobile.value ? "0.6rem" : "0.8rem",
  drag: true,
  snap: true,
  rewind: false,
  speed: isMobile.value ? 300 : 400,
  dragMinThreshold: 10,
  flickMaxPages: 1,
  wheelMinThreshold: 50,
  padding: { left: 0, right: 0 },
  focus: 0,
  trimSpace: true,
  updateOnMove: true,
  breakpoints: {
    640: {
      perPage: 1.5,
      gap: "1rem",
      padding: { left: 0, right: 0 },
      focus: 0,
      drag: true,
      snap: true,
      speed: 300,
    },
    960: {
      perPage: 2,
    },
    1200: {
      perPage: 3.5,
    },
  },
}));

const filteredProducts = computed(() => {
  const mapProduct = (item) => {
    const rangeItems = item.ranges.map((range, index) => ({
      ...range,
      selected: ref(index === 0), // Set selected true hanya untuk item pertama
    }));

    return {
      ...item,
      selectedImage: computed(() => {
        const selectedRange = rangeItems.find((range) => range.selected.value);
        return selectedRange?.image_1 || item.image;
      }),
      selectedPrice: computed(() => {
        const selectedRange = rangeItems.find((range) => range.selected.value);
        // return selectedRange?.price_list;
        return selectedRange?.price_list?.rate
          ? selectedRange?.price_list?.rate
          : rangeItems[0]?.price_list?.rate
            ? rangeItems[0]?.price_list?.rate
            : null;
      }),
      selectedPrice2: computed(() => {
        const selectedRange = rangeItems.find((range) => range.selected.value);
        return selectedRange?.price_list;
        // return selectedRange?.price_list?.rate
        //   ? selectedRange?.price_list?.rate
        //   : rangeItems[0]?.price_list?.rate
        //     ? rangeItems[0]?.price_list?.rate
        //     : null;
      }),
      selectedAlso: computed(() => {
        const selectedRange = rangeItems.find((range) => range.selected.value);
        const result =
          selectedRange?.price_list?.miniature == "Y"
            ? "Miniatures"
            : selectedRange?.price_list?.limited_edition == "Y"
              ? "Limited Edition"
              : selectedRange?.price_list?.special_edition == "Y"
                ? "Special Edition"
                : selectedRange?.price_list?.gift_item == "Y"
                  ? "Gift Items"
                  : "";
        return result;
      }),
      isCount: ref(false),
      count: ref(1),
      rangeItems,
    };
  };

  if (selected.value?.country_id) {
    return props.products
      .filter((product) => product.country_id === selected.value.country_id)
      .map(mapProduct);
  } else {
    return props.products.map(mapProduct);
  }
});

const formatName = (name) => name.toLowerCase().replace(/\s+/g, "");

function scrollToSection(sectionId, mobile) {
  const cardSection = document.getElementById(sectionId);

  // this.$nextTick(() => {
  if (cardSection) {
    const cardRect = cardSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = mobile
      ? cardRect.top + scrollTop - 300
      : cardRect.top + scrollTop - 100; // Nilai offset yang diinginkan, dalam piksel

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
  // });
  // window.scrollBy(0, -scrollOffset);
}

const goNext = () => {
  splideRef.value?.splide?.go("+1");
};

const goPrev = () => {
  splideRef.value?.splide?.go("-1");
};

const handleSlideMove = () => {
  const splide = splideRef.value?.splide;
  if (splide) {
    isBeginning.value = splide.index === 0;
    isEnd.value = splide.index >= splide.length - splide.options.perPage;
  }
};

function checkMobile() {
  isMobile.value = window.innerWidth <= 640;
  nextTick(() => {
    splideRef.value?.splide?.refresh();
  });
}

const handleMoved = () => {
  if (isMobile.value) {
    nextTick(() => {
      splideRef.value?.splide?.refresh();
    });
  }
};

const getProductDetailsLink = async (product) => {
  const selectedRange = product.rangeItems.find(
    (range) => range.selected?.value,
  );

  try {
    const response = await axios.post(
      `/increment-product-view-count/products/${product.product_id}/ranges/${selectedRange?.range_id}`,
      {},
    );
    if (response.status == 200) {
      router.push(
        `/product/${product.encrypted_id}?range_id=${selectedRange?.range_id}`,
      );
    }
  } catch (error) {
    console.log(error);
  }
};

function handleSelectRange(menu, selectedItem) {
  const isAlreadySelected = selectedItem.selected.value;

  // Set semua rangeItems menjadi tidak terpilih
  menu.rangeItems.forEach((item) => {
    item.selected.value = false;
  });

  // Undone the unselect quantity here
  selectedItem.selected.value = true;

  // Jika belum dipilih sebelumnya, jadikan selected
  /* if (!isAlreadySelected) {
    selectedItem.selected.value = true;
  }
  else {
    selectedItem.selected.value = true;
  } */
}

const addToCartData = (data) => {
  // console.log(token.value);
  if (token.value == "null") {
    store.commit("setIsNotLoggedIn", true);
  } else {
    addToCart(data);
  }
};

const addToFavorite = async (data) => {
  const payload = {
    app_id: appId,
    range_id: data.rangeItems.filter((item) => item.selected.value)[0].range_id,
  };
  loading.value = true;

  try {
    const response = await axios.post(`/add-to-my-favorite`, payload);
    getFavoriteListData();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const removeFromFavorite = async (data) => {
  loading.value = true;
  try {
    const response = await axios.delete(
      `/my-favorite/range-id/${data.rangeItems.filter((item) => item.selected.value)[0].range_id}`,
    );
    getFavoriteListData();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const getFavoriteListData = async (cityId) => {
  try {
    const response = await axios.get(
      `/list-my-favorites-range-id/app/${appId}`,
    );
    const data = response.data.data;
    listFavorite.value = data;
    console.log("listFavorite", listFavorite.value);
  } catch (error) {
    console.error("Error fetching list favorites:", error);
  }
};

onMounted(() => {
  getFavoriteListData();
  checkMobile();
  window.addEventListener("resize", checkMobile);
  nextTick(() => {
    const splide = splideRef.value?.splide;
    if (splide) {
      splide.on("moved mounted", handleSlideMove);
      splide.on("moved", handleMoved);
      handleSlideMove();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile); // Clean up the event listener
});
</script>

<template>
  <div
    :id="`${formatName(props.title)}`"
    class="nursing-section mt-md-10 mt-sm-2"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-block d-md-flex align-center">
        <span class="ml-4 ml-md-0 text-h6 font-weight-bold">{{
          props.title
        }}</span>
        <v-select
          style="min-width: 200px"
          variant="outlined"
          v-model="selected"
          :items="[
            { country_name: 'Show All', country_id: 0 },
            ...props.countries,
          ]"
          item-title="country_name"
          item-value="country_id"
          return-object
          placeholder="Country of origin"
        >
          <!-- Tampilan ketika dipilih -->
          <template #selection="{ props, item }">
            <div
              v-bind="props"
              class="d-flex align-center w-100 text-no-wrap"
              style="font-size: 14px"
            >
              <span>{{ item.raw.country_name }}</span>
              <span
                v-if="item.raw.country_id != 0"
                class="font-weight-bold ml-1"
              >
                (
                <span class="text-red">{{ item.raw.brand_count }}</span> Brands
                |
                <span class="text-blue-accent-1">{{
                  item.raw.product_count
                }}</span>
                Products )
              </span>
            </div>
          </template>

          <!-- Tampilan item di dropdown -->
          <template #item="{ props, item }">
            <div v-bind="props" class="px-2 py-1">
              <div
                class="d-flex align-center w-100 text-no-wrap"
                style="font-size: 14px"
              >
                <span>{{ item.raw.country_name }}</span>
                <span
                  v-if="item.raw.country_id != 0"
                  class="font-weight-bold ml-1"
                >
                  (
                  <span class="text-red">{{ item.raw.brand_count }}</span>
                  Brands |
                  <span class="text-blue-accent-1">{{
                    item.raw.product_count
                  }}</span>
                  Products )
                </span>
              </div>
            </div>
          </template>
        </v-select>
      </div>
      <v-btn
        class="text-capitalize font-weight-bold"
        variant="text"
        height="40"
        @click="isMobile ? undefined : (isBestViewed = true)"
      >
        <span style="color: #00a4e4">View all</span>
      </v-btn>
    </div>

    <div class="position-relative">
      <v-btn
        v-if="!isMobile && !isBeginning"
        icon
        class="custom-arrow prev-arrow"
        @click="goPrev"
      >
        <span class="arrow-icon">←</span>
      </v-btn>
      <transition-group name="card-transition" mode="out-in">
        <Splide ref="splideRef" :options="splideOptions">
          <SplideSlide v-for="menu in filteredProducts" :key="menu.product_id">
            <!-- :key="menu?.product_id" -->
            <p class="text-grey-darken-1 pl-4 text-caption font-weight-black">
              View: {{ menu?.selectedPrice2.value?.views || 0 }}
            </p>
            <v-card class="card-wrapper" height="420" elevation="3">
              <div class="img-cont">
                <div class="cart clearfix animate-effect" v-if="userName">
                  <div class="action pr-8">
                    <ul class="list-unstyled d-flex justify-end">
                      <li class="wishlist">
                        <!-- :class="
                        listFavorite.includes(
                          menu.rangeItems.filter(
                            (item) => item.selected.value,
                          )[0].range_id,
                        )
                          ? 'act'
                          : 'def'
                      " -->
                        <v-btn
                          v-if="
                            listFavorite.includes(
                              menu.rangeItems.filter(
                                (item) => item.selected.value,
                              )[0].range_id,
                            )
                          "
                          :disabled="loading"
                          @click="removeFromFavorite(menu)"
                          rounded
                          icon
                          color="#ee4054"
                        >
                          <v-icon color="white"> mdi-heart </v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          :disabled="loading"
                          @click="addToFavorite(menu)"
                          rounded
                          icon
                          color="white"
                        >
                          <v-icon color="#ee4054"> mdi-heart </v-icon>
                        </v-btn>
                      </li>
                    </ul>
                  </div>
                </div>
                <div @click="getProductDetailsLink(menu)">
                  <v-img
                    :src="fileURL + menu?.selectedImage.value"
                    height="200"
                  ></v-img>
                </div>
              </div>
              <div
                class="card-title d-flex flex-column justify-space-between"
                style="height: 170px"
              >
                <div @click="getProductDetailsLink(menu)">
                  <p class="text-red-darken-4 font-weight-bold text-body-2">
                    {{ menu?.brand_name }}
                  </p>
                  <p
                    class="font-weight-bold text-black text-body-2 mt-1"
                    style="height: 45px"
                  >
                    {{ menu?.product_name }}
                  </p>
                </div>
                <div class="d-flex align-center ga-1 my-2">
                  <template v-for="item in menu?.rangeItems" :key="item.pq_id">
                    <v-btn
                      size="xs"
                      color="black"
                      class="text-caption pa-1 rounded-lg"
                      @click="handleSelectRange(menu, item)"
                      :variant="item.selected.value ? 'flat' : 'outlined'"
                      >{{ item?.quantity?.quantity_name }}</v-btn
                    >
                    <!-- @click="item.selected.value = !item.selected.value" -->
                  </template>
                </div>
                <div
                  v-if="menu?.selectedPrice.value"
                  class="d-flex justify-space-between align-center"
                >
                  <span class="text-red-darken-1 font-weight-bold">
                    S$ {{ menu?.selectedPrice.value }}
                  </span>
                  <span>
                    <v-btn
                      v-if="!isInCart(menu)"
                      @click="addToCartData(menu)"
                      size="xs"
                      color="black"
                      class="text-caption py-1 px-8"
                      variant="flat"
                      >Add</v-btn
                    >
                    <div
                      v-else="isInCart(menu)"
                      class="d-flex align-center ga-2"
                    >
                      <v-btn
                        size="xs"
                        color="black"
                        class="text-caption pa-1 rounded-0"
                        variant="flat"
                        icon
                        @click="updateQuantity(menu, 'decrease')"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>

                      <span>
                        {{ cartQuantity(menu) }}
                      </span>

                      <v-btn
                        size="xs"
                        color="black"
                        class="text-caption pa-1 rounded-0"
                        variant="flat"
                        icon
                        @click="updateQuantity(menu, 'increase')"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </span>
                </div>
                <hr />
                <div class="mt-3">
                  <span class="mr-2 font-weight-bold text-grey">{{
                    menu.percentage
                  }}</span>
                  <span class="text-blue">% |</span>
                  <span class="ml-2 text-orange font-weight-bold">{{
                    menu?.country_name
                  }}</span>
                </div>
                <p
                  v-if="menu?.selectedAlso.value"
                  class="font-weight-black text-caption"
                >
                  Also in :
                  <span
                    @click="
                      scrollToSection(
                        formatName(menu?.selectedAlso.value),
                        isMobile ? true : false,
                      )
                    "
                    class="text-blue-darken-4 cursor-pointer"
                  >
                    {{ menu?.selectedAlso.value }}
                  </span>
                </p>
              </div>
            </v-card>
            <div
              class="d-flex flex-md-row flex-column justify-space-between px-4 font-weight-bold text-caption"
            >
              <p
                v-if="
                  menu.rangeItems.filter((item) => item.selected.value)[0]
                    ?.total_purchased
                "
              >
                Others who purchased :
                <span class="text-blue-darken-4">{{
                  menu.rangeItems.filter((item) => item.selected.value)[0]
                    ?.total_purchased
                }}</span>
              </p>
              <template v-if="userName">
                <p
                  v-if="
                    menu.rangeItems.filter((item) => item.selected.value)[0]
                      ?.user_purchased_count
                  "
                >
                  <span class="text-grey-darken-1"> You purchased : </span>
                  <span class="text-blue-darken-4">{{
                    menu.rangeItems.filter((item) => item.selected.value)[0]
                      ?.user_purchased_count
                  }}</span>
                </p>
              </template>
            </div>
          </SplideSlide>
        </Splide>
      </transition-group>

      <v-btn
        v-if="!isMobile && !isEnd"
        icon
        class="custom-arrow next-arrow"
        @click="goNext"
      >
        <span class="arrow-icon">→</span>
      </v-btn>
    </div>
  </div>
  <v-dialog v-model="isBestViewed" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Best Viewed on Mobile</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isBestViewed = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<!-- .def:hover button {
      background-color: rgb(238, 64, 84) !important;
    }
    .def:hover button i {
      color: white !important;
    }

    .act:hover button {
      background-color: white !important;
    }
    .act:hover button i {
      color: rgb(238, 64, 84) !important;
    } -->
<style scoped>
.nursing-section {
  padding: 1rem 0;
}

.card-wrapper {
  margin: 0.5rem;
  overflow: hidden;
  background: white;
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-4px);
}

.card-title {
  padding: 1rem;
  font-weight: 500;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  left: -20px;
}

.next-arrow {
  right: -20px;
}

.arrow-icon {
  font-size: 24px;
  line-height: 1;
}

.splide-container {
  touch-action: pan-y pinch-zoom;
  -webkit-tap-highlight-color: transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

@media (max-width: 640px) {
  .custom-arrow {
    display: none !important;
  }

  .splide-container {
    overflow: visible;
    cursor: grab;
    margin: 0;
    padding: 0;
  }

  .splide-container:active {
    cursor: grabbing;
  }

  .splide__track {
    overflow: visible;
    -webkit-mask-image: -webkit-radial-gradient(
      white,
      black
    ); /* Helps with flickering */
  }

  .splide__list {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .card-wrapper {
    margin: 0.25rem;
    /* width: calc(66.666% - 0.5rem); */
  }

  .v-img {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    will-change: transform;
  }
}

.arrow-hidden {
  opacity: 0.5;
  cursor: not-allowed;
}

.img-cont {
  position: relative;
  overflow: hidden;

  .cart {
    margin-top: 5px;
    opacity: 0;
    -webkit-transition: all 0.5s linear 0s;
    -moz-transition: all 0.5s linear 0s;
    -o-transition: all 0.5s linear 0s;
    transition: all 0.5s linear 0s;
    z-index: 666;
    right: 30%;
    position: absolute;
    top: 0;
  }

  .action ul li {
    float: left;
  }
  .action ul li button {
    font-size: 16px !important;
    height: 40px;
    width: 40px;
  }

  .action ul li button i {
    font-size: 16px !important;
  }
}

.img-cont:hover .cart {
  opacity: 1;
  top: 20px;
}
.cart {
  margin-top: 5px;
  -webkit-transition: all 0.2s linear 0s;
  -moz-transition: all 0.2s linear 0s;
  -o-transition: all 0.2s linear 0s;
  transition: all 0.2s linear 0s;
  z-index: 666;
  right: 0px;
}

.card-transition-enter-active,
.card-transition-leave-active {
  transition:
    transform 0.5s,
    opacity 0.3s;
}

.card-transition-enter {
  opacity: 0;
  transform: translateX(-50%);
}

.card-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
