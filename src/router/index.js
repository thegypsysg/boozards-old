import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import MyProfile from "@/views/MyProfileView.vue";
import PriceList from "@/views/PriceListView.vue";
import ProductDetail from "@/views/ProductDetailView.vue";
import PrivacyTerms from "@/views/PrivacyTerms.vue";
import MyFavorites from "@/views/MyFavoritesView.vue";
import SignUp from "@/views/SignUpForm.vue";
import OTPEmailForm from "@/views/OTPEmailForm.vue";
import CreatePasswordForm from "@/views/CreatePasswordForm.vue";
import SocialLogin from "@/views/SocialLoginForm.vue";
import DiscoverLocation from "@/views/city-properties/indexView.vue";
import Trending from "@/views/trending/indexView.vue";
import BuySegment from "@/views/buy_segment/indexView.vue";
import BuyDetail from "@/views/buy_detail/indexView.vue";
// import MyProfile from "@/views/MyProfileView.vue";
// import PromotionDiscountDetail from "@/components/PromotionDetail/PromotionDiscountDetail.vue";
// import PromotionCategoryDetail from "@/components/PromotionDetail/PromotionCategoryDetail.vue";
// import PromotionMealsDetail from "@/components/PromotionDetail/PromotionMealsDetail.vue";
// import PromotionPeopleDetail from "@/components/PromotionDetail/PromotionPeopleDetail.vue";
// import PromotionPreferenceDetail from "@/components/PromotionDetail/PromotionPreferenceDetail.vue";
// import PromotionOthersDetail from "@/components/PromotionDetail/PromotionOthersDetail.vue";
// import PromotionDayDetail from "@/components/PromotionDetail/PromotionDayDetail.vue";
// import ViewAllMallsVue from "@/components/ViewAllMalls.vue";
// import ViewAllMerchantsVue from "@/components/ViewAllMerchants.vue";
// import ViewAllEvents from "@/components/ViewAllEvents.vue";
// import EventDetail from "@/components/EventDetail.vue";
// import PreRedeem from "@/components/PreRedeem.vue";
// import RedeemLocation from "@/components/RedeemLocation.vue";
// import RedeemDetail from "@/components/RedeemDetail.vue";
// import ViewAllParkingInfo from "@/components/ViewAllParkingInfo.vue";
// import ParkingInfoDetail from "@/components/ParkingInfoDetail.vue";
// import ViewAllMallOffers from "@/components/ViewAllMallOffers.vue";
// import MallOffersDetail from "@/components/MallOffersDetail.vue";
// import ViewAllPromotions from "@/components/ViewAllPromotions.vue";
// import PromotionDetail from "@/components/PromotionDetail.vue";
// import MallDetail from "@/components/MallDetail.vue";
// import MerchantDetail from "@/components/MerchantDetail.vue";
// import LevelDetail from "@/components/LevelDetail.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/price-list",
    name: "Price List",
    component: PriceList,
  },
  {
    path: "/product/:encryptedId",
    name: "Product Detail",
    component: ProductDetail,
  },
  {
    path: "/my-profile",
    name: "My Profile",
    component: MyProfile,
  },
  {
    path: "/my-favorites",
    name: "My Favorites",
    component: MyFavorites,
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    component: PrivacyTerms,
  },
  {
    path: "/our-terms",
    name: "OurTerms",
    component: PrivacyTerms,
  },
  {
    path: "/sign-in",
    name: "Welcome",
    component: SignUp,
  },
  {
    path: "/sign-up-email",
    name: "SignUpEmail",
    component: OTPEmailForm,
  },
  {
    path: "/signup-email",
    name: "Create Password",
    component: CreatePasswordForm,
  },
  {
    path: "/social-sign-up",
    name: "Social Sign Up",
    component: SocialLogin,
    beforeRouteEnter(to, from, next) {
      const email = to.query.email || "";
      const name = to.query.name || "";
      const avatar = to.query.avatar || "";

      // Anda dapat menyimpan nilai-nilai ini dalam state Vuex atau menggunakan mereka langsung dalam komponen
      next((vm) => {
        vm.email = email;
        vm.name = name;
        vm.avatar = avatar;
      });
    },
  },
  {
    path: "/batam-properties",
    component: DiscoverLocation,
  },
  {
    path: "/buy",
    name: "Trending-buy",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/rent",
    name: "Trending-rent",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/roommates",
    name: "Trending-roommates",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/staycation",
    name: "Trending-staycation",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/vacation",
    name: "Trending-vacation",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/co-living",
    name: "Trending-co-living",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/co-working",
    name: "Trending-co-working",
    component: Trending,
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/buy/studio",
    name: "Buy Studio",
    component: BuySegment,
  },
  {
    path: "/buy/:id",
    name: "Buy Detail",
    component: BuyDetail,
  },
  // {
  //   path: "/discount-types",
  //   name: "Promotion Discount Types",
  //   component: PromotionDiscountDetail,
  // },
  // {
  //   path: "/category",
  //   name: "Promotion Category",
  //   component: PromotionCategoryDetail,
  // },
  // {
  //   path: "/meal-promo",
  //   name: "Promotion Meals",
  //   component: PromotionMealsDetail,
  // },
  // {
  //   path: "/people-promo",
  //   name: "Promotion People",
  //   component: PromotionPeopleDetail,
  // },
  // {
  //   path: "/preference-promo",
  //   name: "Promotion Preference",
  //   component: PromotionPreferenceDetail,
  // },
  // {
  //   path: "/others-promo",
  //   name: "Promotion Others",
  //   component: PromotionOthersDetail,
  // },
  // {
  //   path: "/day-promo",
  //   name: "Promotion Day",
  //   component: PromotionDayDetail,
  // },
  // {
  //   path: "/all-malls",
  //   name: "All Malls",
  //   component: ViewAllMallsVue,
  // },
  // {
  //   path: "/all-merchants",
  //   name: "All Merchants",
  //   component: ViewAllMerchantsVue,
  // },
  // {
  //   path: "/all-promotions",
  //   name: "All Promotions",
  //   component: ViewAllPromotions,
  // },
  // {
  //   path: "/promo-detail/:id",
  //   name: "Promo Detail",
  //   component: PromotionDetail,
  // },
  // {
  //   path: "/all-events",
  //   name: "All Events",
  //   component: ViewAllEvents,
  // },
  // {
  //   path: "/event-id/:id",
  //   name: "Event Detail",
  //   component: EventDetail,
  // },
  // {
  //   path: "/all-parking-info",
  //   name: "All Parking Info",
  //   component: ViewAllParkingInfo,
  // },
  // {
  //   path: "/parking-info-id/:id",
  //   name: "Parking Info Detail",
  //   component: ParkingInfoDetail,
  // },
  // {
  //   path: "/all-mall-offers",
  //   name: "All Mall Offers",
  //   component: ViewAllMallOffers,
  // },
  // {
  //   path: "/mall-offers-id/:id",
  //   name: "Mall Offers Detail",
  //   component: MallOffersDetail,
  // },
  // {
  //   path: "/pre-redeem/:id",
  //   name: "Pre Redeem",
  //   component: PreRedeem,
  // },
  // {
  //   path: "/redeem-location/:id",
  //   name: "Redeem Location",
  //   component: RedeemLocation,
  // },
  // {
  //   path: "/redeem-detail/:id",
  //   name: "Redeem Detail",
  //   component: RedeemDetail,
  // },
  // {
  //   path: "/mall-id/:id",
  //   name: "Mall Detail",
  //   component: MallDetail,
  // },
  // {
  //   path: "/merchant-id/:id",
  //   name: "Merchant Detail",
  //   component: MerchantDetail,
  // },
  // {
  //   path: "/level-id/:id",
  //   name: "Level Detail",
  //   component: LevelDetail,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
