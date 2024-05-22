"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export type RecorderConfig = {
  capturePageView: boolean;
  capturePageLeave: boolean;
  // captureScrollDepth: boolean; // future feature
};

export function PosthogEventRecorder({
  capturePageView,
  capturePageLeave,
}: RecorderConfig) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  let url = window.origin + pathname;
  if (searchParams.toString()) {
    url = url + `?${searchParams.toString()}`;
  }

  // record page view
  useEffect(() => {
    if (!pathname || !posthog || !capturePageView) return;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  // record pageleave
  useEffect(() => {
    if (!pathname || !posthog || !capturePageLeave) return;

    const handlePageleave = () => {
      posthog.capture("$pageleave");
    };
    window.addEventListener("beforeunload", handlePageleave);
    return () => {
      window.removeEventListener("beforeunload", handlePageleave);
    };
  }, []);
  return null;
}
