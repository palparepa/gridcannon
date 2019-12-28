"use strict";

class Card {
	// suits
	static get Diamonds() { return ["♦",  "R",  0]; }
	static get Hearts()   { return ["♥",  "R",  1]; }
	static get Spades()   { return ["♠",  "B",  2]; }
	static get Clubs()    { return ["♣",  "B",  3]; }
	// "suits" for jokers
	static get Red()      { return [null, "R",  0]; }
	static get Black()    { return [null, "B",  1]; }
	static get Blue()     { return [null, null, 2]; }

	constructor(value,suit,color, sprite, shown=false) {
		this._value = value;
		this._suit = suit;
		this._color = color;
		this._sprite = sprite;
		this._shown = shown;
	}
	static newValueCard(value, [suit,color,Y], shown=false) {
		return new Card(value,suit,color,[value,Y], shown);
	}
	get value() {
		return this._value;
	}
	get suit() {
		return this._suit;
	}
	get color() {
		return this._color;
	}
	get shown() {
		return this._shown;
	}
	get show() {
		this._shown = true;
		return this;
	}
	get hide() {
		this._shown = false;
		return this;
	}
	get flip() {
		this._shown = !this._shown;
		return this;
	}

	static build_deck(config) {
		const deck = [];

		// value cards
		[Card.Diamonds, Card.Hearts, Card.Spades, Card.Clubs].forEach(suit => {
			for (let value = 1; value <= 13; value++) {
				if (value < 11 && value > config.max_value) continue;
				deck.push(Card.newValueCard(value, suit, true));
			}
		})

		// jokers
		for (let i=0; i<config.num_jokers; i++) {
			deck.push(Card.newValueCard(0, Card.Black, true));
			deck.push(Card.newValueCard(0, Card.Red,   true));
		}
		for (let i=0; i<config.free_joker; i++) {
			deck.push(Card.newValueCard(0, Card.Blue,  true));
		}

		return deck;
	}

	static get none() {
		return new Card(0,0,0, [0,3], true);
	}
}

Card.sprites = new Image();


Card.styles = [
	{
		src: "cards.png",
		link: "https://opengameart.org/content/boardgame-pack",
		width: 140,
		height: 190,
		backSprite: [16,2],
	},{
		src: "cards2.png",
		link: "https://opengameart.org/content/cards-set",
		width: 103,
		height: 138,
		backSprite: [14,0],
	},{
		src: "cards3.png",
		link: "https://opengameart.org/content/jumbo-index-playing-cards",
		width: 75,
		height: 113,
		backSprite: [14,0],
	},
];


Card._lastStyle = null;
Card.setStyle = function(n, recalc=true) {
	if (n === Card._lastStyle) return false;
	Card._lastStyle = n;

	const style = Card.styles[n];

	Card.WIDTH = style.width;
	Card.HEIGHT = style.height;
	Card.backSprite = style.backSprite;

	Card.sprites = new Image();
	if (recalc) {
		calc_sizes();
		Pile.setPositions();
		resize_canvas();
		window.onresize();
		Card.sprites.onload = () => repaint_all(true);
	}
	Card.sprites.src = style.src;
	return true;
}

Card.setStyle(0, false);



CanvasRenderingContext2D.prototype.paintCard = function(card, x=0,y=0) {
	if (!card) return; // FIXME: shouldn't happen, but happens when killing an armored royal
	const [sx,sy] = card._shown ? card._sprite : Card.backSprite;
	this.drawImage(Card.sprites, sx*Card.WIDTH,sy*Card.HEIGHT,Card.WIDTH,Card.HEIGHT, x-Card.WIDTH/2,y-Card.HEIGHT/2,Card.WIDTH,Card.HEIGHT);
}

CanvasRenderingContext2D.prototype.positionCard = function(x,y, rotation=0, scaleX=1,scaleY=scaleX) {
	const cos = Math.cos(rotation*Math.PI/2);
	const sin = Math.sin(rotation*Math.PI/2);
	this.setTransform(cos,sin,-sin,cos,x,y);
	this.scale(scaleX,scaleY);
}

