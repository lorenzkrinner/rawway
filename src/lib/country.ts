import { cookies } from "next/headers";

export const COUNTRY_COOKIE = "country";
export const DEFAULT_COUNTRY_CODE = "DE";

export async function getCountryCode(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(COUNTRY_COOKIE)?.value || DEFAULT_COUNTRY_CODE;
}
