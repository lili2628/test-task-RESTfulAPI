const express = require('express');
const Joi = require('joi');

const users = require('../../controllers/users.js');
const { HttpError, OnlyFileNames, IsFileExist } = require('../../helpers');

const router = express.Router();

// schema for create file request body 
const addSchema = Joi.object({
    fileName: Joi.number().integer().min(1000000000).max(9999999999).required().messages({
        'number.base': 'The fileName must be a 10 digits number.',
        'any.required': 'The fileName field is required',
    }),
    userData: Joi.object({ 
        name: Joi.string().min(2).max(255).required(),
        age: Joi.number().min(18).max(120).required(),
        sex: Joi.string().valid('male', 'female').required(),
    }),
});

// schema for delete, update, get single file request parameter "fileName"
const fileNameSchema = Joi.number().integer().min(1000000000).max(9999999999).required().messages({
        'number.base': 'The fileName must be a 10 digits number.',
        'any.required': 'The fileName field is required',
    });

// schema for update file request body
const userDataSchema = Joi.object({ 
    name: Joi.string().min(2).max(255).required(),
    age: Joi.number().min(18).max(120).required(),
    sex: Joi.string().valid('male', 'female').required(),
});

// endpoint to get an array of all file names in folder
router.get('/', async (req, res, next) => {
    try {
        const result = await users.listOfUsersFiles();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// endpoint to get a single file by file name; return file content as JSON
router.get('/:fileName', async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const { error } = fileNameSchema.validate(fileName);

        if (error) {
            throw error;
        }

        const listOfFiles = await users.listOfUsersFiles();
        const listOfOnlyNames = OnlyFileNames(listOfFiles);

        const isFileExist = IsFileExist(listOfOnlyNames, fileName);

        if (!isFileExist) {
            throw HttpError(400, "file not found");
        }

        const result = await users.getUserFileByFileName(fileName);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// endpoint to create a new file with JSON data
router.post('/', async (req, res, next) => {
    try {
        const body = req.body;
        const { error } = addSchema.validate(body);

        if (error) {
            throw error;
        }

        const listOfFiles = await users.listOfUsersFiles();
        const listOfOnlyNames = OnlyFileNames(listOfFiles);

        const isFileExist = IsFileExist(listOfOnlyNames, body.fileName.toString());

        if (isFileExist) {
            throw HttpError(400, "file with this fileName is already exist");
        }

        const result = await users.addUserFile(body);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

// endpoint to delete a file by file name
router.delete('/:fileName', async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const { error } = fileNameSchema.validate(fileName);

        if (error) {
            throw error;
        }

        const listOfFiles = await users.listOfUsersFiles();
        const listOfOnlyNames = OnlyFileNames(listOfFiles);

        const isFileExist = IsFileExist(listOfOnlyNames, fileName);

        if (!isFileExist) {
            throw HttpError(400, "file not found");
        }
        
        await users.removeFile(fileName);

        res.status(200).json({
        "message": "Contact deleted"
        });
    } catch (error) {
        next(error);
    }
});

// endpoint to update file by file name with JSON data
router.put('/:fileName', async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const { error: errorUserData } = userDataSchema.validate(req.body);

        if (errorUserData) {
            throw errorUserData;
        }

        const { error } = fileNameSchema.validate(fileName);

        if (error) {
            throw error;
        }
        
        const listOfFiles = await users.listOfUsersFiles();
        const listOfOnlyNames = OnlyFileNames(listOfFiles);

        const isFileExist = IsFileExist(listOfOnlyNames, fileName);

        if (!isFileExist) {
            throw HttpError(400, "file not found");
        }

        const result = await users.updateUserFile(fileName, req.body);
    
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


module.exports = router;