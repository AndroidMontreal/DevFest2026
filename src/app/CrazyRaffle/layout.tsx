import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "GDG CrazyRaffle // DevFest MTL '26 Category Shuffler",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CrazyRaffleRootLayout({
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
