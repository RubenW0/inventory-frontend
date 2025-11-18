export type ProductType = "PavingStones" | "Boulders" | "Tiles" | "GravelAndChippings";

export const ProductTypeDisplay: Record<ProductType, string> = {
  PavingStones: "Paving stones & bricks (€/m²)",
  Boulders: "Boulders (€/ton)",
  Tiles: "Tiles (€/m²)",
  GravelAndChippings: "Gravel & chippings (€/m³)",
};

export const ProductUnit: Record<ProductType, string> = {
  PavingStones: "m²",
  Boulders: "ton",
  Tiles: "m²",
  GravelAndChippings: "m³",
};

export interface Product {
  id: number;
  name: string;
  type: ProductType;
  stock_quantity: number;
  min_stock: number;
  advised_price: number;
  total_value: number;
  location: string;
  status: string;
}
