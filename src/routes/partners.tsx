import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Handshake, TrendingUp, Users, MapPin, ArrowRight, Check, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PartnerAgreementText } from "@/components/site/PartnerAgreement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { insertLead } from "@/integrations/database/client";
import { detectLocation } from "@/lib/geolocation";
import { leadRefFromId } from "@/lib/eligibility";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner with RovaCredit Africa" },
      { name: "description", content: "Retailers, SMEs and cooperatives — sell phones on credit on our behalf and earn your processing fee on the spot." },
      { property: "og:title", content: "Partner with RovaCredit Africa" },
      { property: "og:description", content: "Sell phones on credit. Get paid your processing fee the same day." },
    ],
  }),
  component: PartnersPage,
});

const AGREEMENT_VERSION = "v1.0";

const schema = z.object({
  full_name: z.string().trim().min(2, "Required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Required").max(20),
  company: z.string().trim().min(2, "Required").max(120),
  country: z.string(),
  business_type: z.string(),
  monthly_volume: z.string().trim().max(50).optional(),
  tin: z.string().trim().max(50).optional(),
  national_id: z.string().trim().max(50).optional(),
  momo_merchant_code: z.string().trim().max(50).optional(),
  foot_traffic: z.string().trim().max(50).optional(),
  business_address: z.string().trim().max(200).optional(),
  message: z.string().trim().max(500).optional(),
  consent_given: z.literal(true, { message: "Consent is required" }),
  agreement_accepted: z.literal(true, { message: "You must accept the agreement" }),
  signatory_name: z.string().trim().min(2, "Type your full name to sign").max(100),
});
type Values = z.infer<typeof schema>;

function PartnersPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [geo, setGeo] = useState<{ lat: number; lng: number; label?: string } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "detecting" | "ok" | "denied">("idle");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      country: "Uganda",
      business_type: "Retailer",
      monthly_volume: "",
      tin: "",
      national_id: "",
      momo_merchant_code: "",
      foot_traffic: "",
      business_address: "",
      message: "",
      consent_given: false as unknown as true,
      agreement_accepted: false as unknown as true,
      signatory_name: "",
    },
  });

  // Geolocate on entering step 2
  useEffect(() => {
    if (step !== 2 || geo) return;
    setGeoStatus("detecting");
    detectLocation().then((fix) => {
      if (fix) {
        setGeo({ lat: fix.latitude, lng: fix.longitude, label: fix.label });
        setGeoStatus("ok");
        if (fix.label) form.setValue("business_address", fix.label);
      } else {
        setGeoStatus("denied");
      }
    });
  }, [step, geo, form]);

  const advance = async () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) {
      const ok = await form.trigger([
        "full_name", "email", "phone", "company", "country", "business_type", "consent_given",
      ]);
      if (ok) setStep(3);
      return;
    }
  };

  const onSubmit = async (v: Values) => {
    setSubmitting(true);
    const acceptedAt = new Date().toISOString();
    try {
      const inserted = await insertLead({
        source: "partner",
        full_name: v.full_name,
        email: v.email,
        phone: v.phone,
        country: v.country,
        subject: `${v.company} — ${v.business_type}`,
        message: v.message ?? null,
        consent_given: v.consent_given,
        latitude: geo?.lat ?? null,
        longitude: geo?.lng ?? null,
        location_label: v.business_address || geo?.label || null,
        agreement_version: AGREEMENT_VERSION,
        agreement_accepted_at: acceptedAt,
        agreement_signatory_name: v.signatory_name,
        metadata: {
          company: v.company,
          business_type: v.business_type,
          monthly_volume: v.monthly_volume ?? null,
          tin: v.tin ?? null,
          national_id: v.national_id ?? null,
          momo_merchant_code: v.momo_merchant_code ?? null,
          foot_traffic: v.foot_traffic ?? null,
        },
      });
      if (!inserted) {
        toast.error("Could not submit. Try again.");
        setSubmitting(false);
        return;
      }
      toast.success(`Application submitted (${leadRefFromId(inserted.id)}). Our partnerships team will be in touch within 1 business day.`);
      form.reset();
      setStep(1);
      setGeo(null);
      setGeoStatus("idle");
    } catch {
      toast.error("Could not submit. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <SiteShell>
      <section className="gradient-hero py-16 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Sell phones on credit. Get paid the same day.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Partner with RovaCredit Africa to offer financed smartphones in your shop. We provide stock, credit, training and customer support — you earn your processing fee on every approved sale.
          </p>
        </div>
      </section>

      {/* Step indicator */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-4 py-4 text-xs font-medium md:px-6">
          {([1, 2, 3] as const).map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                  step >= s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-3 w-3" /> : s}
              </span>
              <span className={step >= s ? "text-foreground" : "text-muted-foreground"}>
                {s === 1 ? "How it works" : s === 2 ? "Your business" : "Sign agreement"}
              </span>
              {idx < 2 && <span className="mx-2 h-px w-8 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 — pitch & economics */}
      {step === 1 && (
        <>
          <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3 md:px-6">
            <Benefit Icon={Handshake} title="Co-branded experience" desc="Customers see your brand at checkout. We handle credit risk; you grow sales." />
            <Benefit Icon={TrendingUp} title="Paid on the spot" desc="Receive your full processing fee the same day each sale is approved." />
            <Benefit Icon={Users} title="No exposure" desc="Customer repays us directly via MoMo. You collect only the deposit." />
          </section>

          <section className="bg-muted/30 py-12">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
              <h2 className="text-2xl font-bold">Partner economics at a glance</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card title="What you earn">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Full processing fee paid on the day of every approved sale</li>
                    <li>✓ Volume bonuses above 25 devices per month</li>
                    <li>✓ Optional exclusive territory for high-performing partners</li>
                  </ul>
                </Card>
                <Card title="What you do">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Display POS materials we provide</li>
                    <li>✓ Submit applications via the RovaCredit platform</li>
                    <li>✓ Collect deposit (5%–25%, eligibility-based) via your MoMo merchant line</li>
                    <li>✓ Hand over device once we approve and confirm deposit</li>
                  </ul>
                </Card>
                <Card title="What we do">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Credit assessment &amp; eligibility tiering</li>
                    <li>✓ Customer support, collections &amp; recovery</li>
                    <li>✓ Training, branded materials, partner WhatsApp support</li>
                  </ul>
                </Card>
                <Card title="Customer plan">
                  <ul className="space-y-2 text-sm">
                    <li>✓ 5%–25% deposit based on eligibility tier</li>
                    <li>✓ Up to 12 months repayment</li>
                    <li>✓ Daily or weekly via MTN MoMo / Airtel Money</li>
                  </ul>
                </Card>
              </div>
              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={advance}>
                  Apply to partner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* STEP 2 — application */}
      {step === 2 && (
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-2xl px-4 md:px-6">
            <h2 className="text-2xl font-bold">Tell us about your business</h2>
            <p className="mt-1 text-sm text-muted-foreground">We respond within one business day.</p>

            <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Your name" id="full_name" {...form.register("full_name")} error={form.formState.errors.full_name?.message} />
                <Field label="Company name" id="company" {...form.register("company")} error={form.formState.errors.company?.message} />
                <Field label="Email" id="email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
                <Field label="Phone" id="phone" {...form.register("phone")} error={form.formState.errors.phone?.message} />
                <div>
                  <Label>Country</Label>
                  <Select defaultValue="Uganda" onValueChange={(v) => form.setValue("country", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Business type</Label>
                  <Select defaultValue="Retailer" onValueChange={(v) => form.setValue("business_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retailer">Retailer / Shop</SelectItem>
                      <SelectItem value="SME Employer">SME Employer</SelectItem>
                      <SelectItem value="Cooperative">Cooperative / SACCO</SelectItem>
                      <SelectItem value="Distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="TIN / Registration No." id="tin" {...form.register("tin")} />
                <Field label="Owner's National ID" id="national_id" {...form.register("national_id")} />
                <Field label="MoMo merchant code (optional)" id="momo_merchant_code" {...form.register("momo_merchant_code")} />
                <Field label="Avg foot traffic / day" id="foot_traffic" {...form.register("foot_traffic")} />
                <Field label="Estimated devices / month" id="monthly_volume" {...form.register("monthly_volume")} />
              </div>

              <div className="rounded-md border border-border bg-muted/40 p-3">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {geoStatus === "detecting" && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Detecting your business location…
                    </span>
                  )}
                  {geoStatus === "ok" && <span>{geo?.label ?? `${geo?.lat.toFixed(3)}, ${geo?.lng.toFixed(3)}`}</span>}
                  {geoStatus === "denied" && <span className="text-muted-foreground">Location not shared — type your business address below.</span>}
                </div>
                <Input
                  className="mt-2"
                  placeholder="Business address (e.g. Plot 24, Ben Kiwanuka St, Kampala)"
                  {...form.register("business_address")}
                />
              </div>

              <div>
                <Label htmlFor="message">Anything else?</Label>
                <Textarea id="message" rows={3} {...form.register("message")} />
              </div>

              <label className="flex items-start gap-2 text-xs">
                <Checkbox onCheckedChange={(v) => form.setValue("consent_given", v === true ? (true as unknown as true) : (false as unknown as true), { shouldValidate: true })} />
                <span>I consent to RovaCredit Africa processing this data per Uganda DPPA 2019 and Kenya DPA 2019.</span>
              </label>
              {form.formState.errors.consent_given && <p className="text-xs text-destructive">{form.formState.errors.consent_given.message as string}</p>}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={advance}>
                  Continue to agreement <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 — agreement */}
      {step === 3 && (
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-2xl px-4 md:px-6">
            <h2 className="text-2xl font-bold">Sign the Sales Partner Agreement</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please read the agreement summary below. The full text is available at{" "}
              <Link to="/legal/partner-agreement" className="text-primary underline">/legal/partner-agreement</Link>.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
              <ScrollArea className="h-72 rounded-md border border-border bg-muted/20 p-4">
                <PartnerAgreementText />
              </ScrollArea>

              <label className="flex items-start gap-2 text-sm">
                <Checkbox
                  onCheckedChange={(v) =>
                    form.setValue("agreement_accepted", v === true ? (true as unknown as true) : (false as unknown as true), { shouldValidate: true })
                  }
                />
                <span>
                  I have read and agree to the <strong>RovaCredit Sales Partner Agreement ({AGREEMENT_VERSION})</strong>.
                </span>
              </label>
              {form.formState.errors.agreement_accepted && (
                <p className="text-xs text-destructive">{form.formState.errors.agreement_accepted.message as string}</p>
              )}

              <div>
                <Label htmlFor="signatory_name">Type your full name to sign</Label>
                <Input id="signatory_name" {...form.register("signatory_name")} />
                {form.formState.errors.signatory_name && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.signatory_name.message as string}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Acknowledged at submission time. The Company will counter-sign and issue a binding execution copy within 5 business days.
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Sign & submit application"}
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}
    </SiteShell>
  );
}

function Benefit({ Icon, title, desc }: { Icon: typeof Handshake; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-3 font-semibold text-primary">{title}</h3>
      {children}
    </div>
  );
}

const Field = ({ label, id, error, ...rest }: { label: string; id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...rest} />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);
