import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const commonErrorMessages = {
  INTERNAL_ERROR_MESSAGE: {
    message: "A problem has occurred. Try Again later.",
  },
};
