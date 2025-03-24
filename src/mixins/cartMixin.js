import { mapState, mapMutations } from "vuex";
import { fileURL } from "@/main";

export default {
  computed: {
    ...mapState(["cart"]), // Get cart from Vuex state
  },
  methods: {
    getSelectedRange(product) {
      return product.rangeItems.find((range) => range.selected?.value);
    },
    
    isInCart(product, selectedRange = null) {
      if(selectedRange == null){
        const selectedRange = this.getSelectedRange(product);
        if (!selectedRange) return false;
      }
      
      return this.cart.some(
        (item) => item.id === product.product_id && item.range_id === selectedRange.range_id
      );
    },

    cartQuantity(product, selectedRange = null) {
      if(selectedRange == null){
        const selectedRange = this.getSelectedRange(product);
        if (!selectedRange) return 0;
      }

      const item = this.cart.find(
        (item) => item.id === product.product_id && item.range_id === selectedRange.range_id
      );
      return item ? item.quantity : 0;
    },

    addToCart(product, selectedRange = null) {
      if(selectedRange == null){
        const selectedRange = this.getSelectedRange(product);
        if (!selectedRange) {
          console.warn("No selected range found for product:", product);
          return;
        }
      }

      const data = {
        id: product.product_id,
        range_id: selectedRange.range_id,
        quantity_name: selectedRange.quantity?.quantity_name ?? "N/A",
        name: product.product_name,
        // image: fileURL + (product?.selectedImage?.value ?? ""),
        image: fileURL + (product?.image ?? ""),  // The previous image was not showing/uploading 
        price: product?.selectedPrice?.value ?? selectedRange?.price_list?.rate,
      };

      this.$store.commit("addToCart", data);
    },

    increaseQuantity(product, selectedRange = null) {
      if(selectedRange == null){
        const selectedRange = this.getSelectedRange(product);
        if (!selectedRange) return;
      }

      this.$store.commit("updateCartQuantity", {
        product_id: product.product_id,
        range_id: selectedRange.range_id,
        change: 1,
      });
    },

    decreaseQuantity(product, selectedRange = null) {
      if(selectedRange == null){
        const selectedRange = this.getSelectedRange(product);
        if (!selectedRange) return;
      }

      this.$store.commit("updateCartQuantity", {
        product_id: product.product_id,
        range_id: selectedRange.range_id,
        change: -1,
      });
    },
  },
};