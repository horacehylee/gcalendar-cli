import { google, Auth } from "googleapis";
import fs from "fs";
import { promisify } from "util";
import chalk from "chalk";
import opn from "opn";
import inquirer from "inquirer";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

interface AuthorizeOptions {
  scopes: string[];
  tokenPath: string;
  credentialPath: string;
}
export async function authorize({
  scopes,
  tokenPath,
  credentialPath,
}: AuthorizeOptions): Promise<Auth.OAuth2Client> {
  let content: Buffer;
  try {
    content = await readFileAsync(credentialPath);
  } catch (err) {
    console.error("Error loading client secret file:", err);
    throw err;
  }
  const {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: redirectUris,
  } = JSON.parse(content.toString("utf8")).installed;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  );

  let credentials: Auth.Credentials;
  try {
    credentials = await readTokenFromFile(tokenPath);
  } catch (e) {
    credentials = await fetchNewToken({ scopes, tokenPath, oAuth2Client });
  }
  oAuth2Client.credentials = credentials;
  return oAuth2Client;
}

async function readTokenFromFile(tokenPath: string): Promise<Auth.Credentials> {
  const content = await readFileAsync(tokenPath);
  return JSON.parse(content.toString("utf8"));
}

async function fetchNewToken({
  oAuth2Client,
  scopes,
  tokenPath,
}: {
  oAuth2Client: Auth.OAuth2Client;
  scopes: string[];
  tokenPath: string;
}): Promise<Auth.Credentials> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log(
    `Authorize this app by visiting this url:\n${chalk.greenBright(authUrl)}`
  );
  opn(authUrl);

  const question: inquirer.Question = {
    type: "input",
    message: "Enter the code from that page here:",
    name: "code",
  };
  const { code } = await inquirer.prompt(question);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    await writeFileAsync(tokenPath, JSON.stringify(tokens));
    console.log("Token stored to", tokenPath);
    return tokens;
  } catch (err) {
    console.error("Failed to retrieve OAuth2 token", err);
    throw err;
  }
}
