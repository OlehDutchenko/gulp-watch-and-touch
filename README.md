# gulp-watch-and-touch

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-blue.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-watch-and-touch.svg?branch=master)](https://travis-ci.org/dutchenkoOleg/gulp-watch-and-touch)
[![Dependencies](https://www.versioneye.com/user/projects/592a776360820000641045ad/badge.svg?style=flat)](https://www.versioneye.com/user/projects/592a776360820000641045ad?child=summary)
 
 
:us: English
|
:ru: [Русский язык](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/README-RU.md)

> _Watch out for dependent files,_  
> _if they change - touch the file that includes them or any other file you need._

[![js-happiness-style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)


## When to use it?

___It is not for use in stream pipes___

_If your stream plugins can give some callbacks after their work,_  
_with information about included files or If you know how to do it yourself - this it for you_

## What is this for?

Suppose that you have something like this file structure in your project

``` shell
├─┬ project-sources/
│ ├─┬ sources-1/
│ │ ├─┬ group-of-files--1a/
│ │ │ ├── included-in-main.file
│ │ │ ├── included-in-main-and-addon.file
│ │ │ ├── included-in-some-other-main.file # similar cases can also be)))
│ │ │ ├── included-in-addon.file
│ │ │ └── not-included-anywhere.file
│ │ │ 
│ │ ├── group-of-files--1b/
│ │ ├── group-of-files--1c/
│ │ │ 
│ │ ├── main.file
│ │ └── addon.file
│ │
│ ├─┬ sources-2/
│ │ ├── group-of-files--2a/
│ │ ├── group-of-files--2b/ 
│ │ ├── group-of-files--2c/ 
│ │ ├── some-other-main.file
│ │ └── some-other-addon-or-theme-or-anything-else.file
│ │
│ ├─┬ sources-3/
│ │ └── trigger-my-compilation-when-it-need-from-other-task.file
```

You have 5 files which must be rendered / compiled, and re-assembled when it REALLY needs in incremental builds. And if you change files that affect only one or two of them, there is no need to re-create all the others. But how to do that?

Of course, you can create 5 or more tasks with different source parameters and for each put an individual observer (`gulp.watch()` or some plugin for watching) - but this approach is not very convenient in case of changing dependencies, disable or enable imported files, etc. You need to manually rewrite each time your tasks or part of them

Another option is to put an `watch` on all the files you have to not overwrite anything, but this completely kills our goal, which is to optimize and speed up the process of work, only with those files that are really needed at that moment.

_Our offer. Look at the whole situation from a different angle.
If something happens to the connected files - they must signal about this to the files in which they are used!_

__Example__

```js
import gulp from 'gulp';

// function wrapper
import watchAndTouch from 'gulp-watch-and-touch';  

/**
 * give your gulp to it
 * and get function with its closure
 * @const {Function}
 * @param {string} uniqueKey
 * @param {string|Array} touchSrc
 * @param {string|Array} watchingSrc
 * @return {boolean}
 */
const wnt1 = watchAndTouch(gulp); 

/**
 * give your gulp to it
 * and get function with its closure
 * @const {Function}
 * @param {string} uniqueKey
 * @param {string|Array} touchSrc
 * @param {string|Array} watchingSrc
 * @return {boolean}
 */
const wnt2 = watchAndTouch(gulp);

// plugin which can give your
// callback with information
// about the included files there
import renderPlugin from 'some-gulp-plugin'; 

export function renderTask1 () {
    return gulp.src('sources-1/*.file') // yes that's all source you need ))
        .pipe(renderPlugin({
            option1: 'value1',
            option2: 'value2',
            afterRenderCallback: function(file, result, stats) {
                let includedSources = stats.includedFiles;
                let pathToCurrentFile = file.path;
                let uniqFileKey = pathToCurrentFile.replace(/\\|\/|\.|\s|/g, '_');

                let isChanged = wnt1(uniqFileKey, pathToCurrentFile, includedSources);
                if (isChanged) { // an example
                    console.log( `${ file.relative } change dependencies:\n${ includedSources.join('\n') }` );
                }
            }
        }))
}

// or
// ==============

const analyseFn = () => {
    // some actions that you know how to write
    // for analyse your files for getting information
    // about the included files there
    // on done call
    wnt2(uniqueKey, touchSrc, watchingSrc); 
};

```


## How it works?

Look at the [source code](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/index.js) - it is really tiny script )).  
_In addition, the cache the results for each file._


## Warn

it's use es6 syntax

- ECMAScript 2015 (ES6) and beyond - https://nodejs.org/en/docs/es6/
- Node.js ES2015 Support - http://node.green/ 


## Installing

```shell
npm install --save gulp-auto-watch
# or using yarn cli
yarn add gulp-auto-watch
```

## Tests

`npm test` for testing code style

## To Do

- Write more tests
- Write more examples with live code

---

## Project Info

* [Change log](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/CHANGELOG.md)
* [Contributing Guidelines](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/CONTRIBUTING.md)
* [Contributor Covenant Code of Conduct](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/CODE_OF_CONDUCT.md)
* [License MIT](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/LICENSE)
