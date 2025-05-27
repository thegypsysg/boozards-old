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
                      {{ selectedCountry.currency_symbol }}
                      {{
                        (
                          subTotal +
                          selectedDeliveryPrice +
                          platformFee +
                          ((subTotal + selectedDeliveryPrice + 0.5) *
                            taxAmount) /
                            100
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
                    :src="fileURL + product.image"
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
                      <!-- <strong
                        >{{ selectedCountry?.currency_symbol }}
                      </strong> -->
                      <!-- S{{ formatCurrency(product.price * product.quantity) }} -->
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
                        @click="updateQuantity(product, 'decrease')"
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
                        @click="updateQuantity(product, 'increase')"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                    <div class="text-body-2">
                      <strong class="text-red">{{
                        selectedCountry?.currency_symbol
                      }}</strong>
                      <strong class="text-red">S{{ product.price }}</strong>
                    </div>
                    <div>
                      <v-btn
                        @click="handleRemoveFromCart(product)"
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
              <p class="text-red-darken-4 font-weight-bold">
                {{ currentTime }}
              </p>
              <MazRadioButtons
                v-slot="{ option, selected }"
                v-model="selectedDelivery"
                :options="
                  deliveryOptions.filter((item) => item.same_day == 'S')
                "
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class="pt-5"
                @update:model-value="onSelectDelivery"
              >
                <div class="d-flex justify-space-between ma-2">
                  <strong>{{ option.label }}</strong>
                  <span class="price"
                    >{{ selectedCountry.currency_symbol }}
                    {{ option?.price ? option.price.toFixed(2) : "" }}</span
                  >
                </div>
                <div class="d-flex justify-space-between ma-2">
                  <strong
                    v-if="option.cut_off"
                    class="text-red font-bold font-sm"
                    >Cut off Time ({{ option.cut_off }})</strong
                  >
                </div>
              </MazRadioButtons>
              <p class="font-weight-black mb-2 mt-6 text-center">
                === Advance Delivery Options ===
              </p>
              <MazRadioButtons
                v-slot="{ option, selected }"
                v-model="selectedDelivery"
                :options="
                  deliveryOptions.filter((item) => item.same_day == 'A')
                "
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class="pt-5"
                @update:model-value="onSelectDelivery"
              >
                <div class="d-flex justify-space-between ma-2">
                  <strong>{{ option.label }}</strong>
                  <span class="price"
                    >{{ selectedCountry.currency_symbol }}
                    {{ option?.price ? option.price.toFixed(2) : "" }}</span
                  >
                </div>
                <div class="d-flex justify-space-between ma-2">
                  <strong class="text-red font-bold font-sm">{{
                    option.description_2
                  }}</strong>
                </div>
              </MazRadioButtons>
            </v-col>
            <v-col v-if="step == 3" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span class="font-weight-bold text-blue-darken-2"
                  >Delivery Schedule</span
                >
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 2"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <p class="text-red-darken-4 font-weight-bold mt-2">
                {{ currentTime }}
              </p>
              <!-- <p class="font-weight-bold text-red-darken-4 mb-6">
                You Selected
              </p> -->
              <div style="border: 1.5px solid #daf4fd" class="px-4 py-3 my-4">
                <div class="d-flex justify-space-between mb-3">
                  <strong>{{ selectedDeliveryObject?.label }}</strong>
                  <span class="price"
                    >{{ selectedCountry.currency_symbol }}
                    {{ selectedDeliveryObject?.price }}</span
                  >
                </div>

                <div class="d-flex justify-space-between">
                  <strong
                    v-if="selectedDeliveryObject?.same_day == 'Y'"
                    class="text-red font-bold font-sm"
                    >Cut off Time ({{
                      selectedDeliveryObject?.cut_off
                    }})</strong
                  >
                  <strong v-else class="text-red font-bold font-sm">{{
                    selectedDeliveryObject?.description_2
                  }}</strong>
                </div>
              </div>
              <div
                class="w-75 mt-4"
                v-if="selectedDelivery == 5 || selectedDelivery == 6"
              >
                <!-- <v-autocomplete
                  clearable
                  density="compact"
                  placeholder="Select Advance Delivery"
                  :items="selectedDeliveryObject?.allowedDays"
                  item-title="label"
                  item-value="value"
                  class="border-sm text-blue-darken-2 mb-4"
                  variant="outlined"
                ></v-autocomplete> -->
                <VueDatePicker
                  style="font-size: 12px !important"
                  class="text-caption mb-4"
                  :disabled-week-days="selectedDeliveryObject?.allowedDays"
                  v-model="selectedDate"
                  :format="format"
                >
                  <!-- @update:model-value="onDateSelected" -->
                  <!-- <template #input-icon>
                <Icon
                  style="font-size: 20px"
                  class="mt-1 text-black"
                  icon="solar:calendar-outline"
                />
              </template>
              <template #clear-icon>
                <Icon style="font-size: 18px" class="text-black" icon="mdi:chevron-down" />
              </template> -->
                </VueDatePicker>
                <v-autocomplete
                  clearable
                  density="compact"
                  placeholder="Select Time Slot"
                  v-model="selectedTimeSlot"
                  :items="timeSlots"
                  class="border-sm text-blue-darken-2"
                  variant="outlined"
                ></v-autocomplete>
              </div>
              <template v-else>
                <!-- <p class="font-weight-bold text-red-darken-4 mt-10 mb-6">
                  This is your Delivery Schedule
                </p> -->
                <div class="d-flex justify-start align-center ga-8">
                  <div>
                    <label class="font-weight-bold text-caption"
                      >Today
                      <span class="text-blue-darken-2"
                        >({{ selectedDeliveryObject?.today_day }})</span
                      ></label
                    >
                    <MazInput
                      class="mt-1 text-blue-darken-2 font-weight-bold"
                      v-model="selectedDeliveryObject.today_date"
                      readonly
                    />
                  </div>
                  <div>
                    <label class="font-weight-bold text-caption"
                      >Approx Delivery Time</label
                    >
                    <MazInput
                      class="mt-1 text-blue-darken-2 font-weight-bold"
                      v-model="selectedDeliveryObject.time_slot"
                      readonly
                    />
                  </div>
                </div>
              </template>
              <div class="mt-12">
                <label class="text-red-darken-4 font-weight-bold"
                  >Delivery Order Instructions</label
                >
                <MazTextarea
                  class="mt-1"
                  rows="4"
                  v-model="deliveryScheduleInstruction"
                />
              </div>
            </v-col>
            <v-col v-if="step == 4" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <div class="d-flex flex-column">
                  <span>Where To Deliver . ?</span>
                  <!-- <span class="text-caption text-red">You do not have any Delivery Address in your List .</span> -->
                </div>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 3"
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
                <v-dialog v-model="addressDialog" max-width="400">
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
                        <v-col>
                          <label class="text-grey-darken-1 font-weight-bold"
                            >Name Location as</label
                          >
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

                      <v-row class="mt-n2">
                        <v-col>
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >Full Address</label
                            >
                            <MazTextarea
                              class="mt-1"
                              rows="4"
                              v-model="addressForm.full_address"
                              placeholder="Your Full Address"
                            />
                          </div>
                        </v-col>
                      </v-row>

                      <!--  -->

                      <!-- <v-row>
                        <v-col>
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >Unit #</label
                            >
                            <MazInput
                              class="mt-1 mb-2"
                              v-model="addressForm.unit"
                              placeholder="Unit"
                            />
                          </div>
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >Postal Code</label
                            >
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.postal_code"
                              placeholder="Postal Code"
                            />
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <label class="text-grey-darken-1 font-weight-bold"
                            >Street Address</label
                          >
                          <MazInput
                            class="mt-1"
                            ref="streetRef"
                            v-model="addressForm.main_address"
                            placeholder="Type Your Street Address"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >Town</label
                            >
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.town"
                              placeholder="Town"
                            />
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >City</label
                            >
                            <MazInput
                              class="mt-1"
                              v-model="addressForm.city"
                              placeholder="City"
                            />
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div>
                            <label class="text-grey-darken-1 font-weight-bold"
                              >Country</label
                            >
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
                          <label class="text-grey-darken-1 font-weight-bold"
                            >Condo / Apartment Name</label
                          >
                          <MazInput
                            class="mt-1"
                            v-model="addressForm.condo_name"
                            placeholder="Condo Name"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col>
                          <label class="text-grey-darken-1 font-weight-bold"
                            >Landmark Details</label
                          >
                          <MazTextarea
                            class="mt-1"
                            v-model="addressForm.landmark"
                            placeholder="Any Landmarks"
                          />
                        </v-col>
                      </v-row> -->

                      <!--  -->

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

              <!-- class="border-md bg-white mt-6" -->
              <div
                v-for="(option, index) in addressesOptions"
                class="cursor-pointer"
                :class="{
                  'mt-6': true,
                  'pa-5': true,
                  'bg-teal-lighten-2': option.value == selectedAddress,
                  'rounded-lg': true,
                  'border-md': option.value != selectedAddress,
                }"
              >
                <!-- 'bg-white': option.primary_address, -->
                <!-- 'border-md': !option.primary_address, -->
                <v-row @click="selectAddress(option)">
                  <v-col cols="9">
                    <strong>{{ option.location_name }}</strong>
                  </v-col>
                  <v-col
                    v-if="option.primary_address"
                    col="3"
                    class="justify-end text-red-darken-1"
                  >
                    <strong>Primary</strong>
                  </v-col>
                </v-row>
                <v-divider
                  v-if="option.primary_address"
                  :thickness="2"
                  class="mt-2 mb-2 border-opacity-25"
                />
                <v-divider
                  v-else
                  :thickness="2"
                  class="mt-2 mb-2 border-opacity-15"
                />
                <v-row class="d-flex align-center">
                  <v-col @click="selectAddress(option)" cols="9">
                    <p
                      v-if="option?.full_address"
                      v-html="formatInfo(option.full_address)"
                    />
                  </v-col>
                  <v-col cols="3" class="d-flex align-center pa-0">
                    <v-btn
                      class=""
                      @click="handleEditLocation(option.value)"
                      color="lime"
                      icon="mdi-pencil-outline"
                      size="small"
                    ></v-btn>
                    <v-btn
                      class=""
                      @click="handleOpenDialog(option, index)"
                      color="red"
                      icon="mdi-trash-can"
                      size="small"
                    ></v-btn>
                  </v-col>
                </v-row>
              </div>

              <!-- <v-row class="mt-4">
                <v-col>
                  <div>
                    <label class="text-grey-darken-1 font-weight-bold"
                      >Delivery Instructions</label
                    >
                    <MazTextarea
                      class="mt-1"
                      rows="4"
                      placeholder="Your Full Address"
                      v-model="deliveryInstructions"
                      @blur="changeDeliveryInstructions"
                    />
                  </div>
                </v-col>
              </v-row> -->
            </v-col>
            <v-col v-if="step == 5" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span>Review Order</span>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 4"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <p class="text-red-darken-3 font-weight-black text-caption">
                (Please press Back button to Edit any changes required)
              </p>
              <template v-for="(product, index) in cart" :key="index">
                <div class="d-flex align-center px-3 py-1">
                  <div class="flex-grow-0 flex-shrink-0">
                    <v-img
                      class="rounded bg-white"
                      :src="fileURL + product.image"
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
                        <span class="text-blue">{{
                          product.quantity_name
                        }}</span>
                      </div>
                      <div class="text-body-2 text-end">
                        <!-- <strong
                        >{{ selectedCountry?.currency_symbol }}
                      </strong> -->
                        <!-- S{{ formatCurrency(product.price * product.quantity) }} -->
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
                          @click="updateQuantity(product, 'decrease')"
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
                          @click="updateQuantity(product, 'increase')"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                      <div class="text-body-2">
                        <strong class="text-red">{{
                          selectedCountry?.currency_symbol
                        }}</strong>
                        <strong class="text-red">S{{ product.price }}</strong>
                      </div>
                      <div>
                        <v-btn
                          @click="handleRemoveFromCart(product)"
                          color="red"
                          icon="mdi-trash-can"
                          size="x-small"
                        ></v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <v-card elevation="0">
                <div
                  class="d-flex align-center justify-space-between pa-4 border-b"
                >
                  <div><strong>Billing Summary</strong></div>
                </div>
                <v-table density="compact" class="custom-table">
                  <tbody class="text-caption">
                    <tr>
                      <td colspan="2">Sub Total</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">{{ cart[0].amount }}</td>
                    </tr>
                    <tr>
                      <td colspan="2">Delivery Charges</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ selectedDeliveryPrice.toFixed(2) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">Service Fee (0.25%)</td>
                      <td colspan="2"></td>
                      <td colspan="2" class="text-end">
                        <!-- {{ selectedDeliveryPrice.toFixed(2) }} -->
                        Static
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">Platform Fee</td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ platformFee?.toFixed(2) }}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        G.S.T
                        {{
                          taxAmount != null
                            ? "(" + taxAmount + "%)"
                            : "(Not Applicable)"
                        }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{ selectedCountry.currency_symbol }}
                      </td>
                      <td colspan="2" class="text-end">
                        {{
                          taxAmount != null
                            ? (
                                ((subTotal + selectedDeliveryPrice + 0.5) *
                                  taxAmount) /
                                100
                              ).toFixed(2)
                            : "0.00"
                        }}
                      </td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="2" class="border-none">
                        <strong>This is what you pay</strong>
                      </td>
                      <td colspan="2" class="border-none text-end">
                        <strong>{{ selectedCountry.currency_symbol }}</strong>
                      </td>
                      <td colspan="2" class="text-end border-none">
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
                <div class="px-4 text-caption">
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Delivery to : </v-col>
                    <v-col cols="6"> Order Instructions </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-2 font-weight-bold">
                    <v-col cols="6">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Rerum, tenetur.
                    </v-col>
                    <v-col cols="6">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Order Status </v-col>
                    <v-col cols="6"> Delivery Status </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="mt-2 text-blue-darken-4 font-weight-bold"
                  >
                    <v-col cols="6"> Lorem ipsum dolor sit amet. </v-col>
                    <v-col cols="6"> Static data </v-col>
                  </v-row>
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Delivery Date </v-col>
                    <v-col cols="6"> Time Slot </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="mt-2 text-blue-darken-4 font-weight-bold"
                  >
                    <v-col cols="6"> Static </v-col>
                    <v-col cols="6"> Static </v-col>
                  </v-row>
                  <v-row no-gutters class="font-weight-black mt-6">
                    <v-col cols="6"> Payment Status </v-col>
                    <v-col cols="6"> Payment By </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-2">
                    <v-col cols="6" class="text-blue-darken-4 font-weight-bold">
                      Static
                    </v-col>
                    <v-col cols="6" class="text-red-darken-1 font-weight-bold">
                      Static
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
            <v-col v-if="step == 6" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span>Payment Options</span>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 5"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <MazRadioButtons
                v-slot="{ option, selected }"
                v-model="selectedPaymentMethod"
                :options="paymentOptions"
                @update:model-value="onSelectPayment"
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class=""
              >
                <div class="d-flex align-center justify-start">
                  <div style="width: 20%">
                    <v-img height="60" width="60" :src="option.payment_image" />
                  </div>
                  <div style="width: 80%">
                    <p class="font-weight-bold">{{ option.payment_name }}</p>
                    <p
                      class="text-caption text-red-darken-1 mt-2 font-weight-bold"
                    >
                      {{ option.payment_desc }}
                    </p>
                  </div>
                </div>
              </MazRadioButtons>
              <p
                v-if="paymentOptions2.length > 0"
                class="text-caption font-weight-bold mb-4 mt-10"
              >
                More payment options coming soon ...
              </p>
              <MazRadioButtons
                v-slot="{ option, selected }"
                :options="paymentOptions2"
                orientation="col | row"
                :selector="true"
                color="info"
                block
                class=""
              >
                <div class="d-flex align-center justify-start">
                  <div style="width: 20%">
                    <v-img height="60" width="60" :src="option.payment_image" />
                  </div>
                  <div style="width: 80%">
                    <p class="font-weight-bold">{{ option.payment_name }}</p>
                    <p
                      class="text-caption text-red-darken-1 mt-2 font-weight-bold"
                    >
                      {{ option.payment_desc }}
                    </p>
                  </div>
                </div>
              </MazRadioButtons>
            </v-col>
            <v-col v-if="step == 7" class="pa-5">
              <div class="my-3 text-h6 d-flex justify-space-between">
                <span>Pay using PayNow</span>
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  @click="step = 6"
                  color="grey"
                  variant="flat"
                  >Back</v-btn
                >
              </div>
              <v-img :src="qris" height="200" width="200" />
              <div class="font-weight-bold my-4">
                <p>Paynow Number</p>
                <p class="text-grey-darken-1 mt-2">91992000</p>
              </div>
              <div class="font-weight-bold mb-4">
                <p>Paynow Name</p>
                <p class="text-grey-darken-1 mt-2">
                  Foxtech 2000 Singapore Pte Ltd
                </p>
              </div>
              <div class="font-weight-bold mb-4">
                <p>Please Pay Exactly</p>
                <p class="text-green-darken-1 mt-2">S$ 265.35</p>
              </div>
              <div
                class="d-flex w-100 align-center justify-space-between mt-10"
              >
                <v-btn
                  @click="payLater = true"
                  variant="outlined"
                  size="large"
                  class="rounded-xl"
                  style="width: 46%"
                  >I will pay later</v-btn
                >
                <v-btn
                  @click="havePaid = true"
                  variant="outlined"
                  size="large"
                  class="rounded-xl"
                  style="width: 46%"
                  >I have Paid</v-btn
                >
              </div>
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
              @click="nextStep(3)"
              color="#ff9800"
              variant="flat"
              size="large"
              >Delivery Schedule</v-btn
            >
            <v-btn
              v-else-if="step == 3"
              @click="whereToDeliver()"
              color="#ff9800"
              variant="flat"
              size="large"
              >Where to Deliver?</v-btn
            >
            <v-btn
              v-else-if="step == 4"
              @click="nextStep(5)"
              color="#ff9800"
              variant="flat"
              size="large"
              >Review Order</v-btn
            >
            <v-btn
              v-else-if="step == 5"
              @click="confirmOrder2 = true"
              color="#ff9800"
              variant="flat"
              size="large"
              >Confirm Order</v-btn
            >
            <v-btn
              v-else-if="step == 6"
              @click="nextStep(7)"
              color="#ff9800"
              variant="flat"
              size="large"
              >Pay Now</v-btn
            >
            <v-btn
              v-else-if="step == 8"
              @click="confirmOrder = true"
              color="#1868C1"
              variant="flat"
              size="large"
              >CONFIRM ORDER</v-btn
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
                        <td>Service Fee (0.25%)</td>
                        <td></td>
                        <td class="text-end">
                          <!-- {{ selectedDeliveryPrice.toFixed(2) }} -->
                          Static
                        </td>
                      </tr>
                      <tr>
                        <td>Platform Fee</td>
                        <td>{{ selectedCountry.currency_symbol }}</td>
                        <td class="text-end">{{ platformFee?.toFixed(2) }}</td>
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
                              ? (
                                  ((subTotal + selectedDeliveryPrice + 0.5) *
                                    taxAmount) /
                                  100
                                ).toFixed(2)
                              : "0.00"
                          }}
                        </td>
                      </tr>
                      <tr class="total-row">
                        <td><strong>This is what you pay</strong></td>
                        <td>
                          <strong>{{ selectedCountry.currency_symbol }}</strong>
                        </td>
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
  <v-dialog v-model="openDialog" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Do you wish to Delete . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="handleDeleteAddress()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="openDialog = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isEmptyAddress" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Please add at least one address</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isEmptyAddress = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isEmptyPayment" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Please add at least one option</h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="isEmptyPayment = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="payLater" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Once Payment is made pls what's app us to 89102000
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handlePayLater">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="havePaid" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Thanks !!! for Payment we will check and update your payment status
          for your current Order
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleHavePaid">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="acceptCash" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          We will accept Cash Option for the 1st Delivery
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleAcceptCash()">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="orderConfirmed" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">
          Your Order has been confirmed . someone will get in touch with you
          very shortly.
        </h4>
        <v-btn class="mb-4 w-100 bg-primary" @click="handleOrderConfirmed()">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmOrder2" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Confirm this Order . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="updateCartOrderStatus()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="confirmOrder2 = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- <v-dialog v-model="confirmOrder" persistent width="auto">
    <v-card width="350">
      <v-card-text class="">
        <h4 class="mt-4 mb-8 text-center">Confirm this Order . ?</h4>
        <div class="w-100 d-flex align-center justify-space-around">
          <v-btn class="mb-4 w-33 bg-primary" @click="handleConfirmOrder()">
            Yes
          </v-btn>
          <v-btn class="mb-4 w-33 bg-primary" @click="confirmOrder = false">
            No
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog> -->
</template>

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
import moment from "moment-timezone";
import axios from "@/util/axios";
import { useStore } from "vuex";
import MazDrawer from "maz-ui/components/MazDrawer";
import MazInput from "maz-ui/components/MazInput";
import MazTextarea from "maz-ui/components/MazTextarea";
import MazRadioButtons from "maz-ui/components/MazRadioButtons";
import { Loader } from "@googlemaps/js-api-loader";
import { useCart } from "@/composables/useCart";
import { useGlobalSnackbar } from "@/composables/useGlobalSnackbar";
import { fileURL } from "@/main";
import qris from "@/assets/images/payment/qris-example.png";

