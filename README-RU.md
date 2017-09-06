# gulp-watch-and-touch

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-blue.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-watch-and-touch.svg?branch=master)](https://travis-ci.org/dutchenkoOleg/gulp-watch-and-touch)
[![Dependencies](https://www.versioneye.com/user/projects/592a776360820000641045ad/badge.svg?style=flat)](https://www.versioneye.com/user/projects/592a776360820000641045ad?child=summary)


:us: [English](./README.md)
|
:ru: Русский язык

> _Следите за зависимыми файлами,_  
> _если они меняются - "скажите" об этом файлу, который включает их, или любому другому, который вам нужен._

[![js-happiness-style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)


## Когда этот плагин использовать?

___Он не предназначен для использования в пайпах gulp потока___

_Если ваши плагины могут дать обратные вызовы после их работы,_  
_с информацией о включенных файлах или если вы знаете, как это сделать самостоятельно - это для вас_

## Для чего этот плагин?

Предположим, что у вас есть что-то вроде этой файловой структуры в вашем проекте

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

У вас есть 5 файлов, которые должны быть трансформированы / скомпилированы и повторно собраны, когда это ДЕЙСТВИТЕЛЬНО нужно в процесск инкрементальных сборок. И если вы меняете файлы, которые затрагивают только один или два из них, нет необходимости воссоздавать все остальные. Но как это сделать?

Конечно, вы можете создавать 5 или более задач с разными исходными параметрами и для каждого помещать отдельного наблюдателя (`gulp.watch ()` или какой нибудь плагин для этого), но этот подход не очень удобен в случае изменения зависимостей, отключения или включения импортов файлы и т.д. Вы должны, каждый раз, вручную переписывать свои задачи или их часть.

Еще один вариант - поставить `watch` на все файлы которые у Вас есть, чтобы не переписывать что-либо, но это в корне убивает нашу цель, которая заключается в оптимизации и ускорении процесса работы, только с теми файлами которые действительно нужны в данный момент.

_Наше предложение. Посмотрите на всю ситуацию под другим углом.
 Если что-то происходит с подключенными файлами - они должны сообщать об этом файлам, в которых они используются_

__Пример__

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


## Как это работает?

Этот небольшой модуль сочетает в себе работу двух плагинов [`gulp-watch`](https://www.npmjs.com/package/gulp-watch) и [`gulp-touch`](https://www.npmjs.com/package/gulp-touch). Кроме того, он кэширует результаты для каждого файла.  
Если вас интересует более подробная информация - посмотрите [исходный код](https://github.com/dutchenkoOleg/gulp-watch-and-touch/blob/master/index.js) - это действительно крошечный скрипт ))


## Предупреждение

Плагин использует es6 синктаксис

- ECMAScript 2015 (ES6) and beyond - https://nodejs.org/en/docs/es6/
- Node.js ES2015 Support - http://node.green/ 


## Установка

```shell
npm install --save gulp-auto-watch
# or using yarn cli
yarn add gulp-auto-watch
```

## To Do

- Написать больше тестов
- Написать больше примеров "_живого кода_"

---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
