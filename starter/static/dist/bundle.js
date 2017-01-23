/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	__webpack_require__(1);
	var React = __webpack_require__(5);
	var ReactDOM = __webpack_require__(6);
	var react_router_1 = __webpack_require__(7);
	var jQuery = __webpack_require__(8);
	var app_1 = __webpack_require__(9);
	var AppRenderer = (function () {
	    function AppRenderer(props) {
	        ReactDOM.render(React.createElement(react_router_1.Router, { history: react_router_1.browserHistory },
	            React.createElement(react_router_1.Route, { path: "/", component: AppRenderer.renderTaskBoard(props) }),
	            React.createElement(react_router_1.Route, { path: "/tasks", component: AppRenderer.renderTaskBoard(props) }),
	            React.createElement(react_router_1.Route, { path: "/cal", component: AppRenderer.renderCalendar(props, false) }),
	            React.createElement(react_router_1.Route, { path: "/cal/day", component: AppRenderer.renderCalendar(props, true) }),
	            React.createElement(react_router_1.Route, { path: "/cal/week", component: AppRenderer.renderCalendar(props, false) }),
	            React.createElement(react_router_1.Route, { path: "/tags", component: AppRenderer.renderTagGraph(props) })), document.getElementById("render-target"));
	    }
	    AppRenderer.renderTaskBoard = function (props) {
	        return function () { return React.createElement(app_1.App, __assign({}, props, { viewMode: app_1.AppViewMode.taskView })); };
	    };
	    AppRenderer.renderCalendar = function (props, isDayView) {
	        if (isDayView) {
	            return function () {
	                return React.createElement(app_1.App, __assign({}, props, { viewMode: app_1.AppViewMode.eventView, calendarDayView: true }));
	            };
	        }
	        return function () {
	            return React.createElement(app_1.App, __assign({}, props, { viewMode: app_1.AppViewMode.eventView, calendarDayView: false }));
	        };
	    };
	    AppRenderer.renderTagGraph = function (props) {
	        return function () { return React.createElement(app_1.App, __assign({}, props, { viewMode: app_1.AppViewMode.tagView })); };
	    };
	    return AppRenderer;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AppRenderer;
	// CSRF stuff
	function getCookie(name) {
	    var cookieValue = '';
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?
	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}
	var csrfToken = getCookie('csrftoken');
	function csrfSafeMethod(method) {
	    // these HTTP methods do not require CSRF protection
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	jQuery.ajaxSetup({
	    beforeSend: function (xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrfToken);
	        }
	    }
	});
	// Yes, this is disgusting, but it's the only way to expose this entry point without a
	// syntax error from the TS compiler.
	eval("window.AppRenderer = AppRenderer;");


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "* {\n    font-family: \"Open Sans\",\"lucida grande\",\"Segoe UI\",arial,verdana,\"lucida sans unicode\",tahoma,sans-serif!important;\n    letter-spacing: .3px;\n    color: #47525d;\n    font-weight: 100;\n}\n\nbody {\n    background: #f6f9fc;\n    margin: 0;\n}\n\ndiv.card {\n    border: 1px solid rgba(0, 0, 0, .04);\n    box-shadow: 0 1px 4px rgba(0, 0, 0, .03);\n    margin: 0 0 10px 0;\n    padding: 20px;\n    border-radius: 3px;\n    background: #fff;\n    -webkit-tap-highlight-color: transparent;\n    box-sizing: border-box;\n    display: block;\n}\n\n/* Header CSS */\ndiv.header-container {\n    display: flex;\n    justify-content: space-between;\n    flex-wrap: wrap;\n    padding: 1em 1em 0;\n    background-color: #fff;\n}\n\nh1.header-title {\n    margin: 0;\n}\n\ndiv.header-container div.view-mode-selector {\n    display: flex;\n    width: 100%;\n    margin: .5em 0;\n}\n\ndiv.header-container div.view-mode-selector a.view-mode-option {\n    margin-right: 1em;\n    text-decoration: none;\n}\n\ndiv.header-container div.view-mode-selector a.view-mode-option.-selected {\n    text-decoration: underline;\n}\n\n/* End of Header CSS */\n\n/* Task Board CSS */\ndiv.task-board {\n    width: 100%;\n}\n\ndiv.task-board div.task-board-options {\n    display: flex;\n    background-color: #fff;\n    padding: 0 1em .5em;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector {\n    display: flex;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector div.view-type-choice {\n    margin-right: .5em;\n    cursor: pointer;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector div.view-type-choice.-selected {\n    text-decoration: underline;\n}\n\ndiv.task-board div.hide-closed-tasks {\n    margin-left: .5em;\n}\n\ndiv.task-board div.task-board-tag-selector-container {\n    display: flex;\n    margin-left: 1em;\n}\n\ndiv.task-board div.task-board-tag-selector-container div.tokenizer-container {\n    margin-left: .5em;\n}\n\ndiv.task-board div.full-column-container {\n    display: flex;\n    flex-direction: row;\n    height: 100%;\n    min-height: 768px;\n}\n\ndiv.task-board div.column-container {\n    display: flex;\n    flex-direction: column;\n    width: 25%;\n    margin: .5em 1em;\n}\n\ndiv.task-board div.column-container.drop-container {\n    background-color: rgba(0, 0, 0, .04);\n}\n\ndiv.task-board div.draggable-task.-hidden {\n    display: none;\n}\n\ndiv.task-board .task,.task-title {\n    text-overflow: ellipsis;\n    overflow-x: hidden;\n}\n\n/* End of Task Board CSS */\n\n/* Task view CSS */\n.task-id {\n    font-weight: bolder;\n    text-decoration: underline;\n}\n\n.task-title {\n    font-weight: bold;\n}\n\ndiv.task-tags-container {\n    display: flex;\n}\n\ndiv.task-tags-container div.tag {\n    margin-left: .25em;\n    padding: .1em .25em;\n}\n/* End of Task view CSS */\n\n/* Calendar CSS */\ndiv.calendar {\n    width: 100%;\n}\n\ndiv.calendar div.options {\n    display: flex;\n    background-color: #fff;\n    padding: 0 1em .5em;\n}\n\ndiv.calendar div.options div.view-type-selector {\n    display: flex;\n    margin-left: .5em;\n}\n\ndiv.calendar div.options div.view-type-selector div.view-type-choice {\n    margin-right: .5em;\n    cursor: pointer;\n}\n\ndiv.calendar div.options div.view-type-selector div.view-type-choice.-selected {\n    text-decoration: underline;\n}\n\ndiv.calendar div.options div.pagination-container {\n    display: flex;\n    margin-left: .5em;\n}\n\ndiv.calendar div.options div.pagination-container div.pagination-option {\n    margin-right: .5em;\n    cursor: pointer;\n}\n\ndiv.calendar div.tag-selector-container {\n    display: flex;\n    margin-left: 1em;\n}\n\ndiv.calendar div.tag-selector-container div.tokenizer-container {\n    margin-left: .5em;\n}\n\n\ndiv.calendar div.full-column-container {\n    display: flex;\n    align-items: center;\n    flex-direction: column;\n    height: calc(100vh - 140px); /* 140px is the height of the header */\n    padding: 0 2em;\n}\n\ndiv.calendar div.full-column-container div.header-and-content-container {\n    overflow: hidden;\n    height: 100%;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n}\n\ndiv.calendar div.column-header-container {\n    display: flex;\n    margin-top: 20px;\n    margin-right: 15px;\n    text-align: center;\n}\n\ndiv.calendar div.column-header {\n    min-width: 120px;\n    flex-grow: 1;\n    height: 20px;\n}\n\ndiv.calendar div.column-header.-times {\n    max-width: 120px;\n}\n\ndiv.calendar div.column-header.single-day {\n    min-width: 360px;\n}\n\ndiv.calendar div.all-columns-container {\n    display: flex;\n    height: 100%;\n    overflow-x: hidden;\n    overflow-y: auto;\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n    border-top: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.calendar div.column-container {\n    flex-grow: 1;\n    min-width: 120px;\n    position: relative;\n}\n\n\ndiv.calendar div.column-container.-times {\n    max-width: 120px;\n}\n\ndiv.calendar div.column-container table {\n    width: 100%;\n}\n\ndiv.calendar div.column-container.single-day {\n    min-width: 360px;\n}\n\ndiv.calendar div.column-container td {\n    border-right: 1px solid rgba(0, 0, 0, .2);\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n    font-size: 14px;\n    min-width: 120px;\n    cursor: pointer;\n}\n\ndiv.calendar div.column-container.single-day td {\n    min-width: 360px;\n}\n\ndiv.calendar div.column-container tr:nth-child(odd) td {\n    border-bottom-style: dashed;\n}\n\ndiv.calendar div.column-container:first-child td {\n    border-left: 1px solid rgba(0, 0, 0, .2);\n    cursor: default; /* Prevents times from being click-able */\n    vertical-align: top;\n    text-align: right;\n}\n\ndiv.calendar div.column-container table tbody tr:first-child td {\n    border-top: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.calendar div.rendered-event-container {\n    position: absolute;\n    width: 100%; /* Will need to change when we start overlaying */\n}\n\ndiv.calendar div.rendered-event-container div.card {\n    padding: 1px .25em;\n    margin-left: 1px;\n    margin-right: 2px;\n    margin-bottom: 0;\n    overflow-y: auto;\n    height: 100%;\n}\n\ndiv.calendar div.column-container div.current-time-cursor {\n    position: absolute;\n    height: 3px;\n    background-color: #dc322f;\n    min-width: 120px;\n    width: 100%;\n    z-index: 2;\n}\n\ndiv.calendar div.column-container.single-day div.current-time-cursor {\n    min-width: 360px;\n}\n\ndiv.calendar div.column-container tr td.-selected {\n    background-color: rgba(0, 0, 0, .2);\n    border: none;\n}\n\ndiv.calendar div.rendered-event-container div.draggable-event-end {\n    cursor: ns-resize;\n    width: 100%;\n    height: 7px;\n    margin-top: -3px;\n}\n\ndiv.calendar div.rendered-event-container div.tag.card {\n    overflow-y: hidden;\n}\n\n/* End of Calendar CSS */\n\n/* Event view CSS */\ndiv.event-container {\n    font-size: 13px;\n    display: flex;\n    flex-wrap: wrap;\n    align-content: space-between;\n    overflow-x: hidden;\n    height: 100%;\n}\n\ndiv.event-container div.name {\n    flex-grow: 1;\n}\n\ndiv.event-card-container {\n    align-self: flex-end;\n    flex-grow: 1;\n    display: flex;\n    justify-content: flex-end;\n    padding-bottom: .25em;\n}\n\ndiv.event-card-container div.card {\n    margin: 0 0 0 .25em;\n    padding: .1em .25em;\n}\n/* End of Event view CSS */\n\n/* Tag graph CSS */\n.tag-graph {\n    margin: 1em 0;\n}\n\n.tags-root-container, .tag-children-container {\n    border: 1px black solid;\n}\n\n.tag-children-container {\n    margin-left: .5em;\n}\n/* End of Tag graph CSS */\n\n/* Tokenizer CSS */\ndiv.tokenizer-container {\n    display: flex;\n}\n\ndiv.tokenizer-container div.pending-token-container {\n    width: 100%;\n}\n\ndiv.tokens-container {\n    display: flex;\n    margin-right: .5em;\n}\n\ndiv.rendered-token {\n    display: flex;\n    padding: .1em .25em;\n    margin-top: -2px;\n    margin-bottom: 10px;\n}\n\ndiv.rendered-token div.remove-token {\n    margin-left: .25em;\n    cursor: pointer;\n}\n\ndiv.tokenizer-container div.pending-state-container {\n    width: 100%;\n}\n\ndiv.tokenizer-container div.autocomplete-token-container {\n    position: absolute;\n    background: #fff;\n    border-radius: 0 3px 3px;\n    border: 1px solid rgba(0, 0, 0, .2);\n    border-top: none;\n}\n\ndiv.tokenizer-container div.autocomplete-token-container div.autocomplete-token {\n    padding: .5em;\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.tokenizer-container div.autocomplete-token-container:last-child {\n    border-bottom: none;\n}\n\ndiv.tokenizer-container div.autocomplete-token-container div.autocomplete-token:hover {\n    cursor: pointer;\n    background-color: #f6f9fc;\n}\n\ndiv.tokenizer-container div.autocomplete-token-container div.autocomplete-token.-selected {\n    background-color: #f6f9fc;\n}\n/* End of Tokenizer CSS */\n\n/* Modal CSS */\ndiv.modal-container div.background {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, .2);\n    z-index: 3;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\ndiv.modal.card {\n    min-width: 350px;\n}\n\ndiv.modal h3 {\n    margin: 0;\n}\n\ndiv.modal-container div.cancel-button-container {\n    cursor: pointer;\n    float: right;\n}\n\ndiv.modal label {\n    display: block;\n    padding-top: .5em;\n}\n\ndiv.modal input,textarea,select {\n    width: 100%;\n    background-color: #fff;\n    border: 1px solid rgba(0, 0, 0, .4);\n    margin: 0;\n    padding: 0;\n}\n\ndiv.modal input[type=button] {\n    margin-top: .5em;\n    height: 30px;\n}\n\ndiv.modal div.rendered-token {\n    margin-top: 0;\n}\n/* End of Modal CSS */", ""]);
	
	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = ReactRouter;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var jQuery = __webpack_require__(8);
	var tag_graph_1 = __webpack_require__(10);
	var task_board_1 = __webpack_require__(14);
	var calendar_1 = __webpack_require__(28);
	var app_header_1 = __webpack_require__(32);
	var notifier_1 = __webpack_require__(33);
	var AppViewMode;
	(function (AppViewMode) {
	    AppViewMode[AppViewMode["taskView"] = 0] = "taskView";
	    AppViewMode[AppViewMode["eventView"] = 1] = "eventView";
	    AppViewMode[AppViewMode["tagView"] = 2] = "tagView";
	})(AppViewMode = exports.AppViewMode || (exports.AppViewMode = {}));
	var App = (function (_super) {
	    __extends(App, _super);
	    function App(props) {
	        var _this = _super.call(this, props) || this;
	        var newState = {
	            tasks: props.tasks,
	            events: props.events,
	            tags: props.tags,
	            tagsById: {},
	        };
	        App.updateTagsById(newState);
	        _this.state = newState;
	        return _this;
	    }
	    App.prototype.createTask = function (task) {
	        var _this = this;
	        delete task["id"];
	        jQuery.post('/api/1/task/create', task, function (newTaskJson) {
	            _this.state.tasks.push(JSON.parse(newTaskJson));
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.updateTask = function (task) {
	        var _this = this;
	        jQuery.post('/api/1/task/update', task, function (updatedTaskJson) {
	            var updatedTask = JSON.parse(updatedTaskJson);
	            _this.state.tasks = _this.state.tasks.map(function (task) {
	                if (task.id == updatedTask.id) {
	                    return updatedTask;
	                }
	                else {
	                    return task;
	                }
	            });
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.deleteTask = function (task) {
	        var _this = this;
	        jQuery.post('/api/1/task/delete', { id: task.id }, function (deletedTaskJson) {
	            var deletedTaskId = JSON.parse(deletedTaskJson).id;
	            _this.state.tasks = _this.state.tasks.filter(function (task) {
	                return task.id != deletedTaskId;
	            });
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.createEvent = function (event) {
	        var _this = this;
	        delete event["id"];
	        jQuery.post('/api/1/event/create', event, function (newEventJson) {
	            _this.state.events.push(JSON.parse(newEventJson));
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.updateEvent = function (event) {
	        var _this = this;
	        jQuery.post('/api/1/event/update', event, function (updatedEventJson) {
	            var updatedEvent = JSON.parse(updatedEventJson);
	            _this.state.events = _this.state.events.map(function (event) {
	                if (event.id == updatedEvent.id) {
	                    return updatedEvent;
	                }
	                else {
	                    return event;
	                }
	            });
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.deleteEvent = function (event) {
	        var _this = this;
	        jQuery.post('/api/1/event/delete', { id: event.id }, function (deletedEventJson) {
	            var deletedEventId = JSON.parse(deletedEventJson).id;
	            _this.state.events = _this.state.events.filter(function (event) {
	                return event.id != deletedEventId;
	            });
	            _this.setState(_this.state);
	        });
	    };
	    App.updateTagsById = function (state) {
	        var tagsById = {};
	        for (var _i = 0, _a = state.tags; _i < _a.length; _i++) {
	            var tag = _a[_i];
	            tagsById[tag.id] = tag;
	        }
	        state.tagsById = tagsById;
	    };
	    App.prototype.createTag = function (tag) {
	        var _this = this;
	        delete tag["id"];
	        jQuery.post('/api/1/tag/create', tag, function (newTagJson) {
	            _this.state.tags.push(JSON.parse(newTagJson));
	            App.updateTagsById(_this.state);
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.updateTag = function (tag) {
	        var _this = this;
	        jQuery.post('/api/1/tag/update', tag, function (updatedTagJson) {
	            var updatedTag = JSON.parse(updatedTagJson);
	            _this.state.tags = _this.state.tags.map(function (tag) {
	                if (tag.id == updatedTag.id) {
	                    return updatedTag;
	                }
	                else {
	                    return tag;
	                }
	            });
	            App.updateTagsById(_this.state);
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.deleteTag = function (tag) {
	        // TODO: Filter out all tags and children or something
	    };
	    App.prototype.renderNotifier = function () {
	        return React.createElement(notifier_1.NotifierComponent, { tasks: this.state.tasks, events: this.state.events });
	    };
	    App.prototype.renderTaskBoard = function () {
	        return React.createElement(task_board_1.TaskBoardComponent, { meUser: this.props.meUser, tasks: this.state.tasks, tagsById: this.state.tagsById, createTask: this.createTask.bind(this), updateTask: this.updateTask.bind(this), deleteTask: this.deleteTask.bind(this) });
	    };
	    App.prototype.renderCalendar = function () {
	        var viewType = calendar_1.CalendarViewType.week;
	        if (this.props.calendarDayView) {
	            viewType = calendar_1.CalendarViewType.day;
	        }
	        return React.createElement(calendar_1.CalendarComponent, { meUser: this.props.meUser, events: this.state.events, tagsById: this.state.tagsById, tasks: this.state.tasks, initialViewType: viewType, createEvent: this.createEvent.bind(this), updateEvent: this.updateEvent.bind(this), deleteEvent: this.deleteEvent.bind(this) });
	    };
	    App.prototype.renderTagGraph = function () {
	        return React.createElement(tag_graph_1.TagGraphComponent, { meUser: this.props.meUser, tagsById: this.state.tagsById, createTag: this.createTag.bind(this), updateTag: this.updateTag.bind(this), deleteTag: this.deleteTag.bind(this) });
	    };
	    App.prototype.renderBoard = function () {
	        if (this.props.viewMode == AppViewMode.taskView) {
	            return React.createElement("div", { className: "board-container" }, this.renderTaskBoard());
	        }
	        else if (this.props.viewMode == AppViewMode.eventView) {
	            return React.createElement("div", { className: "calendar-container" }, this.renderCalendar());
	        }
	        else if (this.props.viewMode == AppViewMode.tagView) {
	            return React.createElement("div", { className: "tag-graph-container" }, this.renderTagGraph());
	        }
	    };
	    App.prototype.render = function () {
	        return React.createElement("div", null,
	            React.createElement(app_header_1.AppHeader, { meUser: this.props.meUser, viewMode: this.props.viewMode }),
	            this.renderNotifier(),
	            this.renderBoard());
	    };
	    return App;
	}(React.Component));
	exports.App = App;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var edit_tag_1 = __webpack_require__(11);
	var create_tag_1 = __webpack_require__(13);
	var TagGraphComponent = (function (_super) {
	    __extends(TagGraphComponent, _super);
	    function TagGraphComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.state = _this.getState(props);
	        return _this;
	    }
	    TagGraphComponent.prototype.componentWillReceiveProps = function (props) {
	        this.setState(this.getState(props));
	    };
	    TagGraphComponent.prototype.getState = function (props) {
	        var _a = this.computeTagGraph(props.tagsById), tagGraph = _a[0], rootTagIds = _a[1];
	        return {
	            tagGraph: tagGraph,
	            rootTagIds: rootTagIds,
	            tagsById: props.tagsById,
	            editingTag: null,
	        };
	    };
	    TagGraphComponent.prototype.computeTagGraph = function (tagsById) {
	        var tagGraph = {};
	        // Initially we think that all tags are root tags.
	        var rootTagIds = {};
	        Object.keys(tagsById).forEach(function (tagId) {
	            rootTagIds[tagId] = true;
	        });
	        Object.keys(tagsById).forEach(function (tagId) {
	            var tag = tagsById[+tagId];
	            var childTagIds = [];
	            for (var _i = 0, _a = tag.childTagIds; _i < _a.length; _i++) {
	                var childTagId = _a[_i];
	                childTagIds.push(childTagId);
	                if (rootTagIds.hasOwnProperty("" + childTagId)) {
	                    delete rootTagIds[childTagId];
	                }
	            }
	            tagGraph[tag.id] = childTagIds;
	        });
	        var rootTagIdList = [];
	        Object.keys(rootTagIds).forEach(function (rootTagId) {
	            rootTagIdList.push(+rootTagId);
	        });
	        return [tagGraph, rootTagIdList];
	    };
	    TagGraphComponent.prototype.onDoubleClick = function (tag, event) {
	        // Idk, open an editor modal or something
	        this.state.editingTag = tag;
	        this.setState(this.state);
	        // Don't let this keep going to the parent element.
	        event.preventDefault();
	        event.stopPropagation();
	    };
	    TagGraphComponent.prototype.renderTagById = function (tagId) {
	        var _this = this;
	        var tag = this.state.tagsById[tagId];
	        var renderChildren = function () {
	            if (tag.childTagIds.length == 0) {
	                return;
	            }
	            return (React.createElement("div", { className: "tag-children-container" }, tag.childTagIds.map(_this.renderTagById.bind(_this))));
	        };
	        return React.createElement("div", { className: "tag-container", key: tag.id, onDoubleClick: this.onDoubleClick.bind(this, tag) },
	            "Name: ",
	            tag.name,
	            renderChildren());
	    };
	    TagGraphComponent.prototype.renderFromRootTagId = function (rootTagId) {
	        return React.createElement("div", { className: "tags-root-container", key: rootTagId }, this.renderTagById(rootTagId));
	    };
	    TagGraphComponent.prototype.renderTags = function () {
	        return React.createElement("div", { className: "tags-container" }, this.state.rootTagIds.map(this.renderFromRootTagId.bind(this)));
	    };
	    TagGraphComponent.prototype.renderEditingTag = function () {
	        if (!this.state.editingTag) {
	            return;
	        }
	        return React.createElement(edit_tag_1.EditTagComponent, { tag: this.state.editingTag, tagsById: this.state.tagsById, updateTag: this.props.updateTag, deleteTag: this.props.deleteTag });
	    };
	    TagGraphComponent.prototype.renderCreateTag = function () {
	        return React.createElement(create_tag_1.CreateTagComponent, { meUser: this.props.meUser, createTag: this.props.createTag, tagsById: this.state.tagsById });
	    };
	    TagGraphComponent.prototype.render = function () {
	        return React.createElement("div", { className: "tag-graph" },
	            this.renderTags(),
	            this.renderEditingTag(),
	            this.renderCreateTag());
	    };
	    return TagGraphComponent;
	}(React.Component));
	exports.TagGraphComponent = TagGraphComponent;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tokenizer_1 = __webpack_require__(12);
	var EditTagComponent = (function (_super) {
	    __extends(EditTagComponent, _super);
	    function EditTagComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.state = {
	            tag: props.tag,
	            tagsById: props.tagsById,
	        };
	        return _this;
	    }
	    EditTagComponent.prototype.componentWillReceiveProps = function (newProps) {
	        this.setState({
	            tag: newProps.tag,
	            tagsById: newProps.tagsById
	        });
	    };
	    EditTagComponent.prototype.submitForm = function (eventType) {
	        if (eventType == "save") {
	            this.props.updateTag(this.state.tag);
	        }
	        else {
	            this.props.deleteTag(this.state.tag);
	        }
	    };
	    EditTagComponent.prototype.updateName = function (event) {
	        this.state.tag.name = event.target.value;
	        this.setState(this.state);
	    };
	    EditTagComponent.prototype.getCurrentChildren = function () {
	        var _this = this;
	        var childrenNames = [];
	        this.state.tag.childTagIds.forEach(function (tagId) {
	            var tag = _this.state.tagsById[tagId];
	            childrenNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return childrenNames;
	    };
	    EditTagComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        // We should think about excluding tokens from here that would cause cycles.
	        var allNames = [];
	        Object.keys(this.state.tagsById).forEach(function (tagId) {
	            var tag = _this.state.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    EditTagComponent.prototype.retrieveChildNames = function (tokens) {
	        this.state.tag.childTagIds = tokens.map(function (token) {
	            return token.value;
	        });
	        this.setState(this.state);
	    };
	    EditTagComponent.prototype.renderForm = function () {
	        return React.createElement("div", null,
	            React.createElement("div", { className: "name-container" },
	                React.createElement("label", { htmlFor: "name" }, "Name: "),
	                React.createElement("input", { type: "text", name: "name", value: this.state.tag.name, onChange: this.updateName.bind(this) })),
	            React.createElement("div", { className: "children-container" },
	                React.createElement("label", { htmlFor: "children" }, "Children: "),
	                React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.retrieveChildNames.bind(this), initialValues: this.getCurrentChildren(), possibleTokens: this.getAllTagNames() })),
	            React.createElement("input", { type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete") }),
	            React.createElement("input", { type: "button", value: "save", onClick: this.submitForm.bind(this, "save") }));
	    };
	    EditTagComponent.prototype.render = function () {
	        return React.createElement("div", { className: "edit-tag-container" },
	            React.createElement("h3", null, "Tag Edit Form:"),
	            this.renderForm());
	    };
	    return EditTagComponent;
	}(React.Component));
	exports.EditTagComponent = EditTagComponent;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var TokenizerComponent = (function (_super) {
	    __extends(TokenizerComponent, _super);
	    function TokenizerComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.state = _this.getState(props);
	        return _this;
	    }
	    TokenizerComponent.prototype.componentWillReceiveProps = function (newProps) {
	        this.setState(this.getState(newProps));
	    };
	    TokenizerComponent.prototype.getState = function (props) {
	        var _this = this;
	        var newState = {
	            tokens: [],
	            pendingToken: '',
	            autoCompleteTokens: [],
	            selectedTokenIndex: -1,
	        };
	        if (props.initialValues) {
	            props.initialValues.forEach(function (token) {
	                if (_this.props.tokenLimit && newState.tokens.length >= _this.props.tokenLimit) {
	                    // We are at the limit of the number of tokens, return early.
	                    return;
	                }
	                newState.tokens.push(token);
	            });
	        }
	        if (this.state) {
	            newState.pendingToken = this.state.pendingToken;
	            newState.autoCompleteTokens = this.state.autoCompleteTokens;
	            newState.selectedTokenIndex = this.state.selectedTokenIndex;
	        }
	        return newState;
	    };
	    TokenizerComponent.prototype.updateAutoComplete = function (newPendingToken) {
	        var _this = this;
	        newPendingToken = newPendingToken.toLowerCase();
	        if (!this.props.possibleTokens || newPendingToken.length == 0) {
	            // No tokens to autocomplete to.
	            return [];
	        }
	        // Really dumb linear time search!
	        var rankAndTokens = [];
	        this.props.possibleTokens.forEach(function (possibleToken) {
	            var index = possibleToken.label.toLowerCase().indexOf(newPendingToken);
	            if (index >= 0) {
	                // Note: This makes this O(n^2) for now but whatever.
	                if (!_this.tokenAlreadyAdded(possibleToken)) {
	                    rankAndTokens.push([index, possibleToken]);
	                }
	            }
	        });
	        // Sort by the index, which should put prefix matches first.
	        rankAndTokens.sort(function (rankAndToken1, rankAndToken2) {
	            var rank1 = rankAndToken1[0], token1 = rankAndToken1[1];
	            var rank2 = rankAndToken2[0], token2 = rankAndToken2[1];
	            if (rank1 != rank2) {
	                return rank1 - rank2;
	            }
	            if (token1.label < token2.label) {
	                return -1;
	            }
	            else if (token1.label == token2.label) {
	                return 0;
	            }
	            else {
	                return 1;
	            }
	        });
	        // Only keep the top 5 matches.
	        rankAndTokens = rankAndTokens.slice(0, 5);
	        return rankAndTokens.map(function (rankAndToken) {
	            return rankAndToken[1];
	        });
	    };
	    TokenizerComponent.prototype.updatePendingToken = function (event) {
	        this.state.pendingToken = event.target.value.trim();
	        this.state.autoCompleteTokens = this.updateAutoComplete(event.target.value);
	        // Update the cursor after the resize
	        if (this.state.selectedTokenIndex == null) {
	            this.state.selectedTokenIndex = -1;
	        }
	        else if (this.state.selectedTokenIndex >= this.state.autoCompleteTokens.length) {
	            this.state.selectedTokenIndex = this.state.autoCompleteTokens.length - 1;
	        }
	        this.setState(this.state);
	    };
	    TokenizerComponent.prototype.tokenAlreadyAdded = function (token) {
	        var found = false;
	        this.state.tokens.forEach(function (t) {
	            if (token.value == t.value) {
	                found = true;
	            }
	        });
	        return found;
	    };
	    TokenizerComponent.prototype.appendToken = function (token) {
	        this.state.tokens.push({
	            label: token.label,
	            value: token.value,
	        });
	        this.state.pendingToken = '';
	        this.state.autoCompleteTokens = [];
	        this.state.selectedTokenIndex = -1;
	        this.setState(this.state);
	        this.props.onChange(this.state.tokens);
	    };
	    TokenizerComponent.prototype.onClick = function (token, event) {
	        event.preventDefault();
	        this.appendToken(token);
	    };
	    TokenizerComponent.prototype.onKeyPress = function (event) {
	        if (event.key == "Enter") {
	            if (this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit) {
	                // We are at the limit of the number of tokens, return early.
	                return;
	            }
	            if (this.state.selectedTokenIndex >= 0) {
	                // We just selected a token.
	                this.appendToken(this.state.autoCompleteTokens[this.state.selectedTokenIndex]);
	                return;
	            }
	            // Otherwise, attempt to form a token out of what's in the text box.
	            var newToken_1 = this.state.pendingToken;
	            var foundMatch_1 = false;
	            var maybeToken_1 = { label: newToken_1, value: newToken_1 };
	            if (!this.props.possibleTokens) {
	                foundMatch_1 = true;
	            }
	            else {
	                this.props.possibleTokens.forEach(function (possibleToken) {
	                    if (possibleToken.label.toLowerCase() == newToken_1.toLowerCase()) {
	                        foundMatch_1 = true;
	                        maybeToken_1 = possibleToken;
	                    }
	                });
	            }
	            if (foundMatch_1 && !this.tokenAlreadyAdded(maybeToken_1)) {
	                this.appendToken(maybeToken_1);
	            }
	            else {
	            }
	        }
	    };
	    TokenizerComponent.prototype.onKeyDown = function (event) {
	        if (event.key == "ArrowDown") {
	            if (!this.state.autoCompleteTokens.length) {
	                return;
	            }
	            this.state.selectedTokenIndex = Math.min(this.state.selectedTokenIndex + 1, this.state.autoCompleteTokens.length - 1);
	            this.setState(this.state);
	        }
	        else if (event.key == "ArrowUp") {
	            if (!this.state.autoCompleteTokens.length) {
	                return;
	            }
	            this.state.selectedTokenIndex = Math.max(this.state.selectedTokenIndex - 1, 0);
	            this.setState(this.state);
	        }
	    };
	    TokenizerComponent.prototype.removeToken = function (tokenToRemove) {
	        this.state.tokens = this.state.tokens.filter(function (token) {
	            return tokenToRemove.label != token.label;
	        });
	        this.setState(this.state);
	        this.props.onChange(this.state.tokens);
	    };
	    TokenizerComponent.prototype.getTokenValues = function () {
	        // This function intended to be called via. ref to get the list of tokens.
	        // TODO: Decide if we want a call like this to attempt to tokenize whatever is left in
	        // pendingToken
	        return this.state.tokens;
	    };
	    TokenizerComponent.prototype.renderToken = function (token, index) {
	        return (React.createElement("div", { className: "card rendered-token", key: index },
	            token.label,
	            React.createElement("div", { className: "remove-token", onClick: this.removeToken.bind(this, token) }, "x")));
	    };
	    TokenizerComponent.prototype.renderTokens = function () {
	        if (!this.state.tokens.length) {
	            return;
	        }
	        return (React.createElement("div", { className: "tokens-container" }, this.state.tokens.map(this.renderToken.bind(this))));
	    };
	    TokenizerComponent.prototype.shouldHidePendingToken = function () {
	        return this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit;
	    };
	    TokenizerComponent.prototype.renderPendingToken = function () {
	        // If we are at the maximum number of tokens, don't render the container
	        if (this.shouldHidePendingToken()) {
	            return;
	        }
	        return (React.createElement("div", { className: "pending-token-container" },
	            React.createElement("input", { type: "text", value: this.state.pendingToken, onChange: this.updatePendingToken.bind(this), onKeyPress: this.onKeyPress.bind(this), onKeyDown: this.onKeyDown.bind(this) })));
	    };
	    TokenizerComponent.prototype.renderAutoComplete = function () {
	        var _this = this;
	        if (this.shouldHidePendingToken() || !this.state.autoCompleteTokens.length) {
	            return;
	        }
	        return (React.createElement("div", { className: "autocomplete-token-container" }, this.state.autoCompleteTokens.map(function (token, index) {
	            var className = "autocomplete-token";
	            if (index == _this.state.selectedTokenIndex) {
	                className += " -selected";
	            }
	            return React.createElement("div", { className: className, key: token.value, onClick: _this.onClick.bind(_this, token) }, token.label);
	        })));
	    };
	    TokenizerComponent.prototype.render = function () {
	        return (React.createElement("div", { className: "tokenizer-container" },
	            this.renderTokens(),
	            React.createElement("div", { className: "pending-state-container" },
	                this.renderPendingToken(),
	                this.renderAutoComplete())));
	    };
	    return TokenizerComponent;
	}(React.Component));
	exports.TokenizerComponent = TokenizerComponent;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tokenizer_1 = __webpack_require__(12);
	var CreateTagComponent = (function (_super) {
	    __extends(CreateTagComponent, _super);
	    function CreateTagComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.state = {
	            tag: {
	                id: 0,
	                name: '',
	                childTagIds: [],
	                ownerId: _this.props.meUser.id,
	            },
	        };
	        return _this;
	    }
	    CreateTagComponent.prototype.submitForm = function () {
	        this.props.createTag(this.state.tag);
	    };
	    CreateTagComponent.prototype.updateName = function (event) {
	        this.state.tag.name = event.target.value;
	        this.setState(this.state);
	    };
	    CreateTagComponent.prototype.getCurrentChildren = function () {
	        var _this = this;
	        var childrenNames = [];
	        this.state.tag.childTagIds.forEach(function (tagId) {
	            var tag = _this.props.tagsById[tagId];
	            childrenNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return childrenNames;
	    };
	    CreateTagComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        // We should think about excluding tokens from here that would cause cycles.
	        var allNames = [];
	        Object.keys(this.props.tagsById).forEach(function (tagId) {
	            var tag = _this.props.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    CreateTagComponent.prototype.retrieveChildNames = function (tokens) {
	        this.state.tag.childTagIds = tokens.map(function (token) {
	            return token.value;
	        });
	        this.setState(this.state);
	    };
	    CreateTagComponent.prototype.renderForm = function () {
	        return React.createElement("div", null,
	            React.createElement("div", { className: "name-container" },
	                React.createElement("label", { htmlFor: "name" }, "Name: "),
	                React.createElement("input", { type: "text", name: "name", value: this.state.tag.name, onChange: this.updateName.bind(this) })),
	            React.createElement("div", { className: "children-container" },
	                React.createElement("label", { htmlFor: "children" }, "Children: "),
	                React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.retrieveChildNames.bind(this), initialValues: this.getCurrentChildren(), possibleTokens: this.getAllTagNames() })),
	            React.createElement("input", { type: "button", value: "create", onClick: this.submitForm.bind(this) }));
	    };
	    CreateTagComponent.prototype.render = function () {
	        return React.createElement("div", { className: "create-tag-container" },
	            React.createElement("h3", null, "Create Tag Form:"),
	            this.renderForm());
	    };
	    return CreateTagComponent;
	}(React.Component));
	exports.CreateTagComponent = CreateTagComponent;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var jQuery = __webpack_require__(8);
	var edit_task_1 = __webpack_require__(15);
	var models_1 = __webpack_require__(16);
	var task_1 = __webpack_require__(17);
	var tokenizer_1 = __webpack_require__(12);
	var modal_1 = __webpack_require__(27);
	var TaskBoardViewType;
	(function (TaskBoardViewType) {
	    TaskBoardViewType[TaskBoardViewType["status"] = 0] = "status";
	    TaskBoardViewType[TaskBoardViewType["priority"] = 1] = "priority";
	})(TaskBoardViewType = exports.TaskBoardViewType || (exports.TaskBoardViewType = {}));
	var TaskBoardComponent = (function (_super) {
	    __extends(TaskBoardComponent, _super);
	    function TaskBoardComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this._dragTargetElement = null;
	        _this.state = _this.getState(props, TaskBoardViewType.status);
	        return _this;
	    }
	    TaskBoardComponent.prototype.componentWillReceiveProps = function (props) {
	        this.setState(this.getState(props, this.state.viewType));
	    };
	    TaskBoardComponent.prototype.getState = function (props, viewType) {
	        var _a = this.divideByType(props.tasks, viewType), headers = _a[0], columnTypes = _a[1], columns = _a[2];
	        var newState = {
	            viewType: viewType,
	            columns: columns,
	            headers: headers,
	            columnTypes: columnTypes,
	            createColumnType: null,
	            draggingTask: null,
	            editingTask: null,
	            selectedTag: null,
	            shouldHideClosedTasks: (this.state) ? this.state.shouldHideClosedTasks : true,
	        };
	        if (this.state && this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
	            // Copy over the previous selectedTag
	            newState.selectedTag = this.state.selectedTag;
	        }
	        return newState;
	    };
	    TaskBoardComponent.prototype.divideByType = function (tasks, type) {
	        var _this = this;
	        var columns = {};
	        var columnList = [];
	        var headerList = [];
	        var columnTypes = [];
	        var typeToHelpers = {};
	        typeToHelpers[TaskBoardViewType.status] = {
	            attr: "state",
	            orderedNameAndValue: models_1.stateNameList,
	            sortFunc: function (a, b) {
	                // This is to put UNKNOWN priority at the top.
	                var aPriority = a.priority == 0 ? 1000 : a.priority;
	                var bPriority = b.priority == 0 ? 1000 : b.priority;
	                return bPriority - aPriority;
	            }
	        };
	        typeToHelpers[TaskBoardViewType.priority] = {
	            attr: "priority",
	            orderedNameAndValue: models_1.priorityNameList,
	            sortFunc: function (a, b) {
	                return a.state - b.state;
	            }
	        };
	        if (!typeToHelpers[type]) {
	            throw Error("Split type not implemented: " + type);
	        }
	        var _a = typeToHelpers[type], attr = _a.attr, orderedNameAndValue = _a.orderedNameAndValue, sortFunc = _a.sortFunc;
	        var allChildIdsOfSelectedTag = {};
	        if (this.state && this.state.selectedTag) {
	            var queue = [this.state.selectedTag];
	            while (queue.length) {
	                var curTag = queue.pop();
	                allChildIdsOfSelectedTag[curTag.id] = true;
	                for (var _i = 0, _b = curTag.childTagIds; _i < _b.length; _i++) {
	                    var tagId = _b[_i];
	                    if (!allChildIdsOfSelectedTag[tagId]) {
	                        queue.push(this.props.tagsById[tagId]);
	                    }
	                }
	            }
	        }
	        var shouldHideTask = function (task) {
	            if (!_this.state) {
	                // Other checks can only return true if state is defined.
	                return false;
	            }
	            if (task.state == 1000) {
	                if (type == TaskBoardViewType.priority && _this.state.shouldHideClosedTasks) {
	                    return true;
	                }
	            }
	            if (_this.state.selectedTag) {
	                // See if the task has the right tag
	                var matches_1 = false;
	                task.tagIds.forEach(function (tagId) {
	                    matches_1 = matches_1 || allChildIdsOfSelectedTag[tagId];
	                });
	                if (!matches_1) {
	                    return true;
	                }
	            }
	            return false;
	        };
	        // Categorize each task
	        tasks.forEach(function (task) {
	            if (shouldHideTask(task)) {
	                return;
	            }
	            if (!columns[task[attr]]) {
	                columns[task[attr]] = [task];
	            }
	            else {
	                columns[task[attr]].push(task);
	            }
	        });
	        // Order the columns
	        orderedNameAndValue.forEach(function (nameAndValue) {
	            var name = nameAndValue[0], value = nameAndValue[1];
	            // Sort each column
	            var column = columns[value] || [];
	            column.sort(sortFunc);
	            columnList.push(columns[value] || []);
	            headerList.push(name);
	            columnTypes.push(value);
	        });
	        return [headerList, columnTypes, columnList];
	    };
	    TaskBoardComponent.prototype.onDragStart = function (task, event) {
	        if (this.state.draggingTask) {
	            throw Error("Already was dragging a task...");
	        }
	        this.state.draggingTask = task;
	        this.setState(this.state);
	        this._dragTargetElement = jQuery(event.target);
	    };
	    TaskBoardComponent.prototype.onDragEnd = function (task) {
	        if (this.state.draggingTask != task) {
	            return;
	        }
	        // Clean up any leftover state if we didn't successfully drop somewhere
	        this.state.draggingTask = null;
	        this.setState(this.state);
	        this._dragTargetElement.show();
	    };
	    TaskBoardComponent.prototype.onDrop = function (columnType, event) {
	        if (!this.state.draggingTask) {
	            // No task was being dragged
	            return;
	        }
	        event.preventDefault();
	        // Update the task with the new column
	        if (this.state.viewType == TaskBoardViewType.status) {
	            this.state.draggingTask.state = columnType;
	        }
	        else if (this.state.viewType == TaskBoardViewType.priority) {
	            this.state.draggingTask.priority = columnType;
	        }
	        else {
	            throw Error("Haven't implement drag and drop for this view type yet");
	        }
	        this.props.updateTask(this.state.draggingTask);
	        jQuery(event.target).removeClass("drop-container");
	        this.state.draggingTask = null;
	        this.setState(this.state);
	        this._dragTargetElement.show();
	    };
	    TaskBoardComponent.prototype.onDragOver = function (event) {
	        if (!this.state.draggingTask) {
	            // No task was being dragged
	            return;
	        }
	        event.preventDefault();
	        this._dragTargetElement.hide();
	        jQuery(event.target).addClass("drop-container");
	    };
	    TaskBoardComponent.prototype.onDragLeave = function (event) {
	        if (!this.state.draggingTask) {
	            // No event was being dragged
	            return;
	        }
	        jQuery(event.target).removeClass("drop-container");
	    };
	    TaskBoardComponent.prototype.onDoubleClick = function (task) {
	        // Idk, open an editor modal or something
	        this.state.editingTask = task;
	        this.setState(this.state);
	    };
	    TaskBoardComponent.prototype.changeViewType = function (type) {
	        var _a = this.divideByType(this.props.tasks, type), headers = _a[0], columnTypes = _a[1], columns = _a[2];
	        this.state.viewType = type;
	        this.state.headers = headers;
	        this.state.columnTypes = columnTypes;
	        this.state.columns = columns;
	        this.setState(this.state);
	    };
	    TaskBoardComponent.prototype.changeHideClosedTasks = function () {
	        this.state.shouldHideClosedTasks = !this.state.shouldHideClosedTasks;
	        // As a hack to reflow the columns, we will "change the view type to the current one".
	        this.changeViewType(this.state.viewType);
	        // We omit a call to setState ourselves because the hiding of the task will also call
	        // setState.
	    };
	    TaskBoardComponent.prototype.getCurrentTagToken = function () {
	        if (!this.state.selectedTag) {
	            return [];
	        }
	        return [{
	                label: this.state.selectedTag.name,
	                value: this.state.selectedTag.id,
	            }];
	    };
	    TaskBoardComponent.prototype.changeCurrentTagToken = function (newTokens) {
	        if (newTokens.length) {
	            this.state.selectedTag = this.props.tagsById[newTokens[0].value];
	        }
	        else {
	            this.state.selectedTag = null;
	        }
	        // As a hack to reflow the columns, we will "change the view type to the current one".
	        this.changeViewType(this.state.viewType);
	    };
	    TaskBoardComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        // We should think about excluding tokens from here that would cause cycles.
	        var allNames = [];
	        Object.keys(this.props.tagsById).forEach(function (tagId) {
	            var tag = _this.props.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    TaskBoardComponent.prototype.clearCreateColumnType = function () {
	        this.state.createColumnType = null;
	        this.setState(this.state);
	    };
	    TaskBoardComponent.prototype.createTask = function (columnType) {
	        if (this.state.createColumnType != null) {
	            // Already creating... cancel this request
	            return;
	        }
	        this.state.createColumnType = columnType;
	        this.setState(this.state);
	    };
	    TaskBoardComponent.prototype.clearEditingTask = function () {
	        this.state.editingTask = null;
	        this.setState(this.state);
	    };
	    TaskBoardComponent.prototype.renderTypeChoice = function (type) {
	        var className = "view-type-choice";
	        if (type == this.state.viewType) {
	            className += " -selected";
	        }
	        var typeToName = {};
	        typeToName[TaskBoardViewType.priority] = "Priority";
	        typeToName[TaskBoardViewType.status] = "Status";
	        return (React.createElement("div", { className: className, key: type, onClick: this.changeViewType.bind(this, type) }, typeToName[type]));
	    };
	    TaskBoardComponent.prototype.renderTypeSelector = function () {
	        return (React.createElement("div", { className: "view-type-selector" },
	            this.renderTypeChoice(TaskBoardViewType.priority),
	            this.renderTypeChoice(TaskBoardViewType.status)));
	    };
	    TaskBoardComponent.prototype.renderHideClosedTasks = function () {
	        if (this.state.viewType == TaskBoardViewType.status) {
	            // Don't show an empty column...
	            return;
	        }
	        return (React.createElement("div", { className: "hide-closed-tasks" },
	            React.createElement("label", { htmlFor: "hide-closed" }, "Hide closed?"),
	            React.createElement("input", { id: "hide-closed", type: "checkbox", onChange: this.changeHideClosedTasks.bind(this), checked: this.state.shouldHideClosedTasks })));
	    };
	    TaskBoardComponent.prototype.renderOptions = function () {
	        return (React.createElement("div", { className: "task-board-options" },
	            this.renderTypeSelector(),
	            this.renderTagSelector(),
	            this.renderHideClosedTasks()));
	    };
	    TaskBoardComponent.prototype.renderTagSelector = function () {
	        return (React.createElement("div", { className: "task-board-tag-selector-container" },
	            React.createElement("div", { className: "tag-selector-label" }, "Filter Tag:"),
	            React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.changeCurrentTagToken.bind(this), initialValues: this.getCurrentTagToken(), possibleTokens: this.getAllTagNames(), tokenLimit: 1 })));
	    };
	    TaskBoardComponent.prototype.renderColumn = function (column, header, columnType) {
	        var _this = this;
	        return React.createElement("div", { className: "column-container", key: header, onDrop: this.onDrop.bind(this, columnType), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this), onClick: this.createTask.bind(this, columnType) },
	            React.createElement("div", { className: "column-header" }, header),
	            column.map(function (task) {
	                // TODO: determine draggability programatically
	                return React.createElement("div", { key: task.id, className: "draggable-task", draggable: true, onDragStart: _this.onDragStart.bind(_this, task), onDragEnd: _this.onDragEnd.bind(_this, task), onClick: function (e) { e.stopPropagation(); return false; }, onDoubleClick: _this.onDoubleClick.bind(_this, task) },
	                    React.createElement(task_1.TaskComponent, { task: task, viewType: _this.state.viewType, tagsById: _this.props.tagsById }));
	            }));
	    };
	    TaskBoardComponent.prototype.renderColumns = function () {
	        var renderedColumns = [];
	        var i = 0;
	        for (; i < this.state.columns.length; i++) {
	            renderedColumns.push(this.renderColumn(this.state.columns[i], this.state.headers[i], this.state.columnTypes[i]));
	        }
	        return React.createElement("div", { className: "full-column-container" }, renderedColumns);
	    };
	    TaskBoardComponent.prototype.renderEditingTask = function () {
	        if (!this.state.editingTask) {
	            return;
	        }
	        return React.createElement(modal_1.ModalComponent, { cancelFunc: this.clearEditingTask.bind(this) },
	            React.createElement(edit_task_1.EditTaskComponent, { meUser: this.props.meUser, task: this.state.editingTask, tagsById: this.props.tagsById, createMode: false, createTask: function (task) { }, updateTask: this.props.updateTask, deleteTask: this.props.deleteTask }));
	    };
	    TaskBoardComponent.prototype.renderCreateTask = function () {
	        if (this.state.createColumnType == null) {
	            return;
	        }
	        var initialTags = [];
	        if (this.state.selectedTag) {
	            initialTags.push(this.state.selectedTag.id);
	        }
	        return React.createElement(modal_1.ModalComponent, { cancelFunc: this.clearCreateColumnType.bind(this) },
	            React.createElement(edit_task_1.EditTaskComponent, { meUser: this.props.meUser, tagsById: this.props.tagsById, createMode: true, createTask: this.props.createTask, initialTags: initialTags, updateTask: function (task) { }, deleteTask: function (task) { } }));
	    };
	    TaskBoardComponent.prototype.render = function () {
	        return React.createElement("div", { className: "task-board" },
	            this.renderOptions(),
	            this.renderColumns(),
	            this.renderEditingTask(),
	            this.renderCreateTask());
	    };
	    return TaskBoardComponent;
	}(React.Component));
	exports.TaskBoardComponent = TaskBoardComponent;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tokenizer_1 = __webpack_require__(12);
	var EditTaskComponent = (function (_super) {
	    __extends(EditTaskComponent, _super);
	    function EditTaskComponent(props) {
	        var _this = _super.call(this, props) || this;
	        if (props.createMode) {
	            _this.state = {
	                task: _this._getEmptyTask(props.meUser, props.initialTags)
	            };
	        }
	        else {
	            _this.state = {
	                task: props.task,
	            };
	        }
	        return _this;
	    }
	    EditTaskComponent.prototype.componentWillReceiveProps = function (newProps) {
	        if (newProps.createMode) {
	            this.setState({
	                task: this._getEmptyTask(newProps.meUser, newProps.initialTags),
	            });
	        }
	        else {
	            this.setState({
	                task: newProps.task,
	            });
	        }
	    };
	    EditTaskComponent.prototype._getEmptyTask = function (user, initialTags) {
	        return {
	            id: 0,
	            title: '',
	            description: '',
	            authorId: user.id,
	            ownerId: user.id,
	            tagIds: (initialTags) ? initialTags : [],
	            priority: 300,
	            state: 0,
	        };
	    };
	    EditTaskComponent.prototype.submitForm = function (eventType) {
	        if (eventType == "save") {
	            this.props.updateTask(this.state.task);
	        }
	        else if (eventType == "delete") {
	            this.props.deleteTask(this.state.task);
	        }
	        else if (eventType == "create") {
	            this.props.createTask(this.state.task);
	        }
	        else {
	            throw Error("Unknown submit type!");
	        }
	    };
	    EditTaskComponent.prototype.onKeyDownCreate = function (event) {
	        if (event.key == "Enter" && this.props.createMode) {
	            this.submitForm("create");
	        }
	    };
	    EditTaskComponent.prototype.updateAttr = function (attrName, event) {
	        this.state.task[attrName] = event.target.value;
	        this.setState(this.state);
	    };
	    EditTaskComponent.prototype.getCurrentTags = function () {
	        var _this = this;
	        var tagNames = [];
	        this.state.task.tagIds.forEach(function (tagId) {
	            var tag = _this.props.tagsById[tagId];
	            tagNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return tagNames;
	    };
	    EditTaskComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        var allNames = [];
	        Object.keys(this.props.tagsById).forEach(function (tagId) {
	            var tag = _this.props.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    EditTaskComponent.prototype.retrieveTagNames = function (tokens) {
	        this.state.task.tagIds = tokens.map(function (token) {
	            return token.value;
	        });
	        this.setState(this.state);
	    };
	    EditTaskComponent.prototype.renderFormTitle = function () {
	        if (this.props.createMode) {
	            return React.createElement("h3", null, "Create Task");
	        }
	        else {
	            return React.createElement("h3", null,
	                "Editing T",
	                this.state.task.id);
	        }
	    };
	    EditTaskComponent.prototype.renderButtons = function () {
	        if (this.props.createMode) {
	            return (React.createElement("div", { className: "edit-task-button-container" },
	                React.createElement("input", { type: "button", value: "create", onClick: this.submitForm.bind(this, "create") })));
	        }
	        else {
	            return (React.createElement("div", { className: "edit-task-button-container" },
	                React.createElement("input", { type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete") }),
	                React.createElement("input", { type: "button", value: "save", onClick: this.submitForm.bind(this, "save") })));
	        }
	    };
	    EditTaskComponent.prototype.renderForm = function () {
	        return React.createElement("div", null,
	            React.createElement("div", { className: "title-container" },
	                React.createElement("label", { htmlFor: "title" }, "Title: "),
	                React.createElement("input", { type: "text", name: "title", value: this.state.task.title, onKeyDown: this.onKeyDownCreate.bind(this), onChange: this.updateAttr.bind(this, "title") })),
	            React.createElement("div", { className: "description-container" },
	                React.createElement("label", { htmlFor: "description" }, "Description: "),
	                React.createElement("textarea", { type: "text", name: "description", value: this.state.task.description, onChange: this.updateAttr.bind(this, "description") })),
	            React.createElement("div", { className: "priority-selector" },
	                React.createElement("label", { htmlFor: "priority" }, "Priority: "),
	                React.createElement("select", { name: "priority", value: this.state.task.priority, onChange: this.updateAttr.bind(this, "priority") },
	                    React.createElement("option", { value: "0" }, "Unknown"),
	                    React.createElement("option", { value: "100" }, "Lowest"),
	                    React.createElement("option", { value: "200" }, "Low"),
	                    React.createElement("option", { value: "300" }, "Normal"),
	                    React.createElement("option", { value: "400" }, "High"),
	                    React.createElement("option", { value: "500" }, "Highest"))),
	            React.createElement("div", { className: "state-selector" },
	                React.createElement("label", { htmlFor: "state" }, "Status: "),
	                React.createElement("select", { name: "state", value: this.state.task.state, onChange: this.updateAttr.bind(this, "state") },
	                    React.createElement("option", { value: "0" }, "Open"),
	                    React.createElement("option", { value: "500" }, "In Progress"),
	                    React.createElement("option", { value: "750" }, "Blocked"),
	                    React.createElement("option", { value: "1000" }, "Closed"))),
	            React.createElement("div", { className: "tag-tokenizer-container" },
	                React.createElement("label", null, "Tags:"),
	                React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.retrieveTagNames.bind(this), initialValues: this.getCurrentTags(), possibleTokens: this.getAllTagNames() })),
	            this.renderButtons());
	    };
	    EditTaskComponent.prototype.render = function () {
	        return React.createElement("div", { className: "edit-task-container" },
	            this.renderFormTitle(),
	            this.renderForm());
	    };
	    return EditTaskComponent;
	}(React.Component));
	exports.EditTaskComponent = EditTaskComponent;


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	var User = (function () {
	    function User() {
	    }
	    return User;
	}());
	exports.User = User;
	var Task = (function () {
	    function Task() {
	    }
	    return Task;
	}());
	exports.Task = Task;
	exports.priorityNameList = [
	    ["Unknown", 0],
	    ["Highest", 500],
	    ["High", 400],
	    ["Normal", 300],
	    ["Low", 200],
	    ["Lowest", 100],
	];
	exports.stateNameList = [
	    ["Open", 0], ["In Progress", 500],
	    ["Blocked", 750], ["Closed", 1000]
	];
	var Event = (function () {
	    function Event() {
	    }
	    return Event;
	}());
	exports.Event = Event;
	var Tag = (function () {
	    function Tag() {
	    }
	    return Tag;
	}());
	exports.Tag = Tag;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var models_1 = __webpack_require__(16);
	var task_board_1 = __webpack_require__(14);
	var tag_1 = __webpack_require__(18);
	var Linkify_1 = __webpack_require__(19);
	var TaskComponent = (function (_super) {
	    __extends(TaskComponent, _super);
	    function TaskComponent() {
	        return _super.apply(this, arguments) || this;
	    }
	    TaskComponent.prototype.renderTaskId = function () {
	        return (React.createElement("div", { className: "task-id" },
	            "T",
	            this.props.task.id));
	    };
	    TaskComponent.prototype.renderPriority = function () {
	        var _this = this;
	        // If we are viewing in priority columns, omit this line
	        if (this.props.viewType == task_board_1.TaskBoardViewType.priority) {
	            return;
	        }
	        var name = '';
	        models_1.priorityNameList.forEach(function (nameAndPriority) {
	            var n = nameAndPriority[0], priority = nameAndPriority[1];
	            if (_this.props.task.priority == priority) {
	                name = n;
	            }
	        });
	        return (React.createElement("div", { className: "task-priority" },
	            "Priority: ",
	            name));
	    };
	    TaskComponent.prototype.renderState = function () {
	        var _this = this;
	        // If we are viewing in state columns, omit this line
	        if (this.props.viewType == task_board_1.TaskBoardViewType.status) {
	            return;
	        }
	        var name = '';
	        models_1.stateNameList.forEach(function (nameAndState) {
	            var n = nameAndState[0], state = nameAndState[1];
	            if (_this.props.task.state == state) {
	                name = n;
	            }
	        });
	        return (React.createElement("div", { className: "task-state" },
	            "State: ",
	            name));
	    };
	    TaskComponent.prototype.renderTag = function (tagId) {
	        var tag = this.props.tagsById[tagId];
	        return React.createElement(tag_1.TagComponent, { tag: tag, key: tagId });
	    };
	    TaskComponent.prototype.renderTags = function () {
	        if (!this.props.task.tagIds.length) {
	            return;
	        }
	        return (React.createElement("div", { className: "task-tags-container" },
	            "Tags:",
	            this.props.task.tagIds.map(this.renderTag.bind(this))));
	    };
	    TaskComponent.prototype.render = function () {
	        return React.createElement("div", { className: "task card" },
	            this.renderTaskId(),
	            React.createElement("div", { className: "task-title" }, this.props.task.title),
	            React.createElement(Linkify_1.Linkify, { className: "task-description" }, this.props.task.description),
	            this.renderPriority(),
	            this.renderState(),
	            this.renderTags());
	    };
	    return TaskComponent;
	}(React.Component));
	exports.TaskComponent = TaskComponent;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var TagComponent = (function (_super) {
	    __extends(TagComponent, _super);
	    function TagComponent() {
	        return _super.apply(this, arguments) || this;
	    }
	    TagComponent.prototype.render = function () {
	        return (React.createElement("div", { className: "tag card" }, this.props.tag.name));
	    };
	    return TagComponent;
	}(React.Component));
	exports.TagComponent = TagComponent;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var LinkifyIt = __webpack_require__(20);
	var tlds = __webpack_require__(26);
	var linkify = new LinkifyIt();
	linkify.tlds(tlds);
	var Linkify = (function (_super) {
	    __extends(Linkify, _super);
	    function Linkify() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.parseCounter = 0;
	        return _this;
	    }
	    Linkify.prototype.getMatches = function (string) {
	        return linkify.match(string);
	    };
	    Linkify.prototype.parseString = function (string) {
	        var _this = this;
	        var elements = [];
	        if (string === '') {
	            return elements;
	        }
	        var matches = this.getMatches(string);
	        if (!matches) {
	            return string;
	        }
	        var lastIndex = 0;
	        matches.forEach(function (match, idx) {
	            // Push the preceding text if there is any
	            if (match.index > lastIndex) {
	                elements.push(string.substring(lastIndex, match.index));
	            }
	            // Shallow update values that specified the match
	            var props = { href: match.url, key: "parse" + _this.parseCounter + "match" + idx };
	            for (var key in _this.props.properties) {
	                var val = _this.props.properties[key];
	                if (val === Linkify.MATCH) {
	                    val = match.url;
	                }
	                props[key] = val;
	            }
	            elements.push(React.createElement(_this.props.component, props, match.text));
	            lastIndex = match.lastIndex;
	        });
	        if (lastIndex < string.length) {
	            elements.push(string.substring(lastIndex));
	        }
	        return (elements.length === 1) ? elements[0] : elements;
	    };
	    Linkify.prototype.parse = function (children) {
	        var _this = this;
	        var parsed = children;
	        if (typeof children === 'string') {
	            parsed = this.parseString(children);
	        }
	        else if (React.isValidElement(children) && (children.type !== 'a') &&
	            (children.type !== 'button')) {
	            var c = children;
	            parsed = React.cloneElement(c, { key: "parse" + ++this.parseCounter }, this.parse(c.props.children));
	        }
	        else if (children instanceof Array) {
	            parsed = children.map(function (child) {
	                return _this.parse(child);
	            });
	        }
	        return parsed;
	    };
	    Linkify.prototype.render = function () {
	        this.parseCounter = 0;
	        var parsedChildren = this.parse(this.props.children);
	        return React.createElement("span", { className: this.props.className }, parsedChildren);
	    };
	    return Linkify;
	}(React.Component));
	Linkify.MATCH = 'LINKIFY_MATCH';
	Linkify.defaultProps = {
	    className: 'Linkify',
	    component: 'a',
	    properties: {},
	};
	exports.Linkify = Linkify;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	////////////////////////////////////////////////////////////////////////////////
	// Helpers
	
	// Merge objects
	//
	function assign(obj /*from1, from2, from3, ...*/) {
	  var sources = Array.prototype.slice.call(arguments, 1);
	
	  sources.forEach(function (source) {
	    if (!source) { return; }
	
	    Object.keys(source).forEach(function (key) {
	      obj[key] = source[key];
	    });
	  });
	
	  return obj;
	}
	
	function _class(obj) { return Object.prototype.toString.call(obj); }
	function isString(obj) { return _class(obj) === '[object String]'; }
	function isObject(obj) { return _class(obj) === '[object Object]'; }
	function isRegExp(obj) { return _class(obj) === '[object RegExp]'; }
	function isFunction(obj) { return _class(obj) === '[object Function]'; }
	
	
	function escapeRE(str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); }
	
	////////////////////////////////////////////////////////////////////////////////
	
	
	var defaultOptions = {
	  fuzzyLink: true,
	  fuzzyEmail: true,
	  fuzzyIP: false
	};
	
	
	function isOptionsObj(obj) {
	  return Object.keys(obj || {}).reduce(function (acc, k) {
	    return acc || defaultOptions.hasOwnProperty(k);
	  }, false);
	}
	
	
	var defaultSchemas = {
	  'http:': {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);
	
	      if (!self.re.http) {
	        // compile lazily, because "host"-containing variables can change on tlds update.
	        self.re.http =  new RegExp(
	          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
	        );
	      }
	      if (self.re.http.test(tail)) {
	        return tail.match(self.re.http)[0].length;
	      }
	      return 0;
	    }
	  },
	  'https:':  'http:',
	  'ftp:':    'http:',
	  '//':      {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);
	
	      if (!self.re.no_http) {
	      // compile lazily, because "host"-containing variables can change on tlds update.
	        self.re.no_http =  new RegExp(
	          '^' +
	          self.re.src_auth +
	          // Don't allow single-level domains, because of false positives like '//test'
	          // with code comments
	          '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
	          self.re.src_port +
	          self.re.src_host_terminator +
	          self.re.src_path,
	
	          'i'
	        );
	      }
	
	      if (self.re.no_http.test(tail)) {
	        // should not be `://` & `///`, that protects from errors in protocol name
	        if (pos >= 3 && text[pos - 3] === ':') { return 0; }
	        if (pos >= 3 && text[pos - 3] === '/') { return 0; }
	        return tail.match(self.re.no_http)[0].length;
	      }
	      return 0;
	    }
	  },
	  'mailto:': {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);
	
	      if (!self.re.mailto) {
	        self.re.mailto =  new RegExp(
	          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
	        );
	      }
	      if (self.re.mailto.test(tail)) {
	        return tail.match(self.re.mailto)[0].length;
	      }
	      return 0;
	    }
	  }
	};
	
	/*eslint-disable max-len*/
	
	// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
	var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';
	
	// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
	var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');
	
	/*eslint-enable max-len*/
	
	////////////////////////////////////////////////////////////////////////////////
	
	function resetScanCache(self) {
	  self.__index__ = -1;
	  self.__text_cache__   = '';
	}
	
	function createValidator(re) {
	  return function (text, pos) {
	    var tail = text.slice(pos);
	
	    if (re.test(tail)) {
	      return tail.match(re)[0].length;
	    }
	    return 0;
	  };
	}
	
	function createNormalizer() {
	  return function (match, self) {
	    self.normalize(match);
	  };
	}
	
	// Schemas compiler. Build regexps.
	//
	function compile(self) {
	
	  // Load & clone RE patterns.
	  var re = self.re = __webpack_require__(21)(self.__opts__);
	
	  // Define dynamic patterns
	  var tlds = self.__tlds__.slice();
	
	  self.onCompile();
	
	  if (!self.__tlds_replaced__) {
	    tlds.push(tlds_2ch_src_re);
	  }
	  tlds.push(re.src_xn);
	
	  re.src_tlds = tlds.join('|');
	
	  function untpl(tpl) { return tpl.replace('%TLDS%', re.src_tlds); }
	
	  re.email_fuzzy      = RegExp(untpl(re.tpl_email_fuzzy), 'i');
	  re.link_fuzzy       = RegExp(untpl(re.tpl_link_fuzzy), 'i');
	  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
	  re.host_fuzzy_test  = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');
	
	  //
	  // Compile each schema
	  //
	
	  var aliases = [];
	
	  self.__compiled__ = {}; // Reset compiled data
	
	  function schemaError(name, val) {
	    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
	  }
	
	  Object.keys(self.__schemas__).forEach(function (name) {
	    var val = self.__schemas__[name];
	
	    // skip disabled methods
	    if (val === null) { return; }
	
	    var compiled = { validate: null, link: null };
	
	    self.__compiled__[name] = compiled;
	
	    if (isObject(val)) {
	      if (isRegExp(val.validate)) {
	        compiled.validate = createValidator(val.validate);
	      } else if (isFunction(val.validate)) {
	        compiled.validate = val.validate;
	      } else {
	        schemaError(name, val);
	      }
	
	      if (isFunction(val.normalize)) {
	        compiled.normalize = val.normalize;
	      } else if (!val.normalize) {
	        compiled.normalize = createNormalizer();
	      } else {
	        schemaError(name, val);
	      }
	
	      return;
	    }
	
	    if (isString(val)) {
	      aliases.push(name);
	      return;
	    }
	
	    schemaError(name, val);
	  });
	
	  //
	  // Compile postponed aliases
	  //
	
	  aliases.forEach(function (alias) {
	    if (!self.__compiled__[self.__schemas__[alias]]) {
	      // Silently fail on missed schemas to avoid errons on disable.
	      // schemaError(alias, self.__schemas__[alias]);
	      return;
	    }
	
	    self.__compiled__[alias].validate =
	      self.__compiled__[self.__schemas__[alias]].validate;
	    self.__compiled__[alias].normalize =
	      self.__compiled__[self.__schemas__[alias]].normalize;
	  });
	
	  //
	  // Fake record for guessed links
	  //
	  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };
	
	  //
	  // Build schema condition
	  //
	  var slist = Object.keys(self.__compiled__)
	                      .filter(function (name) {
	                        // Filter disabled & fake schemas
	                        return name.length > 0 && self.__compiled__[name];
	                      })
	                      .map(escapeRE)
	                      .join('|');
	  // (?!_) cause 1.5x slowdown
	  self.re.schema_test   = RegExp('(^|(?!_)(?:[><]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
	  self.re.schema_search = RegExp('(^|(?!_)(?:[><]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');
	
	  self.re.pretest       = RegExp(
	                            '(' + self.re.schema_test.source + ')|' +
	                            '(' + self.re.host_fuzzy_test.source + ')|' +
	                            '@',
	                            'i');
	
	  //
	  // Cleanup
	  //
	
	  resetScanCache(self);
	}
	
	/**
	 * class Match
	 *
	 * Match result. Single element of array, returned by [[LinkifyIt#match]]
	 **/
	function Match(self, shift) {
	  var start = self.__index__,
	      end   = self.__last_index__,
	      text  = self.__text_cache__.slice(start, end);
	
	  /**
	   * Match#schema -> String
	   *
	   * Prefix (protocol) for matched string.
	   **/
	  this.schema    = self.__schema__.toLowerCase();
	  /**
	   * Match#index -> Number
	   *
	   * First position of matched string.
	   **/
	  this.index     = start + shift;
	  /**
	   * Match#lastIndex -> Number
	   *
	   * Next position after matched string.
	   **/
	  this.lastIndex = end + shift;
	  /**
	   * Match#raw -> String
	   *
	   * Matched string.
	   **/
	  this.raw       = text;
	  /**
	   * Match#text -> String
	   *
	   * Notmalized text of matched string.
	   **/
	  this.text      = text;
	  /**
	   * Match#url -> String
	   *
	   * Normalized url of matched string.
	   **/
	  this.url       = text;
	}
	
	function createMatch(self, shift) {
	  var match = new Match(self, shift);
	
	  self.__compiled__[match.schema].normalize(match, self);
	
	  return match;
	}
	
	
	/**
	 * class LinkifyIt
	 **/
	
	/**
	 * new LinkifyIt(schemas, options)
	 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
	 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
	 *
	 * Creates new linkifier instance with optional additional schemas.
	 * Can be called without `new` keyword for convenience.
	 *
	 * By default understands:
	 *
	 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
	 * - "fuzzy" links and emails (example.com, foo@bar.com).
	 *
	 * `schemas` is an object, where each key/value describes protocol/rule:
	 *
	 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
	 *   for example). `linkify-it` makes shure that prefix is not preceeded with
	 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
	 * - __value__ - rule to check tail after link prefix
	 *   - _String_ - just alias to existing rule
	 *   - _Object_
	 *     - _validate_ - validator function (should return matched length on success),
	 *       or `RegExp`.
	 *     - _normalize_ - optional function to normalize text & url of matched result
	 *       (for example, for @twitter mentions).
	 *
	 * `options`:
	 *
	 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
	 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
	 *   like version numbers. Default `false`.
	 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
	 *
	 **/
	function LinkifyIt(schemas, options) {
	  if (!(this instanceof LinkifyIt)) {
	    return new LinkifyIt(schemas, options);
	  }
	
	  if (!options) {
	    if (isOptionsObj(schemas)) {
	      options = schemas;
	      schemas = {};
	    }
	  }
	
	  this.__opts__           = assign({}, defaultOptions, options);
	
	  // Cache last tested result. Used to skip repeating steps on next `match` call.
	  this.__index__          = -1;
	  this.__last_index__     = -1; // Next scan position
	  this.__schema__         = '';
	  this.__text_cache__     = '';
	
	  this.__schemas__        = assign({}, defaultSchemas, schemas);
	  this.__compiled__       = {};
	
	  this.__tlds__           = tlds_default;
	  this.__tlds_replaced__  = false;
	
	  this.re = {};
	
	  compile(this);
	}
	
	
	/** chainable
	 * LinkifyIt#add(schema, definition)
	 * - schema (String): rule name (fixed pattern prefix)
	 * - definition (String|RegExp|Object): schema definition
	 *
	 * Add new rule definition. See constructor description for details.
	 **/
	LinkifyIt.prototype.add = function add(schema, definition) {
	  this.__schemas__[schema] = definition;
	  compile(this);
	  return this;
	};
	
	
	/** chainable
	 * LinkifyIt#set(options)
	 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
	 *
	 * Set recognition options for links without schema.
	 **/
	LinkifyIt.prototype.set = function set(options) {
	  this.__opts__ = assign(this.__opts__, options);
	  return this;
	};
	
	
	/**
	 * LinkifyIt#test(text) -> Boolean
	 *
	 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
	 **/
	LinkifyIt.prototype.test = function test(text) {
	  // Reset scan cache
	  this.__text_cache__ = text;
	  this.__index__      = -1;
	
	  if (!text.length) { return false; }
	
	  var m, ml, me, len, shift, next, re, tld_pos, at_pos;
	
	  // try to scan for link with schema - that's the most simple rule
	  if (this.re.schema_test.test(text)) {
	    re = this.re.schema_search;
	    re.lastIndex = 0;
	    while ((m = re.exec(text)) !== null) {
	      len = this.testSchemaAt(text, m[2], re.lastIndex);
	      if (len) {
	        this.__schema__     = m[2];
	        this.__index__      = m.index + m[1].length;
	        this.__last_index__ = m.index + m[0].length + len;
	        break;
	      }
	    }
	  }
	
	  if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
	    // guess schemaless links
	    tld_pos = text.search(this.re.host_fuzzy_test);
	    if (tld_pos >= 0) {
	      // if tld is located after found link - no need to check fuzzy pattern
	      if (this.__index__ < 0 || tld_pos < this.__index__) {
	        if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
	
	          shift = ml.index + ml[1].length;
	
	          if (this.__index__ < 0 || shift < this.__index__) {
	            this.__schema__     = '';
	            this.__index__      = shift;
	            this.__last_index__ = ml.index + ml[0].length;
	          }
	        }
	      }
	    }
	  }
	
	  if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
	    // guess schemaless emails
	    at_pos = text.indexOf('@');
	    if (at_pos >= 0) {
	      // We can't skip this check, because this cases are possible:
	      // 192.168.1.1@gmail.com, my.in@example.com
	      if ((me = text.match(this.re.email_fuzzy)) !== null) {
	
	        shift = me.index + me[1].length;
	        next  = me.index + me[0].length;
	
	        if (this.__index__ < 0 || shift < this.__index__ ||
	            (shift === this.__index__ && next > this.__last_index__)) {
	          this.__schema__     = 'mailto:';
	          this.__index__      = shift;
	          this.__last_index__ = next;
	        }
	      }
	    }
	  }
	
	  return this.__index__ >= 0;
	};
	
	
	/**
	 * LinkifyIt#pretest(text) -> Boolean
	 *
	 * Very quick check, that can give false positives. Returns true if link MAY BE
	 * can exists. Can be used for speed optimization, when you need to check that
	 * link NOT exists.
	 **/
	LinkifyIt.prototype.pretest = function pretest(text) {
	  return this.re.pretest.test(text);
	};
	
	
	/**
	 * LinkifyIt#testSchemaAt(text, name, position) -> Number
	 * - text (String): text to scan
	 * - name (String): rule (schema) name
	 * - position (Number): text offset to check from
	 *
	 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
	 * at given position. Returns length of found pattern (0 on fail).
	 **/
	LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
	  // If not supported schema check requested - terminate
	  if (!this.__compiled__[schema.toLowerCase()]) {
	    return 0;
	  }
	  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
	};
	
	
	/**
	 * LinkifyIt#match(text) -> Array|null
	 *
	 * Returns array of found link descriptions or `null` on fail. We strongly
	 * recommend to use [[LinkifyIt#test]] first, for best speed.
	 *
	 * ##### Result match description
	 *
	 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
	 *   protocol-neutral  links.
	 * - __index__ - offset of matched text
	 * - __lastIndex__ - index of next char after mathch end
	 * - __raw__ - matched text
	 * - __text__ - normalized text
	 * - __url__ - link, generated from matched text
	 **/
	LinkifyIt.prototype.match = function match(text) {
	  var shift = 0, result = [];
	
	  // Try to take previous element from cache, if .test() called before
	  if (this.__index__ >= 0 && this.__text_cache__ === text) {
	    result.push(createMatch(this, shift));
	    shift = this.__last_index__;
	  }
	
	  // Cut head if cache was used
	  var tail = shift ? text.slice(shift) : text;
	
	  // Scan string until end reached
	  while (this.test(tail)) {
	    result.push(createMatch(this, shift));
	
	    tail = tail.slice(this.__last_index__);
	    shift += this.__last_index__;
	  }
	
	  if (result.length) {
	    return result;
	  }
	
	  return null;
	};
	
	
	/** chainable
	 * LinkifyIt#tlds(list [, keepOld]) -> this
	 * - list (Array): list of tlds
	 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
	 *
	 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
	 * to avoid false positives. By default this algorythm used:
	 *
	 * - hostname with any 2-letter root zones are ok.
	 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
	 *   are ok.
	 * - encoded (`xn--...`) root zones are ok.
	 *
	 * If list is replaced, then exact match for 2-chars root zones will be checked.
	 **/
	LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
	  list = Array.isArray(list) ? list : [ list ];
	
	  if (!keepOld) {
	    this.__tlds__ = list.slice();
	    this.__tlds_replaced__ = true;
	    compile(this);
	    return this;
	  }
	
	  this.__tlds__ = this.__tlds__.concat(list)
	                                  .sort()
	                                  .filter(function (el, idx, arr) {
	                                    return el !== arr[idx - 1];
	                                  })
	                                  .reverse();
	
	  compile(this);
	  return this;
	};
	
	/**
	 * LinkifyIt#normalize(match)
	 *
	 * Default normalizer (if schema does not define it's own).
	 **/
	LinkifyIt.prototype.normalize = function normalize(match) {
	
	  // Do minimal possible changes by default. Need to collect feedback prior
	  // to move forward https://github.com/markdown-it/linkify-it/issues/1
	
	  if (!match.schema) { match.url = 'http://' + match.url; }
	
	  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
	    match.url = 'mailto:' + match.url;
	  }
	};
	
	
	/**
	 * LinkifyIt#onCompile()
	 *
	 * Override to modify basic RegExp-s.
	 **/
	LinkifyIt.prototype.onCompile = function onCompile() {
	};
	
	
	module.exports = LinkifyIt;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	module.exports = function (opts) {
	  var re = {};
	
	  // Use direct extract instead of `regenerate` to reduse browserified size
	  re.src_Any = __webpack_require__(22).source;
	  re.src_Cc  = __webpack_require__(23).source;
	  re.src_Z   = __webpack_require__(24).source;
	  re.src_P   = __webpack_require__(25).source;
	
	  // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
	  re.src_ZPCc = [ re.src_Z, re.src_P, re.src_Cc ].join('|');
	
	  // \p{\Z\Cc} (white spaces + control)
	  re.src_ZCc = [ re.src_Z, re.src_Cc ].join('|');
	
	  // All possible word characters (everything without punctuation, spaces & controls)
	  // Defined via punctuation & spaces to save space
	  // Should be something like \p{\L\N\S\M} (\w but without `_`)
	  re.src_pseudo_letter       = '(?:(?!>|<|' + re.src_ZPCc + ')' + re.src_Any + ')';
	  // The same as abothe but without [0-9]
	  // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';
	
	  ////////////////////////////////////////////////////////////////////////////////
	
	  re.src_ip4 =
	
	    '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
	
	  // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
	  re.src_auth    = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';
	
	  re.src_port =
	
	    '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';
	
	  re.src_host_terminator =
	
	    '(?=$|>|<|' + re.src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';
	
	  re.src_path =
	
	    '(?:' +
	      '[/?#]' +
	        '(?:' +
	          '(?!' + re.src_ZCc + '|[()[\\]{}.,"\'?!\\-<>]).|' +
	          '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
	          '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
	          '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
	          '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
	          "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +
	          "\\'(?=" + re.src_pseudo_letter + '|[-]).|' +  // allow `I'm_king` if no pair found
	          '\\.{2,3}[a-zA-Z0-9%/]|' + // github has ... in commit range links. Restrict to
	                                     // - english
	                                     // - percent-encoded
	                                     // - parts of file path
	                                     // until more examples found.
	          '\\.(?!' + re.src_ZCc + '|[.]).|' +
	          (opts && opts['---'] ?
	            '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
	          :
	            '\\-+|'
	          ) +
	          '\\,(?!' + re.src_ZCc + ').|' +      // allow `,,,` in paths
	          '\\!(?!' + re.src_ZCc + '|[!]).|' +
	          '\\?(?!' + re.src_ZCc + '|[?]).' +
	        ')+' +
	      '|\\/' +
	    ')?';
	
	  re.src_email_name =
	
	    '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';
	
	  re.src_xn =
	
	    'xn--[a-z0-9\\-]{1,59}';
	
	  // More to read about domain names
	  // http://serverfault.com/questions/638260/
	
	  re.src_domain_root =
	
	    // Allow letters & digits (http://test1)
	    '(?:' +
	      re.src_xn +
	      '|' +
	      re.src_pseudo_letter + '{1,63}' +
	    ')';
	
	  re.src_domain =
	
	    '(?:' +
	      re.src_xn +
	      '|' +
	      '(?:' + re.src_pseudo_letter + ')' +
	      '|' +
	      // don't allow `--` in domain names, because:
	      // - that can conflict with markdown &mdash; / &ndash;
	      // - nobody use those anyway
	      '(?:' + re.src_pseudo_letter + '(?:-(?!-)|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
	    ')';
	
	  re.src_host =
	
	    '(?:' +
	    // Don't need IP check, because digits are already allowed in normal domain names
	    //   src_ip4 +
	    // '|' +
	      '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/*_root*/ + ')' +
	    ')';
	
	  re.tpl_host_fuzzy =
	
	    '(?:' +
	      re.src_ip4 +
	    '|' +
	      '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
	    ')';
	
	  re.tpl_host_no_ip_fuzzy =
	
	    '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';
	
	  re.src_host_strict =
	
	    re.src_host + re.src_host_terminator;
	
	  re.tpl_host_fuzzy_strict =
	
	    re.tpl_host_fuzzy + re.src_host_terminator;
	
	  re.src_host_port_strict =
	
	    re.src_host + re.src_port + re.src_host_terminator;
	
	  re.tpl_host_port_fuzzy_strict =
	
	    re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
	
	  re.tpl_host_port_no_ip_fuzzy_strict =
	
	    re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
	
	
	  ////////////////////////////////////////////////////////////////////////////////
	  // Main rules
	
	  // Rude test fuzzy links by host, for quick deny
	  re.tpl_host_fuzzy_test =
	
	    'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';
	
	  re.tpl_email_fuzzy =
	
	      '(^|<|>|\\(|' + re.src_ZCc + ')(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';
	
	  re.tpl_link_fuzzy =
	      // Fuzzy link can't be prepended with .:/\- and non punctuation.
	      // but can start with > (markdown blockquote)
	      '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + re.src_ZPCc + '))' +
	      '((?![$+<=>^`|])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';
	
	  re.tpl_link_no_ip_fuzzy =
	      // Fuzzy link can't be prepended with .:/\- and non punctuation.
	      // but can start with > (markdown blockquote)
	      '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + re.src_ZPCc + '))' +
	      '((?![$+<=>^`|])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';
	
	  return re;
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports=/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports=/[\0-\x1F\x7F-\x9F]/

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E44\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD807[\uDC41-\uDC45\uDC70\uDC71]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = [
	  "aaa",
	  "aarp",
	  "abarth",
	  "abb",
	  "abbott",
	  "abbvie",
	  "abc",
	  "able",
	  "abogado",
	  "abudhabi",
	  "ac",
	  "academy",
	  "accenture",
	  "accountant",
	  "accountants",
	  "aco",
	  "active",
	  "actor",
	  "ad",
	  "adac",
	  "ads",
	  "adult",
	  "ae",
	  "aeg",
	  "aero",
	  "aetna",
	  "af",
	  "afamilycompany",
	  "afl",
	  "ag",
	  "agakhan",
	  "agency",
	  "ai",
	  "aig",
	  "aigo",
	  "airbus",
	  "airforce",
	  "airtel",
	  "akdn",
	  "al",
	  "alfaromeo",
	  "alibaba",
	  "alipay",
	  "allfinanz",
	  "allstate",
	  "ally",
	  "alsace",
	  "alstom",
	  "am",
	  "americanexpress",
	  "americanfamily",
	  "amex",
	  "amfam",
	  "amica",
	  "amsterdam",
	  "analytics",
	  "android",
	  "anquan",
	  "anz",
	  "ao",
	  "aol",
	  "apartments",
	  "app",
	  "apple",
	  "aq",
	  "aquarelle",
	  "ar",
	  "aramco",
	  "archi",
	  "army",
	  "arpa",
	  "art",
	  "arte",
	  "as",
	  "asda",
	  "asia",
	  "associates",
	  "at",
	  "athleta",
	  "attorney",
	  "au",
	  "auction",
	  "audi",
	  "audible",
	  "audio",
	  "auspost",
	  "author",
	  "auto",
	  "autos",
	  "avianca",
	  "aw",
	  "aws",
	  "ax",
	  "axa",
	  "az",
	  "azure",
	  "ba",
	  "baby",
	  "baidu",
	  "banamex",
	  "bananarepublic",
	  "band",
	  "bank",
	  "bar",
	  "barcelona",
	  "barclaycard",
	  "barclays",
	  "barefoot",
	  "bargains",
	  "baseball",
	  "basketball",
	  "bauhaus",
	  "bayern",
	  "bb",
	  "bbc",
	  "bbt",
	  "bbva",
	  "bcg",
	  "bcn",
	  "bd",
	  "be",
	  "beats",
	  "beauty",
	  "beer",
	  "bentley",
	  "berlin",
	  "best",
	  "bestbuy",
	  "bet",
	  "bf",
	  "bg",
	  "bh",
	  "bharti",
	  "bi",
	  "bible",
	  "bid",
	  "bike",
	  "bing",
	  "bingo",
	  "bio",
	  "biz",
	  "bj",
	  "black",
	  "blackfriday",
	  "blanco",
	  "blockbuster",
	  "blog",
	  "bloomberg",
	  "blue",
	  "bm",
	  "bms",
	  "bmw",
	  "bn",
	  "bnl",
	  "bnpparibas",
	  "bo",
	  "boats",
	  "boehringer",
	  "bofa",
	  "bom",
	  "bond",
	  "boo",
	  "book",
	  "booking",
	  "boots",
	  "bosch",
	  "bostik",
	  "boston",
	  "bot",
	  "boutique",
	  "box",
	  "br",
	  "bradesco",
	  "bridgestone",
	  "broadway",
	  "broker",
	  "brother",
	  "brussels",
	  "bs",
	  "bt",
	  "budapest",
	  "bugatti",
	  "build",
	  "builders",
	  "business",
	  "buy",
	  "buzz",
	  "bv",
	  "bw",
	  "by",
	  "bz",
	  "bzh",
	  "ca",
	  "cab",
	  "cafe",
	  "cal",
	  "call",
	  "calvinklein",
	  "cam",
	  "camera",
	  "camp",
	  "cancerresearch",
	  "canon",
	  "capetown",
	  "capital",
	  "capitalone",
	  "car",
	  "caravan",
	  "cards",
	  "care",
	  "career",
	  "careers",
	  "cars",
	  "cartier",
	  "casa",
	  "case",
	  "caseih",
	  "cash",
	  "casino",
	  "cat",
	  "catering",
	  "catholic",
	  "cba",
	  "cbn",
	  "cbre",
	  "cbs",
	  "cc",
	  "cd",
	  "ceb",
	  "center",
	  "ceo",
	  "cern",
	  "cf",
	  "cfa",
	  "cfd",
	  "cg",
	  "ch",
	  "chanel",
	  "channel",
	  "chase",
	  "chat",
	  "cheap",
	  "chintai",
	  "chloe",
	  "christmas",
	  "chrome",
	  "chrysler",
	  "church",
	  "ci",
	  "cipriani",
	  "circle",
	  "cisco",
	  "citadel",
	  "citi",
	  "citic",
	  "city",
	  "cityeats",
	  "ck",
	  "cl",
	  "claims",
	  "cleaning",
	  "click",
	  "clinic",
	  "clinique",
	  "clothing",
	  "cloud",
	  "club",
	  "clubmed",
	  "cm",
	  "cn",
	  "co",
	  "coach",
	  "codes",
	  "coffee",
	  "college",
	  "cologne",
	  "com",
	  "comcast",
	  "commbank",
	  "community",
	  "company",
	  "compare",
	  "computer",
	  "comsec",
	  "condos",
	  "construction",
	  "consulting",
	  "contact",
	  "contractors",
	  "cooking",
	  "cookingchannel",
	  "cool",
	  "coop",
	  "corsica",
	  "country",
	  "coupon",
	  "coupons",
	  "courses",
	  "cr",
	  "credit",
	  "creditcard",
	  "creditunion",
	  "cricket",
	  "crown",
	  "crs",
	  "cruise",
	  "cruises",
	  "csc",
	  "cu",
	  "cuisinella",
	  "cv",
	  "cw",
	  "cx",
	  "cy",
	  "cymru",
	  "cyou",
	  "cz",
	  "dabur",
	  "dad",
	  "dance",
	  "data",
	  "date",
	  "dating",
	  "datsun",
	  "day",
	  "dclk",
	  "dds",
	  "de",
	  "deal",
	  "dealer",
	  "deals",
	  "degree",
	  "delivery",
	  "dell",
	  "deloitte",
	  "delta",
	  "democrat",
	  "dental",
	  "dentist",
	  "desi",
	  "design",
	  "dev",
	  "dhl",
	  "diamonds",
	  "diet",
	  "digital",
	  "direct",
	  "directory",
	  "discount",
	  "discover",
	  "dish",
	  "diy",
	  "dj",
	  "dk",
	  "dm",
	  "dnp",
	  "do",
	  "docs",
	  "doctor",
	  "dodge",
	  "dog",
	  "doha",
	  "domains",
	  "dot",
	  "download",
	  "drive",
	  "dtv",
	  "dubai",
	  "duck",
	  "dunlop",
	  "duns",
	  "dupont",
	  "durban",
	  "dvag",
	  "dvr",
	  "dz",
	  "earth",
	  "eat",
	  "ec",
	  "eco",
	  "edeka",
	  "edu",
	  "education",
	  "ee",
	  "eg",
	  "email",
	  "emerck",
	  "energy",
	  "engineer",
	  "engineering",
	  "enterprises",
	  "epost",
	  "epson",
	  "equipment",
	  "er",
	  "ericsson",
	  "erni",
	  "es",
	  "esq",
	  "estate",
	  "esurance",
	  "et",
	  "eu",
	  "eurovision",
	  "eus",
	  "events",
	  "everbank",
	  "exchange",
	  "expert",
	  "exposed",
	  "express",
	  "extraspace",
	  "fage",
	  "fail",
	  "fairwinds",
	  "faith",
	  "family",
	  "fan",
	  "fans",
	  "farm",
	  "farmers",
	  "fashion",
	  "fast",
	  "fedex",
	  "feedback",
	  "ferrari",
	  "ferrero",
	  "fi",
	  "fiat",
	  "fidelity",
	  "fido",
	  "film",
	  "final",
	  "finance",
	  "financial",
	  "fire",
	  "firestone",
	  "firmdale",
	  "fish",
	  "fishing",
	  "fit",
	  "fitness",
	  "fj",
	  "fk",
	  "flickr",
	  "flights",
	  "flir",
	  "florist",
	  "flowers",
	  "fly",
	  "fm",
	  "fo",
	  "foo",
	  "food",
	  "foodnetwork",
	  "football",
	  "ford",
	  "forex",
	  "forsale",
	  "forum",
	  "foundation",
	  "fox",
	  "fr",
	  "free",
	  "fresenius",
	  "frl",
	  "frogans",
	  "frontdoor",
	  "frontier",
	  "ftr",
	  "fujitsu",
	  "fujixerox",
	  "fun",
	  "fund",
	  "furniture",
	  "futbol",
	  "fyi",
	  "ga",
	  "gal",
	  "gallery",
	  "gallo",
	  "gallup",
	  "game",
	  "games",
	  "gap",
	  "garden",
	  "gb",
	  "gbiz",
	  "gd",
	  "gdn",
	  "ge",
	  "gea",
	  "gent",
	  "genting",
	  "george",
	  "gf",
	  "gg",
	  "ggee",
	  "gh",
	  "gi",
	  "gift",
	  "gifts",
	  "gives",
	  "giving",
	  "gl",
	  "glade",
	  "glass",
	  "gle",
	  "global",
	  "globo",
	  "gm",
	  "gmail",
	  "gmbh",
	  "gmo",
	  "gmx",
	  "gn",
	  "godaddy",
	  "gold",
	  "goldpoint",
	  "golf",
	  "goo",
	  "goodhands",
	  "goodyear",
	  "goog",
	  "google",
	  "gop",
	  "got",
	  "gov",
	  "gp",
	  "gq",
	  "gr",
	  "grainger",
	  "graphics",
	  "gratis",
	  "green",
	  "gripe",
	  "group",
	  "gs",
	  "gt",
	  "gu",
	  "guardian",
	  "gucci",
	  "guge",
	  "guide",
	  "guitars",
	  "guru",
	  "gw",
	  "gy",
	  "hair",
	  "hamburg",
	  "hangout",
	  "haus",
	  "hbo",
	  "hdfc",
	  "hdfcbank",
	  "health",
	  "healthcare",
	  "help",
	  "helsinki",
	  "here",
	  "hermes",
	  "hgtv",
	  "hiphop",
	  "hisamitsu",
	  "hitachi",
	  "hiv",
	  "hk",
	  "hkt",
	  "hm",
	  "hn",
	  "hockey",
	  "holdings",
	  "holiday",
	  "homedepot",
	  "homegoods",
	  "homes",
	  "homesense",
	  "honda",
	  "honeywell",
	  "horse",
	  "hospital",
	  "host",
	  "hosting",
	  "hot",
	  "hoteles",
	  "hotmail",
	  "house",
	  "how",
	  "hr",
	  "hsbc",
	  "ht",
	  "htc",
	  "hu",
	  "hughes",
	  "hyatt",
	  "hyundai",
	  "ibm",
	  "icbc",
	  "ice",
	  "icu",
	  "id",
	  "ie",
	  "ieee",
	  "ifm",
	  "ikano",
	  "il",
	  "im",
	  "imamat",
	  "imdb",
	  "immo",
	  "immobilien",
	  "in",
	  "industries",
	  "infiniti",
	  "info",
	  "ing",
	  "ink",
	  "institute",
	  "insurance",
	  "insure",
	  "int",
	  "intel",
	  "international",
	  "intuit",
	  "investments",
	  "io",
	  "ipiranga",
	  "iq",
	  "ir",
	  "irish",
	  "is",
	  "iselect",
	  "ismaili",
	  "ist",
	  "istanbul",
	  "it",
	  "itau",
	  "itv",
	  "iveco",
	  "iwc",
	  "jaguar",
	  "java",
	  "jcb",
	  "jcp",
	  "je",
	  "jeep",
	  "jetzt",
	  "jewelry",
	  "jio",
	  "jlc",
	  "jll",
	  "jm",
	  "jmp",
	  "jnj",
	  "jo",
	  "jobs",
	  "joburg",
	  "jot",
	  "joy",
	  "jp",
	  "jpmorgan",
	  "jprs",
	  "juegos",
	  "juniper",
	  "kaufen",
	  "kddi",
	  "ke",
	  "kerryhotels",
	  "kerrylogistics",
	  "kerryproperties",
	  "kfh",
	  "kg",
	  "kh",
	  "ki",
	  "kia",
	  "kim",
	  "kinder",
	  "kindle",
	  "kitchen",
	  "kiwi",
	  "km",
	  "kn",
	  "koeln",
	  "komatsu",
	  "kosher",
	  "kp",
	  "kpmg",
	  "kpn",
	  "kr",
	  "krd",
	  "kred",
	  "kuokgroup",
	  "kw",
	  "ky",
	  "kyoto",
	  "kz",
	  "la",
	  "lacaixa",
	  "ladbrokes",
	  "lamborghini",
	  "lamer",
	  "lancaster",
	  "lancia",
	  "lancome",
	  "land",
	  "landrover",
	  "lanxess",
	  "lasalle",
	  "lat",
	  "latino",
	  "latrobe",
	  "law",
	  "lawyer",
	  "lb",
	  "lc",
	  "lds",
	  "lease",
	  "leclerc",
	  "lefrak",
	  "legal",
	  "lego",
	  "lexus",
	  "lgbt",
	  "li",
	  "liaison",
	  "lidl",
	  "life",
	  "lifeinsurance",
	  "lifestyle",
	  "lighting",
	  "like",
	  "lilly",
	  "limited",
	  "limo",
	  "lincoln",
	  "linde",
	  "link",
	  "lipsy",
	  "live",
	  "living",
	  "lixil",
	  "lk",
	  "loan",
	  "loans",
	  "locker",
	  "locus",
	  "loft",
	  "lol",
	  "london",
	  "lotte",
	  "lotto",
	  "love",
	  "lpl",
	  "lplfinancial",
	  "lr",
	  "ls",
	  "lt",
	  "ltd",
	  "ltda",
	  "lu",
	  "lundbeck",
	  "lupin",
	  "luxe",
	  "luxury",
	  "lv",
	  "ly",
	  "ma",
	  "macys",
	  "madrid",
	  "maif",
	  "maison",
	  "makeup",
	  "man",
	  "management",
	  "mango",
	  "market",
	  "marketing",
	  "markets",
	  "marriott",
	  "marshalls",
	  "maserati",
	  "mattel",
	  "mba",
	  "mc",
	  "mcd",
	  "mcdonalds",
	  "mckinsey",
	  "md",
	  "me",
	  "med",
	  "media",
	  "meet",
	  "melbourne",
	  "meme",
	  "memorial",
	  "men",
	  "menu",
	  "meo",
	  "metlife",
	  "mg",
	  "mh",
	  "miami",
	  "microsoft",
	  "mil",
	  "mini",
	  "mint",
	  "mit",
	  "mitsubishi",
	  "mk",
	  "ml",
	  "mlb",
	  "mls",
	  "mm",
	  "mma",
	  "mn",
	  "mo",
	  "mobi",
	  "mobile",
	  "mobily",
	  "moda",
	  "moe",
	  "moi",
	  "mom",
	  "monash",
	  "money",
	  "monster",
	  "montblanc",
	  "mopar",
	  "mormon",
	  "mortgage",
	  "moscow",
	  "moto",
	  "motorcycles",
	  "mov",
	  "movie",
	  "movistar",
	  "mp",
	  "mq",
	  "mr",
	  "ms",
	  "msd",
	  "mt",
	  "mtn",
	  "mtpc",
	  "mtr",
	  "mu",
	  "museum",
	  "mutual",
	  "mv",
	  "mw",
	  "mx",
	  "my",
	  "mz",
	  "na",
	  "nab",
	  "nadex",
	  "nagoya",
	  "name",
	  "nationwide",
	  "natura",
	  "navy",
	  "nba",
	  "nc",
	  "ne",
	  "nec",
	  "net",
	  "netbank",
	  "netflix",
	  "network",
	  "neustar",
	  "new",
	  "newholland",
	  "news",
	  "next",
	  "nextdirect",
	  "nexus",
	  "nf",
	  "nfl",
	  "ng",
	  "ngo",
	  "nhk",
	  "ni",
	  "nico",
	  "nike",
	  "nikon",
	  "ninja",
	  "nissan",
	  "nissay",
	  "nl",
	  "no",
	  "nokia",
	  "northwesternmutual",
	  "norton",
	  "now",
	  "nowruz",
	  "nowtv",
	  "np",
	  "nr",
	  "nra",
	  "nrw",
	  "ntt",
	  "nu",
	  "nyc",
	  "nz",
	  "obi",
	  "observer",
	  "off",
	  "office",
	  "okinawa",
	  "olayan",
	  "olayangroup",
	  "oldnavy",
	  "ollo",
	  "om",
	  "omega",
	  "one",
	  "ong",
	  "onl",
	  "online",
	  "onyourside",
	  "ooo",
	  "open",
	  "oracle",
	  "orange",
	  "org",
	  "organic",
	  "orientexpress",
	  "origins",
	  "osaka",
	  "otsuka",
	  "ott",
	  "ovh",
	  "pa",
	  "page",
	  "pamperedchef",
	  "panasonic",
	  "panerai",
	  "paris",
	  "pars",
	  "partners",
	  "parts",
	  "party",
	  "passagens",
	  "pay",
	  "pccw",
	  "pe",
	  "pet",
	  "pf",
	  "pfizer",
	  "pg",
	  "ph",
	  "pharmacy",
	  "philips",
	  "phone",
	  "photo",
	  "photography",
	  "photos",
	  "physio",
	  "piaget",
	  "pics",
	  "pictet",
	  "pictures",
	  "pid",
	  "pin",
	  "ping",
	  "pink",
	  "pioneer",
	  "pizza",
	  "pk",
	  "pl",
	  "place",
	  "play",
	  "playstation",
	  "plumbing",
	  "plus",
	  "pm",
	  "pn",
	  "pnc",
	  "pohl",
	  "poker",
	  "politie",
	  "porn",
	  "post",
	  "pr",
	  "pramerica",
	  "praxi",
	  "press",
	  "prime",
	  "pro",
	  "prod",
	  "productions",
	  "prof",
	  "progressive",
	  "promo",
	  "properties",
	  "property",
	  "protection",
	  "pru",
	  "prudential",
	  "ps",
	  "pt",
	  "pub",
	  "pw",
	  "pwc",
	  "py",
	  "qa",
	  "qpon",
	  "quebec",
	  "quest",
	  "qvc",
	  "racing",
	  "radio",
	  "raid",
	  "re",
	  "read",
	  "realestate",
	  "realtor",
	  "realty",
	  "recipes",
	  "red",
	  "redstone",
	  "redumbrella",
	  "rehab",
	  "reise",
	  "reisen",
	  "reit",
	  "reliance",
	  "ren",
	  "rent",
	  "rentals",
	  "repair",
	  "report",
	  "republican",
	  "rest",
	  "restaurant",
	  "review",
	  "reviews",
	  "rexroth",
	  "rich",
	  "richardli",
	  "ricoh",
	  "rightathome",
	  "ril",
	  "rio",
	  "rip",
	  "rmit",
	  "ro",
	  "rocher",
	  "rocks",
	  "rodeo",
	  "rogers",
	  "room",
	  "rs",
	  "rsvp",
	  "ru",
	  "ruhr",
	  "run",
	  "rw",
	  "rwe",
	  "ryukyu",
	  "sa",
	  "saarland",
	  "safe",
	  "safety",
	  "sakura",
	  "sale",
	  "salon",
	  "samsclub",
	  "samsung",
	  "sandvik",
	  "sandvikcoromant",
	  "sanofi",
	  "sap",
	  "sapo",
	  "sarl",
	  "sas",
	  "save",
	  "saxo",
	  "sb",
	  "sbi",
	  "sbs",
	  "sc",
	  "sca",
	  "scb",
	  "schaeffler",
	  "schmidt",
	  "scholarships",
	  "school",
	  "schule",
	  "schwarz",
	  "science",
	  "scjohnson",
	  "scor",
	  "scot",
	  "sd",
	  "se",
	  "seat",
	  "secure",
	  "security",
	  "seek",
	  "select",
	  "sener",
	  "services",
	  "ses",
	  "seven",
	  "sew",
	  "sex",
	  "sexy",
	  "sfr",
	  "sg",
	  "sh",
	  "shangrila",
	  "sharp",
	  "shaw",
	  "shell",
	  "shia",
	  "shiksha",
	  "shoes",
	  "shop",
	  "shopping",
	  "shouji",
	  "show",
	  "showtime",
	  "shriram",
	  "si",
	  "silk",
	  "sina",
	  "singles",
	  "site",
	  "sj",
	  "sk",
	  "ski",
	  "skin",
	  "sky",
	  "skype",
	  "sl",
	  "sling",
	  "sm",
	  "smart",
	  "smile",
	  "sn",
	  "sncf",
	  "so",
	  "soccer",
	  "social",
	  "softbank",
	  "software",
	  "sohu",
	  "solar",
	  "solutions",
	  "song",
	  "sony",
	  "soy",
	  "space",
	  "spiegel",
	  "spot",
	  "spreadbetting",
	  "sr",
	  "srl",
	  "srt",
	  "st",
	  "stada",
	  "staples",
	  "star",
	  "starhub",
	  "statebank",
	  "statefarm",
	  "statoil",
	  "stc",
	  "stcgroup",
	  "stockholm",
	  "storage",
	  "store",
	  "stream",
	  "studio",
	  "study",
	  "style",
	  "su",
	  "sucks",
	  "supplies",
	  "supply",
	  "support",
	  "surf",
	  "surgery",
	  "suzuki",
	  "sv",
	  "swatch",
	  "swiftcover",
	  "swiss",
	  "sx",
	  "sy",
	  "sydney",
	  "symantec",
	  "systems",
	  "sz",
	  "tab",
	  "taipei",
	  "talk",
	  "taobao",
	  "target",
	  "tatamotors",
	  "tatar",
	  "tattoo",
	  "tax",
	  "taxi",
	  "tc",
	  "tci",
	  "td",
	  "tdk",
	  "team",
	  "tech",
	  "technology",
	  "tel",
	  "telecity",
	  "telefonica",
	  "temasek",
	  "tennis",
	  "teva",
	  "tf",
	  "tg",
	  "th",
	  "thd",
	  "theater",
	  "theatre",
	  "tiaa",
	  "tickets",
	  "tienda",
	  "tiffany",
	  "tips",
	  "tires",
	  "tirol",
	  "tj",
	  "tjmaxx",
	  "tjx",
	  "tk",
	  "tkmaxx",
	  "tl",
	  "tm",
	  "tmall",
	  "tn",
	  "to",
	  "today",
	  "tokyo",
	  "tools",
	  "top",
	  "toray",
	  "toshiba",
	  "total",
	  "tours",
	  "town",
	  "toyota",
	  "toys",
	  "tr",
	  "trade",
	  "trading",
	  "training",
	  "travel",
	  "travelchannel",
	  "travelers",
	  "travelersinsurance",
	  "trust",
	  "trv",
	  "tt",
	  "tube",
	  "tui",
	  "tunes",
	  "tushu",
	  "tv",
	  "tvs",
	  "tw",
	  "tz",
	  "ua",
	  "ubank",
	  "ubs",
	  "uconnect",
	  "ug",
	  "uk",
	  "unicom",
	  "university",
	  "uno",
	  "uol",
	  "ups",
	  "us",
	  "uy",
	  "uz",
	  "va",
	  "vacations",
	  "vana",
	  "vanguard",
	  "vc",
	  "ve",
	  "vegas",
	  "ventures",
	  "verisign",
	  "versicherung",
	  "vet",
	  "vg",
	  "vi",
	  "viajes",
	  "video",
	  "vig",
	  "viking",
	  "villas",
	  "vin",
	  "vip",
	  "virgin",
	  "visa",
	  "vision",
	  "vista",
	  "vistaprint",
	  "viva",
	  "vivo",
	  "vlaanderen",
	  "vn",
	  "vodka",
	  "volkswagen",
	  "volvo",
	  "vote",
	  "voting",
	  "voto",
	  "voyage",
	  "vu",
	  "vuelos",
	  "wales",
	  "walmart",
	  "walter",
	  "wang",
	  "wanggou",
	  "warman",
	  "watch",
	  "watches",
	  "weather",
	  "weatherchannel",
	  "webcam",
	  "weber",
	  "website",
	  "wed",
	  "wedding",
	  "weibo",
	  "weir",
	  "wf",
	  "whoswho",
	  "wien",
	  "wiki",
	  "williamhill",
	  "win",
	  "windows",
	  "wine",
	  "winners",
	  "wme",
	  "wolterskluwer",
	  "woodside",
	  "work",
	  "works",
	  "world",
	  "wow",
	  "ws",
	  "wtc",
	  "wtf",
	  "xbox",
	  "xerox",
	  "xfinity",
	  "xihuan",
	  "xin",
	  "कॉम", // xn--11b4c3d
	  "セール", // xn--1ck2e1b
	  "佛山", // xn--1qqw23a
	  "慈善", // xn--30rr7y
	  "集团", // xn--3bst00m
	  "在线", // xn--3ds443g
	  "한국", // xn--3e0b707e
	  "大众汽车", // xn--3oq18vl8pn36a
	  "点看", // xn--3pxu8k
	  "คอม", // xn--42c2d9a
	  "ভারত", // xn--45brj9c
	  "八卦", // xn--45q11c
	  "موقع", // xn--4gbrim
	  "বাংলা", // xn--54b7fta0cc
	  "公益", // xn--55qw42g
	  "公司", // xn--55qx5d
	  "香格里拉", // xn--5su34j936bgsg
	  "网站", // xn--5tzm5g
	  "移动", // xn--6frz82g
	  "我爱你", // xn--6qq986b3xl
	  "москва", // xn--80adxhks
	  "қаз", // xn--80ao21a
	  "католик", // xn--80aqecdr1a
	  "онлайн", // xn--80asehdb
	  "сайт", // xn--80aswg
	  "联通", // xn--8y0a063a
	  "срб", // xn--90a3ac
	  "бг", // xn--90ae
	  "бел", // xn--90ais
	  "קום", // xn--9dbq2a
	  "时尚", // xn--9et52u
	  "微博", // xn--9krt00a
	  "淡马锡", // xn--b4w605ferd
	  "ファッション", // xn--bck1b9a5dre4c
	  "орг", // xn--c1avg
	  "नेट", // xn--c2br7g
	  "ストア", // xn--cck2b3b
	  "삼성", // xn--cg4bki
	  "சிங்கப்பூர்", // xn--clchc0ea0b2g2a9gcd
	  "商标", // xn--czr694b
	  "商店", // xn--czrs0t
	  "商城", // xn--czru2d
	  "дети", // xn--d1acj3b
	  "мкд", // xn--d1alf
	  "ею", // xn--e1a4c
	  "ポイント", // xn--eckvdtc9d
	  "新闻", // xn--efvy88h
	  "工行", // xn--estv75g
	  "家電", // xn--fct429k
	  "كوم", // xn--fhbei
	  "中文网", // xn--fiq228c5hs
	  "中信", // xn--fiq64b
	  "中国", // xn--fiqs8s
	  "中國", // xn--fiqz9s
	  "娱乐", // xn--fjq720a
	  "谷歌", // xn--flw351e
	  "భారత్", // xn--fpcrj9c3d
	  "ලංකා", // xn--fzc2c9e2c
	  "電訊盈科", // xn--fzys8d69uvgm
	  "购物", // xn--g2xx48c
	  "クラウド", // xn--gckr3f0f
	  "ભારત", // xn--gecrj9c
	  "通販", // xn--gk3at1e
	  "भारत", // xn--h2brj9c
	  "网店", // xn--hxt814e
	  "संगठन", // xn--i1b6b1a6a2e
	  "餐厅", // xn--imr513n
	  "网络", // xn--io0a7i
	  "ком", // xn--j1aef
	  "укр", // xn--j1amh
	  "香港", // xn--j6w193g
	  "诺基亚", // xn--jlq61u9w7b
	  "食品", // xn--jvr189m
	  "飞利浦", // xn--kcrx77d1x4a
	  "台湾", // xn--kprw13d
	  "台灣", // xn--kpry57d
	  "手表", // xn--kpu716f
	  "手机", // xn--kput3i
	  "мон", // xn--l1acc
	  "الجزائر", // xn--lgbbat1ad8j
	  "عمان", // xn--mgb9awbf
	  "ارامكو", // xn--mgba3a3ejt
	  "ایران", // xn--mgba3a4f16a
	  "العليان", // xn--mgba7c0bbn0a
	  "امارات", // xn--mgbaam7a8h
	  "بازار", // xn--mgbab2bd
	  "الاردن", // xn--mgbayh7gpa
	  "موبايلي", // xn--mgbb9fbpob
	  "بھارت", // xn--mgbbh1a71e
	  "المغرب", // xn--mgbc0a9azcg
	  "ابوظبي", // xn--mgbca7dzdo
	  "السعودية", // xn--mgberp4a5d4ar
	  "كاثوليك", // xn--mgbi4ecexp
	  "سودان", // xn--mgbpl2fh
	  "همراه", // xn--mgbt3dhd
	  "عراق", // xn--mgbtx2b
	  "مليسيا", // xn--mgbx4cd0ab
	  "澳門", // xn--mix891f
	  "닷컴", // xn--mk1bu44c
	  "政府", // xn--mxtq1m
	  "شبكة", // xn--ngbc5azd
	  "بيتك", // xn--ngbe9e0a
	  "გე", // xn--node
	  "机构", // xn--nqv7f
	  "组织机构", // xn--nqv7fs00ema
	  "健康", // xn--nyqy26a
	  "ไทย", // xn--o3cw4h
	  "سورية", // xn--ogbpf8fl
	  "рус", // xn--p1acf
	  "рф", // xn--p1ai
	  "珠宝", // xn--pbt977c
	  "تونس", // xn--pgbs0dh
	  "大拿", // xn--pssy2u
	  "みんな", // xn--q9jyb4c
	  "グーグル", // xn--qcka1pmc
	  "ελ", // xn--qxam
	  "世界", // xn--rhqv96g
	  "書籍", // xn--rovu88b
	  "ਭਾਰਤ", // xn--s9brj9c
	  "网址", // xn--ses554g
	  "닷넷", // xn--t60b56a
	  "コム", // xn--tckwe
	  "天主教", // xn--tiq49xqyj
	  "游戏", // xn--unup4y
	  "vermögensberater", // xn--vermgensberater-ctb
	  "vermögensberatung", // xn--vermgensberatung-pwb
	  "企业", // xn--vhquv
	  "信息", // xn--vuq861b
	  "嘉里大酒店", // xn--w4r85el8fhu5dnra
	  "嘉里", // xn--w4rs40l
	  "مصر", // xn--wgbh1c
	  "قطر", // xn--wgbl6a
	  "广东", // xn--xhq521b
	  "இலங்கை", // xn--xkc2al3hye2a
	  "இந்தியா", // xn--xkc2dl3a5ee0h
	  "հայ", // xn--y9a3aq
	  "新加坡", // xn--yfro4i67o
	  "فلسطين", // xn--ygbi2ammx
	  "政务", // xn--zfr164b
	  "xperia",
	  "xxx",
	  "xyz",
	  "yachts",
	  "yahoo",
	  "yamaxun",
	  "yandex",
	  "ye",
	  "yodobashi",
	  "yoga",
	  "yokohama",
	  "you",
	  "youtube",
	  "yt",
	  "yun",
	  "za",
	  "zappos",
	  "zara",
	  "zero",
	  "zip",
	  "zippo",
	  "zm",
	  "zone",
	  "zuerich",
	  "zw"
	];


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var jQuery = __webpack_require__(8);
	var React = __webpack_require__(5);
	var ModalComponent = (function (_super) {
	    __extends(ModalComponent, _super);
	    function ModalComponent() {
	        return _super.apply(this, arguments) || this;
	    }
	    ModalComponent.prototype.componentDidMount = function () {
	        var _this = this;
	        // Focus the first input element after the modal appears.
	        var modalElements = document.getElementsByClassName("modal");
	        if (modalElements.length > 0) {
	            var inputElements = modalElements[0].getElementsByTagName("input");
	            if (inputElements.length > 0) {
	                inputElements[0].focus();
	            }
	        }
	        // Add an escape handler to close the modal
	        jQuery(document).bind("keyup.modalComponent", function (e) {
	            if (e.which == 27) {
	                _this.props.cancelFunc();
	            }
	        });
	    };
	    ModalComponent.prototype.componentWillUnmount = function () {
	        jQuery(document).unbind("keyup.modalComponent");
	    };
	    ModalComponent.prototype.renderCancelButton = function () {
	        return React.createElement("div", { className: "cancel-button-container", onClick: this.props.cancelFunc }, "x");
	    };
	    ModalComponent.prototype.render = function () {
	        return React.createElement("div", { className: "modal-container" },
	            React.createElement("div", { className: "background" },
	                React.createElement("div", { className: "modal card" },
	                    this.renderCancelButton(),
	                    this.props.children)));
	    };
	    return ModalComponent;
	}(React.Component));
	exports.ModalComponent = ModalComponent;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var jQuery = __webpack_require__(8);
	var moment = __webpack_require__(29);
	var React = __webpack_require__(5);
	var react_router_1 = __webpack_require__(7);
	var edit_event_1 = __webpack_require__(30);
	var tokenizer_1 = __webpack_require__(12);
	var event_1 = __webpack_require__(31);
	var modal_1 = __webpack_require__(27);
	var CalendarViewType;
	(function (CalendarViewType) {
	    CalendarViewType[CalendarViewType["week"] = 0] = "week";
	    CalendarViewType[CalendarViewType["day"] = 1] = "day";
	})(CalendarViewType = exports.CalendarViewType || (exports.CalendarViewType = {}));
	var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var GRANULARITY = 900; // Each cell is 15 minutes (unit in seconds)
	var CalendarComponent = (function (_super) {
	    __extends(CalendarComponent, _super);
	    function CalendarComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.refreshLoopId = 0;
	        _this._dragTargetEventElement = null;
	        _this.state = _this.getState(props);
	        return _this;
	    }
	    CalendarComponent.prototype.componentWillReceiveProps = function (props) {
	        this.setState(this.getState(props));
	    };
	    CalendarComponent.prototype.getState = function (props) {
	        var viewType = props.initialViewType;
	        var startDayTimestamp;
	        if (this.state) {
	            viewType = this.state.viewType;
	            startDayTimestamp = this.state.startDayTimestamp;
	        }
	        else {
	            startDayTimestamp = this.computeTodayStartTime(viewType);
	        }
	        var _a = this.divideAndSort(startDayTimestamp, viewType, props.events), columns = _a[0], eventToRenderingInfo = _a[1];
	        var newState = {
	            viewType: viewType,
	            startDayTimestamp: startDayTimestamp,
	            columns: columns,
	            cellHeight: 22,
	            showCreate: false,
	            eventToRenderingInfo: eventToRenderingInfo,
	            editingEvent: null,
	            createEventTimestamp: null,
	            createEventDurationSecs: null,
	            selectedTag: null,
	            draggingStartTimestamp: null,
	            draggingEndTimestamp: null,
	            draggingEvent: null,
	            endDraggingEvent: null,
	        };
	        if (this.state) {
	            newState.cellHeight = this.state.cellHeight;
	            // Want to persist tag between event creations
	            if (this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
	                newState.selectedTag = this.state.selectedTag;
	            }
	        }
	        return newState;
	    };
	    CalendarComponent.prototype.componentDidMount = function () {
	        var _this = this;
	        var cursor = document.getElementsByClassName("current-time-cursor");
	        if (cursor.length) {
	            // Scroll the calendar view so that the current time is in the middle.
	            var container = document.getElementsByClassName("all-columns-container")[0];
	            var top_1 = jQuery(cursor[0]).data("top");
	            container.scrollTop = top_1 - container.clientHeight / 2;
	        }
	        // Register a loop to keep refreshing the cursor.
	        var loop = function () {
	            _this.setState(_this.state);
	        };
	        this.refreshLoopId = setInterval(loop, 60000);
	    };
	    CalendarComponent.prototype.componentWillUnmount = function () {
	        if (this.refreshLoopId) {
	            clearInterval(this.refreshLoopId);
	        }
	    };
	    CalendarComponent.prototype.computeTodayStartTime = function (viewType) {
	        var startDayMoment;
	        if (viewType == CalendarViewType.week) {
	            startDayMoment = this.computeClosestMonday(moment());
	        }
	        else {
	            startDayMoment = moment().startOf("day");
	        }
	        return startDayMoment.unix() * 1000;
	    };
	    CalendarComponent.prototype.computeClosestMonday = function (m) {
	        var startDayMoment = moment().startOf("week").add(1, "days");
	        if (startDayMoment > moment()) {
	            // It must be Sunday, handle the edge case by subtracting off a week.
	            startDayMoment = startDayMoment.subtract(1, "week");
	        }
	        return startDayMoment;
	    };
	    CalendarComponent.prototype.divideAndSort = function (startTimestamp, viewType, events) {
	        var _this = this;
	        var columnList;
	        if (viewType == CalendarViewType.week) {
	            // Note that the columns will be ordered with the weekend at the end.
	            columnList = [[], [], [], [], [], [], []];
	        }
	        else {
	            columnList = [[]];
	        }
	        var dayStart = moment(startTimestamp); // From seconds back into moment
	        // I just died a little inside, refactor this to somewhere more re-usable.
	        var allChildIdsOfSelectedTag = {};
	        if (this.state && this.state.selectedTag) {
	            var queue = [this.state.selectedTag];
	            while (queue.length) {
	                var curTag = queue.pop();
	                allChildIdsOfSelectedTag[curTag.id] = true;
	                for (var _i = 0, _a = curTag.childTagIds; _i < _a.length; _i++) {
	                    var tagId = _a[_i];
	                    if (!allChildIdsOfSelectedTag[tagId]) {
	                        queue.push(this.props.tagsById[tagId]);
	                    }
	                }
	            }
	        }
	        var shouldHide = function (event) {
	            if (_this.state && _this.state.selectedTag) {
	                // See if the task has the right tag
	                var matches_1 = false;
	                event.tagIds.forEach(function (tagId) {
	                    matches_1 = matches_1 || allChildIdsOfSelectedTag[tagId];
	                });
	                if (!matches_1) {
	                    return true;
	                }
	            }
	            return false;
	        };
	        // Divide the events by start day
	        events.forEach(function (event) {
	            var startTimestamp = event.startTime;
	            var endTimestamp = startTimestamp + event.durationSecs * 1000;
	            for (var index in DAYS) {
	                if (shouldHide(event)) {
	                    return;
	                }
	                var curTimestamp = moment(dayStart).add(index, "days").unix() * 1000;
	                // See if any part of the event falls within this day. If the part that does does
	                // not include the beginning, we need to make a fake event. There should only
	                // be at most one event in each column for the same event.
	                if (curTimestamp < endTimestamp) {
	                    if (curTimestamp >= startTimestamp) {
	                        // We are in a partial day, create a fake event.
	                        columnList[index].push(event);
	                    }
	                    else if (curTimestamp + 24 * 60 * 60 * 1000 > startTimestamp) {
	                        // This day contains the start timestamp, push it on as normal.
	                        columnList[index].push(event);
	                    }
	                }
	                // This is pretty hacky, make this cleaner later
	                if (viewType == CalendarViewType.day) {
	                    // We only want to iterate once if we're in day view
	                    break;
	                }
	            }
	        });
	        columnList.forEach(function (column) {
	            column.sort(function (event1, event2) {
	                var diff = event1.startTime - event2.startTime;
	                if (diff != 0) {
	                    return diff;
	                }
	                // We want the larger events to be sorted first if they have the same start time
	                return event2.durationSecs - event1.durationSecs;
	            });
	        });
	        // After sorting the events, run the division alg on each column
	        var eventToRenderingInfo = {};
	        columnList.forEach(function (column) {
	            // TODO: precompute the max size of aux in order to calculate extra space later.
	            var aux = [];
	            column.forEach(function (event) {
	                // Base case for the initial element
	                if (!aux.length) {
	                    aux.push(event);
	                    eventToRenderingInfo[event.id] = {
	                        index: 0,
	                        columnWidth: 1,
	                        extraCols: 0,
	                    };
	                    return;
	                }
	                var slotUsed = false;
	                // If this event doesn't overlap with an element in the array, replace it.
	                // During the replace, we need to calculate what the max width was for the element.
	                aux.forEach(function (auxEvent, index) {
	                    if (!auxEvent || event.startTime >= auxEvent.startTime + (auxEvent.durationSecs * 1000)) {
	                        // Doesn't overlap, will use this slot (if it's the first) and evict
	                        if (!slotUsed) {
	                            slotUsed = true;
	                            // Replace out this element
	                            aux[index] = event;
	                            eventToRenderingInfo[event.id] = {
	                                index: index,
	                                columnWidth: 0,
	                                extraCols: 0,
	                            };
	                        }
	                        else {
	                            aux[index] = null;
	                        }
	                    }
	                });
	                // If this event overlaps with whatever is in aux, we must append
	                if (!slotUsed) {
	                    // Append to the end
	                    aux.forEach(function (auxEvent) {
	                        if (!auxEvent) {
	                            return;
	                        }
	                        eventToRenderingInfo[auxEvent.id].columnWidth = aux.length + 1;
	                    });
	                    eventToRenderingInfo[event.id] = {
	                        columnWidth: aux.length + 1,
	                        index: aux.length,
	                        extraCols: 0,
	                    };
	                    aux.push(event);
	                }
	                else {
	                    // See if we need to resize aux
	                    while (aux.length && aux[aux.length - 1] == null) {
	                        aux.pop();
	                    }
	                    // Everything left in the aux array at this point must be overlapping at some point
	                    var numNotNull_1 = 0;
	                    var maxWidth_1 = aux.length;
	                    aux.forEach(function (auxEvent) {
	                        if (auxEvent) {
	                            numNotNull_1++;
	                            maxWidth_1 = Math.max(maxWidth_1, eventToRenderingInfo[auxEvent.id].columnWidth);
	                        }
	                    });
	                    aux.forEach(function (auxEvent) {
	                        if (!auxEvent) {
	                            return;
	                        }
	                        var newWidth = Math.max(numNotNull_1, eventToRenderingInfo[auxEvent.id].columnWidth);
	                        eventToRenderingInfo[auxEvent.id].columnWidth = newWidth;
	                        eventToRenderingInfo[auxEvent.id].extraCols = maxWidth_1 - newWidth;
	                    });
	                }
	            });
	        });
	        return [columnList, eventToRenderingInfo];
	    };
	    CalendarComponent.prototype.resort = function () {
	        // Recompute all the events and where to render them:
	        var _a = this.divideAndSort(this.state.startDayTimestamp, this.state.viewType, this.props.events), columns = _a[0], eventToRenderingInfo = _a[1];
	        this.state.columns = columns;
	        this.state.eventToRenderingInfo = eventToRenderingInfo;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.onDoubleClick = function (event) {
	        this.state.editingEvent = event;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.changeWeek = function () {
	        // TODO: implement pagination
	    };
	    CalendarComponent.prototype.computeTimestamp = function (day, index) {
	        var offset = index;
	        if (this.state.viewType == CalendarViewType.week) {
	            DAYS.forEach(function (curDay, i) {
	                if (curDay != day) {
	                    return;
	                }
	                offset += i * (60 * 60 * 24);
	            });
	        }
	        return moment(this.state.startDayTimestamp).add(offset, "seconds").unix() * 1000;
	    };
	    CalendarComponent.prototype.cellMouseDown = function (day, index, event) {
	        this.state.draggingStartTimestamp = this.computeTimestamp(day, index);
	        this.state.draggingEndTimestamp = this.state.draggingStartTimestamp;
	        this.updateCreateEventTimestamp();
	        this.setState(this.state);
	        event.preventDefault();
	    };
	    CalendarComponent.prototype.updateCreateEventTimestamp = function () {
	        if (this.state.draggingEndTimestamp < this.state.draggingStartTimestamp) {
	            // We dragged backwards, use the end timestamp
	            this.state.createEventTimestamp = this.state.draggingEndTimestamp;
	        }
	        else {
	            // Just set the start timestamp
	            this.state.createEventTimestamp = this.state.draggingStartTimestamp;
	        }
	    };
	    CalendarComponent.prototype.updateCreateEventDurationSecs = function () {
	        var start, end;
	        if (this.state.draggingEndTimestamp < this.state.draggingStartTimestamp) {
	            start = this.state.draggingEndTimestamp;
	            end = this.state.draggingStartTimestamp;
	        }
	        else {
	            start = this.state.draggingStartTimestamp;
	            end = this.state.draggingEndTimestamp;
	        }
	        var duration = (end - start);
	        duration /= 1000; // convert to seconds
	        duration += GRANULARITY; // dragging to the same cell means to make duration equal to GRANULARITY
	        this.state.createEventDurationSecs = duration;
	    };
	    CalendarComponent.prototype.cellMouseOver = function (day, index) {
	        if (!this.state.draggingStartTimestamp) {
	            // No dragging was happening, nothing to do.
	            return;
	        }
	        this.state.draggingEndTimestamp = this.computeTimestamp(day, index);
	        this.updateCreateEventTimestamp();
	        this.updateCreateEventDurationSecs();
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.cellMouseUp = function (day, index) {
	        if (!this.state.draggingStartTimestamp) {
	            // No dragging was happening, nothing to do.
	            return;
	        }
	        this.state.draggingEndTimestamp = this.computeTimestamp(day, index);
	        this.updateCreateEventTimestamp();
	        this.updateCreateEventDurationSecs();
	        this.state.draggingStartTimestamp = null;
	        this.state.draggingEndTimestamp = null;
	        this.state.showCreate = true;
	        this.setState(this.state);
	        // Move focus to the event name field
	        jQuery("input#event-name").focus();
	    };
	    CalendarComponent.prototype.onDrop = function (day, index) {
	        if (this.state.draggingEvent) {
	            // Update the event with the new timestamp
	            this.state.draggingEvent.startTime = this.computeTimestamp(day, index);
	            this.props.updateEvent(this.state.draggingEvent);
	            this.state.draggingEvent = null;
	            this.setState(this.state);
	            this._dragTargetEventElement.show();
	        }
	        else if (this.state.endDraggingEvent) {
	            var timestamp = this.computeTimestamp(day, index);
	            var newDuration = timestamp - this.state.endDraggingEvent.startTime;
	            newDuration = Math.max(Math.round(newDuration / 1000) + GRANULARITY, GRANULARITY);
	            this.state.endDraggingEvent.durationSecs = newDuration;
	            this.props.updateEvent(this.state.endDraggingEvent);
	            this.state.endDraggingEvent = null;
	            this.setState(this.state);
	        }
	        else {
	            // No event was being dragged
	            return;
	        }
	    };
	    CalendarComponent.prototype.onDropPassThrough = function (event) {
	        var xPos = event.clientX;
	        var yPos = event.clientY;
	        // Hide the element
	        jQuery(event.currentTarget).hide();
	        var dropTargetBelow = jQuery(document.elementFromPoint(xPos, yPos));
	        if (dropTargetBelow.prop("tagName") == "TD") {
	            // Great, we found a cell that we can actually finish dropping into
	            var data = dropTargetBelow.data();
	            this.onDrop(data.day, data.index);
	        }
	        else {
	        }
	        // Show the element again
	        jQuery(event.currentTarget).show();
	        event.preventDefault();
	        event.stopPropagation();
	    };
	    CalendarComponent.prototype.onDragOverPassThrough = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	    };
	    CalendarComponent.prototype.onDragStart = function (event, dragEvent) {
	        if (this.state.endDraggingEvent || this.state.draggingEvent) {
	            throw Error("Already was dragging an event...");
	        }
	        this.state.draggingEvent = event;
	        this.setState(this.state);
	        this._dragTargetEventElement = jQuery(dragEvent.target);
	    };
	    CalendarComponent.prototype.onDragEnd = function (event) {
	        if (this.state.draggingEvent != event) {
	            return;
	        }
	        this.state.draggingEvent = null;
	        this.setState(this.state);
	        this._dragTargetEventElement.show();
	    };
	    CalendarComponent.prototype.onEventEndDragStart = function (event) {
	        if (this.state.endDraggingEvent || this.state.draggingEvent) {
	            throw Error("Already dragging an event...");
	        }
	        this.state.endDraggingEvent = event;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.onEventEndDragEnd = function (event) {
	        if (this.state.endDraggingEvent != event) {
	            return;
	        }
	        this.state.endDraggingEvent = null;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.onDragOver = function (day, index, event) {
	        if (this.state.draggingEvent) {
	            this._dragTargetEventElement.hide();
	            var timestamp = this.computeTimestamp(day, index);
	            // Conceptually this is needed because short events should register only a single cell
	            // to be highlighted.
	            var truncatedDuration = Math.max(0, this.state.draggingEvent.durationSecs - GRANULARITY);
	            var endTimestamp = timestamp + truncatedDuration * 1000;
	            if (this.state.draggingStartTimestamp != timestamp ||
	                this.state.draggingEndTimestamp != endTimestamp) {
	                this.state.draggingStartTimestamp = timestamp;
	                this.state.draggingEndTimestamp = endTimestamp;
	                this.setState(this.state);
	            }
	        }
	        else if (this.state.endDraggingEvent) {
	            var timestamp = this.computeTimestamp(day, index);
	            this.state.draggingEndTimestamp = timestamp;
	            if (this.state.draggingStartTimestamp != this.state.endDraggingEvent.startTime ||
	                this.state.draggingEndTimestamp != timestamp) {
	                this.state.draggingStartTimestamp = this.state.endDraggingEvent.startTime;
	                this.state.draggingEndTimestamp = timestamp;
	                this.setState(this.state);
	            }
	        }
	        else {
	            // Nothing being dragged
	            return;
	        }
	        event.preventDefault();
	    };
	    CalendarComponent.prototype.onDragLeave = function (day, index, event) {
	        if (this.state.draggingEvent) {
	            if (this.state.draggingStartTimestamp) {
	                var timestamp = this.computeTimestamp(day, index);
	                // Clear out the dragging info if we were the last one that was dragged over.
	                if (timestamp == this.state.draggingStartTimestamp) {
	                    this.state.draggingStartTimestamp = null;
	                    this.state.draggingEndTimestamp = null;
	                    this.setState(this.state);
	                }
	            }
	        }
	        else if (this.state.endDraggingEvent) {
	            if (this.state.draggingEndTimestamp) {
	                var timestamp = this.computeTimestamp(day, index);
	                if (timestamp == this.state.draggingEndTimestamp) {
	                    this.state.draggingStartTimestamp = null;
	                    this.state.draggingEndTimestamp = null;
	                    this.setState(this.state);
	                }
	            }
	        }
	    };
	    CalendarComponent.prototype.getCurrentTagToken = function () {
	        if (!this.state.selectedTag) {
	            return [];
	        }
	        return [{
	                label: this.state.selectedTag.name,
	                value: this.state.selectedTag.id,
	            }];
	    };
	    CalendarComponent.prototype.changeCurrentTagToken = function (newTokens) {
	        if (newTokens.length) {
	            this.state.selectedTag = this.props.tagsById[newTokens[0].value];
	        }
	        else {
	            this.state.selectedTag = null;
	        }
	        this.resort();
	    };
	    CalendarComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        // We should think about excluding tokens from here that would cause cycles.
	        var allNames = [];
	        Object.keys(this.props.tagsById).forEach(function (tagId) {
	            var tag = _this.props.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    CalendarComponent.prototype.renderTagSelector = function () {
	        return (React.createElement("div", { className: "tag-selector-container" },
	            React.createElement("div", { className: "tag-selector-label" }, "Filter Tag:"),
	            React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.changeCurrentTagToken.bind(this), initialValues: this.getCurrentTagToken(), possibleTokens: this.getAllTagNames(), tokenLimit: 1 })));
	    };
	    CalendarComponent.prototype.changeCellHeight = function (event) {
	        this.state.cellHeight = event.target.value;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.renderCellSizeSlider = function () {
	        return (React.createElement("div", { className: "cell-size-slider" },
	            React.createElement("input", { type: "range", min: "20", max: "100", value: this.state.cellHeight, onChange: this.changeCellHeight.bind(this) })));
	    };
	    CalendarComponent.prototype.changeViewType = function (type) {
	        if (this.state.viewType == type) {
	            // No transition needed
	            return;
	        }
	        var startDayMoment;
	        if (this.state.viewType == CalendarViewType.week && type == CalendarViewType.day) {
	            // Week to day transition, need to either pick today or Monday
	            var monday = moment(this.state.startDayTimestamp);
	            var now = moment();
	            if (now.unix() - monday.unix() > 0 && monday.add(1, "week").unix() - now.unix() > 0) {
	                // Current week view contains today, we will use today as the answer.
	                this.state.startDayTimestamp = this.computeTodayStartTime(type);
	            }
	            else {
	            }
	            react_router_1.browserHistory.push("/cal/day");
	        }
	        else if (this.state.viewType == CalendarViewType.day && type == CalendarViewType.week) {
	            // Day to week transition, need to find the nearest Monday
	            startDayMoment = this.computeClosestMonday(moment(this.state.startDayTimestamp));
	            this.state.startDayTimestamp = startDayMoment.unix() * 1000;
	            react_router_1.browserHistory.push("/cal/week");
	        }
	        else {
	            throw Error("Unknown view type transition");
	        }
	        this.state.viewType = type;
	        this.resort();
	    };
	    CalendarComponent.prototype.renderViewChoice = function (type) {
	        var className = "view-type-choice";
	        if (type == this.state.viewType) {
	            className += " -selected";
	        }
	        var typeToName = {};
	        typeToName[CalendarViewType.day] = "Day";
	        typeToName[CalendarViewType.week] = "Week";
	        return (React.createElement("div", { className: className, key: type, onClick: this.changeViewType.bind(this, type) }, typeToName[type]));
	    };
	    CalendarComponent.prototype.renderChangeViewType = function () {
	        return (React.createElement("div", { className: "view-type-selector" },
	            this.renderViewChoice(CalendarViewType.week),
	            this.renderViewChoice(CalendarViewType.day)));
	    };
	    CalendarComponent.prototype.changePage = function (diff) {
	        if (this.state.viewType == CalendarViewType.week) {
	            diff *= 7;
	        }
	        // Diff is the difference in days to add to the current time. If it's 0, we reset back
	        // to the current day.
	        if (diff == 0) {
	            this.state.startDayTimestamp = this.computeTodayStartTime(this.state.viewType);
	        }
	        else {
	            this.state.startDayTimestamp = moment(this.state.startDayTimestamp).add(diff, "days").unix() * 1000;
	        }
	        this.resort();
	    };
	    CalendarComponent.prototype.renderPagination = function () {
	        return (React.createElement("div", { className: "pagination-container" },
	            React.createElement("div", { className: "pagination-option", onClick: this.changePage.bind(this, -1) }, "Previous"),
	            React.createElement("div", { className: "pagination-option", onClick: this.changePage.bind(this, 1) }, "Next"),
	            React.createElement("div", { className: "pagination-option", onClick: this.changePage.bind(this, 0) }, "Today")));
	    };
	    CalendarComponent.prototype.renderOptions = function () {
	        return (React.createElement("div", { className: "options" },
	            this.renderCellSizeSlider(),
	            this.renderTagSelector(),
	            this.renderChangeViewType(),
	            this.renderPagination()));
	    };
	    CalendarComponent.prototype.renderCells = function (day) {
	        var _this = this;
	        var getColumnRow = function (index) {
	            var key = "" + index;
	            var style = { height: _this.state.cellHeight + "px" };
	            var timestamp = _this.computeTimestamp(day, index);
	            var className = "";
	            if (_this.state.draggingStartTimestamp && _this.state.draggingEndTimestamp) {
	                // We are currently dragging, see if this cell is in the range
	                var start = _this.state.draggingStartTimestamp;
	                var end = _this.state.draggingEndTimestamp;
	                if (end < start) {
	                    start = _this.state.draggingEndTimestamp;
	                    end = _this.state.draggingStartTimestamp;
	                }
	                if (timestamp >= start && timestamp < end + (GRANULARITY * 1000)) {
	                    className = "-selected";
	                }
	            }
	            if (day == "times") {
	                var timeHeader = "";
	                if (index % (GRANULARITY * 2) == 0) {
	                    timeHeader = moment(_this.state.startDayTimestamp)
	                        .add(index, "seconds").format("h:mm a");
	                }
	                return (React.createElement("tr", { key: key, style: style },
	                    React.createElement("td", null, timeHeader)));
	            }
	            else {
	                return (React.createElement("tr", { key: key, style: style },
	                    React.createElement("td", { className: className, "data-day": day, "data-index": index, onMouseDown: _this.cellMouseDown.bind(_this, day, index), onMouseOver: _this.cellMouseOver.bind(_this, day, index), onMouseUp: _this.cellMouseUp.bind(_this, day, index), onDrop: _this.onDrop.bind(_this, day, index), onDragOver: _this.onDragOver.bind(_this, day, index), onDragLeave: _this.onDragLeave.bind(_this, day, index) }, " ")));
	            }
	        };
	        var i = 0; // midnight
	        var tableRows = [];
	        for (; i < 60 * 60 * 24; i += GRANULARITY) {
	            tableRows.push(getColumnRow(i));
	        }
	        return (React.createElement("table", { cellPadding: "0", cellSpacing: "0" },
	            React.createElement("tbody", null, tableRows)));
	    };
	    CalendarComponent.prototype.renderCurrentTimeCursor = function (index) {
	        var columnTimeRange = 24 * 60 * 60 * 1000;
	        var columnStartTimestamp = this.state.startDayTimestamp + index * columnTimeRange;
	        var currentTime = moment().unix() * 1000;
	        if (currentTime >= columnStartTimestamp &&
	            currentTime < columnStartTimestamp + columnTimeRange) {
	            // Okay we can actually render it here.
	            var offset = (currentTime - columnStartTimestamp) / columnTimeRange;
	            offset *= this.state.cellHeight * (86400 / GRANULARITY); // Total height of a column
	            offset -= 2; // Draw it 2 pixels higher because it's width 3.
	            var style = {
	                "top": offset + "px",
	            };
	            return React.createElement("div", { className: "current-time-cursor", style: style, "data-top": offset });
	        }
	    };
	    CalendarComponent.prototype.renderColumn = function (columnIndex, column, singleDay) {
	        var _this = this;
	        var day = DAYS[columnIndex];
	        var className = "column-container";
	        if (singleDay) {
	            className += " single-day";
	        }
	        return React.createElement("div", { key: day, className: className },
	            this.renderCells(day),
	            this.renderCurrentTimeCursor(columnIndex),
	            column.map(function (event) {
	                var dayOffset = event.startTime - (_this.state.startDayTimestamp + columnIndex * 24 * 60 * 60 * 1000);
	                dayOffset /= 1000 * 86400;
	                dayOffset *= _this.state.cellHeight * (86400 / GRANULARITY); // Total height of a column
	                var multiDayAdjustment = 0;
	                if (dayOffset < 0) {
	                    multiDayAdjustment = -dayOffset;
	                    dayOffset = 0;
	                }
	                var height = (event.durationSecs / GRANULARITY) * _this.state.cellHeight;
	                height -= multiDayAdjustment;
	                var bottomOverflow = (_this.state.cellHeight * (86400 / GRANULARITY)) - (dayOffset + height);
	                if (bottomOverflow < 0) {
	                    height += bottomOverflow;
	                }
	                // calculate the width change
	                // TODO: The extra cols only work right now with the expand-to-the-right case
	                var renderingInfo = _this.state.eventToRenderingInfo[event.id];
	                var width = renderingInfo.columnWidth;
	                if (renderingInfo.extraCols) {
	                    width += renderingInfo.extraCols;
	                }
	                var widthPercentage = (100.0 / width) * (1 + renderingInfo.extraCols);
	                var marginLeft = widthPercentage * renderingInfo.index;
	                // We subtract 2 from the height purely for stylistic reasons.
	                var style = {
	                    "height": height - 2 + "px",
	                    "maxHeight": height + "px",
	                    "top": dayOffset + "px",
	                    "marginLeft": marginLeft + "%",
	                    "width": widthPercentage + "%",
	                };
	                return (React.createElement("div", { className: "rendered-event-container", key: event.id, style: style, onDrop: _this.onDropPassThrough.bind(_this), onDragOver: _this.onDragOverPassThrough },
	                    React.createElement("div", { className: "rendered-event card", draggable: true, onDragStart: _this.onDragStart.bind(_this, event), onDragEnd: _this.onDragEnd.bind(_this, event), onDoubleClick: _this.onDoubleClick.bind(_this, event) },
	                        React.createElement(event_1.EventComponent, { event: event, tagsById: _this.props.tagsById })),
	                    React.createElement("div", { className: "draggable-event-end", draggable: true, onDragStart: _this.onEventEndDragStart.bind(_this, event), onDragEnd: _this.onEventEndDragEnd.bind(_this, event) })));
	            }));
	    };
	    CalendarComponent.prototype.renderWeekViewColumns = function () {
	        var _this = this;
	        return React.createElement("div", { className: "full-column-container" },
	            React.createElement("div", { className: "header-and-content-container" },
	                React.createElement("div", { className: "column-header-container" },
	                    React.createElement("div", { className: "column-header -times" }, "Time"),
	                    DAYS.map(function (day, index) {
	                        var m = moment(_this.state.startDayTimestamp).add(index, "days");
	                        return React.createElement("div", { key: day, className: "column-header" }, m.format("ddd M/D"));
	                    })),
	                React.createElement("div", { className: "all-columns-container" },
	                    React.createElement("div", { className: "column-container -times" }, this.renderCells("times")),
	                    [0, 1, 2, 3, 4, 5, 6].map(function (index, i) {
	                        return _this.renderColumn(index, _this.state.columns[i]);
	                    }))));
	    };
	    CalendarComponent.prototype.renderTodayString = function () {
	        return moment(this.state.startDayTimestamp).format("LL");
	    };
	    CalendarComponent.prototype.renderDayViewColumns = function () {
	        var _this = this;
	        return React.createElement("div", { className: "full-column-container" },
	            React.createElement("div", { className: "header-and-content-container" },
	                React.createElement("div", { className: "column-header-container" },
	                    React.createElement("div", { className: "column-header -times" }, "Time"),
	                    React.createElement("div", { className: "column-header single-day" }, this.renderTodayString())),
	                React.createElement("div", { className: "all-columns-container" },
	                    React.createElement("div", { className: "column-container -times" }, this.renderCells("times")),
	                    [0].map(function (index, i) {
	                        return _this.renderColumn(index, _this.state.columns[i], true);
	                    }))));
	    };
	    CalendarComponent.prototype.renderColumns = function () {
	        if (this.state.viewType == CalendarViewType.week) {
	            return this.renderWeekViewColumns();
	        }
	        else if (this.state.viewType == CalendarViewType.day) {
	            return this.renderDayViewColumns();
	        }
	    };
	    CalendarComponent.prototype.clearEditingEvent = function () {
	        this.state.editingEvent = null;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.renderEditingEvent = function () {
	        if (!this.state.editingEvent) {
	            return;
	        }
	        return React.createElement(modal_1.ModalComponent, { cancelFunc: this.clearEditingEvent.bind(this) },
	            React.createElement(edit_event_1.EditEventComponent, { meUser: this.props.meUser, event: this.state.editingEvent, tagsById: this.props.tagsById, createMode: false, tasks: this.props.tasks, createEvent: function (event) { }, updateEvent: this.props.updateEvent, deleteEvent: this.props.deleteEvent }));
	    };
	    CalendarComponent.prototype.closeCreateEvent = function () {
	        this.state.showCreate = false;
	        this.setState(this.state);
	    };
	    CalendarComponent.prototype.createEvent = function (event) {
	        this.closeCreateEvent();
	        this.props.createEvent(event);
	    };
	    CalendarComponent.prototype.renderCreateEvent = function () {
	        if (!this.state.showCreate) {
	            return;
	        }
	        var initialTags = [];
	        if (this.state.selectedTag) {
	            initialTags.push(this.state.selectedTag.id);
	        }
	        return React.createElement(modal_1.ModalComponent, { cancelFunc: this.closeCreateEvent.bind(this) },
	            React.createElement(edit_event_1.EditEventComponent, { meUser: this.props.meUser, tagsById: this.props.tagsById, createMode: true, tasks: this.props.tasks, initialTags: initialTags, initialCreationTime: this.state.createEventTimestamp, initialDurationSecs: this.state.createEventDurationSecs, createEvent: this.createEvent.bind(this), updateEvent: function (event) { }, deleteEvent: function (event) { } }));
	    };
	    CalendarComponent.prototype.render = function () {
	        return React.createElement("div", { className: "calendar" },
	            this.renderOptions(),
	            this.renderColumns(),
	            this.renderEditingEvent(),
	            this.renderCreateEvent());
	    };
	    return CalendarComponent;
	}(React.Component));
	exports.CalendarComponent = CalendarComponent;


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tokenizer_1 = __webpack_require__(12);
	var EditEventComponent = (function (_super) {
	    __extends(EditEventComponent, _super);
	    function EditEventComponent(props) {
	        var _this = _super.call(this, props) || this;
	        if (props.createMode) {
	            _this.state = {
	                event: _this._getEmptyEvent(props.meUser, props.initialCreationTime, props.initialDurationSecs, props.initialTags),
	                submitted: false,
	            };
	        }
	        else {
	            _this.state = {
	                event: props.event,
	                submitted: false,
	            };
	        }
	        return _this;
	    }
	    EditEventComponent.prototype.componentWillReceiveProps = function (newProps) {
	        if (newProps.createMode) {
	            var newEvent = this._getEmptyEvent(newProps.meUser, newProps.initialCreationTime, newProps.initialDurationSecs, newProps.initialTags);
	            if (this.state && !this.state.submitted) {
	                // Copy over the name field so it doesn't get cleared out. As well as all fields
	                // that weren't set in the new props.
	                if (newProps.initialCreationTime == null) {
	                    newEvent.startTime = this.state.event.startTime;
	                }
	                if (newProps.initialDurationSecs == null) {
	                    newEvent.durationSecs = this.state.event.durationSecs;
	                }
	                if (!(newProps.initialTags && newProps.initialTags.length)) {
	                    newEvent.tagIds = this.state.event.tagIds;
	                }
	                newEvent.name = this.state.event.name;
	            }
	            this.setState({ event: newEvent, submitted: false });
	        }
	        else {
	            this.setState({ event: newProps.event, submitted: false });
	        }
	    };
	    EditEventComponent.prototype._getEmptyEvent = function (user, initialCreationTime, initialDurationSecs, initialTags) {
	        return {
	            id: 0,
	            name: '',
	            authorId: user.id,
	            ownerId: user.id,
	            tagIds: (initialTags) ? initialTags : [],
	            startTime: (initialCreationTime) ? initialCreationTime : 0,
	            durationSecs: (initialDurationSecs) ? initialDurationSecs : 900,
	            taskIds: [],
	        };
	    };
	    EditEventComponent.prototype.submitForm = function (eventType) {
	        if (eventType == "save") {
	            this.props.updateEvent(this.state.event);
	        }
	        else if (eventType == "delete") {
	            this.props.deleteEvent(this.state.event);
	        }
	        else if (eventType == "create") {
	            this.props.createEvent(this.state.event);
	        }
	        else {
	            throw Error("Unknown submit type!");
	        }
	        // Reset the form after a submission. We don't clear anything out in case the
	        // request fails. We wait for the new props to actually clear it out.
	        this.state.submitted = true;
	        this.setState(this.state);
	    };
	    EditEventComponent.prototype.onKeyDownCreate = function (event) {
	        if (event.key == "Enter" && this.props.createMode) {
	            this.submitForm("create");
	        }
	    };
	    EditEventComponent.prototype.updateAttr = function (attrName, event) {
	        this.state.event[attrName] = event.target.value;
	        this.setState(this.state);
	    };
	    EditEventComponent.prototype.getCurrentTags = function () {
	        var _this = this;
	        var tagNames = [];
	        this.state.event.tagIds.forEach(function (tagId) {
	            var tag = _this.props.tagsById[tagId];
	            tagNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return tagNames;
	    };
	    EditEventComponent.prototype.getAllTagNames = function () {
	        var _this = this;
	        // This function is used to determine the set of valid tokens for the tokenizer.
	        var allNames = [];
	        Object.keys(this.props.tagsById).forEach(function (tagId) {
	            var tag = _this.props.tagsById[+tagId];
	            allNames.push({
	                label: tag.name,
	                value: tag.id
	            });
	        });
	        return allNames;
	    };
	    EditEventComponent.prototype.retrieveTagNames = function (tokens) {
	        this.state.event.tagIds = tokens.map(function (token) {
	            return token.value;
	        });
	        this.setState(this.state);
	    };
	    EditEventComponent.prototype.getCurrentTasks = function () {
	        // TODO: Do after we have the format
	        return this.state.event.taskIds.map(function (taskId) {
	            return {
	                label: "T" + taskId,
	                value: taskId,
	            };
	        });
	    };
	    EditEventComponent.prototype.getAllTaskNames = function () {
	        return this.props.tasks.map(function (task) {
	            return {
	                label: "T" + task.id,
	                value: task.id
	            };
	        });
	    };
	    EditEventComponent.prototype.retrieveTaskNames = function (tokens) {
	        this.state.event.taskIds = tokens.map(function (token) {
	            return token.value;
	        });
	        this.setState(this.state);
	    };
	    EditEventComponent.prototype.renderFormTitle = function () {
	        if (this.props.createMode) {
	            return React.createElement("h3", null, "Create Event");
	        }
	        else {
	            return React.createElement("h3", null,
	                "Editing E",
	                this.state.event.id);
	        }
	    };
	    EditEventComponent.prototype.renderButtons = function () {
	        if (this.props.createMode) {
	            return (React.createElement("div", { className: "edit-event-button-container" },
	                React.createElement("input", { type: "button", value: "create", onClick: this.submitForm.bind(this, "create") })));
	        }
	        else {
	            return (React.createElement("div", { className: "edit-event-button-container" },
	                React.createElement("input", { type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete") }),
	                React.createElement("input", { type: "button", value: "save", onClick: this.submitForm.bind(this, "save") })));
	        }
	    };
	    EditEventComponent.prototype.renderForm = function () {
	        return React.createElement("div", null,
	            React.createElement("div", { className: "name-container" },
	                React.createElement("label", { htmlFor: "name" }, "Name: "),
	                React.createElement("input", { id: "event-name", type: "text", name: "name", value: this.state.event.name, onKeyDown: this.onKeyDownCreate.bind(this), onChange: this.updateAttr.bind(this, "name") })),
	            React.createElement("div", { className: "tag-tokenizer-container" },
	                React.createElement("label", null, "Tags:"),
	                React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.retrieveTagNames.bind(this), initialValues: this.getCurrentTags(), possibleTokens: this.getAllTagNames() })),
	            React.createElement("div", { className: "task-tokenizer-container" },
	                React.createElement("label", null, "Tasks:"),
	                React.createElement(tokenizer_1.TokenizerComponent, { onChange: this.retrieveTaskNames.bind(this), initialValues: this.getCurrentTasks(), possibleTokens: this.getAllTaskNames() })),
	            React.createElement("div", { className: "duration-secs-container" },
	                React.createElement("label", { htmlFor: "duration-secs" }, "Duration (seconds): "),
	                React.createElement("input", { type: "number", name: "duration-secs", value: this.state.event.durationSecs, onChange: this.updateAttr.bind(this, "durationSecs") })),
	            this.renderButtons());
	    };
	    EditEventComponent.prototype.render = function () {
	        return React.createElement("div", { className: "edit-event-container" },
	            this.renderFormTitle(),
	            this.renderForm());
	    };
	    return EditEventComponent;
	}(React.Component));
	exports.EditEventComponent = EditEventComponent;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tag_1 = __webpack_require__(18);
	var EventComponent = (function (_super) {
	    __extends(EventComponent, _super);
	    function EventComponent() {
	        return _super.apply(this, arguments) || this;
	    }
	    EventComponent.prototype.renderTag = function (tagId) {
	        var tag = this.props.tagsById[tagId];
	        return React.createElement(tag_1.TagComponent, { tag: tag, key: tagId });
	    };
	    EventComponent.prototype.renderName = function () {
	        return React.createElement("div", { className: "name" }, this.props.event.name);
	    };
	    ;
	    EventComponent.prototype.renderTags = function () {
	        if (!this.props.event.tagIds.length) {
	            return;
	        }
	        return (React.createElement("div", { className: "event-tags-container" }, this.props.event.tagIds.map(this.renderTag.bind(this))));
	    };
	    EventComponent.prototype.renderTasks = function () {
	        if (!this.props.event.taskIds.length) {
	            return;
	        }
	        return (React.createElement("div", { className: "event-tasks-container" }, this.props.event.taskIds.map(function (taskId) {
	            return React.createElement("div", { className: "task-id-card card" }, "T" + taskId);
	        })));
	    };
	    EventComponent.prototype.render = function () {
	        return React.createElement("div", { className: "event-container" },
	            this.renderName(),
	            React.createElement("div", { className: "event-card-container" },
	                this.renderTags(),
	                this.renderTasks()));
	    };
	    return EventComponent;
	}(React.Component));
	exports.EventComponent = EventComponent;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var react_router_1 = __webpack_require__(7);
	var app_1 = __webpack_require__(9);
	var AppHeader = (function (_super) {
	    __extends(AppHeader, _super);
	    function AppHeader() {
	        return _super.apply(this, arguments) || this;
	    }
	    AppHeader.prototype.renderAccountInfo = function () {
	        return React.createElement("div", { className: "profile-container" }, "Logged in as: " + this.props.meUser.username);
	    };
	    AppHeader.prototype.renderViewModeSelector = function () {
	        var _this = this;
	        var viewModeToName = {};
	        viewModeToName[app_1.AppViewMode.taskView] = "Task Board";
	        viewModeToName[app_1.AppViewMode.eventView] = "Calendar";
	        viewModeToName[app_1.AppViewMode.tagView] = "Tag Graph";
	        var linkMap = {};
	        linkMap[app_1.AppViewMode.taskView] = "/tasks";
	        linkMap[app_1.AppViewMode.eventView] = "/cal";
	        linkMap[app_1.AppViewMode.tagView] = "/tags";
	        return React.createElement("div", { className: "view-mode-selector" }, Object.keys(app_1.AppViewMode).map(function (viewMode) {
	            if (!viewModeToName.hasOwnProperty(viewMode)) {
	                return;
	            }
	            var className = "view-mode-option";
	            if (+viewMode == _this.props.viewMode) {
	                className += " -selected";
	            }
	            return React.createElement(react_router_1.Link, { key: viewMode, className: className, to: linkMap[+viewMode] }, viewModeToName[+viewMode]);
	        }));
	    };
	    AppHeader.prototype.render = function () {
	        return React.createElement("div", { className: "header-container" },
	            React.createElement("h1", { className: "header-title" }, "Starter"),
	            this.renderAccountInfo(),
	            this.renderViewModeSelector());
	    };
	    return AppHeader;
	}(React.Component));
	exports.AppHeader = AppHeader;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var moment = __webpack_require__(29);
	var React = __webpack_require__(5);
	var LOOP_FREQ = 60; // 1 minute
	var FORCED_INTERVAL = 300; // We will at most send 1 notification every (this) many seconds
	var LAG_THRESHOLD = 900; // After this many seconds, we will 100% chance send a notification
	var NotifierComponent = (function (_super) {
	    __extends(NotifierComponent, _super);
	    function NotifierComponent(props) {
	        var _this = _super.call(this, props) || this;
	        _this.loopId = 0;
	        _this.state = {
	            enabled: false,
	            // We don't set this to 0 so that we don't immediately spam notifications on startup.
	            // This is also needed post-redirect, so that we don't keep spamming on the way to
	            // the user fixing the issue.
	            lastNotificationTime: moment().unix() - FORCED_INTERVAL,
	        };
	        return _this;
	    }
	    NotifierComponent.prototype.componentDidMount = function () {
	        this.requestNotificationPermission();
	        this.beginLoop();
	    };
	    NotifierComponent.prototype.componentWillUnmount = function () {
	        // Kill our event loop
	        if (this.loopId) {
	            clearInterval(this.loopId);
	        }
	    };
	    NotifierComponent.prototype.requestNotificationPermission = function () {
	        var _this = this;
	        Notification.requestPermission().then(function (result) {
	            if (result == "granted") {
	                // mark notifications as enabled
	                _this.state.enabled = true;
	                _this.setState(_this.state);
	            }
	        });
	    };
	    NotifierComponent.prototype.recordSendingNotification = function () {
	        this.state.lastNotificationTime = moment().unix();
	        this.setState(this.state);
	    };
	    NotifierComponent.prototype.spawnNotification = function (body, onClick) {
	        var n = new Notification("Starter", { body: body });
	        // Automatically close the notification after 5 seconds.
	        n.onclick = onClick;
	        setTimeout(n.close.bind(n), 5000);
	    };
	    NotifierComponent.prototype.sendOutOfEventNotification = function () {
	        this.recordSendingNotification();
	        this.spawnNotification("No event info, not tracking time. :(", function (e) {
	            e.target.close();
	            window.location.href = "/cal/day";
	        });
	    };
	    NotifierComponent.prototype.timeSinceLastEventSec = function () {
	        var nowTimestamp = moment().unix() * 1000;
	        var minTimeSinceLastEvent = Number.MAX_VALUE;
	        this.props.events.forEach(function (event) {
	            if (nowTimestamp > event.startTime) {
	                var endTimestamp = event.startTime + event.durationSecs * 1000;
	                if (nowTimestamp < endTimestamp) {
	                    // We are currently in this event, use -1 as a sentinel value
	                    minTimeSinceLastEvent = -1;
	                }
	                else {
	                    minTimeSinceLastEvent = Math.min(minTimeSinceLastEvent, nowTimestamp - endTimestamp);
	                }
	            }
	        });
	        return minTimeSinceLastEvent / 1000;
	    };
	    NotifierComponent.prototype.beginLoop = function () {
	        var _this = this;
	        var loop = function () {
	            if (!_this.state.enabled) {
	                return;
	            }
	            // If it hasn't been more than FORCED_INTERVAL seconds, we aren't allowed to send
	            // another notification
	            if (moment().unix() - _this.state.lastNotificationTime < FORCED_INTERVAL) {
	                return;
	            }
	            var timeSinceLastEvent = _this.timeSinceLastEventSec();
	            if (timeSinceLastEvent < 0) {
	                // Currently in event still
	                return;
	            }
	            // Regardless of the loop freq, we want to make the notification progressively more
	            // likely to happen until we are in an event.
	            // We will target 100% notification probability after LAG_THRESHOLD seconds and linear
	            // probability back down.
	            if (Math.random() < timeSinceLastEvent / LAG_THRESHOLD) {
	                _this.sendOutOfEventNotification();
	            }
	            // TODO: Also notify if we don't have a task in progress?
	        };
	        this.loopId = setInterval(loop.bind(this), LOOP_FREQ * 1000);
	    };
	    NotifierComponent.prototype.render = function () {
	        return React.createElement("div", null);
	    };
	    return NotifierComponent;
	}(React.Component));
	exports.NotifierComponent = NotifierComponent;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map