import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories: Prisma.CategoryCreateInput[] = [
  { name: "Clássico", slug: "classico" },
  { name: "Premium", slug: "premium" },
  { name: "Especial", slug: "especial" },
];

const products: Array<{
  name: string;
  description: string;
  price: number;
  categorySlug: string;
  imageUrl: string;
}> = [
  {
    name: "Strike Smash",
    description: "Dois smash burgers, queijo americano, pickles e molho especial da casa.",
    price: 42.9,
    categorySlug: "classico",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Rock'n Bacon",
    description: "Blend de costela, bacon crocante, cheddar e aioli de alho negro.",
    price: 48.9,
    categorySlug: "premium",
    imageUrl:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=85&auto=format&fit=crop",
  },
  {
    name: "Neon Crispy",
    description: "Frango crispy, jalapenos, coleslaw cremoso e ranch defumado.",
    price: 38.9,
    categorySlug: "especial",
    imageUrl:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=85&auto=format&fit=crop",
  },
];

async function main() {
  // 1) Admin
  const email = process.env.ADMIN_EMAIL ?? "admin@strikebeer.com";
  const password = process.env.ADMIN_PASSWORD ?? "strikebeer123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: passwordHash, name: "Admin Strike", role: "ADMIN" },
  });
  console.log(`✓ Admin garantido: ${email}`);

  // 2) Categorias
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`✓ ${categories.length} categorias`);

  // 3) Produtos
  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      active: true,
      categoryId,
    };

    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
    } else {
      await prisma.product.create({ data });
    }
  }
  console.log(`✓ ${products.length} produtos`);

  // 4) Pedido de exemplo
  const smash = await prisma.product.findFirst({ where: { name: "Strike Smash" } });
  if (smash) {
    const hasOrders = await prisma.order.count();
    if (hasOrders === 0) {
      await prisma.order.create({
        data: {
          customerName: "Rafael Martins",
          phone: "(11) 98888-1010",
          status: "delivered",
          total: Number(smash.price) * 2,
          items: {
            create: [
              {
                productId: smash.id,
                name: smash.name,
                quantity: 2,
                price: Number(smash.price),
              },
            ],
          },
        },
      });
      console.log("✓ Pedido de exemplo criado");
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
