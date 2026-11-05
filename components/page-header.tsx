type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-zinc-300 via-zinc-200 to-transparent dark:from-zinc-700 dark:via-zinc-800" />
    </header>
  );
}
