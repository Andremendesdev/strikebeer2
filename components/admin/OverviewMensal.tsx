"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Minus,
  Receipt,
  ShoppingBag,
  Sun,
  Wallet,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrderStatus } from "@/types";

const BRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Soma o total dos pedidos cujo status está em `statuses` e passam no filtro de data. */
function sumOrders(
  orders: Order[],
  statuses: Set<OrderStatus>,
  predicate: (date: Date) => boolean
) {
  return orders.reduce((sum, order) => {
    if (!statuses.has(order.status)) return sum;
    return predicate(new Date(order.createdAt)) ? sum + order.total : sum;
  }, 0);
}

function countOrders(
  orders: Order[],
  statuses: Set<OrderStatus>,
  predicate: (date: Date) => boolean
) {
  return orders.reduce((count, order) => {
    if (!statuses.has(order.status)) return count;
    return predicate(new Date(order.createdAt)) ? count + 1 : count;
  }, 0);
}

type StatusFilter = "delivered" | "all";

const FILTER_STATUSES: Record<StatusFilter, Set<OrderStatus>> = {
  delivered: new Set<OrderStatus>(["delivered"]),
  all: new Set<OrderStatus>(["pending", "preparing", "delivered"]),
};

/** Variação percentual de `current` em relação a `previous`. */
function variation(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return { pct: 0, direction: "flat" as const };
    return { pct: 100, direction: "up" as const };
  }
  const pct = ((current - previous) / previous) * 100;
  return {
    pct: Math.abs(pct),
    direction: pct > 0 ? ("up" as const) : pct < 0 ? ("down" as const) : ("flat" as const),
  };
}

type Direction = "up" | "down" | "flat";

function TrendBadge({ direction, pct, label }: { direction: Direction; pct: number; label: string }) {
  const config = {
    up: {
      className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
      Icon: ArrowUpRight,
    },
    down: {
      className: "border-red-400/30 bg-red-500/10 text-red-300",
      Icon: ArrowDownRight,
    },
    flat: {
      className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
      Icon: Minus,
    },
  }[direction];
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% {label}
    </span>
  );
}

export function OverviewMensal() {
  const { orders, loading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("delivered");

  const metrics = useMemo(() => {
    const statuses = FILTER_STATUSES[statusFilter];
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const today = sumOrders(orders, statuses, (d) => isSameDay(d, now));
    const yesterdayTotal = sumOrders(orders, statuses, (d) => isSameDay(d, yesterday));
    const month = sumOrders(orders, statuses, (d) => isSameMonth(d, now));
    const lastMonth = sumOrders(orders, statuses, (d) => isSameMonth(d, lastMonthRef));
    const monthCount = countOrders(orders, statuses, (d) => isSameMonth(d, now));

    const todayCount = countOrders(orders, statuses, (d) => isSameDay(d, now));
    const yesterdayCount = countOrders(orders, statuses, (d) => isSameDay(d, yesterday));

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const ref = new Date(now);
      ref.setDate(now.getDate() - (6 - i));
      return {
        label: WEEKDAYS[ref.getDay()],
        isToday: isSameDay(ref, now),
        total: sumOrders(orders, statuses, (d) => isSameDay(d, ref)),
      };
    });
    const maxDay = Math.max(...last7Days.map((d) => d.total), 1);

    return {
      today,
      yesterdayTotal,
      month,
      lastMonth,
      monthTicket: monthCount > 0 ? month / monthCount : 0,
      monthCount,
      todayCount,
      yesterdayCount,
      vsYesterday: variation(today, yesterdayTotal),
      vsLastMonth: variation(month, lastMonth),
      vsYesterdayCount: variation(todayCount, yesterdayCount),
      last7Days,
      maxDay,
    };
  }, [orders, statusFilter]);

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 md:p-6">
        <div className="h-5 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
          ))}
        </div>
      </section>
    );
  }

  const monthName = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--neon)]">
            Visão financeira
          </p>
          <h2
            className="mt-1 text-3xl uppercase leading-none text-white md:text-4xl"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Overview Mensal
          </h2>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {monthName}
          </span>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1">
          {([
            { id: "delivered", label: "Entregues" },
            { id: "all", label: "Todos" },
          ] as const).map((option) => {
            const active = statusFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  active
                    ? "bg-[var(--neon)] text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {/* Ganho hoje */}
        <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Ganho hoje
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon)] text-black">
              <Sun className="h-5 w-5" />
            </span>
          </div>
          <strong
            className="block text-4xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {BRL(metrics.today)}
          </strong>
          <div className="mt-3">
            <TrendBadge
              direction={metrics.vsYesterday.direction}
              pct={metrics.vsYesterday.pct}
              label="vs ontem"
            />
          </div>
        </article>

        {/* Pedidos hoje */}
        <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Pedidos hoje
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>
          <strong
            className="block text-4xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {metrics.todayCount}
          </strong>
          <div className="mt-3">
            <TrendBadge
              direction={metrics.vsYesterdayCount.direction}
              pct={metrics.vsYesterdayCount.pct}
              label={`vs ${metrics.yesterdayCount} ontem`}
            />
          </div>
        </article>

        {/* Ontem */}
        <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Ontem
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <CalendarDays className="h-5 w-5" />
            </span>
          </div>
          <strong
            className="block text-4xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {BRL(metrics.yesterdayTotal)}
          </strong>
          <p className="mt-3 text-sm text-zinc-500">Faturamento do dia anterior</p>
        </article>

        {/* Lucro mensal */}
        <article className="rounded-3xl border border-[var(--neon)]/20 bg-[var(--neon)]/[0.06] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Lucro mensal
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon)] text-black">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
          <strong
            className="block text-4xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {BRL(metrics.month)}
          </strong>
          <div className="mt-3">
            <TrendBadge
              direction={metrics.vsLastMonth.direction}
              pct={metrics.vsLastMonth.pct}
              label="vs mês passado"
            />
          </div>
        </article>

        {/* Ticket médio */}
        <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Ticket médio
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Receipt className="h-5 w-5" />
            </span>
          </div>
          <strong
            className="block text-4xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {BRL(metrics.monthTicket)}
          </strong>
          <p className="mt-3 text-sm text-zinc-500">
            {metrics.monthCount}{" "}
            {statusFilter === "delivered"
              ? metrics.monthCount === 1
                ? "pedido entregue"
                : "pedidos entregues"
              : metrics.monthCount === 1
                ? "pedido no total"
                : "pedidos no total"}{" "}
            no mês
          </p>
        </article>
      </div>

      {/* Mini gráfico últimos 7 dias */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Últimos 7 dias
          </span>
          <span className="text-xs text-zinc-600">
            {statusFilter === "delivered" ? "Receita entregue por dia" : "Receita total por dia"}
          </span>
        </div>
        <div className="flex h-40 items-end justify-between gap-2 sm:gap-3">
          {metrics.last7Days.map((day, index) => {
            const heightPct = Math.round((day.total / metrics.maxDay) * 100);
            return (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-500">
                  {day.total > 0 ? BRL(day.total).replace("R$", "").trim() : "—"}
                </span>
                <div className="flex h-28 w-full items-end overflow-hidden rounded-xl bg-white/[0.04]">
                  <div
                    className={`w-full rounded-xl transition-all ${
                      day.isToday ? "bg-[var(--neon)]" : "bg-white/20"
                    }`}
                    style={{ height: `${Math.max(heightPct, day.total > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.08em] ${
                    day.isToday ? "text-[var(--neon)]" : "text-zinc-500"
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
