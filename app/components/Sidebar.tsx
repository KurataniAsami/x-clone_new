import Link from "next/link"
import { SidebarData } from "./SidebarData"

export default function Sidebar() {
  return (
    <div className="">
      {SidebarData.map((value, key) => (
        <li
          key={key}
        >
          <Link
            href={value.link}
          >
            <div className="inline-flex gap-1 cursor-pointer px-4 py-3 rounded-xl hover:bg-gray-800">
              <div>{value.icon}</div>
              <div className="mt-1">{value.title}</div>
            </div>  
          </Link>
        </li>
      ))}
    </div>
  )
}