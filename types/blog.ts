export interface PostAuthor {
  name: string;
  image?: string;
}

export interface PostFrontmatter {
  title: string;
  description?: string;
  excerpt?: string;
  date: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  author?: PostAuthor;
  sponsored?: boolean;
  isSponsored?: boolean;
}

export interface Post {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
  readingTime: string;
}
