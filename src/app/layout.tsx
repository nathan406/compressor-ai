export const metadata = {
  title: "Compressor AI — API",
  description: "Compressor AI API Server — AI Efficiency Operating System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
