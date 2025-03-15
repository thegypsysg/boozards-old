<template>

    <v-snackbar v-model="snackbar" :timeout="2000" :color="message.color">
        {{ message.text }}
        <template #actions>
            <v-btn icon="mdi-close-circle"  @click="snackbar = false"></v-btn>
        </template>
    </v-snackbar>

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
                                        <span class="text-blue">S${{ (subTotal + selectedDeliveryPrice + platformFee + ((subTotal + selectedDeliveryPrice + 0.5) * taxAmount / 100)).toFixed(2) }}</span>
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
                            <div class="d-flex align-center px-3 py-1">
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
                                <v-btn prepend-icon="mdi-arrow-left"  @click="step = 1" color="grey" variant="flat">Back</v-btn>
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
                                <div class="d-flex flex-column">
                                    <span>Where To Deliver . ?</span>
                                    <!-- <span class="text-caption text-red">You do not have any Delivery Address in your List .</span> -->
                                </div>
                                <v-btn prepend-icon="mdi-arrow-left"  @click="step = 2" color="grey" variant="flat">Back</v-btn>
                            </div>
                            <v-alert v-show="addresses.length == 0" class="p-0" border="top" type="warning" variant="outlined" text="You do not have any Delivery Address in your List." ></v-alert>
                            <div class="pt-5">
                                <v-btn @click="addressDialog = true" prepend-icon="mdi-plus-circle" color="primary" variant="flat" size="large" block>Add New</v-btn>
                                <v-dialog
                                    v-model="addressDialog"
                                    max-width="500"
                                    >
                                    <v-card>
                                        <div class="d-flex align-center justify-space-between pa-4 border-b">
                                            <div><strong>This Would Be Your Primary Address</strong></div>
                                            <div>
                                                <v-icon @click="addressDialog = false">mdi-close-circle</v-icon>
                                            </div>
                                        </div>
                                        <div class="pa-5 d-flex flex-column ga-3">
                                            <div>
                                                <MazInput ref="streetRef" v-model="addressForm.main_address"  placeholder="Type Your Street Address" />
                                            </div>
                                           <div>
                                                <MazTextarea
                                                    v-model="addressForm.full_address"
                                                    placeholder="Your Full Address"
                                                />
                                           </div>
                                           <div>
                                            <MazTextarea
                                                    v-model="addressForm.landmark"
                                                    placeholder="Any Landmarks"
                                                />
                                            </div> 
                                            <div>
                                                <MazInput v-model="addressForm.location_name"  placeholder="Name Your Location" />
                                                <small class="text-muted text-caption">e.g Home, Office</small>
                                            </div>
                                            <div>
                                                <v-btn @click="saveAddress()" :loading="savingAddress"
                                                :disabled="savingAddress" color="primary" variant="flat" size="large" block>Save</v-btn>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-dialog>
                            </div>
                            <MazRadioButtons
                                    v-slot="{ option, selected }"
                                    v-model="selectedAddress"
                                    @update:model-value="(ga_id) => {toggleAddressDetails(ga_id)}"
                                    @click="toggleAddressDetails(ga_id)"
                                    :options="addressesOptions"
                                    orientation="col | row"
                                    :selector="true"
                                    color="info"
                                    block
                                    class="pt-5"
                                >
                                <div >
                                    <div class="d-flex align-center justify-space-between ma-2">
                                        <strong>{{ option.location_name }}</strong>
                                        <v-icon class="cursor-pointer">
                                            {{ addressExpanded[option.value] ? 'mdi-menu-up' : 'mdi-menu-down' }}
                                        </v-icon>
                                    </div>
                                    <div v-if="addressExpanded[option.value]" class="d-flex flex-column ma-2">
                                        <div class="d-flex justify-space-between">
                                            <div class="flex-grow-1">
                                                {{ option.full_address }}
                                            </div>
                                            <div v-show="option.primary_address" class="text-caption">
                                                <strong>Primary</strong>
                                            </div>
                                        </div>
                                        <p v-if="option.landmark" class="text-red-darken-4 font-weight-bold">
                                            {{ option.landmark }}
                                        </p>
                                    </div>
                                </div>
                            </MazRadioButtons>
                        </v-col>
                        <v-col v-if="step == 4"  class="pa-5">
                            <div class="my-3 text-h6 d-flex justify-space-between">
                                <span>Payment Options</span>
                                <v-btn prepend-icon="mdi-arrow-left"  @click="step = 3" color="grey" variant="flat">Back</v-btn>
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
                        <v-btn v-if="step == 1" @click="nextStep(2)" color="#ff9800" variant="flat"  size="large" >Delivery Options</v-btn>
                        <v-btn v-else-if="step == 2" @click="nextStep(3)"  color="#ff9800" variant="flat"   size="large">Where to Deliver. ?</v-btn>
                        <v-btn v-else-if="step == 3" @click="nextStep(4)"  color="#ff9800" variant="flat"   size="large" >Proceed to Pay</v-btn>
                        <v-btn v-else-if="step == 4"  color="#ff9800" variant="flat"  size="large">Pay Now</v-btn>
                        <div>
                            <v-icon @click="summaryDialog = true" size="40">
                                <v-img
                                    src="@/assets/images/billing.png"
                                    alt="Billing Summary"
                                />
                            </v-icon>
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
                                                <td class="text-end">{{ platformFee.toFixed(2) }}</td>
                                                </tr>
                                                <tr>
                                                <td>G.S.T {{ taxAmount != null ? '(' + taxAmount + '%)' : '(Not Applicable)' }} </td>
                                                <td>S$</td>
                                                <td class="text-end">{{ taxAmount != null ? (subTotal + selectedDeliveryPrice + 0.5) * taxAmount / 100 : '0.00' }}</td>
                                                </tr>
                                                <tr class="total-row">
                                                <td><strong>This is what you pay</strong></td>
                                                <td><strong>S$</strong></td>
                                                <td class="text-end"><strong>{{ (subTotal + selectedDeliveryPrice + platformFee + ((subTotal + selectedDeliveryPrice + 0.5) * taxAmount / 100)).toFixed(2) }}</strong></td>
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

