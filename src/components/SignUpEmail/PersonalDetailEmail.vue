<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-end">
          <v-col :cols="isSmall ? '12' : '5'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : ''"
              class="mx-auto"
              :class="{
                'login-card px-12 pb-16': !isSmall,
                'login-card-mobile pb-16 px-2': isSmall,
              }"
            >
              <v-row>
                <v-col cols="12">
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
                    <div
                      style="
                        cursor: pointer;
                        position: absolute;
                        left: 0;
                        top: 15px;
                      "
                      @click="goBack"
                    >
                      <v-icon>mdi-arrow-left</v-icon>
                    </div>
                    <div>
                      <div
                        style="width: 150px; height: 150px; border-radius: 50%"
                        class="mt-5"
                      >
                        <v-img
                          style="width: 100%; height: 100%; border-radius: 50%"
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
                          @click="$refs.filePickerField.click()"
                        >
                          Upload Picture
                        </v-btn>
                        <v-icon
                          v-if="image_path"
                          @click="deleteImage()"
                          color="red"
                          icon="mdi-trash-can-outline"
                        >
                        </v-icon>
                      </div>
                      <image-cropper-dialog
                        ref="cropperDialog"
                        :chosen-image="image"
                        @onReset="$refs.filePickerField.value = null"
                        @onCrop="
                          (croppedImage) => {
                            image_path = croppedImage;
                          }
                        "
                      />
                    </div>
                  </div>
                  <v-form v-model="valid" @submit.prevent>
                    <div class="d-flex w-100 mb-2 justify-space-between">
                      <span
                        style="font-weight: 500"
                        class="w-50"
                        :class="{
                          'section-mobile ': isSmall,
                          'section-desktop': !isSmall,
                        }"
                        >Full Name</span
                      >
                    </div>
                    <input
                      v-model="name"
                      type="text"
                      required
                      class="form-control pl-2 mt-2 mb-4"
                      placeholder="Enter Your Full Name"
                    />
                    <h6 v-if="isName == false" class="w-100 mt-n4 text-red">
                      You must fill the name.
                    </h6>
                    <label
                      style="font-weight: 500"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      disabled
                      class="form-control pl-2 mt-2 mb-4"
                      placeholder="Enter Your Email Address"
                    />

                    <div class="d-flex justify-space-between">
                      <label
                        style="font-weight: 500"
                        :class="{
                          'section-mobile': isSmall,
                          'section-desktop ': !isSmall,
                        }"
                        >Where are you now</label
                      >
                    </div>

                    <div class="w-100 d-flex align-center">
                      <div
                        v-if="country"
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
                          :class="['fi-' + country.toLowerCase()]"
                        />
                      </div>
                      <MazSelect
                        v-slot="{ option }"
                        v-model="country"
                        label="Select Country"
                        item-height="40"
                        :options="options"
                        search
                        max-list-width="250"
                        search-placeholder="Search in country"
                        :class="{ 'ml-n1': country }"
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
                    <v-radio-group v-model="gender" inline>
                      <v-radio
                        :class="{
                          'mr-2': !isSmall,
                          'gender-small': isSmall,
                        }"
                        label="Male"
                        color="#005CC8"
                        value="M"
                      >
                        <template #label>
                          <span :class="{ 'gender-small': isSmall }">Male</span>
                        </template>
                      </v-radio>
                      <v-radio
                        :class="{
                          'gender-small': isSmall,
                        }"
                        color="#005CC8"
                        value="F"
                      >
                        <template #label>
                          <span :class="{ 'gender-small': isSmall }"
                            >Female</span
                          >
                        </template>
                      </v-radio>
                    </v-radio-group>
                    <h6
                      v-if="isGender == false"
                      class="w-100 mt-n11 mb-6 text-red"
                    >
                      You must choose gender.
                    </h6>
                    <div class="d-flex justify-space-between">
                      <label
                        style="font-weight: 500"
                        :class="{
                          'section-mobile mb-2': isSmall,
                          'section-desktop w-50 mb-2 ': !isSmall,
                        }"
                        >Mobile Number</label
                      >
                    </div>
                    <MazPhoneNumberInput
                      v-model="mobile"
                      show-code-on-list
                      color="info"
                      :default-country-code="country ? country : 'SG'"
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
                    <h6 v-if="isMobile == false" class="w-100 text-red">
                      You must fill the mobile number.
                    </h6>

                    <div class="d-flex align-center justify-start">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-66 login-btn-mobile mt-8 mb-6': isSmall,
                          'w-50 mt-8': !isSmall,
                        }"
                        @click="saveData()"
                      >
                        Next
                      </v-btn>
                    </div>
                  </v-form>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="isErrorPhone" max-width="500" persistent>
          <v-card class="pt-6 pb-3">
            <v-card-text class="pb-3">
              <span>{{ errorMessagePhone }}</span
              ><span class="text-blue-darken-4">{{ emailErrorPhone }}</span>
            </v-card-text>
            <v-card-actions class="py-0">
              <v-btn text color="blue" @click="isErrorPhone = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        <v-snackbar
          v-model="isError"
          location="top"
          color="red"
          :timeout="3000"
        >
          {{ errorMessage }}

          <template #actions>
            <v-btn color="white" variant="text" @click="isError = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from "@/util/axios";
