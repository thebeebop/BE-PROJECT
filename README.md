## IMPORTANT ------------------------------------------

## .env files

As our .env files are .gitignored, any developer who clones this repository to their local machine MUST create new .env files. 

To successfully link your project to the correct databases, two .env files must be created. 

## .env.development

Create a new .env file named: `.env.development` in your ROOT file location. To succesfully create a link to this development environment, write `PGDATABSE=name_of_development_database` at the top of this file.

## .env.test

Create a new .env file named: `.env.test` in your ROOT file location. To succesfully create a link to this development environment, write `PGDATABSE=name_of_test_database` at the top of this file.

Doing the above will allow you to easily switch between the test and dev environments when required.