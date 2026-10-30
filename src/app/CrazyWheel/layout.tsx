import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "GDG RadWheel // DevFest MTL '26 Raffle",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CrazyWheelRootLayout({
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
