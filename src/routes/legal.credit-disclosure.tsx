import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/credit-disclosure")({
  head: () => ({ meta: [{ title: "Consumer Credit Disclosure — RovaCredit Africa" }] }),
  component: () => (
    <>
      <h1>Consumer Credit Disclosure</h1>
      <p>Before signing a credit agreement with RovaCredit Africa you will receive a written disclosure showing:</p>
      <ul>
        <li>Cash price of the device (UGX)</li>
        <li>Down payment</li>
        <li>Total amount financed</li>
        <li>Instalment amount, frequency (weekly / monthly) and tenure</li>
        <li>Total cost of credit (interest + fees)</li>
        <li>Annual Percentage Rate (APR)</li>
        <li>Late-payment fees and consequences of default</li>
      </ul>
      <p>You may cancel within 24 hours of signing without penalty.</p>
    </>
  ),
});
