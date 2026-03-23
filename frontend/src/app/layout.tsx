import "./globals.css";

export const metadata = {
  title: "Learnix",
  description: "Real-time coding platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}