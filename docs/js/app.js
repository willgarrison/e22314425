/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ (() => {

var app = {
  config: {
    debug: true
  },
  elems: {
    root: null,
    list: null,
    modal: null,
    modal_title: null,
    modal_close: null,
    modal_lyrics: null,
    modal_progress: null,
    modal_controls: null,
    modal_controls_previous: null,
    modal_controls_play: null,
    modal_controls_pause: null,
    modal_controls_next: null
  },
  templates: {
    list_item: null
  },
  data: {
    songs: [{
      title: "Song 1",
      playlist: "Playlist 1",
      url: "http://www.example.com/audio1.mp3",
      lyrics: "Lyrics of Song 1",
      plays: 0
    }, {
      title: "Song 2",
      playlist: "Playlist 2",
      url: "http://www.example.com/audio2.mp3",
      lyrics: "Lyrics of Song 2",
      plays: 0
    }, {
      title: "Song 3",
      playlist: "Playlist 3",
      url: "http://www.example.com/audio3.mp3",
      lyrics: "Lyrics of Song 3",
      plays: 0
    }, {
      title: "Song 4",
      playlist: "Playlist 4",
      url: "http://www.example.com/audio4.mp3",
      lyrics: "Lyrics of Song 4",
      plays: 0
    }, {
      title: "Song 5",
      playlist: "Playlist 5",
      url: "http://www.example.com/audio5.mp3",
      lyrics: "Lyrics of Song 5",
      plays: 0
    }, {
      title: "Song 6",
      playlist: "Playlist 6",
      url: "http://www.example.com/audio6.mp3",
      lyrics: "Lyrics of Song 6",
      plays: 0
    }, {
      title: "Song 7",
      playlist: "Playlist 7",
      url: "http://www.example.com/audio7.mp3",
      lyrics: "Lyrics of Song 7",
      plays: 0
    }, {
      title: "Song 8",
      playlist: "Playlist 8",
      url: "http://www.example.com/audio8.mp3",
      lyrics: "Lyrics of Song 8",
      plays: 0
    }, {
      title: "Song 9",
      playlist: "Playlist 9",
      url: "http://www.example.com/audio9.mp3",
      lyrics: "Lyrics of Song 9",
      plays: 0
    }, {
      title: "Song 10",
      playlist: "Playlist 10",
      url: "http://www.example.com/audio10.mp3",
      lyrics: "Lyrics of Song 10",
      plays: 0
    }]
  },
  log: function log() {
    if (app.config.debug) {
      for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
        msg[_key] = arguments[_key];
      }
      msg.forEach(function (m, index) {
        if (index > 0) {
          console.log("\t", m);
        } else {
          console.log(m);
        }
      });
    }
  },
  init: function init() {
    app.log("init...");
    app.elems.root = document.querySelector("[data-player]");
    app.elems.list = app.elems.root.querySelector("[data-player-list]");
    app.elems.modal = app.elems.root.querySelector("[data-player-modal]");
    app.elems.modal_title = app.elems.modal.querySelector("[data-player-modal-title]");
    app.elems.modal_close = app.elems.modal.querySelector("[data-player-modal-close]");
    app.elems.modal_lyrics = app.elems.modal.querySelector("[data-player-modal-lyrics]");
    app.elems.modal_progress = app.elems.modal.querySelector("[data-player-modal-progress]");
    app.elems.modal_controls = app.elems.modal.querySelector("[data-player-modal-controls]");
    app.elems.modal_controls_previous = app.elems.modal.querySelector("[data-player-modal-controls-previous]");
    app.elems.modal_controls_play = app.elems.modal.querySelector("[data-player-modal-controls-play]");
    app.elems.modal_controls_pause = app.elems.modal.querySelector("[data-player-modal-controls-pause]");
    app.elems.modal_controls_next = app.elems.modal.querySelector("[data-player-modal-controls-next]");
    app.templates.list_item = app.elems.list.querySelector("[data-template-player-list-item]");
    // remove the templkate from the dom
    app.templates.list_item.remove();

    // load data file
    // fetch('data/songs.json')
    //   .then(response => response.json())
    //   .then(data => app.render(data))
    //   .catch(error => console.error(error));

    app.setupModal();
    app.renderPlayerList(app.data.songs);
  },
  renderPlayerList: function renderPlayerList(data) {
    app.log("renderPlayerList...");
    data.forEach(function (song, index) {
      // app.log(song, index);

      // clone the template
      var list_item = app.templates.list_item.cloneNode(true);
      list_item.removeAttribute("data-template-player-list-item");
      list_item.setAttribute("data-player-list-item", index);

      // set the song title
      var list_item_title = list_item.querySelector("[data-player-list-item-title]");
      list_item_title.textContent = song.title;

      // set the song duration
      var list_item_duration = list_item.querySelector("[data-player-list-item-duration]");
      list_item_duration.textContent = "00:00";

      // set the song number of plays
      var list_item_plays = list_item.querySelector("[data-player-list-item-plays]");
      list_item_plays.textContent = song.plays;

      // set the song playlist
      var list_item_playlist = list_item.querySelector("[data-player-list-item-playlist]");
      list_item_playlist.textContent = song.playlist;

      // bind the click event
      list_item.addEventListener("click", function () {
        app.log("click...", song.title);
        app.openModal(song);
      });

      // add the player to the list
      app.elems.list.appendChild(list_item);
    });
  },
  setupModal: function setupModal() {
    // bind the close button 
    app.elems.modal_close.addEventListener("click", function () {
      app.elems.modal.setAttribute("hidden", true);
    });

    // bind the previous, next, play and pause buttons
    app.elems.modal_controls_previous.addEventListener("click", function () {
      app.log("previous...");
    });
    app.elems.modal_controls_next.addEventListener("click", function () {
      app.log("next...");
    });
    app.elems.modal_controls_play.addEventListener("click", function () {
      app.log("play...");
    });
    app.elems.modal_controls_pause.addEventListener("click", function () {
      app.log("pause...");
    });
  },
  openModal: function openModal(song) {
    // set the title
    app.elems.modal_title.textContent = song.title;

    // set the lyrics
    app.elems.modal_lyrics.textContent = song.lyrics;

    // set the progress
    app.elems.modal_progress.value = 0;

    // set the controls
    app.elems.modal_controls_play.classList.remove("hidden");
    app.elems.modal_controls_pause.classList.add("hidden");

    // show the modal
    app.elems.modal.removeAttribute("hidden");
  }
};
document.addEventListener("DOMContentLoaded", function () {
  console.log("ready...");
  app.init();
});

/***/ }),

/***/ "./src/css/app.css":
/*!*************************!*\
  !*** ./src/css/app.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunke22314425"] = self["webpackChunke22314425"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./src/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./src/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;