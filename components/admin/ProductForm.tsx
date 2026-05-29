"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import type { Product, ProductInput } from "@/types";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (product: ProductInput) => void;
  onCancel: () => void;
}

type UploadedFile = {
  url?: string;
  ufsUrl?: string;
  serverData?: {
    imageUrl?: string;
  };
};

function getUploadedImageUrl(file?: UploadedFile) {
  return file?.serverData?.imageUrl ?? file?.ufsUrl ?? file?.url ?? "";
}

export function ProductForm({ editingProduct, onSubmit, onCancel }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(editingProduct?.imageUrl ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(editingProduct?.imageUrl ?? "");
    setUploadError(null);
  }, [editingProduct]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      name: String(form.get("name") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      price: Number(form.get("price") ?? 0),
      category: String(form.get("category") ?? "classico") as ProductInput["category"],
      imageUrl,
      active: form.get("active") === "on",
    });

    event.currentTarget.reset();
    setImageUrl("");
    setUploadError(null);
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

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Imagem</span>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="relative mb-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Prévia do produto" fill sizes="320px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/70 p-2 text-white transition hover:bg-red-500/80"
                    aria-label="Remover imagem"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-zinc-600">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Sem imagem</span>
                </div>
              )}
            </div>

            <UploadButton
              endpoint="productImage"
              onClientUploadComplete={(files) => {
                const uploadedUrl = getUploadedImageUrl(files[0] as UploadedFile);
                if (uploadedUrl) {
                  setImageUrl(uploadedUrl);
                  setUploadError(null);
                }
              }}
              onUploadError={(error: Error) => {
                setUploadError(error.message || "Erro ao enviar imagem.");
              }}
              appearance={{
                container: "w-full",
                button:
                  "w-full rounded-xl bg-[var(--neon)] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:scale-[1.01] ut-readying:bg-zinc-700 ut-uploading:bg-amber-400",
                allowedContent: "mt-2 text-center text-[11px] text-zinc-600",
              }}
              content={{
                button: "Enviar imagem",
                allowedContent: "PNG, JPG ou WEBP até 4MB",
              }}
            />

            {uploadError && <p className="mt-2 text-xs text-red-300">{uploadError}</p>}
          </div>
        </div>

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
