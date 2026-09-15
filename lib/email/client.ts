import { Resend } from "resend";
import { getSystemSettings } from "@/lib/server/settings";

/**
 * Helper untuk menginisialisasi Resend client.
 * Menggunakan Environment Variable RESEND_API_KEY.
 * Mengembalikan null jika API key tidak dikonfigurasi.
 */
export async function getResendClient(): Promise<Resend | null> {
    try {
        const settings = await getSystemSettings(["RESEND_API_KEY"]);
        const apiKey = settings.find((s) => s.key === "RESEND_API_KEY")?.value;

        if (!apiKey) {
            console.warn("Resend API key not configured. Email sending disabled.");
            return null;
        }

        return new Resend(apiKey);
    } catch (error) {
        console.error("Failed to initialize Resend client:", error);
        return null;
    }
}

/**
 * Helper untuk mendapatkan alamat email target Admin.
 * Menggunakan Environment Variable ADMIN_EMAIL, dengan fallback default.
 */
export async function getAdminEmailTarget(): Promise<string> {
    return process.env.ADMIN_EMAIL || "support@crediblemark.com";
}

/**
 * Helper untuk mendapatkan konfigurasi pengirim email (Sender Name & Email).
 */
export async function getSenderConfig(): Promise<{ name: string; email: string; formatted: string }> {
    const settings = await getSystemSettings(["RESEND_SENDER_NAME", "RESEND_SENDER_EMAIL"]);
    const name = settings.find((s) => s.key === "RESEND_SENDER_NAME")?.value || "Crediblemark Bot";
    const email = settings.find((s) => s.key === "RESEND_SENDER_EMAIL")?.value || "notifications@update.crediblemark.com";

    return {
        name,
        email,
        formatted: `${name} <${email}>`,
    };
}