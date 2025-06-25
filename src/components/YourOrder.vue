<template>
  <div class="" style="background: #f8f8f8">
    <v-container>
      <h2 class="font-weight-black mb-6">Your Orders</h2>
      <div class="d-flex ga-4 text-caption" style="overflow-x: auto">
        <v-btn
          @click="changeOrder('all')"
          :variant="type == 'all' ? 'plain' : 'outlined'"
          :style="
            type == 'all' ? 'background: #0596d5' : 'border: 1px solid grey'
          "
          :class="
            type == 'all' ? 'text-white' : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >View All</v-btn
        >
        <v-btn
          @click="changeOrder('current')"
          :variant="type == 'current' ? 'plain' : 'outlined'"
          :style="
            type == 'current' ? 'background: #0596d5' : 'border: 1px solid grey'
          "
          :class="
            type == 'current'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Current</v-btn
        >
        <v-btn
          @click="changeOrder('completed')"
          :variant="type == 'completed' ? 'plain' : 'outlined'"
          :style="
            type == 'completed'
              ? 'background: #0596d5'
              : 'border: 1px solid grey'
          "
          :class="
            type == 'completed'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Completed</v-btn
        >
        <!-- <v-btn
        @click="changeOrder('cancelled')"
          :variant="type == 'cancelled' ? 'plain' : 'outlined'"
          :style="
            type == 'cancelled'
              ? 'background: #0596d5'
              : 'border: 1px solid grey'
          "
          :class="
            type == 'cancelled'
              ? 'text-white'
              : 'text-red-darken-4 font-weight-bold'
          "
          class="rounded-xl"
          >Cancelled</v-btn
        > -->
      </div>
    </v-container>
    <v-sheet
      v-if="!loading"
      class="d-flex justify-start mx-0 mx-md-16 mt-10"
      style="background: #f8f8f8"
      elevation="0"
    >
      <v-slide-group class="pa-0">
        <v-slide-group-item
          v-for="(item, index) in orders"
          :key="index"
          v-slot="{ toggle }"
        >
          <v-lazy min-height="150">
            <v-card
              @click="toggle"
              class="mx-2 mx-md-4 pa-4 mb-4"
              :min-width="isSmall ? 200 : 350"
            >
              <div class="d-flex font-weight-black ga-6 text-caption">
                <div class="">
                  <p>Payment By</p>
                  <p class="text-red">
                    {{ item?.payment_status?.payment_status_name }}
                  </p>
                </div>
                <div class="">
                  <p>Delivery Status</p>
                  <p class="text-red">{{ item?.delivery_status }}</p>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between ga-6 mt-4">
                <div class="">
                  <span class="text-red">{{ item?.total_items }}</span> Items |
                  <span class="text-blue-lighten-1"
                    >S$ {{ item?.final_amount }}</span
                  >
                </div>
                <v-btn
                  variant="plain"
                  class="font-weight-black text-caption"
                  style="background: #b7e1e4"
                  @click="openDetail(item)"
                  >View Details</v-btn
                >
              </div>
              <p class="font-weight-black text-caption mt-4">
                Order Status :
                <span class="text-red">{{
                  item?.order_status?.order_status_name
                }}</span>
              </p>
            </v-card>
          </v-lazy>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <div v-else class="text-center pb-8">
      <v-progress-circular :size="50" color="#fa2964" indeterminate />
    </div>
  </div>

  <MazDrawer variant="right" :model-value="viewDetail" class="no-header">
    <template #default="{ close }">
      <div v-if="loadingDetail" class="text-center loading-page">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </div>
      <div v-if="!loadingDetail" class="cart-drawer fill-height">
        <div class="flex-grow-0 border-b">
          <v-row no-gutters>
            <v-col cols="12">
              <v-sheet>
                <div class="d-flex align-center justify-space-between pa-3">
                  <div class="text-h6">Your Order</div>
                  <div
                    class="text-h6"
                    v-show="orderDetail?.products.length > 0"
                  >
                    <span class="text-red">{{
                      orderDetail?.products.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )
                    }}</span>
                    Items |
                    <span
                      class="text-blue"
                      v-if="
                        orderDetail?.products.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0,
                        )
                      "
                    >
                      {{ selectedCountry.currency_symbol }}
                      {{ orderDetail?.final_amount }}
                    </span>
                  </div>
                  <div>
                    <v-btn @click="closeDetail" icon="mdi-close-circle"></v-btn>
                  </div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </div>

        <div class="cart-items flex-grow-1 overflow-y-auto">
          <v-row no-gutters>
            <v-col class="pa-5">
              <div class="my-3 text-h6 d-flex justify-start">
                <span>Review Order</span>
              </div>

              <template
                v-for="product in orderDetail?.products"
                :key="product?.product_id"
              >
                <div class="d-flex align-center px-3 py-1">
                  <div class="flex-grow-0 flex-shrink-0">
                    <v-img
                      class="rounded bg-white"
                      :src="fileURL + product.image"
                      width="65"
                      height="65"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height"
                        >
                          <v-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div class="flex-grow-1 flex-shrink-0 ml-1 pa-2">
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-wrap product-name text-body-2">
                        {{ product.name }}
                        <span class="text-blue">{{
                          product.quantity_name
                        }}</span>
                      </div>
                      <div class="text-body-2 text-end">
                        <strong
                          >{{ selectedCountry?.currency_symbol }}
                          {{
                            (product.price * product.quantity).toFixed(2)
                          }}</strong
                        >
                      </div>
                    </div>
                    <div class="d-flex align-center justify-start">
                      <span class="text-body-2 font-weight-black mr-4">{{
                        product.quantity
                      }}</span>
                      <div class="text-body-2">
                        <strong class="text-red">{{
                          selectedCountry?.currency_symbol
                        }}</strong>
                        <strong class="text-red">S{{ product.price }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <v-card elevation="0">
                <div
                  class="d-flex align-center justify-space-between pa-4 border-b"
                >
                  <div><strong>Billing Summary</strong></div>
                </div>
                <v-table density="compact" class="custom-table">
                  <tbody class="text-caption">
                    <tr>
                      <td colspan="2">Sub Total</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ orderDetail?.amount }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">Delivery Charges</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ orderDetail?.delivery_charges }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        Service Fee ({{ orderDetail?.service_fee }}%)
                      </td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ orderDetail?.service_fee }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">Platform Fee</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ orderDetail?.platform_fee }}
                      </td>
                    </tr>
                    <!-- <tr>
                      <td colspan="2">
                        G.S.T
                        {{
                          taxAmount != null
                            ? "(" + taxAmount + "%)"
                            : "(Not Applicable)"
                        }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{
                          taxAmount != null
                            ? (
                                ((orderDetail?.products.reduce(
                                  (total, item) =>
                                    total + item.price * item.quantity,
                                  0,
                                ) +
                                  selectedDeliveryPrice +
                                  0.5) *
                                  taxAmount) /
                                100
                              ).toFixed(2)
                            : "0.00"
                        }}
                      </td>
                    </tr> -->
                    <tr class="total-row">
                      <td colspan="2" class="border-none">
                        <strong>This is what you pay</strong>
                      </td>
                      <td colspan="2" class="border-none text-end">
                        <strong>{{ selectedCountry.currency_symbol }}</strong>
                      </td>
                      <td colspan="2" class="text-end border-none">
                        <strong>{{ orderDetail?.final_amount }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <div class="px-4 text-caption">
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Delivery to : </v-col>
                    <v-col cols="6"> Order Instructions </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-2 font-weight-bold">
                    <v-col cols="6">
                      <p
                        v-if="orderDetail?.delivery_address"
                        v-html="formatInfo(orderDetail?.delivery_address)"
                      />
                    </v-col>
                    <v-col cols="6">
                      <p
                        v-if="orderDetail?.order_instructions"
                        v-html="formatInfo(orderDetail?.order_instructions)"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Delivery Date </v-col>
                    <v-col cols="6"> Time Slot </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="mt-2 text-blue-darken-4 font-weight-bold"
                  >
                    <v-col cols="6">
                      {{
                        `${orderDetail?.delivery_day}, ${orderDetail?.delivery_date}`
                      }}
                    </v-col>
                    <v-col cols="6"> {{ orderDetail?.time_slot }} </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </MazDrawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "@/util/axios";
import { useStore } from "vuex";
import { fileURL } from "@/main";
import MazDrawer from "maz-ui/components/MazDrawer";

const allDays = [0, 1, 2, 3, 4, 5, 6];

const authToken = localStorage.getItem("token");

const store = useStore();

const screenWidth = ref(window.innerWidth);
const type = ref("all");
const orders = ref([]);
const orderDetail = ref({});
const loading = ref(false);
const loadingDetail = ref(false);
const viewDetail = ref(false);

const platformFee = ref(null);
const taxAmount = ref(null);
const selectedDelivery = ref(null);

const isSmall = computed(() => screenWidth.value < 640);

const deliveryOptions = computed(() => {
  return store.state.deliveryCharges.map((item) => {
    return {
      ...item,
      allowedDays: allDays.filter((day) => !item.allowed_days.includes(day)),
    };
  });
});
const cartQuantity = computed(() =>
  store.state.cart.reduce((total, item) => total + item.quantity, 0),
);
const selectedCountry = computed(() => {
  return store.state.selectedCountry;
});
const selectedDeliveryPrice = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option ? option.price : 0;
});
const subTotal = computed(() =>
  store.state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  ),
);
const cart = computed(() => {
  return store.state.cart;
});

