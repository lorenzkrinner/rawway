import type { Metadata } from "next";

import PoliciesPage from "src/components/pages/policies/policies-page";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Read our shipping policy, refund policy, privacy policy, and terms of service.",
};

export default function Page() {
  return <PoliciesPage />;
}
