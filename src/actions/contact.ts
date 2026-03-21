"use server";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendContactForm(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const email = formData.get("email");
  const subject = formData.get("subject");
  const body = formData.get("body");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return { success: false, message: "Please enter a subject." };
  }

  if (!body || typeof body !== "string" || body.trim().length === 0) {
    return { success: false, message: "Please enter a message." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.error("Resend environment variables not configured");
    return {
      success: false,
      message: "Contact form is currently unavailable.",
    };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Keon Contact Form <onboarding@resend.dev>`,
        to: [contactEmail],
        reply_to: email,
        subject: `[Keon Contact] ${subject.trim()}`,
        text: `From: ${email}\n\nSubject: ${subject.trim()}\n\n${body.trim()}`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", response.status, errorBody);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message: "Message sent! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
