import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/format";

const schema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  country: z.string().min(2),
  id_type: z.string().optional(),
  monthly_income: z.string().optional(),
  message: z.string().optional(),
  consent_given: z.literal(true, { message: "Consent is required" }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
}

export function LeadModal({ open, onOpenChange, productId, productName }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      country: "Uganda",
      id_type: "National ID",
      monthly_income: "",
      message: "",
      consent_given: false as unknown as true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      source: "marketplace",
      full_name: values.full_name,
      phone: values.phone,
      email: values.email || null,
      country: values.country,
      id_type: values.id_type ?? null,
      monthly_income: values.monthly_income ?? null,
      message: values.message ?? null,
      consent_given: values.consent_given,
      product_id: productId ?? null,
      product_snapshot: productName ? { name: productName } : null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    toast.success("Application received! Opening WhatsApp…");
    const msg = `Hello RovaCredit Africa, I just applied to finance ${productName ?? "a smartphone"}. My name is ${values.full_name}.`;
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                defaultValue="Uganda"
                onValueChange={(v) => form.setValue("country", v)}
              >
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
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
              <Select
                defaultValue="National ID"
                onValueChange={(v) => form.setValue("id_type", v)}
              >
                <SelectTrigger id="id_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="National ID">National ID</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="Driver's License">Driver's License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="monthly_income">Monthly income (UGX)</Label>
            <Input id="monthly_income" placeholder="e.g. 500,000" {...form.register("monthly_income")} />
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
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
