import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — RovaCredit Africa" }] }),
  component: () => (
    <>
      <h1>Privacy Policy</h1>
      <p>Effective: 2026. RovaCredit Africa Ltd ("we", "us") respects your privacy.</p>
      <h2>Legal basis</h2>
      <p>We process personal data in line with the <strong>Uganda Data Protection and Privacy Act 2019</strong> and the <strong>Kenya Data Protection Act 2019</strong>.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Identity: full name, ID type and number</li>
        <li>Contact: phone, email, country</li>
        <li>Financial: monthly income range, mobile-money number</li>
        <li>Device: browser, IP, analytics events (with consent)</li>
      </ul>
      <h2>Why we collect it</h2>
      <ul>
        <li>To process credit applications and disburse devices</li>
        <li>To service repayments via MTN MoMo and Airtel Money</li>
        <li>To comply with KYC and credit-reporting obligations</li>
      </ul>
      <h2>Your rights</h2>
      <p>You may request access, correction, deletion or portability of your data. Email <a href="mailto:dpo@rovacredit.africa">dpo@rovacredit.africa</a>.</p>
    </>
  ),
});
