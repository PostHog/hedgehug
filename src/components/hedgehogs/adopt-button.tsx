"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, CheckCircle2, PartyPopper } from "lucide-react"
import posthog from "posthog-js"
import { useFeatureFlagVariant } from "@/hooks/use-feature-flag"
import { useI18n, useTranslationArray } from "@/lib/i18n/context"

type Step = "idle" | "terms" | "confirm" | "success"

export function AdoptButton({
  hedgehogName,
  hedgehogId,
}: {
  hedgehogName: string
  hedgehogId: string
}) {
  const { t } = useI18n()
  const [step, setStep] = useState<Step>("idle")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const flowVariant = useFeatureFlagVariant("simplified-adoption-flow")
  const simplifiedFlow =
    flowVariant === "skip-terms" || flowVariant === "one-click"
  const termsItems = useTranslationArray("adopt.terms.items")

  function handleAdoptClick() {
    posthog.capture("adoption_started", {
      hedgehog_name: hedgehogName,
      hedgehog_id: hedgehogId,
      flow_variant: flowVariant || "control",
    })

    if (flowVariant === "one-click") {
      posthog.capture("adoption_requested", {
        hedgehog_name: hedgehogName,
        hedgehog_id: hedgehogId,
        flow_variant: "one-click",
      })
      setStep("success")
    } else if (flowVariant === "skip-terms") {
      setStep("confirm")
    } else {
      setStep("terms")
    }
  }

  function handleAcceptTerms() {
    posthog.capture("adoption_terms_accepted", {
      hedgehog_name: hedgehogName,
      hedgehog_id: hedgehogId,
    })
    setStep("confirm")
  }

  function handleConfirmAdoption() {
    posthog.capture("adoption_requested", {
      hedgehog_name: hedgehogName,
      hedgehog_id: hedgehogId,
      flow_variant: flowVariant || "control",
    })
    setStep("success")
  }

  function handleClose() {
    if (step !== "success" && step !== "idle") {
      posthog.capture("adoption_abandoned", {
        hedgehog_name: hedgehogName,
        hedgehog_id: hedgehogId,
        abandoned_at_step: step,
        flow_variant: flowVariant || "control",
      })
    }
    setStep("idle")
    setTermsAccepted(false)
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full sm:w-auto font-semibold"
        onClick={handleAdoptClick}
      >
        <Heart className="h-4 w-4 mr-2" />
        {t("adopt.cta")}
      </Button>

      <Dialog
        open={step !== "idle"}
        onOpenChange={(open) => {
          if (!open) handleClose()
        }}
      >
        {step === "terms" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("adopt.terms.title")}</DialogTitle>
              <DialogDescription>
                {t("adopt.terms.description", hedgehogName)}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-3 max-h-48 overflow-y-auto">
              <p>{t("adopt.terms.intro")}</p>
              <ul className="list-disc pl-4 space-y-1.5">
                {termsItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked === true)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm leading-snug cursor-pointer"
              >
                {t("adopt.terms.checkbox")}
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("adopt.terms.cancel")}
              </Button>
              <Button disabled={!termsAccepted} onClick={handleAcceptTerms}>
                {t("adopt.terms.accept")}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {step === "confirm" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("adopt.confirm.title")}</DialogTitle>
              <DialogDescription>
                {t("adopt.confirm.description", hedgehogName)}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-sm">
                  {simplifiedFlow
                    ? t("adopt.confirm.terms_implicit")
                    : t("adopt.confirm.terms_ok")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-sm">{t("adopt.confirm.interview")}</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-sm">
                  {t("adopt.confirm.reserved", hedgehogName)}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("adopt.terms.cancel")}
              </Button>
              <Button onClick={handleConfirmAdoption}>
                <Heart className="h-4 w-4 mr-2 fill-current" />
                {t("adopt.confirm.button")}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {step === "success" && (
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
                <PartyPopper className="h-8 w-8" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {t("adopt.success.title")}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {t("adopt.success.description", hedgehogName)}
                </DialogDescription>
              </DialogHeader>
              <Button className="mt-2" onClick={handleClose}>
                {t("adopt.success.close")}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
