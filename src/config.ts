import * as path from 'path';
import * as os from 'os';

export const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export const CRED_PATH = path.join(os.homedir(), 'client_secret.json');

export const TOKEN_PATH = path.join(os.homedir(), 'calendar_api_token.json');
