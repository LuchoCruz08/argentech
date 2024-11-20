import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Información Importante
            </h3>
            <p className="text-sm text-gray-600">
              Si no desea que su proyecto aparezca en esta página, por favor
              contácteme en:{" "}
              <a
                href="mailto:lucianovcruz2004@gmail.com"
                className="text-blue-600 hover:underline"
              >
                lucianovcruz2004@gmail.com
              </a>
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Desarrollado por
            </h3>
            <p className="text-sm text-gray-600">
              Luciano Cruz
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/lucianovcruz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://github.com/LuchoCruz08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://portfolio-luchocruz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Portfolio Web</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Luciano Cruz. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
