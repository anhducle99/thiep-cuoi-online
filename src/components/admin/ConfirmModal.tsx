"use client";

import React, { useEffect } from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  description,
  confirmText = "Đồng ý",
  cancelText = "Huỷ",
  variant = "warning",
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, busy]);

  if (!isOpen) return null;

  const iconConfig = {
    warning: {
      bg: "bg-amber-100 text-amber-700 border-amber-300",
      btnBg: "bg-wine hover:bg-[#5a1b22] text-white ring-wine/30",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    danger: {
      bg: "bg-red-100 text-red-700 border-red-300",
      btnBg: "bg-red-600 hover:bg-red-700 text-white ring-red-500/30",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-100 text-blue-700 border-blue-300",
      btnBg: "bg-wine hover:bg-[#5a1b22] text-white ring-wine/30",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-gold/30 bg-[#fdfbf7] p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconConfig.bg} shadow-sm`}>
            {iconConfig.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-wine leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-ink/80 leading-relaxed font-medium">
              {message}
            </p>
            {description && (
              <div className="mt-3 rounded-xl border border-gold/20 bg-amber-50/70 p-3 text-xs text-ink/70 leading-relaxed">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gold/15 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-xl px-5 py-2 text-xs font-semibold shadow-md transition ring-2 ring-offset-1 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 ${iconConfig.btnBg}`}
          >
            {busy && (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
