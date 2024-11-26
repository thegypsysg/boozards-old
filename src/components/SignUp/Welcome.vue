<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
      :style="{
        backgroundImage: !isSmall
          ? `url(${$fileURL + appDetails1?.app_main_image})`
          : undefined,
      }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-end">
          <v-col :cols="isSmall ? '12' : '6'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : '450'"
              class="mx-auto"
              :class="{
                'login-card px-12': !isSmall,
                'py-10 px-2': isSmall,
                'pb-16': !isSmall && isMobile,
              }"
            >
              <h1
                class="mb-1"
                style="font-family: Arial, Helvetica, sans-serif !important"
              >
                Welcome
              </h1>
              <p
                class="text-grey"
                :class="{ 'mb-3': !isSmall, 'mb-6': isSmall }"
              >
                Please use any one of your social accounts to Sign-Up or
                Sign-In.
              </p>
              <p
                class="text-grey"
                :class="{ 'mb-1': !isSmall, 'mb-12': isSmall }"
              >
                Last Used: <span class="text-red">{{ socialProvider }}</span>
              </p>
              <v-form v-model="valid" @submit.prevent>
                <!-- <div
                  v-if="isSmall"
                  class="d-flex flex-column justify-center text-center mt-10"
                  style="gap: 5px"
                >
                  <h2>Social Media</h2>
                  <p>please select anyone from below</p>
                </div> -->
                <div
                  class="login-footer-btn d-flex justify-start mt-8"
                  :class="{ 'login-footer-btn-mobile': isSmall }"
                >
                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    color="white"
                    style="background: transparent"
                    icon
                    @click="loginSocial('google')"
                  >
                    <v-icon :size="!isSmall ? '35' : '40'">
                      <v-img
                        src="@/assets/images/icons/google.png"
                        alt="Google Logo"
                      />
                    </v-icon>
                  </v-btn>
                  <!-- <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #fc2145"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-instagram" />
                    </v-icon>
                  </v-btn> -->

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #4267b2"
                    color="white"
                    icon
                    @click="loginSocial('facebook')"
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-facebook-f" />
                    </v-icon>
                  </v-btn>

                  <!-- <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #0072b1"
                    color="white"
                    icon
                    @click="loginSocial('linkedin-openid')"
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-linkedin-in" />
                    </v-icon>
                  </v-btn> -->
                  <!-- <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: black"
                    color="white"
                    icon
                    @click="loginSocial('tiktok')"
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-tiktok" />
                    </v-icon>
                  </v-btn> -->
                  <!-- <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #1c96e8"
                    color="white"
                    icon="mdi-twitter"
                    @click="loginSocial('twitter')"
                  /> -->
                </div>
                <div class="login-footer mt-8">
                  <div class="d-flex justify-center" style="gap: 25px">
                    <div
                      class="login-line"
                      :class="{ 'login-line-mobile': isSmall }"
                    />
                    <span
                      class="mt-n3"
                      :class="{ 'login-footer-span': isSmall }"
                      >OR</span
                    >
                    <div
                      class="login-line"
                      :class="{ 'login-line-mobile': isSmall }"
                    />
                  </div>
                </div>
                <p
                  v-if="!isMobile"
                  class="text-grey mt-4"
                  :class="{ 'mb-4': !isSmall, 'mb-6': isSmall }"
                >
                  Dont have Email . ?
                  <span
                    style="cursor: pointer"
                    class="text-blue-darken-4"
                    @click="
                      () => {
                        isMobile = true;
                        email = null;
                      }
                    "
                    >Enter Mobile number</span
                  >
                </p>
                <div
                  v-if="isMobile && !isSendOTP"
                  class="text-grey mt-4"
                  :class="{ 'mb-4': !isSmall, 'mb-6': isSmall }"
                >
                  <p
                    style="cursor: pointer"
                    class="text-blue-darken-4"
                    @click="
                      () => {
                        isMobile = false;
                        isSendOTP = false;
                        mobile = null;
                      }
                    "
                  >
                    Register by Email
                  </p>
                  <p class="text-grey">
                    (Use this Mobile Registration only if you dont have Email
                    ID)
                  </p>
                </div>
                <template v-if="!isMobile">
                  <label style="font-size: 24px; font-weight: 600">Email</label>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    class="login-input mb-4"
                    type="email"
                    variant="outlined"
                    placeholder="Email Address"
                    :persistent-hint="true"
                  />
                  <transition name="fade">
                    <div v-if="isLogin">
                      <label style="font-size: 24px; font-weight: 600"
                        >Password</label
                      >
                      <v-text-field
                        v-model="password"
                        :append-inner-icon="
                          showPassword ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :type="showPassword ? 'text' : 'password'"
                        :rules="passwordRules"
                        variant="outlined"
                        class="login-input mb-3"
                        placeholder="Password"
                        :max-length="8"
                        @click:append-inner="showPassword = !showPassword"
                      />
                      <div class="d-flex align-center" style="gap: 10px">
                        <v-checkbox v-model="rememberMe" class="black--text">
                          <template #label>
                            <span
                              style="
                                font-weight: 400;
                                font-size: 14px;
                                color: #000 !important;
                              "
                              >Remember this Device</span
                            >
                          </template>
                        </v-checkbox>
                        <v-btn
                          variant="text"
                          :disabled="isLoadingForgot"
                          class="text-body-2 font-weight-regular mt-n4"
                          style="
                            text-decoration: none;
                            color: #4b80b1;
                            font-weight: 400;
                            font-size: 12px;
                            cursor: pointer;
                          "
                          @click="forgotPassword()"
                        >
                          Forgot Password?
                        </v-btn>
                      </div>
                    </div>
                  </transition>
                </template>
                <template v-if="isMobile && !isSendOtp">
                  <label class="mt-n4" style="font-size: 24px; font-weight: 600"
                    >Mobile</label
                  >
                  <MazPhoneNumberInput
                    v-model="mobile"
                    show-code-on-list
                    color="info"
                    default-country-code="SG"
                    :preferred-countries="['SG', 'BD', 'IN', 'MY', 'GB', 'PH']"
                    @update="phoneEvent = $event"
                  />
                </template>
                <template v-if="isMobile && isSendOtp">
                  <div class="d-flex">
                    <input
                      v-model="mobile"
                      type="text"
                      required
                      disabled
                      class="form-control mt-2"
                      placeholder="Phone Number"
                    />
                    <v-btn
                      class="text-none text-subtitle-1 mt-2"
                      color="blue"
                      variant="flat"
                      @click="isChangeMobile = !isChangeMobile"
                    >
                      Change
                    </v-btn>
                  </div>
                  <div v-if="isChangeMobile" class="mt-2">
                    <MazPhoneNumberInput
                      v-model="mobile"
                      show-code-on-list
                      color="info"
                      default-country-code="SG"
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
                      class="text-none text-white w-100 mt-3"
                      color="#F0882D"
                      size="large"
                      variant="flat"
                      @click="resendOTP"
                    >
                      Resend OTP
                    </v-btn>
                  </div>
                  <v-alert
                    v-model="isResendOTP"
                    class="my-2"
                    type="success"
                    :text="`OTP is sent successfully to ${mobile}`"
                  />
                  <div class="d-flex">
                    <input
                      v-model="otp"
                      required
                      class="form-control mt-2"
                      placeholder="Enter 6 Digit OTP"
                    />
                    <v-btn
                      :disabled="otp?.length != 6"
                      class="text-none text-subtitle-1 mt-2"
                      color="green"
                      variant="flat"
                      @click="nextStep"
                    >
                      Continue
                    </v-btn>
                  </div>
                </template>
                <v-btn
                  v-if="!isMobile && !isLogin"
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn mt-8"
                  :disabled="!isNext || isSending"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="sendDataEmail"
                >
                  <v-progress-circular
                    v-if="isSending"
                    :size="20"
                    color="primary"
                    indeterminate
                  />
                  <span v-else>Next</span>
                </v-btn>
                <v-btn
                  v-if="isLogin && !isMobile"
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn"
                  :disabled="isSending || !isNext || !password"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="loginEmail()"
                >
                  <v-progress-circular
                    v-if="isSending"
                    :size="20"
                    color="primary"
                    indeterminate
                  />
                  <span v-else>Sign In</span>
                </v-btn>
                <!-- <v-btn
                  v-if="isMobile"
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn"
                  :disabled="!isNext"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="nextStep()"
                >
                  Next
                </v-btn> -->
                <v-btn
                  v-if="isMobile && !isSendOtp"
                  color="#F0882D"
                  size="large"
                  variant="flat"
                  class="login-btn text-none text-white w-100 mt-3"
                  :disabled="!isNext"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="sendDataMobile"
                >
                  <!-- @click="nextStep()" -->
                  Next
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

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
        <v-dialog v-model="isSuccessForgot" persistent width="auto">
          <v-card width="350">
            <v-card-text>
              <h3 class="">Forgot Password</h3>
              <h5 class="my-4">
                Please check your email as you will receive an OTP
              </h5>
              <v-btn
                class="mb-4 w-100 bg-primary"
                @click="isSuccessForgot = false"
              >
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isChangePassword" persistent width="auto">
          <v-card width="350">
            <v-card-text>
              <h5 class="">
                New Password successfully updated . Please change your password
                under "My Profile"
              </h5>
              <v-btn
                class="my-4 w-100 bg-primary"
                @click="closeChangePassword()"
              >
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isFacebook" persistent width="auto">
          <v-card width="350">
            <v-card-text class="">
              <p class="my-4">
                Facebook Sign up is not available now please use your email or
                Google.
              </p>
              <v-btn class="mb-4 w-100 bg-primary" @click="isFacebook = false">
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
</script>

