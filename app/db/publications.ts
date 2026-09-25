import fs from "fs";
import path from "path";
import type { Publication } from "@/types/blog";

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Publication["metadata"]> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['\"](.*)['\"]$/, "$1"); // Remove quotes
    (metadata as any)[key.trim()] = value;
  });

  return { metadata: metadata as Publication["metadata"], content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): Publication[] {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));
    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPublications(): Publication[] {
  // Newest year first, then by the explicit `order` field within a year.
  // Entries without `order` fall to the end of their year.
  return getMDXData(path.join(process.cwd(), "content/publications")).sort(
    (a, b) => {
      const yearDiff =
        Number(b.metadata.year || 0) - Number(a.metadata.year || 0);
      if (yearDiff !== 0) return yearDiff;
      const rank = (pub: Publication) =>
        pub.metadata.order ? Number(pub.metadata.order) : Number.MAX_SAFE_INTEGER;
      return rank(a) - rank(b);
    }
  );
} 