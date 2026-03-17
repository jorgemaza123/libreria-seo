"use client";

import Image from "next/image";

export function HeroImageBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        src="/herolibreria.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center] sm:object-center"
      />
      <div className="absolute inset-0 bg-black/20 sm:bg-black/24" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/62 via-black/18 to-black/38" />
      <div className="absolute inset-x-[-10%] bottom-[-14%] h-[46%] rounded-[100%] bg-black/88 blur-3xl sm:bottom-[-12%] sm:h-[42%]" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(180deg,rgba(4,6,10,0)_0%,rgba(4,6,10,0.10)_18%,rgba(4,6,10,0.24)_34%,rgba(4,6,10,0.50)_54%,rgba(4,6,10,0.78)_72%,rgba(4,6,10,0.94)_88%,rgba(4,6,10,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(4,6,10,0.06)_0%,rgba(4,6,10,0.10)_24%,rgba(4,6,10,0.28)_48%,rgba(4,6,10,0)_72%)]" />
    </div>
  );
}
