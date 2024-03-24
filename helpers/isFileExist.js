const IsFileExist = (listExistingFilesNames, newFile) => {
    for (item of listExistingFilesNames) {
        if (newFile.toString() === item) {
            return true
        } else {
            return false;
        }
    }
};

module.exports = IsFileExist;