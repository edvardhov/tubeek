import { APP_MODE } from "@/lib/deck-source/index";
import { demoSource } from "@/lib/deck-source/demo";
import { liveSource } from "@/lib/deck-source/live";
import type { DeckSource } from "@/lib/deck-source/index";

export function getDeckSource(): DeckSource {
  return APP_MODE === "demo" ? demoSource : liveSource;
}

export { SAMPLE_VIDEOS } from "@/lib/deck-source/demo";
