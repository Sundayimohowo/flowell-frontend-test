"use client";

import { signUpApi } from "@/api/auth.api";
import Toast from "@/components/Toast";
import Link from "next/link";
import { useState } from "react";
import { ZodError, z } from "zod";

type SignUpFormType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const userSignupSchema = z
  .object({
    confirmPassword: z.string().nonempty(),
    email: z.string().email("Invalid email"),
    firstName: z.string().nonempty("Firstname is required"),
    lastName: z.string().nonempty("Last name is required"),
    password: z
      .string()
      .nonempty()
      .min(8, "Password must be atleast 8 character(s)"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function SignUp() {
  const [submitting, setSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<{
    message: string;
    type: "success" | "error" | "info" | "";
  }>({ message: "", type: "" });
  const [form, setForm] = useState<SignUpFormType>({
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignUpFormType>({
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleOnChange = (e: any) => {
    setSubmitting(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetErrors = () =>
    setErrors({
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    resetErrors();

    try {
      // validate payload
      setSubmitting(true);
      userSignupSchema.parse(form);

      //   make api call
      const { confirmPassword, ...payload } = form;

      signUpApi({ ...payload, roles: [] })
        .catch((err) => {
          setSignupError({
            message:
              err?.response?.data?.message || "Error occured during signup",
            type: "error",
          });
        })
        .finally(() => {
          setSubmitting(false);

          setTimeout(() => {
            setSignupError({
              message: "",
              type: "",
            });
          }, 3000);
        });
    } catch (error: any) {
      if (error instanceof ZodError) {
        error.errors.forEach((issue) => {
          setErrors({ ...errors, [issue.path[0]]: issue.message });
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-10 lg:px-8">
      {/* TOAST */}
      {signupError.message && (
        <Toast message={signupError.message} type={signupError.type} />
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Join the leading e-commerce platform
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="firstName"
                  id="first-name"
                  autoComplete="given-name"
                  onChange={handleOnChange}
                  className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />

                {errors["firstName"] ? (
                  <p className="mt-2 text-red-600 text-sm">
                    Firstname is required
                  </p>
                ) : null}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="lastName"
                  id="last-name"
                  autoComplete="family-name"
                  onChange={handleOnChange}
                  className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors["lastName"] ? (
                  <p className="mt-2 text-red-600 text-sm">
                    Lastname is required
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                required
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={handleOnChange}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            </div>
            <div className="mt-2">
              <input
                required
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={handleOnChange}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors["password"] ? (
                <p className="mt-2 text-red-600 text-sm">
                  {errors["password"] || "Password is required"}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                required
                id="confirm-password"
                name="confirmPassword"
                type="password"
                onChange={handleOnChange}
                className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors["confirmPassword"] ? (
                <p className="mt-2 text-red-600 text-sm">
                  {errors["confirmPassword"] || "Password must be a match"}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="text-sm my-0.5 text-center text-gray-600">
            Have an account already?{" "}
            <Link
              href={"/auth/login"}
              className="font-semibold text-indigo-600 hover:text-success-200 underline underline-offset-2"
            >
              Signin instead.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
