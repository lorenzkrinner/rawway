"use server";

const KLAVIYO_API_URL = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

export async function subscribeToNewsletter(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const email = formData.get("email");

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    console.error("Klaviyo environment variables not configured");
    return { success: false, message: "Newsletter signup is currently unavailable." };
  }

  try {
    const response = await fetch(`${KLAVIYO_API_URL}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/json",
        revision: KLAVIYO_REVISION,
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: { marketing: { consent: "SUBSCRIBED" } },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: { type: "list", id: listId },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Klaviyo API error:", response.status, errorBody);
      return { success: false, message: "Something went wrong. Please try again." };
    }

    return { success: true, message: "You're in! Check your inbox." };
  } catch (error) {
    console.error("Klaviyo subscription error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
