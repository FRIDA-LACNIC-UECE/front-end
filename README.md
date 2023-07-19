# Data Protection System based on Encryptation and Anonymization Techniques - Front End

The current version of this System is up on Huawei's Cloud and can be accessed on [this link](http://110.238.69.32/)

This repository contains only the Front end of Web application of the project. You can see the Client Agent part [here](https://github.com/FRIDA-LACNIC-UECE/agent) and the Back end of the Web app [here](https://github.com/FRIDA-LACNIC-UECE/back-end).

<p align="center">
  <a href=#Project>Description</a> -
  <a href=#Installing>Installation</a> -
  <a href=#Technologies>Technologies</a>
</p>

<h4 align="center"> ⚠ This project is in active development and is NOT ready for production use ⚠</h4>

<br/>

# Project Description

This project aims to study techniques and methodologies to propose a system for data protection based on cloud computing, to enable a higher capacity processing without encumbering the computational resources of devices and local servers of companies and government institutions. Thus, the objective is to develop a system for receiving data through a communication API, anonymization configuration considered adequate, protecting data through encryption and returning anonymized data to system users. Finally, the prototype was deployed in a cloud environment to carry out a robust experimental analysis.

The Web application is being built to be a easy way for the final user to use the data protection provided by this project.

## Features
- [x] User Login
- [x] Admin page
- [x] User's databases list page
- [x] Anonymization configuration page
- [ ] Anonymization progress page 

## Project screenshots 

<i> Working on it </i>

# Installing and running

## Technologies used
- [Git](git-csm.com) - Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.
- [Node](https://nodejs.org/en) v12.22.1 - Node.js is an open-source, cross-platform JavaScript runtime environment.
- [Npm](https://www.npmjs.com/) v6.13.4 or [Yarn](https://yarnpkg.com/) v1.21.1
- [Quasar](https://quasar.dev/) v2.12.0 - Open source programming language based on Vuejs.
- [Vue](https://vuejs.org/) v3.0.0 -An approachable, performant and versatile framework for building web user interfaces.
- [Vue-router](https://router.vuejs.org/) v4.0.0 - Expressive, configurable and convenient routing for Vue.js.
- [Vuex](https://vuex.vuejs.org/) - Vuex is a state management pattern + library for Vue.js applications.
- [Axios](https://axios-http.com/) v0.27.2 - Axios is a promise-based HTTP Client for node.js and the browser.
- [Python](https://www.python.org/) - Open source programming language.
- [Flask] - Web framework for building web applications and APIs in Python.
- [SQLAlchemy](https://www.sqlalchemy.org/) - Object-Relational Mapping (ORM) library that provides a interface to interact with databases using Python.
- [Swagger](https://swagger.io/) - A toolset that facilitates easy interaction with APIs and the creation of API documentation.


## Running
To run this aplication you'll need Git, Node, Npm or Yarn, [Vue CLI Plugin](https://quasar.dev/start/vue-cli-plugin) and [Quasar CLI](https://quasar.dev/start/quick-start) installed.

```bash
# Clone repository with the updated branch

git clone https://github.com/FRIDA-LACNIC-UECE/front-end

# Select repository

cd front-end

# Install dependencies

npm install #or yarn install

# Run app

quasar dev

# It will initialize on port: 8080, access http://localhost:8080

```
<br/>

