<template>
  <div class="fixed-footer">
    <v-container>
      <div class="d-flex align-center justify-space-between">
        <div @click="viewCartClick">
          <v-badge
            :content="cartQuantity"
            color="red"
            offset-x="10"
            offset-y="10"
          >
            <v-icon size="45">mdi mdi-cart-variant</v-icon>
          </v-badge>
        </div>
        <div class="text-h5">
          <strong
            >{{ selectedCountry.currency_symbol }}{{ finalCartTotal }}</strong
          >
        </div>
      </div>
    </v-container>
    <Cart :viewCart="viewCart" @update:viewCart="viewCart = $event" />
  </div>
</template>

<script setup>
import axios from "@/util/axios";
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import Cart from "@/components/Cart.vue";

const store = useStore();

const platformFee = ref(null);
const taxAmount = ref(null);
const viewCart = ref(false);

// Get total quantity of all cart items
const cartQuantity = computed(() => {
  return store.state.cart.reduce((total, item) => total + item.quantity, 0);
});

const authToken = computed(() => {
  return localStorage.getItem("token");
});

const subTotal = computed(() => {
  return store.state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

const selectedCountry = computed(() => store.state.selectedCountry);

const selectedDeliveryPrice = computed(() => {
  if (store.state.cart) {
    // console.log(parseFloat(store.state.cart[0]?.delivery_charges));
    return parseFloat(store.state.cart[0]?.delivery_charges);
  } else {
    return 0;
  }
});

const finalCartTotal = computed(() => {
  return (
    subTotal.value +
    selectedDeliveryPrice.value +
    (platformFee.value ?? 0) +
    ((subTotal.value + selectedDeliveryPrice.value + 0.5) *
      (taxAmount.value ?? 0)) /
      100
  ).toFixed(2);
});

async function getPlatformFee() {
  let data = null;
  try {
    const appIdResponse = await axios.get(`/get-app-id`, {
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      params: {
        company_name: "Boozards",
      },
    });
    data = appIdResponse.data.data?.app_id;

    const feeResponse = await axios.get(`/get-platform-fee`, {
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      params: {
        app_id: data,
      },
    });

    platformFee.value = parseFloat(feeResponse.data.data?.platform_fee);
  } catch (error) {
    console.error("Error getting platform fee:", error);
  }
}

async function getTaxAmount() {
  // let countryId = null;
  try {
    // const userResponse = await axios.get(`/gypsy-user`, {
    //   headers: { Authorization: `Bearer ${authToken.value}` },
    // });
    // countryId = userResponse.data.data?.country_current;

    const taxResponse = await axios.get(`/get-tax-amount`, {
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      params: {
        country_id: selectedCountry.value.country_id,
      },
    });

    if (taxResponse?.data?.data?.applicable === "Y") {
      taxAmount.value = taxResponse.data.data?.tax_rate;
    }
  } catch (error) {
    console.error("Error getting tax amount:", error);
  }
}

const viewCartClick = () => {
  if (cartQuantity.value > 0) {
    viewCart.value = true;
  } else {
    store.commit("setIsCartEmpty", true);
  }
};

// // Get total price of all cart items
// const cartTotal = computed(() => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(
//     store.state.cart.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0,
//     ),
//   );
// });

watch(selectedCountry, async () => {
  await getTaxAmount();
});

onMounted(() => {
  getPlatformFee();
  // getTaxAmount();
});
</script>

<style>
.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #dbd8d8;
  z-index: 1000;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>
