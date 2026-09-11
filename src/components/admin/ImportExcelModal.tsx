"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { adminHeaders } from "@/lib/adminClient";

interface ImportExcelModalProps {
  isOpen: boolean;
  slug?: string;
  existingNames: string[];
  onClose: () => void;
  onSuccess: (addedCount: number) => void;
}

export function ImportExcelModal({
  isOpen,
  slug,
  existingNames,
  onClose,
  onSuccess,
}: ImportExcelModalProps) {
  const [tab, setTab] = useState<"file" | "paste">("file");
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const existingLowerSet = new Set(existingNames.map((n) => n.toLowerCase()));

  const extractNamesFromRows = (rows: any[][]): string[] => {
    if (!rows || rows.length === 0) return [];
    let nameColIdx = 0;
    let startRowIdx = 0;

    const firstRow = rows[0] || [];
    const headerKeywords = ["tên", "ten", "họ", "ho", "khách", "khach", "name", "danh sách", "danh sach"];

    for (let c = 0; c < firstRow.length; c++) {
      const val = String(firstRow[c] || "").toLowerCase().trim();
      if (headerKeywords.some((kw) => val.includes(kw))) {
        nameColIdx = c;
        startRowIdx = 1;
        break;
      }
    }

    const results: string[] = [];
    for (let r = startRowIdx; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;
      const cellVal = row[nameColIdx];
      if (cellVal !== undefined && cellVal !== null) {
        const cleaned = String(cellVal).replace(/\s+/g, " ").trim();
        if (cleaned && !headerKeywords.some((kw) => cleaned.toLowerCase() === kw)) {
          results.push(cleaned);
        }
      }
    }

    return Array.from(new Set(results));
  };

  const handleFileUpload = async (file: File) => {
    setError("");
    setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setError("File Excel không có dữ liệu bảng tính.");
        return;
      }
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      const names = extractNamesFromRows(rows);
      if (names.length === 0) {
        setError("Không tìm thấy tên khách nào trong file Excel này. Vui lòng kiểm tra lại cột tên.");
        return;
      }
      setParsedNames(names);
    } catch {
      setError("Không thể đọc file. Vui lòng kiểm tra định dạng file (.xlsx, .xls, .csv).");
    }
  };

  const handlePasteChange = (text: string) => {
    setPasteText(text);
    setError("");
    const lines = text
      .split(/\r?\n/)
      .map((line) => {
        const parts = line.split("\t");
        return (parts[0] || "").replace(/\s+/g, " ").trim();
      })
      .filter((n) => n.length > 0);

    const unique = Array.from(new Set(lines));
    setParsedNames(unique);
  };

  const downloadSampleExcel = () => {
    const wb = XLSX.utils.book_new();
    const sampleData = [
      ["Họ và tên"],
      ["Anh Nguyễn Văn Tuấn & Bạn"],
      ["Chị Trần Thu Hà"],
      ["Gia đình Bác Hoàng"],
      ["Bạn Lê Quốc Dũng"],
      ["Em Mai Phương"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    ws["!cols"] = [{ wch: 35 }];
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachKhach");
    XLSX.writeFile(wb, "Mau_danh_sach_khach_moi.xlsx");
  };

  const handleImport = async () => {
    if (parsedNames.length === 0) {
      setError("Chưa có khách mời nào được chọn để nhập.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const param = slug && slug !== "default" ? `?slug=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/admin/guests${param}`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ names: parsedNames }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onSuccess(data.addedCount || parsedNames.length);
        onClose();
      } else {
        setError(data.error || "Có lỗi xảy ra khi nhập dữ liệu.");
      }
    } catch {
      setError("Lỗi kết nối khi gửi dữ liệu lên máy chủ.");
    } finally {
      setBusy(false);
    }
  };

  const duplicateNames = parsedNames.filter((n) => existingLowerSet.has(n.toLowerCase()));
  const newNames = parsedNames.filter((n) => !existingLowerSet.has(n.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-gold/30 bg-[#fdfbf7] p-6 shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 text-lg shadow-sm">
              📊
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-wine">
                Nhập danh sách khách từ Excel / Sheets
              </h3>
              <p className="text-xs text-ink/60 mt-0.5">
                Thêm hàng loạt khách mời cùng lúc, tự động tạo mã link riêng cho từng người.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-full p-1.5 text-ink/40 hover:bg-gold/15 hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 border-b border-stone-200 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("file")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tab === "file"
                  ? "bg-wine text-white shadow-sm"
                  : "bg-stone-100 text-ink/70 hover:bg-stone-200"
              }`}
            >
              📁 Tải file Excel (.xlsx, .csv)
            </button>
            <button
              type="button"
              onClick={() => setTab("paste")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                tab === "paste"
                  ? "bg-wine text-white shadow-sm"
                  : "bg-stone-100 text-ink/70 hover:bg-stone-200"
              }`}
            >
              📋 Dán trực tiếp (Copy &amp; Paste)
            </button>
          </div>

          <button
            type="button"
            onClick={downloadSampleExcel}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline flex items-center gap-1 cursor-pointer"
            title="Tải file mẫu để điền tên khách"
          >
            <span>📥 Tải file Excel mẫu</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {tab === "file" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFileUpload(f);
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-gold/50 bg-amber-50/40 p-8 text-center hover:border-wine hover:bg-amber-50/70 transition"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800 mb-2">
                  📂
                </div>
                <p className="text-sm font-semibold text-ink">
                  {fileName ? `Đã chọn: ${fileName}` : "Bấm để chọn file Excel hoặc kéo thả vào đây"}
                </p>
                <p className="text-xs text-ink/50 mt-1">
                  Hỗ trợ định dạng .xlsx, .xls, .csv (tự động nhận diện cột Tên khách)
                </p>
              </div>
            </div>
          )}

          {tab === "paste" && (
            <div>
              <label className="block text-xs font-semibold text-ink/80 mb-1">
                Dán cột danh sách tên khách từ Excel hoặc Google Sheets (mỗi dòng 1 khách):
              </label>
              <textarea
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder={`Anh Nam & Bạn\nChị Thuỳ Dương\nGia đình Bác Hùng\nBạn Hoàng Dũng`}
                rows={6}
                className="w-full rounded-xl border border-gold/40 bg-white p-3 text-xs text-ink outline-none focus:border-wine focus:ring-1 focus:ring-wine font-mono"
              />
            </div>
          )}

          {parsedNames.length > 0 && (
            <div className="rounded-xl border border-gold/30 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-wine">
                    Tìm thấy: {parsedNames.length} khách mời
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    +{newNames.length} khách mới
                  </span>
                  {duplicateNames.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      {duplicateNames.length} trùng (sẽ bỏ qua)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setParsedNames([]);
                    setFileName("");
                    setPasteText("");
                  }}
                  className="text-[11px] text-red-600 hover:underline cursor-pointer"
                >
                  Xóa làm lại
                </button>
              </div>

              <div className="mt-3 max-h-48 overflow-y-auto divide-y divide-stone-100 text-xs">
                {parsedNames.slice(0, 30).map((name, i) => {
                  const isDup = existingLowerSet.has(name.toLowerCase());
                  return (
                    <div key={i} className="flex items-center justify-between py-1.5 px-1">
                      <span className="text-ink font-medium">
                        {i + 1}. {name}
                      </span>
                      {isDup ? (
                        <span className="text-[10px] text-amber-600 font-medium">Đã có (Bỏ qua)</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-medium">Hợp lệ ✓</span>
                      )}
                    </div>
                  );
                })}
                {parsedNames.length > 30 && (
                  <div className="py-2 text-center text-[11px] text-ink/50 italic">
                    ... và {parsedNames.length - 30} khách mời khác
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gold/15 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
          >
            Huỷ bỏ
          </button>
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={busy || newNames.length === 0}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {busy && (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>Nhập {newNames.length} khách mời vào danh sách</span>
          </button>
        </div>
      </div>
    </div>
  );
}
