<template>
    <MazDrawer variant="right" :model-value="viewCart" @update:model-value="emit('update:viewCart', $event)" class="no-header">
        <template #default="{ close }">
            <!-- <v-row class="d-flex flex-column" no-gutters>
                <v-col cols="12" sm="12" md="12" lg="12">
                    <v-sheet>
                        <div class="d-flex align-center justify-space-between pa-2 ma-1">
                        <div class="text-h6">Your Cart</div>
                        <div class="text-h6" v-show="cartQuantity > 0">
                            <span class="text-red">{{ cartQuantity }}</span> Items | <span class="text-blue">{{ cartTotal }}</span>
                        </div>
                        <div>
                            <v-btn @click="close" icon="mdi-close-circle"></v-btn>
                        </div>
                        </div>
                    </v-sheet>
                </v-col>
                <v-col
                v-for="(product, index) in cart" :key="index"
                cols="12"
                >
                    <div class="d-flex align-center pa-2">
                    <div class="flex-grow-0 flex-shrink-0">

                        <v-img
                        class="rounded bg-white"
                        :src="product.image"
                        :lazy-src="product.image"
                        width="75"
                        height="75"
                        cover
                        >
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                                color="grey-lighten-4"
                                indeterminate
                            ></v-progress-circular>
                            </div>
                        </template>
                        </v-img>

                        <v-img
                        
                        ></v-img>
                    </div>
                    <div class="flex-grow-1 flex-shrink-0 ml-3 pa-2">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex flex-column">
                                <span class="text-wrap text-body-2"> {{ product.name }}</span>
                                <div>
                                    <v-btn
                                        size="xs"
                                        color="black"
                                        class="text-caption pa-1 bordered"
                                        variant="flat"
                                    >
                                    {{ product.quantity_name }}
                                    </v-btn>
                                </div>
                            </div>
                            <div><strong>S{{ formatCurrency(product.price * product.quantity) }}</strong></div>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center ga-3 border">
                            <v-btn
                            size="xs"
                            color="black"
                            class="text-caption pa-1 rounded-0"
                            variant="flat"
                            icon
                            @click="handleUpdateQuantity(product.id, product.range_id, -1)"
                            >
                            <v-icon>mdi-minus</v-icon>
                            </v-btn>

                            <span>
                            {{ product.quantity }}
                            </span>

                            <v-btn
                            size="xs"
                            color="black"
                            class="text-caption pa-1 rounded-0"
                            variant="flat"
                            icon
                            @click="handleUpdateQuantity(product.id, product.range_id, 1)"
                            >
                            <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <strong class="text-red">S{{ formatCurrency(product.price) }}</strong>
                        </div>
                        <div>
                            <v-btn @click="handleRemoveFromCart(product.id, product.range_id)" color="red" icon="mdi-trash-can" size="small"></v-btn>
                        </div>
                        </div>
                    </div>
                    </div>
                
                </v-col>
                <v-col class="mt-auto">
                    <v-btn class="bg-blue" block>Checkout</v-btn>
                </v-col>
            </v-row> -->
            <div class="fill-height d-flex flex-column">
            <!-- Cart Header -->
           <div class="flex-grow-0">
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

            <!-- Scrollable Cart Items -->
            <div class="cart-items flex-grow-1 overflow-y-auto">
                <v-row no-gutters>
                   
                    <v-col v-for="(product, index) in cart" :key="index" cols="12">
                        <div class="d-flex align-center px-3">
                            <div class="flex-grow-0 flex-shrink-0">
                                <v-img class="rounded bg-white" :src="product.image" width="75" height="75" cover>
                                    <template v-slot:placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                        </div>
                                    </template>
                                </v-img>
                            </div>
                            <div class="flex-grow-1 flex-shrink-0 ml-3 pa-2">
                                <div class="d-flex align-center justify-space-between">
                                    <div class="d-flex flex-column">
                                        <span class="text-wrap text-body-2">{{ product.name }}</span>
                                        <div>
                                            <v-btn size="xs" color="black" class="text-caption pa-1 bordered" variant="flat">
                                                {{ product.quantity_name }}
                                            </v-btn>
                                        </div>
                                    </div>
                                    <div><strong>S{{ formatCurrency(product.price * product.quantity) }}</strong></div>
                                </div>
                                <div class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center ga-3 border">
                                        <v-btn size="xs" color="black" class="text-caption pa-1 rounded-0" variant="flat" icon 
                                            @click="handleUpdateQuantity(product.id, product.range_id, -1)">
                                            <v-icon>mdi-minus</v-icon>
                                        </v-btn>
                                        <span>{{ product.quantity }}</span>
                                        <v-btn size="xs" color="black" class="text-caption pa-1 rounded-0" variant="flat" icon 
                                            @click="handleUpdateQuantity(product.id, product.range_id, 1)">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
                                    <div><strong class="text-red">S{{ formatCurrency(product.price) }}</strong></div>
                                    <div>
                                        <v-btn @click="handleRemoveFromCart(product.id, product.range_id)" color="red" icon="mdi-trash-can" size="small"></v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>

            <!-- Fixed Checkout Button -->
            <div class="checkout-container ">
                <v-btn @click="close" to="/checkout" class="bg-blue w-100 " rounded  size="large" block>Checkout</v-btn>
            </div>
        </div>
        </template>
    </MazDrawer>
</template>


<style>
.no-header .m-drawer-header {
  display: none !important;
}
.fill-height {
  height: 100%;
}
.cart-items {
  overflow-y: auto;
}
.checkout-container {
  position: sticky;
  bottom: 0;
  background: #ffff;
  padding: 20px;
  z-index: 10; /* Ensures it stays above other content */
}
</style>

<script setup>
    import { computed, defineProps, defineEmits } from "vue";
    import { useStore } from "vuex";
    import MazDrawer from "maz-ui/components/MazDrawer";

    const props = defineProps({
        viewCart: Boolean,
    });

    const emit = defineEmits(["update:viewCart"]);

    const store = useStore();

    // Get cart items
    const cart = computed(() => store.state.cart);

    // Get total quantity of all cart items
    const cartQuantity = computed(() => store.state.cart.reduce((total, item) => total + item.quantity, 0));

    // Get total price of all cart items
    const cartTotal = computed(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(store.state.cart.reduce((total, item) => total + item.price * item.quantity, 0)));

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
</script>