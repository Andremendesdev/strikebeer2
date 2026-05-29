"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import type { CreateOrderInput, Order, OrderStatus } from "@/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await apiGet<Order[]>("/api/orders"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const updated = await apiSend<Order>(`/api/orders/${id}`, "PATCH", { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  const createOrder = useCallback(async (input: CreateOrderInput) => {
    const created = await apiSend<Order>("/api/orders", "POST", input);
    setOrders((prev) => [created, ...prev]);
    return created;
  }, []);

  return { orders, loading, error, refresh, updateStatus, createOrder };
}
