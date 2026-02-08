import { cardData } from "@/data/cardData";
import { NextResponse } from "next/server";
import type { UiCardData } from "@/components/ui-card";

// Enable caching for faster responses
export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12); // 3 x 4 grid default
  const tag = searchParams.get("tag") || "All";
  const search = searchParams.get("search") || "";

  // Filter by tag
  let filteredData: UiCardData[] = cardData;

  if (tag !== "All") {
    filteredData = cardData.filter((card) => {
      const tags = Array.isArray(card.tag) ? card.tag : [card.tag];
      return tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()));
    });
  }

  // Filter by search query
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter((card) => {
      const titleMatch = card.title.toLowerCase().includes(searchLower);
      const descMatch = card.description.toLowerCase().includes(searchLower);
      const tags = Array.isArray(card.tag) ? card.tag : [card.tag];
      const tagMatch = tags.some((t) => t.toLowerCase().includes(searchLower));

      return titleMatch || descMatch || tagMatch;
    });
  }

  // Paginate
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = filteredData.slice(start, end);

  return NextResponse.json({
    cards: paginatedData,
    hasMore: end < filteredData.length,
    total: filteredData.length,
    page,
  });
}
