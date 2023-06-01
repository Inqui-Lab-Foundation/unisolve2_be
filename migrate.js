'use strict';

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config();
const database = require('./dist/src/utils/dbconnection.util');

const models = {};
fs.readdirSync(path.join(__dirname, 'dist', 'src', 'models'))
    .forEach(file => {
        console.log(path.join(__dirname, 'dist', 'src', 'models', file));
        const model = require(path.join(__dirname, 'dist', 'src', 'models', file));
        models[model.name] = model;
    });

    database.default.sync({ force: process.env.DB_MIGRATE_FORCE, alter: process.env.DB_MIGRATE_ALTER }).then(() => {
        console.log('Database synced');
        process.exit(0);
    });


