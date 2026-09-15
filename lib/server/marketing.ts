import { getResendClient, getAdminEmailTarget } from "@/lib/email/client";

const escapeHtml = (str: string = "") =>
    str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export async function createSubscriber(email: string, name?: string) {
    try {
        const resend = await getResendClient();
        if (!resend) return { success: true, message: "Subscribed" };

        const recipient = await getAdminEmailTarget();
        const { error } = await resend.emails.send({
            from: "Crediblemark <noreply@update.crediblemark.com>",
            to: [recipient],
            subject: `[Newsletter] New subscriber: ${escapeHtml(email)}`,
            html: `
                <h2>New Newsletter Subscriber</h2>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                ${name ? `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` : ""}
            `,
        });

        if (error) {
            console.error("[Marketing] Subscriber notification failed:", error.message);
        }
    } catch (error) {
        console.error("[Marketing] Failed to notify via email:", error);
    }

    return { success: true, message: "Subscribed" };
}