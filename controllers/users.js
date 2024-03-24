const fs = require('fs/promises');
const path = require('path');

const usersPath = path.resolve('data');

// get all files in "data" folder
const listOfUsersFiles = async () => {
    const files = await fs.readdir(usersPath);
    
    return files;
};

// get a single .json file by file name
const getUserFileByFileName = async (fileName) => {
    const data = await fs.readFile(`${usersPath}/${fileName}.json`, "utf-8");

    return JSON.parse(data);
}

// create a new file with JSON data
const addUserFile = async (body) => {
    const {fileName, userData} = body;
    const name = fileName.toString();

    fs.appendFile(`${usersPath}/${name}.json`, JSON.stringify(userData), function (err) {
        if (err) throw err;
    });

    return body;
}

// remove .json file by file name
const removeFile = async (fileName) => {

    fs.unlink(`${usersPath}/${fileName}.json`, function (err) {

        if (err) throw err;
    });
}

// update .json file
const updateUserFile = async (fileName, body) => {

    fs.writeFile(`${usersPath}/${fileName}.json`, JSON.stringify(body), function (err) {
        if (err) throw err;
    });

    const data = await fs.readFile(`${usersPath}/${fileName}.json`, "utf-8");

    return JSON.parse(data);
}


module.exports = {
    listOfUsersFiles,
    getUserFileByFileName,
    addUserFile,
    removeFile,
    updateUserFile,
}
