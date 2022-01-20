# Google Datastore Emulator UI

A simple user interface for interacting with the google datastore emulator locally.

## Installation

Run 

```sh
npm i -g google-datastore-emulator-ui
``` 
or 

```sh
yarn global add google-datastore-emulator-ui
```

## Environment Variables

`DATASTORE_EMULATOR_HOST` - The host nd port of your google cloud emulator that is currently running such as `http://localhost:8097`
`DATASTORE_BACKUP_BUCKET` - The name of the google cloud storage folder that your backups write to.
`DATASTORE_BACKUP_DIR` - The full path to you backups folder such as `/Users/zhogan/Documents/Code/Personal/google-datastore-emulator-ui/gcloud_datastore/backups`
`PROJECT_ID` - The google datastore project id.
`SERVER_PORT` - The port for the google-datastore-emulator-ui server to run on.

## Usage

Run 

```sh
google-datastore-emulator-ui -i my-project-id -e http://localhost:8097
```

## Cli Options

```sh
Usage: google-datastore-emulator-ui [command]

Options:
  -V, --version                 output the version number
  -i, --id <project>            The id of the google datastore project. (default: process.env.PROJECT_ID)
  -e, --emulator-host <host>    The url of the emulator (default: process.env.DATASTORE_EMULATOR_HOST)
  -b, --backup-bucket <bucket>  The google cloud storage backup bucket (default: process.env.DATASTORE_BACKUP_BUCKET)
  -d, --backup-dir <dir>        The google cloud storage backup bucket (default: process.env.DATASTORE_BACKUP_DIR)
  -p, --port <port>             The port to run the express server on (default: process.env.SERVER_PORT || "8002")
  -h, --help                    display help for command
```