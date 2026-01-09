import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Iterated Prisoner\'s Dilemma Simulator',
  description: 'An interactive game theory simulation exploring different strategies in the Iterated Prisoner\'s Dilemma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
