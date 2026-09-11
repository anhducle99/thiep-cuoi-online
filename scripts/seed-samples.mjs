import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

const envPath = path.join(process.cwd(), ".env.local");
let blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!blobToken && fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf8");
  for (const line of envText.split("\n")) {
    const match = line.match(/^BLOB_READ_WRITE_TOKEN=["']?([^"'\r\n]+)["']?/);
    if (match) {
      blobToken = match[1];
      break;
    }
  }
}

async function saveFile(blobKey, localPath, data) {
  const json = JSON.stringify(data, null, 2);
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(localPath, json, "utf8");

  if (blobToken) {
    try {
      await put(blobKey, json, {
        access: "public",
        token: blobToken,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      console.log(`Uploaded to Blob: ${blobKey}`);
    } catch (err) {
      console.error(`Failed to upload ${blobKey} to Blob:`, err?.message || err);
    }
  }
}

const DEFAULT_WEDDING_META = {
  slug: "default",
  title: "Đám cưới Mặc định (Trang chủ)",
  groomName: "Nguyễn Hữu Thông",
  brideName: "Hoàng Thị Lâm Huyền",
  template: "olive-wax-seal",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const samples = [
  {
    meta: {
      slug: "tuan-lan",
      title: "Tuấn & Ngọc Lan",
      groomName: "Nguyễn Văn Tuấn",
      brideName: "Trần Thị Ngọc Lan",
      template: "olive-wax-seal",
      createdAt: new Date().toISOString(),
    },
    templateFile: "olive-wax-seal.json",
    groomFull: "Nguyễn Văn Tuấn",
    groomShort: "Văn Tuấn",
    brideFull: "Trần Thị Ngọc Lan",
    brideShort: "Ngọc Lan",
    groomFather: "Nguyễn Văn Hùng",
    groomMother: "Lê Thị Mai",
    brideFather: "Trần Văn Bình",
    brideMother: "Phạm Thị Cúc",
    guests: [
      { id: "bac-ba-1", name: "Bác Ba & Gia đình", order: 1 },
      { id: "anh-nam-2", name: "Anh Nam & Bạn", order: 2 },
      { id: "chi-hoa-3", name: "Chị Hoa", order: 3 },
      { id: "ban-thanh-4", name: "Bạn Thành", order: 4 },
    ],
  },
  {
    meta: {
      slug: "hung-mai",
      title: "Quang Hùng & Tuyết Mai",
      groomName: "Đặng Quang Hùng",
      brideName: "Lê Tuyết Mai",
      template: "holymaiden-rose",
      createdAt: new Date().toISOString(),
    },
    templateFile: "holymaiden-rose.json",
    groomFull: "Đặng Quang Hùng",
    groomShort: "Quang Hùng",
    brideFull: "Lê Tuyết Mai",
    brideShort: "Tuyết Mai",
    groomFather: "Đặng Văn Nam",
    groomMother: "Nguyễn Thị Hương",
    brideFather: "Lê Quốc Toàn",
    brideMother: "Hoàng Kim Yến",
    guests: [
      { id: "co-sau-1", name: "Cô Sáu & Gia đình", order: 1 },
      { id: "ban-dung-2", name: "Bạn Dũng", order: 2 },
      { id: "em-linh-3", name: "Em Linh", order: 3 },
      { id: "anh-khoa-4", name: "Anh Khoa & Chị Hằng", order: 4 },
    ],
  },
  {
    meta: {
      slug: "hoang-phuong",
      title: "Minh Hoàng & Hà Phương",
      groomName: "Bùi Minh Hoàng",
      brideName: "Vũ Hà Phương",
      template: "luxury-gold-black",
      createdAt: new Date().toISOString(),
    },
    templateFile: "luxury-gold-black.json",
    groomFull: "Bùi Minh Hoàng",
    groomShort: "Minh Hoàng",
    brideFull: "Vũ Hà Phương",
    brideShort: "Hà Phương",
    groomFather: "Bùi Thế Long",
    groomMother: "Đặng Thị Phương",
    brideFather: "Vũ Đình Trọng",
    brideMother: "Ngô Thị Thu",
    guests: [
      { id: "chu-chin-1", name: "Chú Chín & Gia đình", order: 1 },
      { id: "anh-kien-2", name: "Anh Kiên & Người thương", order: 2 },
      { id: "chi-thao-3", name: "Chị Thảo", order: 3 },
      { id: "ban-phuc-4", name: "Bạn Phúc", order: 4 },
    ],
  },
  {
    meta: {
      slug: "duc-thao",
      title: "Anh Đức & Thu Thảo",
      groomName: "Phạm Anh Đức",
      brideName: "Đỗ Thu Thảo",
      template: "song-hy-do",
      createdAt: new Date().toISOString(),
    },
    templateFile: "song-hy-do.json",
    groomFull: "Phạm Anh Đức",
    groomShort: "Anh Đức",
    brideFull: "Đỗ Thu Thảo",
    brideShort: "Thu Thảo",
    groomFather: "Phạm Đức Thắng",
    groomMother: "Lương Thị Nga",
    brideFather: "Đỗ Quang Minh",
    brideMother: "Vũ Thị Hạnh",
    guests: [
      { id: "ong-ba-bay-1", name: "Ông Bà Bảy", order: 1 },
      { id: "anh-long-2", name: "Anh Long & Gia đình", order: 2 },
      { id: "ban-mai-3", name: "Bạn Mai", order: 3 },
      { id: "em-phuong-4", name: "Em Phương", order: 4 },
    ],
  },
];

async function run() {
  console.log("Seeding 4 sample weddings...");

  const indexData = {
    weddings: [DEFAULT_WEDDING_META, ...samples.map((s) => s.meta)],
  };
  await saveFile(
    "weddings-index.json",
    path.join(process.cwd(), "data", "weddings-index.json"),
    indexData,
  );

  for (const item of samples) {
    const { meta, templateFile, groomFull, groomShort, brideFull, brideShort, groomFather, groomMother, brideFather, brideMother, guests } = item;
    const baseRaw = fs.readFileSync(
      path.join(process.cwd(), "data", "templates", templateFile),
      "utf8",
    );
    const baseData = JSON.parse(baseRaw);

    const weddingData = {
      ...baseData,
      groom: {
        ...baseData.groom,
        fullName: groomFull,
        shortName: groomShort,
        fatherName: groomFather,
        motherName: groomMother,
      },
      bride: {
        ...baseData.bride,
        fullName: brideFull,
        shortName: brideShort,
        fatherName: brideFather,
        motherName: brideMother,
      },
      theme: {
        ...baseData.theme,
        template: meta.template,
      },
    };

    await saveFile(
      `weddings/${meta.slug}/content.json`,
      path.join(process.cwd(), "data", "weddings", meta.slug, "wedding.json"),
      weddingData,
    );

    await saveFile(
      `weddings/${meta.slug}/guests.json`,
      path.join(process.cwd(), "data", "weddings", meta.slug, "guests.json"),
      { guests },
    );

    await saveFile(
      `weddings/${meta.slug}/rsvp.json`,
      path.join(process.cwd(), "data", "weddings", meta.slug, "rsvp.json"),
      { responses: [] },
    );

    await saveFile(
      `weddings/${meta.slug}/wishes.json`,
      path.join(process.cwd(), "data", "weddings", meta.slug, "wishes.json"),
      { wishes: [] },
    );

    console.log(`Completed wedding: ${meta.title} (/${meta.slug}) with template: ${meta.template}`);
  }

  console.log("All 4 sample weddings created successfully!");
}

run().catch((err) => {
  console.error("Error seeding sample weddings:", err);
  process.exit(1);
});
