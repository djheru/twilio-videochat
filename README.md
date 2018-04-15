# TwilioVideochat
A Video Chat app using Twilio Video

### Setup

#### Sign up for Twilio

https://www.twilio.com/try-twilio

#### Create a project

https://www.twilio.com/console/projects/create

- Use Programmable Video
- Go to Tools->API Keys and create a new standard key

#### Add API keys to environment variables

- `cp template.env .env`
- Enter Twilio Account SID in `TWILIO_ACCOUNT_SID` field
- Enter API Key SID in `TWILIO_API_SID` field
- Enter API Secret in `TWILIO_API_SECRET`

#### Add Twilio client

- `yarn install twilio`
