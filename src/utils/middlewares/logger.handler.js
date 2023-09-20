import winston from "winston";
import { resolveLogFileOutput } from "../utils.js";

const customLogLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "cyan",
    debug: "grey",
  },
};

const logLevelByENV = () => {
  const { ENV_STAGE } = process.env;
  return ENV_STAGE === "PROD" ? "info" : "debug";
};

const customTransports = () => {
  let transports = [
    new winston.transports.Console({
      level: logLevelByENV(),
      format: winston.format.combine(
        winston.format.timestamp({ format: "MM-DD hh:mm:ss.SSS" }),
        winston.format.colorize({ colors: customLogLevelsOptions.colors }),
        winston.format.printf(
          (logData) =>
            `${logData.timestamp} [${logData.level}]: ${logData.message} ${
              logData.splat !== undefined ? `${logData.splat}` : " "
            }`
        )
      ),
    }),
  ];
  if (process.env.ENV_STAGE === "PROD")
    transports.push(
      new winston.transports.File({
        level: "error", //"info"
        filename: resolveLogFileOutput(),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  return transports;
};

export const logger = winston.createLogger({
  levels: customLogLevelsOptions.levels,
  transports: customTransports(),
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString().timestamp}`
  );
  next();
};
