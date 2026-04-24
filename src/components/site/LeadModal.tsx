import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { insertLead } from "@/integrations/database/client";
import { whatsappLink, formatUGX } from "@/lib/format";
import {
  computeEligibility,
  buildRepaymentPlan,
  INCOME_BANDS,
  EMPLOYMENT_TYPES,
  CADENCES,
  leadRefFromId,
  type IncomeBand,
  type EmploymentType,
  type RepaymentCadence,
} from "@/lib/eligibility";
import { detectLocation } from "@/lib/geolocation";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  email: z.string().trim().email("Valid email required").max(255).optional().or(z.literal("")),
  country: z.string().min(2),
  id_type: z.string().optional(),
  income: z.enum(["<150k", "150k-300k", "300k-600k", "600k-1.5M", ">1.5M"]),
  employment: z.enum(["Salaried", "Self-employed", "Boda", "Student", "Farmer"]),
  cadence: z.enum(["Daily", "Weekly", "Monthly"]),
  area_manual: z.string().trim().max(120).optional(),
  message: z.string().trim().max(500).optional(),
  consent_given: z.literal(true, { message: "Consent is required" }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
  productPrice?: number;
}

export function LeadModal({ open, onOpenChange, productId, productName, productPrice }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [geo, setGeo] = useState<{ lat: number; lng: number; label?: string } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "detecting" | "ok" | "denied">("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      country: "Uganda",
      id_type: "National ID",
      income: "300k-600k",
      employment: "Self-employed",
      cadence: "Weekly",
      area_manual: "",
      message: "",
      consent_given: false as unknown as true,
    },
  });

  // Auto-request geolocation when modal opens.
  useEffect(() => {
    if (!open) return;
    setGeoStatus("detecting");
    detectLocation().then((fix) => {
      if (fix) {
        setGeo({ lat: fix.latitude, lng: fix.longitude, label: fix.label });
        setGeoStatus("ok");
        if (fix.label) form.setValue("area_manual", fix.label);
      } else {
        setGeoStatus("denied");
      }
    });
  }, [open, form]);

  const watched = form.watch(["income", "employment", "cadence"]);
  const eligibility = useMemo(
    () =>
      computeEligibility({
        income: watched[0] as IncomeBand,
        employment: watched[1] as EmploymentType,
        cadence: watched[2] as RepaymentCadence,
      }),
    [watched],
  );

  const plan = useMemo(() => {
    if (!productPrice) return null;
    return buildRepaymentPlan({
      assetPrice: productPrice,
      downPaymentPct: eligibility.downPaymentPct,
      cadence: watched[2] as RepaymentCadence,
    });
  }, [productPrice, eligibility.downPaymentPct, watched]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const computedDown = plan?.downPayment ?? null;
    const insertPayload = {
      source: "marketplace" as const,
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || null,
      country: values.country,
      id_type: values.id_type ?? null,
      monthly_income: values.income,
      message: values.message ?? null,
      consent_given: values.consent_given,
      product_id: productId ?? null,
      product_snapshot: productName
        ? { name: productName, price: productPrice ?? null }
        : null,
      latitude: geo?.lat ?? null,
      longitude: geo?.lng ?? null,
      location_label: values.area_manual || geo?.label || null,
      eligibility_tier: eligibility.tier,
      eligibility_down_payment_pct: eligibility.downPaymentPct,
      computed_down_payment: computedDown,
      repayment_cadence: values.cadence,
      employment_type: values.employment,
    };

    let inserted: { id: string } | null = null;
    try {
      inserted = await insertLead(insertPayload);
    } catch {
      setSubmitting(false);
      toast.error("Could not submit. Please try again.");
      return;
    }
    setSubmitting(false);

    if (!inserted) {
      toast.error("Could not submit. Please try again.");
      return;
    }

    const ref = leadRefFromId(inserted.id);
    const incomeLabel = INCOME_BANDS.find((b) => b.value === values.income)?.label ?? values.income;
    const locStr = geo
      ? `${values.area_manual || geo.label || "—"} (${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)})`
      : values.area_manual || "Not provided";

    const lines = [
      `Hello RovaCredit Africa 👋`,
      `I'd like to apply for the *${productName ?? "a smartphone"}*${productPrice ? ` (${formatUGX(productPrice)})` : ""}.`,
      `Name: ${values.full_name}`,
      `Phone: ${values.phone}`,
      `Location: ${locStr}`,
      `Income band: ${incomeLabel} · ${values.employment} · ${values.cadence} repayments`,
      plan
        ? `Eligibility tier: ${eligibility.tier} → estimated ${(eligibility.downPaymentPct * 100).toFixed(0)}% down (${formatUGX(plan.downPayment)})`
        : `Eligibility tier: ${eligibility.tier} → estimated ${(eligibility.downPaymentPct * 100).toFixed(0)}% down`,
      `Lead ref: ${ref}`,
      `I consent to processing per Uganda DPPA 2019 / Kenya DPA 2019.`,
    ];

    toast.success(`Application received (${ref}). Opening WhatsApp…`);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    onOpenChange(false);
    form.reset();
    setGeo(null);
    setGeoStatus("idle");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for financing</DialogTitle>
          <DialogDescription>
            {productName ? <>Device: <span className="font-medium text-foreground">{productName}</span></> : "Quick application — we'll respond on WhatsApp."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" {...form.register("full_name")} />
            {form.formState.errors.full_name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.full_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Phone (MoMo)</Label>
              <Input id="phone" placeholder="+256 7XX XXX XXX" {...form.register("phone")} />
              {form.formState.errors.phone && <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
          </div>

          {/* Location */}
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {geoStatus === "detecting" && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Detecting your location…
                </span>
              )}
              {geoStatus === "ok" && (
                <span className="text-foreground">
                  {geo?.label ?? `${geo?.lat.toFixed(3)}, ${geo?.lng.toFixed(3)}`}
                </span>
              )}
              {geoStatus === "denied" && (
                <span className="text-muted-foreground">Location not shared — type your area below.</span>
              )}
            </div>
            <Input
              className="mt-2"
              placeholder="Area / town (e.g. Ntinda, Kampala)"
              {...form.register("area_manual")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="Uganda" onValueChange={(v) => form.setValue("country", v)}>
                <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                  <SelectItem value="Rwanda">Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_type">ID type</Label>
              <Select defaultValue="National ID" onValueChange={(v) => form.setValue("id_type", v)}>
                <SelectTrigger id="id_type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="National ID">National ID</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="Driver's License">Driver's License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Eligibility quiz */}
          <div className="rounded-md border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick eligibility check
            </p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Monthly income</Label>
                <Select
                  defaultValue="300k-600k"
                  onValueChange={(v) => form.setValue("income", v as IncomeBand)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INCOME_BANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Employment</Label>
                <Select
                  defaultValue="Self-employed"
                  onValueChange={(v) => form.setValue("employment", v as EmploymentType)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Repayment</Label>
                <Select
                  defaultValue="Weekly"
                  onValueChange={(v) => form.setValue("cadence", v as RepaymentCadence)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CADENCES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-primary/5 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{eligibility.label}</span>
                <span className="text-xs text-muted-foreground">
                  {(eligibility.downPaymentPct * 100).toFixed(0)}% down
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{eligibility.description}</p>
              {plan && productPrice && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-2 text-xs">
                  <Stat label="Down payment" value={formatUGX(plan.downPayment)} highlight />
                  <Stat label="Financed" value={formatUGX(plan.financedAmount)} />
                  <Stat label={`${plan.cadence} payment`} value={formatUGX(plan.installmentAmount)} />
                  <Stat label="Term" value={`${plan.installmentsCount} × ${plan.cadence.toLowerCase()}`} />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea id="message" rows={2} {...form.register("message")} />
          </div>
          <label className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs">
            <Checkbox
              id="consent"
              onCheckedChange={(v) => form.setValue("consent_given", v === true ? (true as unknown as true) : (false as unknown as true), { shouldValidate: true })}
            />
            <span>
              I consent to RovaCredit Africa processing my personal data per the{" "}
              <strong>Uganda Data Protection and Privacy Act 2019</strong> and{" "}
              <strong>Kenya Data Protection Act 2019</strong>.
            </span>
          </label>
          {form.formState.errors.consent_given && <p className="text-xs text-destructive">{form.formState.errors.consent_given.message as string}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit & open WhatsApp"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={highlight ? "font-bold text-primary" : "font-medium text-foreground"}>{value}</p>
    </div>
  );
}
