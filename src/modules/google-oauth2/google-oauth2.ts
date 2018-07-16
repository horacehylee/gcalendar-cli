const google = require("googleapis");
import * as fs from "fs";
import { promisify } from "bluebird";
import { TOKEN_PATH, CRED_PATH } from "./../../config";
import * as readline from "readline";
import * as inquirer from "inquirer";
import chalk from "chalk";
import * as opn from "opn";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const _authorize = credentialPath => async (scopes: string[]) => {
  const oauth2Client = await getOauth2ClientFromFile(credentialPath);
  let tokens;
  try {
    tokens = await getToken();
  } catch (e) {
    tokens = await fetchToken(scopes)(oauth2Client);
  }
  oauth2Client.credentials = tokens;
  return oauth2Client;
};
export const authorize = _authorize(CRED_PATH);

const fetchToken = (scopes: string[]) => async oauth2Client => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  console.log(
    `Authorize this app by visiting this url:\n${chalk.greenBright(authUrl)}`
  );
  opn(authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question: inquirer.Question = {
    type: "input",
    message: "Enter the code from that page here:",
    name: "code"
  };
  const { code } = await inquirer.prompt(question);
  try {
    const tokens = await promisify(oauth2Client.getToken).bind(oauth2Client)(
      code
    );
    await storeToken(tokens);
    return tokens;
  } catch (err) {
    console.log("Error while trying to retrieve access token", err);
    throw err;
  }
};

export const getOauth2ClientFromFile = async (credentialPath: string) => {
  const content = await readFileAsync(credentialPath);
  const {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: redirectUris
  } = JSON.parse(content.toString("utf8")).installed;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);
};

export const generateAuthUrl = async (oauth2Client: any, scopes: string[]) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  return authUrl;
};

// Token Storage
const _storeToken = (tokenPath: string) => async (tokens: any) => {
  writeFileAsync(tokenPath, JSON.stringify(tokens));
};

const _getToken = (tokenPath: string) => async () => {
  const tokenString = await readFileAsync(tokenPath);
  return JSON.parse(tokenString.toString("utf8"));
};

export const storeToken = _storeToken(TOKEN_PATH);
export const getToken = _getToken(TOKEN_PATH);
