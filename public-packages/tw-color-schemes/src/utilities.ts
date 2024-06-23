export const BASE_SCHEMA_NAME = "base";

export function getSelector(schemeName: string) {
  return schemeName === BASE_SCHEMA_NAME
    ? ":root, .default-color-mode"
    : `.${schemeName}-color-mode`;
}

export function convertHexToRgb(hex: string) {
  let r = 0,
    g = 0,
    b = 0;

  // Removing "#" if present
  if (hex.charAt(0) === "#") {
    hex = hex.substring(1);
  }

  if (hex.length === 3) {
    // If the color is in short form
    r = parseInt(hex.charAt(0).toString() + hex.charAt(0).toString(), 16);
    g = parseInt(hex.charAt(1).toString() + hex.charAt(1).toString(), 16);
    b = parseInt(hex.charAt(2).toString() + hex.charAt(2).toString(), 16);
  } else if (hex.length === 6) {
    // If the color is in long form
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error(`Invalid input color: ${hex}`);
  }

  return [r, g, b] as const;
}

// returns color as hex tokens 'r g b'
export function getColorValue(color: string) {
  if (color.startsWith("#")) {
    const rgb = convertHexToRgb(color);
    return `${String(rgb[0])} ${String(rgb[1])} ${String(rgb[2])}`;
  } else if (color.startsWith("rgba(")) {
    const rgb = color.replace("rgba(", "").replace(")", "").split(",");
    return `${rgb[0]?.trim()} ${rgb[1]?.trim()} ${rgb[2]?.trim()}`;
  } else if (color.startsWith("rgb(")) {
    const rgb = color.replace("rgb(", "").replace(")", "").split(",");
    return `${rgb[0]?.trim()} ${rgb[1]?.trim()} ${rgb[2]?.trim()}`;
  } else {
    return color;
  }
}

export function deepMerge<T>(obj1: T, obj2: Partial<T>): T {
  const result = { ...obj1 };
  for (const key in obj1) {
    if (obj2[key] !== undefined) {
      if (
        typeof obj1[key] === "object" &&
        obj1[key] !== null &&
        typeof obj2[key] === "object" &&
        obj2[key] !== null
      ) {
        result[key] = deepMerge(obj1[key], obj2[key] ?? {});
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = obj2[key] as any;
      }
    }
  }
  return result as T;
}

export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
