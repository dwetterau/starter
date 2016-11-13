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
	exports.push([module.id, "body {\n    background: rgb(250, 250, 250);\n}\n\ndiv.card {\n    background: #fff;\n    border: 1px solid rgba(0, 0, 0, .04);\n    box-shadow: 0 1px 4px rgba(0, 0, 0, .03);\n    margin: 0 0 10px 0;\n    padding: 20px;\n    border-radius: 3px;\n    color: rgba(0, 0, 0, .84);\n    min-height: 20px;\n    -webkit-tap-highlight-color: transparent;\n    box-sizing: border-box;\n    display: block;\n}\n\n/* Task Board CSS */\ndiv.task-board {\n    width: 100%;\n}\n\ndiv.full-column-container {\n    display: flex;\n    flex-direction: row;\n    height: 100%;\n    min-height: 768px;\n}\n\ndiv.column-container {\n    display: flex;\n    flex-direction: column;\n    width: 25%;\n    margin: .5em 1em;\n}\n\ndiv.column-container.drop-container {\n    background-color: rgba(0, 0, 0, .04);\n}\n\ndiv.draggable-task.-hidden {\n    display: none;\n}\n\n/* End of Task Board CSS */\n\n/* Task view CSS */\n.task-id {\n    font-weight: bolder;\n    text-decoration: underline;\n}\n\n.task-title {\n    font-weight: bold;\n}\n/* Task view CSS */", ""]);
	
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
	var create_task_1 = __webpack_require__(9);
	var task_board_1 = __webpack_require__(10);
	var App = (function (_super) {
	    __extends(App, _super);
	    function App(props) {
	        _super.call(this, props);
	        this.state = {
	            tasks: props.tasks
	        };
	    }
	    App.prototype.createTask = function (taskArgs) {
	        var _this = this;
	        jQuery.post('/api/1/task/create', taskArgs, function (newTaskJson) {
	            _this.state.tasks.push(JSON.parse(newTaskJson));
	            _this.setState(_this.state);
	        });
	    };
	    App.prototype.updateTask = function (task) {
	        var _this = this;
	        jQuery.post('/api/1/task/update', task, function (updatedTaskJson) {
	            var updatedTask = JSON.parse(updatedTaskJson);
	            var newTasks = _this.state.tasks.map(function (task) {
	                if (task.id == updatedTask.id) {
	                    return updatedTask;
	                }
	                else {
	                    return task;
	                }
	            });
	            _this.setState({ tasks: newTasks });
	        });
	    };
	    App.prototype.deleteTask = function (task) {
	        var _this = this;
	        jQuery.post('/api/1/task/delete', { id: task.id }, function (deletedTaskJson) {
	            var deletedTaskId = JSON.parse(deletedTaskJson).id;
	            var newTasks = _this.state.tasks.filter(function (task) {
	                return task.id != deletedTaskId;
	            });
	            _this.setState(({ tasks: newTasks }));
	        });
	    };
	    App.prototype.renderAccountInfo = function () {
	        return React.createElement("div", {className: "profile-container"}, "Logged in as: " + this.props.meUser.username);
	    };
	    App.prototype.renderHeader = function () {
	        return React.createElement("div", {className: "header-container"}, 
	            React.createElement("div", null, "Starter"), 
	            this.renderAccountInfo());
	    };
	    App.prototype.renderCreateTask = function () {
	        return React.createElement(create_task_1.CreateTaskComponent, {meUser: this.props.meUser, createTask: this.createTask.bind(this)});
	    };
	    App.prototype.renderTaskBoard = function () {
	        return React.createElement(task_board_1.TaskBoardComponent, {meUser: this.props.meUser, tasks: this.state.tasks, updateTask: this.updateTask.bind(this), deleteTask: this.deleteTask.bind(this)});
	    };
	    App.prototype.render = function () {
	        return React.createElement("div", null, 
	            this.renderHeader(), 
	            this.renderTaskBoard(), 
	            this.renderCreateTask());
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
	var jQuery = __webpack_require__(7);
	var CreateTaskComponent = (function (_super) {
	    __extends(CreateTaskComponent, _super);
	    function CreateTaskComponent() {
	        _super.apply(this, arguments);
	    }
	    CreateTaskComponent.prototype.submitForm = function (event) {
	        // Note: This is pretty hacky, but for now it beats copying all form state out of the dom
	        // with a lot of onChange handler stuff.
	        event.preventDefault();
	        var data = jQuery(event.target).serialize();
	        this.props.createTask(data);
	    };
	    CreateTaskComponent.prototype.renderForm = function () {
	        return React.createElement("form", {onSubmit: this.submitForm.bind(this)}, 
	            React.createElement("div", {className: "title-container"}, 
	                React.createElement("label", {htmlFor: "title"}, "Title: "), 
	                React.createElement("input", {type: "text", name: "title"})), 
	            React.createElement("div", {className: "description-container"}, 
	                React.createElement("label", {htmlFor: "description"}, "Description: "), 
	                React.createElement("textarea", {type: "text", name: "description"})), 
	            React.createElement("div", {className: "priority-selector"}, 
	                React.createElement("label", {htmlFor: "priority"}, "Priority: "), 
	                React.createElement("select", {name: "priority", defaultValue: "300"}, 
	                    React.createElement("option", {value: "0"}, "Unknown"), 
	                    React.createElement("option", {value: "100"}, "Lowest"), 
	                    React.createElement("option", {value: "200"}, "Low"), 
	                    React.createElement("option", {value: "300"}, "Normal"), 
	                    React.createElement("option", {value: "400"}, "High"), 
	                    React.createElement("option", {value: "500"}, "Highest"))), 
	            React.createElement("div", {className: "state-selector"}, 
	                React.createElement("label", {htmlFor: "state"}, "Status: "), 
	                React.createElement("select", {name: "state", defaultValue: "0"}, 
	                    React.createElement("option", {value: "0"}, "Open"), 
	                    React.createElement("option", {value: "500"}, "In Progress"), 
	                    React.createElement("option", {value: "750"}, "Blocked"), 
	                    React.createElement("option", {value: "1000"}, "Closed"))), 
	            React.createElement("input", {type: "hidden", name: "authorId", value: this.props.meUser.id}), 
	            React.createElement("input", {type: "hidden", name: "ownerId", value: this.props.meUser.id}), 
	            React.createElement("input", {type: "submit", value: "Create"}));
	    };
	    CreateTaskComponent.prototype.render = function () {
	        return React.createElement("div", null, this.renderForm());
	    };
	    return CreateTaskComponent;
	}(React.Component));
	exports.CreateTaskComponent = CreateTaskComponent;


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
	var jQuery = __webpack_require__(7);
	var edit_task_1 = __webpack_require__(11);
	var models_1 = __webpack_require__(13);
	var task_1 = __webpack_require__(14);
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
	        return {
	            viewType: viewType,
	            columns: columns,
	            headers: headers,
	            columnTypes: columnTypes,
	            draggingTask: null,
	            editingTask: null,
	            shouldHideClosedTasks: false,
	        };
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
	        var shouldHideTask = function (task) {
	            if (!_this.state) {
	                // This is the initial call where we are defining state...
	                return false;
	            }
	            return _this.state.shouldHideClosedTasks && task.state == 1000;
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
	    TaskBoardComponent.prototype.renderTypeChoice = function (type) {
	        var className = "view-type-choice";
	        if (type == this.state.viewType) {
	            className += " -selected";
	        }
	        return (React.createElement("div", {className: className, key: type, onClick: this.changeViewType.bind(this, type)}, TaskBoardViewType[type]));
	    };
	    TaskBoardComponent.prototype.renderTypeSelector = function () {
	        return (React.createElement("div", {className: "view-type-selector"}, 
	            this.renderTypeChoice(TaskBoardViewType.priority), 
	            this.renderTypeChoice(TaskBoardViewType.status)));
	    };
	    TaskBoardComponent.prototype.renderHideClosedTasks = function () {
	        return (React.createElement("div", {className: "hide-closed-tasks"}, 
	            "Hide closed?", 
	            React.createElement("input", {type: "checkbox", onChange: this.changeHideClosedTasks.bind(this), value: this.state.shouldHideClosedTasks.toString()})));
	    };
	    TaskBoardComponent.prototype.renderTypeBasedOptions = function () {
	        if (this.state.viewType == TaskBoardViewType.priority) {
	            return this.renderHideClosedTasks();
	        }
	    };
	    TaskBoardComponent.prototype.renderOptions = function () {
	        return (React.createElement("div", {className: "task-board-options"}, 
	            this.renderTypeSelector(), 
	            this.renderTypeBasedOptions()));
	    };
	    TaskBoardComponent.prototype.renderColumn = function (column, header, columnType) {
	        var _this = this;
	        return React.createElement("div", {className: "column-container", key: header, onDrop: this.onDrop.bind(this, columnType), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this)}, 
	            React.createElement("div", {className: "column-header"}, header), 
	            column.map(function (task) {
	                // TODO: determine draggability programatically
	                return React.createElement("div", {key: task.id, className: "draggable-task", draggable: true, onDragStart: _this.onDragStart.bind(_this, task), onDragEnd: _this.onDragEnd.bind(_this, task), onDoubleClick: _this.onDoubleClick.bind(_this, task)}, 
	                    React.createElement(task_1.TaskComponent, {task: task, viewType: _this.state.viewType})
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
	        return React.createElement(edit_task_1.EditTaskComponent, {meUser: this.props.meUser, task: this.state.editingTask, updateTask: this.props.updateTask, deleteTask: this.props.deleteTask});
	    };
	    TaskBoardComponent.prototype.render = function () {
	        return React.createElement("div", {className: "task-board"}, 
	            this.renderOptions(), 
	            this.renderColumns(), 
	            this.renderEditingTask());
	    };
	    return TaskBoardComponent;
	}(React.Component));
	exports.TaskBoardComponent = TaskBoardComponent;


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
	var EditTaskComponent = (function (_super) {
	    __extends(EditTaskComponent, _super);
	    function EditTaskComponent(props) {
	        _super.call(this, props);
	        this.state = {
	            task: props.task
	        };
	    }
	    EditTaskComponent.prototype.componentWillReceiveProps = function (newProps) {
	        this.setState({ task: newProps.task });
	    };
	    EditTaskComponent.prototype.submitForm = function (eventType) {
	        if (eventType == "save") {
	            this.props.updateTask(this.state.task);
	        }
	        else {
	            this.props.deleteTask(this.state.task);
	        }
	    };
	    EditTaskComponent.prototype.updateAttr = function (attrName, event) {
	        this.state.task[attrName] = event.target.value;
	        this.setState(this.state);
	    };
	    EditTaskComponent.prototype.retrieveTags = function (tokens) {
	        // TODO: Take the tags and send them to the server on save.
	        // console.log("Got new token:", tokens)
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
	                React.createElement(tokenizer_1.TokenizerComponent, {onChange: this.retrieveTags.bind(this)})
	            ), 
	            React.createElement("input", {type: "hidden", name: "authorId", value: this.state.task.authorId}), 
	            React.createElement("input", {type: "hidden", name: "ownerId", value: this.state.task.ownerId}), 
	            React.createElement("input", {type: "button", value: "delete", onClick: this.submitForm.bind(this, "delete")}), 
	            React.createElement("input", {type: "button", value: "save", onClick: this.submitForm.bind(this, "save")}));
	    };
	    EditTaskComponent.prototype.render = function () {
	        return React.createElement("div", {className: "edit-task-container"}, 
	            React.createElement("h3", null, "Task Edit Form:"), 
	            this.renderForm());
	    };
	    return EditTaskComponent;
	}(React.Component));
	exports.EditTaskComponent = EditTaskComponent;


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
	        _super.call(this, props);
	        this.state = {
	            tokens: [],
	            pendingToken: '',
	        };
	    }
	    TokenizerComponent.prototype.updatePendingToken = function (event) {
	        this.state.pendingToken = event.target.value;
	        this.setState(this.state);
	    };
	    TokenizerComponent.prototype.onKeyPress = function (event) {
	        if (event.key == "Enter") {
	            // TODO: actually check with the possibleTokens
	            var newToken = this.state.pendingToken.trim();
	            this.state.tokens.push({ label: newToken, value: newToken });
	            this.state.pendingToken = '';
	            this.setState(this.state);
	            this.props.onChange(this.state.tokens);
	        }
	    };
	    TokenizerComponent.prototype.getTokenValues = function () {
	        // This function intended to be called via. ref to get the list of tokens.
	        // TODO: Decide if we want a call like this to attempt to tokenize whatever is left in
	        // pendingToken
	        return this.state.tokens;
	    };
	    TokenizerComponent.prototype.renderToken = function (token, index) {
	        return (React.createElement("div", {className: "rendered-token", key: index}, token.label));
	    };
	    TokenizerComponent.prototype.renderTokens = function () {
	        if (!this.state.tokens.length) {
	            return;
	        }
	        return (React.createElement("div", {className: "tokens-container"}, this.state.tokens.map(this.renderToken)));
	    };
	    TokenizerComponent.prototype.render = function () {
	        return (React.createElement("div", {className: "tokenizer-container"}, 
	            this.renderTokens(), 
	            React.createElement("div", {className: "pending-token-container"}, 
	                React.createElement("input", {type: "text", value: this.state.pendingToken, onChange: this.updatePendingToken.bind(this), onKeyPress: this.onKeyPress.bind(this)})
	            )));
	    };
	    return TokenizerComponent;
	}(React.Component));
	exports.TokenizerComponent = TokenizerComponent;


/***/ },
/* 13 */
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
	var Tag = (function () {
	    function Tag() {
	    }
	    return Tag;
	}());
	exports.Tag = Tag;
	var TagGroup = (function () {
	    function TagGroup() {
	    }
	    return TagGroup;
	}());
	exports.TagGroup = TagGroup;


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
	var models_1 = __webpack_require__(13);
	var task_board_1 = __webpack_require__(10);
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
	    TaskComponent.prototype.render = function () {
	        return React.createElement("div", {className: "task card"}, 
	            this.renderTaskId(), 
	            React.createElement("div", {className: "task-title"}, this.props.task.title), 
	            React.createElement("div", {className: "task-description"}, this.props.task.description), 
	            this.renderPriority(), 
	            this.renderState());
	    };
	    return TaskComponent;
	}(React.Component));
	exports.TaskComponent = TaskComponent;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map