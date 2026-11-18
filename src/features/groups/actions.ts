"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createGroup, manageGroup, reportGroup } from "@/server/groups";
import { actorHash, ownerToken, saveOwnerToken } from "@/server/visitor";
import { UserError } from "@/server/security";

export type ActionResult = { error?: string; success?: string };
function actionError(error: unknown): ActionResult {
  if (error instanceof UserError) return { error: error.message };
  if (error instanceof ZodError)
    return {
      error: error.issues[0]?.message || "Revisa los datos ingresados.",
    };
  console.error(
    "Group operation failed:",
    error instanceof Error ? error.name : "Unknown error",
  );
  return {
    error: "No pudimos guardar los cambios. Intenta de nuevo en unos minutos.",
  };
}
export async function createPostAction(input: unknown): Promise<ActionResult> {
  let id: string;
  try {
    const { post, token } = await createGroup(input, await actorHash());
    await saveOwnerToken(post.id, token);
    id = post.id;
  } catch (error) {
    return actionError(error);
  }
  revalidatePath("/", "layout");
  redirect(`/grupos/${id}?publicado=1`);
}
export async function managePostAction(
  id: string,
  action: "renew" | "full" | "finish",
): Promise<ActionResult> {
  try {
    await manageGroup(
      id,
      (await ownerToken(id)) || "",
      action,
      await actorHash(),
    );
    revalidatePath("/", "layout");
    return {
      success:
        action === "renew"
          ? "Búsqueda renovada por 24 horas."
          : "Estado actualizado.",
    };
  } catch (error) {
    return actionError(error);
  }
}
export async function reportPostAction(
  id: string,
  reason: string,
): Promise<ActionResult> {
  try {
    await reportGroup({ id, reason }, await actorHash());
    return { success: "Reporte recibido. Gracias por cuidar la comunidad." };
  } catch (error) {
    return actionError(error);
  }
}
