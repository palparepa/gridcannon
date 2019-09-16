"use strict";

const Config = {
	// display
	show_help:   true, // show help
	show_hover: false, // show info on grid and royals, when hovering
	show_light:  true, // highlights playable cards
	animation:   true, // show animations

	// appearance
	deck_style:     0,

	// automation
	auto_draw:  false, // automatically draw card from deck (if it's the only option and it has cards available)
	auto_build: false, // automatically perform forced building moves
	auto_space:  true, // if there is a single option available, tap 'space' to play it

	// rules
	max_value:     10, // use card numbers up to this value (8, 9 or 10)
	num_jokers:     1, // jokers of each color
	free_joker:     0, // blue jokers
	place_anygrid:  0, // on building phase, allow to place card in any empty grid pile
	skip_center:    1, // on building phase, do not fill the center
	place_anyenemy: 0, // allow placing royals on any enemy position
	deck_shuffle:   0, // shuffle cards when adding to deck? 0:no, 1:yes, 2:shuffle whole deck
	joker_once:     0, // when resetting a pile, a joker is removed (except when played over an ace, joker, or empty grid)
	ace_once:       0, // when resetting a pile, an ace is removed (except when played over an ace, joker, or empty grid)
	joker_color:    0, // jokers must be played, preferently, on pile of the same color
	ace_color:      0, // ace must be played, preferently, on pile of the same color. if 2, on pile of the same suit
	armor_pierce:   0, // when an enemy is attacked but not killed, if damage was enough to kill it without armor, remove last card armor (removes 'enemy too strong' lose condition)
};

const ConfigDefault = {};
for (let key in Config) ConfigDefault[key] = Config[key];




var Options = {
	isOpen: false, // if true, board can't be interacted with

	open: function() {
		Options.isOpen = true;
		document.getElementById("options").style.display = "";
		document.getElementById("option_btn").style.display = "none";

		for (let key in Config) {
			if (Config[key] === true || Config[key] === false)
				document.getElementById(key).checked = Config[key];
			else
				document.getElementById(key).value = Config[key];
		}
	},

	close: function(action=null) {
		if (action !== null) {
			for (let key in Config) {
				if (Config[key] === true || Config[key] === false)
					Config[key] = !!document.getElementById(key).checked;
				else
					Config[key] = +document.getElementById(key).value;
			}
		}

		document.getElementById("options").style.display = "none";
		document.getElementById("option_btn").style.display = "";

		Options.isOpen = false;

		resize_canvas();
		window.onresize();

		Card.setStyle(Config.deck_style);

		if (action === true)
			new_game();
		else
			repaint_all(true);
	},

	preset: function(diff) {
		for (let key in Config) {
			if (Config[key] === true || Config[key] === false) continue;

			let theSelect = document.getElementById(key);
			if (diff === 0)
				theSelect.value = theSelect.options[ 0 ].value;
			if (diff === 1)
				theSelect.value = ConfigDefault[key];
			if (diff === 2)
				theSelect.value = theSelect.options[ theSelect.options.length-1 ].value;
		}
	},

};

