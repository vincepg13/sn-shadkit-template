import postcssImport from "postcss-import";
import tailwindcss from "@tailwindcss/postcss";
export default { plugins: [postcssImport(), tailwindcss()] };