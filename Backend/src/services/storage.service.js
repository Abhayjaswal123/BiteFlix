import {ImageKit} from '@imagekit/nodejs';
import config from '../config/config.js';

const imageKit = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

export async function uploadFile(file, fileName){
    try {
        console.log("ImageKit upload start:", fileName, "size=", file.length || file.byteLength);
        const result = await imageKit.files.upload({
            file: file.toString("base64"),
            fileName: fileName
        });
        console.log("ImageKit upload success:", fileName, result.url);
        return result;
    } catch (err) {
        console.error("ImageKit upload failed:", fileName, err);
        throw err;
    }
}