const formatInfo = (info) => {
  return info.replace(/\n/g, "<br>");
};

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

function changeOrder(value) {
  type.value = value;
  getOrder();
}

const openDetail = (item) => {
  getOrderDetail(item?.cart_id);
  viewDetail.value = true;
};

const closeDetail = () => {
  viewDetail.value = false;
  orderDetail.value = {};
};

function getOrder() {
  loading.value = true;
  axios
    .get(`/get-orders/${type.value}`)
    .then((response) => {
      const data = response.data.data;
      console.log(data);
      orders.value = data;
      // let itemFinal = [];
    })
    .catch((error) => {
      console.log(error);
      throw error;
    })
    .finally(() => {
      loading.value = false;
    });
}

function getOrderDetail(id) {
  loadingDetail.value = true;
  axios
    .get(`/get-order-detail/${id}`)
    .then((response) => {
      const data = response.data;
      console.log(data);
      orderDetail.value = data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    })
    .finally(() => {
      loadingDetail.value = false;
    });
}

const getPlatformFee = async () => {
  let data = null;

  try {
    await axios
      .get(`/get-app-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          company_name: "Boozards",
        },
      })
      .then((response) => {
        data = response.data.data?.app_id;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });

    const response = await axios.get(`/get-platform-fee`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        app_id: data,
      },
    });

    platformFee.value = parseFloat(response.data.data?.platform_fee);
  } catch (error) {
    console.error("Error getting tax rate:", error);
    // const message = error.response?.data?.message || "Something went wrong!";
    // snackbar.value = true;
    // message.value = {
    //     text: message,
    //     color: "error"
    // };
  } finally {
    // savingAddress.value = false;
  }
};
const getTaxAmount = async () => {
  // let data = null;

  try {
    // await axios
    //   .get(`/gypsy-user`, { headers: { Authorization: `Bearer ${authToken}` } })
    //   .then((response) => {
    //     data = response.data.data?.country_current;
    //   })
    //   .catch((_) => {});

    const response = await axios.get(`/get-tax-amount`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        country_id: selectedCountry.value.country_id,
      },
    });
    if (response.data.data?.applicable === "Y") {
      taxAmount.value = response.data.data?.tax_rate;
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

watch(selectedCountry, async () => {
  await getTaxAmount();
  // await getPaymentTypes();
  // getDeliveryCharges();
});

watch(cart, async () => {
  getOrder();
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
  getOrder();
  getPlatformFee();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
.font-sm {
  font-size: 10px;
}
.cart-drawer {
  width: 100%; /* Ensures the parent takes the full width of its container */
  display: flex; /* Helps manage layout */
  flex-direction: column; /* Ensures proper stacking of elements */
  overflow-x: hidden; /* Prevents horizontal scrolling */
}

.cart-items {
  width: 100%; /* Makes the child take the full width of the parent */
  max-width: 100%; /* Ensures it doesn’t exceed parent width */
  white-space: normal; /* Allows text to wrap instead of overflowing */
  word-break: break-word; /* Breaks long words if needed */
  overflow-wrap: break-word; /* Prevents text overflow */
}

.product-name {
  white-space: normal; /* Allows text to wrap */
  word-break: break-word; /* Ensures words break if too long */
  overflow-wrap: break-word; /* Prevents overflow */
}

.no-header {
  height: 100dvh !important;
  min-height: 100dvh !important;
}

.no-header .m-drawer-content-wrap {
  min-height: 100dvh !important;
}

.no-header .m-drawer-header {
  display: none !important;
}

.fill-height {
  height: 100%;
}
.cart-items {
  overflow-y: auto;
  background: #ffff;
}
.checkout-container {
  position: sticky;
  bottom: 0;
  background: #ffff;
  padding: 20px;
  z-index: 10; /* Ensures it stays above other content */
}

.maz-elevation {
  border: 1px solid #00aaff !important;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table td {
  border-bottom: 1px solid #ddd;
}

.total-row td {
  font-weight: bold;
  padding-top: 10px;
}

.pac-container {
  z-index: 99999 !important; /* Ensure autocomplete appears above modal */
}

.loading-page {
  margin-top: 300px;
}

@media (max-width: 768px) {
  .product-name {
    width: 45vw !important;
  }
}
</style>
