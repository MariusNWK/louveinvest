"use server";

import { syncScpiMarketData } from "@utils/syncScpiMarketData";
import { ERROR_OCCURRED } from "my-variables";
import type { TResult } from "my-zod";
import { revalidatePath } from "next/cache";

export async function refreshPrimopierreMarketAction(): Promise<TResult> {
  try {
    await syncScpiMarketData("PRIMOPIERRE");
    revalidatePath("/");
    revalidatePath("/estimation");
    revalidatePath("/purchase");

    return {
      success: "Les données du marché secondaire ont été actualisées avec succès.",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_OCCURRED;

    return {
      error: errorMessage,
    };
  }
}
