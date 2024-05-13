export interface FidAllProductsDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}
