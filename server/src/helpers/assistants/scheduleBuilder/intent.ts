import { StateAnnotation } from "./state";

export function inferSectionRequest(
  query: string,
  meta: NonNullable<(typeof StateAnnotation.State)["planMeta"]>
): {
  requiredLimit: number;
  techElective: { name: string; limit: number };
  geArea: { name: string; limit: number };
} {
  /* 1.- defaults */
  let requiredLimit = 3;
  let tech = { name: "any", limit: 1 };
  let ge = { name: "any", limit: 1 };

  /* 2.- grep for GE pattern like "GE C1" */
  const geMatch = query.match(/\bGE\s+([A-Z0-9_]+)/i);
  if (geMatch && meta.openGECategories.includes(geMatch[1].toUpperCase())) {
    ge = { name: geMatch[1].toUpperCase(), limit: 1 };
  }

  /* 3.- grep for tech elective bucket name */
  for (const bucket of meta.openTechNames) {
    if (bucket && new RegExp(bucket, "i").test(query)) {
      tech = { name: bucket, limit: 1 };
      break;
    }
  }

  /* 4.- if user explicitly says "no required" */
  if (/no required|only electives/i.test(query)) requiredLimit = 0;

  /* 5.- other heuristics could go here ... */

  return { requiredLimit, techElective: tech, geArea: ge };
}
