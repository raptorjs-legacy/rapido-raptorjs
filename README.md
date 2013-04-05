Rápido Stack for RaptorJS
=========================

# Overview
Scaffolding allows for applications to be built very quickly since it can be 
used to remove many of the tedious steps required to build complex applications.
RaptorJS provides design patterns for building client/server JavaScript modules, 
UI components and webapps that are a strong fit for scaffolding solutions. 
For that reason, code to support scaffolding has been added to 
RaptorJS ([view source](https://github.com/raptorjs/raptorjs/tree/master/tools/raptor-cli)). 
The usage is described below.

# Usage

## Installation
Scaffolding is now supported using the [Rápido](https://github.com/raptorjs/rapido) command line interface and the [Rápido stack for RaptorJS](https://github.com/raptorjs/rapido-raptorjs)
```shell
sudo npm install rapido --global
sudo npm install rapido-raptorjs --global
```
To enable the `raptorjs` stack for a project, you will need to run the following command:
```shell
rap use raptorjs
```

## Create a static webapp (server-less):
```shell
cd websites
mkdir my-static-web
cd my-static-web
rap create webapp --static
npm install
node build.js
```

## Create a server webapp for Node (using [express](http://expressjs.com)) (in-progress):
```shell
cd websites
mkdir my-server-web
cd my-server-web
rap create webapp
npm install
node server.js
```

## Creating a UI component:
```shell
rap create component ui/buttons/SimpleButton
```

## Creating a page:
```shell
rap create page test
```

## Rename/refactor a UI component (in-progress):
```shell
rap remame component ui/buttons/SimpleButton ui/buttons/SimpleButtonRenamed
```
NOTE: All references to the old UI component should be updated.

## Clone a UI component (in-progress):
```shell
rap clone component ui/buttons/SimpleButton ui/buttons/SimpleButtonCloned
```

## Create a JavaScript AMD module (in-progress):
```shell
rap create module test/my-awesome-module
```

# Configuration
The Rápido stack for RaptorJS supports the following configuration options (defined in `rapido.json`):
```javascript
{
    "scaffold.component.dir": "scaffolds/component",
    "scaffold.page.dir": "scaffolds/page",
    "scaffold.webapp.dir": "scaffolds/webapp",
    "modules.dir": "modules",
    "components.base.dir": "modules",
    "pages.base.dir": "modules/pages",
    "app.rtld.file": "modules/taglibs/app/app.rtld"
}
```
