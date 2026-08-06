import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // External stores keep a synchronous ref so mutations cannot close over stale state.
  { rules: { "react-hooks/refs": "off" } },
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
]);
