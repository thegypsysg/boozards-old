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
        return product.rangeItems.find((range) => range.selected?.value);
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
            quantity_name: selectedRange?.quantity?.quantity_name ?? "N/A",
            name: product.product_name,
            image: fileURL + (product?.image ?? ""),
            price: product?.selectedPrice?.value ? product?.selectedPrice?.value : selectedRange?.price_list?.rate ? selectedRange?.price_list?.rate : 0,
        };

        console.log({cartMasterData})
        store.dispatch('addToCart', cartMasterData)

        /* if(selectedRange == null){
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

        store.commit("addToCart", data); */
    };

    const updateQuantity = (product, selectedRange, change) => {
        /* if(selectedRange == null) {
            selectedRange = getSelectedRange(product);
            if (selectedRange == null) return false;
        } */

          store.dispatch('updateCart', product, selectedRange, change)

        /* store.commit("updateCartQuantity", {
            product_id: product.product_id,
            range_id: selectedRange?.range_id,
            change,
        }); */
    };

    const increaseQuantity = (product, range = null) => updateQuantity(product, range, 1);
    const decreaseQuantity = (product, range = null) => updateQuantity(product, range, -1);

    return { isInCart, cartQuantity, addToCart, increaseQuantity, decreaseQuantity };
}