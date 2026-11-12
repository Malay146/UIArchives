import { cardData } from "@/data/cardData";
import { normalizeResource, type UiCardData } from "@/types/resource";

/**
 * What the public directory shows: each resource reduced to its one link
 * (website, or X for socials). Resources missing that link are left out.
 */
export const resources: UiCardData[] = cardData
  .map(normalizeResource)
  .filter((r): r is UiCardData => r !== null);
