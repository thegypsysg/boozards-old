<template>
  <v-snackbar v-model="snackbar" :timeout="3000" :color="message.color">
    {{ message.text }}
    <template #actions>
      <v-btn icon="mdi-close-circle" @click="snackbar = false"></v-btn>
    </template>
  </v-snackbar>
  
  <v-snackbar v-model="snackbarVisible" :timeout="3000" :color="snackbarColor">
    {{ snackbarMessage }}
    <template #actions>
      <v-btn icon="mdi-close-circle" @click="snackbarVisible = false"></v-btn>
    </template>
  </v-snackbar>

  <MazDrawer
    variant="right"
    :model-value="viewCart"
    @update:model-value="emit('update:viewCart', $event)"
    class="no-header"
  >
    <template #default="{ close }">
      <div class="cart-drawer fill-height">
        <div class="flex-grow-0 border-b">
          <v-row no-gutters>
            <v-col cols="12">
              <v-sheet>
                <div class="d-flex align-center justify-space-between pa-3">
                  <div class="text-h6">My Cart</div>
                  <div class="text-h6" v-show="cartQuantity > 0">
                    <span class="text-red">{{ cartQuantity }}</span> Items |
                    <span class="text-blue" v-if="subTotal">
                      {{ selectedCountry.currency_symbol }} {{ 
                        (
                          subTotal +
                          selectedDeliveryPrice +
                          platformFee +
                          ((subTotal + selectedDeliveryPrice + 0.5) *
                          taxAmount) / 100
                        ).toFixed(2)
                      }}
                    </span>
                  </div>
                  <div>
                    <v-btn @click="close" icon="mdi-close-circle"></v-btn>
                  </div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </div>

        <div class="cart-items flex-grow-1 overflow-y-auto">
          <v-row no-gutters>
            <v-col
              v-if="step == 1"
              v-for="(product, index) in cart"
              :key="index"
            >
              <div class="d-flex align-center px-3 py-1">
                <div class="flex-grow-0 flex-shrink-0">
                  <v-img
                    class="rounded bg-white"
                    :src="fileURL+product.image"
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
                      <span class="text-blue">{{ product.quantity_name }}</span>
                    </div>
                    <div class="text-body-2 text-end">
                      <strong>{{selectedLocation.currency_symbol }}
                        <!-- S{{ formatCurrency(product.price * product.quantity) }} -->
                      </strong>
                    </div>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center ga-3 border">
                      <v-btn
                        size="xs"
                        color="black"
                        class="text-caption pa-1 rounded-0"
                        variant="flat"
                        icon
                        @click="
                          updateQuantity(product, 'decrease')
                        "
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <span class="text-body-2">{{ product.quantity }}</span>
                      <v-btn
                        size="xs"
                        color="black"
                        class="text-caption pa-1 rounded-0"
                        variant="flat"
                        icon
                        @click="
                          updateQuantity(product, 'increase')
                        "
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                    <div class="text-body-2">
                      <strong class="text-red" >{{selectedLocation.currency_symbol }}</strong >
                      <strong class="text-red" >S{{ product.price }}</strong >
                    </div>
                    <div>
                      <v-btn
                        @click="
                          handleRemoveFromCart(product)
                        "
                        color="red"
                        icon="mdi-trash-can"
                        size="x-small"
                      ></v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col v-if="step == 2" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span>Delivery Options</span>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 1"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <MazRadioButtons
                v-slot="{ option, selected }"
                v-model="selectedDelivery"
                :options="deliveryOptions"
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class="pt-5"
                @update:model-value="onSelectDelivery"
              >
                <div class="d-flex justify-space-between ma-2">
                  <strong>{{ option.label }}</strong>
                  <span class="price">{{ selectedCountry.currency_symbol }} {{ option.price }}</span>
                </div>
                <div class="d-flex justify-space-between ma-2">
                  <strong class="text-red font-bold font-sm">{{ option.description_2 }}</strong>
                </div>
              </MazRadioButtons>
            </v-col>
            <v-col v-if="step == 3" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <div class="d-flex flex-column">
                  <span>Where To Deliver . ?</span>
                  <!-- <span class="text-caption text-red">You do not have any Delivery Address in your List .</span> -->
                </div>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 2;"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <v-alert
                v-show="addresses.length == 0"
                class="p-0"
                border="top"
                type="warning"
                variant="outlined"
                text="You do not have any Delivery Address in your List."
              ></v-alert>
              <div class="pt-5">
                <v-btn
                  @click="openAddressDialog"
                  prepend-icon="mdi-plus-circle"
                  color="primary"
                  variant="flat"
                  size="large"
                  block
                  >Add New</v-btn
                >
                <v-dialog v-model="addressDialog" max-width="600">
                  <v-card>
                    <div
                      class="d-flex align-center justify-space-between pa-4 border-b"
                    >
                      <div>
                        <strong>This Would Be Your Primary Address</strong>
                      </div>
                      <div>
                        <v-icon @click="addressDialog = false"
                          >mdi-close-circle</v-icon
                        >
                      </div>
                    </div>
                    <div class="pa-5 d-flex flex-column ga-3">
                      <v-row>
                        <v-col cols="12">
                          <label class="text-grey-darken-1 font-weight-bold">Street Address</label>
                          <MazInput
                            class="mt-1"
                            ref="streetRef"
                            v-model="addressForm.main_address"
                            placeholder="Type Your Street Address"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="8">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">Full Address</label>
                            <MazTextarea
                              class="mt-1"
                              rows="4"
                              v-model="addressForm.full_address"
                              placeholder="Your Full Address"
                            />
                          
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">Unit #</label>
                            <MazInput
                              class="mt-1 mb-2"
                              v-model="addressForm.unit"
                              placeholder="Unit"
                            />
                          </div>
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">Postal Code</label>
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.postal_code"
                              placeholder="Postal Code"
                            />
                          </div>
                        </v-col>
                      </v-row>
                    
                      <v-row>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">Town</label>
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.town"
                              placeholder="Town"
                            />
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">City</label>
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.city"
                              placeholder="City"
                            />
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold">Country</label>
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.country"
                              placeholder="Country"
                            />
                          </div>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <label class="text-grey-darken-1 font-weight-bold">Condo / Apartment Name</label>
                          <MazInput
                            class="mt-1"
                            v-model="addressForm.condo_name"
                            placeholder="Condo Name"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <label class="text-grey-darken-1 font-weight-bold">Landmark Details</label>
                          <MazTextarea
                            class="mt-1"
                            v-model="addressForm.landmark"
                            placeholder="Any Landmarks"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <label class="text-grey-darken-1 font-weight-bold">Name Location as</label>
                          <MazInput
                            class="mt-1"
                            v-model="addressForm.location_name"
                            placeholder="Name Your Location"
                          />
                          <small class="text-muted text-caption"
                            >e.g Home, Office</small
                          >
                        </v-col>
                      </v-row>
                      <div>
                        <v-btn
                          @click="saveAddress()"
                          :loading="savingAddress"
                          :disabled="savingAddress"
                          color="primary"
                          variant="flat"
                          size="large"
                          block
                          >Save</v-btn
                        >
                      </div>
                    </div>
                  </v-card>
                </v-dialog>
              </div>
              
              <div v-for="(option, index) in addressesOptions" :class="{
                  'mt-2': true,
                  'pa-5':true,
                  'bg-teal-lighten-2': option.primary_address,
                  'rounded-lg': true,
                  'border-md': !option.primary_address,
                }">
                <v-row>
                  <v-col>
                    <strong>{{ option.location_name }}</strong>
                  </v-col>
                </v-row>
                <v-divider v-if="option.primary_address" :thickness="2" class="mt-2 mb-2 border-opacity-25" />
                <v-divider v-else :thickness="2" class="mt-2 mb-2 border-opacity-15" />
                <v-row>
                  <v-col cols="9">
                    <p>{{ option.full_address }}</p>
                  </v-col>
                  <v-col v-if="option.primary_address" col="3" class="justify-end">
                    <strong>Primary</strong>
                  </v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col cols="9" class="d-flex align-center pa-0 pl-3">
                    <p v-if="option.landmark" class="text-red-darken-4 font-weight-bold" >
                      {{ option.landmark }}
                    </p>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center pa-0">
                    <v-btn class="" @click="handleOpenDialog(option, index)" color="red" icon="mdi-trash-can" size="small"></v-btn>
                    <v-btn class="" @click="handleEditLocation(option.value)" color="lime" icon="mdi-pencil-outline" size="small"></v-btn>
                  </v-col>
                </v-row>
              </div>
              
            </v-col>
            <v-col v-if="step == 4" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span>Payment Options</span>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 3"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <MazRadioButtons
                v-slot="{ option, selected }"
                v-model="selectedPaymentMethod"
                :options="paymentOptions"
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class="pt-5"
              >
                <div class="d-flex justify-space-between ma-2">
                  <strong>{{ option.label }}</strong>
                </div>
              </MazRadioButtons>
            </v-col>
          </v-row>
        </div>

        <!-- Fixed Checkout Button -->
        <div class="checkout-container border-t">
          <div class="d-flex align-center justify-center justify-space-between">
            <v-btn
              v-if="step == 1"
              @click="nextStep(2)"
              color="#ff9800"
              variant="flat"
              size="large"
              >Delivery Options</v-btn
            >
            <v-btn
              v-else-if="step == 2"
              @click="nextStep(3);"
              color="#ff9800"
              variant="flat"
              size="large"
              >Where to Deliver?</v-btn
            >
            <v-btn
              v-else-if="step == 3"
              @click="nextStep(4)"
              color="#ff9800"
              variant="flat"
              size="large"
              >Proceed to Pay</v-btn
            >
            <v-btn
              v-else-if="step == 4"
              color="#ff9800"
              variant="flat"
              size="large"
              >Pay Now</v-btn
            >
            <div>
              <v-icon @click="summaryDialog = true" size="40">
                <v-img
                  src="@/assets/images/billing.png"
                  alt="Billing Summary"
                />
              </v-icon>
              <v-dialog v-model="summaryDialog" max-width="500">
                <v-card>
                  <div
                    class="d-flex align-center justify-space-between pa-4 border-b"
                  >
                    <div><strong>Billing Summary</strong></div>
                    <div>
                      <v-icon @click="summaryDialog = false"
                        >mdi-close-circle</v-icon
                      >
                    </div>
                  </div>
                  <v-table class="custom-table">
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td>{{ selectedCountry.currency_symbol }}</td>
                        <td class="text-end">{{ cart[0].amount }}</td>
                      </tr>
                      <tr>
                        <td>Delivery Charges</td>
                        <td>{{ selectedCountry.currency_symbol }}</td>
                        <td class="text-end">
                          {{ selectedDeliveryPrice.toFixed(2) }}
                        </td>
                      </tr>
                      <tr>
                        <td>Platform Fee</td>
                        <td>{{ selectedCountry.currency_symbol }}</td>
                        <td class="text-end">{{ platformFee.toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td>
                          G.S.T
                          {{
                            taxAmount != null
                              ? "(" + taxAmount + "%)"
                              : "(Not Applicable)"
                          }}
                        </td>
                        <td>{{ selectedCountry.currency_symbol }}</td>
                        <td class="text-end">
                          {{
                            taxAmount != null
                              ? ((subTotal + selectedDeliveryPrice + 0.5) *
                                  taxAmount) /
                                100
                              : "0.00"
                          }}
                        </td>
                      </tr>
                      <tr class="total-row">
                        <td><strong>This is what you pay</strong></td>
                        <td><strong>{{ selectedCountry.currency_symbol }}</strong></td>
                        <td class="text-end">
                          <strong>{{
                            (
                              subTotal +
                              selectedDeliveryPrice +
                              platformFee +
                              ((subTotal + selectedDeliveryPrice + 0.5) *
                                taxAmount) /
                                100
                            ).toFixed(2)
                          }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </div>
      </div>
    </template>
  </MazDrawer>
  <v-dialog v-model="openDialog" max-width="400" persistent>
    <v-card prepend-icon="mdi-trash-can"
      :text=modalText
      :title=modalTitle >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="openDialog = false"> Disagree </v-btn>
        <v-btn @click="handleDeleteAddress()"> Agree </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style>
.font-sm {
  font-size: 12px;
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
  width: 17rem; /* Ensures the div takes up to 75% of the space */
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
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.total-row td {
  font-weight: bold;
  padding-top: 10px;
}

.pac-container {
  z-index: 99999 !important; /* Ensure autocomplete appears above modal */
}

@media (max-width: 768px) {
  .product-name {
    width: 45vw !important;
  }
}
</style>

<script setup>
import {
  ref,
  reactive,
  watch,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  nextTick,
} from "vue";
import axios from "@/util/axios";
import { useStore } from "vuex";
import MazDrawer from "maz-ui/components/MazDrawer";
import MazInput from "maz-ui/components/MazInput";
import MazTextarea from "maz-ui/components/MazTextarea";
import MazRadioButtons from "maz-ui/components/MazRadioButtons";
import { Loader } from "@googlemaps/js-api-loader";
import { number } from "maz-ui";
import { useCart } from "@/composables/useCart";
import { useGlobalSnackbar } from '@/composables/useGlobalSnackbar';
import { fileURL } from "@/main";

const { snackbarVisible, snackbarMessage, snackbarColor } = useGlobalSnackbar();
const { updateQuantity } = useCart();

const authToken = localStorage.getItem("token");

const props = defineProps({
  viewCart: Boolean,
  selectedLocation: String,
});

const openDialog = ref(false)
const addressIndex = ref(null)
const addressId = ref(null)
const addressName = ref(null)
const modalTitle = "Are you Sure?"
const modalText = ref(null)

watch(props.selectedLocation, async (location, oldLocation) => {
  await getTaxAmount();
});

const emit = defineEmits(["update:viewCart"]);
const store = useStore();
const isEditAddressForm = ref(false);
const addressID = ref("");

const step = ref(1);
const snackbar = ref(false);
const message = ref({
  text: "",
  color: "success",
});
const addressForm = reactive({
  main_address: "",
  full_address: "",
  unit: "",
  postal_code: "",
  town: "",
  city: "",
  country: "",
  condo_name: "",
  landmark: "",
  location_name: "",
  latitude: "",
  longitude: "",
});

const isEmptyCart = computed(() => {
  return store.state.isEmptyCart
})

const addressDialog = ref(false);
const summaryDialog = ref(false);
const selectedDelivery = ref(null);

const selectedCountry = computed(() => {
  return store.state.selectedCountry
})

const deliveryOptions = computed(() => {
  return store.state.deliveryCharges
})
const getDeliveryCharges = () => {
  store.dispatch('getDeliveryCharges', selectedCountry ? selectedCountry.country_id : 1)
}

// const deliveryOptions = ref([
//   { label: "Standard Delivery Fee", value: "standard", price: 12.0 },
//   { label: "Express (1.5 Hours)", value: "express", price: 15.0 },
//   { label: "Super Express (3 Hours)", value: "super_express", price: 25.0 },
// ]);
const selectedDeliveryPrice = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option ? option.price : 0;
});
const selectedDeliveryId = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option ? option.id : 0;
});
const selectedPaymentMethod = ref("creditcard");
const paymentOptions = ref([
  { label: "Credit Card", value: "creditcard" },
  { label: "Cash On Deliver (COD)", value: "cod" },
  { label: "Pay Now", value: "paynow" },
  { label: "Google Pay", value: "gpay" },
]);

