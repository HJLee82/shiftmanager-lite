import Link from "next/link";
import StoreLabel from "@/components/StoreLabel";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold text-gray-800">
            ShiftManager Lite
          </Link>
          <StoreLabel />
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/employees" className="text-gray-600 hover:text-gray-900">
            Employees
          </Link>
          <Link href="/schedule" className="text-gray-600 hover:text-gray-900">
            Schedule
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-gray-900">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}