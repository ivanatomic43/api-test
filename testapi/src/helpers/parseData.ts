import type { StructureElement, ResponseItem } from "../types/types";

export function transformResponse(response: ResponseItem[]) {
  return response.map(({ fileUrl }) => fileUrl);
}

export function addToStructure(
  structure: (StructureElement | string)[],
  parts: string[]
) {
  if (parts.length === 1) {
    structure.push(parts[0]);
  } else {
    const current = parts[0];
    const remained = parts.slice(1);
    let objectWithSameKey = structure.find(
      (item) => typeof item === "object" && item.hasOwnProperty(current)
    ) as StructureElement | undefined;

    if (!objectWithSameKey) {
      objectWithSameKey = { [current]: [] };
      structure.push(objectWithSameKey);
    }

    addToStructure(
      objectWithSameKey[current] as (StructureElement | string)[],
      remained
    );
  }
}
