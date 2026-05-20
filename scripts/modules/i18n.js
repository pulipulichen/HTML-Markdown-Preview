import { EN_TRANSLATIONS } from "./i18n/en.js";
import { ZH_TW_TRANSLATIONS } from "./i18n/zh-TW.js";

const TRANSLATIONS = {
    en: EN_TRANSLATIONS,
    "zh-TW": ZH_TW_TRANSLATIONS
};

export const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "markdown_preview_language";
export const LANGUAGE_CHANGE_EVENT = "app-language-changed";

let currentLanguage = DEFAULT_LANGUAGE;

function getNestedValue(target, keyPath) {
    return keyPath
        .split(".")
        .reduce((result, key) => (result && key in result ? result[key] : undefined), target);
}

function formatMessage(template, params = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return key in params ? String(params[key]) : `{${key}}`;
    });
}

function normalizeLanguage(language) {
    if (!language || typeof language !== "string") {
        return null;
    }

    if (SUPPORTED_LANGUAGES.includes(language)) {
        return language;
    }

    const normalized = language.toLowerCase();

    if (normalized.startsWith("zh")) {
        return "zh-TW";
    }

    if (normalized.startsWith("en")) {
        return "en";
    }

    return null;
}

function resolveInitialLanguage() {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const normalizedStoredLanguage = normalizeLanguage(storedLanguage);

    if (normalizedStoredLanguage) {
        return normalizedStoredLanguage;
    }

    const browserLanguages = [
        ...(Array.isArray(navigator.languages) ? navigator.languages : []),
        navigator.language
    ];

    for (const browserLanguage of browserLanguages) {
        const normalizedBrowserLanguage = normalizeLanguage(browserLanguage);
        if (normalizedBrowserLanguage) {
            return normalizedBrowserLanguage;
        }
    }

    return DEFAULT_LANGUAGE;
}

function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        element.textContent = t(key);
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(element => {
        const definitions = element
            .getAttribute("data-i18n-attr")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

        definitions.forEach(definition => {
            const [attributeName, key] = definition.split(":").map(part => part.trim());
            if (!attributeName || !key) {
                return;
            }

            element.setAttribute(attributeName, t(key));
        });
    });
}

function syncLanguageSelect() {
    const languageSelect = document.getElementById("language-select");
    if (!languageSelect) {
        return;
    }

    if (!SUPPORTED_LANGUAGES.includes(languageSelect.value)) {
        languageSelect.value = currentLanguage;
    } else {
        languageSelect.value = currentLanguage;
    }
}

function applyLanguage(language, { persist = true, emit = true } = {}) {
    currentLanguage = language;
    document.documentElement.lang = language;
    applyTranslations(document);
    syncLanguageSelect();

    if (persist) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    if (emit) {
        window.dispatchEvent(
            new CustomEvent(LANGUAGE_CHANGE_EVENT, {
                detail: { language }
            })
        );
    }
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function t(key, params = {}) {
    const activeLanguageMap = TRANSLATIONS[currentLanguage] || {};
    const fallbackLanguageMap = TRANSLATIONS[DEFAULT_LANGUAGE] || {};

    const targetMessage = getNestedValue(activeLanguageMap, key);
    const fallbackMessage = getNestedValue(fallbackLanguageMap, key);
    const result = targetMessage ?? fallbackMessage ?? key;

    if (typeof result !== "string") {
        return key;
    }

    return formatMessage(result, params);
}

export function setLanguage(language) {
    const normalizedLanguage = normalizeLanguage(language);
    if (!normalizedLanguage) {
        return currentLanguage;
    }

    applyLanguage(normalizedLanguage);
    return currentLanguage;
}

export function onLanguageChange(handler) {
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handler);
}

export function initI18n() {
    const initialLanguage = resolveInitialLanguage();
    applyLanguage(initialLanguage, { persist: false, emit: false });

    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        languageSelect.addEventListener("change", event => {
            setLanguage(event.target.value);
        });
    }
}

initI18n();