const openAddressDialog = () => {
  resetForm()
  addressDialog.value = true
}

let autocomplete;
const streetRef = ref(null);
const initAutocomplete = async () => {
  // const googleMapsApiKey = 'AIzaSyDepjJJsj2zb9pi5j-9G0beqBTtTtfYhno';
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const loader = new Loader({
    apiKey: googleMapsApiKey, // Replace with your actual API key
    libraries: ["places"],
  });

  await loader.load();

  nextTick(() => {
    if (streetRef.value) {
      const nativeInput = streetRef.value.$el.querySelector("input");
      if (!nativeInput) {
        console.error("❌ Could not find the actual input inside MazInput!");
        return;
      }

      autocomplete = new google.maps.places.Autocomplete(nativeInput, {
        componentRestrictions: { country: "SG" }, // Singapore only
        types: ["address"],
        types: ["geocode"],
        types: ["establishment"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {

          var placeName = place.name;
          var streetName = "";
          var route = "";
          for (let i = 0; i < place.address_components.length; i++) {
            const component = place.address_components[i];
            
						// Check the types to determine what kind of address component it is
            if (component.types.includes("street_number")) {
              streetName = component.long_name;
            }
            if (component.types.includes("route")) {
              route = component.long_name;
            }

            if (component.types.includes("locality")) {
              addressForm.city = component.long_name; // City
            }
            if (component.types.includes("neighborhood")) {
              addressForm.town = component.long_name; // Town
            }
            if (component.types.includes("country")) {
              addressForm.country = component.long_name; // Country
            }
            if (component.types.includes("postal_code")) {
              addressForm.postal_code = component.long_name; // Postal Code
            }
            else {
              addressForm.postal_code = "";
            }
          }

          var wrappedAddress = addressForm.city+' '+addressForm.postal_code;
          var mainAddress = [placeName, streetName, route].filter(Boolean).join(' ');
          var fullSingleLine = streetName+' '+route
          var fullAddress = [fullSingleLine, wrappedAddress].filter(Boolean).join('\n');

          addressForm.main_address = mainAddress
        	addressForm.full_address = fullAddress
          addressForm.condo_name = placeName;
          addressForm.latitude = place.geometry.location.lat();
          addressForm.longitude = place.geometry.location.lng();
        }
      });
    } else {
      console.error("Invalid input element:", streetRef.value);
    }
  });
};

const resetForm = () => {
  addressForm.main_address = ""
  addressForm.full_address = ""
  addressForm.unit = ""
  addressForm.postal_code = ""
  addressForm.town = ""
  addressForm.city = ""
  addressForm.country = ""
  addressForm.condo_name = ""
  addressForm.landmark = ""
  addressForm.location_name = ""
}

watch(addressDialog, (isOpen) => {
  if (isOpen) {
    initAutocomplete();
  }
});

watch(
  () => props.viewCart, // Watch for changes in viewCart prop
  (newValue) => {
    if (newValue) {
      step.value = 1; // Set step to 1 when viewCart changes
      selectedDelivery.value = null;
    }
  },
);

// Get cart items
const cart = computed(() => {
  return store.state.cart
});

// Get cart items
const detailsCart = computed(() => {
  return store.state.detailsCart
});

// Get total quantity of all cart items
const cartQuantity = computed(() =>
  store.state.cart.reduce((total, item) => total + item.quantity, 0),
);

const subTotal = computed(() =>
  store.state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  ),
);

