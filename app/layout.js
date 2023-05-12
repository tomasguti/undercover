import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Button from './components/button'
import { StorageProvider } from './storage/StorageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Undercover',
  description: 'Find the player who has the different word.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="nav-bar">
          <Link href="/">
            <Button>Juego</Button>
          </Link>
          <Link href="/players">
            <Button>Jugadores</Button>
          </Link>
        </div>
        <StorageProvider>
          <div>{children}</div>
        </StorageProvider>
      </body>
    </html>
  )
}
