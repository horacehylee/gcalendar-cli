import path from "path";
import os from "os";

export const CRED_PATH = path.join(os.homedir(), "client_secret.json");
export const TOKEN_PATH = path.join(os.homedir(), "calendar_api_token.json");
