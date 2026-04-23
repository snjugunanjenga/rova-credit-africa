import { createFileRoute } from "@tanstack/react-router";
import { DPO_EMAIL } from "@/lib/format";

export const Route = createFileRoute("/legal/data-practices")({
  head: () => ({ meta: [{ title: "Data Protection Practices — RovaCredit Africa" }] }),
  component: () => (
    <>
      <h1>Data Protection Practices</h1>
      <p>How RovaCredit Africa collects, stores, shares and lets you control your data.</p>
      <h2>Data Protection Officer</h2>
      <p>Contact our DPO at <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>.</p>
      <h2>Storage &amp; security</h2>
      <p>Data is stored in encrypted-at-rest databases hosted in EU regions, with access limited to vetted staff under role-based access control.</p>
      <h2>Sharing</h2>
      <p>We share data only with: (a) MTN MoMo / Airtel Money for repayment, (b) credit reference bureaus where legally required, (c) regulators on lawful request.</p>
      <h2>Your data subject rights</h2>
      <ul>
        <li>Access — request a copy of all personal data we hold on you</li>
        <li>Correction — fix incorrect data</li>
        <li>Deletion — request erasure (subject to credit-reporting retention rules)</li>
        <li>Portability — receive your data in a machine-readable format</li>
        <li>Objection — object to direct marketing at any time</li>
      </ul>
      <p>Submit any request via our <a href="/contact">contact form</a> with subject "Data Subject Request" or email the DPO directly.</p>
    </>
  ),
});
