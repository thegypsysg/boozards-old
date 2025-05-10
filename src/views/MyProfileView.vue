<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <v-container v-if="!isLoading">
      <template v-if="!isSmall">
        <div class="card-container d-flex flex-wrap justify-space-between">
          <v-card class="first-section px-16 py-2">
            <input
              ref="filePickerField"
              type="file"
              accept="image/*"
              hidden
              @change="launchCropper"
            />
            <div
              class="image-container d-flex justify-center w-100 mb-4"
              style="position: relative"
            >
              <div>
                <div
                  style="width: 170px; height: 120px; border-radius: 20px"
                  class="mt-5"
                >
                  <v-img
                    style="width: 100%; height: 100%; border-radius: 20px"
                    cover
                    :src="
                      image_path
                        ? image_path
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                  />
                </div>
                <div
                  class="mt-4 w-100 d-flex align-center"
                  :class="{
                    'justify-space-between': image_path,
                    'justify-center': !image_path,
                  }"
                >
                  <v-btn
                    size="small"
                    color="blue"
                    variant="outlined"
                    :disabled="image_path"
                    @click="$refs.filePickerField.click()"
                  >
                    {{ !isSaveImage ? "Upload Picture" : "Saving Image" }}
                  </v-btn>
                  <v-icon
                    v-if="image_path"
                    color="red"
                    icon="mdi-trash-can-outline"
                    @click="deleteImage()"
                  />
                </div>
                <!-- <image-cropper-dialog
                  ref="cropperDialog"
                  :chosen-image="image"
                  @onReset="$refs.filePickerField.value = null"
                  @onCrop="
                    (croppedImage) => {
                      image_path = croppedImage;
                    }
                  "
                /> -->
              </div>
            </div>
            <v-row class="">
              <v-col>
                <label>Gender</label>

                <VueMultiselect
                  v-model="input.gender"
                  class="mt-2"
                  :options="resource.gender"
                  track-by="value"
                  label="title"
                  placeholder="Select Gender"
                />

                <!-- <select v-model="input.gender" class="form-control mt-2">
                  <option disabled value="">Gender</option>
                  <option
                    v-for="gender in resource.gender"
                    :key="gender"
                    :value="gender"
                  >
                    {{ gender }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row class="">
              <v-col>
                <label>Marital Status</label>
                <VueMultiselect
                  v-model="input.marital"
                  class="mt-2"
                  :options="resource.marital"
                  track-by="value"
                  label="title"
                  placeholder="Select Marital Status"
                />
                <!-- <select v-model="input.marital" class="form-control mt-2">
                  <option disabled value="">--- Select ---</option>
                  <option
                    v-for="marital in resource.marital"
                    :key="marital"
                    :value="marital"
                  >
                    {{ marital }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label>Nationality</label>

                <VueMultiselect
                  v-model="input.nationality"
                  class="mt-2"
                  :options="resource.nationality"
                  track-by="id"
                  label="title"
                  placeholder="Select Nationality"
                  @select="onInputNationality()"
                />
                <!-- <select v-model="input.nationality" class="form-control mt-2">
                  <option disabled value="">--- Select ---</option>
                  <option
                    v-for="nation in resource.nationality"
                    :key="nation"
                    :value="nation"
                  >
                    {{ nation }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col class="d-flex justify-center">
                <v-btn
                  class="text-none text-subtitle-1"
                  color="success"
                  size="large"
                  variant="flat"
                  @click="saveDataDesktop1()"
                >
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="second-section">
            <v-card-title
              style="border-bottom: 1px solid rgb(227, 227, 227)"
              class="card-title"
            >
              <v-container
                class="d-flex align-center justify-space-between my-n4"
              >
                <p class="title-card">Basic Information</p>
                <v-btn
                  class="text-none text-subtitle-1"
                  color="success"
                  size="large"
                  variant="flat"
                  @click="saveDataDesktop2()"
                >
                  Save Changes
                </v-btn>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <label>Name</label>
                    <input
                      v-model="input.name"
                      type="text"
                      required
                      class="form-control mt-2"
                      placeholder="Enter Your Full Name"
                    />
                    <!-- <v-text-field
                      v-model="input.name"
                      :rules="rules.nameRules"
                      :counter="20"
                      class="mt-2"
                      variant="outlined"
                      placeholder="Enter Name"
                      density="compact"
                      required
                      single-line
                    /> -->
                  </v-col>
                  <v-col cols="6">
                    <label>
                      <div class="d-flex" style="gap: 5px">
                        <span>Email</span>
                        <span
                          :class="{
                            'text-red': !isEmailVerified,
                            'text-green': isEmailVerified,
                          }"
                          >{{
                            isEmailVerified ? "(Verified)" : "(Not Verified)"
                          }}</span
                        >
                        <div
                          v-if="!isEmailVerified"
                          class="d-flex"
                          style="gap: 5px"
                        >
                          <span
                            v-if="!isVerifying"
                            class="text-green cursor-pointer"
                            @click="verifyEmail()"
                            >(Verify Now)</span
                          >
                          <span v-if="isVerifying" class="text-green"
                            >(Verify Now)</span
                          >
                          <span
                            class="text-blue-accent-4 cursor-pointer"
                            @click="isWhy = true"
                            >Why ?</span
                          >
                        </div>
                      </div></label
                    >
                    <div
                      v-if="isEmailOTP"
                      class="w-100 d-flex"
                      style="gap: 10px"
                    >
                      <input
                        v-model="input.emailOTP"
                        maxlength="4"
                        type="number"
                        class="form-control mt-4 w-50"
                        placeholder="Enter OTP"
                        @input="handleInputOTP"
                      />
                      <v-btn
                        :disabled="!input.emailOTP || isSending"
                        :loading="isSending"
                        class="text-none text-subtitle-1 mt-4 w-50"
                        color="primary"
                        variant="flat"
                        @click="saveEmailOTP()"
                      >
                        Update
                      </v-btn>
                    </div>
                    <div
                      class="d-flex align-center mt-2 py-0 back-grey"
                      style="border: 1px solid #ced4da; border-radius: 0.25rem"
                    >
                      <input
                        v-model="input.email"
                        type="email"
                        disabled
                        class="form-control"
                        style="border: none"
                        placeholder="Enter Email"
                      />
                      <span
                        class="text-blue-darken-4 mx-2"
                        style="cursor: pointer"
                        @click="isChangeEmail = !isChangeEmail"
                      >
                        Change
                      </span>
                    </div>
                    <div v-if="isChangeEmail">
                      <input
                        v-model="input.emailNew"
                        type="email"
                        class="form-control mt-4"
                        placeholder="Enter Email"
                      />
                      <v-btn
                        class="text-none text-subtitle-1 mt-4"
                        color="success"
                        variant="flat"
                        @click="saveEmail()"
                      >
                        Save Changes
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label
                      >Contact Number
                      <span
                        :class="{
                          'text-red': !isPhoneVerified,
                          'text-green': isPhoneVerified,
                        }"
                        >{{
                          isPhoneVerified ? "(Verified)" : "(Not Verified)"
                        }}</span
                      ></label
                    >
                    <div
                      class="d-flex align-center mt-2 py-0 back-grey"
                      style="border: 1px solid #ced4da; border-radius: 0.25rem"
                    >
                      <input
                        v-model="input.phone"
                        type="text"
                        required
                        disabled
                        class="form-control"
                        style="border: none"
                        placeholder="Phone Number"
                      />
                      <span
                        class="text-blue-darken-4 mx-2"
                        style="cursor: pointer"
                        @click="isChangePhone = !isChangePhone"
                      >
                        Change
                      </span>
                    </div>
                    <div v-if="isChangePhone" class="mt-2">
                      <MazPhoneNumberInput
                        v-model="input.phoneNew"
                        show-code-on-list
                        color="info"
                        :default-country-code="
                          input.country ? input.country : 'SG'
                        "
                        :preferred-countries="[
                          'SG',
                          'BD',
                          'IN',
                          'MY',
                          'GB',
                          'PH',
                        ]"
                        @update="phoneEvent = $event"
                      />
                      <v-btn
                        class="text-none text-subtitle-1 text-white w-100 mt-3"
                        color="#F0882D"
                        variant="flat"
                        @click="saveMobile()"
                      >
                        Save
                      </v-btn>
                    </div>
                    <v-alert
                      v-model="isMobileChanged"
                      class="my-2"
                      type="success"
                      :text="successMessage"
                    />
                  </v-col>
                  <v-col cols="6">
                    <label>Password </label>
                    <div
                      class="d-flex align-center mt-2 py-0 back-grey"
                      style="border: 1px solid #ced4da; border-radius: 0.25rem"
                    >
                      <input
                        v-model="input.password"
                        type="password"
                        required
                        disabled
                        class="form-control"
                        :class="{ 'w-66 mr-3': !input.password }"
                        style="border: none"
                        placeholder="Enter Password"
                        maxlength="8"
                      />
                      <span
                        v-if="!isLoading"
                        class="text-blue-darken-4 mx-2 text-right"
                        style="cursor: pointer"
                        @click="isChangePassword = !isChangePassword"
                      >
                        {{ input.password ? "Change" : "Create New" }}
                      </span>
                    </div>
                    <div v-if="isChangePassword">
                      <div
                        class="d-flex align-center mt-4 py-0"
                        style="
                          border: 1px solid #ced4da;
                          border-radius: 0.25rem;
                        "
                      >
                        <input
                          v-model="input.passwordNew"
                          :type="!showPassword1 ? 'password' : 'text'"
                          required
                          class="form-control"
                          style="border: none"
                          placeholder="Enter Password"
                          maxlength="8"
                        />
                        <span
                          class="toggle-password mr-4 ml-2 mdi"
                          :class="{
                            'mdi-eye': showPassword1,
                            'mdi-eye-off': !showPassword1,
                          }"
                          style="cursor: pointer; font-size: 26px"
                          @click="showPassword1 = !showPassword1"
                        />
                      </div>
                      <h6
                        v-if="isPassword1 == false"
                        class="w-100 text-red mb-2"
                      >
                        Password must be 8 characters
                      </h6>
                      <template v-if="input.password">
                        <div
                          class="d-flex align-center mt-4 py-0"
                          style="
                            border: 1px solid #ced4da;
                            border-radius: 0.25rem;
                          "
                        >
                          <input
                            v-model="input.passwordConfirm"
                            :type="!showPassword2 ? 'password' : 'text'"
                            required
                            class="form-control"
                            style="border: none"
                            placeholder="Re-enter Password"
                            maxlength="8"
                          />
                          <span
                            class="toggle-password mr-4 ml-2 mdi"
                            :class="{
                              'mdi-eye': showPassword2,
                              'mdi-eye-off': !showPassword2,
                            }"
                            style="cursor: pointer; font-size: 26px"
                            @click="showPassword2 = !showPassword2"
                          />
                        </div>
                        <h6
                          v-if="isPassword2 == false"
                          class="w-100 text-red mb-2"
                        >
                          {{ password2Mes }}
                        </h6>
                      </template>
                      <v-btn
                        class="text-none text-subtitle-1"
                        :class="{ 'mt-4': isPassword2, 'mt-n2': !isPassword2 }"
                        color="success"
                        variant="flat"
                        @click="changePassword()"
                      >
                        Save Changes
                      </v-btn>
                    </div>

                    <v-alert
                      v-model="isPasswordChanged"
                      class="my-2"
                      type="success"
                      :text="successMessage"
                    />
                  </v-col>
                </v-row>
                <v-row
                  style="border-bottom: 1px solid rgb(189, 189, 189)"
                  class="mb-4 pb-2"
                >
                  <v-col cols="5">
                    <label>Birth Date</label>
                    <input
                      id="dateInput"
                      v-model="input.date"
                      required
                      class="form-control mt-2"
                      type="text"
                      placeholder="DD/MM/YYYY"
                      @input="onDateInput"
                    />
                  </v-col>
                  <v-col cols="7">
                    <label>Age</label>
                    <p class="mt-5">
                      {{ age }}
                    </p>
                  </v-col>
                </v-row>
                <!-- <hr class="my-4" /> -->
              </v-container>
              <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n8"
                >
                  <p class="title-card">My Current Location</p>
                  <v-btn
                    class="text-none text-subtitle-1"
                    color="success"
                    size="large"
                    variant="flat"
                    @click="saveLocation()"
                  >
                    Save Changes
                  </v-btn>
                </div>

                <v-row>
                  <v-col cols="6">
                    <!-- <VueMultiselect
                      v-model="input.country"
                      class="mt-2"
                      :options="resource.country"
                      placeholder="Current Country"
                    /> -->
                    <!-- <div class="location-input">
                      <v-autocomplete
                        v-model="input.country"
                        :items="resource.country"
                        variant="outlined"
                        label="Current Country"
                        clearable
                        class="mt-n1"
                        density="compact"
                        :rules="rules.countryRules"
                      />
                    </div> -->
                    <div class="w-100 d-flex align-center">
                      <div
                        v-if="input.country"
                        style="
                          border-top: 2px solid rgb(239, 239, 239);
                          border-bottom: 2px solid rgb(239, 239, 239);
                          border-left: 2px solid rgb(239, 239, 239);
                          border-radius: 5px 0 0px 5px;
                          height: 47px;
                        "
                        class="d-flex align-center justify-center"
                      >
                        <span
                          class="fi ml-2 pr-4 mr-4"
                          :class="['fi-' + input.country.toLowerCase()]"
                        />
                      </div>
                      <MazSelect
                        v-slot="{ option }"
                        v-model="input.country"
                        item-height="40"
                        :options="options"
                        search
                        size="md"
                        class="w-100"
                        search-placeholder="Search in country"
                        :class="{ 'ml-n1': input.country }"
                      >
                        <div
                          class="flex items-center"
                          style="
                            padding-top: 0.5rem;
                            padding-bottom: 0.5rem;
                            width: 100%;
                            gap: 1rem;
                          "
                        >
                          <span
                            class="fi"
                            :class="['fi-' + option.value.toLowerCase()]"
                          />
                          <span class="pl-2">
                            {{ option.label }}
                          </span>
                        </div>
                      </MazSelect>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <!-- <VueMultiselect
                      v-model="input.city"
                      :options="resource.city"
                      placeholder="Current City"
                    /> -->
                    <div class="location-input">
                      <v-combobox
                        v-model="input.city"
                        :items="resource.city"
                        variant="outlined"
                        label="Select City"
                        clearable
                        class="mt-n1"
                        density="compact"
                        :rules="rules.cityRules"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mb-n8 pb-2">
                  <v-col cols="6">
                    <!-- <VueMultiselect
                      v-model="input.town"
                      class="mt-2"
                      :options="resource.town"
                      placeholder="Current Town"
                    /> -->
                    <div class="location-input">
                      <v-combobox
                        v-model="input.town"
                        :items="resource.town"
                        variant="outlined"
                        label="Select Town (Optional)"
                        clearable
                        class="mt-n1"
                        density="compact"
                      />
                    </div>
                  </v-col>
                </v-row>
                <hr class="mt-8" />
              </v-container>
              <!-- <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n4"
                >
                  <p class="title-card">Nearest Mall</p>
                  <v-btn
                    class="text-none text-subtitle-1"
                    color="success"
                    size="large"
                    variant="flat"
                  >
                    Save Changes
                  </v-btn>
                </div>
                <v-row
                  style="border-bottom: 1px solid rgb(189, 189, 189)"
                  class="mb-2 pb-2"
                >
                  <v-col cols="6">
                    <VueMultiselect
                      v-model="input.nearest"
                      class="mt-2"
                      :options="resource.nearest"
                      placeholder="Select Nearest Mall"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n4"
                >
                  <p class="title-card">Favorite Malls</p>
                  <v-spacer />
                </div>
                <v-row>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite1"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite2"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite3"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                </v-row>
              </v-container> -->
            </v-card-text>
          </v-card>
        </div>
      </template>
      <template v-if="isSmall">
        <div class="mobile-container pb-16">
          <input
            ref="filePickerField"
            type="file"
            accept="image/*"
            hidden
            @change="launchCropper"
          />
          <div class="image-container d-flex justify-center w-100 w-100 mb-4">
            <!-- <v-img
                    style="width: 100%; height: 100%; border-radius: 20px"
                    :src="
                      image_path != ''
                        ? image_path
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                  /> -->
            <div>
              <div
                style="width: 170px; height: 120px; border-radius: 20px"
                class="mt-5"
              >
                <v-img
                  style="width: 100%; height: 100%; border-radius: 20px"
                  cover
                  :src="
                    image_path
                      ? image_path
                      : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                  "
                />
              </div>
              <div
                class="mt-4 d-flex align-center"
                :class="{
                  'justify-space-between': image_path,
                  'justify-center': !image_path,
                }"
              >
                <v-btn
                  size="small"
                  color="blue"
                  variant="outlined"
                  :disabled="image_path"
                  @click="$refs.filePickerField.click()"
                >
                  {{ !isSaveImage ? "Upload Picture" : "Saving Image" }}
                </v-btn>
                <v-icon
                  v-if="image_path"
                  color="red"
                  icon="mdi-trash-can-outline"
                  @click="deleteImage()"
                />
              </div>
              <!-- <image-cropper-dialog
                ref="cropperDialog"
                :chosen-image="image"
                @onReset="$refs.filePickerField.value = null"
                @onCrop="
                  (croppedImage) => {
                    image_path = croppedImage;
                  }
                "
              /> -->
            </div>
          </div>
          <v-row>
            <v-col>
              <label>Name</label>
              <input
                v-model="input.name"
                type="text"
                required
                class="form-control mt-2"
                placeholder="Enter Your Full Name"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>
                <div class="d-flex" style="gap: 5px">
                  <span>Email</span>
                  <span
                    :class="{
                      'text-red': !isEmailVerified,
                      'text-green': isEmailVerified,
                    }"
                    >{{
                      isEmailVerified ? "(Verified)" : "(Not Verified)"
                    }}</span
                  >
                  <div v-if="!isEmailVerified" class="d-flex" style="gap: 5px">
                    <span
                      v-if="!isVerifying"
                      class="text-green cursor-pointer"
                      @click="verifyEmail()"
                      >(Verify Now)</span
                    >
                    <span v-if="isVerifying" class="text-green"
                      >(Verify Now)</span
                    >
                    <span
                      class="text-blue-accent-4 cursor-pointer"
                      @click="isWhy = true"
                      >Why ?</span
                    >
                  </div>
                </div>
              </label>
              <div v-if="isEmailOTP" class="w-100 d-flex" style="gap: 10px">
                <input
                  v-model="input.emailOTP"
                  maxlength="4"
                  type="number"
                  class="form-control mt-4 w-50"
                  placeholder="Enter OTP"
                  @input="handleInputOTP"
                />
                <v-btn
                  :disabled="!input.emailOTP || isSending"
                  :loading="isSending"
                  class="text-none text-subtitle-1 mt-4 w-50"
                  color="primary"
                  variant="flat"
                  @click="saveEmailOTP()"
                >
                  Update
                </v-btn>
              </div>
              <div
                class="d-flex align-center mt-2 py-0 back-grey"
                style="border: 1px solid #ced4da; border-radius: 0.25rem"
              >
                <input
                  v-model="input.email"
                  type="email"
                  disabled
                  class="form-control"
                  style="border: none"
                  placeholder="Enter Email"
                />
                <span
                  class="text-blue-darken-4 mx-2"
                  style="cursor: pointer"
                  @click="isChangeEmail = !isChangeEmail"
                >
                  Change
                </span>
              </div>
              <div v-if="isChangeEmail">
                <input
                  v-model="input.emailNew"
                  type="email"
                  class="form-control mt-4"
                  placeholder="Enter Email"
                />
                <v-btn
                  class="text-none text-subtitle-1 mt-4"
                  color="success"
                  variant="flat"
                  @click="saveEmail()"
                >
                  Save Changes
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label
                >Contact Number
                <span
                  :class="{
                    'text-red': !isPhoneVerified,
                    'text-green': isPhoneVerified,
                  }"
                  >{{ isPhoneVerified ? "(Verified)" : "(Not Verified)" }}</span
                ></label
              >
              <div
                class="d-flex align-center mt-2 py-0 back-grey"
                style="border: 1px solid #ced4da; border-radius: 0.25rem"
              >
                <input
                  v-model="input.phone"
                  type="text"
                  required
                  disabled
                  class="form-control"
                  style="border: none"
                  placeholder="Phone Number"
                />
                <span
                  class="text-blue-darken-4 mx-2"
                  style="cursor: pointer"
                  @click="isChangePhone = !isChangePhone"
                >
                  Change
                </span>
              </div>
              <div v-if="isChangePhone" class="mt-2">
                <MazPhoneNumberInput
                  v-model="input.phoneNew"
                  show-code-on-list
                  color="info"
                  :default-country-code="input.country ? input.country : 'SG'"
                  :preferred-countries="['SG', 'BD', 'IN', 'MY', 'GB', 'PH']"
                  @update="phoneEvent2 = $event"
                />
                <v-btn
                  class="text-none text-subtitle-1 text-white w-100 mt-3"
                  color="#F0882D"
                  variant="flat"
                  @click="saveMobile()"
                >
                  Save
                </v-btn>
              </div>
              <v-alert
                v-model="isMobileChanged"
                class="my-2"
                type="success"
                :text="successMessage"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Password </label>
              <div
                class="d-flex align-center mt-2 py-0 back-grey"
                style="border: 1px solid #ced4da; border-radius: 0.25rem"
              >
                <input
                  v-model="input.password"
                  type="password"
                  required
                  disabled
                  class="form-control"
                  :class="{ 'w-66 mr-2': !input.password }"
                  style="border: none"
                  placeholder="Enter Password"
                  maxlength="8"
                />
                <span
                  v-if="!isLoading"
                  class="text-blue-darken-4 mx-2"
                  style="cursor: pointer"
                  @click="isChangePassword = !isChangePassword"
                >
                  {{ input.password ? "Change" : "Create New" }}
                </span>
              </div>
              <div v-if="isChangePassword">
                <div
                  class="d-flex align-center mt-4 py-0"
                  style="border: 1px solid #ced4da; border-radius: 0.25rem"
                >
                  <input
                    v-model="input.passwordNew"
                    :type="!showPassword1 ? 'password' : 'text'"
                    required
                    class="form-control"
                    style="border: none"
                    placeholder="Enter Password"
                    maxlength="8"
                  />
                  <span
                    class="toggle-password mr-4 ml-2 mdi"
                    :class="{
                      'mdi-eye': showPassword1,
                      'mdi-eye-off': !showPassword1,
                    }"
                    style="cursor: pointer; font-size: 26px"
                    @click="showPassword1 = !showPassword1"
                  />
                </div>
                <h6 v-if="isPassword1 == false" class="w-100 mb-2 text-red">
                  Password must be 8 characters
                </h6>
                <template v-if="input.password">
                  <div
                    class="d-flex align-center mt-4 py-0"
                    style="border: 1px solid #ced4da; border-radius: 0.25rem"
                  >
                    <input
                      v-model="input.passwordConfirm"
                      :type="!showPassword2 ? 'password' : 'text'"
                      required
                      class="form-control"
                      style="border: none"
                      placeholder="Re-enter Password"
                      maxlength="8"
                    />
                    <span
                      class="toggle-password mr-4 ml-2 mdi"
                      :class="{
                        'mdi-eye': showPassword2,
                        'mdi-eye-off': !showPassword2,
                      }"
                      style="cursor: pointer; font-size: 26px"
                      @click="showPassword2 = !showPassword2"
                    />
                  </div>
                  <h6 v-if="isPassword2 == false" class="w-100 mb-2 text-red">
                    {{ password2Mes }}
                  </h6>
                </template>
                <v-btn
                  class="text-none text-subtitle-1"
                  :class="{ 'mt-4': isPassword2, 'mt-n2': !isPassword2 }"
                  color="success"
                  variant="flat"
                  @click="changePassword()"
                >
                  Save Changes
                </v-btn>
              </div>

              <v-alert
                v-model="isPasswordChanged"
                class="my-2"
                type="success"
                :text="successMessage"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <label
                >Birth Date (<span>{{ age }} Years</span>)</label
              >
              <input
                id="dateInput"
                v-model="input.date"
                required
                class="form-control mt-2"
                type="text"
                placeholder="DD/MM/YYYY"
                @input="onDateInput"
              />
            </v-col>
            <v-col cols="6">
              <div class="w-100 text-center">
                <label class="mx-auto">Gender</label>
              </div>

              <v-radio-group
                v-model="input.gender2"
                :rules="rules.genderRules"
                inline
                class="mt-3 ml-n4"
                style="font-size: 12px !important"
              >
                <v-radio
                  style="font-size: 10px !important"
                  label="Male"
                  value="M"
                />
                <v-radio
                  style="font-size: 10px !important"
                  label="Female"
                  value="F"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row class="mt-n10">
            <v-col>
              <label>Nationality</label>
              <VueMultiselect
                v-model="input.nationality"
                class="mt-2"
                :options="resource.nationality"
                track-by="id"
                label="title"
                placeholder="Select Nationality"
                @select="onInputNationality()"
              />
              <!-- <v-select
                v-model="input.nationality"
                :items="resource.nationality"
                placeholder="Select Nationality"
                variant="outlined"
                clearable
                class="mt-2"
                density="compact"
                :rules="rules.nationalityRules"
              /> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Marital Status</label>
              <VueMultiselect
                v-model="input.marital"
                class="mt-2"
                :options="resource.marital"
                track-by="value"
                label="title"
                placeholder="Select Marital Status"
              />
            </v-col>
          </v-row>
          <v-container
            style="position: fixed; bottom: 1.5rem; left: 0; z-index: 99999"
            class="d-flex justify-center align-center"
          >
            <v-btn
              class="text-none text-subtitle-1"
              color="success"
              size="large"
              variant="flat"
              @click="saveData()"
            >
              Save Changes
            </v-btn>
          </v-container>
        </div>
      </template>
      <div class="crop-image-dialog">
        <v-dialog v-model="showCropper" max-width="500" persistent>
          <v-card class="pt-6 pb-3">
            <v-card-text class="pb-3">
              <vue-cropper
                ref="cropper"
                class="image-container"
                :aspect-ratio="1 / 1"
                :guides="true"
                :background="false"
                :view-mode="3"
                drag-mode="move"
                :src="image"
                alt="Image not available"
              />
            </v-card-text>
            <v-card-actions class="py-0 mx-10">
              <v-btn text color="red" @click="resetCropper"> Cancel </v-btn>
              <v-spacer />
              <v-btn text color="blue" @click="cropChosenImage"> Crop </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-snackbar
        v-model="isSuccess"
        location="top"
        color="green"
        :timeout="3000"
      >
        {{ successMessage }}

        <template #actions>
          <v-btn color="white" variant="text" @click="isSuccess = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="isError" location="top" color="red" :timeout="3000">
        {{ errorMessage }}

        <template #actions>
          <v-btn color="white" variant="text" @click="isError = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-dialog v-model="isWhy" persistent width="auto">
        <v-card width="350">
          <v-card-text class="">
            <p class="my-4">
              We need to verify your email so we can make sure it is you and
              avoid scammers
            </p>
            <v-btn class="mb-4 w-100 bg-primary" @click="isWhy = false">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isVerifySent" persistent width="auto">
        <v-card width="350">
          <v-card-text class="">
            <h4>Verify Email</h4>
            <p class="my-4">Enter the 4 digit OTP sent to your email</p>
            <v-btn class="mb-4 w-100 bg-primary" @click="isVerifySent = false">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isVerifySuccess" persistent width="auto">
        <v-card width="350">
          <v-card-text class="">
            <h4 class="mt-4 mb-8">Email Verified Successfully</h4>
            <v-btn class="mb-4 w-100 bg-primary" @click="verifySuccess()">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
    <input
      ref="fileuploadinput"
      style="opacity: 0; filter: alpha(opacity=0)"
      type="file"
      accept="image/png, image/jpeg"
      @change="onFileChangeInput"
    />
  </div>
