"use client";

import { useState } from "react";
import {
  ACTIVITIES,
  CLASSES,
  FACTIONS,
  type Activity,
  type CharacterClass,
  type Faction,
} from "@/features/groups/catalog";
import { ActivityIcon, ClassIcon, FactionIcon } from "../icons";
import { Select } from "../select";

const choices = {
  activity: { placeholder: "Todas las actividades", options: ACTIVITIES },
  faction: { placeholder: "Ambas facciones", options: FACTIONS },
  characterClass: {
    placeholder: "Todas las clases",
    options: Object.fromEntries(
      Object.entries(CLASSES).map(([key, value]) => [key, value.label]),
    ),
  },
};

export function CatalogSelect({
  kind,
  defaultValue = "",
}: {
  kind: keyof typeof choices;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const catalog = choices[kind];
  const icon = !value ? undefined : kind === "activity" ? (
    <ActivityIcon activity={value as Activity} size={22} />
  ) : kind === "faction" ? (
    <FactionIcon faction={value as Faction} size={22} />
  ) : (
    <ClassIcon characterClass={value as CharacterClass} size={22} />
  );
  return (
    <Select
      name={kind}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      icon={icon}
    >
      <option value="">{catalog.placeholder}</option>
      {Object.entries(catalog.options).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </Select>
  );
}
