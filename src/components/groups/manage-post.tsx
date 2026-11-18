"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock3,
  Flag,
  LoaderCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  managePostAction,
  reportPostAction,
  type ActionResult,
} from "@/features/groups/actions";
import type { PostStatus } from "@/features/groups/catalog";
import { canTransition } from "@/features/groups/logic";
export function ManagePost({ id, status }: { id: string; status: PostStatus }) {
  const [result, setResult] = useState<ActionResult>({});
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function manage(action: "renew" | "full" | "finish") {
    startTransition(async () => {
      try {
        setResult(await managePostAction(id, action));
        router.refresh();
      } catch {
        setResult({ error: "No pudimos actualizar. Intenta de nuevo." });
      }
    });
  }
  return (
    <section className="owner-panel">
      <h3>
        <ShieldIcon />
        Administrar búsqueda
      </h3>
      <p>Disponible desde el navegador donde publicaste.</p>
      <div className="owner-actions">
        {canTransition(status, "renew") && (
          <button
            className="button button-outline button-sm"
            disabled={pending}
            onClick={() => manage("renew")}
          >
            <RefreshCw size={14} />
            Renovar 24 h
          </button>
        )}
        {canTransition(status, "full") && (
          <button
            className="button button-outline button-sm"
            disabled={pending}
            onClick={() => manage("full")}
          >
            <Users size={14} />
            Grupo completo
          </button>
        )}
        {canTransition(status, "finish") && (
          <button
            className="button button-outline button-sm"
            disabled={pending}
            onClick={() => manage("finish")}
          >
            <Check size={14} />
            Finalizar
          </button>
        )}
      </div>
      {pending && <p role="status">Guardando…</p>}
      {result.error && (
        <p className="field-error" role="alert">
          {result.error}
        </p>
      )}
      {result.success && (
        <p className="success-text" role="status">
          {result.success}
        </p>
      )}
    </section>
  );
}
function ShieldIcon() {
  return <Clock3 size={16} />;
}
export function ReportPost({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [result, setResult] = useState<ActionResult>({});
  const [pending, startTransition] = useTransition();
  return (
    <div className="report-box">
      <button
        type="button"
        className="report-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <Flag size={14} />
        Reportar publicación
      </button>
      {open && (
        <form
          className="report-form"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              try {
                setResult(await reportPostAction(id, reason));
              } catch {
                setResult({
                  error: "No pudimos enviar el reporte. Volvé a intentar.",
                });
              }
            });
          }}
        >
          <label>
            ¿Qué pasó?
            <textarea
              required
              minLength={10}
              maxLength={500}
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contanos el motivo, sin incluir datos personales."
            />
          </label>
          <button
            type="submit"
            className="button button-outline button-sm"
            disabled={pending || !!result.success}
          >
            {pending ? (
              <LoaderCircle size={14} className="spin" />
            ) : (
              <Flag size={14} />
            )}
            Enviar reporte
          </button>
          {result.error && (
            <p className="field-error" role="alert">
              {result.error}
            </p>
          )}
          {result.success && (
            <p className="success-text" role="status">
              {result.success}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