const { snackbarVisible, snackbarMessage, snackbarColor } = useGlobalSnackbar();
const { updateQuantity } = useCart();
const store = useStore();

let autocomplete;
const allDays = [0, 1, 2, 3, 4, 5, 6];
const authToken = localStorage.getItem("token");

const props = defineProps({
  viewCart: Boolean,
});
const emit = defineEmits(["update:viewCart"]);

const currentTime = ref("");
const streetRef = ref(null);
const openDialog = ref(false);
const payLater = ref(false);
const havePaid = ref(false);
const confirmOrder = ref(false);
const confirmOrder2 = ref(false);
const isEmptyAddress = ref(false);
const isEmptyPayment = ref(false);
const acceptCash = ref(false);
const orderConfirmed = ref(false);
const addressIndex = ref(null);
const addressId = ref(null);
const addressName = ref(null);
const modalText = ref(null);
const isEditAddressForm = ref(false);
const addressID = ref("");
const step = ref(1);
const snackbar = ref(false);
const message = ref({
  text: "",
  color: "success",
});
const addressDialog = ref(false);
const summaryDialog = ref(false);
const selectedDelivery = ref(
  // store.state.selectedDelivery ??
  //   (localStorage.getItem("selectedDelivery") !== null
  //     ? Number(localStorage.getItem("selectedDelivery"))
  //     : null),
  null,
);
const selectedPaymentMethod = ref(null);
const selectedDate = ref(null);
const selectedTimeSlot = ref(null);
const paymentOptions = ref([
  // {
  //   value: 1,
  //   payment_name: "Cash",
  //   payment_desc: "Cash on Delivery",
  //   payment_image: cash,
  // },
]);
const paymentOptions2 = ref([
  // {
  //   value: 1,
  //   payment_name: "Cash",
  //   payment_desc: "Cash on Delivery",
  //   payment_image: cash,
  // },
]);
const addresses = ref([]);
const selectedAddress = ref(null);
const savingAddress = ref(false);
const addressExpanded = ref({});
const taxAmount = ref(null);
const platformFee = ref(null);
const timeSlots = ref([]);

