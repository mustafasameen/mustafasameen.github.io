const FOOTER_LINKS = [
  { label: "github", href: "https://github.com/mustafasameen" },
  {
    label: "scholar",
    href: "https://scholar.google.com/citations?user=a8DWRtUAAAAJ&hl=en",
  },
  { label: "linkedin", href: "https://www.linkedin.com/in/mustafasameen/" },
  { label: "email", href: "mailto:mustafasameen@ufl.edu" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="flex flex-col items-center justify-between gap-3 text-sm tracking-tight text-neutral-500 dark:text-neutral-400 sm:flex-row">
        <p>© {new Date().getFullYear()} Mustafa Sameen</p>
        <nav className="flex gap-4" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
