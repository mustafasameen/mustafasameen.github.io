import TextLink from "@/components/shared/text-link";
import type { ReactNode } from "react";

export type NewsItem = {
  year: string;
  month: string;
  content: ReactNode;
};

// Newest first.
export const newsItems: NewsItem[] = [
  {
    year: "2026",
    month: "Jan",
    content: (
      <>
        Our paper on the GHOST home detection software was accepted to the{" "}
        <TextLink href="https://trb.org/AnnualMeeting/AnnualMeeting.aspx">
          Transportation Research Board 105th Annual Meeting
        </TextLink>
        .
      </>
    ),
  },
  {
    year: "2025",
    month: "Sep",
    content: (
      <>
        Released the{" "}
        <TextLink href="https://arxiv.org/abs/2509.18181">
          SAPA preprint
        </TextLink>{" "}
        on theory-guided LLMs for ridesourcing mode choice modeling.
      </>
    ),
  },
  {
    year: "2025",
    month: "Aug",
    content: (
      <>
        Started my Ph.D. in Civil and Coastal Engineering at the{" "}
        <TextLink href="https://www.ufl.edu">University of Florida</TextLink>.
      </>
    ),
  },
  {
    year: "2025",
    month: "Jul",
    content: (
      <>
        Completed a summer research internship at the{" "}
        <TextLink href="https://mobility.mit.edu/">
          MIT JTL-Transit Lab
        </TextLink>
        .
      </>
    ),
  },
];
