import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevFest Montréal 2026 · Staff & Room Assignments',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
