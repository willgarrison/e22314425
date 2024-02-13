const app = {
	config: {
		debug: false,
		auto_play: false,
		update_time_interval: 1000 / 60, // 60fps
		list_item_active_classes: ["bg-gray-100"],
		list_item_inactive_classes: ["bg-white"],
		always_force_create: true,
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
		modal_controls_next: null,
	},
	audio_player: null,
	templates: {
		list_item: null,
	},
	data: {
		songs: null,
	},
	state: {
		last_update_time: 0,
		frame_id: null,
		is_playing: false,
		current_song_index: 0,
	},

	log: function (...msg) {
		if (app.config.debug) {
			msg.forEach(function (m, index) {
				if (index > 0) {
					console.log("\t", m);
				} else {
					console.log(m);
				}
			});
		}
	},

	init: function () {
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

		app.templates.list_item = app.elems.list.querySelector("[data-player-list-item-template]");

		// remove the template from the dom
		app.templates.list_item.remove();

		// create the audio player
		app.audio_player = document.createElement("audio");

		// set endpoint
		let endpoint = "api/index.php?action=get_songs";
		if (app.config.always_force_create) {
			endpoint += "&force_create=1";
		}

		// load data file
		fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				app.log("data...", data);

				// set the songs
				app.data.songs = data.songs;

				// set current song index
				app.state.current_song_index = 0;

				// render the player list
				app.renderSongList(app.data.songs);

				// setup keyboard controls
				app.setupKeyboardControls();

				// setup the modal controls
				app.setupModalControls();

				// setup the progress indicator
				app.setupProgressIndicator();
			})
			.catch((error) => console.error(error));
	},

	renderSongList: function (songs) {
		app.log("renderSongList...");

		songs.forEach(function (song, index) {
			app.log("render: ", song.title, index);

			// clone the template
			let list_item = app.templates.list_item.cloneNode(true);
			list_item.removeAttribute("data-player-list-item-template");
			list_item.setAttribute("data-player-list-item", index);

			// set the song title
			let list_item_title = list_item.querySelector("[data-player-list-item-title]");
			list_item_title.textContent = song.title;

			// set the song duration
			let list_item_duration = list_item.querySelector("[data-player-list-item-duration]");
			list_item_duration.textContent = song.playtime_string;

			// set the song number of plays
			let list_item_plays = list_item.querySelector("[data-player-list-item-plays]");
			list_item_plays.textContent = song.plays;

			// set the song playlist
			let list_item_playlist = list_item.querySelector("[data-player-list-item-playlist]");
			list_item_playlist.textContent = song.playlist;

			// bind the click event
			list_item.addEventListener("click", function () {
				app.log("click...", song.title);
				app.load(song);

				// remove active class from all list items
				app.elems.list.querySelectorAll("[data-player-list-item]").forEach(function (item) {
					item.classList.remove(...app.config.list_item_active_classes);
					item.classList.add(...app.config.list_item_inactive_classes);
				});

				// add list_item_active_classes classes to the clicked list item
				list_item.classList.remove(...app.config.list_item_inactive_classes);
				list_item.classList.add(...app.config.list_item_active_classes);

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

	setupProgressIndicator: function () {
		app.log("setupProgressIndicator...");

		// bind the progress indicator
		app.elems.modal_progress_indicator.addEventListener("click", function (event) {
			app.log("click...", event);

			// get the progress
			let progress = event.offsetX / app.elems.modal_progress_indicator.offsetWidth;

			// set the progress
			app.elems.modal_progress.style.width = Math.ceil(progress * 100) + "%";

			// set the audio progress
			app.audio_player.currentTime = app.audio_player.duration * progress;
		});
	},

	setupKeyboardControls: function () {
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

	setupModalControls: function () {
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

	openModal: function () {
		app.log("openModal...");

		// set the progress
		app.elems.modal_progress.style.width = 0;

		// prevent body scrolling
		app.elems.body.style.overflow = "hidden";

		// show the modal
		app.elems.modal.removeAttribute("hidden");
	},

	closeModal: function () {
		// hide the modal
		app.elems.modal.setAttribute("hidden", true);

		// allow body scrolling
		app.elems.body.style.overflow = "auto";
	},

	load: function (song) {
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

	play: function () {
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

	pause: function () {
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

	rewind: function () {
		app.log("rewind...");
		app.audio_player.currentTime -= 10;
		app.update_progress();
	},

	fast_forward: function () {
		app.log("fast_forward...");
		app.audio_player.currentTime += 10;
		app.update_progress();
	},

	goToPrevious: function () {
		app.log("goToPrevious...");

		// get the previous song
		let previous_song = app.data.songs[app.state.current_song_index - 1];

		// if there is a previous song
		if (previous_song) {
			// load the previous song
			app.load(previous_song);

			// play the previous song
			app.play();
		}
	},

	goToNext: function () {
		app.log("goToNext...");

		// get the next song
		let next_song = app.data.songs[app.state.current_song_index + 1];

		// if there is a next song
		if (next_song) {
			// load the next song
			app.load(next_song);

			// play the next song
			app.play();
		}
	},

	update_progress: function (timestamp) {
		app.log("update_position...");

		// Check if enough time has passed; if not, request another frame
		if (timestamp - app.state.last_update_time > app.config.update_time_interval) {
			// get the current time
			let current_time = app.audio_player.currentTime;
			let duration = app.audio_player.duration;

			// set the progress
			app.elems.modal_progress.style.width = (current_time / duration) * 100 + "%";

			// Update the last update time
			app.state.last_update_time = timestamp;
		}

		// Request the next frame
		app.state.frame_id = requestAnimationFrame(app.update_progress);
	},

	// To start the update process
	start_update_timer: function () {
		// Make sure to not stack frame requests
		if (app.state.frame_id === null) {
			app.state.frame_id = requestAnimationFrame(app.update_progress);
		}
	},

	// To stop/cancel the update process
	stop_update_timer: function () {
		if (app.state.frame_id !== null) {
			cancelAnimationFrame(app.state.frame_id);
			app.state.frame_id = null; // Reset the frameId to allow restart
		}
	},
};

document.addEventListener("DOMContentLoaded", function () {
	console.log("ready...");
	app.init();
});
