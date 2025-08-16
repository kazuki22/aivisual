import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import * as sharp from "sharp";

export async function POST(req: Request) {
  const { keyword } = await req.json();

  try {
    const payload = {
      prompt: `Create a realistic image of ${keyword}`,
      output_format: "png",
    };

    const formData = new FormData();
    formData.append("prompt", payload.prompt);
    formData.append("output_format", payload.output_format);

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      formData,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    // 画像の最適化（サイズを抑えるため WebP で再エンコード）
    const optimizedImage = await sharp
      .default(response.data)
      .resize(1280, 720)
      .webp({ quality: 75, effort: 5 })
      .toBuffer();

    // 画像をエンコーディング
    const base64Image = optimizedImage.toString("base64");
    const imageUrl = `data:image/webp;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