/* const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

// Remove item from cart
const handleRemoveFromCart = (product) => {
  store.dispatch("removeFromCart", product);
}; */

const onSelectDelivery = (selectedId) => {
  try {
    const selectedOption = deliveryOptions.value.find(opt => opt.dc_id === selectedId)  
    if (selectedOption) {
      const payload = {
        cart_id: cart.value[0].cart_id,
        dc_id: selectedOption.dc_id,
        delivery_rate: selectedOption.price,
      }
      store.dispatch('updateDeliveryChargesInCart', payload)
      console.log('Delivery option deliveryOptions:', payload)
    }
  }
  catch (error) {
    console.error('Error saving delivery option:', error)
  }
}

// Open Confirmation Modal
const handleOpenDialog = (option, index) => {
  addressIndex.value = index
  addressId.value = option.value
  addressName.value = option.location_name
  modalText.value = `Do you surely want to delete the address "${addressName.value}"?`
  openDialog.value = true
}

// Delete address from the DB & the list
const handleDeleteAddress = async () => {
  const response =await axios.get('/delete-address/'+addressId.value, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  
  snackbar.value = true;
  message.value = {
    text: response.data.message,
    color: "success",
  }
  addresses.value.splice(addressIndex.value, 1)
  openDialog.value = false
};

// Edit Address
const handleEditLocation = async (address_id) => {
  isEditAddressForm.value = true
  addressID.value = address_id
  axios.get('/get-address/'+address_id).then(response => {
    let formData = response.data.data
    addressForm.main_address = formData.address_master?.street_address,
    addressForm.full_address = formData.full_address,
    addressForm.unit = formData.unit_number,
    addressForm.postal_code = formData.address_master?.postal_code,
    addressForm.town = formData.address_master?.town.town_name,
    addressForm.city = formData.address_master?.city.city_name,
    addressForm.country = formData.address_master?.country.country_name,
    addressForm.condo_name = formData?.condo_name || "",
    addressForm.landmark = formData.landmark,
    addressForm.location_name = formData.location_name
    addressDialog.value = true
  })
  .catch(error => {
    console.error(error);
  });
};

const nextStep = (value) => {
  /* if(value === 4) {
    if (isEmptyCart.value) {
      snackbar.value = true;
      message.value = {
        text: "Please add products in your Cart",
        color: "error",
      };
      return;
    }
  } */
  if (value == 3) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };

    if (selectedDelivery.value == null) {
      snackbar.value = true;
      message.value = {
        text: "Please Select Delivery Options",
        color: "error",
      };
      return;
    }

    if (authToken == "null") {
      snackbar.value = true;
      message.value = {
        text: "Please Signup or Login to Continue",
        color: "error",
      };
      return;
    }
  }
  step.value = value;
};

