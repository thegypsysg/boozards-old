<template>
  <div>
    <div v-if="currentStep === 1">
      <PersonalDetailSocials @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 2">
      <ResultRegister @nextStep="nextStep" @backStep="backStep" />
    </div>
  </div>
</template>

<script>
// import Welcome from "@/components/SignUp/Welcome.vue";
import ResultRegister from "@/components/SignUp/ResultRegister.vue";
import PersonalDetailSocials from "@/components/SignUp/PersonalDetailSocials.vue";
// import EmailVerification from "@/components/SignUp/EmailVerification.vue";
// import WhereAreYou from "@/components/SignUp/WhereAreYou.vue";
// import AdditionalInformation from "@/components/SignUp/AdditionalInformation.vue";
// import SelectSkills from "@/components/SignUp/SelectSkills.vue";
// import SpecialisedPage from "@/components/SignUp/SpecialisedPage.vue";

export default {
  components: {
    // Welcome,
    ResultRegister,
    PersonalDetailSocials,
  },
  data() {
    return {
      currentStep: 1,
    };
  },
  methods: {
    nextStep() {
      this.currentStep++;
    },
    backStep() {
      this.currentStep--;
    },
  },
};
</script>
