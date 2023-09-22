"use client";

import { useState, useEffect } from "react";

import { fetchProductsApi } from "@/api/products.api";
import { IPagination } from "@/interfaces/page.info";
import { ProductType } from "@/interfaces/products";

export default function Home() {
  const [uniqueProducts] = useState<Record<string, ProductType>>({});
  const [pageOptions, setPageOptions] = useState<{
    previousPage: string;
    nextPage: string;
  }>({ nextPage: "", previousPage: "" });

  const [products, setProducts] = useState<IPagination<ProductType>>({
    data: [],
    pageInfo: { hasNext: false, hasPrevious: false, next: "", previous: "" },
  });

  useEffect(() => {
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
      });
  }, [pageOptions]);

  return <main>Hello Site</main>;
}
