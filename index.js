'use strict';

/**
 * Watch out for dependent files,
 * if they change - touch the file that includes them,
 * or any other file you need
 *
 * @module gulp-watch-and-touch
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 1.2.0
 */

const watch = require('gulp-watch');
const fs = require('fs');

/**
 * Wrapper function
 * @param  {Gulp} gulp
 * @return {function}
 */
module.exports = function (gulp) {
	const watchers = {};
	const cache = {};

	/**
	 * @param {string} uniqueKey
	 * @param {string|Array} touchSrc
	 * @param {string|Array} watchingSrc
	 * @return {boolean}
	 */
	return function (uniqueKey, touchSrc, watchingSrc) {
		let current = JSON.stringify(watchingSrc);
		let cached = cache[uniqueKey] || JSON.stringify([]);

		// if they are equal, then nothing has changed
		// return false value
		if (current === cached) {
			return false;
		}

		// cache new sources
		cache[uniqueKey] = current;

		// new watcher name
		let watcherName = `watcher:${uniqueKey}`;
		if (watchers[watcherName]) {
			// If it is already running - close it
			watchers[watcherName].close();
		}

		// start new one
		watchers[watcherName] = watch(watchingSrc, {read: false}, function () {
			// touch the file on changes
			return gulp.src(touchSrc, {buffer: false, read: false})
				.on('data', function (file) {
					let time = new Date();
					fs.utimes(file.path, time, time, err => {
						if (err) {
							this.emit('end');
						}
					});
				});
		});

		// when changing the cache and starting a new watcher - return the true value.
		// this can be used for any of your actions, conditions, etc.
		return true;
	};
};
