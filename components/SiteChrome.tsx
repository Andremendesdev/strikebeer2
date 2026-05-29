"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CartUI } from "@/components/CartUI";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <CartUI />}
    </>
  );
}
