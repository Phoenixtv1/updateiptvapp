
/**
 * @videojs/http-streaming
 * @version 1.10.5
 * @copyright 2019 Brightcove, Inc
 * @license Apache-2.0
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('video.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'video.js'], factory) :
	(factory((global.videojsHttpStreaming = {}),global.videojs));
}(this, (function (exports,videojs) { 'use strict';

	videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var minDoc = {};

	var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : {};

	var doccy;

	if (typeof document !== 'undefined') {
	    doccy = document;
	} else {
	    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }
	}

	var document_1 = doccy;

	var urlToolkit = createCommonjsModule(function (module, exports) {
	  // see https://tools.ietf.org/html/rfc1808

	  /* jshint ignore:start */
	  (function (root) {
	    /* jshint ignore:end */

	    var URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/\?#]*\/)*.*?)??(;.*?)?(\?.*?)?(#.*?)?$/;
	    var FIRST_SEGMENT_REGEX = /^([^\/?#]*)(.*)$/;
	    var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
	    var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g;

	    var URLToolkit = { // jshint ignore:line
	      // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
	      // E.g
	      // With opts.alwaysNormalize = false (default, spec compliant)
	      // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
	      // With opts.alwaysNormalize = true (not spec compliant)
	      // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
	      buildAbsoluteURL: function buildAbsoluteURL(baseURL, relativeURL, opts) {
	        opts = opts || {};
	        // remove any remaining space and CRLF
	        baseURL = baseURL.trim();
	        relativeURL = relativeURL.trim();
	        if (!relativeURL) {
	          // 2a) If the embedded URL is entirely empty, it inherits the
	          // entire base URL (i.e., is set equal to the base URL)
	          // and we are done.
	          if (!opts.alwaysNormalize) {
	            return baseURL;
	          }
	          var basePartsForNormalise = URLToolkit.parseURL(baseURL);
	          if (!basePartsForNormalise) {
	            throw new Error('Error trying to parse base URL.');
	          }
	          basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path);
	          return URLToolkit.buildURLFromParts(basePartsForNormalise);
	        }
	        var relativeParts = URLToolkit.parseURL(relativeURL);
	        if (!relativeParts) {
	          throw new Error('Error trying to parse relative URL.');
	        }
	        if (relativeParts.scheme) {
	          // 2b) If the embedded URL starts with a scheme name, it is
	          // interpreted as an absolute URL and we are done.
	          if (!opts.alwaysNormalize) {
	            return relativeURL;
	          }
	          relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
	          return URLToolkit.buildURLFromParts(relativeParts);
	        }
	        var baseParts = URLToolkit.parseURL(baseURL);
	        if (!baseParts) {
	          throw new Error('Error trying to parse base URL.');
	        }
	        if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
	          // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
	          // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
	          var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
	          baseParts.netLoc = pathParts[1];
	          baseParts.path = pathParts[2];
	        }
	        if (baseParts.netLoc && !baseParts.path) {
	          baseParts.path = '/';
	        }
	        var builtParts = {
	          // 2c) Otherwise, the embedded URL inherits the scheme of
	          // the base URL.
	          scheme: baseParts.scheme,
	          netLoc: relativeParts.netLoc,
	          path: null,
	          params: relativeParts.params,
	          query: relativeParts.query,
	          fragment: relativeParts.fragment
	        };
	        if (!relativeParts.netLoc) {
	          // 3) If the embedded URL's <net_loc> is non-empty, we skip to
	          // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
	          // (if any) of the base URL.
	          builtParts.netLoc = baseParts.netLoc;
	          // 4) If the embedded URL path is preceded by a slash "/", the
	          // path is not relative and we skip to Step 7.
	          if (relativeParts.path[0] !== '/') {
	            if (!relativeParts.path) {
	              // 5) If the embedded URL path is empty (and not preceded by a
	              // slash), then the embedded URL inherits the base URL path
	              builtParts.path = baseParts.path;
	              // 5a) if the embedded URL's <params> is non-empty, we skip to
	              // step 7; otherwise, it inherits the <params> of the base
	              // URL (if any) and
	              if (!relativeParts.params) {
	                builtParts.params = baseParts.params;
	                // 5b) if the embedded URL's <query> is non-empty, we skip to
	                // step 7; otherwise, it inherits the <query> of the base
	                // URL (if any) and we skip to step 7.
	                if (!relativeParts.query) {
	                  builtParts.query = baseParts.query;
	                }
	              }
	            } else {
	              // 6) The last segment of the base URL's path (anything
	              // following the rightmost slash "/", or the entire path if no
	              // slash is present) is removed and the embedded URL's path is
	              // appended in its place.
	              var baseURLPath = baseParts.path;
	              var newPath = baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) + relativeParts.path;
	              builtParts.path = URLToolkit.normalizePath(newPath);
	            }
	          }
	        }
	        if (builtParts.path === null) {
	          builtParts.path = opts.alwaysNormalize ? URLToolkit.normalizePath(relativeParts.path) : relativeParts.path;
	        }
	        return URLToolkit.buildURLFromParts(builtParts);
	      },
	      parseURL: function parseURL(url) {
	        var parts = URL_REGEX.exec(url);
	        if (!parts) {
	          return null;
	        }
	        return {
	          scheme: parts[1] || '',
	          netLoc: parts[2] || '',
	          path: parts[3] || '',
	          params: parts[4] || '',
	          query: parts[5] || '',
	          fragment: parts[6] || ''
	        };
	      },
	      normalizePath: function normalizePath(path) {
	        // The following operations are
	        // then applied, in order, to the new path:
	        // 6a) All occurrences of "./", where "." is a complete path
	        // segment, are removed.
	        // 6b) If the path ends with "." as a complete path segment,
	        // that "." is removed.
	        path = path.split('').reverse().join('').replace(SLASH_DOT_REGEX, '');
	        // 6c) All occurrences of "<segment>/../", where <segment> is a
	        // complete path segment not equal to "..", are removed.
	        // Removal of these path segments is performed iteratively,
	        // removing the leftmost matching pattern on each iteration,
	        // until no matching pattern remains.
	        // 6d) If the path ends with "<segment>/..", where <segment> is a
	        // complete path segment not equal to "..", that
	        // "<segment>/.." is removed.
	        while (path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length) {} // jshint ignore:line
	        return path.split('').reverse().join('');
	      },
	      buildURLFromParts: function buildURLFromParts(parts) {
	        return parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment;
	      }
	    };

	    /* jshint ignore:start */
	    module.exports = URLToolkit;
	  })(commonjsGlobal);
	  /* jshint ignore:end */
	});

	var win;

	if (typeof window !== "undefined") {
	    win = window;
	} else if (typeof commonjsGlobal !== "undefined") {
	    win = commonjsGlobal;
	} else if (typeof self !== "undefined") {
	    win = self;
	} else {
	    win = {};
	}

	var window_1 = win;

	/**
	 * @file resolve-url.js - Handling how URLs are resolved and manipulated
	 */

	var resolveUrl = function resolveUrl(baseURL, relativeURL) {
	  // return early if we don't need to resolve
	  if (/^[a-z]+:/i.test(relativeURL)) {
	    return relativeURL;
	  }

	  // if the base URL is relative then combine with the current location
	  if (!/\/\//i.test(baseURL)) {
	    baseURL = urlToolkit.buildAbsoluteURL(window_1.location.href, baseURL);
	  }

	  return urlToolkit.buildAbsoluteURL(baseURL, relativeURL);
	};

	/**
	 * Checks whether xhr request was redirected and returns correct url depending
	 * on `handleManifestRedirects` option
	 *
	 * @api private
	 *
	 * @param  {String} url - an url being requested
	 * @param  {XMLHttpRequest} req - xhr request result
	 *
	 * @return {String}
	 */
	var resolveManifestRedirect = function resolveManifestRedirect(handleManifestRedirect, url, req) {
	  // To understand how the responseURL below is set and generated:
	  // - https://fetch.spec.whatwg.org/#concept-response-url
	  // - https://fetch.spec.whatwg.org/#atomic-http-redirect-handling
	  if (handleManifestRedirect && req.responseURL && url !== req.responseURL) {
	    return req.responseURL;
	  }

	  return url;
	};

	/*! @name m3u8-parser @version 4.4.0 @license Apache-2.0 */

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	/**
	 * @file stream.js
	 */

	/**
	 * A lightweight readable stream implementation that handles event dispatching.
	 *
	 * @class Stream
	 */
	var Stream =
	/*#__PURE__*/
	function () {
	  function Stream() {
	    this.listeners = {};
	  }
	  /**
	   * Add a listener for a specified event type.
	   *
	   * @param {string} type the event name
	   * @param {Function} listener the callback to be invoked when an event of
	   * the specified type occurs
	   */

	  var _proto = Stream.prototype;

	  _proto.on = function on(type, listener) {
	    if (!this.listeners[type]) {
	      this.listeners[type] = [];
	    }

	    this.listeners[type].push(listener);
	  }
	  /**
	   * Remove a listener for a specified event type.
	   *
	   * @param {string} type the event name
	   * @param {Function} listener  a function previously registered for this
	   * type of event through `on`
	   * @return {boolean} if we could turn it off or not
	   */
	  ;

	  _proto.off = function off(type, listener) {
	    if (!this.listeners[type]) {
	      return false;
	    }

	    var index = this.listeners[type].indexOf(listener);
	    this.listeners[type].splice(index, 1);
	    return index > -1;
	  }
	  /**
	   * Trigger an event of the specified type on this stream. Any additional
	   * arguments to this function are passe
