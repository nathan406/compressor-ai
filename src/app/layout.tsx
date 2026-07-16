import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Compresor AI — The AI Efficiency Operating System',
  description:
    'Compresor AI is the AI Efficiency Operating System. Optimize every layer between your AI models and your users.',
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