</template>

<script>
// import VueAvatarCropper from "vue-avatar-cropper";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import app from "@/util/eventBus";
// import ImageCropperDialog from "../components/ImageCropperDialog.vue";
import axios from "@/util/axios";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
import MazSelect from "maz-ui/components/MazSelect";
export default {
  components: {
    VueMultiselect,
    MazPhoneNumberInput,
    // ImageCropperDialog,
    MazSelect,
    VueCropper,
  },
  data() {
    return {
      options: [
        { value: "SG", label: "Singapore" },
        { value: "BD", label: "Bangladesh" },
        { value: "IN", label: "India" },
        { value: "MY", label: "Malaysia" },
        { value: "GB", label: "United Kingdom" },
        { value: "PH", label: "Philippines" },
        { value: "AF", label: "Afghanistan" },
        { value: "AX", label: "Aland Islands" },
        { value: "AL", label: "Albania" },
        { value: "DZ", label: "Algeria" },
        { value: "AS", label: "American Samoa" },
        { value: "AD", label: "Andorra" },
        { value: "AO", label: "Angola" },
        { value: "AI", label: "Anguilla" },
        { value: "AQ", label: "Antarctica" },
        { value: "AG", label: "Antigua And Barbuda" },
        { value: "AR", label: "Argentina" },
        { value: "AM", label: "Armenia" },
        { value: "AW", label: "Aruba" },
        { value: "AU", label: "Australia" },
        { value: "AT", label: "Austria" },
        { value: "AZ", label: "Azerbaijan" },
        { value: "BS", label: "Bahamas" },
        { value: "BH", label: "Bahrain" },
        { value: "BB", label: "Barbados" },
        { value: "BY", label: "Belarus" },
        { value: "BE", label: "Belgium" },
        { value: "BZ", label: "Belize" },
        { value: "BJ", label: "Benin" },
        { value: "BM", label: "Bermuda" },
        { value: "BT", label: "Bhutan" },
        { value: "BO", label: "Bolivia" },
        { value: "BA", label: "Bosnia And Herzegovina" },
        { value: "BW", label: "Botswana" },
        { value: "BV", label: "Bouvet Island" },
        { value: "BR", label: "Brazil" },
        { value: "IO", label: "British Indian Ocean Territory" },
        { value: "BN", label: "Brunei Darussalam" },
        { value: "BG", label: "Bulgaria" },
        { value: "BF", label: "Burkina Faso" },
        { value: "BI", label: "Burundi" },
        { value: "KH", label: "Cambodia" },
        { value: "CM", label: "Cameroon" },
        { value: "CA", label: "Canada" },
        { value: "CV", label: "Cape Verde" },
        { value: "KY", label: "Cayman Islands" },
        { value: "CF", label: "Central African Republic" },
        { value: "TD", label: "Chad" },
        { value: "CL", label: "Chile" },
        { value: "CN", label: "China" },
        { value: "CX", label: "Christmas Island" },
        { value: "CC", label: "Cocos (Keeling) Islands" },
        { value: "CO", label: "Colombia" },
        { value: "KM", label: "Comoros" },
        { value: "CG", label: "Congo" },
        { value: "CD", label: "Congo, Democratic Republic" },
        { value: "CK", label: "Cook Islands" },
        { value: "CR", label: "Costa Rica" },
        { value: "CI", label: "Cote D'Ivoire" },
        { value: "HR", label: "Croatia" },
        { value: "CU", label: "Cuba" },
        { value: "CY", label: "Cyprus" },
        { value: "CZ", label: "Czech Republic" },
        { value: "DK", label: "Denmark" },
        { value: "DJ", label: "Djibouti" },
        { value: "DM", label: "Dominica" },
        { value: "DO", label: "Dominican Republic" },
        { value: "EC", label: "Ecuador" },
        { value: "EG", label: "Egypt" },
        { value: "SV", label: "El Salvador" },
        { value: "GQ", label: "Equatorial Guinea" },
        { value: "ER", label: "Eritrea" },
        { value: "EE", label: "Estonia" },
        { value: "ET", label: "Ethiopia" },
        { value: "FK", label: "Falkland Islands (Malvinas)" },
        { value: "FO", label: "Faroe Islands" },
        { value: "FJ", label: "Fiji" },
        { value: "FI", label: "Finland" },
        { value: "FR", label: "France" },
        { value: "GF", label: "French Guiana" },
        { value: "PF", label: "French Polynesia" },
        { value: "TF", label: "French Southern Territories" },
        { value: "GA", label: "Gabon" },
        { value: "GM", label: "Gambia" },
        { value: "GE", label: "Georgia" },
        { value: "DE", label: "Germany" },
        { value: "GH", label: "Ghana" },
        { value: "GI", label: "Gibraltar" },
        { value: "GR", label: "Greece" },
        { value: "GL", label: "Greenland" },
        { value: "GD", label: "Grenada" },
        { value: "GP", label: "Guadeloupe" },
        { value: "GU", label: "Guam" },
        { value: "GT", label: "Guatemala" },
        { value: "GG", label: "Guernsey" },
        { value: "GN", label: "Guinea" },
        { value: "GW", label: "Guinea-Bissau" },
        { value: "GY", label: "Guyana" },
        { value: "HT", label: "Haiti" },
        { value: "HM", label: "Heard Island & Mcdonald Islands" },
        { value: "VA", label: "Holy See (Vatican City State)" },
        { value: "HN", label: "Honduras" },
        { value: "HK", label: "Hong Kong" },
        { value: "HU", label: "Hungary" },
        { value: "IS", label: "Iceland" },
        { value: "ID", label: "Indonesia" },
        { value: "IR", label: "Iran, Islamic Republic Of" },
        { value: "IQ", label: "Iraq" },
        { value: "IE", label: "Ireland" },
        { value: "IM", label: "Isle Of Man" },
        { value: "IL", label: "Israel" },
        { value: "IT", label: "Italy" },
        { value: "JM", label: "Jamaica" },
        { value: "JP", label: "Japan" },
        { value: "JE", label: "Jersey" },
        { value: "JO", label: "Jordan" },
        { value: "KZ", label: "Kazakhstan" },
        { value: "KE", label: "Kenya" },
        { value: "KI", label: "Kiribati" },
        { value: "KR", label: "Korea" },
        { value: "KW", label: "Kuwait" },
        { value: "KG", label: "Kyrgyzstan" },
        { value: "LA", label: "Lao People's Democratic Republic" },
        { value: "LV", label: "Latvia" },
        { value: "LB", label: "Lebanon" },
        { value: "LS", label: "Lesotho" },
        { value: "LR", label: "Liberia" },
        { value: "LY", label: "Libyan Arab Jamahiriya" },
        { value: "LI", label: "Liechtenstein" },
        { value: "LT", label: "Lithuania" },
        { value: "LU", label: "Luxembourg" },
        { value: "MO", label: "Macao" },
        { value: "MK", label: "Macedonia" },
        { value: "MG", label: "Madagascar" },
        { value: "MW", label: "Malawi" },
        { value: "MV", label: "Maldives" },
        { value: "ML", label: "Mali" },
        { value: "MT", label: "Malta" },
        { value: "MH", label: "Marshall Islands" },
        { value: "MQ", label: "Martinique" },
        { value: "MR", label: "Mauritania" },
        { value: "MU", label: "Mauritius" },
        { value: "YT", label: "Mayotte" },
        { value: "MX", label: "Mexico" },
        { value: "FM", label: "Micronesia, Federated States Of" },
        { value: "MD", label: "Moldova" },
        { value: "MC", label: "Monaco" },
        { value: "MN", label: "Mongolia" },
        { value: "ME", label: "Montenegro" },
        { value: "MS", label: "Montserrat" },
        { value: "MA", label: "Morocco" },
        { value: "MZ", label: "Mozambique" },
        { value: "MM", label: "Myanmar" },
        { value: "NA", label: "Namibia" },
        { value: "NR", label: "Nauru" },
        { value: "NP", label: "Nepal" },
        { value: "NL", label: "Netherlands" },
        { value: "AN", label: "Netherlands Antilles" },
        { value: "NC", label: "New Caledonia" },
        { value: "NZ", label: "New Zealand" },
        { value: "NI", label: "Nicaragua" },
        { value: "NE", label: "Niger" },
        { value: "NG", label: "Nigeria" },
        { value: "NU", label: "Niue" },
        { value: "NF", label: "Norfolk Island" },
        { value: "MP", label: "Northern Mariana Islands" },
        { value: "NO", label: "Norway" },
        { value: "OM", label: "Oman" },
        { value: "PK", label: "Pakistan" },
        { value: "PW", label: "Palau" },
        { value: "PS", label: "Palestinian Territory, Occupied" },
        { value: "PA", label: "Panama" },
        { value: "PG", label: "Papua New Guinea" },
        { value: "PY", label: "Paraguay" },
        { value: "PE", label: "Peru" },
        { value: "PN", label: "Pitcairn" },
        { value: "PL", label: "Poland" },
        { value: "PT", label: "Portugal" },
        { value: "PR", label: "Puerto Rico" },
        { value: "QA", label: "Qatar" },
        { value: "RE", label: "Reunion" },
        { value: "RO", label: "Romania" },
        { value: "RU", label: "Russian Federation" },
        { value: "RW", label: "Rwanda" },
        { value: "BL", label: "Saint Barthelemy" },
        { value: "SH", label: "Saint Helena" },
        { value: "KN", label: "Saint Kitts And Nevis" },
        { value: "LC", label: "Saint Lucia" },
        { value: "MF", label: "Saint Martin" },
        { value: "PM", label: "Saint Pierre And Miquelon" },
        { value: "VC", label: "Saint Vincent And Grenadines" },
        { value: "WS", label: "Samoa" },
        { value: "SM", label: "San Marino" },
        { value: "ST", label: "Sao Tome And Principe" },
        { value: "SA", label: "Saudi Arabia" },
        { value: "SN", label: "Senegal" },
        { value: "RS", label: "Serbia" },
        { value: "SC", label: "Seychelles" },
        { value: "SL", label: "Sierra Leone" },
        { value: "SK", label: "Slovakia" },
        { value: "SI", label: "Slovenia" },
        { value: "SB", label: "Solomon Islands" },
        { value: "SO", label: "Somalia" },
        { value: "ZA", label: "South Africa" },
        { value: "GS", label: "South Georgia And Sandwich Isl." },
        { value: "ES", label: "Spain" },
        { value: "LK", label: "Sri Lanka" },
        { value: "SD", label: "Sudan" },
        { value: "SR", label: "Suriname" },
        { value: "SJ", label: "Svalbard And Jan Mayen" },
        { value: "SZ", label: "Swaziland" },
        { value: "SE", label: "Sweden" },
        { value: "CH", label: "Switzerland" },
        { value: "SY", label: "Syrian Arab Republic" },
        { value: "TW", label: "Taiwan" },
        { value: "TJ", label: "Tajikistan" },
        { value: "TZ", label: "Tanzania" },
        { value: "TH", label: "Thailand" },
        { value: "TL", label: "Timor-Leste" },
        { value: "TG", label: "Togo" },
        { value: "TK", label: "Tokelau" },
        { value: "TO", label: "Tonga" },
        { value: "TT", label: "Trinidad And Tobago" },
        { value: "TN", label: "Tunisia" },
        { value: "TR", label: "Turkey" },
        { value: "TM", label: "Turkmenistan" },
        { value: "TC", label: "Turks And Caicos Islands" },
        { value: "TV", label: "Tuvalu" },
        { value: "UG", label: "Uganda" },
        { value: "UA", label: "Ukraine" },
        { value: "AE", label: "United Arab Emirates" },
        { value: "US", label: "United States" },
        { value: "UM", label: "United States Outlying Islands" },
        { value: "UY", label: "Uruguay" },
        { value: "UZ", label: "Uzbekistan" },
        { value: "VU", label: "Vanuatu" },
        { value: "VE", label: "Venezuela" },
        { value: "VN", label: "Viet Nam" },
        { value: "VG", label: "Virgin Islands}, British" },
        { value: "VI", label: "Virgin Islands}, U.S." },
        { value: "WF", label: "Wallis And Futuna" },
        { value: "EH", label: "Western Sahara" },
        { value: "YE", label: "Yemen" },
        { value: "ZM", label: "Zambia" },
        { value: "ZW", label: "Zimbabwe" },
      ],
      isWhy: false,
      isVerifySent: false,
      isVerifySuccess: false,
      chosenImage: null,
      showCropper: false,
      imageFileType: null,
      isSending: false,
      isVerifying: false,
      isLoading: false,
      screenWidth: window.innerWidth,
      isEmailVerified: false,
      isEmailOTP: false,
      isPhoneVerified: false,
      isChangePassword: false,
      isMobileChanged: false,
      isPasswordChanged: false,
      isPassword1: true,
      isPassword2: true,
      password2Mes: "",
      phoneEvent: null,
      phoneEvent2: null,
      isSaveImage: false,
      isChangePhone: false,
      isChangeEmail: false,
      showPassword1: false,
      showPassword2: false,
      menuOpen: false,
      isError: false,
      isSuccess: false,
      errorMessage: "",
      successMessage: "",
      image_path: "",
      image: null,
      imageSend: null,
      input: {
        id: null,
        image_path: "",
        image: null,
        gender: null,
        gender2: null,
        marital: null,
        nationality: null,
        name: "",
        email: "",
        emailOTP: null,
        emailNew: "",
        countryCode: null,
        phone: "",
        phoneNew: "",
        password: "",
        passwordNew: "",
        passwordConfirm: "",
        date: null,
        age: "",

        town: null,
        city: null,
        country: null,
        countryName: null,
      },
      rules: {
        nameRules: [
          (value) => {
            if (value) return true;
            return "Name is required.";
          },
          (value) => {
            if (value?.length >= 4) return true;
            return "Username must be more than 4 characters.";
          },
          (value) => {
            if (value?.length <= 20) return true;
            return "Username must be less than 20 characters.";
          },
        ],
        emailRules: [
          (value) => {
            if (value) return true;
            return "E-mail is required.";
          },
          (value) => {
            if (/.+@.+\..+/.test(value)) return true;
            return "E-mail must be valid.";
          },
        ],
        phoneRules: [(v) => !!v || "Phone number is required"],
        passwordRules: [(v) => !!v || "Password is required"],
        dateRules: [(v) => !!v || "Birth Date is required"],
        genderRules: [(v) => !!v || "Gender is required"],
        maritalRules: [(v) => !!v || "Marital Status is required"],
        nationalityRules: [(v) => !!v || "Nationality is required"],
        nearestRules: [(v) => !!v || "Nearest Mall is required"],
        townRules: [(v) => !!v || "Town is required"],
        cityRules: [(v) => !!v || "City is required"],
        countryRules: [(v) => !!v || "Country is required"],
      },
      phoneNumberCounter: {
        value: 0,
        counterSize: 10,
      },
      resource: {
        gender: [
          // "Male",
          // "Female",
          { title: "Male", value: "M" },
          { title: "Female", value: "F" },
        ],
        marital: [
          // "Single",
          // "Married",
          // "Others",
          { title: "Single", value: "S" },
          { title: "Married", value: "M" },
        ],
        nationality: [],
        countryCodes: [],
        favorite: [],
        town: [],
        city: ["Alexandra", "Ang Mo Kio", "Bedok", "Bukit Panjang"],
        country: ["Singapore"],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    age() {
      if (!this.input.date) return null;

      const [day, month, year] = this.input.date.split("/").map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

      const today = new Date();
      const birthDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
  },
  watch: {
    "input.country": function (newVal, oldVal) {
      const country = this.options.filter((o) => o.value === newVal)[0];
      // console.log(country?.label);
      this.input.countryName = country?.label;
      this.getCity(country?.label);
    },
    "input.city": function (newVal, oldVal) {
      // console.log(newVal.id);
      this.getTown(newVal?.id);
    },
    "input.passwordNew": function (newVal) {
      if (newVal) {
        this.isPassword1 = true;
      }
    },
    "input.passwordConfirm": function (newVal) {
      if (newVal) {
        this.isPassword2 = true;
      }
    },
  },
  created() {},
  mounted() {
    window.addEventListener("resize", this.handleResize);
    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "My Profile",
    );
    this.getCity();
    this.getTown();
    this.getNationality();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleInputOTP(event) {
      // Allow only the first 4 digits
      if (event.target.value.length > 4) {
        event.target.value = event.target.value.slice(0, 4);
      }
      this.input.emailOTP = event.target.value;
    },
    verifyEmail() {
      // console.log(this.tokenProvider);
      // return;
      this.isVerifying = true;
      const token = localStorage.getItem("token");
      axios
        .post(
          `/gypsy/send-verification-email`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                this.tokenProvider ? this.tokenProvider : token
              }`,
              "Content-Type": "multipart/form-data",
            },
          },
        )
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isEmailOTP = true;
          this.isVerifySent = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.email_id
            ? error.response.data.email_id[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isVerifying = false;
        });
    },
    verifySuccess() {
      this.input.emailOTP = null;
      this.isVerifySuccess = false;
      this.isEmailOTP = false;
      this.isEmailVerified = true;
    },
    saveEmailOTP() {
      this.isSending = true;
      const payload = {
        verify_email_otp: this.input.emailOTP,
      };
      const token = localStorage.getItem("token");
      axios
        .post(`/gypsy/validate-verify-email-otp`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isVerifySuccess = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.verify_email_otp
            ? "Wrong OTP"
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    async initCropper(imageFileType) {
      this.showCropper = true;
      this.imageFileType = imageFileType;
      await new Promise((resolve) => setTimeout(resolve, 50));
      this.$refs.cropper.replace(this.image);
    },

    async resetCropper() {
      this.$refs.filePickerField.value = null;
      this.showCropper = false;
    },

    async cropChosenImage() {
      // this.$emit(
      //   "onCrop",
      this.image_path = this.$refs.cropper
        .getCroppedCanvas()
        .toDataURL(this.imageFileType);
      // );
      this.saveImage();
      this.resetCropper();
    },
    onInputNationality() {
      // console.log("ok", this.input.nationality);
    },
    getTown(id) {
      axios
        .get(`/town-list`)
        .then((response) => {
          const data = response.data.data;
          // console.log(id);
          if (id) {
            this.resource.town = data
              .filter((i) => i.city_id == id)
              .map((town) => {
                return {
                  id: town.town_id,
                  title: town.town_name,
                  city_id: town.city_id,
                  path: "#",
                };
              });
          } else {
            this.resource.town = data.map((town) => {
              return {
                id: town.town_id,
                title: town.town_name,
                city_id: town.city_id,
                path: "#",
              };
            });
          }
          // console.log(this.resource.town);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getCity(country_name) {
      axios
        .get(`/city`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          if (country_name) {
            this.resource.city = data
              .filter((i) => i.country_name == country_name)
              .map((city) => {
                return {
                  id: city.city_id,
                  title: city.city_name,
                  path: "#",
                };
              });
          } else {
            this.resource.city = data.map((city) => {
              return {
                id: city.city_id,
                title: city.city_name,
                prefix: city.prefix,
                path: "#",
              };
            });
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    getNationality() {
      this.isLoading = true;
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.nationality = data.map((country) => {
            return {
              id: country.country_id,
              title: country.nationality,
            };
          });

          this.resource.country = data.map((country) => {
            return {
              id: country.country_id,
              title: country.country_name,
            };
          });
          this.getUserData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getUserData() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          // this.input.nationality = this.resource.nationality.filter(
          //   (i) => i.id == 2
          // )[0];
          // this.input.marital = this.resource.marital.filter(
          //   (i) => i.value == "S"
          // )[0];
          // this.input.gender = this.resource.gender.filter(
          //   (i) => i.value == "F"
          // )[0];
          // this.input.gender2 = "F";

          // country_current: 28,
          // date_of_birth: null,
          // gender: "M",
          // image: "cea8b5aca2c523ec0b425738e4d80b3d.jpg",
          // last_login: "11/09/2023",
          // marital_status: null,

          this.image_path =
            data.image != null ? this.$fileURL + data.image : null;
          this.input = {
            id: data.gypsy_id,
            image_path: "",
            image: null,
            gender: this.resource.gender.filter(
              (i) => i.value == data.gender,
            )[0],
            gender2: data.gender || null,
            marital: this.resource.marital.filter(
              (i) => i.value == data.marital_status,
            )[0],
            nationality: this.resource.nationality.filter(
              (i) => i.id == data.nationality,
            )[0],
            name: data.name,
            email: data.email_id,
            countryCode: null,
            phone: data.mobile_number,
            phoneNew: data.mobile_number,
            password: data.password ? "xxxxxxxx" : "",
            date: data.date_of_birth,
            age: "",

            town: this.resource.town.filter(
              (i) => i.id == data.town_current,
            )[0],
            city: this.resource.city.filter(
              (i) => i.id == data.city_current,
            )[0],
            country: this.options.filter(
              (i) => i.label == data.current_country_name,
            )[0].value,
          };
          this.isEmailVerified =
            data.email_verified == "N"
              ? false
              : data.email_verified == "Y"
                ? true
                : null;
          this.isPhoneVerified =
            data.mobile_verified == "N"
              ? false
              : data.mobile_verified == "Y"
                ? true
                : null;
          this.input.nationality = this.resource.nationality.filter(
            (i) => i.id == data.nationality,
          );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    saveData() {
      this.isSending = true;
      const payload = {
        // "marital_status":"M",
        // "country_current":1,
        // "image":[file upload]

        gypsy_id: this.input.id,
        name: this.input.name,
        // mobile_number: this.input.phoneNew || this.input.phone,
        // email_id: this.input.email,
        gender: this.input.gender.value,
        app_id: this.$appId,
        // password: this.input.password,
        marital_status: this.input.marital.value,
        date_of_birth: this.input.date,
        country_current: this.input.nationality.id,
        // image: this.imageSend || null,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveDataDesktop1() {
      this.isSending = true;
      const payload = {
        // "marital_status":"M",
        // "country_current":1,
        // "image":[file upload]

        gypsy_id: this.input.id,
        // name: this.input.name,
        // mobile_number: this.input.phoneNew || this.input.phone,
        // email_id: this.input.email,
        gender: this.input.gender.value,
        // app_id: this.$appId,
        // password: this.input.password,
        marital_status: this.input.marital.value,
        // date_of_birth: this.input.date,
        nationality: this.input.nationality.id,
        // image: this.imageSend || null,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveDataDesktop2() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        name: this.input.name,
        // mobile_number: this.input.phoneNew || this.input.phone,
        // email_id: this.input.email,
        date_of_birth: this.input.date,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveLocation() {
      this.isSending = true;
      const payload = {
        // country_current: this.input.country.id,
        country_current: this.input.countryName,
        country_prefix: this.input.country,
        country_code: this.phoneEvent?.countryCallingCode
          ? `+${this.phoneEvent.countryCallingCode}`
          : "+65",
        flag:
          "https://flagicons.lipis.dev/flags/4x3/" +
          this.input.country.toLowerCase() +
          ".svg",
        city_current: this.input.city.title
          ? this.input.city.title
          : this.input.city,
        town_current: this.input.town.title
          ? this.input.town.title
          : this.input.town,
      };
      // console.log(payload);
      // console.log(this.phoneEvent);
      const token = localStorage.getItem("token");
      axios
        .post(`/gypsy/save-current-location`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },

    saveEmail() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        email_id: this.input.emailNew,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          // this.getUserData();
          this.isChangeEmail = false;

          this.input.email = this.input.emailNew;
          this.input.emailNew = "";
          this.isEmailVerified = false;
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.email_id
            ? error.response.data.email_id[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveMobile() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        mobile_number: this.input.phoneNew || this.input.phone,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");

      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          // this.isSuccess = true;
          this.successMessage = "New Number Updated";
          this.isMobileChanged = true;
          this.isChangePhone = false;
          this.input.phone = this.input.phoneNew;
          setTimeout(() => {
            this.isMobileChanged = false;
            this.isSending = false;
          }, 5000);
          this.input.phoneNew = "";
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    deleteImage() {
      this.isSending = true;
      const token = localStorage.getItem("token");
      axios
        .delete(`/gypsy/image`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          app.config.globalProperties.$eventBus.$emit("getHeaderUserData");
          this.getUserData();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveImage() {
      this.isSaveImage = true;
      const payload = {
        // "marital_status":"M",
        // "country_current":1,
        // "image":[file upload]

        // name: this.input.name,
        // mobile_number: this.input.phoneNew || this.input.phone,
        // email_id: this.input.email,
        // gender: this.input.gender.value,
        // app_id: this.$appId,
        // // password: this.input.password,
        // marital_status: this.input.marital.value,
        // // date_of_birth: this.input.date,
        // country_current: this.input.nationality.id,
        gypsy_id: this.input.id,
        image: this.imageSend || null,
      };
      // console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          // console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          app.config.globalProperties.$eventBus.$emit(
            "changeHeaderImage",
            data.data.image,
          );
          // this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSaveImage = false;
        });
    },
    changePassword() {
      if (this.input.passwordNew?.length != 8) {
        this.isPassword1 = false;
      } else if (this.input.passwordNew?.length == 8) {
        this.isPassword1 = true;
      }
      if (this.input.password && this.input.passwordConfirm?.length != 8) {
        this.isPassword2 = false;
        this.password2Mes = "Password must be 8 characters";
      } else if (
        this.input.password &&
        this.input.passwordConfirm != this.input.passwordNew
      ) {
        this.isPassword2 = false;
        this.password2Mes = "Must be same with password above";
      } else if (
        this.input.password &&
        this.input.passwordConfirm?.length == 8
      ) {
        this.isPassword2 = true;
      }

      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        email_id: this.input.email,
        password: this.input.passwordNew,
      };
      const token = localStorage.getItem("token");
      if (this.isPassword1 == true && this.isPassword2 == true) {
        axios
          .post(`/gypsy-change-password`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const data = response.data;
            // console.log(data);
            // localStorage.setItem("name", data.data.name);
            // localStorage.setItem("email", data.data.email_id);
            // localStorage.setItem("g_id", data.data.gypsy_ref_no);
            // localStorage.setItem("user_image", data.data.image);
            // localStorage.setItem("last_login", data.data.last_login);
            // localStorage.setItem("token", data.data.token);
            // this.isSuccess = true;
            this.input.password = this.input.passwordNew;
            this.successMessage = data.message;
            this.isChangePassword = false;
            this.isPasswordChanged = true;
            setTimeout(() => {
              this.isPasswordChanged = false;
            }, 5000);
            this.input.passwordNew = "";
            this.input.passwordConfirm = "";
            // this.email = "";
            // this.name = "";
            // this.country = null;
            // this.city = null;
            // this.mobile = "";
            // this.gender = "";
            // app.config.globalProperties.$eventBus.$emit(
            //   "changeHeaderWelcome",
            //   "Sign Up Completed"
            // );
            // this.nextStep();
            // this.getUserData();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.email_id
              ? error.response.data.email_id[0]
              : error.response.data.message === ""
                ? "Something Wrong!!!"
                : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
            this.isChangePassword = false;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    onFileChangeInput(e) {
      var files = e.target.files || e.dataTransfer.files;
      this.image = files[0];
      this.image_path = URL.createObjectURL(files[0]);
      // console.log(this.input);
    },
    async launchCropper(event) {
      if (!event) return;
      var file = event.target.files[0];
      this.image = await this.toBase64(file);
      this.imageSend = file;
      // if (this.imageSend != null) {
      //   this.saveImage();
      // }
      this.initCropper(file.type);
    },
    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    onDateInput() {
      const formattedDate = this.input.date.replace(/\D/g, "");

      // Memisahkan tanggal, bulan, dan tahun
      const day = formattedDate.substring(0, 2);
      const month = formattedDate.substring(2, 4);
      const year = formattedDate.substring(4, 8);

      // Memeriksa apakah tanggal, bulan, dan tahun valid
      if (day && month && year) {
        // Mengatur format tanggal yang sesuai dengan JavaScript (mm/dd/yyyy)
        this.input.date = `${month}/${day}/${year}`;
      } else {
        this.input.date = formattedDate; // Tidak valid, tetapkan nilai yang sama
      }
      // console.log(this.input.date);
    },
  },
};
</script>

<style scoped>
.image-container {
  max-width: 450px;
}

.image-container img {
  /* This is important */
  width: 100%;
}
.card-container {
  margin-top: 100px;
  width: 100%;
}

.first-section {
  width: 35%;
  height: 60%;
}

.second-section {
  width: 63%;
}

.card-title {
  background: #f7f7f7;
}

.avatar {
  width: 160px;
  border-radius: 50%;
}
.avatar-mobile {
  width: 90px;
}

.title-card {
  font-size: 20px;
  font-weight: 500;
}

.mobile-container {
  margin-top: 80px;
}

.form-control {
  display: block;
  width: 100%;
  border: 1px solid #ced4da;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 0.25rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

@media screen and (prefers-reduced-motion: reduce) {
  .form-control {
    transition: none;
  }
}

.form-control::-ms-expand {
  background-color: transparent;
  border: 0;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.form-control:-webkit-autofill {
  background-color: #fff;
}

.form-control::-webkit-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::-moz-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control:-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}

.loading-page {
  margin-top: 300px;
}

.back-grey {
  background: #e9ecef;
}

.location-input {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  height: 38px;
  position: relative;
  border: 1px solid rgb(160, 160, 160);
  border-radius: 5px;
}

@media (max-width: 599px) {
  .loading-page {
    margin-top: 450px;
  }
}
</style>
