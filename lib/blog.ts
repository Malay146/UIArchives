import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "../types/blog";

const postsDirectory = path.join(process.cwd(), "content/blog");

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const timeToRead = readingTime(content).text;

    return {
      slug: realSlug,
      frontmatter: data as PostFrontmatter,
      content,
      readingTime: timeToRead,
    };
  } catch (error) {
    console.error(`Error reading blog post: ${slug}`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs
    .filter((slug) => slug.endsWith(".mdx"))
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => {
      // Sort posts by date in descending order
      return (
        new Date(post2.frontmatter.date).getTime() -
        new Date(post1.frontmatter.date).getTime()
      );
    });

  return posts;
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(
    posts.map((post) => post.frontmatter.category).filter(Boolean),
  );
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(
    posts.flatMap((post) => post.frontmatter.tags || []).filter(Boolean),
  );
  return Array.from(tags);
}
