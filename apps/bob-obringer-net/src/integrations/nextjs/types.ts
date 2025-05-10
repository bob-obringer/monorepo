import { ReactNode } from "react";

export type NextPageProps<
  P extends Record<string, unknown>,
  Q extends Record<string, string> | undefined = undefined,
> = {
  params: Promise<P>;
  searchParams: Promise<Partial<Q>>;
};

export type NextLayoutProps<P extends Record<string, unknown>> = {
  children: ReactNode;
  params: Promise<P>;
};
