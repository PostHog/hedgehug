"use client"

import { Heart, ShieldCheck, Stethoscope } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function AboutSection() {
  const { t } = useI18n()

  const features = [
    {
      icon: Heart,
      title: t("about.rescue.title"),
      description: t("about.rescue.description"),
    },
    {
      icon: Stethoscope,
      title: t("about.health.title"),
      description: t("about.health.description"),
    },
    {
      icon: ShieldCheck,
      title: t("about.adoption.title"),
      description: t("about.adoption.description"),
    },
  ]

  return (
    <section className="bg-card border-y border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            {t("about.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("about.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary sm:mb-4 shrink-0">
                <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
