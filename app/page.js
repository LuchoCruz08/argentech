"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DynamicSelect } from "@/components/DynamicSelect";
import { provinces } from "@/config/provinces";
import { industries } from "@/config/industries";
import { createClient } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [founderNameFilter, setFounderNameFilter] = useState("");
  const [founderProvinceFilter, setFounderProvinceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, nameFilter, industryFilter, provinceFilter, founderNameFilter, founderProvinceFilter,
  ]);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select(`
          *,
          founders (
            name,
            province
          )
        `);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      setError("Error al cargar los proyectos");
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterProjects() {
    let filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (industryFilter === "all" || project.industry === industryFilter) &&
        (provinceFilter === "all" || project.province === provinceFilter) &&
        (founderNameFilter === "" ||
          project.founders.some((founder) =>
            founder.name.toLowerCase().includes(founderNameFilter.toLowerCase())
          )) &&
        (founderProvinceFilter === "all" ||
          project.founders.some(
            (founder) => founder.province === founderProvinceFilter
          ))
    );
    setFilteredProjects(filtered);
  }

  if (loading)
    return <div className="text-center mt-8">Cargando proyectos...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Proyectos Tecnológicos Argentinos
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name-filter">Nombre del Proyecto</Label>
                <Input
                  id="name-filter"
                  placeholder="Filtrar por nombre"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="industry-filter">Industria</Label>
                <DynamicSelect
                  options={industries}
                  value={industryFilter}
                  onValueChange={setIndustryFilter}
                  placeholder="Seleccionar industria"
                  label="Todas las Industrias"
                />
              </div>
              <div>
                <Label htmlFor="province-filter">Provincia del Proyecto</Label>
                <DynamicSelect
                  options={provinces}
                  value={provinceFilter}
                  onValueChange={setProvinceFilter}
                  placeholder="Seleccionar provincia"
                  label="Todas las Provincias"
                />
              </div>
              <div>
                <Label htmlFor="founder-name-filter">Nombre del Fundador</Label>
                <Input
                  id="founder-name-filter"
                  placeholder="Filtrar por nombre del fundador"
                  value={founderNameFilter}
                  onChange={(e) => setFounderNameFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="founder-province-filter">
                  Provincia del Fundador
                </Label>
                <DynamicSelect
                  options={provinces}
                  value={founderProvinceFilter}
                  onValueChange={setFounderProvinceFilter}
                  placeholder="Seleccionar provincia del fundador"
                  label="Todas las Provincias"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4} className="text-center bg-blue-50">
                  Información del Proyecto
                </TableHead>
                <TableHead colSpan={2} className="text-center bg-green-50">
                  Información de los Fundadores
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Industria</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Fundadores</TableHead>
                <TableHead>Enlace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.industry}</TableCell>
                  <TableCell>{project.province}</TableCell>
                  <TableCell>
                    {project.founders.map((founder, index) => (
                      <div key={index} className="mb-1">
                        {founder.name}{" "}
                        <span className="text-sm text-gray-500">
                          ({founder.province})
                        </span>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {project.project_link && (
                      <a
                        href={project.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Visitar <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
