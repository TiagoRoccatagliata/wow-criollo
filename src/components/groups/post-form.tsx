"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import {
  ACTIVITIES,
  AVAILABILITIES,
  CLASSES,
  FACTIONS,
  type Activity,
  type CharacterClass,
  type Faction,
} from "@/features/groups/catalog";
import { postSchema, type PostInput } from "@/features/groups/schema";
import { createPostAction } from "@/features/groups/actions";
import { ActivityIcon, ClassIcon, FactionIcon } from "../icons";
import { Select } from "../select";

export function PostForm() {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      faction: "HORDE",
      activity: "DUNGEONS",
      availability: "NIGHT",
      playersNeeded: 1,
      discordUsername: "",
      website: "",
    },
  });
  const description =
    useWatch({ control, name: "description", defaultValue: "" }) || "";
  const fieldError = (name: keyof PostInput) =>
    errors[name] ? (
      <span className="field-error" role="alert" id={`error-${name}`}>
        {errors[name]?.message}
      </span>
    ) : null;
  const a11y = (name: keyof PostInput) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  async function submit(data: PostInput) {
    setError("");
    try {
      const result = await createPostAction(data);
      if (result.error) setError(result.error);
    } catch (e) {
      // Next handles its redirect exception; transport failures get visible feedback.
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      setError("No pudimos conectar. Revisa tu conexión e intenta de nuevo.");
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="post-form">
      <fieldset>
        <legend>Personaje</legend>
        <div className="form-grid">
          <label className="span-2">
            Nombre del personaje <span className="required">*</span>
            <input
              maxLength={24}
              autoComplete="off"
              {...register("characterName")}
              {...a11y("characterName")}
            />
            {fieldError("characterName")}
          </label>
          <label>
            Nivel actual <span className="required">*</span>
            <input
              type="number"
              min={1}
              max={60}
              placeholder="1–60"
              {...register("level", { valueAsNumber: true })}
              {...a11y("level")}
            />
            {fieldError("level")}
          </label>
          <fieldset
            className="visual-picker span-3"
            {...a11y("characterClass")}
          >
            <legend>
              Clase <span className="required">*</span>
            </legend>
            <div className="choice-grid class-choices">
              {Object.entries(CLASSES).map(([value, characterClass]) => (
                <label className="choice-option" key={value}>
                  <input
                    className="choice-input"
                    type="radio"
                    value={value}
                    {...register("characterClass")}
                  />
                  <ClassIcon
                    characterClass={value as CharacterClass}
                    size={32}
                  />
                  <span>{characterClass.label}</span>
                </label>
              ))}
            </div>
            {fieldError("characterClass")}
          </fieldset>
          <fieldset className="visual-picker span-3" {...a11y("faction")}>
            <legend>
              Facción <span className="required">*</span>
            </legend>
            <div className="choice-grid faction-choices">
              {Object.entries(FACTIONS).map(([value, label]) => (
                <label className="choice-option" key={value}>
                  <input
                    className="choice-input"
                    type="radio"
                    value={value}
                    {...register("faction")}
                  />
                  <FactionIcon faction={value as Faction} size={32} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {fieldError("faction")}
          </fieldset>
        </div>
      </fieldset>
      <fieldset>
        <legend>Búsqueda</legend>
        <div className="form-grid">
          <fieldset className="visual-picker span-3" {...a11y("activity")}>
            <legend>
              Actividad <span className="required">*</span>
            </legend>
            <div className="choice-grid activity-choices">
              {Object.entries(ACTIVITIES).map(([value, label]) => (
                <label className="choice-option" key={value}>
                  <input
                    className="choice-input"
                    type="radio"
                    value={value}
                    {...register("activity")}
                  />
                  <ActivityIcon activity={value as Activity} size={28} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {fieldError("activity")}
          </fieldset>
          <label className="span-2">
            Zona, dungeon o campo de batalla <span className="required">*</span>
            <input
              maxLength={80}
              placeholder="Ej. Cavernas de los Lamentos"
              {...register("zone")}
              {...a11y("zone")}
            />
            {fieldError("zone")}
          </label>
          <label>
            Nivel recomendado <span className="required">*</span>
            <input
              type="number"
              min={1}
              max={60}
              placeholder="Ej. 20"
              {...register("recommendedLevel", { valueAsNumber: true })}
              {...a11y("recommendedLevel")}
            />
            {fieldError("recommendedLevel")}
          </label>
          <label>
            Jugadores que buscas <span className="required">*</span>
            <input
              type="number"
              min={1}
              max={39}
              {...register("playersNeeded", { valueAsNumber: true })}
              {...a11y("playersNeeded")}
            />
            {fieldError("playersNeeded")}
          </label>
          <label>
            Disponibilidad <span className="required">*</span>
            <Select {...register("availability")} {...a11y("availability")}>
              {Object.entries(AVAILABILITIES).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </Select>
            {fieldError("availability")}
          </label>
          <label className="span-3">
            Día y horario (UTC−3) <span className="required">*</span>
            <input
              maxLength={100}
              placeholder="Ej. Hoy a las 21:00"
              {...register("schedule")}
              {...a11y("schedule")}
              aria-describedby={
                errors.schedule
                  ? "schedule-zone-hint error-schedule"
                  : "schedule-zone-hint"
              }
            />
            <span id="schedule-zone-hint" className="field-hint">
              Usamos UTC−3 como referencia. Si propones otro horario, indica tu
              zona horaria.
            </span>
            {fieldError("schedule")}
          </label>
          <label className="span-3">
            Descripción <span className="required">*</span>
            <textarea
              rows={5}
              maxLength={1000}
              placeholder="Roles que faltan y otros requisitos. Mínimo 20 caracteres."
              {...register("description")}
              {...a11y("description")}
            />
            <span className="field-hint">
              <span>Texto simple, sin enlaces ni datos personales.</span>
              <span>{description.length}/1000</span>
            </span>
            {fieldError("description")}
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Contacto</legend>
        <label>
          Usuario de Discord <span className="required">*</span>
          <input
            maxLength={33}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Ej. tu.usuario"
            {...register("discordUsername")}
            {...a11y("discordUsername")}
            aria-describedby={
              errors.discordUsername
                ? "discord-username-hint error-discordUsername"
                : "discord-username-hint"
            }
          />
          <span id="discord-username-hint" className="field-hint">
            Tu usuario será público mientras la búsqueda esté abierta.
          </span>
          {fieldError("discordUsername")}
        </label>
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label>
          Deja este campo vacío
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <div className="form-note">
        <p>
          La búsqueda vence en 24 horas. Puedes renovarla desde este navegador.
        </p>
      </div>
      {error && (
        <div className="inline-message error-message" role="alert">
          {error}
        </div>
      )}
      <div className="form-submit">
        <span>
          Al publicar, aceptas las{" "}
          <Link href="/comunidad#reglas">reglas de la comunidad</Link>.
        </span>
        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoaderCircle className="spin" size={18} />}
          {isSubmitting ? "Publicando…" : "Publicar búsqueda"}
        </button>
      </div>
    </form>
  );
}
