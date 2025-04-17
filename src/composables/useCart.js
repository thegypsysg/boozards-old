import { computed } from "vue";
import { useStore } from "vuex";
import { fileURL } from "@/main";
import { ref } from "vue";
import axios from "@/util/axios";
const authToken = localStorage.getItem("token");

export function useCart() {
    const store = useStore();
    const cart = computed(() => store.state.cart);

    const getSelectedRange = (product) => {
      return product.rangeItems ? product.rangeItems.find((range) => range.selected?.value) : product.ranges.find((range) => range.selected?.value);
    };

    const platformFee = ref(null);
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
        console.log({product})
        getPlatformFee()
        getTaxAmount()
        if(selectedRange == null) {
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
        }

        const cartMasterData = {
            app_id: 3,
            platform_fee: platformFee.value,
            gst: taxAmount.value,
            order_status: 'PP',
            rate: product?.selectedPrice?.value ? product?.selectedPrice?.value : selectedRange?.price_list?.rate ? selectedRange?.price_list?.rate : 0,
            qty: 1,
            id: product.product_id,
            range_id: selectedRange?.range_id,
            pq_id: selectedRange?.quantity?.pq_id ?? "N/A",
            quantity_name: selectedRange?.quantity?.quantity_name ?? "N/A",
            name: product.product_name,
            image: fileURL + (product?.image ?? ""),
            price: product?.selectedPrice?.value ? product?.selectedPrice?.value : selectedRange?.price_list?.rate ? selectedRange?.price_list?.rate : 0,
        };

        console.log({cartMasterData})
        store.dispatch('addToCart', cartMasterData)
    };

    const findSimilarItems = (cart, product) => {
      const similarItems = [];
      cart.forEach(item => {
        if (product.product_name.includes(item.name)) {
          const matchingRange = product.ranges.find(range => range.range_id === item.range_id);
          if (matchingRange) {
            similarItems.push({
              cart_id: item.cart_id,
              range_id: item.range_id,
              price: item.price,
            });
          }
        }
      });
    
      return similarItems;
    }

    const updateQuantity = (product, change, selectedRange = null) => {
      console.log('cartMasterData product', product);
      const cartItems = product.ranges ? findSimilarItems(cart.value, product) : product;
      console.log('cartMasterData', cartItems)

      const cartMasterData = {
        change: change,
        cart_id: Array.isArray(cartItems) ? cartItems[0].cart_id : cartItems.cart_id,
        range_id: Array.isArray(cartItems) ? cartItems[0].range_id : cartItems.range_id,
        price: Array.isArray(cartItems) ? cartItems[0].price : cartItems.price,
        quantity: 1,
      }
      console.log('cartMasterData', cartMasterData);
      store.dispatch('updateCart', cartMasterData)
    };

    const increaseQuantity = (product, range = null) => updateQuantity(product, range, 1);
    const decreaseQuantity = (product, range = null) => updateQuantity(product, range, -1);

    return { isInCart, updateQuantity, cartQuantity, addToCart, increaseQuantity, decreaseQuantity };
}