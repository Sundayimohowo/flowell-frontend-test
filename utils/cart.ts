import { CartType } from "@/interfaces/carts";
import {
  LocalStorageKeys,
  retrieveStoreItem,
  updateStoreItem,
} from "./localstorage";

export const addProductToCart = (productId: string, user: string) => {
  const cart = retrieveStoreItem<CartType>(LocalStorageKeys.CART) ?? {
    user: user,
    items: [],
    total: 0,
  };

  cart.items.push(productId);

  updateStoreItem(LocalStorageKeys.CART, JSON.stringify(cart));
};
