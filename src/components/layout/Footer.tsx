import { contact } from "../../data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-surface-300/30 bg-surface-50/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <span className="text-brand font-mono font-semibold">martins</span>{" "}
          &copy; {new Date().getFullYear()}. Built with React, TypeScript &
          coffee.
        </div>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-brand transition-colors"
          >
            Email
          </a>
          <a
            href={`https://${contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            GitHub
          </a>
          <a
            href={`https://${contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`https://x.com/${contact.twitter.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors"
          >
            X / Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