const addresses = ref([]);
const selectedAddress = ref(null);
const addressesOptions = computed(() => {
  return addresses.value.map((address) => ({
    value: address.ga_id,
    full_address: address.full_address,
    main_address: address.main_address,
    landmark: address.landmark,
    location_name: address.location_name,
    primary_address: address.primary_address,
  }));
});
const addressExpanded = ref({});
const toggleAddressDetails = (ga_id) => {
  if (
    Object.keys(addressExpanded.value).find(
      (key) => addressExpanded.value[key] === true,
    ) != ga_id
  ) {
    addressExpanded.value[
      Object.keys(addressExpanded.value).find(
        (key) => addressExpanded.value[key] === true,
      )
    ] = false; // close other opened details
  }
  addressExpanded.value[ga_id] = !addressExpanded.value[ga_id]; // Toggle true/false
};
const getAddress = async () => {

  try {
    const response = await axios.get(`/get-address`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Pastikan `data` adalah array sebelum menggunakannya
    const data = response.data?.data;
    addresses.value = Array.isArray(data) ? data : [];

    // Cari alamat utama (primary address)
    // const primaryAddressIndex = addresses.value.findIndex(
    //   (address) => address.primary_address,
    // );
    // const primaryAddress = addresses.value.find(
    //   (address) => address.primary_address,
    // );

    /* if (primaryAddress) {
      // Hanya memindahkan alamat utama ke urutan pertama jika ditemukan
      addresses.value.splice(primaryAddressIndex, 1);
      addresses.value.unshift(primaryAddress);

      // Set `selectedAddress` dengan `ga_id` dari alamat utama
      selectedAddress.value = primaryAddress.ga_id ?? null;

      // Pastikan `primaryAddress.ga_id` ada sebelum mengaksesnya
      if (primaryAddress.ga_id) {
        addressExpanded.value[primaryAddress.ga_id] = true;
      }
    } else {
      selectedAddress.value = null; // Jika tidak ada primary address, set null
    } */
    selectedAddress.value = null;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

const isLoading = computed(() => {
  return store.state.isLoading;
})

const savingAddress = ref(false);
const saveAddress = async () => {
  savingAddress.value = true;
  try {
    if(!isEditAddressForm.value) {
      const response = await axios.post(`/save-address`, addressForm, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // ✅ Push the new address into `addresses.value`
      addresses.value.unshift(response.data.data); // Ensure `addresses` is a reactive array
      // const primaryAddressIndex = addresses.value.findIndex(address => address.primary_address)
      selectedAddress.value = response.data.data.ga_id;
      toggleAddressDetails(response.data.data.ga_id);
      addresses.value = addresses.value.map((address) => ({
        ...address,
        // primary_address: address.ga_id === selectedAddress.value,
      }));

      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    }
    else {
      console.log('isEditAddressForm', addressForm);
      const response = await axios.put(`/update-address/`+addressID.value, addressForm, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      getAddress();
      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    }
    // ✅ Optionally, reset form after successful save
    resetForm();
    isEditAddressForm.value = false
    addressDialog.value = false;
  }
  catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  } finally {
    savingAddress.value = false;
  }
};

const taxAmount = ref(null);
const getTaxAmount = async () => {
  let data = null;

  try {
    await axios
      .get(`/gypsy-user`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((response) => {
        data = response.data.data["country_current"];
      })
      .catch((_) => {});

    const response = await axios.get(`/get-tax-amount`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        country_id:
          parseInt(props.selectedLocation) != null
            ? parseInt(props.selectedLocation)
            : data,
      },
    });
    if (response.data.data["applicable"] === "Y") {
      taxAmount.value = response.data.data["tax_rate"];
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

const platformFee = ref(null);

const getCartData = async () => {
  await store.dispatch('getCartItems')
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
        data = response.data.data["app_id"];
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

    platformFee.value = parseFloat(response.data.data["platform_fee"]);
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

onMounted(() => {
  if (authToken && authToken != null && authToken != "" && authToken != "null") {
    getTaxAmount();
    getAddress();
    getPlatformFee();
    getCartData();
  }
  getDeliveryCharges();
});
</script>