<script>
import axios from "@/util/axios";
import app from "@/util/eventBus";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Welcome",
  data() {
    return {
      appIdLogin: "",
      tokenLogin: null,
      isSending: false,
      isSuccessForgot: false,
      isForgotPassword: false,
      isChangePassword: false,
      isFacebook: false,
      isLoadingForgot: false,
      isSendOtp: false,
      isChangeMobile: false,
      isResendOTP: false,
      valid: false,
      isMobile: false,
      isNext: false,
      isLogin: false,
      rememberMe: false,
      showPassword: false,
      email: null,
      password: "",
      mobile: null,
      otp: "",
      phoneEvent: null,
      isError: false,
      token: null,
      isSuccess: false,
      appDetails1: null,
      errorMessage: "",
      successMessage: "",
      emailRules: [
        (value) => {
          if (value) return true;
          return "E-mail is requred.";
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;
          return "E-mail must be valid.";
        },
      ],
      passwordRules: [
        (value) => {
          if (value) return true;
          return "Password is requred.";
        },
      ],
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    socialProvider() {
      return this.capitalizeFirstLetter(localStorage.getItem("social")) ==
        "Linkedin-openid"
        ? "LinkedIn Login"
        : this.capitalizeFirstLetter(localStorage.getItem("social")) + " Login";
    },
    appId() {
      localStorage.setItem("app_id", this.$route.query.app_id || "");
      return this.$route.query.app_id || "";
    },
  },
  watch: {
    isMobile(newVal) {
      if (newVal) {
        this.email = null;
        this.mobile = null;
        this.isNext = false;
      }
    },
    email(newVal) {
      if (this.email == null) {
        this.isNext = false;
      } else if (/.+@.+\..+/.test(newVal)) {
        this.isNext = true;
      }
    },
    mobile() {
      if (this.mobile == null) {
        this.isNext = false;
      } else {
        this.isNext = true;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    console.log(this.appId);
    this.getAppDetails1();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    sendOTP() {
      this.isSending = true;
      const payload = {
        email_id: this.email,
      };
      axios
        .post(`/send-otp`, payload)
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.successMessage = data.message;
          this.isSuccess = true;
          localStorage.setItem("email", data.data.email_id);
          // this.email = "";
          this.$router.push("/sign-up-email");
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message = error.response.data.email_id
            ? error.response.data.email_id[0]
            : error.response.data.message
              ? error.response.data.message
              : "Something Wrong!!!";
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    resendOTP() {
      this.isResendOTP = true;
      setTimeout(() => {
        this.isResendOTP = false;
      }, 3000);
    },
    capitalizeFirstLetter(string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
    },
    nextStep() {
      this.$emit("nextStep");
    },
    loginSocial(social_name) {
      if (social_name == "facebook") {
        this.isFacebook = true;
      } else {
        axios
          .post(`/gypsy-login/${social_name}`, {
            app_id: this.appId == "" ? this.$appId : this.appId,
          })
          .then((response) => {
            console.log(response);
            if (response) {
              window.location.assign(response.data.target_url);
            } else {
              window.location.href = "/sign-in";
            }
            // console.log("target_url", response.data.target_url);
          })
          .catch((error) => {
            console.log(error);
            // window.location.href = "/sign-in";
          });
      }
    },
    forgotPassword() {
      this.isLoadingForgot = true;
      axios
        .post(`/gypsy/send-forget-password-email`, {
          email_id: this.email,
        })
        .then((response) => {
          console.log(response);
          if (response) {
            this.isSuccessForgot = true;
            this.isForgotPassword = true;
          }
          //  else {
          //   window.location.href = "/sign-in";
          // }
        })
        .catch((error) => {
          const message = error.response.data.email_id
            ? error.response.data.email_id[0]
            : error.response.data.message
              ? error.response.data.message
              : "Something Wrong!!!";
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isLoadingForgot = false;
        });
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
    sendDataMobile() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          mobile_number: this.mobile,
        };
        axios
          .post(`/gypsy-registration/check-mobile-exists`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            localStorage.setItem("mobile", this.mobile);
            // this.email = "";
            this.nextStep();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.mobile_number
              ? error.response.data.mobile_number[0]
              : error.response.data.message
                ? //? error.response.data.message
                  `This Mobile Number ${
                    this.mobile
                  } is already exist in our database using the email id ${this.hideEmail(
                    error.response.data.email_id,
                  )}`
                : "Something Wrong!!!";
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    sendDataEmail() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          email_id: this.email,
        };
        axios
          .post(`/gypsy/check-info-by-email`, payload)
          .then((response) => {
            const data = response.data.data;
            console.log(data);
            if (data == null) {
              localStorage.setItem("email", this.email);
              this.$router.push("/sign-up-email");
            } else if (data.social_type == "E" && data.password) {
              this.isLogin = true;
            } else if (data.social_type == "E" && !data.password) {
              localStorage.setItem("email", data.email_id);
              localStorage.setItem("gypsy_id", data.gypsy_id);
              localStorage.setItem("token", data.token);
              this.$router.push("/signup-email");
            } else if (data.social_type == "G") {
              this.successMessage =
                "You Last used Google to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
              this.isLogin = true;
              this.isSuccess = true;
            } else if (data.social_type == "F") {
              this.successMessage =
                "You Last used Facebook to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
              this.isLogin = true;
              this.isSuccess = true;
            } else if (data.social_type == "L") {
              this.successMessage =
                "You Last used Linkedin to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
              this.isLogin = true;
              this.isSuccess = true;
            } else if (data.social_type == "T") {
              this.successMessage =
                "You Last used Tiktok to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
              this.isLogin = true;
              this.isSuccess = true;
            } else if (data.social_type == "X") {
              this.successMessage =
                "You Last used Twitter to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
              this.isLogin = true;
              this.isSuccess = true;
            }
            // this.successMessage = data.message;
            // this.isSuccess = true;
            // localStorage.setItem("email", this.email);
            // // this.email = "";
            // this.$router.push("/sign-up-email");
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.email_id
              ? error.response.data.email_id[0]
              : error.response.data.message
                ? error.response.data.message
                : "Something Wrong!!!";
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    loginEmail() {
      this.appIdLogin = localStorage.getItem("app_id");
      this.isSending = true;
      const payload = {
        email_id: this.email,
        password: this.password,
      };
      axios
        .post(`/gypsy/login`, payload)
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (this.isForgotPassword) {
            this.isChangePassword = true;
            this.tokenLogin = data.token;
          } else {
            this.successMessage = data.message;
            this.isSuccess = true;

            if (this.appIdLogin == "") {
              localStorage.setItem("social", "Email");
              localStorage.setItem("token", data.token);
              app.config.globalProperties.$eventBus.$emit(
                "changeHeaderWelcome3",
                "Sign-Up / Sign-in",
              );
              this.$router.push(`/?token=${data.token}`);
            } else if (this.appIdLogin == "5") {
              localStorage.setItem("social", "Email");
              const externalURL = `https://the-syringe.com?token=${data.token}`;
              window.location.href = externalURL;
            } else if (this.appIdLogin == "2") {
              localStorage.setItem("social", "Email");
              const externalURL = `https://mall-e.in?token=${data.token}`;
              window.location.href = externalURL;
            }
          }

          // this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          // eslint-disable-next-line
          this.errorMessage = "Wrong Password";
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    closeChangePassword() {
      this.isChangePassword = false;
      if (this.appIdLogin == "") {
        console.log("app id, ", this.appIdLogin);
        localStorage.setItem("social", "Email");
        localStorage.setItem("token", this.tokenLogin);
        app.config.globalProperties.$eventBus.$emit(
          "changeHeaderWelcome3",
          "Sign-Up / Sign-in",
        );
        this.$router.push(`/?token=${this.tokenLogin}`);
      } else if (this.appIdLogin == "5") {
        localStorage.setItem("social", "Email");
        const externalURL = `https://the-syringe.com?token=${this.tokenLogin}`;
        window.location.href = externalURL;
      } else if (this.appIdLogin == "2") {
        localStorage.setItem("social", "Email");
        const externalURL = `https://mall-e.in?token=${this.tokenLogin}`;
        window.location.href = externalURL;
      }
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    getAppDetails1() {
      axios
        .get(`/app/details/${this.$appId}`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.appDetails1 = data[0];
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.login-input {
  border: 1px solid rgba(147, 147, 147, 0.807) !important;
  border-radius: 10px;
}

.login-input ::v-deep input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  -webkit-text-fill-color: #4e4e4e !important;
}
.login-input ::v-deep input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  -webkit-text-fill-color: #333 !important;
}

/* Firefox */
.login-input ::v-deep input:-moz-autofill {
  -moz-box-shadow: 0 0 0 30px #fff inset !important;
  -moz-text-fill-color: #333 !important;
}
/* Firefox */
.login-input ::v-deep input:-moz-autofill:focus {
  -moz-box-shadow: 0 0 0 30px #fff inset !important;
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

.login-btn-mobile {
  font-weight: 600;
  font-size: 18px;
}

.login-footer-span {
  font-size: 20px;
  font-weight: 600;
}

.login-line {
  width: 150px;
  height: 1px;
  background: #bababa;
}
.login-line-mobile {
  width: 150px;
}

.login-card {
  margin-top: 90px;
  padding-top: 15px;
  padding-bottom: 30px;
}

.login-footer-icon {
  cursor: pointer;
}
.login-footer-btn {
  gap: 20px;
}
.login-footer-btn-mobile {
  gap: 20px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
