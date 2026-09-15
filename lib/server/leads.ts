import { getResendClient, getAdminEmailTarget } from "@/lib/email/client";

export interface Lead {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    subject?: string;
    message?: string;
    source?: string;
    path?: string;
    locale?: string;
}

const escapeHtml = (str: string = "") =>
    str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export async function createLead(data: {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    subject?: string;
    message?: string;
    source?: string;
    path?: string;
    locale?: string;
}): Promise<Lead> {
    const lead: Lead = {
        id: crypto.randomUUID(),
        ...data,
    };

    try {
        const resend = await getResendClient();
        if (!resend) return lead;

        const recipient = await getAdminEmailTarget();
        const { error } = await resend.emails.send({
            from: "Crediblemark Contact <noreply@update.crediblemark.com>",
            to: [recipient],
            replyTo: data.email,
            subject: `[Lead] ${escapeHtml(data.subject || "")} - ${escapeHtml(data.firstName)}`,
            html: `
                <h2>New Lead Submission</h2>
                <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName || "")}</p>
                <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                ${data.phoneNumber ? `<p><strong>Phone:</strong> ${escapeHtml(data.phoneNumber)}</p>` : ""}
                ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
                ${data.message ? `<p><strong>Message:</strong><br />${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>` : ""}
                <hr />
                <p><em>Source: ${escapeHtml(data.source || "")} ${data.path ? `| Path: ${escapeHtml(data.path)}` : ""}</em></p>
            `,
        });

        if (error) {
            console.error("[Leads] Email notification failed:", error.message);
        }
    } catch (error) {
        console.error("[Leads] Failed to notify via email:", error);
    }

    return lead;
}