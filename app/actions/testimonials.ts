"use server";

import { getResendClient, getAdminEmailTarget } from "@/lib/email/client";

const escapeHtml = (str: string = "") =>
    str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export async function submitTestimonial(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;

    if (!name || !role || !content) {
        return { success: false, error: "Please fill in all fields" };
    }

    try {
        const resend = await getResendClient();
        if (resend) {
            const recipient = await getAdminEmailTarget();
            const { error } = await resend.emails.send({
                from: "Crediblemark <noreply@update.crediblemark.com>",
                to: [recipient],
                subject: `[Testimonial] New testimonial from ${escapeHtml(name)}`,
                html: `
                    <h2>New Testimonial Submission</h2>
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Role:</strong> ${escapeHtml(role)}</p>
                    <hr />
                    <p>${escapeHtml(content).replace(/\n/g, "<br>")}</p>
                `,
            });
            if (error) {
                console.error("[Testimonial] Email notification failed:", error.message);
            }
        }

        return {
            success: true,
            data: { id: crypto.randomUUID(), name, role, content, isActive: false },
        };
    } catch {
        return { success: false, error: "Failed to create testimonial" };
    }
}