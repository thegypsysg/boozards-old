<template>
  <div>
    <div v-if="currentStep === 1">
      <Welcome @nextStep="nextStep" />
    </div>
    <div v-else-if="currentStep === 2">
      <PersonalDetailMobile @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 3">
      <AdditionalSecurity @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 4">
      <ResultRegister @nextStep="nextStep" @backStep="backStep" />
    </div>
    <!-- <div v-else-if="currentStep === 4">
      <AdditionalSecurity @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 5">
      <WhereAreYou @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 6">
      <AdditionalInformation @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 7">
      <SelectSkills @nextStep="nextStep" @backStep="backStep" />
    </div>
    <div v-else-if="currentStep === 8">
      <SpecialisedPage @nextStep="nextStep" @backStep="backStep" />
    </div> -->
    <!--<div v-else-if="currentStep === 3">
      <Step3Component @nextStep="nextStep" />
    </div> -->
  </div>
</template>

<script>
import Welcome from "@/components/SignUp/Welcome.vue";
// import InputEmail from '@/components/SignUp/InputEmail.vue';
import PersonalDetailMobile from "@/components/SignUpMobile/PersonalDetailMobile.vue";
import ResultRegister from "@/components/SignUpMobile/ResultRegister.vue";
import AdditionalSecurity from "@/components/SignUpMobile/AdditionalSecurity.vue";
// import EmailVerification from "@/components/SignUp/EmailVerification.vue";
// import WhereAreYou from "@/components/SignUp/WhereAreYou.vue";
// import AdditionalInformation from "@/components/SignUp/AdditionalInformation.vue";
// import SelectSkills from "@/components/SignUp/SelectSkills.vue";
// import SpecialisedPage from "@/components/SignUp/SpecialisedPage.vue";

export default {
  components: {
    Welcome,
    // EmailVerification,
    PersonalDetailMobile,
    AdditionalSecurity,
    ResultRegister,
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
