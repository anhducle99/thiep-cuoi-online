import type { ThemeConfig, ThemeColorCustomization } from "@/types/wedding";

export interface ColorPreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor?: string;
}

export const TEMPLATE_PRESETS: Record<ThemeConfig["template"], ColorPreset[]> = {
  "olive-wax-seal": [
    {
      id: "olive-classic",
      name: "Xanh Olive Kinh Điển",
      description: "Tông màu gốc sang trọng, mộc mạc và thanh lịch",
      primaryColor: "#4e6437",
      secondaryColor: "#27321c",
      backgroundColor: "#f8f8f4",
      cardColor: "#edf1ea",
      textColor: "#4e6437",
    },
    {
      id: "olive-burgundy",
      name: "Đỏ Rượu Burgundy",
      description: "Ấm cúng, quý phái với sắc đỏ rượu vang nồng nàn",
      primaryColor: "#8b1e3f",
      secondaryColor: "#4a0e20",
      backgroundColor: "#faf5f6",
      cardColor: "#f4e8ec",
      textColor: "#8b1e3f",
    },
    {
      id: "olive-navy",
      name: "Xanh Navy Hoàng Gia",
      description: "Thanh lịch, cổ điển với xanh biển sâu quý tộc",
      primaryColor: "#1e3a5f",
      secondaryColor: "#0f1d30",
      backgroundColor: "#f4f6fa",
      cardColor: "#e8eef6",
      textColor: "#1e3a5f",
    },
    {
      id: "olive-terracotta",
      name: "Nâu Đất Boho",
      description: "Ấm áp, tự nhiên với gam màu đất nung phóng khoáng",
      primaryColor: "#a25232",
      secondaryColor: "#5a2814",
      backgroundColor: "#faf6f3",
      cardColor: "#f5ebe6",
      textColor: "#a25232",
    },
  ],

  "holymaiden-rose": [
    {
      id: "rose-sweet",
      name: "Hồng Phấn Ngọt Ngào",
      description: "Gam hồng pastel thơ mộng và lãng mạn",
      primaryColor: "#e892a2",
      secondaryColor: "#d46a7e",
      backgroundColor: "#fff0f3",
      cardColor: "#ffe5ec",
      textColor: "#9c3b52",
    },
    {
      id: "rose-babyblue",
      name: "Xanh Băng Thanh (Baby Blue)",
      description: "Dịu mát, trong trẻo như bầu trời thu",
      primaryColor: "#5b9bd5",
      secondaryColor: "#2b78e4",
      backgroundColor: "#f0f8ff",
      cardColor: "#e1efff",
      textColor: "#1a4f8b",
    },
    {
      id: "rose-lavender",
      name: "Tím Oải Hương (Lavender)",
      description: "Thủy chung, say đắm với sắc tím mộng mơ",
      primaryColor: "#ba68c8",
      secondaryColor: "#8e44ad",
      backgroundColor: "#f9f5ff",
      cardColor: "#efe8fd",
      textColor: "#6c2d82",
    },
    {
      id: "rose-sage",
      name: "Xanh Bơ (Sage Green)",
      description: "Tươi trẻ, mộc mạc và an lành hòa quyện thiên nhiên",
      primaryColor: "#7cb342",
      secondaryColor: "#4b8334",
      backgroundColor: "#f4f9f2",
      cardColor: "#e5f2e1",
      textColor: "#33691e",
    },
  ],

  "luxury-gold-black": [
    {
      id: "gold-black",
      name: "Than Chì & Vàng 24K",
      description: "Mẫu gốc huyền bí, quyền quý và đẳng cấp",
      primaryColor: "#D4AF37",
      secondaryColor: "#15130F",
      backgroundColor: "#0B0A08",
      cardColor: "#1A1712",
      textColor: "#FFF8E7",
    },
    {
      id: "gold-white",
      name: "Trắng Sứ & Vàng Kim",
      description: "Sáng sủa, hoàng gia, thanh tao và trang nhã",
      primaryColor: "#B8860B",
      secondaryColor: "#FFFFFF",
      backgroundColor: "#FAF8F5",
      cardColor: "#F4EFE6",
      textColor: "#2B2519",
    },
    {
      id: "gold-navy",
      name: "Xanh Đêm Midnight & Vàng Kim",
      description: "Sâu thẳm, huyền ảo như bầu trời sao dạ tiệc",
      primaryColor: "#E5C158",
      secondaryColor: "#111E33",
      backgroundColor: "#09111E",
      cardColor: "#14243D",
      textColor: "#F0F6FF",
    },
    {
      id: "gold-ruby",
      name: "Đỏ Ruby & Vàng Kim",
      description: "May mắn, nồng nàn và rạng ngời quý phái",
      primaryColor: "#E5C158",
      secondaryColor: "#2E0A12",
      backgroundColor: "#1C060B",
      cardColor: "#360C15",
      textColor: "#FFF0F2",
    },
  ],

  "song-hy-do": [
    {
      id: "songhy-classic",
      name: "Đỏ Truyền Thống",
      description: "Sắc đỏ son rực rỡ, biểu trưng may mắn và trăm năm hạnh phúc",
      primaryColor: "#c0262d",
      secondaryColor: "#8b0000",
      backgroundColor: "#fff8f0",
      cardColor: "#ffeedd",
      textColor: "#8b0000",
    },
    {
      id: "songhy-wine",
      name: "Đỏ Rượu Nhung",
      description: "Đằm thắm, sang trọng và cổ điển",
      primaryColor: "#800020",
      secondaryColor: "#420011",
      backgroundColor: "#fbf5f5",
      cardColor: "#f3e3e6",
      textColor: "#420011",
    },
    {
      id: "songhy-gold",
      name: "Đỏ Cam Hoàng Kim",
      description: "Trẻ trung, hiện đại và tràn đầy sinh khí",
      primaryColor: "#d9381e",
      secondaryColor: "#a31f08",
      backgroundColor: "#fff9f2",
      cardColor: "#fae8db",
      textColor: "#8f1906",
    },
  ],
};

export function getDefaultPreset(template: ThemeConfig["template"]): ColorPreset {
  const presets = TEMPLATE_PRESETS[template];
  return (
    presets?.[0] ?? {
      id: "default",
      name: "Mặc định",
      description: "Màu mặc định của mẫu",
      primaryColor: "#4e6437",
      secondaryColor: "#27321c",
      backgroundColor: "#f8f8f4",
      cardColor: "#edf1ea",
      textColor: "#333333",
    }
  );
}

export function resolveThemeColors(
  template: ThemeConfig["template"],
  customColors?: ThemeColorCustomization
): ColorPreset {
  const defaultPreset = getDefaultPreset(template);

  if (!customColors) {
    return defaultPreset;
  }

  let basePreset = defaultPreset;
  if (customColors.presetId) {
    const found = TEMPLATE_PRESETS[template]?.find((p) => p.id === customColors.presetId);
    if (found) basePreset = found;
  }

  return {
    id: customColors.presetId || basePreset.id,
    name: basePreset.name,
    description: basePreset.description,
    primaryColor: customColors.primaryColor || basePreset.primaryColor,
    secondaryColor: customColors.secondaryColor || basePreset.secondaryColor,
    backgroundColor: customColors.backgroundColor || basePreset.backgroundColor,
    cardColor: customColors.cardColor || basePreset.cardColor,
    textColor: customColors.textColor || basePreset.textColor,
  };
}
