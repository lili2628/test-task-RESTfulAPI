// create a file names list for existing files without extension ".json"
const OnlyFileNames = (arrOfFiles) => {
    const result = arrOfFiles.map(name => name.substring(0, name.length - 5));

    return result;
};

module.exports = OnlyFileNames;