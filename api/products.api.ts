import axios from "axios";

import { baseApi } from "@/utils/baseApi";
import { ProductType } from "@/interfaces/products";
import { IPaginateOptions, IPagination } from "@/interfaces/page.info";

export function fetchProductApi(id: string): Promise<{ data: ProductType }> {
  return axios.get(`/products/${id}`, {
    baseURL: `${baseApi.v1}`,
  });
}

export function fetchProductsApi<T>(
  options: IPaginateOptions<T>
): Promise<{ data: IPagination<ProductType> }> {
  const params = options;
  // attach cursors
  if (options.previousPage)
    Object.assign(params, { previousPage: options.previousPage });
  if (options.nextPage) Object.assign(params, { nextPage: options.nextPage });
  if (options.limit) Object.assign(params, { limit: options.limit });

  return axios.get("/products", {
    baseURL: `${baseApi.v1}`,
    params,
  });
}
