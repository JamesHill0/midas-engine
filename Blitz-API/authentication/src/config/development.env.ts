import * as fs from 'fs';

export const environment = {
    service: {
        port: 8001,
        mode: 'DEVELOPMENT'
    },

    secrets: {
        private: fs.readFileSync("src/keys/jwtRS256.key", { encoding: "utf8" }),
        key: 'mR2DAEGZOi07dgShfpTp',
        public: fs.readFileSync("src/keys/jwtRS256.key.pub", { encoding: "utf8" })
    }
};