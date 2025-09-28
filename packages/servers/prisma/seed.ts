import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 创建分类
  const categories = await prisma.category.createMany({
    data: [
      { name: "Dress", desc: "优雅多样的连衣裙，适合日常与正式场合" },
      { name: "T-Shirt", desc: "时尚舒适的 T 恤，轻松百搭" },
      { name: "Jeans", desc: "经典耐穿的牛仔裤，适合多种场景" },
    ],
  });

  console.log(`✅ 插入了 ${categories.count} 个分类`);

  // 获取所有分类
  const allCategories = await prisma.category.findMany();

  // 随机函数
  const randomCategory = () =>
    allCategories[Math.floor(Math.random() * allCategories.length)].id;

  // 创建 n 个商品
  type ProductType = {
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string
    categoryId: string,
  }

  const products = await prisma.product.createMany({
    data: [
      // Dress
      {
        name: "夏日碎花连衣裙",
        description: "轻盈面料，清爽透气，适合夏日出行",
        price: 199,
        stock: 50,
        image: "/assets/product1.png",
        categoryId: allCategories.find(c => c.name === "Dress")!.id,
      },
      {
        name: "优雅黑色晚礼裙",
        description: "简约剪裁，适合正式聚会和晚宴",
        price: 499,
        stock: 20,
        image: "/assets/product3.png",
        categoryId: allCategories.find(c => c.name === "Dress")!.id,
      },
      {
        name: "复古牛仔吊带裙",
        description: "复古风格，个性百搭",
        price: 289,
        stock: 35,
        image: "/assets/product2.png",
        categoryId: allCategories.find(c => c.name === "Dress")!.id,
      },

      // T-Shirt
      {
        name: "基础纯白 T 恤",
        description: "简洁大方，百搭必备",
        price: 79,
        stock: 100,
        image: "/assets/product1.png",
        categoryId: allCategories.find(c => c.name === "T-Shirt")!.id,
      },
      {
        name: "印花短袖 T 恤",
        description: "潮流印花，展现个性",
        price: 129,
        stock: 60,
        image: "/assets/product4.png",
        categoryId: allCategories.find(c => c.name === "T-Shirt")!.id,
      },
      {
        name: "oversize 宽松 T 恤",
        description: "街头风格，舒适透气",
        price: 159,
        stock: 40,
        image: "/assets/product1.png",
        categoryId: allCategories.find(c => c.name === "T-Shirt")!.id,
      },

      // Jeans
      {
        name: "修身蓝色牛仔裤",
        description: "经典蓝色，修身显瘦",
        price: 259,
        stock: 70,
        image: "/assets/product2.png",
        categoryId: allCategories.find(c => c.name === "Jeans")!.id,
      },
      {
        name: "破洞休闲牛仔裤",
        description: "街头风格，随性时尚",
        price: 299,
        stock: 45,
        image: "/assets/product3.png",
        categoryId: allCategories.find(c => c.name === "Jeans")!.id,
      },
      {
        name: "高腰直筒牛仔裤",
        description: "舒适直筒版型，适合日常穿搭",
        price: 279,
        stock: 55,
        image: "/assets/product4.png",
        categoryId: allCategories.find(c => c.name === "Jeans")!.id,
      },
    ] as ProductType[],
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
