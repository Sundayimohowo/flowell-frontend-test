"use client";

import { useState } from "react";
import { ZodError, z } from "zod";

import { loginApi } from "@/api/auth.api";
import Toast from "@/components/Toast";
import { LocalStorageKeys, updateStoreItem } from "@/utils/localstorage";
import Link from "next/link";

type LoginFormType = {
  email: string;
  password: string;
};

const userLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().nonempty(),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error" | "info" | "";
  }>({ message: "", type: "" });
  const [form, setForm] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormType>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: any) => {
    setIsLoading(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetErrors = () =>
    setErrors({
      email: "",
      password: "",
    });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      resetErrors();
      // validate login payload
      userLoginSchema.parse(form);

      setIsLoading(true);

      loginApi(form)
        .then((res) => {
          const payload = {
            firstName: res?.data?.data?.user?.firstName,
            lastName: res?.data?.data?.user?.lastName,
            roles: res?.data?.data?.user?.roles,
            email: res?.data?.data?.user?.email,
            id: res?.data?.data?.user?._id,
            token: res?.data?.data?.token,
          };
          updateStoreItem(LocalStorageKeys.AUTH, payload);

          setTimeout(() => {
            // redirect to home page
            window.location.assign("/");

            setToastMessage({
              message: "Login successful",
              type: "success",
            });
          }, 3000);
        })
        .catch((error) => {
          if (error instanceof ZodError) {
            error.errors.forEach((issue) => {
              setErrors({ ...errors, [issue.path[0]]: issue.message });
            });
          }
          setToastMessage({
            message:
              error?.response?.data?.message || "Error occured during login",
            type: "error",
          });
        })
        .finally(() => {
          setIsLoading(false);

          setTimeout(() => {
            setToastMessage({
              message: "",
              type: "",
            });
          }, 5000);
        });
    } catch (error: any) {}
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {/* TOAST */}
      {toastMessage.message && (
        <Toast message={toastMessage.message} type={toastMessage.type} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={handleOnChange}
                className="block w-full rounded-md border-0 p-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors["email"] ? (
                <p className="mt-2 text-red-600 text-sm">
                  {errors["email"] || "Email is required"}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href={"/auth/reset"}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 my-3"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={handleOnChange}
                className="block w-full rounded-md border-0 p-2  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors["password"] ? (
                <p className="mt-2 text-red-600 text-sm">
                  {errors["password"] || "Password is required"}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3p-2  py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Loading..." : "Sign in"}
            </button>
          </div>

          <div className="text-sm my-0.5 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              href={"/auth/signup"}
              className="font-semibold text-indigo-600 hover:text-success-200 underline underline-offset-2"
            >
              Signup instead.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
