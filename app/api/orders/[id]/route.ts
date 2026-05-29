import { NextRequest } from "next/server";
import { orderService } from "@/server/services/order.service";
import { guardAdmin, handle, jsonError } from "@/server/http";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { id } = await params;

  let body: { status?: OrderStatus };
  try {
    body = (await request.json()) as { status?: OrderStatus };
  } catch {
    return jsonError("Corpo da requisição inválido.");
  }

  if (!body.status || !ORDER_STATUSES.includes(body.status)) {
    return jsonError("Status inválido.");
  }

  return handle(() => orderService.updateStatus(id, body.status as OrderStatus));
}
