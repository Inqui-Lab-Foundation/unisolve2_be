![](https://codebuild.ap-south-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoibngrZm9wOWpSTzVmMDc2b04vaWM2MnJZallaWHBReUIyQVhDNi9wZDNHUGk0a1UrYVllNnVHQm5FMzkyUXMrN2Qyd2h4ekRSdHhCYTRmSFVGRVViVXUwPSIsIml2UGFyYW1ldGVyU3BlYyI6InpVeDR2dkU4dnZ2V0JaMkQiLCJtYXRlcmlhbFNldFNlcmlhbCI6Mn0%3D&branch=develop)
# Student's Learning Platform backend

# UNISLOVE-Back End

Unislove backend containing All list API's and server hosted in port <3002>

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

- Node.js (atleast-- node: 14.17.0, npm: 16.14.13)
- Typescript 
- Express
- MySQL

Requirements for the software and other tools to build, test and push 

### Installing

1. You need to install MySql
   - For Windows
     - Install mySql and set following environment variable C:\Program Files\mysql\10\bin
   - For Ubuntu
     - Installation 
        sudo apt update 
        sudo apt-get install mysql
  
2. create ```.env``` from ```.env-example```. then, update database credentials to make connection successfully. if the `.env` file gets failed to load, it can load the default values from `base.config.ts` which is under `/src/configs/`.

3. install all dependencies need for application to run locally 

   **Pre-Note:** After cloning the codebase, make sure ```DB_MIGRATE_FORCE``` and ```DB_MIGRATE_ALTER``` are seated as ```false``` in prod to prevent the data loses.
  ```DB_MIGRATE_FORCE=true``` can drop existed tables and recreate them. ```DB_MIGRATE_ALTER=true``` can alter existed tables instead of dropping them. it can help to prevent loosing data somewhat. but not relay on this always. 

   - ```git clone https://github.com/Inqui-Lab-Foundation/unisolve-be.git```
   - ```yarn install``` || ```npm install```
   - ```yarn start:dev``` || ```npm start:dev``` This will start the application in development mode
   - ```yarn start:prod``` || ```npm start:prod```  This will start the application and run on port 3002

   - **Pre-Note:**: you must build the project once using ```npm run build``` before executing the below command
   - **Note:** For the first time, if you want to create all tables in the selected database, it is recommended to run ```npm run migrate up``` from route directory.

5. if required, you can change port and others details in `.env` file. if the `.env` file gets failed to load, it can load the default values from `base.config.ts` which is under `/src/configs/`.

## Folder Structure

```
unisolve-be                            # Project route directory
├──keys                                # Secret keys directory
│  ├──jwt.key                          # JWT secret key
│  └──jwt.pub                          # JWT public encryption key
├──src                                 # Source directory
│  ├──configs                          # Application one place configurations directory
│  │  ├──base.config.ts                # Base configuration file to carry defaults for `.env` file
│  │  ├──constenants.ts                # Application constants file to carry application wide constants
│  │  ├──speeches.config.ts            # Speech file to carry out all hardcoded messages
│  │  ├──whildcardRoutes.config.ts     # Wildcard routes to list authentication free routes
│  │  ├──dynamicForm.ts                # Dynamic form fields list to be used in forms
│  │  └──signUp.json                   # Dynamically generated Sign up form fields
│  ├──controllers                      # Controllers directory
│  │  ├──base.controller.ts            # Base controller can be extended by other feature controllers to carry standers CRUD operations
│  │  ├──crud.controller.ts            # CRUD controller is responsible for standers CRUD endpoints for all models
│  │  └── **feature_controllers
│  ├──models                           # Models directory can hold all ORM models
│  │  └── **feature_models
│  ├──services                         # Services directory can hold all services
│  │  ├──crud.service.ts               # CRUD service is responsible for standers CRUD operations in CRUD controller
│  │  └── **feature_services
│  ├──middlewares                      # Middlewares directory can hold all application middlewares
│  │  ├──errorHandler.middleware.ts    # Error handler middleware to handle errors
│  │  ├──healthCheck.middleware.ts     # Health check middleware to check if the application running health
│  │  ├──routeProtection.middleware.ts # Route protector middleware to protect from unauthorized access
│  │  ├──validation.middleware.ts      # Validation middleware to validate request body
│  │  └── **feature_middlewares
│  ├──utils                            # Utility directory
│  │  ├──exceptions                    # Exceptions directory can hold all custom exceptions
│  │  │  ├──http.exception.ts          # Http exception class
│  │  │  └──**feature_exceptions
│  │  ├──jwt.util.ts                   # JWT utility to generate and verify JWT tokens
│  │  ├──logit.util.ts                 # Logit utility to log messages into console or a file and DB
│  │  ├──validate_env.util.ts          # Validate environment can validate env variables and fill with default values if failed
│  │  └──**feature_utils
│  ├──validations                      # Validations directory can hold all validations for all endpoint data inputs
│  ├──interfaces                       # Interfaces directory can hold all interfaces for any strictured classes
│  ├──docs                             # Documentation directory to keep swagger documentation
│  ├──migrations                       # Migrations directory to hold all DB migrations
│  ├──logs                             # Logs directory to keep day wise logs
│  ├──app.ts                           # Main application file
│  └──index.ts                         # Main application entry point
├──package.json                        # application metadata
├──.env                                # Application environment variables
├──.env-example                        # Application environment variables template
├──.sequelizerc                        # Sequelize configuration file
└──Readme.md                           # Application readme file

```

## Features

- CRUD operations for student
- Authentication for student
- REST API Request object validations - Basic
- Error Logs
- Setup docs

## Database Migration

#### **Generate Migrations(DEV):**

to create a new empty migation file you can run 
```npm run migrate create -- --name=name_you_want_for_migration_file.ts```

upon calling the above command a new file will be generated at src/migrations/migrations/ folder with name xxxxtimestampxxx.name_you_want_for_migration_file.ts
once you have generated migration file you can call 

#### **UP/DOWN Migrations(other than DEV):**

**Note:**: you must build the project once before executing the below command

```npm run migrate up``` command will execute all pending migrations.

```npm run down -- --name=name_of_migration_file_you_wish_to_revert.ts``` command will revert particular migration mentioned in --name 

## Database rules

- Use underscore_names instead of CamelCase
- Table names should be plural
- Spell out id fields (item_id instead of id)
- Don't use ambiguous column names
- When possible, name foreign key columns the same as the columns they refer to 

[Read More](https://db-migrate.readthedocs.io/en/latest/)

## Running the tests

```yarn run test``` || ```npm run test```

testing with converge of the files

```yarn run test:coverage``` || ```npm run test:coverage```

## Planned

- \[x] JWT login
- \[x] Unit Testing
- \[x] Postman collections
- \[x] Improve request Object Validations
- \[x] Improve Error Messages for request failures
- \[x] Swagger Docs
- \[x] Security
- \[x] SQL Database
- \[ ] Hosting


### Sample Tests

Explain what these tests test and why

    Give an example

### Style test

Checks if the best practices and the right coding style has been used.

    Es-lint

## Deployment

Add additional notes to deploy this on a live system

## Built With

  - [Contributor Covenant](https://www.contributor-covenant.org/) - Used
    for the Code of Conduct
  - [Creative Commons](https://creativecommons.org/) - Used to choose
    the license

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions
available, see the [tags on this
repository](https://github.com/PurpleBooth/a-good-readme-template/tags).

## Authors

  - **Pradeep Gandla**
  - **[Harishkumar](https://github.com/harishkumarreddy)**
  - **[Aman Satija](https://amansatija.com)**
  - **[Vamshi]()**

See also the list of
[contributors](https://github.com/PurpleBooth/a-good-readme-template/contributors)
who participated in this project.

## Recommended / Preferred

[VSCode](https://code.visualstudio.com/download)

## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc
