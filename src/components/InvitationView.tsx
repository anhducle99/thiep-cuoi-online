"use client";

import { useEffect, useState } from "react";
import type { WeddingData } from "@/types/wedding";
import { GuestNameProvider } from "@/components/GuestNameProvider";
import { MusicProvider, useMusicOptional } from "@/components/MusicProvider";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { MusicReactiveAmbience } from "@/components/decor/MusicReactiveAmbience";
import { LoadingScreen } from "@/components/sections/LoadingScreen";
import { CoverScreen } from "@/components/sections/CoverScreen";
import { WelcomeHero } from "@/components/sections/WelcomeHero";
import { WeddingInfo } from "@/components/sections/WeddingInfo";
import { Gallery } from "@/components/sections/Gallery";
import { ReceptionInfo } from "@/components/sections/ReceptionInfo";
import { Countdown } from "@/components/sections/Countdown";
import { Venue } from "@/components/sections/Venue";
import { Timeline } from "@/components/sections/Timeline";
import { Guestbook } from "@/components/sections/Guestbook";
import { GiftEnvelope } from "@/components/sections/GiftEnvelope";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";
import { OliveWaxSealLayout } from "@/components/templates/OliveWaxSealLayout";
import { OliveWaxSealCover } from "@/components/templates/OliveWaxSealCover";
import { HolymaidenRoseLayout } from "@/components/templates/HolymaidenRoseLayout";
import { AndikaGoldLayout } from "@/components/templates/AndikaGoldLayout";

import { resolveThemeColors } from "@/lib/themePresets";

type Phase = "loading" | "cover" | "opening" | "content";

const LOADING_MS = 2400;
const OPEN_REVEAL_MS = 900;
const OLIVE_OPEN_REVEAL_MS = 3800;
const COVER_UNMOUNT_MS = 1800;

function StandardInvitationFlow({
  data,
  themeStyles,
  onStartMusic,
}: {
  data: WeddingData;
  themeStyles: React.CSSProperties;
  onStartMusic: () => void;
}) {
  const isOliveTemplate = data.theme.template === "olive-wax-seal";

  const [phase, setPhase] = useState<Phase>(
    isOliveTemplate ? "cover" : "loading",
  );
  const [loadingExiting, setLoadingExiting] = useState(false);

  useEffect(() => {
    if (isOliveTemplate) return;
    const exitTimer = setTimeout(() => setLoadingExiting(true), LOADING_MS - 600);
    const coverTimer = setTimeout(() => setPhase("cover"), LOADING_MS);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(coverTimer);
    };
  }, [isOliveTemplate]);

  useEffect(() => {
    const locked = phase !== "content";
    document.body.style.overflow = locked ? "hidden" : "";
    document.body.classList.toggle("invitation-locked", locked);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("invitation-locked");
    };
  }, [phase]);

  const [coverMounted, setCoverMounted] = useState(isOliveTemplate);

  useEffect(() => {
    if (phase === "cover") setCoverMounted(true);
  }, [phase]);

  useEffect(() => {
    if (phase !== "content") return;
    const t = setTimeout(() => setCoverMounted(false), COVER_UNMOUNT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleOpen = () => {
    if (phase !== "cover") return;
    setPhase("opening");
    onStartMusic();
    setTimeout(
      () => setPhase("content"),
      isOliveTemplate ? OLIVE_OPEN_REVEAL_MS : OPEN_REVEAL_MS,
    );
  };

  const isCoverExiting = phase === "opening" || phase === "content";
  const music = useMusicOptional();
  const musicLive = phase === "content" && (music?.playing ?? false);

  return (
    <div className={`theme-${data.theme.template}`} style={themeStyles}>
      {phase === "loading" && !isOliveTemplate && (
        <LoadingScreen data={data} exiting={loadingExiting} />
      )}

      {coverMounted && (
        data.theme.template === "olive-wax-seal" ? (
          <OliveWaxSealCover
            data={data}
            onOpen={handleOpen}
            isOpening={isCoverExiting}
          />
        ) : (
          <CoverScreen
            data={data}
            onOpen={handleOpen}
            isOpening={isCoverExiting}
          />
        )
      )}

      <MusicReactiveAmbience />

      <main
        className={cn(
          "invitation-shell min-h-screen",
          musicLive && "invitation-shell--live",
          phase === "content" || (isOliveTemplate && phase === "opening")
            ? "animate-reveal-shell"
            : "invisible fixed inset-0 opacity-0",
        )}
        aria-hidden={phase !== "content" && !(isOliveTemplate && phase === "opening")}
      >
        {data.theme.template === "olive-wax-seal" ? (
          <OliveWaxSealLayout data={data} />
        ) : (
          <>
            <WelcomeHero data={data} />
            <WeddingInfo data={data} />
            <Gallery data={data} />
            <ReceptionInfo data={data} />
            <Countdown data={data} />
            <Venue data={data} />
            <Timeline data={data} />
            <Guestbook data={data} />
            <GiftEnvelope data={data} />
            <Footer data={data} />
          </>
        )}
      </main>

      {phase === "content" && data.theme.music && !isOliveTemplate && (
        <MusicToggle />
      )}
    </div>
  );
}

function InvitationViewInner({
  data,
  onStartMusic,
}: {
  data: WeddingData;
  onStartMusic: () => void;
}) {
  const isHolymaidenTemplate = data.theme.template === "holymaiden-rose";
  const isAndikaTemplate = data.theme.template === "luxury-gold-black";

  const colors = resolveThemeColors(data.theme.template, data.theme.colors);
  const themeStyles = {
    "--olive-primary": colors.primaryColor,
    "--olive-secondary": colors.secondaryColor,
    "--olive-bg": colors.backgroundColor,
    "--olive-card": colors.cardColor,
    "--olive-text": colors.textColor || colors.primaryColor,

    "--andika-primary": colors.primaryColor,
    "--andika-secondary": colors.secondaryColor,
    "--andika-bg": colors.backgroundColor,
    "--andika-card": colors.cardColor,
    "--andika-text": colors.textColor || "#FFF8E7",

    "--rose-primary": colors.primaryColor,
    "--rose-secondary": colors.secondaryColor,
    "--rose-bg": colors.backgroundColor,
    "--rose-card": colors.cardColor,
    "--rose-text": colors.textColor,

    "--songhy-primary": colors.primaryColor,
    "--songhy-secondary": colors.secondaryColor,
    "--songhy-bg": colors.backgroundColor,
    "--songhy-card": colors.cardColor,
  } as React.CSSProperties;

  if (isHolymaidenTemplate) {
    return (
      <div className={`theme-${data.theme.template}`} style={themeStyles}>
        <HolymaidenRoseLayout data={data} onStartMusic={onStartMusic} />
      </div>
    );
  }

  if (isAndikaTemplate) {
    return (
      <div className={`theme-${data.theme.template}`} style={themeStyles}>
        <AndikaGoldLayout data={data} onStartMusic={onStartMusic} />
      </div>
    );
  }

  return (
    <StandardInvitationFlow
      data={data}
      themeStyles={themeStyles}
      onStartMusic={onStartMusic}
    />
  );
}

export function InvitationView({ data }: { data: WeddingData }) {
  const [musicOn, setMusicOn] = useState(false);

  return (
    <GuestNameProvider>
      <MusicProvider src={data.theme.music} autoPlay={musicOn}>
        <InvitationViewInner
          data={data}
          onStartMusic={() => setMusicOn(true)}
        />
      </MusicProvider>
    </GuestNameProvider>
  );
}
