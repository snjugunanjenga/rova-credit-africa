import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({ meta: [{ title: "Cookie Policy — RovaCredit Africa" }] }),
  component: () => (
    <>
      <h1>Cookie Policy</h1>
      <p>We use cookies to keep the site working, remember your preferences and measure traffic.</p>
      <h2>Categories</h2>
      <ul>
        <li><strong>Essential</strong> — always on; needed for the site to function.</li>
        <li><strong>Analytics</strong> — only set after you Accept on the cookie banner.</li>
      </ul>
      <p>You can reset your choice any time via the "Reset cookie consent" link in the footer.</p>
    </>
  ),
});
