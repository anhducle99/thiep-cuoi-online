"use client";

import { useGuestName } from "@/components/GuestNameProvider";
import type { WeddingData } from "@/types/wedding";
import { cn } from "@/lib/utils";

export function OliveWaxSealCover({
  data,
  onOpen,
  isOpening,
}: {
  data: WeddingData;
  onOpen: () => void;
  isOpening: boolean;
}) {
  const { guestName } = useGuestName();

  return (
    <div
      id="miuOpening"
      className={cn(
        "fixed inset-0 z-[12000] flex items-center justify-center pointer-events-auto transition-opacity duration-700",
        isOpening && "pointer-events-none opacity-0 delay-700",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Bìa thiệp cưới"
    >
      <div
        id="miuOpeningSides"
        className={cn(
          "relative h-full w-full max-w-[575px] overflow-hidden shadow-2xl",
          isOpening && "_animating",
        )}
      >
        {/* Right Flap (50% width, background olive) */}
        <div
          className={cn(
            "card-side right absolute right-0 top-0 h-full w-[50%] bg-[#4e6437] z-0 transition-transform duration-1000 ease-in-out",
            isOpening && "translate-x-full",
          )}
          aria-hidden="true"
        />

        {/* Left Flap (68% width, olive with cream stripe on the right edge) */}
        <div
          className={cn(
            "card-side left absolute left-0 top-0 h-full w-[68%] z-10 select-none transition-transform duration-1000 ease-in-out shadow-[4px_0_20px_rgba(0,0,0,0.25)]",
            isOpening && "-translate-x-[110%]",
          )}
          style={{
            background:
              "linear-gradient(to right, var(--olive-primary, #4e6437) 0%, var(--olive-primary, #4e6437) calc(100% - 3.5%), #e9e9e9 calc(100% - 3.5%), #e9e9e9 100%)",
          }}
        >
          {/* Top text: Save our date */}
          <div
            className="wedding-save-the-date absolute left-[clamp(16px,5vw,32px)] top-[clamp(40px,7vh,80px)] z-20 flex items-end gap-1 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ fontFamily: "var(--font-high-spirited), cursive" }}
          >
            <span className="text-[clamp(75px,16vw,110px)] leading-[0.75] translate-y-2">
              S
            </span>
            <span className="text-[clamp(36px,9vw,56px)] leading-none font-normal">
              ave our date
            </span>
          </div>

          {/* Center-left names */}
          <div className="opening-names absolute left-[clamp(20px,6vw,36px)] top-[clamp(160px,26vh,240px)] z-20 flex flex-col gap-1 text-white/95 max-w-[80%] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            <div
              className="text-[clamp(28px,6.8vw,42px)] leading-tight tracking-wide font-medium"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              {data.groom.shortName}
            </div>
            <div
              className="text-[clamp(26px,6vw,38px)] italic leading-none pl-3 text-amber-100/90"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              &amp;
            </div>
            <div
              className="text-[clamp(28px,6.8vw,42px)] leading-tight tracking-wide font-medium"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              {data.bride.shortName}
            </div>
          </div>

          {/* Wax seal icon placed right on the edge seam (left: 98%) */}
          <div
            className={cn(
              "seal-icon absolute top-1/2 left-[98%] -translate-x-1/2 -translate-y-1/2 z-20 w-[80px] h-[80px] transition-transform duration-500",
              isOpening && "scale-90 opacity-0",
            )}
          >
            <button
              id="miuOpeningBtn"
              type="button"
              onClick={onOpen}
              disabled={isOpening}
              aria-label="Mở thiệp cưới"
              className="w-full h-full block cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/templates/olive/side-card-icon.png"
                alt="Con dấu sáp"
                className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
              />
            </button>
          </div>

          {/* Bottom text: Trân trọng kính mời [Tên khách] */}
          <div className="opening-bottom absolute left-[clamp(20px,6vw,36px)] bottom-[clamp(28px,5vh,52px)] z-20 text-white/90 max-w-[86%] pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <p
              className="text-[clamp(14px,3.6vw,18px)] font-medium tracking-wide opacity-90"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Trân trọng kính mời
            </p>
            <p
              className="text-[clamp(16px,4.2vw,22px)] font-semibold tracking-wider italic text-amber-100"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {guestName ?? "Quý khách"}
            </p>
          </div>

          {/* CTA Button: MỞ THIỆP */}
          <div
            id="miuOpeningCta"
            className={cn(
              "absolute left-1/2 -translate-x-1/2 top-[calc(50%+54px)] z-30 flex justify-center transition-all duration-300",
              isOpening && "opacity-0 translate-y-3 pointer-events-none",
            )}
          >
            <button
              id="miuOpeningCtaBtn"
              type="button"
              onClick={onOpen}
              disabled={isOpening}
              className="cursor-pointer rounded-full px-6 py-2.5 border border-white/30 bg-white/15 text-white/95 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:bg-white/25 active:scale-95 transition-all"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Mở thiệp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

