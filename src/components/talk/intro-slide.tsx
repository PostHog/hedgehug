"use client"

import Image from "next/image"

interface IntroSlideProps {
  title: string
  subtitle?: string
  name: string
  role: string
  mascotSrc?: string
}

export function IntroSlide({
  title,
  subtitle,
  name,
  role,
  mascotSrc = "/hedgehog.svg",
}: IntroSlideProps) {
  return (
    <div className="fixed inset-0 bg-[#EEEFE9] text-[#151515] overflow-hidden">
      {/* PostHog logo - top left */}
      <div className="absolute top-10 left-10 sm:top-12 sm:left-14">
        <Image
          src="/logo-row.svg"
          alt="PostHog"
          width={180}
          height={32}
          className="h-7 sm:h-8 w-auto"
        />
      </div>

      {/* Mascot - right side */}
      <div className="absolute right-0 sm:right-8 top-1/2 -translate-y-1/2 w-[40%] max-w-[500px] flex items-center justify-center pointer-events-none">
        <Image
          src={mascotSrc}
          alt=""
          width={500}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Title block - vertically centered, left-aligned */}
      <div className="absolute left-10 sm:left-14 top-1/2 -translate-y-1/2 max-w-[55%] sm:max-w-2xl">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-2xl lg:text-3xl mt-3 sm:mt-4 text-[#151515]/80 leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Author - bottom left, lifted above nav bar */}
      <div className="absolute bottom-20 left-10 sm:bottom-24 sm:left-14 flex items-center gap-5 z-10">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
          <Image
            src="/avatar.png"
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-bold text-lg sm:text-xl leading-tight">{name}</p>
          <p className="text-sm sm:text-base text-[#151515]/60 mt-1">{role}</p>
        </div>
      </div>
    </div>
  )
}
