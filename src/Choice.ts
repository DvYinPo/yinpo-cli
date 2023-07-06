import type { Choice } from "prompts"

type optionType = Omit<Choice, "title" | "value">

export default {
  webpack: (option?: optionType): Choice => ({ title: "webpack", value: "webpack", ...option }),
  vite: (option?: optionType): Choice => ({ title: "vite", value: "vite", ...option }),
  react: (option?: optionType): Choice => ({ title: "react", value: "react", ...option }),
  vue: (option?: optionType): Choice => ({ title: "vue", value: "vue", ...option }),
  eslint: (option?: optionType): Choice => ({ title: "eslint", value: "eslint", ...option }),
  vuex: (option?: optionType): Choice => ({ title: "vuex", value: "vuex", ...option }),
  redux: (option?: optionType): Choice => ({ title: "redux", value: "redux", ...option }),
  pinia: (option?: optionType): Choice => ({ title: "pinia", value: "pinia", ...option }),
  vueRoute: (option?: optionType): Choice => ({ title: "vue-route", value: "vueRoute", ...option }),
  reactRoute: (option?: optionType): Choice => ({ title: "react-route", value: "reactRoute", ...option }),
  typescript: (option?: optionType): Choice => ({ title: "typescript", value: "typescript", ...option }),
  antDesignVue: (option?: optionType): Choice => ({ title: "ant-design-vue", value: "antDesignVue", ...option }),
  antDesign: (option?: optionType): Choice => ({ title: "ant-design", value: "antDesign", ...option }),
  materialUI: (option?: optionType): Choice => ({ title: "material UI", value: "mui", ...option }),
  element: (option?: optionType): Choice => ({ title: "element UI", value: "element", ...option }),
  styleComponents: (option?: optionType): Choice => ({ title: "style-components", value: "styleComponents", ...option }),
  axios: (option?: optionType): Choice => ({ title: "axios", value: "axios", ...option }),
}
