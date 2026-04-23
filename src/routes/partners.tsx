import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Handshake, TrendingUp, Users } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner with RovaCredit Africa" },
      { name: "description", content: "Retailers, SMEs and cooperatives — offer phone financing to your customers and staff." },
      { property: "og:title", content: "Partner with RovaCredit Africa" },
      { property: "og:description", content: "Offer phone financing to your customers and staff." },
    ],
  }),
  component: PartnersPage,
});

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().min(2),
  country: z.string(),
  business_type: z.string(),
  monthly_volume: z.string().optional(),
  message: z.string().optional(),
  consent_given: z.literal(true, { message: "Consent is required" }),
});
type Values = z.infer<typeof schema>;

function PartnersPage() {
  const [submitting, setSubmitting] = useState(false);
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
      message: "",
      consent_given: false as unknown as true,
    },
  });

  const onSubmit = async (v: Values) => {
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      source: "partner",
      full_name: v.full_name,
      email: v.email,
      phone: v.phone,
      country: v.country,
      subject: `${v.company} — ${v.business_type}`,
      message: v.message ?? null,
      consent_given: v.consent_given,
      metadata: { company: v.company, business_type: v.business_type, monthly_volume: v.monthly_volume ?? null },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Try again.");
      return;
    }
    toast.success("Thanks! Our partnerships team will be in touch.");
    form.reset();
  };

  return (
    <SiteShell>
      <section className="gradient-hero py-16 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Partner with RovaCredit Africa</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Offer phone financing to your customers, staff or cooperative — fully managed by us, branded for you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3 md:px-6">
        <Benefit Icon={Handshake} title="Co-branded experience" desc="Customers see your brand at checkout. We handle credit, you grow sales." />
        <Benefit Icon={TrendingUp} title="Higher conversion" desc="Average 30% lift in device sales when financing is offered at the point of sale." />
        <Benefit Icon={Users} title="Bulk SME terms" desc="Finance phones for your entire team or cooperative on flexible terms." />
      </section>

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="text-2xl font-bold">Tell us about your business</h2>
          <p className="mt-1 text-sm text-muted-foreground">We respond within one business day.</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
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
            </div>
            <Field label="Estimated monthly volume (devices)" id="monthly_volume" {...form.register("monthly_volume")} />
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={3} {...form.register("message")} />
            </div>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox onCheckedChange={(v) => form.setValue("consent_given", v === true ? (true as unknown as true) : (false as unknown as true), { shouldValidate: true })} />
              <span>I consent to RovaCredit Africa processing this data per Uganda DPPA 2019 and Kenya DPA 2019.</span>
            </label>
            {form.formState.errors.consent_given && <p className="text-xs text-destructive">{form.formState.errors.consent_given.message as string}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Become a Partner"}
            </Button>
          </form>
        </div>
      </section>
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

const Field = ({ label, id, error, ...rest }: { label: string; id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...rest} />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);
