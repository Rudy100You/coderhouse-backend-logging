import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);


// eslint-disable-next-line no-unused-vars
const getTimestampForLogFile =()=> {
  const now = new Date();
  
  const year = now.getFullYear().toString().padStart(4, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(4, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
}

//since utils is now in a new folder, is needed to access one dir level up
export const __dirname = dirname(dirname(__filename));
export const pathJoin = join;

export const commonErrorMessages = Object.freeze({
  INTERNAL_ERROR_STATUS: 500,
});

export const commonErrorOutput = (res, err, nfMessage) => {
  //TODO: make error classification more reliable
  console.error(err.message);

  if (err.name === "ValidationError") {
    let validationError = Object.values(err.errors)[0];
    if (validationError.name) {
      switch (validationError.name) {
        case "CastError":
          err.message =
            "Field [" +
            validationError.path +
            "] must be " +
            validationError.kind +
            " type";
          break;
        case "ValidatorError":
          err.message = "Field [" + validationError.path + "] is required";
          break;
        default:
          break;
      }
      err.status = 422;
    }
  }
  if (err.name === "CastError") {
    if (err.path && err.kind)
      err.message = "Field [" + err.path + "] must be " + err.kind + " type";
    if (nfMessage) err.message = nfMessage;
    err.status = 404;
  }
  res.status(err.status ?? 500).send({
    status: "error",
    payload: err.message,
  });
};

export const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const equalsIgnoreCase =(str1, str2) => String(str1).toLowerCase() === String(str2).toLowerCase()

export const resolveLogFileOutput = ()=>{ 
  const outputFileName = "errors.log"//`ecommerce_backend_${getTimestampForLogFile()}.log`
  const logDIR = process.env.LOG_PATH
  if(logDIR)
   return pathJoin(logDIR, outputFileName)
  return pathJoin(__dirname, "logs", outputFileName)
}
