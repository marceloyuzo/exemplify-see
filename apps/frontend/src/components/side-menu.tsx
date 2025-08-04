import { HomeIcon, Menu } from 'lucide-react'

export default function SideMenu() {
  return (
    <nav className="absolute left-0 top-0 h-full bg-red-100">
      <ul className="flex flex-col gap-6 p-4">
        <li className="mb-4">
          <Menu />
        </li>
        <li>
          <HomeIcon />
        </li>
        <li>
          <HomeIcon />
        </li>
        <li>
          <HomeIcon />
        </li>
        <li>
          <HomeIcon />
        </li>
        <li>
          <HomeIcon />
        </li>
        <li>
          <HomeIcon />
        </li>
      </ul>
    </nav>
  )
}
