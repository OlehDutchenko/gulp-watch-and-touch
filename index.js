'use strict';

/**
 * Watch out for dependent files,
 * if they change - touch the file that includes them,
 * or any other file you need
 *
 * @module gulp-watch-and-touch
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 1.0.0
 */

/**
 * Wrapper function
 * @param  {Gulp} gulp
 * @return {function}
 */
module.exports = function (gulp) {
	const watch = require('gulp-watch');
	const touch = require('gulp-touch');

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
			return gulp.src(touchSrc)
				.pipe(touch());
		});

		// when changing the cache and starting a new watcher - return the true value.
		// this can be used for any of your actions, conditions, etc.
		return true;
	};
};
