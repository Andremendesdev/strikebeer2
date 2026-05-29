/**
 * DTOs compartilhados entre client e server.
 *
 * Importante: este arquivo NÃO importa `@prisma/client`. Assim os components
 * de UI podem usar os tipos sem arrastar o Prisma para o bundle do browser.
 * Os services no servidor convertem as entidades do Prisma para estes DTOs.
 */

export const ORDER_STATUSES = ["pending", "preparing", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Slug da categoria (ex.: "classico"). */
  category: string;
  categoryId: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

/** Dados aceitos ao criar/editar um produto. */
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  /** Slug da categoria. */
  category: string;
  imageUrl: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/** Item enviado ao criar um pedido. */
export interface OrderItemInput {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

/** Dados aceitos ao criar um pedido. */
export interface CreateOrderInput {
  customerName: string;
  phone: string;
  items: OrderItemInput[];
}
