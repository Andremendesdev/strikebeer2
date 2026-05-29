"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductTableSkeleton } from "@/components/admin/AdminSkeleton";

const PAGE_SIZE = 5;

const CATEGORIES = [
  { value: "", label: "Todas" },
  { value: "classico", label: "Clássico" },
  { value: "premium", label: "Premium" },
  { value: "especial", label: "Especial" },
];

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* debounce search input by 300 ms */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  /* reset page when filter changes */
  useEffect(() => { setPage(1); }, [category]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch) ||
        p.description.toLowerCase().includes(debouncedSearch);
      const matchCat = !category || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, debouncedSearch, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            Produtos
          </h2>
          <p className="text-sm text-zinc-500">
            {filtered.length} de {products.length} itens
          </p>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-2">
          {/* search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto…"
              className="h-9 rounded-xl border border-white/10 bg-black/30 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-amber-500/40 w-44"
            />
          </div>

          {/* category pills */}
          <div className="flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`h-9 rounded-xl px-3 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  category === cat.value
                    ? "bg-[var(--neon)] text-black"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* table */}
      {loading ? (
        <ProductTableSkeleton />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* column header */}
          <div className="hidden grid-cols-[1.6fr_0.8fr_0.7fr_auto] gap-4 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 md:grid">
            <span>Produto</span>
            <span>Categoria</span>
            <span>Preço</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-white/10">
            {paginated.map((product) => (
              <article
                key={product.id}
                className="grid items-center gap-4 px-4 py-3 transition hover:bg-white/[0.02] md:grid-cols-[1.6fr_0.8fr_0.7fr_auto]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-white">{product.name}</h3>
                      {!product.active && (
                        <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-zinc-500">{product.description}</p>
                  </div>
                </div>

                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-300">
                  {product.category}
                </span>

                <span className="font-bold text-[var(--neon)]">
                  {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-white"
                    aria-label={`Editar ${product.name}`}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-200"
                    aria-label={`Deletar ${product.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}

            {paginated.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-zinc-500">
                Nenhum produto encontrado.
              </p>
            )}
          </div>
        </div>
      )}

      {/* pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-zinc-500">
            Página {safePage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                  n === safePage
                    ? "bg-[var(--neon)] text-black"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
