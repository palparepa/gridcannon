"use strict";

// manages highlights and clickable piles

var Highlight = {
	// colors
	DRAWTO   : "blue",   // move from main deck
	EXTRA    : "blue",   // move royal from extra
	DRAW     : "yellow", // draw from main deck (clickable)
	TOEXTRAR : "yellow", // move royal from main deck to extra (clickable)
	TOEXTRA  : "yellow", // move card from main deck to extra (clickable)
	TOGRID   : "yellow", // move card from deck to play area (clickable)
	NENEMY   : "yellow", // flush extra into main deck (clickable)
	CLEAR    : "cyan",   // clear a grid (clickable)
	BUILD    : "white",  // send card to play area while building (clickable)
	NEWENEMY : "white",  // send royal to play area (clickable)
	SHAME    : "red",    // send to shame (clickable)
	ARMOR    : "red",    // send to armor (clickable)
	RANOUT   : "red",    // clear a grid after ran out of cards (clickable)

	// lists
	_list : new Map,
	clickables : new Set,

	// methods
	_timeout : null,
	_opacity : function(v=0,d) {
		if (v <= 20) d = 2;
		if (v >= 50) d =-2;
		v += d;
		canvas2.style.opacity = v/100;

		Highlight._timeout = setTimeout(() => Highlight._opacity(v,d), 50);
	},
	_stop : function() {
		if (Highlight._timeout) clearTimeout(Highlight._timeout);
		Highlight._timeout = null;

		ctx2.clearRect(0,0,canvas.width,canvas.height);
		canvas2.style.opacity = 1;
	},

	start : function() {
		Highlight._stop();

		if (Config.show_light && Highlight._list.size) {
			Highlight._list.forEach((color,pile) => pile.fillRect(color));
			Highlight._opacity();
		}
	},
	removeAll : function() {
		Highlight._stop();

		Highlight._list.clear();
		Highlight.clickables.clear();
	},
	add : function(pile,color,clickable=true) {
		pile = (typeof pile === "string") ? Pile.get(pile) : pile;
		Highlight._list.set(pile,color);
		if (clickable) Highlight.clickables.add(pile);
	},
};

