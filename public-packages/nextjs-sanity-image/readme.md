# NextJs Sanity Image

This package provides a wrapper around the [Next.js Image](https://nextjs.org/docs/api-reference/next/image) component to display images directly from Sanity.io, including all Next.js props and optimizations, and Sanity.io transforms.

## Installation

```bash
pnpm install @bob-obringer/nextjs-sanity-image
```

```bash
npm install @bob-obringer/nextjs-sanity-image
```

```bash
yarn add @bob-obringer/nextjs-sanity-image
```

## Usage

Here's a basic example of how to use the `NextJsSanityImage` component in a React component:

```jsx
import { NextJsSanityImage } from "@bob-obringer/nextjs-sanity-image";

function MyComponent({ sanityImageData }) {
  return (
    <NextJsSanityImage
      sanityImage={sanityImageData}
      width={500}
      height={300}
      transform={{
        invert: true,
        or: 90,
        bg: "FF0000",
      }}
    />
  );
}
```

In this example, `sanityImageData` is the image field data from a Sanity.io response.

## Props

The `NextJsSanityImage` component accepts all the standard [Next.js Image props](https://nextjs.org/docs/app/api-reference/components/image), plus the following:

- `sanityImage`: The image field data from a Sanity.io response. This is an object that includes an `asset` field.

- `transform`: An object that contains several optional transformation parameters. These parameters are applied to the image using [Sanity.io's image transformations](https://www.sanity.io/docs/image-urls). The `transform` object can include the following fields:

  - `bg`: The background color of the image.
  - `blur`: The blur amount of the image.
  - `flip`: The flip direction of the image. Can be "h", "v", or "hv".
  - `invert`: A boolean that indicates whether the colors of the image should be inverted.
  - `or`: The orientation of the image. Can be 0, 90, 180, or 270.
  - `sat`: The saturation of the image.
  - `sharp`: The sharpness of the image.

## TODO

This is in good shape but needs additional transforms especially around cropping and hotspots
