import coreWebVitals from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const eslintConfig = [...coreWebVitals, ...tsConfig];

export default eslintConfig;