const addressForm = reactive({
  //main_address: "",
  full_address: "",
  //unit: "",
  //postal_code: "",
  //town: "",
  //city: "",
  //country: "",
  //condo_name: "",
  //landmark: "",
  location_name: "",
  //latitude: "",
  //longitude: "",
});
const deliveryInstructions = ref("");
const deliveryScheduleInstruction = ref("");

const addressesOptions = computed(() => {
  return addresses.value.map((address) => ({
    value: address.ga_id,
    full_address: address.full_address,
    // main_address: address.main_address,
    // landmark: address.landmark,
    location_name: address.location_name,
    primary_address: address.primary_address,
  }));
});

const isLoading = computed(() => {
  return store.state.isLoading;
});

const isEmptyCart = computed(() => {
  return store.state.isEmptyCart;
});

const selectedCountry = computed(() => {
  return store.state.selectedCountry;
});

const deliveryOptions = computed(() => {
  return store.state.deliveryCharges.map((item) => {
    return {
      ...item,
      allowedDays: allDays.filter((day) => !item.allowed_days.includes(day)),
    };
  });
});

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

const selectedDeliveryObject = computed(() => {
  const option = deliveryOptions.value.find(
    (opt) => opt.value === selectedDelivery.value,
  );
  return option;
});

// Get cart items
const detailsCart = computed(() => {
  return store.state.detailsCart;
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

// Get cart items
const cart = computed(() => {
  return store.state.cart;
});

const format = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const parse = (dateStr) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
};

// const onDateSelected = (newDate) => {
//   const day = newDate.getDate();
//   const month = newDate.getMonth() + 1;
//   const year = newDate.getFullYear();

//   selectedDate.value = `${day}/${month}/${year}`;
//   // console.log(`${day}/${month}/${year}`);
// };

const formatInfo = (info) => {
  return info.replace(/\n/g, "<br>");
};

const getDeliveryCharges = () => {
  store.dispatch(
    "getDeliveryCharges",
    selectedCountry.value ? selectedCountry.value.country_id : 1,
  );
};

const openAddressDialog = () => {
  resetForm();
  addressDialog.value = true;
};

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
          // var placeName = place.name;
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

            // if (component.types.includes("locality")) {
            //   addressForm.city = component.long_name; // City
            // }
            // if (component.types.includes("neighborhood")) {
            //   addressForm.town = component.long_name; // Town
            // }
            // if (component.types.includes("country")) {
            //   addressForm.country = component.long_name; // Country
            // }
            // if (component.types.includes("postal_code")) {
            //   addressForm.postal_code = component.long_name; // Postal Code
            // }
            // else {
            //   addressForm.postal_code = "";
            // }
          }

          // var wrappedAddress = addressForm.city + " " + addressForm.postal_code;
          // var mainAddress = [placeName, streetName, route]
          //   .filter(Boolean)
          //   .join(" ");
          var fullSingleLine = streetName + " " + route;
          var fullAddress = fullSingleLine;
          // var fullAddress = [fullSingleLine]
          //   .filter(Boolean)
          //   .join("\n");

          // addressForm.main_address = mainAddress;
          addressForm.full_address = fullAddress;
          // addressForm.condo_name = placeName;
          // addressForm.latitude = place.geometry.location.lat();
          // addressForm.longitude = place.geometry.location.lng();
        }
      });
    } else {
      console.error("Invalid input element:", streetRef.value);
    }
  });
};

