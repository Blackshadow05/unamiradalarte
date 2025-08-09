/**
 * SimpleFooter (harmonious footer)
 * Lightweight footer variant with a soft fuchsia background to complement the site.
 * Note: RichFooter is the recommended full footer.
 */
export function SimpleFooter() {
  return (
    <footer className="bg-gradient-to-r from-fuchsia-50 via-fuchsia-100 to-fuchsia-200 dark:from-fuchsia-900 dark:to-fuchsia-800 text-gray-700 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
        © {new Date().getFullYear()} Una Mirada al Arte
      </div>
    </footer>
  );
}

export default SimpleFooter;