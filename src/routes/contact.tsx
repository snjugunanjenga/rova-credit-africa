import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY, COMPANY_EMAIL } from "@/lib/format";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RovaCredit Africa" },
      { name: "description", content: "WhatsApp, email or visit our Kampala HQ. We respond fast." },
      { property: "og:title", content: "Contact RovaCredit Africa" },
      { property: "og:description", content: "WhatsApp, email or visit our Kampala HQ." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(5),
  consent_given: z.literal(true, { message: "Consent is required" }),
});
type Values = z.infer<typeof schema>;

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "", email: "", phone: "", subject: "", message: "",
      consent_given: false as unknown as true,
    },
  });

  const onSubmit = async (v: Values) => {
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      source: "direct",
      full_name: v.full_name,
      email: v.email,
      phone: v.phone || null,
      subject: v.subject,
      message: v.message,
      consent_given: v.consent_given,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please try again.");
      return;
    }
    toast.success("Message sent! We'll respond within 1 business day.");
    form.reset();
  };

  return (
    <SiteShell>
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
          <p className="mt-2 text-muted-foreground">We're here to help — by WhatsApp, email or in person.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6">
        <div className="space-y-4">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary">
            <MessageCircle className="h-5 w-5 text-whatsapp" />
            <div>
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{WHATSAPP_NUMBER_DISPLAY}</p>
            </div>
          </a>
          <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">{COMPANY_EMAIL}</p>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Kampala HQ</p>
              <p className="text-sm text-muted-foreground">Plot 12, Kampala Road, Kampala, Uganda</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Nairobi office</p>
              <p className="text-sm text-muted-foreground">Westlands Office Park, Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="full_name">Name</Label>
            <Input id="full_name" {...form.register("full_name")} />
            {form.formState.errors.full_name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.full_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" {...form.register("phone")} />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...form.register("subject")} />
            {form.formState.errors.subject && <p className="mt-1 text-xs text-destructive">{form.formState.errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={4} {...form.register("message")} />
            {form.formState.errors.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>}
          </div>
          <label className="flex items-start gap-2 text-xs">
            <Checkbox onCheckedChange={(v) => form.setValue("consent_given", v === true ? (true as unknown as true) : (false as unknown as true), { shouldValidate: true })} />
            <span>I consent to RovaCredit Africa processing this data per Uganda DPPA 2019 and Kenya DPA 2019.</span>
          </label>
          {form.formState.errors.consent_given && <p className="text-xs text-destructive">{form.formState.errors.consent_given.message as string}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </SiteShell>
  );
}
