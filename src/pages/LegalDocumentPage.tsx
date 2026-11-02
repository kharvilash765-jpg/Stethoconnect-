import { ArrowLeft } from 'lucide-react';
import { LEGAL_DOCUMENTS, LEGAL_LAST_UPDATED } from '@/content/legalPages';

interface LegalDocumentPageProps {
  slug: string;
}

export function LegalDocumentPage({ slug }: LegalDocumentPageProps) {
  const doc = LEGAL_DOCUMENTS.find((d) => d.slug === slug);

  if (!doc) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center">
        <p className="font-bold text-slate-900 dark:text-white">This legal policy could not be found</p>
        <a href="#/settings" className="mt-4 inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          Back to settings
        </a>
      </div>
    );
  }

  const otherDocs = LEGAL_DOCUMENTS.filter((d) => d.slug !== slug);

  return (
    <article className="space-y-8">
      <a
        href="#/settings"
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </a>

      <header>
        <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">{doc.title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {LEGAL_LAST_UPDATED}</p>
      </header>

      <p className="rounded-2xl border border-teal-100 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 p-5 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
        {doc.summary}
      </p>

      <div className="space-y-7">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{section.heading}</h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav className="border-t border-slate-200 dark:border-slate-800 pt-6" aria-label="Other policies">
        <p className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Other policies & terms</p>
        <ul className="flex flex-wrap gap-2">
          {otherDocs.map((d) => (
            <li key={d.slug}>
              <a
                href={`#/legal/${d.slug}`}
                className="inline-block rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm text-slate-700 dark:text-slate-300 transition hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm"
              >
                {d.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
