import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Pakai service role key untuk bypass RLS di storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Cek auth dulu — hanya admin yang boleh upload
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `banner-${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // List buckets untuk cari nama yang benar
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bannerBucket = buckets?.find(
      (b) => b.name.toLowerCase() === "banners"
    );

    if (!bannerBucket) {
      return NextResponse.json(
        { error: `Bucket 'banners' tidak ditemukan. Tersedia: ${buckets?.map(b => b.name).join(", ")}` },
        { status: 404 }
      );
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bannerBucket.name)
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      throw new Error(`Upload gagal: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bannerBucket.name)
      .getPublicUrl(fileName);

    return NextResponse.json({ publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
