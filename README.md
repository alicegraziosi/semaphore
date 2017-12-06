# `GIG` generating interfaces for RDF graphs — a web based tool for Linked Open Data customisable visualisation

## Getting Started

To get you started first you can install the dependencies and then download or clone the `GIG` repository.

### Prerequisites

You need git to clone the `GIG` repository. You can get git from [here](https://git-scm.com/downloads).

You must also have Node.js and its package manager (npm) installed. You can get them from [here](https://nodejs.org/en/).

npm is distributed with Node.js- which means that when you download Node.js, you automatically get npm installed on your computer.

### Clone or download the `GIG`repository

Use Git or checkout with SVN using the web URL https://github.com/alicegraziosi/semaphore.git to clone the repo with HTTPS.

Clone the `gig` repository using git:

```
git clone https://github.com/alicegraziosi/semaphore.git
```

### Install the dependencies

We have two kinds of dependencies in this project: tools and Angular framework code. The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [Node package manager](https://www.npmjs.com/).
* We get the Angular code via `bower`, a [client-side code package manager](https://bower.io/).

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.

### Run the app in development mode


The `GIG` project comes preconfigured with a local development web server. It is a Node.js
tool called [http-server](https://www.npmjs.com/package/http-server). You can start this web server with `npm start`, but you may
choose to install `http-server` tool globally via npm:

```
sudo npm install -g http-server
```

Alternatively, you can choose to configure your own web server, such as Apache or Nginx. Just
configure your server to serve the files under the `app/` directory.

OLD
We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start
```
or

```
npm start-dev
```

Now browse to the app at [`localhost:8000/`](localhost:8000/).


You can start the web server locally by running:
```
http-server -a localhost -p 8000 -c-1 ./app
```
App online on:
http://localhost:8000/


NEW
You can start the web server locally by running:
```
node startserver.js
```
App online on:
http://localhost:8092

### Deploy app in production mode (OLD)

You can start the web server in production by running:

```
http-server -a [host ip (default 0.0.0.0)] -p [port(default 8080)]
```

### Deploy app in production mode (NEW)

You can start the web server in production by running:

```
node startserver.js
```
