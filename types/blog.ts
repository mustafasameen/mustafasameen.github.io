export interface Publication {
  slug: string;
  metadata: {
    title: string;
    authors: string;
    venue: string; // Preprint or conference name
    pdfUrl?: string;
    codeUrl?: string;
    projectUrl?: string;
    coFirstAuthors?: string;
    year?: string;
    order?: string; // rank within a year; lower shows first
    image?: string; // teaser figure shown in "Selected publications"
    summary?: string; // one-line description shown next to the figure
    featured?: string;
  };
  content: string;
}
