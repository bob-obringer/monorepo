import { type ImageProps } from "next/image";

/*
 * SanityImageAsset type represents a sanity image asset.
 * It includes the url of the asset and the metadata of the asset.
 */
type SanityImageAsset = {
  _type: "sanity.imageAsset";
  url?: string;
  metadata?: {
    lqip?: string; // Represents a Low-Quality Image Placeholder.
  };
};

/*
 * SanityImageField type represents the structure of the sanity image object.
 * This type is used to type check the 'sanityImage' prop of the SanityImage component.
 * It includes the asset of the image.
 */
type SanityImageField = {
  asset?: SanityImageAsset;
  _type: "image";
};

/*
 * SanityImageProps type represents the props that the SanityImage component accepts.
 * This type extends the ImageProps from Next.js, excluding the 'src' prop, and adds the 'sanityImage' prop
 * and a 'transform' object that contains several optional transformation parameters.
 */
export type NextJsSanityImageProps = Omit<ImageProps, "src"> & {
  sanityImage: SanityImageField;
  transform?: {
    bg?: string; // Adds a bg color to the transparent areas of the image.
    blur?: number; // Blurs the image (between 0 and 100)
    flip?: "h" | "v" | "hv"; // Flips the image
    invert?: boolean; // Inverts the image colors
    or?: 0 | 90 | 180 | 270; // Changes the orientation of the image
    sat?: number; // Changes the image saturation (currently only -100 for grayscale).
    sharp?: number; // Sharpens the image (between 0 and 100)
  };
};
