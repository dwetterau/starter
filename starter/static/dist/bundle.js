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
	var jQuery = __webpack_require__(7);
	var app_1 = __webpack_require__(8);
	var AppRenderer = (function () {
	    function AppRenderer(props) {
	        ReactDOM.render(React.createElement(app_1.App, __assign({}, props)), document.getElementById("render-target"));
	    }
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
	exports.push([module.id, "body {\n    background: rgb(250, 250, 250);\n}\n\ndiv.card {\n    background: #fff;\n    border: 1px solid rgba(0, 0, 0, .04);\n    box-shadow: 0 1px 4px rgba(0, 0, 0, .03);\n    margin: 0 0 10px 0;\n    padding: 20px;\n    border-radius: 3px;\n    color: rgba(0, 0, 0, .84);\n    min-height: 20px;\n    -webkit-tap-highlight-color: transparent;\n    box-sizing: border-box;\n    display: block;\n}\n\n/* Header CSS */\ndiv.header-container {\n    display: flex;\n    justify-content: space-between;\n    flex-wrap: wrap;\n}\n\nh1.header-title {\n    margin: 0;\n}\n\ndiv.header-container div.view-mode-selector {\n    display: flex;\n    width: 100%;\n    margin: .5em 0;\n}\n\ndiv.header-container div.view-mode-selector div.view-mode-option {\n    margin-right: 1em;\n    cursor: pointer;\n}\n\ndiv.header-container div.view-mode-selector div.view-mode-option.-selected {\n    text-decoration: underline;\n}\n\n/* End of Header CSS */\n\n/* Task Board CSS */\ndiv.task-board {\n    width: 100%;\n}\n\ndiv.task-board div.task-board-options {\n    display: flex;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector {\n    display: flex;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector div.view-type-choice {\n    margin-right: .5em;\n    cursor: pointer;\n}\n\ndiv.task-board div.task-board-options div.view-type-selector div.view-type-choice.-selected {\n    text-decoration: underline;\n}\n\ndiv.task-board div.hide-closed-tasks {\n    margin-left: .5em;\n}\n\ndiv.task-board div.task-board-tag-selector-container {\n    display: flex;\n    margin-left: 1em;\n}\n\ndiv.task-board div.task-board-tag-selector-container div.tokenizer-container {\n    margin-left: .5em;\n}\n\ndiv.task-board div.full-column-container {\n    display: flex;\n    flex-direction: row;\n    height: 100%;\n    min-height: 768px;\n}\n\ndiv.task-board div.column-container {\n    display: flex;\n    flex-direction: column;\n    width: 25%;\n    margin: .5em 1em;\n}\n\ndiv.task-board div.column-container.drop-container {\n    background-color: rgba(0, 0, 0, .04);\n}\n\ndiv.task-board div.draggable-task.-hidden {\n    display: none;\n}\n\n/* End of Task Board CSS */\n\n/* Task view CSS */\n.task-id {\n    font-weight: bolder;\n    text-decoration: underline;\n}\n\n.task-title {\n    font-weight: bold;\n}\n\ndiv.task-tags-container {\n    display: flex;\n}\n\ndiv.task-tags-container div.task-tag {\n    margin-left: .25em;\n    padding: .1em .25em;\n}\n/* End of Task view CSS */\n\n/* Calendar CSS */\ndiv.calendar div.full-column-container {\n    display: flex;\n    flex-direction: column;\n}\n\ndiv.calendar div.column-header-container {\n    display: flex;\n}\n\ndiv.calendar div.column-header {\n    min-width: 120px;\n    width: 120px;\n    max-width: 120px;\n    height: 20px;\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.calendar div.all-columns-container {\n    display: flex;\n    max-height: 720px; /* 18 hours + 20 for header */\n    overflow-x: hidden;\n    overflow-y: scroll;\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.calendar div.column-container {\n    max-width: 120px;\n    width: 120px;\n    min-width: 120px;\n    position: relative;\n}\n\ndiv.calendar div.column-container td {\n    border-right: 1px solid rgba(0, 0, 0, .2);\n    border-bottom: 1px solid rgba(0, 0, 0, .2);\n    font-size: 14px;\n    min-width: 120px;\n    width: 100px;\n    max-width: 120px;\n    cursor: pointer;\n}\n\ndiv.calendar div.column-container tr:nth-child(odd) td {\n    border-bottom-style: dashed;\n}\n\ndiv.calendar div.column-container:first-child td {\n    border-left: 1px solid rgba(0, 0, 0, .2);\n    cursor: default; /* Prevents times from being click-able */\n}\n\ndiv.calendar div.column-container table tbody tr:first-child td {\n    border-top: 1px solid rgba(0, 0, 0, .2);\n}\n\ndiv.calendar div.rendered-event.card {\n    position: absolute;\n    padding: 1px;\n    margin-left: 1px;\n    overflow-y: scroll;\n    width: 119px;\n}\n\ndiv.calendar div.current-time-cursor {\n    position: absolute;\n    height: 3px;\n    background-color: #dc322f;\n    max-width: 120px;\n    width: 120px;\n    min-width: 120px;\n}\n\ndiv.calendar div.column-container tr td.-selected {\n    background-color: rgba(255, 255, 255, .84);\n    border: none;\n}\n\n/* End of Calendar CSS */\n\n/* Tag graph CSS */\n.tag-graph {\n    margin: 1em 0;\n}\n\n.tags-root-container, .tag-children-container {\n    border: 1px black solid;\n}\n\n.tag-children-container {\n    margin-left: .5em;\n}\n/* End of Tag graph CSS */\n\n/* Tokenizer CSS */\ndiv.tokenizer-container {\n    display: flex;\n}\n\ndiv.tokens-container {\n    display: flex;\n    margin-right: .5em;\n}\n\ndiv.rendered-token {\n    display: flex;\n    margin-left: .25em;\n    padding: .1em .25em;\n}\n\ndiv.rendered-token div.remove-token {\n    margin-left: .25em;\n    cursor: pointer;\n}\n/* End of Tokenizer CSS */", ""]);
	
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

	module.exports = jQuery;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var jQuery = __webpack_require__(7);
	var tag_graph_1 = __webpack_require__(9);
	var task_board_1 = __webpack_require__(13);
	var calendar_1 = __webpack_require__(18);
	(function (AppViewMode) {
	    AppViewMode[AppViewMode["taskView"] = 0] = "taskView";
	    AppViewMode[AppViewMode["eventView"] = 1] = "eventView";
	    AppViewMode[AppViewMode["tagView"] = 2] = "tagView";
	})(exports.AppViewMode || (exports.AppViewMode = {}));
	var AppViewMode = exports.AppViewMode;
	var App = (function (_super) {
	    __extends(App, _super);
	    function App(props) {
	        _super.call(this, props);
	        var newState = {
	            tasks: props.tasks,
	            events: props.events,
	            tags: props.tags,
	            tagsById: {},
	            viewMode: AppViewMode.taskView
	        };
	        App.updateTagsById(newState);
	        this.state = newState;
	    }
	    App.prototype.changeViewMode = function (newViewMode) {
	        this.state.viewMode = newViewMode;
	        this.setState(this.state);
	    };
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
	    App.prototype.renderAccountInfo = function () {
	        return React.createElement("div", {className: "profile-container"}, "Logged in as: " + this.props.meUser.username);
	    };
	    App.prototype.renderViewModeSelector = function () {
	        var _this = this;
	        var viewModeToName = {};
	        viewModeToName[AppViewMode.taskView] = "Task Board";
	        viewModeToName[AppViewMode.eventView] = "Calendar";
	        viewModeToName[AppViewMode.tagView] = "Tag Graph";
	        return React.createElement("div", {className: "view-mode-selector"}, Object.keys(AppViewMode).map(function (viewMode) {
	            if (!viewModeToName.hasOwnProperty(viewMode)) {
	                return;
	            }
	            var className = "view-mode-option";
	            if (+viewMode == _this.state.viewMode) {
	                className += " -selected";
	            }
	            return React.createElement("div", {key: viewMode, className: className, onClick: _this.changeViewMode.bind(_this, viewMode)}, viewModeToName[+viewMode]);
	        }));
	    };
	    App.prototype.renderHeader = function () {
	        return React.createElement("div", {className: "header-container"}, 
	            React.createElement("h1", {className: "header-title"}, "Starter"), 
	            this.renderAccountInfo(), 
	            this.renderViewModeSelector());
	    };
	    App.prototype.renderTaskBoard = function () {
	        return React.createElement(task_board_1.TaskBoardComponent, {meUser: this.props.meUser, tasks: this.state.tasks, tagsById: this.state.tagsById, createTask: this.createTask.bind(this), updateTask: this.updateTask.bind(this), deleteTask: this.deleteTask.bind(this)});
	    };
	    App.prototype.renderCalendar = function () {
	        return React.createElement(calendar_1.CalendarComponent, {meUser: this.props.meUser, events: this.state.events, tagsById: this.state.tagsById, createEvent: this.createEvent.bind(this), updateEvent: this.updateEvent.bind(this), deleteEvent: this.deleteEvent.bind(this)});
	    };
	    App.prototype.renderTagGraph = function () {
	        return React.createElement(tag_graph_1.TagGraphComponent, {meUser: this.props.meUser, tagsById: this.state.tagsById, createTag: this.createTag.bind(this), updateTag: this.updateTag.bind(this), deleteTag: this.deleteTag.bind(this)});
	    };
	    App.prototype.renderBoard = function () {
	        if (this.state.viewMode == AppViewMode.taskView) {
	            return React.createElement("div", {className: "board-container"}, this.renderTaskBoard());
	        }
	        else if (this.state.viewMode == AppViewMode.eventView) {
	            return React.createElement("div", {className: "calendar-container"}, this.renderCalendar());
	        }
	        else if (this.state.viewMode == AppViewMode.tagView) {
	            return React.createElement("div", {className: "board-container"}, this.renderTagGraph());
	        }
	    };
	    App.prototype.render = function () {
	        return React.createElement("div", null, 
	            this.renderHeader(), 
	            this.renderBoard());
	    };
	    return App;
	}(React.Component));
	exports.App = App;


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
	var edit_tag_1 = __webpack_require__(10);
	var create_tag_1 = __webpack_require__(12);
	var TagGraphComponent = (function (_super) {
	    __extends(TagGraphComponent, _super);
	    function TagGraphComponent(props) {
	        _super.call(this, props);
	        this.state = this.getState(props);
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
	            return (React.createElement("div", {className: "tag-children-container"}, tag.childTagIds.map(_this.renderTagById.bind(_this))));
	        };
	        return React.createElement("div", {className: "tag-container", key: tag.id, onDoubleClick: this.onDoubleClick.bind(this, tag)}, 
	            "Name: ", 
	            tag.name, 
	            renderChildren());
	    };
	    TagGraphComponent.prototype.renderFromRootTagId = function (rootTagId) {
	        return React.createElement("div", {className: "tags-root-container", key: rootTagId}, this.renderTagById(rootTagId));
	    };
	    TagGraphComponent.prototype.renderTags = function () {
	        return React.createElement("div", {className: "tags-container"}, this.state.rootTagIds.map(this.renderFromRootTagId.bind(this)));
	    };
	    TagGraphComponent.prototype.renderEditingTag = function () {
	        if (!this.state.editingTag) {
	            return;
	        }
	        return React.createElement(edit_tag_1.EditTagComponent, {tag: this.state.editingTag, tagsById: this.state.tagsById, updateTag: this.props.updateTag, deleteTag: this.props.deleteTag});
	    };
	    TagGraphComponent.prototype.renderCreateTag = function () {
	        return React.createElement(create_tag_1.CreateTagComponent, {meUser: this.props.meUser, createTag: this.props.createTag, tagsById: this.state.tagsById});
	    };
	    TagGraphComponent.prototype.render = function () {
	        return React.createElement("div", {className: "tag-graph"}, 
	            this.renderTags(), 
	            this.renderEditingTag(), 
	            this.renderCreateTag());
	    };
	    return TagGraphComponent;
	}(React.Component));
	exports.TagGraphComponent = TagGraphComponent;


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
	var tokenizer_1 = __webpack_require__(11);
	var EditTagComponent = (function (_super) {
	    __extends(EditTagComponent, _super);
	    function EditTagComponent(props) {
	        _super.call(this, props);
	        this.state = {
	            tag: props.tag,
	            tagsById: props.tagsById,
	        };
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
	            React.createElement("div", {className: "name-container"}, 
	                React.createElement("label", {htmlFor: "name"}, "Name: "), 
	                React.createElement("input", {type: "text", name: "name", value: this.state.tag.name, onChange: this.updateName.bind(this)})), 
	            React.createElement("div", {className: "children-container"}, 
	                React.createElement("label", {htmlFor: "children"}, "Children: "), 
	                React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.retrieveChildNames.bind(this), initialValues: this.getCurrentChildren(), possibleTokens: this.getAllTagNames()})), 
	            React.createElement("input", {type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete")}), 
	            React.createElement("input", {type: "button", value: "save", onClick: this.submitForm.bind(this, "save")}));
	    };
	    EditTagComponent.prototype.render = function () {
	        return React.createElement("div", {className: "edit-tag-container"}, 
	            React.createElement("h3", null, "Tag Edit Form:"), 
	            this.renderForm());
	    };
	    return EditTagComponent;
	}(React.Component));
	exports.EditTagComponent = EditTagComponent;


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
	var TokenizerComponent = (function (_super) {
	    __extends(TokenizerComponent, _super);
	    function TokenizerComponent(props) {
	        _super.call(this, props);
	        this.state = this.getState(props);
	    }
	    TokenizerComponent.prototype.componentWillReceiveProps = function (newProps) {
	        this.setState(this.getState(newProps));
	    };
	    TokenizerComponent.prototype.getState = function (props) {
	        var _this = this;
	        var newState = {
	            tokens: [],
	            pendingToken: '',
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
	        }
	        return newState;
	    };
	    TokenizerComponent.prototype.updatePendingToken = function (event) {
	        this.state.pendingToken = event.target.value;
	        this.setState(this.state);
	    };
	    TokenizerComponent.prototype.onKeyPress = function (event) {
	        var _this = this;
	        if (event.key == "Enter") {
	            if (this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit) {
	                // We are at the limit of the number of tokens, return early.
	                return;
	            }
	            var newToken_1 = this.state.pendingToken.trim();
	            var foundMatch_1 = false;
	            if (!this.props.possibleTokens) {
	                foundMatch_1 = true;
	                this.state.tokens.push({ label: newToken_1, value: newToken_1 });
	            }
	            else {
	                this.props.possibleTokens.forEach(function (possibleToken) {
	                    if (possibleToken.label.toLowerCase() == newToken_1.toLowerCase()) {
	                        foundMatch_1 = true;
	                        _this.state.tokens.push({
	                            label: possibleToken.label,
	                            value: possibleToken.value,
	                        });
	                    }
	                });
	            }
	            if (foundMatch_1) {
	                this.state.pendingToken = '';
	                this.setState(this.state);
	                this.props.onChange(this.state.tokens);
	            }
	            else {
	            }
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
	        return (React.createElement("div", {className: "card rendered-token", key: index}, 
	            token.label, 
	            React.createElement("div", {className: "remove-token", onClick: this.removeToken.bind(this, token)}, "x")));
	    };
	    TokenizerComponent.prototype.renderTokens = function () {
	        if (!this.state.tokens.length) {
	            return;
	        }
	        return (React.createElement("div", {className: "tokens-container"}, this.state.tokens.map(this.renderToken.bind(this))));
	    };
	    TokenizerComponent.prototype.renderPendingToken = function () {
	        // If we are at the maximum number of tokens, don't render the container
	        if (this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit) {
	            return;
	        }
	        return (React.createElement("div", {className: "pending-token-container"}, 
	            React.createElement("input", {type: "text", value: this.state.pendingToken, onChange: this.updatePendingToken.bind(this), onKeyPress: this.onKeyPress.bind(this)})
	        ));
	    };
	    TokenizerComponent.prototype.render = function () {
	        return (React.createElement("div", {className: "tokenizer-container"}, 
	            this.renderTokens(), 
	            this.renderPendingToken()));
	    };
	    return TokenizerComponent;
	}(React.Component));
	exports.TokenizerComponent = TokenizerComponent;


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
	var tokenizer_1 = __webpack_require__(11);
	var CreateTagComponent = (function (_super) {
	    __extends(CreateTagComponent, _super);
	    function CreateTagComponent(props) {
	        _super.call(this, props);
	        this.state = {
	            tag: {
	                id: 0,
	                name: '',
	                childTagIds: [],
	                ownerId: this.props.meUser.id,
	            },
	        };
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
	            React.createElement("div", {className: "name-container"}, 
	                React.createElement("label", {htmlFor: "name"}, "Name: "), 
	                React.createElement("input", {type: "text", name: "name", value: this.state.tag.name, onChange: this.updateName.bind(this)})), 
	            React.createElement("div", {className: "children-container"}, 
	                React.createElement("label", {htmlFor: "children"}, "Children: "), 
	                React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.retrieveChildNames.bind(this), initialValues: this.getCurrentChildren(), possibleTokens: this.getAllTagNames()})), 
	            React.createElement("input", {type: "button", value: "create", onClick: this.submitForm.bind(this)}));
	    };
	    CreateTagComponent.prototype.render = function () {
	        return React.createElement("div", {className: "create-tag-container"}, 
	            React.createElement("h3", null, "Create Tag Form:"), 
	            this.renderForm());
	    };
	    return CreateTagComponent;
	}(React.Component));
	exports.CreateTagComponent = CreateTagComponent;


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
	var jQuery = __webpack_require__(7);
	var edit_task_1 = __webpack_require__(14);
	var models_1 = __webpack_require__(15);
	var task_1 = __webpack_require__(16);
	var tokenizer_1 = __webpack_require__(11);
	(function (TaskBoardViewType) {
	    TaskBoardViewType[TaskBoardViewType["status"] = 0] = "status";
	    TaskBoardViewType[TaskBoardViewType["priority"] = 1] = "priority";
	})(exports.TaskBoardViewType || (exports.TaskBoardViewType = {}));
	var TaskBoardViewType = exports.TaskBoardViewType;
	var TaskBoardComponent = (function (_super) {
	    __extends(TaskBoardComponent, _super);
	    function TaskBoardComponent(props) {
	        _super.call(this, props);
	        this._dragTargetElement = null;
	        this.state = this.getState(props, TaskBoardViewType.status);
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
	            if (task.state == 1000 && (!_this.state || _this.state.shouldHideClosedTasks)) {
	                return true;
	            }
	            if (!_this.state) {
	                // Other checks can only return true if state is defined.
	                return false;
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
	            // No event was being dragged
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
	            // No event was being dragged
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
	        this.setState({
	            viewType: type,
	            headers: headers,
	            columnTypes: columnTypes,
	            columns: columns,
	            shouldHideClosedTasks: this.state.shouldHideClosedTasks
	        });
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
	    TaskBoardComponent.prototype.renderTypeChoice = function (type) {
	        var className = "view-type-choice";
	        if (type == this.state.viewType) {
	            className += " -selected";
	        }
	        var typeToName = {};
	        typeToName[TaskBoardViewType.priority] = "Priority";
	        typeToName[TaskBoardViewType.status] = "Status";
	        return (React.createElement("div", {className: className, key: type, onClick: this.changeViewType.bind(this, type)}, typeToName[type]));
	    };
	    TaskBoardComponent.prototype.renderTypeSelector = function () {
	        return (React.createElement("div", {className: "view-type-selector"}, 
	            this.renderTypeChoice(TaskBoardViewType.priority), 
	            this.renderTypeChoice(TaskBoardViewType.status)));
	    };
	    TaskBoardComponent.prototype.renderHideClosedTasks = function () {
	        return (React.createElement("div", {className: "hide-closed-tasks"}, 
	            React.createElement("label", {htmlFor: "hide-closed"}, "Hide closed?"), 
	            React.createElement("input", {id: "hide-closed", type: "checkbox", onChange: this.changeHideClosedTasks.bind(this), checked: this.state.shouldHideClosedTasks})));
	    };
	    TaskBoardComponent.prototype.renderOptions = function () {
	        return (React.createElement("div", {className: "task-board-options"}, 
	            this.renderTypeSelector(), 
	            this.renderHideClosedTasks(), 
	            this.renderTagSelector()));
	    };
	    TaskBoardComponent.prototype.renderTagSelector = function () {
	        return (React.createElement("div", {className: "task-board-tag-selector-container"}, 
	            React.createElement("div", {className: "tag-selector-label"}, "Filter Tag:"), 
	            React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.changeCurrentTagToken.bind(this), initialValues: this.getCurrentTagToken(), possibleTokens: this.getAllTagNames(), tokenLimit: 1})));
	    };
	    TaskBoardComponent.prototype.renderColumn = function (column, header, columnType) {
	        var _this = this;
	        return React.createElement("div", {className: "column-container", key: header, onDrop: this.onDrop.bind(this, columnType), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this)}, 
	            React.createElement("div", {className: "column-header"}, header), 
	            column.map(function (task) {
	                // TODO: determine draggability programatically
	                return React.createElement("div", {key: task.id, className: "draggable-task", draggable: true, onDragStart: _this.onDragStart.bind(_this, task), onDragEnd: _this.onDragEnd.bind(_this, task), onDoubleClick: _this.onDoubleClick.bind(_this, task)}, 
	                    React.createElement(task_1.TaskComponent, {task: task, viewType: _this.state.viewType, tagsById: _this.props.tagsById})
	                );
	            }));
	    };
	    TaskBoardComponent.prototype.renderColumns = function () {
	        var renderedColumns = [];
	        var i = 0;
	        for (; i < this.state.columns.length; i++) {
	            renderedColumns.push(this.renderColumn(this.state.columns[i], this.state.headers[i], this.state.columnTypes[i]));
	        }
	        return React.createElement("div", {className: "full-column-container"}, renderedColumns);
	    };
	    TaskBoardComponent.prototype.renderEditingTask = function () {
	        if (!this.state.editingTask) {
	            return;
	        }
	        return React.createElement(edit_task_1.EditTaskComponent, {meUser: this.props.meUser, task: this.state.editingTask, tagsById: this.props.tagsById, createMode: false, createTask: function (task) { }, updateTask: this.props.updateTask, deleteTask: this.props.deleteTask});
	    };
	    TaskBoardComponent.prototype.renderCreateTask = function () {
	        var initialTags = [];
	        if (this.state.selectedTag) {
	            initialTags.push(this.state.selectedTag.id);
	        }
	        return React.createElement(edit_task_1.EditTaskComponent, {meUser: this.props.meUser, tagsById: this.props.tagsById, createMode: true, createTask: this.props.createTask, initialTags: initialTags, updateTask: function (task) { }, deleteTask: function (task) { }});
	    };
	    TaskBoardComponent.prototype.render = function () {
	        return React.createElement("div", {className: "task-board"}, 
	            this.renderOptions(), 
	            this.renderColumns(), 
	            this.renderEditingTask(), 
	            this.renderCreateTask());
	    };
	    return TaskBoardComponent;
	}(React.Component));
	exports.TaskBoardComponent = TaskBoardComponent;


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
	var tokenizer_1 = __webpack_require__(11);
	var EditTaskComponent = (function (_super) {
	    __extends(EditTaskComponent, _super);
	    function EditTaskComponent(props) {
	        _super.call(this, props);
	        if (props.createMode) {
	            this.state = {
	                task: this._getEmptyTask(props.meUser, props.initialTags)
	            };
	        }
	        else {
	            this.state = {
	                task: props.task,
	            };
	        }
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
	            return React.createElement("h3", null, "Create Task Form:");
	        }
	        else {
	            return React.createElement("h3", null, "Task Edit Form:");
	        }
	    };
	    EditTaskComponent.prototype.renderButtons = function () {
	        if (this.props.createMode) {
	            return (React.createElement("div", {className: "edit-task-button-container"}, 
	                React.createElement("input", {type: "button", value: "create", onClick: this.submitForm.bind(this, "create")})
	            ));
	        }
	        else {
	            return (React.createElement("div", {className: "edit-task-button-container"}, 
	                React.createElement("input", {type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete")}), 
	                React.createElement("input", {type: "button", value: "save", onClick: this.submitForm.bind(this, "save")})));
	        }
	    };
	    EditTaskComponent.prototype.renderForm = function () {
	        return React.createElement("div", null, 
	            React.createElement("div", {className: "title-container"}, 
	                React.createElement("label", {htmlFor: "title"}, "Title: "), 
	                React.createElement("input", {type: "text", name: "title", value: this.state.task.title, onChange: this.updateAttr.bind(this, "title")})), 
	            React.createElement("div", {className: "description-container"}, 
	                React.createElement("label", {htmlFor: "description"}, "Description: "), 
	                React.createElement("textarea", {type: "text", name: "description", value: this.state.task.description, onChange: this.updateAttr.bind(this, "description")})), 
	            React.createElement("div", {className: "priority-selector"}, 
	                React.createElement("label", {htmlFor: "priority"}, "Priority: "), 
	                React.createElement("select", {name: "priority", value: this.state.task.priority, onChange: this.updateAttr.bind(this, "priority")}, 
	                    React.createElement("option", {value: "0"}, "Unknown"), 
	                    React.createElement("option", {value: "100"}, "Lowest"), 
	                    React.createElement("option", {value: "200"}, "Low"), 
	                    React.createElement("option", {value: "300"}, "Normal"), 
	                    React.createElement("option", {value: "400"}, "High"), 
	                    React.createElement("option", {value: "500"}, "Highest"))), 
	            React.createElement("div", {className: "state-selector"}, 
	                React.createElement("label", {htmlFor: "state"}, "Status: "), 
	                React.createElement("select", {name: "state", value: this.state.task.state, onChange: this.updateAttr.bind(this, "state")}, 
	                    React.createElement("option", {value: "0"}, "Open"), 
	                    React.createElement("option", {value: "500"}, "In Progress"), 
	                    React.createElement("option", {value: "750"}, "Blocked"), 
	                    React.createElement("option", {value: "1000"}, "Closed"))), 
	            React.createElement("div", {className: "tag-tokenizer-container"}, 
	                React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.retrieveTagNames.bind(this), initialValues: this.getCurrentTags(), possibleTokens: this.getAllTagNames()})
	            ), 
	            this.renderButtons());
	    };
	    EditTaskComponent.prototype.render = function () {
	        return React.createElement("div", {className: "edit-task-container"}, 
	            this.renderFormTitle(), 
	            this.renderForm());
	    };
	    return EditTaskComponent;
	}(React.Component));
	exports.EditTaskComponent = EditTaskComponent;


