import dotenv from 'dotenv'
dotenv.config();

if(!process.env.PORT){
    console.log("PORT is not defined in env variables");
}

if(!process.env.MONGO_URI){
    console.log("MONGO_URI is not defined in env variables");
}

if(!process.env.REFRESH_JWT_SECRET){
    console.log("REFRESH_JWT_SECRET is not defined in env variables");
}

if(!process.env.ACCESS_JWT_SECRET){
    console.log("ACCESS_JWT_SECRET is not defined in env variables");
}

if(!process.env.IMAGEKIT_PUBLIC_KEY){
    console.log("IMAGEKIT_PUBLIC_KEY is not defined in env variables");
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    console.log("IMAGEKIT_PRIVATE_KEY is not defined in env variables");
}

if(!process.env.IMAGEKIT_URL_ENDPOINT){
    console.log("IMAGEKIT_URL_ENDPOINT is not defined in env variables");
}

const usingOAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
const usingPassword = Boolean(process.env.GMAIL_PASSWORD);

if (!process.env.GOOGLE_USER) {
    console.log("GOOGLE_USER is not defined in environment variables");
    process.exit(1);
}

if (!process.env.BASE_URL) {
    console.log("BASE_URL is not defined in environment variables");
    process.exit(1);
}

if (!usingOAuth && !usingPassword) {
    console.log("Email configuration is incomplete: provide either Gmail OAuth2 vars or GMAIL_PASSWORD");
    process.exit(1);
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    BASE_URL: process.env.BASE_URL
}

export default config;