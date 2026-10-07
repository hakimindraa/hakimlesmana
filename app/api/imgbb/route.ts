import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ambil Kunci API ImgBB dari Environment Variables
    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
    
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Siapkan wadah untuk dikirim ke ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", image);

    // Proses pengiriman ke server ImgBB
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ url: data.data.url });
    } else {
      return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
