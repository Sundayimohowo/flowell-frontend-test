"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { fetchProductsApi } from "@/api/products.api";
import { IPagination } from "@/interfaces/page.info";
import { ProductType } from "@/interfaces/products";
import { addProductToCart } from "@/utils/cart";
import {
  LocalStorageKeys,
  retrieveStoreItem,
  updateStoreItem,
} from "@/utils/localstorage";
import { UserType } from "@/interfaces/user";
import { fetchCartApi } from "@/api/carts.api";
import { CartType } from "@/interfaces/carts";

export default function Home() {
  let searchResponseCount = 0;

  const [loading, setLoading] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProductId, setCurrentProductId] = useState("");
  const [uniqueProducts] = useState<Record<string, ProductType>>({});
  const [pageOptions, setPageOptions] = useState<{
    previousPage: string;
    nextPage: string;
  }>({ nextPage: "", previousPage: "" });

  const [products, setProducts] = useState<IPagination<ProductType>>({
    data: [],
    pageInfo: { hasNext: false, hasPrevious: false, next: "", previous: "" },
  });

  const authUser = retrieveStoreItem<UserType>(LocalStorageKeys.AUTH);

  const handleShowCartBtn = (id: string) => {
    setShowAddToCart(true);
    setCurrentProductId(id);
  };

  const handleHideCartBtn = (id: string) => {
    setShowAddToCart(false);
    setCurrentProductId("");
  };

  const handleAddToCart = (id: string) => {
    // add to cart
    if (authUser?.id) {
      addProductToCart(id, authUser?.id!);
    } else {
      // TODO: redirect to login page
      window.location.assign("/auth/login");
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const searchProductHandler = (product: ProductType) => {
    const query = searchQuery.toLowerCase();
    const hasName = product.name.toLowerCase().includes(query);
    const hasId = product._id === searchQuery;
    const hasDesc = product.description.toLowerCase().includes(query);
    const isPrice = product.price === +searchQuery;

    //
    if (hasName || hasDesc || hasId || isPrice) {
      searchResponseCount++;
      return true;
    }
    return false;
  };

  useEffect(() => {
    // const cart = retrieveStoreItem<CartType>(LocalStorageKeys.CART);
    if (authUser?.id /* && !cart*/) {
      // user is authenticated
      fetchCartApi(authUser?.id)
        .then((res: { data: { data: CartType } } & { status?: number }) => {
          if (res?.status === 200) {
            // initialize cart
            // Get Cart from backend and initialize on login
            const cart = {
              user: res?.data?.data.user,
              items: res?.data?.data.items,
              total: res?.data?.data.total,
            };

            updateStoreItem(LocalStorageKeys.CART, cart);
          }
        })
        .catch((error) => {
          console.log("🚀 ~ file: page.tsx:78 ~ .Cart ~ error:", error);
        });
    }
  }, [authUser]);

  useEffect(() => {
    // TODO: search the database if not found in the already fetched data
    if (!searchResponseCount && searchQuery) {
      // TODO: Make search API call
      console.log("Nothing was found!");
    }
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    fetchProductsApi(pageOptions)
      .then((res: { data: IPagination<ProductType>; status?: number }) => {
        if (res?.status === 200) {
          // prevent product duplications
          const _products = res.data.data.filter((product) => {
            if (!uniqueProducts[product._id]) {
              uniqueProducts[product._id] = product;
              return product._id;
            } else return false;
          });
          const _pageInfo = res.data.pageInfo;

          // update product list
          setProducts((prev) => ({
            data: [...prev?.data, ..._products],
            pageInfo: { ...prev?.pageInfo, ..._pageInfo },
          }));
        }
      })
      .catch((error) => {
        console.log("🚀 ~ file: page.tsx:12 ~ .then ~ res:", error);
      })
      .finally(() => setLoading(false));
  }, [pageOptions]);

  return (
    <main>
      <div className="w-full h-25 bg-white px-5">
        <form className="search_form bg-white px-4 flex gap-4 justify-center align-center my-4 mt-7 w-full md:w-[400px] mx-auto shadow-sm ring-1 ring-inset ring-gray-300 py-2 px-2 rounded-full">
          <label
            htmlFor="search"
            className="grid align-center text-sm h-[24px] my-auto font-medium leading-6 text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[24px] h-[24px] grid"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </label>

          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search products..."
            onChange={handleSearchChange}
            className="block w-full rounded-md border-none p-2 outline-none focus:ring-white sm:leading-3  md:leading-3  py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </form>
      </div>
      <div
        role="list"
        className="flex gap-4 flex-wrap pb-10 pt-1 justify-center md:justify-start"
      >
        {products.data.filter(searchProductHandler).map((product) => (
          <div
            className={`product_wrapper w-[300px] h-max-[440px] bg-[#fcfcfc] rounded-md ${
              showAddToCart && product._id === currentProductId
                ? "shadow-xl rounded-b-lg"
                : ""
            }`}
            key={product._id}
            role="listitem"
            onMouseOver={() => handleShowCartBtn(product._id)}
            onMouseLeave={() => handleHideCartBtn(product._id)}
          >
            <div className="p-3">
              {/* Product Image */}
              <div className="relative h-max-80 h-60 bg-gray-50 rounded-md">
                <Image
                  src="https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
                  layout="fill"
                  alt={`${product.name}'s image`}
                  className="rounded-md"
                />
              </div>

              {/* Product Information */}
              <div className="px-2 my-2">
                <h3 className="text-black text-md font-semibold">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 w-full text-ellipsis overflow-hidden h-5">
                  {product.description}
                </p>

                <div className="prices bg-gray-50 p-3 w-full mx-auto mt-4">
                  <span className="p-1 bg-purple-400 rounded-sm mr-4 font-bold py-2 px-4">
                    #{product.price}
                  </span>
                  <s className="p-1 text-orange-600 rounded-sm font-bold">
                    #{product.price}
                  </s>
                </div>

                <div className="h-12 mt-3 p-2">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className={`btn bg-green-500 text-white py-2 px-4 font-md w-full font-extrabold rounded-lg border-none ${
                      showAddToCart && product._id === currentProductId
                        ? ""
                        : "sm:hidden"
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