/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var models_1 = __webpack_require__(15);
	var task_board_1 = __webpack_require__(13);
	var tag_1 = __webpack_require__(17);
	var TaskComponent = (function (_super) {
	    __extends(TaskComponent, _super);
	    function TaskComponent() {
	        _super.apply(this, arguments);
	    }
	    TaskComponent.prototype.renderTaskId = function () {
	        return (React.createElement("div", {className: "task-id"}, 
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
	        return (React.createElement("div", {className: "task-priority"}, 
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
	        return (React.createElement("div", {className: "task-state"}, 
	            "State: ", 
	            name));
	    };
	    TaskComponent.prototype.renderTag = function (tagId) {
	        var tag = this.props.tagsById[tagId];
	        return React.createElement(tag_1.TagComponent, {tag: tag, key: tagId});
	    };
	    TaskComponent.prototype.renderTags = function () {
	        if (!this.props.task.tagIds.length) {
	            return;
	        }
	        return (React.createElement("div", {className: "task-tags-container"}, 
	            "Tags:", 
	            this.props.task.tagIds.map(this.renderTag.bind(this))));
	    };
	    TaskComponent.prototype.render = function () {
	        return React.createElement("div", {className: "task card"}, 
	            this.renderTaskId(), 
	            React.createElement("div", {className: "task-title"}, this.props.task.title), 
	            React.createElement("div", {className: "task-description"}, this.props.task.description), 
	            this.renderPriority(), 
	            this.renderState(), 
	            this.renderTags());
	    };
	    return TaskComponent;
	}(React.Component));
	exports.TaskComponent = TaskComponent;


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
	var TagComponent = (function (_super) {
	    __extends(TagComponent, _super);
	    function TagComponent() {
	        _super.apply(this, arguments);
	    }
	    TagComponent.prototype.render = function () {
	        return (React.createElement("div", {className: "task-tag card"}, this.props.tag.name));
	    };
	    return TagComponent;
	}(React.Component));
	exports.TagComponent = TagComponent;


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
	var moment = __webpack_require__(19);
	var edit_event_1 = __webpack_require__(20);
	var tokenizer_1 = __webpack_require__(11);
	var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var CalendarComponent = (function (_super) {
	    __extends(CalendarComponent, _super);
	    function CalendarComponent(props) {
	        _super.call(this, props);
	        this.state = this.getState(props);
	    }
	    CalendarComponent.prototype.componentWillReceiveProps = function (props) {
	        this.setState(this.getState(props));
	    };
	    CalendarComponent.prototype.getState = function (props) {
	        var startDayMoment = moment().startOf("week").add(1, "days");
	        if (startDayMoment > moment()) {
	            // It must be Sunday, handle the edge case by subtracting off a week.
	            startDayMoment = startDayMoment.subtract(1, "week");
	        }
	        var startDayTimestamp = startDayMoment.unix() * 1000;
	        var columns = this.divideAndSort(startDayTimestamp, props.events);
	        var newState = {
	            startDayTimestamp: startDayTimestamp,
	            columns: columns,
	            editingEvent: null,
	            createEventTimestamp: null,
	            createEventDurationSecs: null,
	            selectedTag: null,
	            draggingStartTimestamp: null,
	            draggingEndTimestamp: null,
	        };
	        if (this.state) {
	            newState.startDayTimestamp = this.state.startDayTimestamp;
	            newState.editingEvent = this.state.editingEvent;
	            newState.createEventTimestamp = this.state.createEventTimestamp;
	            newState.createEventDurationSecs = this.state.createEventDurationSecs;
	            if (this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
	                newState.selectedTag = this.state.selectedTag;
	            }
	            newState.draggingStartTimestamp = this.state.draggingStartTimestamp;
	            newState.draggingEndTimestamp = this.state.draggingEndTimestamp;
	        }
	        return newState;
	    };
	    CalendarComponent.prototype.componentDidMount = function () {
	        var cursor = document.getElementsByClassName("current-time-cursor");
	        if (cursor.length) {
	            cursor[0].scrollIntoView();
	        }
	    };
	    CalendarComponent.prototype.divideAndSort = function (startTimestamp, events) {
	        var _this = this;
	        // Note that the columns will be ordered with the weekend at the end.
	        var columnList = [[], [], [], [], [], [], []];
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
	        var shouldHide = function (event, day) {
	            if (day < 0 || day >= 7) {
	                return true;
	            }
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
	            var day = moment(event.startTime).diff(dayStart, "days");
	            if (shouldHide(event, day)) {
	                return;
	            }
	            columnList[day].push(event);
	        });
	        // TODO: Sort the events
	        return columnList;
	    };
	    CalendarComponent.prototype.resort = function () {
	        // Recompute all the events and where to render them:
	        this.state.columns = this.divideAndSort(this.state.startDayTimestamp, this.props.events);
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
	        DAYS.forEach(function (curDay, i) {
	            if (curDay != day) {
	                return;
	            }
	            offset += i * (60 * 60 * 24);
	        });
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
	        duration += 900; // dragging to the same cell means 15 minutes, so we always add 900 seconds
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
	        this.setState(this.state);
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
	        return (React.createElement("div", {className: "tag-selector-container"}, 
	            React.createElement("div", {className: "tag-selector-label"}, "Filter Tag:"), 
	            React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.changeCurrentTagToken.bind(this), initialValues: this.getCurrentTagToken(), possibleTokens: this.getAllTagNames(), tokenLimit: 1})));
	    };
	    CalendarComponent.prototype.renderOptions = function () {
	        return (React.createElement("div", {className: "options"}, this.renderTagSelector()));
	    };
	    CalendarComponent.prototype.renderCells = function (day) {
	        var _this = this;
	        var getColumnRow = function (index) {
	            var key = "" + index;
	            var style = { height: 20 };
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
	                if (timestamp >= start && timestamp < end + (900 * 1000)) {
	                    className = "-selected";
	                }
	            }
	            if (day == "times") {
	                var timeHeader = "";
	                if (index % 1800 == 0) {
	                    // Only print every 30 minutes
	                    timeHeader = moment(_this.state.startDayTimestamp)
	                        .add(index, "seconds").format("h:mm a");
	                }
	                return (React.createElement("tr", {key: key, style: style}, 
	                    React.createElement("td", null, timeHeader)
	                ));
	            }
	            else {
	                return (React.createElement("tr", {key: key, style: style}, 
	                    React.createElement("td", {className: className, onMouseDown: _this.cellMouseDown.bind(_this, day, index), onMouseOver: _this.cellMouseOver.bind(_this, day, index), onMouseUp: _this.cellMouseUp.bind(_this, day, index)}, " ")
	                ));
	            }
	        };
	        var i = 0; // midnight
	        var tableRows = [];
	        for (; i < 60 * 60 * 24; i += 60 * 15) {
	            tableRows.push(getColumnRow(i));
	        }
	        return (React.createElement("table", {cellPadding: "0", cellSpacing: "0"}, 
	            React.createElement("tbody", null, tableRows)
	        ));
	    };
	    CalendarComponent.prototype.renderCurrentTimeCursor = function (index) {
	        var columnTimeRange = 24 * 60 * 60 * 1000;
	        var columnStartTimestamp = this.state.startDayTimestamp + index * columnTimeRange;
	        var currentTime = moment().unix() * 1000;
	        if (currentTime >= columnStartTimestamp &&
	            currentTime < columnStartTimestamp + columnTimeRange) {
	            // Okay we can actually render it here.
	            var offset = (currentTime - columnStartTimestamp) / columnTimeRange;
	            offset *= 20 * 4 * 24; // Total height of a column
	            offset -= 2; // Draw it 2 pixels higher because it's width 3.
	            var style = {
	                "top": offset + "px",
	            };
	            return React.createElement("div", {className: "current-time-cursor", style: style});
	        }
	    };
	    CalendarComponent.prototype.renderColumn = function (columnIndex, column) {
	        var _this = this;
	        var day = DAYS[columnIndex];
	        return React.createElement("div", {key: day, className: "column-container"}, 
	            this.renderCells(day), 
	            this.renderCurrentTimeCursor(columnIndex), 
	            column.map(function (event) {
	                // TODO: Handle days that go off the end or wrap multiple days better
	                var dayOffset = event.startTime - (_this.state.startDayTimestamp + columnIndex * 24 * 60 * 60 * 1000);
	                dayOffset /= (900 * 1000 * (4 * 24));
	                dayOffset *= 20 * 4 * 24; // Total height of a column
	                var style = {
	                    "height": (event.durationSecs / 900) * 20 - 1,
	                    "maxHeight": (event.durationSecs / 900) * 20 - 1,
	                    "top": dayOffset + "px"
	                };
	                return React.createElement("div", {key: event.id, className: "rendered-event card", onDoubleClick: _this.onDoubleClick.bind(_this, event), style: style}, 
	                    React.createElement("div", {className: "event-id-container"}, 
	                        "E", 
	                        event.id), 
	                    event.name);
	            }));
	    };
	    CalendarComponent.prototype.renderColumns = function () {
	        var _this = this;
	        return React.createElement("div", {className: "full-column-container"}, 
	            React.createElement("div", {className: "column-header-container"}, 
	                React.createElement("div", {className: "column-header"}, "Time"), 
	                DAYS.map(function (day) {
	                    return React.createElement("div", {key: day, className: "column-header"}, day);
	                })), 
	            React.createElement("div", {className: "all-columns-container"}, 
	                React.createElement("div", {className: "column-container -times"}, this.renderCells("times")), 
	                [0, 1, 2, 3, 4, 5, 6].map(function (index, i) {
	                    return _this.renderColumn(index, _this.state.columns[i]);
	                })));
	    };
	    CalendarComponent.prototype.renderEditingEvent = function () {
	        if (!this.state.editingEvent) {
	            return;
	        }
	        return React.createElement(edit_event_1.EditEventComponent, {meUser: this.props.meUser, event: this.state.editingEvent, tagsById: this.props.tagsById, createMode: false, createEvent: function (event) { }, updateEvent: this.props.updateEvent, deleteEvent: this.props.deleteEvent});
	    };
	    CalendarComponent.prototype.renderCreateEvent = function () {
	        return React.createElement(edit_event_1.EditEventComponent, {meUser: this.props.meUser, tagsById: this.props.tagsById, createMode: true, initialCreationTime: this.state.createEventTimestamp, initialDurationSecs: this.state.createEventDurationSecs, createEvent: this.props.createEvent, updateEvent: function (event) { }, deleteEvent: function (event) { }});
	    };
	    CalendarComponent.prototype.render = function () {
	        return React.createElement("div", {className: "calendar"}, 
	            this.renderOptions(), 
	            this.renderColumns(), 
	            this.renderEditingEvent(), 
	            this.renderCreateEvent());
	    };
	    return CalendarComponent;
	}(React.Component));
	exports.CalendarComponent = CalendarComponent;


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(5);
	var tokenizer_1 = __webpack_require__(11);
	var EditEventComponent = (function (_super) {
	    __extends(EditEventComponent, _super);
	    function EditEventComponent(props) {
	        _super.call(this, props);
	        if (props.createMode) {
	            this.state = {
	                event: this._getEmptyEvent(props.meUser, props.initialCreationTime, props.initialDurationSecs, props.initialTags)
	            };
	        }
	        else {
	            this.state = {
	                event: props.event,
	            };
	        }
	    }
	    EditEventComponent.prototype.componentWillReceiveProps = function (newProps) {
	        if (newProps.createMode) {
	            this.setState({
	                event: this._getEmptyEvent(newProps.meUser, newProps.initialCreationTime, newProps.initialDurationSecs, newProps.initialTags),
	            });
	        }
	        else {
	            this.setState({
	                event: newProps.event,
	            });
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
	    EditEventComponent.prototype.renderFormTitle = function () {
	        if (this.props.createMode) {
	            return React.createElement("h3", null, "Create Event Form:");
	        }
	        else {
	            return React.createElement("h3", null, "Event Edit Form:");
	        }
	    };
	    EditEventComponent.prototype.renderButtons = function () {
	        if (this.props.createMode) {
	            return (React.createElement("div", {className: "edit-event-button-container"}, 
	                React.createElement("input", {type: "button", value: "create", onClick: this.submitForm.bind(this, "create")})
	            ));
	        }
	        else {
	            return (React.createElement("div", {className: "edit-event-button-container"}, 
	                React.createElement("input", {type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete")}), 
	                React.createElement("input", {type: "button", value: "save", onClick: this.submitForm.bind(this, "save")})));
	        }
	    };
	    EditEventComponent.prototype.renderForm = function () {
	        return React.createElement("div", null, 
	            React.createElement("div", {className: "title-container"}, 
	                React.createElement("label", {htmlFor: "name"}, "Name: "), 
	                React.createElement("input", {type: "text", name: "name", value: this.state.event.name, onChange: this.updateAttr.bind(this, "name")})), 
	            React.createElement("div", {className: "start-time-container"}, 
	                React.createElement("label", {htmlFor: "start-time"}, "Start time: "), 
	                React.createElement("input", {type: "number", name: "start-time", value: this.state.event.startTime, onChange: this.updateAttr.bind(this, "startTime")})), 
	            React.createElement("div", {className: "duration-secs-container"}, 
	                React.createElement("label", {htmlFor: "duration-secs"}, "Duration (s): "), 
	                React.createElement("input", {type: "number", name: "duration-secs", value: this.state.event.durationSecs, onChange: this.updateAttr.bind(this, "durationSecs")})), 
	            React.createElement("div", {className: "tag-tokenizer-container"}, 
	                React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.retrieveTagNames.bind(this), initialValues: this.getCurrentTags(), possibleTokens: this.getAllTagNames()})
	            ), 
	            this.renderButtons());
	    };
	    EditEventComponent.prototype.render = function () {
	        return React.createElement("div", {className: "edit-event-container"}, 
	            this.renderFormTitle(), 
	            this.renderForm());
	    };
	    return EditEventComponent;
	}(React.Component));
	exports.EditEventComponent = EditEventComponent;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map