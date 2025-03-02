<template>
    <MazDrawer variant="right" :model-value="viewCart" @update:model-value="emit('update:viewCart', $event)" class="no-header">
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
                                        <span class="text-blue">S{{ cartTotal }}</span>
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
                        <v-col  v-if="step == 1" v-for="(product, index) in cart" :key="index">
                            <div class="d-flex align-center px-3">
                                <div class="flex-grow-0 flex-shrink-0">
                                    <v-img class="rounded bg-white" :src="product.image" width="65" height="65" cover>
                                        <template v-slot:placeholder>
                                            <div class="d-flex align-center justify-center fill-height">
                                                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                            </div>
                                        </template>
                                    </v-img>
                                </div>
                                <div class="flex-grow-1 flex-shrink-0 ml-1 pa-2">
                                    <div class="d-flex align-center justify-space-between">
                                        <div class="text-wrap product-name text-body-2">
                                            {{ product.name }} <span class="text-blue">{{ product.quantity_name }}</span>
                                        </div>
                                        <div class="text-body-2 text-end"><strong>S{{ formatCurrency(product.price * product.quantity) }}</strong></div>
                                    </div>
                                    <div class="d-flex align-center justify-space-between">
                                        <div class="d-flex align-center ga-3 border">
                                            <v-btn size="xs" color="black" class="text-caption pa-1 rounded-0" variant="flat" icon 
                                                @click="handleUpdateQuantity(product.id, product.range_id, -1)">
                                                <v-icon>mdi-minus</v-icon>
                                            </v-btn>
                                            <span class="text-body-2">{{ product.quantity }}</span>
                                            <v-btn size="xs" color="black" class="text-caption pa-1 rounded-0" variant="flat" icon 
                                                @click="handleUpdateQuantity(product.id, product.range_id, 1)">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </div>
                                        <div class="text-body-2"><strong class=" text-red">S{{ formatCurrency(product.price) }}</strong></div>
                                        <div>
                                            <v-btn @click="handleRemoveFromCart(product.id, product.range_id)" color="red" icon="mdi-trash-can" size="x-small"></v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col v-if="step == 2" class="pa-5">
                            <div class="my-3 text-h6 d-flex justify-space-between">
                                <span>Delivery Options</span>
                                <v-btn @click="step = 1" color="grey" variant="flat"><v-icon>mdi-arrow-left</v-icon> Back</v-btn>
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
                                >
                                <div class="d-flex justify-space-between ma-2">
                                    <strong>{{ option.label }}</strong>
                                    <span class="price">S$ {{ option.price }}</span>
                                </div>
                            </MazRadioButtons>
                        </v-col>
                        <v-col v-if="step == 3"  class="pa-5">
                            <div class="my-3 text-h6 d-flex justify-space-between">
                                <span>Payment Options</span>
                                <v-btn @click="step = 2" color="grey" variant="flat"><v-icon>mdi-arrow-left</v-icon> Back</v-btn>
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
                        <v-btn v-if="step == 1" @click="step = 2" color="#ff9800" variant="flat"  size="large" >Delivery Options</v-btn>
                        <v-btn v-else-if="step == 2" @click="step = 3"  color="#ff9800" variant="flat"   size="large" >Proceed to Pay</v-btn>
                        <v-btn v-else-if="step == 3"  color="#ff9800" variant="flat"  size="large">Pay Now</v-btn>
                        <div>
                            <v-icon @click="summaryDialog = true" color="blue">mdi-notebook</v-icon>
                            <v-dialog
                                v-model="summaryDialog"
                                max-width="500"
                                >
                                <v-card>
                                    <div class="d-flex align-center justify-space-between pa-4 border-b">
                                        <div><strong>Billing Summary</strong></div>
                                        <div>
                                            <v-icon @click="summaryDialog = false">mdi-close-circle</v-icon>
                                        </div>
                                    </div>
                                        <v-table class="custom-table">
                                            <tbody>
                                                <tr>
                                                <td>Sub Total</td>
                                                <td>S$</td>
                                                <td class="text-end">{{ subTotal.toFixed(2) }}</td>
                                                </tr>
                                                <tr>
                                                <td>Delivery Charges</td>
                                                <td>S$</td>
                                                <td class="text-end">{{ selectedDeliveryPrice.toFixed(2) }}</td>
                                                </tr>
                                                <tr>
                                                <td>Platform Fee</td>
                                                <td>S$</td>
                                                <td class="text-end">0.50</td>
                                                </tr>
                                                <tr>
                                                <td>G.S.T</td>
                                                <td>S$</td>
                                                <td class="text-end">0.00</td>
                                                </tr>
                                                <tr class="total-row">
                                                <td><strong>This is what you pay</strong></td>
                                                <td><strong>S$</strong></td>
                                                <td class="text-end"><strong>{{ (subTotal + selectedDeliveryPrice + 0.50).toFixed(2) }}</strong></td>
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
</template>


<style>

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
    height: 100dvh!important;
    min-height: 100dvh!important;
}

.no-header .m-drawer-content-wrap {
    min-height: 100dvh!important;
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
    border: 1px solid #00aaff!important;
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

@media (max-width: 768px) {
    .product-name {
        width: 45vw!important; 
    }
}

</style>

<script setup>
    import { ref, watch, computed, defineProps, defineEmits } from "vue";
    import { useStore } from "vuex";
    import MazDrawer from "maz-ui/components/MazDrawer";
    import MazRadioButtons from "maz-ui/components/MazRadioButtons";

    const props = defineProps({
        viewCart: Boolean,
    });

    const emit = defineEmits(["update:viewCart"]);
    const store = useStore();

    const step = ref(1);
    const summaryDialog = ref(false);
    const selectedDelivery = ref("standard");
    const deliveryOptions = ref([
        { label: "Standard Delivery Fee", value: "standard", price: 12.0 },
        { label: "Express (1.5 Hours)", value: "express", price: 15.0 },
        { label: "Super Express (3 Hours)", value: "super_express", price: 25.0 },
    ]);
    const selectedDeliveryPrice = computed(() => {
        const option = deliveryOptions.value.find(opt => opt.value === selectedDelivery.value);
        return option ? option.price : 0;
    });
    const selectedPaymentMethod = ref("creditcard");
    const paymentOptions = ref([
        { label: "Credit Card", value: "creditcard"},
        { label: "Cash On Deliver (COD)", value: "cod"},
        { label: "Pay Now", value: "paynow"},
        { label: "Google Pay", value: "gpay"},
    ]);


    watch(
        () => props.viewCart, // Watch for changes in viewCart prop
        (newValue) => {
            if (newValue) {
            step.value = 1; // Set step to 1 when viewCart changes
            }
        }
    );

    // Get cart items
    const cart = computed(() => store.state.cart);

    // Get total quantity of all cart items
    const cartQuantity = computed(() => store.state.cart.reduce((total, item) => total + item.quantity, 0));

    // Get total price of all cart items
    const cartTotal = computed(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(store.state.cart.reduce((total, item) => total + item.price * item.quantity, 0)));

    const subTotal = computed(() => store.state.cart.reduce((total, item) => total + item.price * item.quantity, 0));
    

    const formatCurrency = (amount) =>  new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

    // Update quantity function
    const handleUpdateQuantity = (product_id, range_id, change) => {
        store.commit("updateCartQuantity", { product_id, range_id, change });
    };

    // Remove item from cart
    const handleRemoveFromCart = (product_id, range_id) => {
        store.commit("removeFromCart", { product_id, range_id });
    };

    const nextStep = (step) => {
        step.value = step
    };
</script>