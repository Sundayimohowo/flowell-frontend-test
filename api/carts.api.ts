import axios from "axios";

import { baseApi } from "@/utils/baseApi";
import { CartType } from "@/interfaces/carts";

export function fetchCartApi(
  id: string
): Promise<{ data: { data: CartType } }> {
  return axios.get(`/cart/users/${id}`, {
    baseURL: `${baseApi.v1}`,
  });
}