const resetForm = () => {
  // addressForm.main_address = "";
  addressForm.full_address = "";
  // addressForm.unit = "";
  // addressForm.postal_code = "";
  // addressForm.town = "";
  // addressForm.city = "";
  // addressForm.country = "";
  // addressForm.condo_name = "";
  // addressForm.landmark = "";
  addressForm.location_name = "";
};

/* const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount); */

// Remove item from cart
const handleRemoveFromCart = (product) => {
  store.dispatch("removeFromCart", product);
};

const onSelectDelivery = (selectedId) => {
  try {
    const selectedOption = deliveryOptions.value.find(
      (opt) => opt.dc_id === selectedId,
    );
    if (selectedOption) {
      const payload = {
        cart_id: cart.value[0]?.cart_id,
        dc_id: selectedOption.dc_id,
        delivery_rate: selectedOption.price,
      };
      store.dispatch("updateDeliveryChargesInCart", payload);
      // console.log("Delivery option deliveryOptions:", payload);
    }
  } catch (error) {
    console.error("Error saving delivery option:", error);
  }
};

const onSelectPayment = async (selectedId) => {
  // console.log(selectedId);
  try {
    const response = await axios.put(
      `/update-cart-payment-type`,
      {
        cart_id: cart.value[0].cart_id,
        payment_type_id: selectedId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // getAddress();
    const data = response.data.data;
    // console.log(data);
    selectedPaymentMethod.value = data.payment_type_id;
    if (data.payment_type_id == 1) {
      acceptCash.value = true;
    }
    // console.log(selectedAddress.value);
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
  // finally {
  //   savingAddress.value = false;
  // }
};

// Open Confirmation Modal
const handleOpenDialog = (option, index) => {
  addressIndex.value = index;
  addressId.value = option.value;
  addressName.value = option.location_name;
  modalText.value = `Do you surely want to delete the address "${addressName.value}"?`;
  openDialog.value = true;
};

// Delete address from the DB & the list
const handleDeleteAddress = async () => {
  const response = await axios.delete("/delete-address/" + addressId.value, {
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
  addresses.value.splice(addressIndex.value, 1);
  openDialog.value = false;
};

const handlePayLater = async () => {
  // const response = await axios.get("/delete-address/" + addressId.value, {
  //   headers: {
  //     Authorization: `Bearer ${authToken}`,
  //   },
  // });

  // snackbar.value = true;
  // message.value = {
  //   text: response.data.message,
  //   color: "success",
  // };
  // addresses.value.splice(addressIndex.value, 1);
  // openDialog.value = false;
  emit("update:viewCart", false);
  payLater.value = false;
};
const handleHavePaid = async () => {
  // const response = await axios.get("/delete-address/" + addressId.value, {
  //   headers: {
  //     Authorization: `Bearer ${authToken}`,
  //   },
  // });

  // snackbar.value = true;
  // message.value = {
  //   text: response.data.message,
  //   color: "success",
  // };
  // addresses.value.splice(addressIndex.value, 1);
  // openDialog.value = false;
  emit("update:viewCart", false);
  havePaid.value = false;
};

const handleAcceptCash = async () => {
  acceptCash.value = false;
  orderConfirmed.value = true;
};
const handleOrderConfirmed = () => {
  orderConfirmed.value = false;
  emit("update:viewCart", false);
};

// Edit Address
const handleEditLocation = async (address_id) => {
  isEditAddressForm.value = true;
  addressID.value = address_id;
  axios
    .get("/get-address/" + address_id)
    .then((response) => {
      let formData = response.data.data;
      // (addressForm.main_address = formData.address_master?.street_address),
      (addressForm.full_address = formData.full_address),
        // (addressForm.unit = formData.unit_number),
        // (addressForm.postal_code = formData.address_master?.postal_code),
        // (addressForm.town = formData.address_master?.town.town_name),
        // (addressForm.city = formData.address_master?.city.city_name),
        // (addressForm.country = formData.address_master?.country.country_name),
        // (addressForm.condo_name = formData?.condo_name || ""),
        // (addressForm.landmark = formData.landmark),
        (addressForm.location_name = formData.location_name);
      addressDialog.value = true;
    })
    .catch((error) => {
      console.error(error);
    });
};

const whereToDeliver = async () => {
  try {
    const response = await axios.put(
      `/update-delivery-schedule-in-cart`,
      {
        cart_id: cart.value[0].cart_id,
        dc_id: selectedDeliveryObject.value.dc_id,
        delivery_date: format(selectedDate.value),
        // delivery_day: selectedDeliveryObject.value.today_day,
        same_day: selectedDeliveryObject.value.same_day,
        time_slot: selectedTimeSlot.value,
        order_instructions: deliveryScheduleInstruction.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    nextStep(4);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const updateCartOrderStatus = async () => {
  try {
    const response = await axios.put(
      `/update-cart-order-status`,
      {
        cart_id: cart.value[0].cart_id,
        order_status: "C",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    // const data = response.data.data;
    // console.log(data);
    confirmOrder2.value = false;
    nextStep(6);
    getCartData();
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
};

const nextStep = (value) => {
  if (value === 7) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };

    if (!selectedPaymentMethod.value) {
      isEmptyPayment.value = true;

      return;
    } else if (selectedPaymentMethod.value == 1) {
      return;
    }
  } else if (value === 5) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };

    if (!selectedAddress.value) {
      snackbar.value = true;
      message.value = {
        text: "You must select address",
        color: "error",
      };
      return;
    }

    if (addresses.value.length == 0) {
      isEmptyAddress.value = true;

      return;
    }
  } else if (value == 3) {
    snackbar.value = false;
    message.value = {
      text: "",
      color: "success",
    };

    if (selectedDelivery.value == null) {
      store.commit("setIsEmptyDelivery", true);
      return;
    }

    if (authToken == "null") {
      store.commit("setIsNotLoggedIn", true);

      return;
    }
  }
  step.value = value;
};

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

    // Ambil data dari response dan pastikan array
    const data = response.data?.data;
    addresses.value = Array.isArray(data) ? data : [];

    // Cari alamat utama (primary address)
    const primaryAddressIndex = addresses.value.findIndex(
      (address) => address.primary_address === true,
    );

    if (primaryAddressIndex !== -1) {
      const [primaryAddress] = addresses.value.splice(primaryAddressIndex, 1);
      addresses.value.unshift(primaryAddress); // Pindahkan ke paling atas

      // Set selectedAddress dengan ga_id
      // selectedAddress.value = primaryAddress.ga_id ?? null;

      if (primaryAddress.ga_id) {
        addressExpanded.value[primaryAddress.ga_id] = true;
      }
    }
    // else {
    //   selectedAddress.value = null;
    // }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

const saveAddress = async () => {
  savingAddress.value = true;
  try {
    if (!isEditAddressForm.value) {
      const response = await axios.post(`/save-address`, addressForm, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // ✅ Push the new address into `addresses.value`
      addresses.value.unshift(response.data.data); // Ensure `addresses` is a reactive array
      // const primaryAddressIndex = addresses.value.findIndex(address => address.primary_address)
      // selectedAddress.value = response.data.data.ga_id;
      toggleAddressDetails(response.data.data.ga_id);
      addresses.value = addresses.value.map((address) => ({
        ...address,
        // primary_address: address.ga_id === selectedAddress.value,
      }));
      getAddress();
      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    } else {
      // console.log("isEditAddressForm", addressForm);
      const response = await axios.put(
        `/update-address/` + addressID.value,
        addressForm,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      getAddress();
      snackbar.value = true;
      message.value = {
        text: response.data.message,
        color: "success",
      };
    }
    // ✅ Optionally, reset form after successful save
    resetForm();
    isEditAddressForm.value = false;
    addressDialog.value = false;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  } finally {
    savingAddress.value = false;
  }
};

const selectAddress = async (item) => {
  // console.log(cart.value[0].cart_id);
  // console.log(item);
  // return false;
  // savingAddress.value = true;
  try {
    const response = await axios.put(
      `/update-cart-address`,
      {
        cart_id: cart.value[0].cart_id,
        ga_id: item.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    getAddress();
    const data = response.data.data;
    selectedAddress.value = data.ga_id;
    // console.log(selectedAddress.value);
    snackbar.value = true;
    message.value = {
      text: response.data.message,
      color: "success",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong!";
    snackbar.value = true;
    message.value = {
      text: errorMessage,
      color: "error",
    };
  }
  // finally {
  //   savingAddress.value = false;
  // }
};

const changeDeliveryInstructions = () => {
  console.log(deliveryInstructions.value);
};

const getTaxAmount = async () => {
  // let data = null;

  try {
    // await axios
    //   .get(`/gypsy-user`, { headers: { Authorization: `Bearer ${authToken}` } })
    //   .then((response) => {
    //     data = response.data.data?.country_current;
    //   })
    //   .catch((_) => {});

    const response = await axios.get(`/get-tax-amount`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        country_id: selectedCountry.value.country_id,
      },
    });
    if (response.data.data?.applicable === "Y") {
      taxAmount.value = response.data.data?.tax_rate;
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
};

const getCartData = async () => {
  await store.dispatch("getCartItems");
};

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
        data = response.data.data?.app_id;
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

    platformFee.value = parseFloat(response.data.data?.platform_fee);
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

const getTimeSlots = async () => {
  try {
    const response = await axios.get(`/list-time-slots`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Ambil data dari response dan pastikan array
    const data = response.data?.data;
    timeSlots.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

const getPaymentTypes = async () => {
  try {
    const response = await axios.get(`/payment-type-list`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // Ambil data dari response dan pastikan array
    const data = response.data?.data;
    const result = Array.isArray(data)
      ? data.filter(
          (item) => item.country_id == selectedCountry.value.country_id,
        )
      : [];
    paymentOptions.value = result
      .filter((item) => item.active == "Y")
      .map((pay) => {
        return {
          ...pay,
          value: pay?.payment_type_id || 0,
          payment_name: pay?.payment_name || "",
          payment_desc: pay?.description || "",
          payment_image: pay?.image ? fileURL + pay.image : "",
        };
      });
    paymentOptions2.value = result
      .filter((item) => item.active != "Y")
      .map((pay) => {
        return {
          ...pay,
          value: pay?.payment_type_id || 0,
          payment_name: pay?.payment_name || "",
          payment_desc: pay?.description || "",
          payment_image: pay?.image ? fileURL + pay.image : "",
        };
      });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    // alert(error.response?.data?.message || "Something went wrong!");
  }
};

watch(selectedCountry, async () => {
  await getTaxAmount();
  await getPaymentTypes();
  getDeliveryCharges();
});

watch(addressDialog, (isOpen) => {
  if (isOpen) {
    initAutocomplete();
  }
});

watch(cart, async (newCart) => {
  // console.log(newCart);
  if (newCart.length > 0) {
    selectedAddress.value = newCart[0]?.ga_id;
    selectedPaymentMethod.value = newCart[0]?.payment_type_id;
    deliveryScheduleInstruction.value = newCart[0]?.order_instructions;
    selectedDate.value = newCart[0]?.delivery_date
      ? parse(newCart[0]?.delivery_date)
      : null;
    selectedTimeSlot.value = newCart[0]?.time_slot;
  }
  // console.log(selectedAddress.value);
});

watch(
  () => props.viewCart, // Watch for changes in viewCart prop
  (newValue) => {
    if (newValue) {
      // console.log(
      //   "open cart",
      //   store.state.selectedDelivery ||
      //     localStorage.getItem("selectedDelivery"),
      // );
      step.value = 1; // Set step to 1 when viewCart changes
      // selectedDelivery.value = null;
      if (cart.value[0]?.delivery_charges != "0.00") {
        selectedDelivery.value =
          store.state.selectedDelivery ??
          (localStorage.getItem("selectedDelivery") !== null
            ? Number(localStorage.getItem("selectedDelivery"))
            : null);
      } else {
        selectedDelivery.value = null;
      }
    }
  },
);

const updateTime = () => {
  const singaporeTime = moment().tz("Asia/Singapore");

  const day = singaporeTime.format("dddd"); // e.g., Wednesday
  const date = singaporeTime.format("DD/MM/YYYY"); // e.g., 21/05/2025
  const time = singaporeTime.format("HH:mm:ss"); // e.g., 16:49

  currentTime.value = `${day} (Today) | ${date} | ${time}`;
};

onMounted(() => {
  if (
    authToken &&
    authToken != null &&
    authToken != "" &&
    authToken != "null"
  ) {
    // getTaxAmount();
    getAddress();
    // getPaymentTypes();
    getTimeSlots();
    getPlatformFee();
    getCartData();
  }
  // selectedDate.value = null;
  updateTime();
  setInterval(updateTime, 1000);
});
</script>

<style>
.font-sm {
  font-size: 10px;
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
