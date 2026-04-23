import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/partner-agreement")({
  head: () => ({
    meta: [
      { title: "Sales Partner Agreement — RovaCredit Africa" },
      { name: "description", content: "Template Sales Partner Agreement governing RovaCredit Africa's relationship with retail and SME partners." },
    ],
  }),
  component: PartnerAgreementPage,
});

function PartnerAgreementPage() {
  return (
    <>
      <h1>Sales Partner Agreement (v1.0)</h1>
      <p className="text-sm text-muted-foreground">
        This is a template agreement. Final binding terms will be issued after onboarding review and must be reviewed with Ugandan / Kenyan legal counsel before launch.
      </p>

      <h2>1. Appointment</h2>
      <p>
        RovaCredit Africa Ltd ("Company") appoints the undersigned business ("Partner") as a non-exclusive sales partner authorised to market and originate device-financing applications on the Company's behalf within the Partner's premises and territory.
      </p>

      <h2>2. Partner obligations</h2>
      <ul>
        <li>Display Company-approved point-of-sale materials and pricing.</li>
        <li>Submit complete, truthful customer applications via the RovaCredit platform.</li>
        <li>Collect customer deposit (5%–25% of asset price, eligibility-based) via the Partner's MTN MoMo / Airtel Money merchant line and remit to the Company within 24 hours.</li>
        <li>Hand over devices to customers only after the Company has confirmed deposit receipt and credit approval.</li>
        <li>Comply with the Uganda Data Protection &amp; Privacy Act 2019 and Kenya Data Protection Act 2019 when handling customer data.</li>
      </ul>

      <h2>3. Company obligations</h2>
      <ul>
        <li>Provide credit assessment, customer support, collections and recovery.</li>
        <li>Pay the Partner's processing fee on the day of approved sale (full processing fee up-front).</li>
        <li>Provide training, branded sales materials and dedicated partner support on WhatsApp.</li>
        <li>Maintain the technology platform, marketplace and lead routing.</li>
      </ul>

      <h2>4. Commercial terms</h2>
      <ul>
        <li>Processing fee: paid in full on the day of approved sale.</li>
        <li>Customer deposit: eligibility-based 5% – 25% of asset price, collected by Partner via MoMo / Airtel Money.</li>
        <li>Repayment: up to 12 months, daily or weekly cadence via mobile money.</li>
        <li>Service fees and interest are disclosed to the customer in the application flow.</li>
      </ul>

      <h2>5. Data protection</h2>
      <p>
        The Partner acts as a data processor on behalf of the Company. All personal data collected from applicants must be transmitted only via the Company platform and never stored outside it. The Partner shall report any suspected data breach to the Company within 24 hours.
      </p>

      <h2>6. Term &amp; termination</h2>
      <p>
        This Agreement runs for an initial 12 months and renews automatically. Either party may terminate with 30 days written notice. The Company may suspend the Partner immediately for breach of clause 2 or clause 5.
      </p>

      <h2>7. Liability &amp; indemnity</h2>
      <p>
        The Partner indemnifies the Company against losses arising from misrepresentation of customers, mishandling of deposits, or non-compliance with applicable data-protection law.
      </p>

      <h2>8. Governing law</h2>
      <p>
        This Agreement is governed by the laws of the Republic of Uganda. Disputes are referred first to good-faith mediation, then to arbitration in Kampala under the Centre for Arbitration and Dispute Resolution (CADER).
      </p>

      <h2>9. Acceptance</h2>
      <p>
        Acceptance is recorded electronically when the Partner's authorised signatory completes the partner onboarding flow on rovacredit.africa. The Company will counter-sign and issue a binding execution copy within 5 business days.
      </p>

      <p className="mt-6 text-xs text-muted-foreground">
        Document version: v1.0 — Template only. Subject to legal review.
      </p>
    </>
  );
}
