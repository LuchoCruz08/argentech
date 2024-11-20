import { Code2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-50 border-b border-blue-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-800">Argentech</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/agregar"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Agregar Proyecto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
