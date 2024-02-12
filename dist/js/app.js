/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ (() => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var app = {
  config: {
    debug: false,
    auto_play: false,
    update_time_interval: 1000 / 60,
    // 60fps
    list_item_active_classes: ["bg-gray-100"],
    list_item_inactive_classes: ["bg-white"],
    force_create: true
  },
  elems: {
    body: null,
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
  audio_player: null,
  templates: {
    list_item: null
  },
  data: {
    songs: null
  },
  state: {
    last_update_time: 0,
    frame_id: null,
    is_playing: false,
    current_song_index: 0
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
    app.elems.body = document.querySelector("body");
    app.elems.root = document.querySelector("[data-player]");
    app.elems.list = app.elems.root.querySelector("[data-player-list]");
    app.elems.modal = app.elems.root.querySelector("[data-player-modal]");
    app.elems.modal_title = app.elems.modal.querySelector("[data-player-modal-title]");
    app.elems.modal_close = app.elems.modal.querySelector("[data-player-modal-close]");
    app.elems.modal_lyrics = app.elems.modal.querySelector("[data-player-modal-lyrics]");
    app.elems.modal_progress_indicator = app.elems.modal.querySelector("[data-player-modal-progress-indicator]");
    app.elems.modal_progress = app.elems.modal.querySelector("[data-player-modal-progress]");
    app.elems.modal_controls = app.elems.modal.querySelector("[data-player-modal-controls]");
    app.elems.modal_controls_previous = app.elems.modal.querySelector("[data-player-modal-controls-previous]");
    app.elems.modal_controls_rewind = app.elems.modal.querySelector("[data-player-modal-controls-rewind]");
    app.elems.modal_controls_play = app.elems.modal.querySelector("[data-player-modal-controls-play]");
    app.elems.modal_controls_pause = app.elems.modal.querySelector("[data-player-modal-controls-pause]");
    app.elems.modal_controls_fast_forward = app.elems.modal.querySelector("[data-player-modal-controls-fast-forward]");
    app.elems.modal_controls_next = app.elems.modal.querySelector("[data-player-modal-controls-next]");
    app.templates.list_item = app.elems.list.querySelector("[data-template-player-list-item]");

    // remove the template from the dom
    app.templates.list_item.remove();

    // create the audio player
    app.audio_player = document.createElement("audio");

    // set endpoint
    var endpoint = "api/index.php?action=get_songs";
    if (app.config.force_create) {
      endpoint += "&force_create=1";
    }

    // load data file
    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      app.log("data...", data);

      // set the songs
      app.data.songs = data.songs;

      // set current song index
      app.state.current_song_index = 0;

      // render the player list
      app.renderPlayerList(app.data.songs);

      // setup keyboard controls
      app.setupKeyboardControls();

      // setup the modal controls
      app.setupModalControls();

      // setup the progress indicator
      app.setupProgressIndicator();
    })["catch"](function (error) {
      return console.error(error);
    });
  },
  renderPlayerList: function renderPlayerList(songs) {
    app.log("renderPlayerList...");
    songs.forEach(function (song, index) {
      app.log("render: ", song.title, index);

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
        var _list_item$classList, _list_item$classList2;
        app.log("click...", song.title);
        app.load(song);

        // remove active class from all list items
        app.elems.list.querySelectorAll("[data-player-list-item]").forEach(function (item) {
          var _item$classList, _item$classList2;
          (_item$classList = item.classList).remove.apply(_item$classList, _toConsumableArray(app.config.list_item_active_classes));
          (_item$classList2 = item.classList).add.apply(_item$classList2, _toConsumableArray(app.config.list_item_inactive_classes));
        });

        // add list_item_active_classes classes to the clicked list item
        (_list_item$classList = list_item.classList).remove.apply(_list_item$classList, _toConsumableArray(app.config.list_item_inactive_classes));
        (_list_item$classList2 = list_item.classList).add.apply(_list_item$classList2, _toConsumableArray(app.config.list_item_active_classes));
        app.openModal();
      });

      // add the player to the list
      app.elems.list.appendChild(list_item);

      // click the first song
      if (index === 0) {
        list_item.click();
      }
    });
  },
  setupProgressIndicator: function setupProgressIndicator() {
    app.log("setupProgressIndicator...");

    // bind the progress indicator
    app.elems.modal_progress_indicator.addEventListener("click", function (event) {
      app.log("click...", event);

      // get the progress
      var progress = event.offsetX / app.elems.modal_progress_indicator.offsetWidth;

      // set the progress
      app.elems.modal_progress.style.width = Math.ceil(progress * 100) + "%";

      // set the audio progress
      app.audio_player.currentTime = app.audio_player.duration * progress;
    });
  },
  setupKeyboardControls: function setupKeyboardControls() {
    // bind the keyboard controls
    document.addEventListener("keydown", function (event) {
      app.log("keydown...", event);

      // if the escape key is pressed
      if (event.key === "Escape") {
        app.closeModal();
      }

      // if the space key is pressed
      if (event.key === " ") {
        if (app.state.is_playing) {
          app.pause();
        } else {
          app.play();
        }
      }

      // if the left arrow key is pressed
      if (event.key === "ArrowLeft") {
        app.rewind();
      }

      // if the right arrow key is pressed
      if (event.key === "ArrowRight") {
        app.fast_forward();
      }
    });
  },
  setupModalControls: function setupModalControls() {
    // bind the close button
    app.elems.modal_close.addEventListener("click", function () {
      app.closeModal();
    });

    // bind the previous, next, play and pause buttons
    app.elems.modal_controls_previous.addEventListener("click", function () {
      app.goToPrevious();
    });
    app.elems.modal_controls_next.addEventListener("click", function () {
      app.goToNext();
    });
    app.elems.modal_controls_rewind.addEventListener("click", function () {
      app.rewind();
    });
    app.elems.modal_controls_fast_forward.addEventListener("click", function () {
      app.fast_forward();
    });
    app.elems.modal_controls_play.addEventListener("click", function () {
      app.play();
    });
    app.elems.modal_controls_pause.addEventListener("click", function () {
      app.pause();
    });
  },
  openModal: function openModal() {
    app.log("openModal...");

    // set the progress
    app.elems.modal_progress.style.width = 0;

    // prevent body scrolling
    app.elems.body.style.overflow = "hidden";

    // show the modal
    app.elems.modal.removeAttribute("hidden");
  },
  closeModal: function closeModal() {
    // hide the modal
    app.elems.modal.setAttribute("hidden", true);

    // allow body scrolling
    app.elems.body.style.overflow = "auto";
  },
  load: function load(song) {
    app.log("load...", song);

    // set the audio source
    app.audio_player.src = song.path;
    app.audio_player.load();

    // set current song index
    app.state.current_song_index = app.data.songs.indexOf(song);

    // set the title
    app.elems.modal_title.textContent = song.title;

    // set the lyrics
    app.elems.modal_lyrics.textContent = song.lyrics;

    // set the state
    app.state.is_playing = false;

    // set the progress
    app.elems.modal_progress.style.width = 0;

    // auto play the song
    if (app.config.auto_play) {
      app.play();
    }

    // listen for the end of the song
    app.audio_player.addEventListener("ended", function () {
      app.log("ended...");

      // set the controls
      app.elems.modal_controls_play.removeAttribute("hidden");
      app.elems.modal_controls_pause.setAttribute("hidden", true);

      // if there is another song
      if (app.state.current_song_index < app.data.songs.length - 1) {
        // load the next song
        app.load(app.data.songs[app.state.current_song_index + 1]);

        // play the next song
        app.play();
      } else {
        // reset the update timer
        app.stop_update_timer();

        // set the state
        app.state.is_playing = false;
      }
    });
  },
  play: function play() {
    app.log("play...");

    // reset the update timer
    app.stop_update_timer();

    // set the controls
    app.elems.modal_controls_play.setAttribute("hidden", true);
    app.elems.modal_controls_pause.removeAttribute("hidden");

    // play the audio
    app.audio_player.play();

    // set the state
    app.state.is_playing = true;

    // set the progress
    app.start_update_timer();
  },
  pause: function pause() {
    app.log("pause...");

    // reset the update timer
    app.stop_update_timer();

    // set the controls
    app.elems.modal_controls_play.removeAttribute("hidden");
    app.elems.modal_controls_pause.setAttribute("hidden", true);

    //
    app.audio_player.pause();

    // set the state
    app.state.is_playing = false;

    // set the progress
    app.update_progress();
  },
  rewind: function rewind() {
    app.log("rewind...");
    app.audio_player.currentTime -= 10;
    app.update_progress();
  },
  fast_forward: function fast_forward() {
    app.log("fast_forward...");
    app.audio_player.currentTime += 10;
    app.update_progress();
  },
  goToPrevious: function goToPrevious() {
    app.log("goToPrevious...");

    // get the previous song
    var previous_song = app.data.songs[app.state.current_song_index - 1];

    // if there is a previous song
    if (previous_song) {
      // load the previous song
      app.load(previous_song);

      // play the previous song
      app.play();
    }
  },
  goToNext: function goToNext() {
    app.log("goToNext...");

    // get the next song
    var next_song = app.data.songs[app.state.current_song_index + 1];

    // if there is a next song
    if (next_song) {
      // load the next song
      app.load(next_song);

      // play the next song
      app.play();
    }
  },
  update_progress: function update_progress(timestamp) {
    app.log("update_position...");

    // Check if enough time has passed; if not, request another frame
    if (timestamp - app.state.last_update_time > app.config.update_time_interval) {
      // get the current time
      var current_time = app.audio_player.currentTime;
      var duration = app.audio_player.duration;

      // set the progress
      app.elems.modal_progress.style.width = current_time / duration * 100 + "%";

      // Update the last update time
      app.state.last_update_time = timestamp;
    }

    // Request the next frame
    app.state.frame_id = requestAnimationFrame(app.update_progress);
  },
  // To start the update process
  start_update_timer: function start_update_timer() {
    // Make sure to not stack frame requests
    if (app.state.frame_id === null) {
      app.state.frame_id = requestAnimationFrame(app.update_progress);
    }
  },
  // To stop/cancel the update process
  stop_update_timer: function stop_update_timer() {
    if (app.state.frame_id !== null) {
      cancelAnimationFrame(app.state.frame_id);
      app.state.frame_id = null; // Reset the frameId to allow restart
    }
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