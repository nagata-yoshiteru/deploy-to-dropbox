var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Dropbox } from 'dropbox'; // eslint-disable-line no-unused-vars
const fs = require('fs');
const fetch2 = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const accessToken = core.getInput('DROPBOX_ACCESS_TOKEN');
const globSource = core.getInput('GLOB');
const dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX');
const fileWriteMode = core.getInput('FILE_WRITE_MODE');
const dropbox = new Dropbox({ accessToken });
function uploadFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = fs.readFileSync(filePath);
        const destinationPath = `${dropboxPathPrefix}${filePath}`;
        core.debug(`[Dropbox] Uploaded file at: ${destinationPath}`);
        const response = yield dropbox.filesUpload({
            path: destinationPath,
            contents: file,
            mode: fileWriteMode,
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
