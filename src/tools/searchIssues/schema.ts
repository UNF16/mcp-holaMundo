import { z } from "zod";

export const searchIssuesInputSchema = z.object({
    owner: z.string().min(1, "El owner es requerido").describe("Dueño del repo (usuario u organización). Ej Facebook"),
    repo: z.string().min(1, "Repo requerido").describe("Nombre del repo a buscar. Ej: React"),
    query: z.string().min(1, "Consulta requerida").describe("Texto a buscar en los Issues. Ej: Is:open label:bug"),
    limit: z.number().int().min(1).max(50).default(10).describe("Cantidad máxima de resultados (1 a 50)")
})