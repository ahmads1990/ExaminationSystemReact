import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAR from "./locales/ar.json";
import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";
import translationFR from "./locales/fr.json";

const resources = {
    en: {
        translation: translationEN
    },
    ar: {
        translation: translationAR
    },
    es: {
        translation: translationES
    },
    fr: {
        translation: translationFR
    }
};

const savedLanguage = localStorage.getItem("app_lang") || "en";

// Apply text direction dynamically on application boot
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
document.documentElement.lang = savedLanguage;

i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false // react already protects against XSS
    }
});

export default i18n;
