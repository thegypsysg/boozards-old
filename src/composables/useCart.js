import { computed } from "vue";
import { useStore } from "vuex";
import { fileURL } from "@/main";

export function useCart() {
    const store = useStore();
    const cart = computed(() => store.state.cart);

    const getSelectedRange = (product) => {
        return product.rangeItems.find((range) => range.selected?.value);
    };

    const isInCart = (product) => {
        const selectedRange = getSelectedRange(product);
        if (!selectedRange) return false;

        return cart.value.some(
            (item) => item.id === product.product_id && item.range_id === selectedRange.range_id
        );
    };

    const cartQuantity = (product) => {
        const selectedRange = getSelectedRange(product);
        if (!selectedRange) return 0;

        const item = cart.value.find(
            (item) => item.id === product.product_id && item.range_id === selectedRange.range_id
        );
        return item ? item.quantity : 0;
    };

    const addToCart = (product) => {
        const selectedRange = getSelectedRange(product);
        if (!selectedRange) {
            console.warn("No selected range found for product:", product);
            return;
        }

        const data = {
            id: product.product_id,
            range_id: selectedRange.range_id,
            quantity_name: selectedRange.quantity?.quantity_name ?? "N/A",
            name: product.product_name,
            image: fileURL + (product?.selectedImage?.value ?? ""),
            price: product?.selectedPrice?.value ?? 0,
        };

        store.commit("addToCart", data);
    };

    const updateQuantity = (product, change) => {
        const selectedRange = getSelectedRange(product);
        if (!selectedRange) return;

        store.commit("updateCartQuantity", {
            product_id: product.product_id,
            range_id: selectedRange.range_id,
            change,
        });
    };

    const increaseQuantity = (product) => updateQuantity(product, 1);
    const decreaseQuantity = (product) => updateQuantity(product, -1);

    return { isInCart, cartQuantity, addToCart, increaseQuantity, decreaseQuantity };
}