import app from "@/util/eventBus";
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
import MazSelect from "maz-ui/components/MazSelect";
import ImageCropperDialog from "../ImageCropperDialog.vue";

export default {
  name: "PersonalDetailEmail",
  components: {
    MazPhoneNumberInput,
    MazSelect,
    ImageCropperDialog,
  },
  data() {
    return {
      isName: true,
      isGender: true,
      isMobile: true,
      valid: false,
      image: null,
      imageSend: null,
      image_path: "",
      name: "",
      email: "",
      country: "SG",
      gender: "",
      code: "",
      mobile: null,
      phoneEvent: null,
      screenWidth: window.innerWidth,
      isError: false,
      isErrorPhone: false,
      isSuccess: false,
      errorMessage: "",
      errorMessagePhone: "",
      successMessage: "",
      emailErrorPhone: "",
      resource: {
        code: [],
      },
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
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  watch: {
    name: function (newVal) {
      if (newVal) {
        this.isName = true;
      }
    },
    gender: function (newVal) {
      if (newVal) {
        this.isGender = true;
      }
    },
    mobile: function (newVal) {
      if (newVal) {
        this.isMobile = true;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    // http://127.0.0.1:3000/social-sign-up?social=Linkedin-openid&token=AQXU1SSjbJsVPkS_W1OXUhFknOBnsoZtvFStOKDxzpflfpTsvPnh-H9vemA8yEJAnI8wg8pyxOBzMsypz8pV7ibIu0mfMWae8aJT9bUYZE4LYLyvYTupaLWdG-zT5N4RSnwR3jsZBwHi_bf9Og6PC9ivTR9UdHBN5GbmQDnWK3yTN7ykFmUf72prhJ9JTP4ZSwV47L8ibgGi-w--bDhlTvKuBgeU2cEbzXnyYqaB-3dOYjFRYVb-t5zDRGuJJPEng7o-bXGLBhrE26N8TE_0wqC4z_BHnaCNcIiffBdPoErLae3kw_dc0H1shZHZoaTCApogFAVd_QqdmCLyXgUetuV_zJ3ErQ&name=Aji%20Prasetyo&avatar=https://media.licdn.com/dms/image/C5603AQFpUB0qnqPngg/profile-displayphoto-shrink_100_100/0/1633493208219?e=1700092800&v=beta&t=NjQ44W-k9N0rZmq99yEMVaTiri1OKazhny-u8hjNV-U&email=aji.2467@students.amikom.ac.id

    this.getCountryCode();

    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "Sign-up by Email",
    );
    this.email = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : "";
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    nextStep() {
      this.$emit("nextStep");
    },
    backStep() {
      this.$emit("backStep");
    },
    deleteImage() {
      this.image = null;
      this.imageSend = null;
      this.image_path = "";
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
      this.$refs.cropperDialog.initCropper(file.type);
    },

    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    goBack() {
      this.$emit("backStep");
    },
    hideEmail(email) {
      const atIndex = email.indexOf("@");
      if (atIndex >= 0) {
        const username = email.substring(0, atIndex);
        const hiddenPart = username
          .substring(0, Math.max(0, username.length - 6))
          .replace(/./g, "*");
        const visiblePart = username.substring(
          Math.max(0, username.length - 6),
        );
        return hiddenPart + visiblePart + email.substring(atIndex);
      } else {
        return email;
      }
    },
    saveData() {
      if (this.valid) {
        if (this.name == "") {
          this.isName = false;
        } else {
          this.isName = true;
        }
        if (this.gender == "") {
          this.isGender = false;
        } else {
          this.isGender = true;
        }
        if (this.mobile == null) {
          this.isMobile = false;
        } else {
          this.isMobile = true;
        }
        const countryName = this.options
          .filter((o) => o.value == this.country)
          .map((op) => op.label)[0];
        this.isSending = true;
        const appId = localStorage.getItem("app_id");
        const payload = {
          email_id: this.email,
          name: this.name,
          country_prefix: this.country,
          mobile_number: this.mobile,
          gender: this.gender,
          app_id: appId == "" ? this.$appId : appId,
          registered_type: this.isSmall ? "M" : "W",
          country_name: countryName,
          image: this.imageSend || null,
          country_code: this.phoneEvent.countryCallingCode
            ? `+${this.phoneEvent.countryCallingCode}`
            : "",
          flag: `https://flagicons.lipis.dev/flags/4x3/${this.phoneEvent.countryCode.toLowerCase()}.svg`,
        };
        // console.log(payload);

        // localStorage.setItem("p_email", this.email);
        // localStorage.setItem("p_name", this.name);
        // localStorage.setItem("p_country", this.country);
        // localStorage.setItem("p_mobile", this.mobile);
        // localStorage.setItem("p_gender", this.gender);
        // localStorage.setItem("p_countryName", countryName);
        // if (this.imageSend !== null) {
        //   localStorage.setItem("p_image", this.imageSend);
        // }
        // this.nextStep();

        if (
          this.isMobile == true &&
          this.isName == true &&
          this.isGender == true
        ) {
          axios
            .post(`/gypsy/save-normal-user`, payload, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const data = response.data;
              // console.log(data);
              this.successMessage = data.message;
              localStorage.setItem("name", data.data.name);
              localStorage.setItem("email", data.data.email_id);
              localStorage.setItem("g_id", data.data.gypsy_ref_no);
              localStorage.setItem("gypsy_id", data.data.gypsy_id);
              localStorage.setItem("user_image", data.data.image);
              localStorage.setItem("last_login", data.data.last_login);
              localStorage.setItem("token", data.data.token);
              this.isSuccess = true;
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
              this.nextStep();
              // this.getUserData();
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
              if (error.response.status == 422) {
                const message =
                  error.response.status == 422 &&
                  error.response.data.email_id &&
                  error.response.data.message
                    ? `This Mobile Number ${this.mobile} already exist in our database using the email id `
                    : error.response.status == 422 &&
                        error.response.data.email_id == null &&
                        error.response.data.message
                      ? `This Mobile Number ${this.mobile} already exists in our database`
                      : "";
                this.emailErrorPhone = error.response.data.email_id
                  ? error.response.data.email_id
                  : "";
                this.errorMessagePhone = message;
                this.isErrorPhone = true;
              } else {
                const message = error.response.data.email_id
                  ? error.response.data.email_id[0]
                  : error.response.data.message === ""
                    ? "Something Wrong!!!"
                    : error.response.data.message;
                this.errorMessage = message;
                this.isError = true;
              }
            })
            .finally(() => {
              this.isSending = false;
            });
        }
      }
    },
    getUserData() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.code = data.map((country) => {
            return {
              name: `${country.country_name} (${country.country_code})`,
              code: country.country_code,
            };
          });
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
        });
    },
    getCountryCode() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.code = data.map((country) => {
            return {
              name: `${country.country_name} (${country.country_code})`,
              code: country.country_code,
            };
          });
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
        });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    resendOTP() {
      this.isSuccess = true;
      this.successMessage = "Success send OTP";
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/background-sign-in.jpg");
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.header-mobile {
  font-size: 20px;
}

.section-desktop {
  font-size: 18px;
}

.section-mobile {
  font-size: 14px;
}

.gender-small {
  font-size: 14px;
}

.country-no {
  left: 30px;
}
.country-yes {
  left: 40px;
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

.login-input .v-text-field input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -webkit-text-fill-color: #333 !important;
}
/* Firefox */
.login-input .v-text-field input:-moz-autofill {
  -moz-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -moz-text-fill-color: #333 !important;
}

.login-btn {
  width: 400px;
  height: 50px;

  background: #5d87ff;
  border-radius: 10px;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  text-transform: unset;
}

.next-btn {
  width: 70% !important;
}

.login-btn-mobile {
  font-weight: 600;
  font-size: 18px;
}

.login-footer-span {
  font-size: 20px;
  font-weight: 600;
}

.login-line {
  width: 70px;
  height: 1px;
  background: #bababa;
}
.login-line-mobile {
  width: 150px;
}

.login-card {
  margin-top: 120px;
  margin-bottom: 50px;
  padding-top: 20px;
  padding-bottom: 100px;
}

.login-footer-icon {
  cursor: pointer;
}
.login-footer-btn {
  gap: 20px;
}
.login-footer-btn-mobile {
  gap: 40px;
}

.flag-text {
  margin-left: 10px;
}
</style>
