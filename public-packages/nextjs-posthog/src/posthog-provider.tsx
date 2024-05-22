"use client";

import posthog from "posthog-js";
import { PostHogProvider as OriginalProvider } from "posthog-js/react";
import { type ReactNode, Suspense } from "react";
import { PostHogPageView } from "./posthog-pageview";

let isInitialized = false;

export function PosthogProvider({
  children,
  token,
  host,
}: {
  children: ReactNode;
  token: string;
  host: string;
}) {
  if (!isInitialized && typeof window !== "undefined") {
    posthog.init(token, {
      api_host: host,
      capture_pageview: false,
    });
    isInitialized = true;
  }

  return (
    <OriginalProvider client={posthog}>
      <Suspense>
        <PostHogPageView />
      </Suspense>
      {children}
    </OriginalProvider>
  );
}
