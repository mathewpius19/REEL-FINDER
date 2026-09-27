import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/config";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const response = await fetch(`${getBackendBaseUrl().replace(/\/recommender$/, "")}/recommender/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return NextResponse.json(
        { message: "Signup request failed.", details: payload },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to connect to the signup endpoint.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
