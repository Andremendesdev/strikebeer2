"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BURGER_EXTRAS,
  type CartItem,
  type CustomerInfo,
  getCartTotal,
  getItemCount,
} from "@/lib/cart";
import { isStrikeBeerOpen } from "@/lib/opening-hours";

interface AddProductInput {
  id: string;
  name: string;
  price: number;
  meta?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  customer: CustomerInfo;
  orderConfirmed: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  setCustomer: (field: keyof CustomerInfo, value: string) => void;
  addBurger: (product: AddProductInput) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  toggleExtra: (cartId: string, extraId: string) => void;
  confirmOrder: () => { ok: boolean; message: string };
  clearOrder: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyCustomer: CustomerInfo = { name: "", phone: "", cpf: "" };

function newCartId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomerState] = useState<CustomerInfo>(emptyCustomer);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAddToast = useCallback((productName: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(`${productName} adicionado ao pedido`);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  const itemCount = useMemo(() => getItemCount(items), [items]);
  const total = useMemo(() => getCartTotal(items), [items]);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const setCustomer = useCallback((field: keyof CustomerInfo, value: string) => {
    setCustomerState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addBurger = useCallback((product: AddProductInput) => {
    setItems((prev) => [
      ...prev,
      {
        cartId: newCartId(),
        type: "burger",
        productId: product.id,
        name: product.name,
        basePrice: product.price,
        quantity: 1,
        extras: [],
        meta: product.meta,
      },
    ]);
    showAddToast(product.name);
    setOrderConfirmed(false);
  }, [showAddToast]);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.cartId !== cartId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  }, []);

  const toggleExtra = useCallback((cartId: string, extraId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId || item.type !== "burger") return item;
        const has = item.extras.some((e) => e.id === extraId);
        if (has) {
          return {
            ...item,
            extras: item.extras.filter((e) => e.id !== extraId),
          };
        }
        const extra = BURGER_EXTRAS.find((e) => e.id === extraId);
        if (!extra) return item;
        return { ...item, extras: [...item.extras, extra] };
      })
    );
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setCustomerState(emptyCustomer);
    setOrderConfirmed(false);
  }, []);

  const confirmOrder = useCallback((): { ok: boolean; message: string } => {
    if (!isStrikeBeerOpen()) {
      return { ok: false, message: "Estamos fechado no momento." };
    }
    if (items.length === 0) {
      return { ok: false, message: "Não há nada selecionado." };
    }
    const name = customer.name.trim();
    const phone = customer.phone.trim();
    const cpf = customer.cpf.trim();
    if (!name || !phone || !cpf) {
      return { ok: false, message: "Preencha nome, telefone e CPF para confirmar." };
    }
    setOrderConfirmed(true);
    return { ok: true, message: "Pedido confirmado! Em breve entraremos em contato." };
  }, [items.length, customer]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isOpen,
      customer,
      orderConfirmed,
      openMenu,
      closeMenu,
      setCustomer,
      addBurger,
      removeItem,
      updateQuantity,
      toggleExtra,
      confirmOrder,
      clearOrder,
      toastMessage,
    }),
    [
      items,
      itemCount,
      total,
      isOpen,
      customer,
      orderConfirmed,
      openMenu,
      closeMenu,
      setCustomer,
      addBurger,
      removeItem,
      updateQuantity,
      toggleExtra,
      confirmOrder,
      clearOrder,
      toastMessage,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
