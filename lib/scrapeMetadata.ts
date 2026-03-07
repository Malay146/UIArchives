import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenAI, Type } from "@google/genai";

export interface ScrapedData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: {
    website: string;
    github: string;
    twitter: string;
    youtube: string;
  };
}

export async function scrapeMetadata(url: string): Promise<ScrapedData> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    let title =
      $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    const image = $('meta[property="og:image"]').attr("content") || "";

    // Clean up HTML before sending to Gemini to save tokens
    $("script, style, noscript, iframe, img, svg").remove();
    const cleanText = $("body").text().replace(/\s+/g, " ").substring(0, 15000); // 15K char limit for context

    let generatedDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    let generatedTags: string[] = [];

    // Prompt Gemini
    try {
      const prompt = `Analyze this website's content and return a JSON object containing:
      1. 'websiteName': The short, actual name of the website (e.g. 'Magic UI', 'Framer', 'Next.js'). DO NOT return a bio or description here, just the name.
      2. 'description': A concise description of what the website is/does, MAXIMUM 25 words.
      3. 'tags': An array containing exactly 10 relevant tags/keywords (e.g. React, UI Library, Tailwind, Templates, etc).
      
      Website text content:
      ${cleanText}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              websiteName: {
                type: Type.STRING,
                description:
                  "The actual short name of the website (e.g. Magic UI)",
              },
              description: {
                type: Type.STRING,
                description:
                  "A description of the website, strictly under 25 words",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 10 relevant tags",
              },
            },
            required: ["websiteName", "description", "tags"],
          },
        },
      });

      if (response.text) {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.websiteName) {
          title = jsonResponse.websiteName;
        }
        if (jsonResponse.description) {
          generatedDescription = jsonResponse.description;
        }
        if (jsonResponse.tags && Array.isArray(jsonResponse.tags)) {
          generatedTags = jsonResponse.tags;
        }
      }
    } catch (err) {
      console.error("Gemini AI failed to process tags, falling back.", err);
    }

    // Attempt to detect GitHub, Twitter, and YouTube links natively
    let github = "";
    let twitter = "";
    let youtube = "";

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      if (href.includes("github.com") && !github) github = href;
      if (
        (href.includes("twitter.com") || href.includes("x.com")) &&
        !twitter
      ) {
        twitter = href;
      }
      if (href.includes("youtube.com") && !youtube) youtube = href;
    });

    return {
      title,
      description: generatedDescription,
      image,
      tags: generatedTags,
      links: {
        website: url,
        github,
        twitter,
        youtube,
      },
    };
  } catch (error) {
    console.error("Error scraping metadata for URL:", url, error);
    return {
      title: "",
      description: "",
      image: "",
      tags: [],
      links: { website: url, github: "", twitter: "", youtube: "" },
    };
  }
}
