/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import VueDatePicker from "@vuepic/vue-datepicker";

export function registerPlugins(app) {
  app.component("VueDatePicker", VueDatePicker).use(vuetify);
}
