import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — RovaCredit Africa" }] }),
  component: () => (
    <>
      <h1>Terms of Service</h1>
      <p>By using RovaCredit Africa, you agree to these terms.</p>
      <h2>Eligibility</h2>
      <p>You must be 18+, a resident of Uganda, Kenya, Tanzania or Rwanda, and hold a valid national ID.</p>
      <h2>Credit terms</h2>
      <p>Down payment, instalment amount and tenure are confirmed in writing before disbursement. Default may result in device repossession and credit-bureau reporting.</p>
      <h2>Limitation of liability</h2>
      <p>RovaCredit Africa is not liable for device manufacturer defects beyond the standard warranty.</p>
    </>
  ),
});
