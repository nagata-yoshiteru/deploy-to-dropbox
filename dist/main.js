var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dropbox } from 'dropbox'; // eslint-disable-line
const fs = require('fs');
const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
// const accessToken = core.getInput('DROPBOX_ACCESS_TOKEN')
const refreshToken = core.getInput('DROPBOX_REFRESH_TOKEN');
const globSource = core.getInput('GLOB');
const dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX');
const fileWriteMode = core.getInput('FILE_WRITE_MODE');
function uploadFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = fs.readFileSync(filePath);
        const destinationPath = `${dropboxPathPrefix}${filePath}`;
        const URL = 'https://exdata.co.jp/gh-dropbox/refresh?token=' + refreshToken;
        core.debug(URL);
        const res = yield fetch(URL);
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        core.debug(res);
        const text = yield res.text();
        core.debug(text);
        const tokenJson = JSON.parse(text);
        const accessToken = tokenJson.access_token;
        core.debug(`[Dropbox] Uploading file at: ${destinationPath}`);
        const dropbox = new Dropbox({ accessToken });
        const response = yield dropbox.filesUpload({
            path: destinationPath,
            contents: file,
            mode: { '.tag': fileWriteMode },
        });
        core.debug('[Dropbox] File upload response: ' + JSON.stringify(response));
        return response;
    });
}
glob(globSource, {}, (err, files) => {
    if (err)
        core.setFailed(`Error: glob failed: ${err.message}`);
    Promise.all(files.map(uploadFile))
        .then((all) => {
        core.debug('[Dropbox] All files uploaded: ' + JSON.stringify(all));
        console.log('[Dropbox] Upload completed');
    })
        .catch((err) => {
        core.error('[Dropbox] Upload failed: ' + err);
        core.setFailed(`Error: Dropbox upload failed: ${err}`);
    });
});
