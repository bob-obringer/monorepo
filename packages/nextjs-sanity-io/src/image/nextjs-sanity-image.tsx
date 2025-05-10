"use client";

import Image from "next/image";
import { z } from "zod";
import type { NextJsSanityImageProps } from "./types";

/*
 * Zod schema for the sanity image object
 * todo: full set of transforms
 */
const sanityPropsSchema = z.object({
  sanityImage: z.object({
    asset: z.any(),
  }),
  transform: z
    .object({
      bg: z.string().optional(),
      blur: z.number().min(0).max(100).optional(),
      flip: z.enum(["h", "v", "hv"]).optional(),
      invert: z.boolean().optional(),
      or: z
        .union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)])
        .optional(),
      sat: z.literal(-100).optional(),
      sharp: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

/**
 * NextJsSanityImage wraps the NextJS Image company to display images directly from Sanity.io,
 * including all NextJS props and optimizations, and Sanity.io transforms
 * @param sanityImage The image field data from a sanity.io response
 * @param transform sanity.io transforms to apply to the image
 * @param nextImageProps Standard NextJS ImageProps
 * @constructor
 */
export function NextJsSanityImage({
  sanityImage,
  transform,
  ...nextImageProps
}: NextJsSanityImageProps) {
  /*
   * Make sure the api response is what we expect
   */
  const props = sanityPropsSchema.parse({ sanityImage, transform });
  const { asset } = props.sanityImage;

  /*
   * Initialize the props we pass to NextImage
   * Grab the src from the sanity image aset
   */
  const extraProps = {
    ...nextImageProps,
    src: asset.url ?? "",
  };

  /*
    If the sanity image contains a low res base64 image, configure NextImage to use it
   */
  if (asset.metadata?.lqip) {
    extraProps.placeholder = "blur";
    extraProps.blurDataURL = asset.metadata.lqip;
  }

  /*
    Return the NextImage with our custom props, and a sanity image loader including transforms
   */
  return (
    <Image
      loader={({ src, width, quality = 75 }) => {
        let baseUrl = `${src}?w=${width}&q=${quality}`;
        const urlParams = transform ?? {};
        for (const [key, value] of Object.entries(urlParams)) {
          if (value) baseUrl += `&${key}=${value}`;
        }
        return baseUrl;
      }}
      {...extraProps}
    />
  );
}
