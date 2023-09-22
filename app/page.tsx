"use client";

import { useState, useEffect } from "react";

import { fetchProductsApi } from "@/api/products.api";
import { IPagination } from "@/interfaces/page.info";
import { ProductType } from "@/interfaces/products";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
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

  const handleShowCartBtn = (id: string) => {
    setShowAddToCart(true);
    setCurrentProductId(id);
  };

  const handleHideCartBtn = (id: string) => {
    setShowAddToCart(false);
    setCurrentProductId("");
  };

  const handleAddToCart = (id: string) => {
    // TODO: add to cart
    console.log("🚀 ~ file: page.tsx:25 ~ handleAddToCart ~ id:", id);
  };

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
      <div
        role="list"
        className="flex gap-4 flex-wrap pb-10 justify-center md:justify-start"
      >
        {products.data.map((product) => (
          <div
            className={`product_wrapper w-[300px] h-max-[440px] bg-[#fcfcfc] rounded-md ${
              showAddToCart && product._id === currentProductId
                ? "shadow-xl rounded-b-lg"
                : ""
            }`}
            key={product._id}
            role="listitem"
            // onMouseOver={() => console.log("Mouse over\t", product._id)}
            // onMouseLeave={() => console.log("Mouse leave\t", product._id)}
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

                <div className="h-10 bg-white mt-3 p-2">
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
