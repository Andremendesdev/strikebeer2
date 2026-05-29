"use client";

import type { FormEvent } from "react";
import type { Product, ProductInput } from "@/types";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (product: ProductInput) => void;
  onCancel: () => void;
}

export function ProductForm({ editingProduct, onSubmit, onCancel }: ProductFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      name: String(form.get("name") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      price: Number(form.get("price") ?? 0),
      category: String(form.get("category") ?? "classico") as ProductInput["category"],
      imageUrl: String(form.get("imageUrl") ?? "").trim(),
      active: form.get("active") === "on",
    });

    event.currentTarget.reset();
  }

  return (
    <form
      key={editingProduct?.id ?? "new-product"}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            {editingProduct ? "Editar produto" : "Novo produto"}
          </h2>
          <p className="text-sm text-zinc-500">Cadastre burgers e itens do cardapio.</p>
        </div>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Nome</span>
          <input
            name="name"
            required
            defaultValue={editingProduct?.name}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
            placeholder="Strike Smash"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Preço</span>
          <input
            name="price"
            required
            type="number"
            min="0"
            step="0.01"
            defaultValue={editingProduct?.price}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
            placeholder="42.90"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Categoria</span>
          <select
            name="category"
            defaultValue={editingProduct?.category ?? "classico"}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
          >
            <option value="classico">Clássico</option>
            <option value="premium">Premium</option>
            <option value="especial">Especial</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Imagem</span>
          <input
            name="imageUrl"
            type="url"
            defaultValue={editingProduct?.imageUrl}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Descrição</span>
          <textarea
            name="description"
            required
            defaultValue={editingProduct?.description}
            className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50"
            placeholder="Descrição curta do produto"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-zinc-400">
          <input
            name="active"
            type="checkbox"
            defaultChecked={editingProduct?.active ?? true}
            className="h-4 w-4 accent-amber-500"
          />
          Produto ativo no cardápio
        </label>

        <button
          type="submit"
          className="rounded-full bg-[var(--neon)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:scale-[1.02]"
        >
          {editingProduct ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </form>
  );
}
