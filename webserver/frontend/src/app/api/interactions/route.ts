import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/config";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? "";

  try {
    const response = await fetch(`${getBackendBaseUrl()}/interactions?userId=${encodeURIComponent(userId)}`, {
      cache: "no-store"
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : [];

    if (!response.ok) {
      return NextResponse.json(
        { message: "Interaction history request failed.", details: payload },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to connect to the interactions endpoint.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const response = await fetch(`${getBackendBaseUrl()}/interactions`, {
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
        { message: "Interaction save request failed.", details: payload },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to connect to the interactions endpoint.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
