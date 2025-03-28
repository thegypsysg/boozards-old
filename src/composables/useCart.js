import { computed } from "vue";
import { useStore } from "vuex";
import { fileURL } from "@/main";

export function useCart() {
    const store = useStore();
    const cart = computed(() => store.state.cart);

    const getSelectedRange = (product) => {
        return product.rangeItems.find((range) => range.selected?.value);
    };

    const isInCart = (product, selectedRange = null) => {
        if(selectedRange == null){
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
        }
       
        return cart.value.some(
            (item) => item.id === product.product_id && item.range_id === selectedRange?.range_id
        );
    };

    const cartQuantity = (product, selectedRange = null) => {
        if(selectedRange == null){
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
          }

        const item = cart.value.find(
            (item) => item.id === product.product_id && item.range_id === selectedRange.range_id
        );
        return item ? item.quantity : 0;
    };

    const addToCart = (product, selectedRange = null) => {

        if(selectedRange == null){
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
        }

        const data = {
            id: product.product_id,
            range_id: selectedRange?.range_id,
            quantity_name: selectedRange?.quantity?.quantity_name ?? "N/A",
            name: product.product_name,
            image: fileURL + (product?.image ?? ""),
            price: product?.selectedPrice?.value ? product?.selectedPrice?.value : selectedRange?.price_list?.rate ? selectedRange?.price_list?.rate : 0,
        };

        console.log(data)

        store.commit("addToCart", data);
    };

    const updateQuantity = (product, selectedRange, change) => {
        if(selectedRange == null){
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
          }

        store.commit("updateCartQuantity", {
            product_id: product.product_id,
            range_id: selectedRange?.range_id,
            change,
        });
    };

    const increaseQuantity = (product, range = null) => updateQuantity(product, range, 1);
    const decreaseQuantity = (product, range = null) => updateQuantity(product, range, -1);

    return { isInCart, cartQuantity, addToCart, increaseQuantity, decreaseQuantity };
}