"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminHeaders, adminAuthHeader } from "@/lib/adminClient";
import { cn } from "@/lib/utils";
import type { WeddingData, ThemeConfig } from "@/types/wedding";
import {
  TEMPLATE_PRESETS,
  getDefaultPreset,
  resolveThemeColors,
} from "@/lib/themePresets";

const templates: Array<{
  id: ThemeConfig["template"];
  name: string;
  description: string;
  colors: string;
}> = [
  { id: "olive-wax-seal", name: "Olive Wax Seal", description: "Phong thư olive, con dấu sáp", colors: "from-lime-950 via-lime-800 to-stone-100" },
  { id: "holymaiden-rose", name: "Hồng Pastel (Holymaiden)", description: "Phong thư 3D, hoa hồng pastel, trái tim bay", colors: "from-rose-400 via-pink-300 to-purple-300" },
  { id: "luxury-gold-black", name: "Hoàng Gia Ánh Kim (Andika)", description: "Vàng 24K ánh kim, than chì huyền bí, sang trọng", colors: "from-amber-400 via-yellow-600 to-stone-900" },
  { id: "song-hy-do", name: "Song Hỷ Đỏ", description: "Truyền thống, rực rỡ", colors: "from-red-950 via-red-800 to-amber-300" },
];

export function AdminWeddingEditor({ slug }: { slug?: string } = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeConfig["template"]>("olive-wax-seal");
  const [activeTemplate, setActiveTemplate] = useState<ThemeConfig["template"]>("olive-wax-seal");
  const [data, setData] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [copySource, setCopySource] = useState<string>("");
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);
  const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [editingUrlIdx, setEditingUrlIdx] = useState<number | null>(null);
  const [editingUrlValue, setEditingUrlValue] = useState("");
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const loadTemplateData = useCallback(async (tplId: ThemeConfig["template"]) => {
    setLoading(true);
    setMessage("");
    try {
      const slugParam = slug && slug !== "default" ? `&slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/admin/wedding?template=${tplId}${slugParam}`, {
        headers: adminHeaders(),
        cache: "no-store",
      });
      const result = await res.json();
      if (res.ok && result.wedding) {
        setData(result.wedding);
        if (result.activeTemplate) {
          setActiveTemplate(result.activeTemplate);
        }
      } else {
        setMessage("Không tải được dữ liệu mẫu này.");
      }
    } catch {
      setMessage("Lỗi kết nối khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadTemplateData(selectedTemplate);
  }, [selectedTemplate, loadTemplateData]);

  const handleUpload = async (file: File, onDone: (url: string) => void, fieldKey: string) => {
    setUploadingField(fieldKey);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: adminAuthHeader(),
        body: fd,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        onDone(result.url);
      } else {
        alert(result.error || "Tải ảnh thất bại");
      }
    } catch {
      alert("Lỗi kết nối khi tải ảnh");
    } finally {
      setUploadingField(null);
    }
  };

  const moveGalleryPhoto = (fromIdx: number, toIdx: number) => {
    if (!data?.gallery) return;
    const list = [...data.gallery];
    if (toIdx < 0 || toIdx >= list.length) return;
    const [removed] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, removed);
    setData({ ...data, gallery: list });
  };

  const getPhotoRoleBadge = (idx: number, total: number) => {
    if (selectedTemplate === "olive-wax-seal") {
      const completeLimit = total - (total % 3);
      if (idx < completeLimit) {
        const rem = idx % 6;
        if (rem === 0) return { label: "Dọc to (Trái)", bg: "bg-emerald-700 text-white" };
        if (rem === 1) return { label: "Nhỏ trên (Phải)", bg: "bg-stone-700 text-white" };
        if (rem === 2) return { label: "Nhỏ dưới (Phải)", bg: "bg-stone-700 text-white" };
        if (rem === 3) return { label: "Dọc to (Phải)", bg: "bg-emerald-700 text-white" };
        if (rem === 4) return { label: "Nhỏ trên (Trái)", bg: "bg-stone-700 text-white" };
        if (rem === 5) return { label: "Nhỏ dưới (Trái)", bg: "bg-stone-700 text-white" };
      }
      if (total % 3 === 1 && idx === total - 1) {
        return { label: "Ngang lớn (Tràn viền)", bg: "bg-indigo-700 text-white" };
      }
      return { label: "Ảnh vuông", bg: "bg-stone-600 text-white" };
    }
    return { label: `Ảnh #${idx + 1}`, bg: "bg-stone-700 text-white" };
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    const links = galleryUrlInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (links.length === 0) return;
    const newItems = links.map((url, i) => ({
      src: url,
      alt: `Ảnh cưới ${(data?.gallery?.length || 0) + i + 1}`,
    }));
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        gallery: [...(prev.gallery || []), ...newItems],
      };
    });
    setGalleryUrlInput("");
  };

  const handleSaveEditedUrl = (idx: number) => {
    if (!data?.gallery || !editingUrlValue.trim()) return;
    const list = [...data.gallery];
    if (list[idx]) {
      list[idx] = { ...list[idx], src: editingUrlValue.trim() };
      setData({ ...data, gallery: list });
    }
    setEditingUrlIdx(null);
    setEditingUrlValue("");
  };

  const handleCopyFrom = async (fromTpl: string) => {
    if (!fromTpl || fromTpl === selectedTemplate) return;
    if (!confirm(`Bạn có chắc muốn sao chép toàn bộ nội dung từ mẫu "${templates.find(t => t.id === fromTpl)?.name}" sang mẫu này?`)) {
      setCopySource("");
      return;
    }
    try {
      const slugParam = slug && slug !== "default" ? `&slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/admin/wedding?template=${fromTpl}${slugParam}`, {
        headers: adminHeaders(),
        cache: "no-store",
      });
      const result = await res.json();
      if (res.ok && result.wedding) {
        const source = result.wedding as WeddingData;
        setData({
          ...source,
          theme: {
            ...source.theme,
            template: selectedTemplate,
          },
        });
        setMessage(`Đã sao chép nội dung từ mẫu ${templates.find(t => t.id === fromTpl)?.name}. Nhấn "Lưu thay đổi" để áp dụng.`);
      }
    } catch {
      alert("Lỗi khi sao chép dữ liệu.");
    }
    setCopySource("");
  };

  const handleSetHome = async (tplId: ThemeConfig["template"]) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/wedding", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ setActiveOnly: true, templateId: tplId }),
      });
      if (res.ok) {
        setActiveTemplate(tplId);
        setMessage(`Đã đặt mẫu "${templates.find(t => t.id === tplId)?.name}" làm mẫu hiển thị chính cho trang chủ!`);
      }
    } catch {
      alert("Lỗi kết nối khi đổi mẫu trang chủ");
    } finally {
      setBusy(false);
    }
  };

  const handleApplyToAll = async () => {
    if (!data) return;
    if (
      !confirm(
        `Bạn có chắc muốn sao chép toàn bộ thông tin (họ tên, địa chỉ, ngày cưới, QR...) của mẫu "${currentTplMeta?.name}" áp dụng đồng loạt cho TẤT CẢ các mẫu khác?`,
      )
    ) {
      return;
    }
    setBusy(true);
    setMessage("Đang đồng bộ cho tất cả các mẫu…");
    try {
      for (const tpl of templates) {
        await fetch("/api/admin/wedding", {
          method: "PUT",
          headers: adminHeaders(),
          body: JSON.stringify({
            wedding: {
              ...data,
              theme: {
                ...data.theme,
                template: tpl.id,
              },
            },
            templateId: tpl.id,
            setAsActive: tpl.id === activeTemplate,
          }),
        });
      }
      setMessage(`Đã đồng bộ thông tin của mẫu "${currentTplMeta?.name}" cho TẤT CẢ ${templates.length} mẫu thành công!`);
    } catch {
      alert("Lỗi kết nối khi đồng bộ tất cả mẫu.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!data) return;
    setBusy(true);
    setMessage("");
    try {
      const slugParam = slug && slug !== "default" ? `?slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/admin/wedding${slugParam}`, {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({
          wedding: data,
          templateId: selectedTemplate,
          setAsActive: slug && slug !== "default" ? false : selectedTemplate === activeTemplate,
          slug: slug !== "default" ? slug : undefined,
        }),
      });
      const result = await res.json().catch(() => ({}));
      setBusy(false);
      if (res.ok) {
        setMessage(
          slug && slug !== "default"
            ? `Đã lưu dữ liệu cho đám cưới "/${slug}" thành công!`
            : `Đã lưu dữ liệu riêng cho mẫu "${currentTplMeta?.name}" thành công!`,
        );
      } else {
        setMessage(result.error ?? "Không lưu được.");
      }
    } catch {
      setBusy(false);
      setMessage("Lỗi kết nối khi lưu.");
    }
  };

  const currentTplMeta = templates.find((t) => t.id === selectedTemplate);
  const currentPresets = TEMPLATE_PRESETS[selectedTemplate] || [];
  const activeColors = resolveThemeColors(selectedTemplate, data?.theme?.colors);

  const groomAccount = data?.giftAccounts?.[0] || { owner: "Chú rể", bankName: "", accountNumber: "", accountHolder: "", qrImage: "" };
  const brideAccount = data?.giftAccounts?.[1] || { owner: "Cô dâu", bankName: "", accountNumber: "", accountHolder: "", qrImage: "" };

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-crimson">
            {slug && slug !== "default" ? `Nội dung thiệp cưới: /${slug}` : "Quản lý mẫu thiệp & nội dung"}
          </h2>
          <p className="text-xs text-ink/60">
            {slug && slug !== "default"
              ? "Tùy biến thông tin cặp đôi, ngày giờ hôn lễ, tài khoản mừng và ảnh cưới cho đám cưới này."
              : "Mỗi mẫu thiệp lưu một bộ dữ liệu, hình ảnh và mã QR riêng biệt, không bị trùng hay đè lên nhau."}
          </p>
        </div>
        <a
          href={slug && slug !== "default" ? `/${slug}?template=${selectedTemplate}` : `/?template=${selectedTemplate}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-wine/30 bg-white px-3 py-1.5 text-xs font-semibold text-crimson hover:bg-cream-light transition shadow-sm inline-flex items-center gap-1"
        >
          <span>Xem thử mẫu đang chọn</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {/* Selector: Chọn mẫu muốn chỉnh sửa */}
      <section className="mb-6 rounded-2xl border border-gold/30 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-wine">
            Chọn mẫu thiệp bạn muốn chỉnh sửa:
          </span>
          <span className="text-xs text-ink/60">
            Mẫu trang chủ hiện tại: <strong className="text-emerald-700">{templates.find(t => t.id === activeTemplate)?.name}</strong>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isHome = activeTemplate === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative overflow-hidden rounded-xl border-2 text-left transition-all p-3 ${
                  isSelected
                    ? "border-wine bg-amber-50/50 shadow-md ring-2 ring-wine/30"
                    : "border-stone-200 bg-stone-50/70 hover:border-stone-300 hover:bg-white"
                }`}
              >
                {isHome && (
                  <span className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    Trang chủ
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br shrink-0 ${template.colors} shadow-inner`} />
                  <div>
                    <strong className="block text-sm font-serif text-ink">{template.name}</strong>
                    <span className="text-[11px] text-ink/50 line-clamp-1">{template.description}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action bar for currently selected template */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span>Đang chọn chỉnh sửa: <strong className="text-wine text-sm font-serif">{currentTplMeta?.name}</strong></span>
            {selectedTemplate !== activeTemplate && (
              <button
                type="button"
                onClick={() => handleSetHome(selectedTemplate)}
                disabled={busy}
                className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 font-medium transition cursor-pointer"
              >
                ★ Đặt làm mẫu trang chủ
              </button>
            )}
          </div>

          {/* Copy & Sync Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleApplyToAll}
              disabled={busy}
              className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 font-medium transition cursor-pointer flex items-center gap-1 shadow-sm"
              title="Sao chép toàn bộ nội dung của mẫu này sang tất cả 8 mẫu còn lại"
            >
              ⚡ Áp dụng cho TẤT CẢ các mẫu
            </button>

            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-ink/60">Sao chép từ:</span>
              <select
                value={copySource}
                onChange={(e) => {
                  setCopySource(e.target.value);
                  if (e.target.value) handleCopyFrom(e.target.value);
                }}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs outline-none focus:border-wine"
              >
                <option value="">-- Chọn mẫu nguồn --</option>
                {templates
                  .filter((t) => t.id !== selectedTemplate)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {loading || !data ? (
        <div className="py-16 text-center text-sm text-ink/60">Đang tải dữ liệu của mẫu {currentTplMeta?.name}…</div>
      ) : (
        <>
          {/* Thông báo thao tác */}
          {message && (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 font-medium">
              {message}
            </div>
          )}

          {/* 🎨 Bảng Màu & Màu Nền (Color Theme) */}
          <section className="mb-6 rounded-2xl border border-gold/35 bg-gradient-to-br from-amber-50/50 via-white to-stone-50 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-wine flex items-center gap-2">
                  <span className="text-xl">🎨</span> Tùy Chọn Màu Nền &amp; Bảng Màu (Mẫu: {currentTplMeta?.name})
                </h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Chọn nhanh bảng màu phối sẵn (1-Click) hoặc dùng Color Picker để tùy biến màu nền &amp; điểm nhấn theo ý muốn.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const defaultP = getDefaultPreset(selectedTemplate);
                  setData({
                    ...data,
                    theme: {
                      ...data.theme,
                      colors: {
                        presetId: defaultP.id,
                        primaryColor: defaultP.primaryColor,
                        secondaryColor: defaultP.secondaryColor,
                        backgroundColor: defaultP.backgroundColor,
                        cardColor: defaultP.cardColor,
                        textColor: defaultP.textColor,
                      },
                    },
                  });
                }}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:text-wine hover:border-wine transition shadow-sm cursor-pointer"
              >
                ↺ Khôi phục màu gốc
              </button>
            </div>

            {/* Danh sách Presets 1-Click */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2.5">
                1. Bảng màu phối sẵn chuẩn thiết kế (1-Click)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentPresets.map((preset) => {
                  const isCurrentPreset =
                    (data.theme.colors?.presetId || currentPresets[0]?.id) === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          theme: {
                            ...data.theme,
                            colors: {
                              presetId: preset.id,
                              primaryColor: preset.primaryColor,
                              secondaryColor: preset.secondaryColor,
                              backgroundColor: preset.backgroundColor,
                              cardColor: preset.cardColor,
                              textColor: preset.textColor,
                            },
                          },
                        });
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isCurrentPreset
                          ? "border-wine bg-white shadow-md ring-2 ring-wine/25 scale-[1.02]"
                          : "border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 w-full mb-2">
                        {/* 4 Swatches */}
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: preset.primaryColor }}
                          title={`Màu chính: ${preset.primaryColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: preset.secondaryColor }}
                          title={`Màu phụ: ${preset.secondaryColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: preset.backgroundColor }}
                          title={`Màu nền: ${preset.backgroundColor}`}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: preset.cardColor }}
                          title={`Màu thẻ: ${preset.cardColor}`}
                        />
                        {isCurrentPreset && (
                          <span className="ml-auto text-[10px] font-bold text-wine bg-wine/10 px-1.5 py-0.5 rounded">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-ink leading-snug">{preset.name}</span>
                      <span className="text-[11px] text-ink/60 line-clamp-1 mt-0.5">{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Color Pickers Tự Do + Live Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-stone-200">
              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                  2. Tự do tùy biến màu (Color Picker)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Màu nền chính */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                    <input
                      type="color"
                      value={activeColors.backgroundColor}
                      onChange={(e) => {
                        setData({
                          ...data,
                          theme: {
                            ...data.theme,
                            colors: {
                              ...activeColors,
                              presetId: "custom",
                              backgroundColor: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-ink">Màu nền chính (Background)</span>
                      <input
                        type="text"
                        value={activeColors.backgroundColor}
                        onChange={(e) => {
                          setData({
                            ...data,
                            theme: {
                              ...data.theme,
                              colors: {
                                ...activeColors,
                                presetId: "custom",
                                backgroundColor: e.target.value,
                              },
                            },
                          });
                        }}
                        className="text-xs font-mono text-ink/70 uppercase w-24 border-b border-stone-200 outline-none focus:border-wine mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Màu điểm nhấn / nút */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                    <input
                      type="color"
                      value={activeColors.primaryColor}
                      onChange={(e) => {
                        setData({
                          ...data,
                          theme: {
                            ...data.theme,
                            colors: {
                              ...activeColors,
                              presetId: "custom",
                              primaryColor: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-ink">Màu nút &amp; Điểm nhấn (Primary)</span>
                      <input
                        type="text"
                        value={activeColors.primaryColor}
                        onChange={(e) => {
                          setData({
                            ...data,
                            theme: {
                              ...data.theme,
                              colors: {
                                ...activeColors,
                                presetId: "custom",
                                primaryColor: e.target.value,
                              },
                            },
                          });
                        }}
                        className="text-xs font-mono text-ink/70 uppercase w-24 border-b border-stone-200 outline-none focus:border-wine mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Màu phụ / Header */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                    <input
                      type="color"
                      value={activeColors.secondaryColor}
                      onChange={(e) => {
                        setData({
                          ...data,
                          theme: {
                            ...data.theme,
                            colors: {
                              ...activeColors,
                              presetId: "custom",
                              secondaryColor: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-ink">Màu phụ / Header (Secondary)</span>
                      <input
                        type="text"
                        value={activeColors.secondaryColor}
                        onChange={(e) => {
                          setData({
                            ...data,
                            theme: {
                              ...data.theme,
                              colors: {
                                ...activeColors,
                                presetId: "custom",
                                secondaryColor: e.target.value,
                              },
                            },
                          });
                        }}
                        className="text-xs font-mono text-ink/70 uppercase w-24 border-b border-stone-200 outline-none focus:border-wine mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Màu nền thẻ / hộp */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-white shadow-xs">
                    <input
                      type="color"
                      value={activeColors.cardColor}
                      onChange={(e) => {
                        setData({
                          ...data,
                          theme: {
                            ...data.theme,
                            colors: {
                              ...activeColors,
                              presetId: "custom",
                              cardColor: e.target.value,
                            },
                          },
                        });
                      }}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-ink">Màu thẻ / Hộp (Card)</span>
                      <input
                        type="text"
                        value={activeColors.cardColor}
                        onChange={(e) => {
                          setData({
                            ...data,
                            theme: {
                              ...data.theme,
                              colors: {
                                ...activeColors,
                                presetId: "custom",
                                cardColor: e.target.value,
                              },
                            },
                          });
                        }}
                        className="text-xs font-mono text-ink/70 uppercase w-24 border-b border-stone-200 outline-none focus:border-wine mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Khung xem trước trực quan (Mini Preview) */}
              <div className="flex flex-col justify-center">
                <span className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                  Xem trước phối màu
                </span>
                <div
                  className="rounded-2xl p-4 border border-black/10 shadow-md transition-all"
                  style={{ backgroundColor: activeColors.backgroundColor }}
                >
                  <div
                    className="rounded-xl p-3 mb-3 border shadow-xs transition-all"
                    style={{
                      backgroundColor: activeColors.cardColor,
                      borderColor: `${activeColors.primaryColor}33`,
                    }}
                  >
                    <div
                      className="text-xs font-bold font-serif mb-1 truncate"
                      style={{ color: activeColors.secondaryColor }}
                    >
                      {data.groom.shortName} &amp; {data.bride.shortName}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: activeColors.primaryColor }}>
                      {data.ceremony.venueName || "Khách Sạn Grand Palace"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 px-3 rounded-full text-xs font-bold text-white shadow transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: activeColors.primaryColor }}
                  >
                    <span>✉</span> Xác nhận tham dự
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 1. Thông tin Cô dâu & Chú rể */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <h3 className="text-base font-bold text-wine mb-4">
              1. Thông tin Cô Dâu &amp; Chú Rể (Mẫu: {currentTplMeta?.name})
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Chú rể */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Chú rể</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Họ và tên đầy đủ</label>
                    <input
                      type="text"
                      value={data.groom.fullName}
                      onChange={(e) => setData({ ...data, groom: { ...data.groom, fullName: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      placeholder="NGUYỄN HỮU THÔNG"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Tên gọi / Tên ngắn</label>
                    <input
                      type="text"
                      value={data.groom.shortName}
                      onChange={(e) => setData({ ...data, groom: { ...data.groom, shortName: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      placeholder="Hữu Thông"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ảnh chân dung chú rể</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={data.groom.photo || ""}
                        onChange={(e) => setData({ ...data, groom: { ...data.groom, photo: e.target.value } })}
                        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      />
                      <label className="cursor-pointer shrink-0 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 text-xs font-medium text-ink transition">
                        {uploadingField === "groomPhoto" ? "Đang tải..." : "Tải ảnh lên"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file, (url) => setData({ ...data, groom: { ...data.groom, photo: url } }), "groomPhoto");
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cô dâu */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Cô dâu</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Họ và tên đầy đủ</label>
                    <input
                      type="text"
                      value={data.bride.fullName}
                      onChange={(e) => setData({ ...data, bride: { ...data.bride, fullName: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      placeholder="HOÀNG THỊ LÂM HUYỀN"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Tên gọi / Tên ngắn</label>
                    <input
                      type="text"
                      value={data.bride.shortName}
                      onChange={(e) => setData({ ...data, bride: { ...data.bride, shortName: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      placeholder="Lâm Huyền"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ảnh chân dung cô dâu</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={data.bride.photo || ""}
                        onChange={(e) => setData({ ...data, bride: { ...data.bride, photo: e.target.value } })}
                        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      />
                      <label className="cursor-pointer shrink-0 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 text-xs font-medium text-ink transition">
                        {uploadingField === "bridePhoto" ? "Đang tải..." : "Tải ảnh lên"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file, (url) => setData({ ...data, bride: { ...data.bride, photo: url } }), "bridePhoto");
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Thông tin Bố Mẹ hai bên */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <h3 className="text-base font-bold text-wine mb-4">2. Thông tin Phụ Huynh hai bên</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Nhà trai */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Nhà Trai</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ông (Bố chú rể)</label>
                    <input
                      type="text"
                      value={data.groomParents.father}
                      onChange={(e) => setData({ ...data, groomParents: { ...data.groomParents, father: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Bà (Mẹ chú rể)</label>
                    <input
                      type="text"
                      value={data.groomParents.mother}
                      onChange={(e) => setData({ ...data, groomParents: { ...data.groomParents, mother: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nhà gái */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Nhà Gái</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ông (Bố cô dâu)</label>
                    <input
                      type="text"
                      value={data.brideParents.father}
                      onChange={(e) => setData({ ...data, brideParents: { ...data.brideParents, father: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Bà (Mẹ cô dâu)</label>
                    <input
                      type="text"
                      value={data.brideParents.mother}
                      onChange={(e) => setData({ ...data, brideParents: { ...data.brideParents, mother: e.target.value } })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Thời gian & Địa điểm tiệc cưới */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <h3 className="text-base font-bold text-wine mb-4">3. Địa điểm &amp; Thời gian tiệc cưới</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Tên địa điểm / Trung tâm tiệc cưới (Hỗ trợ xuống dòng)</label>
                <textarea
                  rows={2}
                  value={data.reception.venueName}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, venueName: e.target.value } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                  placeholder="Khách Sạn Giao Tế&#10;Tầng 2 Sảnh 6"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Địa chỉ đầy đủ</label>
                <input
                  type="text"
                  value={data.reception.address || ""}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, address: e.target.value } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Giờ đãi tiệc (vd: 11:00)</label>
                <input
                  type="text"
                  value={data.reception.date.time || ""}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, date: { ...data.reception.date, time: e.target.value } } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Thứ trong tuần (vd: THỨ NĂM)</label>
                <input
                  type="text"
                  value={data.reception.date.weekday || ""}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, date: { ...data.reception.date, weekday: e.target.value } } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Ngày / Tháng / Năm</label>
                <input
                  type="date"
                  value={data.reception.date.iso ? data.reception.date.iso.slice(0, 10) : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    const [y, m, d] = val.split("-");
                    setData({
                      ...data,
                      reception: {
                        ...data.reception,
                        date: {
                          ...data.reception.date,
                          iso: val,
                          year: y,
                          month: m,
                          day: d,
                        },
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1">Ngày âm lịch (vd: 17 tháng 06 năm Bính Ngọ)</label>
                <input
                  type="text"
                  value={data.reception.date.lunar || ""}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, date: { ...data.reception.date, lunar: e.target.value } } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Link Google Maps (khi nhấn nút Chỉ đường)</label>
                <input
                  type="text"
                  value={data.reception.mapUrl || ""}
                  onChange={(e) => setData({ ...data, reception: { ...data.reception, mapUrl: e.target.value } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
            </div>
          </section>

          {/* 4. Mừng cưới & Mã QR */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <h3 className="text-base font-bold text-wine mb-4">4. Mừng Cưới &amp; Mã QR</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* QR Chú rể */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Tài khoản Chú rể</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      value={groomAccount.accountHolder || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[0] = { ...groomAccount, accountHolder: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ngân hàng</label>
                    <input
                      type="text"
                      value={groomAccount.bankName || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[0] = { ...groomAccount, bankName: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Số tài khoản</label>
                    <input
                      type="text"
                      value={groomAccount.accountNumber || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[0] = { ...groomAccount, accountNumber: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ảnh mã QR Chú rể</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={groomAccount.qrImage || ""}
                        onChange={(e) => {
                          const next = [...(data.giftAccounts || [])];
                          next[0] = { ...groomAccount, qrImage: e.target.value };
                          setData({ ...data, giftAccounts: next });
                        }}
                        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      />
                      <label className="cursor-pointer shrink-0 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 text-xs font-medium text-ink transition">
                        {uploadingField === "groomQr" ? "Đang tải..." : "Tải ảnh QR"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUpload(
                                file,
                                (url) => {
                                  const next = [...(data.giftAccounts || [])];
                                  next[0] = { ...groomAccount, qrImage: url };
                                  setData({ ...data, giftAccounts: next });
                                },
                                "groomQr"
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Cô dâu */}
              <div className="rounded-xl bg-white/80 p-4 border border-stone-200">
                <h4 className="font-semibold text-crimson text-sm mb-3">Tài khoản Cô dâu</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      value={brideAccount.accountHolder || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[1] = { ...brideAccount, accountHolder: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ngân hàng</label>
                    <input
                      type="text"
                      value={brideAccount.bankName || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[1] = { ...brideAccount, bankName: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Số tài khoản</label>
                    <input
                      type="text"
                      value={brideAccount.accountNumber || ""}
                      onChange={(e) => {
                        const next = [...(data.giftAccounts || [])];
                        next[1] = { ...brideAccount, accountNumber: e.target.value };
                        setData({ ...data, giftAccounts: next });
                      }}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink/60 mb-1">Ảnh mã QR Cô dâu</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={brideAccount.qrImage || ""}
                        onChange={(e) => {
                          const next = [...(data.giftAccounts || [])];
                          next[1] = { ...brideAccount, qrImage: e.target.value };
                          setData({ ...data, giftAccounts: next });
                        }}
                        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                      />
                      <label className="cursor-pointer shrink-0 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 text-xs font-medium text-ink transition">
                        {uploadingField === "brideQr" ? "Đang tải..." : "Tải ảnh QR"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUpload(
                                file,
                                (url) => {
                                  const next = [...(data.giftAccounts || [])];
                                  next[1] = { ...brideAccount, qrImage: url };
                                  setData({ ...data, giftAccounts: next });
                                },
                                "brideQr"
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Album ảnh cưới (Gallery) */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-wine">5. Album Ảnh Kỷ Niệm (Gallery)</h3>
                <p className="text-xs text-ink/60">
                  Tải lên, kéo thả sắp xếp thứ tự hiển thị của các bức ảnh trong album.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-wine/10 text-wine">
                {(data.gallery || []).length} bức ảnh
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverDropzone(true);
              }}
              onDragLeave={() => setIsDragOverDropzone(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setIsDragOverDropzone(false);
                const files = Array.from(e.dataTransfer.files).filter((f) =>
                  f.type.startsWith("image/")
                );
                if (files.length === 0) return;
                for (const file of files) {
                  await handleUpload(
                    file,
                    (url) => {
                      setData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          gallery: [...(prev.gallery || []), { src: url, alt: file.name }],
                        };
                      });
                    },
                    "galleryUpload"
                  );
                }
              }}
              onClick={() => galleryFileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-5 text-center transition-all mb-4 cursor-pointer select-none",
                isDragOverDropzone
                  ? "border-wine bg-wine/10 scale-[1.01]"
                  : "border-stone-300 hover:border-wine/70 bg-white hover:bg-stone-50/60"
              )}
            >
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    await handleUpload(
                      file,
                      (url) => {
                        setData((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            gallery: [...(prev.gallery || []), { src: url, alt: file.name }],
                          };
                        });
                      },
                      "galleryUpload"
                    );
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <span className="text-2xl">📸</span>
                <p className="text-xs sm:text-sm font-semibold text-wine">
                  {uploadingField === "galleryUpload"
                    ? "Đang tải ảnh lên máy chủ..."
                    : "Kéo thả nhiều ảnh vào đây hoặc bấm để chọn ảnh từ máy tính"}
                </p>
                <p className="text-[11px] text-ink/50">
                  Hỗ trợ tải lên cùng lúc nhiều ảnh (.jpg, .png, .webp).
                </p>
              </div>
            </div>

            {/* Thêm ảnh bằng URL link */}
            <div className="mb-4 p-3.5 rounded-xl bg-white border border-stone-200">
              <label className="block text-xs font-semibold text-wine mb-1.5 flex flex-wrap items-center justify-between gap-1">
                <span>🔗 Thêm ảnh vào album bằng đường link (URL):</span>
                <span className="text-[11px] font-normal text-ink/50">Dán link ảnh từ Cloudinary, Imgur, Google Drive, Facebook, web riêng...</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Dán đường link ảnh tại đây (vd: https://images.unsplash.com/... hoặc link ảnh bất kỳ)..."
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryUrl();
                    }
                  }}
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-wine outline-none bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!galleryUrlInput.trim()}
                  className="px-4 py-2 rounded-lg bg-wine hover:bg-wine-dark disabled:opacity-40 disabled:cursor-not-allowed text-cream-light text-xs font-semibold transition cursor-pointer shrink-0 shadow-xs"
                >
                  + Thêm link
                </button>
              </div>
            </div>

            {/* Hướng dẫn sắp xếp */}
            <div className="rounded-xl bg-amber-50/90 border border-amber-200/80 p-3 mb-4 text-xs text-amber-950">
              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-amber-700">💡</span>
                <div className="space-y-1">
                  <p className="font-semibold text-amber-900">
                    Bố cục ảnh tự động ngoài thiệp:
                  </p>
                  <ul className="list-disc ml-4 space-y-0.5 text-amber-800 text-[11px] leading-relaxed">
                    <li>
                      Hệ thống tự động sắp xếp theo thứ tự <strong>#1, #2, #3...</strong> theo cụm so le (Ảnh dọc to ➔ 2 ảnh nhỏ ➔ Ảnh dọc to đảo bên).
                    </li>
                    <li>
                      Bạn có thể <strong>kéo giữ ảnh rồi thả</strong> vào vị trí mới, hoặc bấm nút mũi tên <strong>[←] [→]</strong> để đổi thứ tự ảnh.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ảnh ghép 3 khung toàn cảnh (Our Memories triptych) */}
            <div className="mb-5 p-4 rounded-xl bg-white border border-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-semibold text-crimson text-sm">Ảnh ghép 3 khung toàn cảnh (Our Memories)</h4>
                  <p className="text-[11px] text-ink/60">
                    Bức ảnh ngang được cắt thành 3 tấm đứng nghệ thuật ngay phía trên tiêu đề &quot;Our Memories&quot;. (Nếu để trống sẽ tự lấy ảnh đầu tiên trong album).
                  </p>
                </div>
                <label className="cursor-pointer rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition flex items-center gap-1">
                  {uploadingField === "triptychUpload" ? "Đang tải..." : "📁 Tải ảnh riêng"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleUpload(
                          file,
                          (url) => setData({ ...data, triptychPhoto: url }),
                          "triptychUpload"
                        );
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Dán link ảnh https://... hoặc bấm [📁 Tải ảnh riêng] từ máy tính..."
                  value={data.triptychPhoto || ""}
                  onChange={(e) => setData({ ...data, triptychPhoto: e.target.value })}
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-wine outline-none bg-white font-mono"
                />
                {data.triptychPhoto && (
                  <button
                    type="button"
                    onClick={() => setData({ ...data, triptychPhoto: "" })}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Preview 3-khung nhỏ */}
              {(data.triptychPhoto || data.gallery?.[0]?.src) && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-stretch gap-1.5 h-16 w-32 rounded-lg overflow-hidden border border-stone-200 shadow-xs">
                    <div
                      className="flex-1 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${data.triptychPhoto || data.gallery[0]?.src}')`,
                        backgroundSize: "300% auto",
                        backgroundPosition: "0% 50%",
                      }}
                    />
                    <div
                      className="flex-1 bg-cover bg-center scale-105 z-10 shadow"
                      style={{
                        backgroundImage: `url('${data.triptychPhoto || data.gallery[0]?.src}')`,
                        backgroundSize: "300% auto",
                        backgroundPosition: "50% 50%",
                      }}
                    />
                    <div
                      className="flex-1 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${data.triptychPhoto || data.gallery[0]?.src}')`,
                        backgroundSize: "300% auto",
                        backgroundPosition: "100% 50%",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-ink/50 italic">
                    {data.triptychPhoto ? "Đang dùng ảnh riêng đã tải lên" : "Đang lấy ảnh đại diện đầu tiên từ Album"}
                  </span>
                </div>
              )}
            </div>

            {/* Danh sách ảnh có hỗ trợ kéo thả và đổi thứ tự */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {(data.gallery || []).map((img, idx) => {
                const total = data.gallery.length;
                const role = getPhotoRoleBadge(idx, total);
                const isDraggingThis = draggedGalleryIdx === idx;
                const isEditingThisUrl = editingUrlIdx === idx;

                return (
                  <div
                    key={`${img.src}-${idx}`}
                    draggable={!isEditingThisUrl}
                    onDragStart={() => setDraggedGalleryIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (draggedGalleryIdx !== null && draggedGalleryIdx !== idx) {
                        moveGalleryPhoto(draggedGalleryIdx, idx);
                        setDraggedGalleryIdx(null);
                      }
                    }}
                    onDragEnd={() => setDraggedGalleryIdx(null)}
                    className={cn(
                      "relative group rounded-xl overflow-hidden border bg-stone-100 shadow-sm transition-all select-none",
                      isDraggingThis
                        ? "opacity-30 border-dashed border-2 border-wine scale-95"
                        : "border-stone-300 hover:shadow-md hover:border-wine/60",
                      !isEditingThisUrl && "cursor-grab active:cursor-grabbing"
                    )}
                  >
                    {/* Badge số thứ tự & vị trí */}
                    <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold shadow">
                        #{idx + 1}
                      </span>
                      <span className={cn("px-1.5 py-0.5 rounded-md text-[9px] font-medium shadow", role.bg)}>
                        {role.label}
                      </span>
                    </div>

                    {/* Nút xóa ảnh */}
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(data.gallery || [])];
                        next.splice(idx, 1);
                        setData({ ...data, gallery: next });
                      }}
                      className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs flex items-center justify-center transition shadow cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      ✕
                    </button>

                    {/* Ảnh hiển thị */}
                    <div className="aspect-[3/4] w-full bg-stone-200 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt || `Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      {/* Modal chỉnh sửa URL đè lên ảnh */}
                      {isEditingThisUrl && (
                        <div
                          className="absolute inset-0 bg-stone-900/90 backdrop-blur-xs p-2.5 flex flex-col justify-between z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <span className="text-[11px] font-bold text-cream-light block mb-1">
                              Sửa link ảnh #{idx + 1}:
                            </span>
                            <textarea
                              rows={3}
                              value={editingUrlValue}
                              onChange={(e) => setEditingUrlValue(e.target.value)}
                              className="w-full text-[10px] font-mono p-1.5 rounded bg-white text-stone-900 outline-none border border-stone-300 resize-none"
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex gap-1.5 justify-end mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUrlIdx(null);
                                setEditingUrlValue("");
                              }}
                              className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] font-semibold"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditedUrl(idx)}
                              className="px-2 py-1 rounded bg-wine hover:bg-wine-dark text-white text-[10px] font-semibold"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thanh điều khiển nhanh ở đáy ảnh */}
                    <div className="p-2 bg-white border-t border-stone-200 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveGalleryPhoto(idx, idx - 1)}
                          className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center justify-center transition cursor-pointer"
                          title="Chuyển lên trước"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={idx === total - 1}
                          onClick={() => moveGalleryPhoto(idx, idx + 1)}
                          className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center justify-center transition cursor-pointer"
                          title="Chuyển ra sau"
                        >
                          →
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUrlIdx(idx);
                            setEditingUrlValue(img.src);
                          }}
                          className="px-1.5 py-1 rounded-md text-[10px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition cursor-pointer"
                          title="Xem / Sửa đường link của ảnh này"
                        >
                          🔗 Sửa link
                        </button>
                        <button
                          type="button"
                          onClick={() => setData({ ...data, triptychPhoto: img.src })}
                          className="px-1.5 py-1 rounded-md text-[10px] font-semibold bg-stone-100 hover:bg-wine/10 text-stone-700 hover:text-wine border border-stone-200 transition cursor-pointer"
                          title="Đặt ảnh này làm ảnh 3 khung toàn cảnh"
                        >
                          3 khung
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. Nhạc nền & Lời cảm ơn */}
          <section className="mb-6 rounded-2xl border border-gold/25 bg-cream-light p-5 shadow-sm">
            <h3 className="text-base font-bold text-wine mb-4">6. Nhạc nền &amp; Lời cảm ơn</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Đường dẫn nhạc nền (File audio .m4a hoặc .mp3)</label>
                <input
                  type="text"
                  value={data.theme.music || ""}
                  onChange={(e) => setData({ ...data, theme: { ...data.theme, music: e.target.value } })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                  placeholder="/templates/olive/audio.m4a"
                />
              </div>

              {/* Ảnh bìa cảm ơn cuối thiệp (Closing Photo) */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-stone-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-semibold text-crimson">Ảnh bìa cảm ơn cuối thiệp (Closing Photo)</label>
                    <p className="text-[11px] text-ink/60">
                      Bức ảnh lớn đứng độc lập phía dưới lời cảm ơn cuối thiệp (Nếu để trống sẽ tự động lấy ảnh từ album).
                    </p>
                  </div>
                  <label className="cursor-pointer rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition flex items-center gap-1">
                    {uploadingField === "closingPhotoUpload" ? "Đang tải..." : "📁 Tải ảnh lên"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleUpload(
                            file,
                            (url) => setData({ ...data, closingPhoto: url }),
                            "closingPhotoUpload"
                          );
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Nhập URL ảnh hoặc bấm Tải ảnh lên (vd: /templates/olive/demo/closing.webp)..."
                    value={data.closingPhoto || ""}
                    onChange={(e) => setData({ ...data, closingPhoto: e.target.value })}
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-xs focus:border-wine outline-none bg-white font-mono"
                  />
                  {data.closingPhoto && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, closingPhoto: "" })}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                {/* Preview closing photo */}
                {(data.closingPhoto || data.gallery?.[4]?.src || data.gallery?.[0]?.src) && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-stone-300 shadow-xs bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.closingPhoto || data.gallery?.[4]?.src || data.gallery?.[0]?.src || "/templates/olive/demo/closing.webp"}
                        alt="Preview closing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-ink/50 italic">
                      {data.closingPhoto ? "Đang dùng ảnh riêng đã tải lên" : "Đang lấy ảnh đại diện từ Album"}
                    </span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink/60 mb-1">Lời cảm ơn cuối thiệp</label>
                <textarea
                  rows={2}
                  value={data.thankYouText || ""}
                  onChange={(e) => setData({ ...data, thankYouText: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-wine outline-none bg-white"
                />
              </div>
            </div>
          </section>

          {/* Nút lưu cố định ở cuối màn hình */}
          <div className="sticky bottom-4 z-30 rounded-2xl bg-stone-900/90 backdrop-blur-md p-4 flex items-center justify-between shadow-2xl">
            <div className="text-xs text-white/80">
              {message ? (
                <span className="font-semibold text-amber-300">{message}</span>
              ) : (
                <span>
                  Lưu dữ liệu riêng cho mẫu: <strong className="text-amber-200">{currentTplMeta?.name}</strong>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-50 transition active:scale-95 cursor-pointer"
            >
              {busy ? "Đang lưu…" : `Lưu mẫu ${currentTplMeta?.name}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
