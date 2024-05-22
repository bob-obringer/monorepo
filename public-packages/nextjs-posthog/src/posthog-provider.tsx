"use client";

import posthog from "posthog-js";
import { PostHogProvider as OriginalProvider } from "posthog-js/react";
import { type ReactNode, Suspense } from "react";
import { PosthogEventRecorder } from "./posthog-events";

let isInitialized = false;

export function PosthogProvider({
  children,
  token,
  host,
  enabled,
  capturePageView = true,
  capturePageLeave = true,
}: {
  children: ReactNode;
  token: string;
  host: string;
  enabled: boolean;
  capturePageView?: boolean;
  capturePageLeave?: boolean;
}) {
  if (!enabled) return children;

  if (!isInitialized && typeof window !== "undefined") {
    posthog.init(token, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: false,
    });
    isInitialized = true;
  }

  return (
    <OriginalProvider client={posthog}>
      {/* if this isn't suspended, page will be opted out of caching */}
      <Suspense>
        <PosthogEventRecorder
          capturePageView={capturePageView}
          capturePageLeave={capturePageLeave}
        />
      </Suspense>
      {children}
    </OriginalProvider>
  );
}
