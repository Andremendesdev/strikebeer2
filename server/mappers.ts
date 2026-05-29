import type {
  Category as PrismaCategory,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Product as PrismaProduct,
} from "@prisma/client";
import type { Category, Order, OrderItem, Product } from "@/types";

type ProductWithCategory = PrismaProduct & { category: PrismaCategory };
type OrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

export function toCategoryDTO(category: PrismaCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export function toProductDTO(product: ProductWithCategory): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category.slug,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl ?? "",
    active: product.active,
    createdAt: product.createdAt.toISOString(),
  };
}

export function toOrderItemDTO(item: PrismaOrderItem): OrderItem {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: Number(item.price),
  };
}

export function toOrderDTO(order: OrderWithItems): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    items: order.items.map(toOrderItemDTO),
    total: Number(order.total),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
}
