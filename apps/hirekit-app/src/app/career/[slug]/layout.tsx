import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'index, follow',
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
