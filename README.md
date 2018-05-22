# webrtc-google-transcript

WebRTC Audio transcription using Google Cloud to speech API


## Architecture
![Architecture](https://raw.githubusercontent.com/hansonrb/webrtc-google-transcript/master/architecture.png)


## Requirement

You need to have nodejs and npm and you can use nvm for multiple node versions.

More info about how to install nvm https://github.com/creationix/nvm

### For Backend ( NodeJS Middleware )
```
nvm install 6.14.2
nvm use 6.14.2

npm install

export GOOGLE_APPLICATION_CREDENTIALS=/Volumes/data/works/webrtc/audio-google/cred.json

npm run start
```

environment variable GOOGLE_APPLICATION_CREDENTIALS should be set with absolute URL

### For frontend

You can use any html server : apache or nginx.
Or you can just use simple nodejs html server

Open another terminal and run following for frontend
```
nvm use 6.14.2
npm install -g serve
serve .
```

And visit localhost:5000
