/**
 * Image Processing Utilities
 * 
 * Helper functions for processing images in the agent system
 */

import { ImageContent } from "@/lib/state/agent-state";

/**
 * Check if a message content contains images
 */
export function hasImages(content: string | Array<string | ImageContent>): boolean {
  if (typeof content === "string") {
    return false;
  }
  return Array.isArray(content) && content.some(
    item => typeof item === "object" && item !== null && "type" in item && item.type === "image_url"
  );
}

/**
 * Extract text from message content (removes images)
 */
export function extractText(content: string | Array<string | ImageContent>): string {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .filter((item): item is string => typeof item === "string")
      .join(" ");
  }
  return "";
}

/**
 * Extract images from message content
 */
export function extractImages(content: string | Array<string | ImageContent>): ImageContent[] {
  if (typeof content === "string") {
    return [];
  }
  if (Array.isArray(content)) {
    return content.filter((item): item is ImageContent => 
      typeof item === "object" && item !== null && "type" in item && item.type === "image_url"
    );
  }
  return [];
}

/**
 * Build message content array with text and images
 */
export function buildMessageContent(
  text: string,
  imageUrls?: string[]
): string | Array<string | ImageContent> {
  if (!imageUrls || imageUrls.length === 0) {
    return text;
  }

  const contentArray: Array<string | ImageContent> = [text];

  imageUrls.forEach((imageUrl: string) => {
    if (typeof imageUrl === "string" && imageUrl.trim()) {
      contentArray.push({
        type: "image_url",
        image_url: {
          url: imageUrl, // Can be data URL (base64) or external URL
        },
      });
    }
  });

  return contentArray;
}

/**
 * Validate image URL format
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  // Check if it's a data URL (base64)
  if (url.startsWith("data:image/")) {
    return true;
  }

  // Check if it's a valid HTTP(S) URL
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}
