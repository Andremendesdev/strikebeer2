export type CartItemType = "burger" | "beer";

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartId: string;
  type: CartItemType;
  productId: number;
  name: string;
  basePrice: number;
  quantity: number;
  extras: CartExtra[];
  meta?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  cpf: string;
}

export const BURGER_EXTRAS: CartExtra[] = [
  { id: "cheddar", name: "Cheddar extra", price: 4.5 },
  { id: "bacon", name: "Bacon extra", price: 6 },
  { id: "egg", name: "Ovo", price: 3 },
  { id: "onion", name: "Cebola caramelizada", price: 3.5 },
  { id: "pickles", name: "Pickles", price: 2.5 },
];

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function getLineTotal(item: CartItem): number {
  const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
  return (item.basePrice + extrasTotal) * item.quantity;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getLineTotal(item), 0);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
