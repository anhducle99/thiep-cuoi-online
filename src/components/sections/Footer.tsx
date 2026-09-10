import { Container } from "@/components/ui/Container";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { SectionProps } from "@/types/wedding";

export function Footer({ data, className }: SectionProps) {
  const { groom, bride, thankYouText } = data;

  return (
    <footer className={`section-cream pb-16 pt-10 text-center sm:pb-20 sm:pt-14 ${className ?? ""}`}>
      <Container>
        <RevealOnScroll>
          {thankYouText && (
            <p className="font-serif text-sm leading-relaxed text-crimson">
              {thankYouText}
            </p>
          )}
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <OrnamentDivider className="my-6 [&_span]:text-gold/60 [&_span:first-child]:bg-gold/30 [&_span:last-child]:bg-gold/30" />
          <h1 className="font-display text-[clamp(1.5rem,6vw,2.25rem)] text-crimson">
            {groom.shortName} &amp; {bride.shortName}
          </h1>
          <p className="mt-2 font-serif tracking-[0.3em] text-ink/60">Thân Mời</p>
          <div className="mt-8 text-center text-xs text-stone-500 font-normal">
            Thiệp cưới online &amp; sự kiện -{" "}
            <span className="text-crimson font-semibold">Xuân Phú</span>
          </div>
        </RevealOnScroll>
      </Container>
    </footer>
  );
}
