<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-center">
          <v-col :cols="isSmall ? '12' : '10'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : ''"
              class="mx-auto"
              :class="{ 'login-card px-12': !isSmall, 'py-10 px-2': isSmall }"
            >
              <v-row>
                <v-col :cols="isSmall ? '12' : '6'">
                  <h1
                    class="mb-1"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile mb-6': isSmall }"
                  >
                    Step 1 - Email Verification
                  </h1>

                  <v-form v-model="valid" @submit.prevent>
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile ': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email</label
                    >
                    <div
                      class="d-flex align-center mt-2 py-0 back-grey"
                      style="border: 1px solid #ced4da; border-radius: 0.25rem"
                    >
                      <input
                        v-model="email"
                        type="email"
                        disabled
                        class="form-control"
                        style="border: none"
                        placeholder="Enter Email"
                      />
                      <span
                        class="text-blue-darken-4 mx-2"
                        style="cursor: pointer"
                        @click="backStep"
                      >
                        Change
                      </span>
                    </div>
                    <!-- <div class="d-flex">
                      <v-text-field
                        v-model="email"
                        readonly
                        :rules="rules.emailRules"
                        class="login-input mt-2 mb-8"
                        type="email"
                        variant="outlined"
                        placeholder="John@example.com"
                        :persistent-hint="true"
                      >
                      </v-text-field>
                      <span
                        class="text-blue-darken-4 mt-5 ml-2"
                        style="cursor: pointer"
                        @click="backStep"
                      >
                        Change
                      </span>
                    </div> -->
                    <!-- <div class="d-flex mb-2 justify-start align-center">
                      <span
                        style="font-weight: 600"
                        :class="{
                          'section-mobile': isSmall,
                          'section-desktop': !isSmall,
                        }"
                        >OTP</span
                      >
                      <span class="text-blue-darken-4 ml-4"> (4 digits)</span>
                    </div> -->
                    <!-- <div
                      class="d-flex w-100 align-center justify-space-between"
                    >
                      <div
                        style="
                          border: 1px solid rgb(133, 133, 133);
                          border-radius: 5px;
                          width: 80%;
                        "
                        class="d-flex px-4 py-2 justify-space-between align-center"
                      >
                        <div :class="{ 'w-75': isSmall }">
                          <input
                            v-for="(digit, index) in otpDigits"
                            :key="index"
                            v-model="otpDigits[index]"
                            @input="onInput(index)"
                            ref="otpInput"
                            class="otp-digit"
                            maxlength="1"
                            type="text"
                          />
                        </div>
                        <span
                          class="text-purple-darken-4 font-weight-bold"
                          :class="{ 'w-25': isSmall }"
                          style="cursor: pointer"
                          @click="resendOTP"
                        >
                          Resend OTP
                        </span>
                      </div>
                      <div class="text-grey pl-3" style="width: 20%">
                        {{ countdown }} sec
                      </div>
                    </div> -->

                    <div class="d-flex align-center">
                      <!-- :disabled="otpFilled != 4" -->
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn mt-4"
                        :class="{
                          'w-66 login-btn-mobile mt-10': isSmall,
                          'w-50': !isSmall,
                        }"
                        @click="nextStep()"
                      >
                        Next
                      </v-btn>
                      <div
                        :class="{
                          'w-33 login-btn-mobile mt-10': isSmall,
                          'w-33': !isSmall,
                        }"
                        style="
                          text-align: center;
                          cursor: pointer;
                          color: #2b0087;
                          font-weight: 700;
                          font-size: 20px;
                        "
                        @click="backStep"
                      >
                        Back
                      </div>
                    </div>
                  </v-form>
                </v-col>
                <v-col
                  v-if="!isSmall"
                  cols="6"
                  class="d-flex align-center justify-center"
                >
                  <h2 style="width: 80%">
                    Please check your email as you will receive an OTP
                  </h2>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
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
import VOtpInput from "vue3-otp-input";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "OTPEmail",
  data() {
    return {
      valid: false,
      email: "",
      otp: null,
      rules: {
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
      },
      screenWidth: window.innerWidth,
      isError: false,
      isSuccess: false,
      errorMessage: "",
      successMessage: "",
      countdown: 0,
      timer: null,
      otpDigits: ["", "", "", ""],
      otpFilled: 0,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.startCountdown();
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
    onInput(index) {
      if (this.otpDigits[index] && index < 3) {
        // Pindahkan fokus ke input berikutnya yang belum terisi
        let nextIndex = index + 1;
        while (nextIndex <= 3 && this.otpDigits[nextIndex]) {
          nextIndex++;
        }
        if (nextIndex <= 3) {
          this.$refs.otpInput[nextIndex].focus();
        }
      } else if (!this.otpDigits[index] && index > 0) {
        // Pindahkan fokus ke input sebelah kiri saat menghapus
        this.$refs.otpInput[index - 1].focus();
      }

      // Menghitung jumlah digit yang sudah terisi
      this.otpFilled = this.otpDigits.filter((digit) => digit !== "").length;

      // Jika semua digit terisi
      if (this.otpFilled === 4) {
        // Salin nilai dari otpDigits ke state otp
        this.otp = this.otpDigits.join("");
      }
    },
    startCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.countdown = 120;

      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    nextStep() {
      this.$emit("nextStep");
    },
    backStep() {
      app.config.globalProperties.$eventBus.$emit(
        "changeHeaderWelcome",
        "Sign-Up / Sign-in",
      );
      this.$router.push("/sign-in");
    },
    saveData() {
      if (this.valid) {
        // const payload = {
        //   email_id: this.email,
        //   name: this.name,
        //   country_current: this.country,
        //   gender: this.gender,
        //   registered_type: this.isSmall ? "M" : "W",
        //   app_id: this.$appId,
        // };
        this.isSending = true;
        const payload = {
          email_id: this.email,
          otp: this.otp,
        };
        axios
          .post(`/send-otp`, payload)
          .then((response) => {
            const data = response.data;
            // console.log(data);
            this.isSuccess = true;
            this.successMessage = "Success verify OTP";
            this.email = "";
            this.otp = null;

            this.nextStep();
            this.startCountdown();
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
            this.email = "";
            this.otp = null;

            this.startCountdown();
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    resendOTP() {
      if (this.countdown == 0) {
        this.isSending = true;
        const payload = {
          email_id: localStorage.getItem("email"),
        };
        axios
          .post(`/send-otp`, payload)
          .then((response) => {
            const data = response.data;
            // console.log(data);
            this.isSuccess = true;
            this.successMessage = "Success send OTP";
            // setTimeout(() => {
            //   window.open("/try-email", "_blank");
            // }, 1000);
            this.startCountdown();
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
  font-size: 24px;
}

.section-mobile {
  font-size: 16px;
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

.back-grey {
  background: #e9ecef;
}

.gender-small {
  font-size: 14px;
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
  margin-top: 90px;
  padding-top: 15px;
  padding-bottom: 120px;
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

.otp-digit {
  width: 30px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  margin-right: 10px;
  border: 1px solid rgb(137, 137, 137);
  border-radius: 5px;
}
</style>
