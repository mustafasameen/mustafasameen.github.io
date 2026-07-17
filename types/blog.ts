export interface Publication {
  slug: string;
  metadata: {
    title: string;
    authors: string;
    venue: string; // Preprint or conference name
    pdfUrl?: string;
    codeUrl?: string;
    coFirstAuthors?: string;
    year?: string;
    image?: string;
    featured?: string;
  };
  content: string;
}
