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

## Usage

Run 

```sh
google-datastore-emulator-ui -p my-project-id -e http://localhost:8097
```

## Cli Options

```sh
Usage: google-datastore-emulator-ui [command]

Commands:

  -v, --version, version                Outputs the version number
  -h, --help, help                      Outputs usage information

  -i, --id, id                          The id of your google datastore instance
  -e, --emulator-host, emulator host    The host url of your local emulator such as http://localhost:8003
```