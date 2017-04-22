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

	var watch = require('gulp-watch');
	var touch = require('gulp-touch');

	var watchers = {};
	var cache = {};

	/**
	 * @param {string} uniqueKey
	 * @param {string|Array} touchSrc
	 * @param {string|Array} watchingSrc
	 * @return {boolean}
	 */
	return function (uniqueKey, touchSrc, watchingSrc) {

		var current = JSON.stringify(watchingSrc);
		var cached = cache[uniqueKey] || "[]";

		// if they are equal, then nothing has changed
		// return false value
		if (current === cached) {
			return false;
		}

		// cache new sources
		cache[uniqueKey] = current;

		// new watcher name
		var watcherName = `watcher:${uniqueKey}`;
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
	}
};
