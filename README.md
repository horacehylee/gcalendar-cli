# gcalendar-cli

> Google Calendar cli tool for Node.js

[![npm version](https://badge.fury.io/js/gcalendar-cli.svg)](https://badge.fury.io/js/gcalendar-cli)
[![CircleCI](https://circleci.com/gh/horacehylee/gcalendar-cli.svg?style=svg)](https://circleci.com/gh/horacehylee/gcalendar-cli)
[![Coverage Status](https://coveralls.io/repos/github/horacehylee/gcalendar-cli/badge.svg?branch=master)](https://coveralls.io/github/horacehylee/gcalendar-cli?branch=master)

## Installation

Install it as a global module
```
npm install -g gcalendar-cli
```

## Authentication

Authorization and authentication is done with OAuth 2.0. 

### 1) Get your project credentials

You will need a file with your credentials: `client ID`, `client secret` and `redirect URI`. This can be obtained in the [Developer Console](https://console.developer.google.com):

- Select or create a project
- Click in `Credentials`
- Click `Create credentials` → `OAuth client ID` ( `Application type` must be `Other` )
- Download the JSON file and save as `client_secret.json` in `C:\Users\<YOUR_USER_NAME>` directory


### 2) Get token

```
gcal setup
```

Login with your Google account and approve the permissions.

Copy the token back to the terminal.

You should see `✔️ You are ready to go!`

Example:

```
Authorize this app by visiting this url:
https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
? Enter the code from that page here: x/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✔️ You are ready to go!
```

## Usage

### List Events

```
gcal list

List google calendar events

Options:
  --version    Show version number                                     [boolean]
  --help       Show help                                               [boolean]
  --table, -t  Display events in table                                 [boolean]
  --days, -d   Number of days for events                                [number]
  --range, -r  Date range of events in natural language                 [string]
```

#### List events using natural language (powered by [Sherlock](https://github.com/neilgupta/Sherlock)):
```
gcal ls -r "tomorrow"
```
```
gcal ls -r "from 25 Dec to 27 Dec"
```

#### List events with 3 days from now
```
gcal ls -d 3
```

#### List events only for today
```
gcal ls -d 0
```

### Insert Event

```
gcal insert <info>

Insert event into google calendar

Options:
  --version       Show version number                                  [boolean]
  --help          Show help                                            [boolean]
  --duration, -d  Duration of the event                                 [number]
  --calendar, -c  Calendar for event to insert                          [string]
```

#### Insert events using natural language:

All day event: 

```
gcal insert "Party tomorrow"
```

```
gcal insert "Vacation from 23 Dec to 25 Dec"
```

Timed event:

```
gcal insert "Party tomorrow from 2pm to 7pm"
```

#### Insert events with duration:

Party tomrrow from 2pm to 7pm (5 Hours):

```
gcal insert "Party tomorrow from 2pm" -d 5
```

Movie from 3pm to 4:30pm (1.5 Hours):

```
gcal insert "Movie from 3pm" -d 1.5
```

## Inspriation

- [gcal-cli](https://github.com/toniov/gcal-cli) - Google Calendar command line tool for Node.js

## License

MIT © [Horace Lee](https://github.com/horacehylee)