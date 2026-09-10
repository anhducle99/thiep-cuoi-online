"use client";

import { useState } from "react";

export function OliveShareDock() {
  const [open, setOpen] = useState(false);

  const share = (network: "facebook" | "zalo") => {
    const url = encodeURIComponent(window.location.href);
    const target = network === "facebook"
      ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
      : `https://zalo.me/share?url=${url}`;
    window.open(target, "_blank", "noopener,noreferrer,width=720,height=640");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="olive-share-dock">
      {open && (
        <div className="olive-share-menu">
          <button type="button" onClick={() => share("facebook")}>Facebook</button>
          <button type="button" onClick={() => share("zalo")}>Zalo</button>
          <button type="button" onClick={() => void nativeShare()}>Chia sẻ</button>
        </div>
      )}
      <button type="button" className="olive-share-toggle" onClick={() => setOpen((value) => !value)} aria-label="Chia sẻ thiệp">
        ↗
      </button>
    </div>
  );
}
