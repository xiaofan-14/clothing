import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 创建分类
  const categories = await prisma.category.createMany({
    data: [
      { name: "T恤", desc: "时尚舒适的T恤" },
      { name: "裤子", desc: "多场景适合的裤子" },
      { name: "鞋子", desc: "潮流运动鞋" },
      { name: "配饰", desc: "时尚小配件" },
    ],
  });

  console.log(`✅ 插入了 ${categories.count} 个分类`);

  // 获取所有分类
  const allCategories = await prisma.category.findMany();

  // 随机函数
  const randomCategory = () =>
    allCategories[Math.floor(Math.random() * allCategories.length)].id;

  // 创建 4 个商品
  const products = await prisma.product.createMany({
    data: [
      {
        name: "基础白T",
        description: "简约百搭白色T恤",
        price: Number((Math.random() * 100).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        image: "/assets/product1.png",
        categoryId: randomCategory(),
      },
      {
        name: "休闲牛仔裤",
        description: "经典直筒牛仔裤",
        price: Number((Math.random() * 200).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        image: "/assets/product2.png",
        categoryId: randomCategory(),
      },
      {
        name: "运动跑鞋",
        description: "轻便透气跑鞋",
        price: Number((Math.random() * 300).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        image: "/assets/product3.png",
        categoryId: randomCategory(),
      },
      {
        name: "黑色棒球帽",
        description: "时尚黑色棒球帽",
        price: Number((Math.random() * 50).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 10,
        image: "/assets/product4.png",
        categoryId: randomCategory(),
      },
    ],
  });

  console.log(`✅ 插入了 ${products.count} 个商品`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
