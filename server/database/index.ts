import dotenv from "dotenv";

dotenv.config();

const localLink = "mongodb://0.0.0.0:27017/crsp_docker_dev";

export const databaseLink =
  process.env.NODE_ENV === "production" ? process.env.WEB_LINK : localLink;
// process.env.NODE_ENV === "production" ? prod_link : localLink;

export const config = {
  link: databaseLink,
  options: {
    useNewUrlParser: true,
    autoIndex: false,
    useUnifiedTopology: true,
  },
};

export const TEST_CONTEXT =
  process.env.NODE_ENV === "production" ? "Production Mode" : process.env.TEST;

// Secret
export const SECRET =
  process.env.NODE_ENV === "production" ? process.env.SECRET : "secret";

export const ENV_CHECK =
  process.env.NODE_ENV === "production"
    ? "Production Mode"
    : "Development Mode";

console.log("ENV MODE -> ", ENV_CHECK);
