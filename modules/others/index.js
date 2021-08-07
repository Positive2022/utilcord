const fs = require("fs");
module.exports = async () => {

    const files = fs.readdirSync("./functions/");
    for (const file of files) {
        const functions = require("require-all")(__dirname + `/functions/${file}`);
        Object.assign(module.exports, functions);
    }
}