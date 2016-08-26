'use strict';
const fs = require('fs');
let google = require('googleapis');
let googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GSheets {
    constructor(pathToCredentials, sheetId) {
        this.pathToCredentials = pathToCredentials;
        this.sheetId = sheetId;
        this.authorized = false;
        this.key = require(this.pathToCredentials);
        this.jwtClient = new google.auth.JWT(this.key.client_email, null, this.key.private_key, SCOPES, null);
        this.sheets = google.sheets('v4');
    }

    append(values) {
        this.getJWT().then(() => {
            this.sheets.spreadsheets.values.append({
                auth: this.jwtClient,
                spreadsheetId: this.sheetId,
                range: 'Sheet1!A:Z',
                valueInputOption: "USER_ENTERED",
                resource: {
                    range: "Sheet1!A:Z",
                majorDimension: "ROWS",
                values: values
                }
            }, (err, response) => {
                if(err) {
                    console.log(err);
                    this.authorized = false;
                    return;
                }
            });
        });

    }

    getJWT() {
        return new Promise((resolve, reject) => {
            this.jwtClient.authorize((err, tokens) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.authorized = true;
                resolve();
            });
        });
    }

}

module.exports = GSheets;