.pac-container {
  z-index: 99999 !important; /* Ensure autocomplete appears above modal */
}

@media (max-width: 768px) {
    .product-name {
        width: 45vw!important; 
    }
}

</style>

<script setup>
    import { ref, reactive, watch, computed, defineProps, defineEmits, onMounted, nextTick } from "vue";
    import axios from "@/util/axios";
    import { useStore } from "vuex";
    import MazDrawer from "maz-ui/components/MazDrawer";
    import MazInput from "maz-ui/components/MazInput";
    import MazTextarea from "maz-ui/components/MazTextarea";
    import MazRadioButtons from "maz-ui/components/MazRadioButtons";
    import { Loader } from '@googlemaps/js-api-loader';
import { number } from "maz-ui";

    const props = defineProps({
        viewCart: Boolean,
        selectedLocation: String,
    });
    
    watch(props.selectedLocation, async (location, oldLocation) => {
        console.log("props" + props.selectedLocation)
        console.log("UpdateUpdate")
        await getTaxAmount();
    })

    const emit = defineEmits(["update:viewCart"]);
    const store = useStore();

    const step = ref(1);
    const snackbar = ref(false);
    const message = ref({
        text: "",
        color: "success",
    });
    const addressForm = ref({
        main_address: null,
        full_address: null,
        landmark: null,
        location_name: "",
    });
    const addressDialog = ref(false);
    const summaryDialog = ref(false);
    const selectedDelivery = ref(null);
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

    let autocomplete;
    const streetRef = ref(null); 
    const initAutocomplete = async () => {

        const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const loader = new Loader({
            apiKey: googleMapsApiKey, // Replace with your actual API key
            libraries: ['places'],
        });

        await loader.load();

        nextTick(() => {
            if (streetRef.value) {
            console.log('Initializing autocomplete on:', streetRef.value);


            const nativeInput = streetRef.value.$el.querySelector('input');
            if (!nativeInput) {
                console.error('❌ Could not find the actual input inside MazInput!');
                return;
            }

            autocomplete = new google.maps.places.Autocomplete(nativeInput, {
                componentRestrictions: { country: 'SG' }, // Singapore only
                types: ['address'],
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                console.log('Selected Place:', place.formatted_address);
                addressForm.value.main_address = place.formatted_address;
                }
            });
            } else {
            console.error('Invalid input element:', streetRef.value);
            }
        });
    };


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
        }
    );


    // Get cart items
    const cart = computed(() => store.state.cart);

    // Get total quantity of all cart items
    const cartQuantity = computed(() => store.state.cart.reduce((total, item) => total + item.quantity, 0));

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

    const nextStep = (value) => {

        

        if(value == 3){

            snackbar.value = false;
            message.value = {
                text: "",
                color: "success"
            };

            if(selectedDelivery.value == null){
                snackbar.value = true;
                message.value = {
                    text: "Please Select Delivery Options",
                    color: "error"
                };
                return;
            }
            
            const token = localStorage.getItem("token");
            if(token == 'null'){
                snackbar.value = true;
                message.value = {
                    text: "Please Signup or Login to Continue",
                    color: "error"
                };
                return;
            }
        }
        
        step.value = value
    };
    
    const addresses = ref([]); 
    const selectedAddress = ref(null);
    const addressesOptions = computed(() => {
        return addresses.value.map(address => ({
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
        if (Object.keys(addressExpanded.value).find(key => addressExpanded.value[key] === true) != ga_id) {
            addressExpanded.value[Object.keys(addressExpanded.value).find(key => addressExpanded.value[key] === true)] = false; // close other opened details
        }
        addressExpanded.value[ga_id] = !addressExpanded.value[ga_id]; // Toggle true/false
    };  
    const getAddress = async () => {
        const token = localStorage.getItem("token");

        await axios.get(`/get-address`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            // ✅ Ensure `data` contains an array before assigning
            const data = response.data.data; // Make sure it's `.data.data` based on your API response
            addresses.value = Array.isArray(data) ? data : [];
            // get primaryAddressIndex and assign them as selected
            const primaryAddressIndex = addresses.value.findIndex(address => address.primary_address)
            const primaryAddress = addresses.value.find(address => address.primary_address)
            addresses.value.splice(primaryAddressIndex, 1)
            addresses.value.unshift(primaryAddress)
            selectedAddress.value =  addresses.value.find(address => address.primary_address)?.ga_id || null;
            addressExpanded.value[primaryAddress['ga_id']] = true
            console.log("selected address: "+ selectedAddress.value)
        })
        .catch((error) => {
            console.error("Error fetching addresses:", error);
            //alert(error.response?.data?.message || "Something went wrong!");
        });
    };
    
    const savingAddress = ref(false);
    const saveAddress = async () => {
        savingAddress.value = true;
        const token = localStorage.getItem("token");
        
        try {
            const response = await axios.post(`/save-address`, addressForm.value, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // Handle success response
            console.log(response.data);
            
            // ✅ Push the new address into `addresses.value`
            addresses.value.unshift(response.data.data);  // Ensure `addresses` is a reactive array
            // const primaryAddressIndex = addresses.value.findIndex(address => address.primary_address)
            selectedAddress.value = response.data.data.ga_id;
            toggleAddressDetails(response.data.data.ga_id);
            addresses.value = addresses.value.map(address => ({
                ...address,
                primary_address: address.ga_id === selectedAddress.value
            }));

            // ✅ Optionally, reset form after successful save
            addressForm.value = {
                main_address: "",
                full_address: "",
                landmark: "",
                location_name: "",
            };

            snackbar.value = true;
            message.value = {
                text: response.data.message,
                color: "success"
            };

            addressDialog.value = false;
            
        } catch (error) {
            console.error("Error saving address:", error);
            const message = error.response?.data?.message || "Something went wrong!";
            snackbar.value = true;
            message.value = {
                text: message,
                color: "error"
            };

        } finally {
            savingAddress.value = false;
        }
    };

    const taxAmount = ref(null);
    const getTaxAmount = async () => {
        const token = localStorage.getItem("token");
        let data = null;
        
        try {
            await axios.get(`/gypsy-user`, {headers: {Authorization: `Bearer ${token}`,},})
            .then((response) => {
                data = response.data.data['country_current'];
            })
        .catch((_) => {
        })
        
        const response = await axios.get(`/get-tax-amount`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                'country_id': parseInt(props.selectedLocation) != null ? parseInt(props.selectedLocation) : data
            }
        });
            if (response.data.data['applicable'] === 'Y') {
                taxAmount.value = response.data.data['tax_rate']
            }
        } catch(error) {
          // eslint-disable-next-line
          console.log(error);
        }
    }; 

    const platformFee = ref(null);  
    const getPlatformFee = async () => {
        const token = localStorage.getItem("token");
        let data = null;
        
        try {
            await axios.get(`/get-app-id`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    'company_name': "Boozards"
                }
            })
            .then((response) => {
                data = response.data.data['app_id'];
            })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        
        const response = await axios.get(`/get-platform-fee`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                'app_id': data
            }
        });
        
        platformFee.value = parseFloat(response.data.data['platform_fee'])
        
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
        const token = localStorage.getItem("token");
        if (token && token != null && token != "" && token != "null") {
            getTaxAmount();
            getAddress();
            getPlatformFee();
        }
    });
</script>