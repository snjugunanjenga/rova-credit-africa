import { Link } from "@tanstack/react-router";

export function PartnerAgreementText() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
      <p className="font-semibold">RovaCredit Africa — Sales Partner Agreement (v1.0)</p>
      <p>
        This is a template agreement. The full text is available at{" "}
        <Link to="/legal/partner-agreement" className="text-primary underline">/legal/partner-agreement</Link>.
        Final binding terms are issued after onboarding review and must be reviewed with Ugandan / Kenyan legal counsel before launch.
      </p>

      <p><strong>1. Appointment.</strong> Partner is appointed as a non-exclusive sales partner to originate device-financing applications on the Company's behalf.</p>

      <p><strong>2. Partner obligations.</strong> Display approved POS materials; submit truthful applications via the platform; collect customer deposit (5%–25%, eligibility-based) via MoMo / Airtel and remit to the Company within 24h; hand over devices only after deposit + approval; comply with Uganda DPPA 2019 and Kenya DPA 2019.</p>

      <p><strong>3. Company obligations.</strong> Credit assessment, customer support and collections; payment of Partner's processing fee in full on the day of sale; training and branded materials; platform and lead routing.</p>

      <p><strong>4. Commercial terms.</strong> Processing fee paid up-front on each approved sale. Customer deposit 5%–25% of asset price (collected by Partner via MoMo). Repayment up to 12 months, daily or weekly. Service fees and interest disclosed to the customer at application.</p>

      <p><strong>5. Data protection.</strong> Partner acts as processor on behalf of the Company. Customer data may only be transmitted via the platform. Suspected breaches must be reported within 24h.</p>

      <p><strong>6. Term &amp; termination.</strong> 12-month initial term, auto-renews. Either party may terminate with 30 days notice. Immediate suspension for breach of clauses 2 or 5.</p>

      <p><strong>7. Liability &amp; indemnity.</strong> Partner indemnifies the Company for losses arising from misrepresentation, mishandling of deposits or non-compliance with data-protection law.</p>

      <p><strong>8. Governing law.</strong> Laws of the Republic of Uganda. Disputes mediated, then arbitrated in Kampala under CADER.</p>

      <p><strong>9. Acceptance.</strong> Recorded electronically when the Partner's signatory completes this onboarding flow. The Company will counter-sign within 5 business days.</p>
    </div>
  );
}
