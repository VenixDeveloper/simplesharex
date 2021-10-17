# SimpleShareX
A simple [ShareX](https://getsharex.com) server built with [Express](https://expressjs.com), [EJS](https://ejs.co/) and NGiNX.

## Features
- Upload images and videos
- [Discord embedding](https://i.venixdev.xyz/Ku425g.png)
- Easy to setup
### Todo
- Admin Dashboard for even easier setup

## Setup
### Prerequisites
To run SimpleShareX, you need to
- Install NodeJS v16
- Install NGiNX

### 1: Install

#### Clone from GitHub
Use the command `git` to clone the rep:
```cmd
git clone https://github.com/venixdeveloper/simplesharex
```
Go into the directory:
```
cd SimpleShareX
```
Install required packages:
##### NPM
```
npm install
```
##### Yarn
```cmd
npm i -g yarn
yarn
```

### 2: Setup
To get SimpleShareX to run correctly, it needs the right configuration.
Go ahead and copy `.env.example` and name it `.env`. Here is the stuff you **need** to edit:
```env
PORT=3000 # Your desired port
SECRETPASS=1234 # Password for auth with your ShareX
FILELENGTH=6 # File length, e.g. ba81b4.png if your file length is 6.
DOMAIN=example.com # Your domain this is gonna be hosted within. Example: i.domain.com, cdn.domain.com, sharex.domain.com
```

#### 2.1: Start the server
When testing the app you can run it with `node src/index.js`.
If you want it to run 24/7, you can use PM2 to start your app with `pm2 start src/index.js`.

#### 2.2: NGiNX Config
This can be run with an HTTPS NGiNX reverse proxy.
Here are the commands to create your config file and edit it:
```shell
touch /etc/nginx/sites-available/ShareX.conf
ln -s /etc/nginx/sites-available/ShareX.conf /etc/nginx/sites-enabled/ShareX.conf
nano /etc/nginx/sites-available/ShareX.conf
```
Here, you can use an config something like this:
```conf
server {
  listen 80;
  server_name yourdomain.com;
  rewrite ^ https://$host$request_uri permanent;
}

server {
  listen 443 ssl;

  server_name yourdomain.com;                                               
 
  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;       
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;     
  ssl_session_cache builtin:1000 shared:SSL:10m;                        
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;                                  
  ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
  ssl_prefer_server_ciphers on;                       

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://localhost:3000; # The port your app is running on.
    proxy_read_timeout 90;
  }                  
}
```
Create an SSL Certificate:
```
apt install -y certbot
certbot certonly -d yourdomain.com
```
Finally, restart your NGiNX.
```
systemctl restart nginx
```
If you visit your domain, it should look something like [this](https://i.venixdev.xyz/OmTrPv.png).
Congratulations!

#### 3: Setup your ShareX
The final step, you will need to download the sampleFile.sxcu to your desktop. Edit it with your favorite text editor.
Edit this to your domain:
```
"RequestURL": "https://example.com/api/upload", 
```
and your key from .env here:
```
"Headers": {
   "key": "YourKeyFromEnv"
},
```
Now open the file with ShareX and click yes. Test to see if it works.
If not please open an issue within the rep!

### Examples
![Pic 1](https://i.venixdev.xyz/raw/RN0RH3.png)
![Pic 2](https://i.venixdev.xyz/raw/630RRu.png)