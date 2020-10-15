# Code Refactory

Repository for [coderefactory.com](https://coderefactory.com) (v4).

Scaffolded with [Eleventastic](https://eleventastic.netlify.com), a simple [Eleventy](https://www.11ty.dev/) Starter Kit.

Deploys to [Netlify](https://www.netlify.com/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/b39c0019-7775-4e42-820f-dd3fdbf57fe2/deploy-status)](https://app.netlify.com/sites/practical-pare-7c2d6e/deploys)

## Features

* CSS Pipeline (Sass, CleanCSS)
* JS Bundling (Webpack)
* SVG Icon Sprite Generation
* Critical CSS
* HTML Minification
* No external builds, everything runs through 11ty

## Getting Started

To install the necessary packages, run this command in the root folder of the site:

```sh
yarn
```

### Commands

* Run `yarn start` for a [development server](http://localhost:8080/) and live reloading
* Run `yarn run build` to generate a production build

<!--
## Deploy a fork of this template to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/maxboeck/eleventastic)
-->

## CSS

Styling works with Sass. The main index file is in `src/assets/styles/main.scss`. Import any SCSS code you want in there; it will be processed and optimized. The output is in `dist/assets/styles/main.css`

## JS

Javascript can be written in ES6 syntax. The main index file is in `src/assets/scripts/main.js`. It will be transpiled to ES5 with babel, bundled together with webpack, and minified in production. The output is in `dist/assets/scripts/main.js`

## SVG Icons

All SVG files added to `src/assets/icons` will be bundled into a `symbol` sprite file. The SVG filename will then be used as the symbol identifier and the icon can be used as a shortcode.

For example, if you have a `github.svg` file in that folder, you can display it anywhere by using `{% icon "github" %}` in your templates.

## Critical CSS

Currently, critical CSS will only be inlined in the head of the homepage. This is done by using the [critical](https://github.com/addyosmani/critical) package in an automatic transform.
