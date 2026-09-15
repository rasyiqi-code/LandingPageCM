export interface SystemSetting {
    key: string;
    value: string;
}

export const DEFAULT_SETTINGS: Record<string, string> = {
    AGENCY_NAME: "Crediblemark",
    AGENCY_LOGO: "/logo.webp",
    AGENCY_LOGO_DISPLAY: "both",
    CONTACT_PHONE: "+6285183131249",
    COMPANY_NAME: "Crediblemark",
    AGENCY_EMAIL: "support@crediblemark.com",
    CONTACT_EMAIL: "support@crediblemark.com",
    CONTACT_ADDRESS: "",
    CONTACT_HOURS: "",
    CONTACT_TELEGRAM: "",
    RESEND_SENDER_NAME: "Crediblemark Bot",
    RESEND_SENDER_EMAIL: "notifications@update.crediblemark.com",
    SEO_FAVICON: "/logo.webp",
    SEO_TITLE: "",
    SEO_TITLE_ID: "",
    SEO_DESCRIPTION: "",
    SEO_DESCRIPTION_ID: "",
    SEO_KEYWORDS: "",
    SEO_KEYWORDS_ID: "",
    SEO_OG_IMAGE: "",
    SEO_OG_IMAGE_ID: "",
};

function resolveSettingValue(key: string): string {
    const envName = key.toUpperCase();
    const envValue =
        process.env[key] ??
        process.env[envName] ??
        process.env[`NEXT_PUBLIC_${envName}`];
    if (envValue) return envValue;
    return DEFAULT_SETTINGS[key] ?? "";
}

export const getSystemSettings = async (keys: string[]): Promise<SystemSetting[]> => {
    return keys.map((key) => ({ key, value: resolveSettingValue(key) }));
};

export async function getSettingValue(key: string, defaultValue: string = ""): Promise<string> {
    return resolveSettingValue(key) || defaultValue;
}