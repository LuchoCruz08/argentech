"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { DynamicSelect } from "@/components/DynamicSelect";
import { provinces } from "@/config/provinces";
import { industries } from "@/config/industries";
import { createClient } from "@/lib/supabaseClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [project, setProject] = useState({
    name: "",
    description: "",
    industry: "",
    province: "",
    project_link: "",
  });

  const [founders, setFounders] = useState([
    { name: "", contact: "", province: "" },
  ]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleFounderChange = (index, field, value) => {
    const newFounders = [...founders];
    newFounders[index][field] = value;
    setFounders(newFounders);
  };

  const addFounder = () => {
    setFounders([...founders, { name: "", contact: "", province: "" }]);
  };

  const removeFounder = (index) => {
    const newFounders = founders.filter((_, i) => i !== index);
    setFounders(newFounders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!project.name || !project.province) {
      setError(
        "Por favor, complete los campos obligatorios del proyecto (Nombre y Provincia)"
      );
      setIsSubmitting(false);
      return;
    }

    if (founders.some((founder) => !founder.name)) {
      setError(
        "Por favor, complete los campos obligatorios de los fundadores (Nombre)"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert([project])
        .select();

      if (projectError) throw projectError;

      const foundersWithProjectId = founders.map((founder) => ({
        ...founder,
        project_id: projectData[0].id,
      }));

      const { error: foundersError } = await supabase
        .from("founders")
        .insert(foundersWithProjectId);

      if (foundersError) throw foundersError;

      router.push("/");
    } catch (error) {
      setError("Ocurrió un error al enviar el proyecto");
      console.error("Error al enviar el proyecto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Proyecto</CardTitle>
          <CardDescription>
            Ingrese los detalles del nuevo proyecto tecnológico y sus
            fundadores. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Información del Proyecto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre del Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={project.name}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industria</Label>
                  <DynamicSelect
                    options={industries}
                    value={project.industry}
                    onValueChange={(value) =>
                      setProject({ ...project, industry: value })
                    }
                    placeholder="Seleccionar industria"
                    label="Seleccionar Industria"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">
                    Provincia <span className="text-red-500">*</span>
                  </Label>
                  <DynamicSelect
                    options={provinces}
                    value={project.province}
                    onValueChange={(value) =>
                      setProject({ ...project, province: value })
                    }
                    placeholder="Seleccionar provincia"
                    label="Seleccionar Provincia"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_link">Enlace del Proyecto</Label>
                  <Input
                    id="project_link"
                    name="project_link"
                    value={project.project_link}
                    onChange={handleProjectChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleProjectChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Información de los Fundadores
              </h3>
              {founders.map((founder, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Fundador {index + 1}
                    </CardTitle>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFounder(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`founder-name-${index}`}>
                          Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`founder-name-${index}`}
                          value={founder.name}
                          onChange={(e) =>
                            handleFounderChange(index, "name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`founder-contact-${index}`}>
                          Contacto
                        </Label>
                        <Input
                          id={`founder-contact-${index}`}
                          value={founder.contact}
                          onChange={(e) =>
                            handleFounderChange(
                              index,
                              "contact",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`founder-province-${index}`}>
                          Provincia
                        </Label>
                        <DynamicSelect
                          options={provinces}
                          value={founder.province}
                          onValueChange={(value) =>
                            handleFounderChange(index, "province", value)
                          }
                          placeholder="Seleccionar provincia"
                          label="Seleccionar Provincia"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFounder}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Otro Fundador
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Proyecto"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
