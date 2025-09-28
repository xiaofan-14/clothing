import type { Product } from "@clothing/servers/type"

export type ProductExt = Product & {
  category: {
    id: string,
    name: string
  }
  isFavorite?: boolean
}
