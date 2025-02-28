<template>
    <div class="fixed-footer">
        <v-container>
            <div class="d-flex align-center justify-space-between">
                <div @click="viewCart = true">
                    <v-badge :content="cartQuantity" color="red" offset-x="10" offset-y="10">
                        <v-icon size="45">mdi mdi-cart-variant</v-icon>
                    </v-badge>
                </div>
                <div class="text-h5">
                   <strong>S{{ cartTotal }}</strong>
                </div>
            </div>
        </v-container>
        <Cart :viewCart="viewCart" @update:viewCart="viewCart = $event"/>
    </div>
</template>

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

<script setup>
import { ref,computed } from "vue";
import { useStore } from "vuex";
import Cart from "@/components/Cart.vue";

const store = useStore();
const viewCart = ref(false);

// Get total quantity of all cart items
const cartQuantity = computed(() => {
  return store.state.cart.reduce((total, item) => total + item.quantity, 0);
});

// Get total price of all cart items
const cartTotal = computed(() => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(store.state.cart.reduce((total, item) => total + item.price * item.quantity, 0))
});
</script>