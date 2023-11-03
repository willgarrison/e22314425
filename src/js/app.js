const app = {
	config: {
		debug: true,
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
		modal_controls_next: null,
	},
	templates: {
		list_item: null,
	},
	data: {
		songs: [
			{
				title: "Song 1",
				playlist: "Playlist 1",
				url: "http://www.example.com/audio1.mp3",
				lyrics: "Lyrics of Song 1",
				plays: 0,
			},
			{
				title: "Song 2",
				playlist: "Playlist 2",
				url: "http://www.example.com/audio2.mp3",
				lyrics: "Lyrics of Song 2",
				plays: 0,
			},
			{
				title: "Song 3",
				playlist: "Playlist 3",
				url: "http://www.example.com/audio3.mp3",
				lyrics: "Lyrics of Song 3",
				plays: 0,
			},
			{
				title: "Song 4",
				playlist: "Playlist 4",
				url: "http://www.example.com/audio4.mp3",
				lyrics: "Lyrics of Song 4",
				plays: 0,
			},
			{
				title: "Song 5",
				playlist: "Playlist 5",
				url: "http://www.example.com/audio5.mp3",
				lyrics: "Lyrics of Song 5",
				plays: 0,
			},
			{
				title: "Song 6",
				playlist: "Playlist 6",
				url: "http://www.example.com/audio6.mp3",
				lyrics: "Lyrics of Song 6",
				plays: 0,
			},
			{
				title: "Song 7",
				playlist: "Playlist 7",
				url: "http://www.example.com/audio7.mp3",
				lyrics: "Lyrics of Song 7",
				plays: 0,
			},
			{
				title: "Song 8",
				playlist: "Playlist 8",
				url: "http://www.example.com/audio8.mp3",
				lyrics: "Lyrics of Song 8",
				plays: 0,
			},
			{
				title: "Song 9",
				playlist: "Playlist 9",
				url: "http://www.example.com/audio9.mp3",
				lyrics: "Lyrics of Song 9",
				plays: 0,
			},
			{
				title: "Song 10",
				playlist: "Playlist 10",
				url: "http://www.example.com/audio10.mp3",
				lyrics: "Lyrics of Song 10",
				plays: 0,
			},
		],
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

	renderPlayerList: function (data) {
		app.log("renderPlayerList...");

		data.forEach(function (song, index) {
			// app.log(song, index);

			// clone the template
			let list_item = app.templates.list_item.cloneNode(true);
			list_item.removeAttribute("data-template-player-list-item");
			list_item.setAttribute("data-player-list-item", index);

			// set the song title
			let list_item_title = list_item.querySelector("[data-player-list-item-title]");
			list_item_title.textContent = song.title;

			// set the song duration
			let list_item_duration = list_item.querySelector("[data-player-list-item-duration]");
			list_item_duration.textContent = "00:00";

			// set the song number of plays
			let list_item_plays = list_item.querySelector("[data-player-list-item-plays]");
			list_item_plays.textContent = song.plays;

			// set the song playlist
			let list_item_playlist = list_item.querySelector("[data-player-list-item-playlist]");
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

  setupModal: function () {
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

	openModal: function (song) {
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
	},
};

document.addEventListener("DOMContentLoaded", function () {
	console.log("ready...");
	app.init();
});
