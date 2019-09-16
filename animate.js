"use strict";



const Animate = {
	_TIME : 15,
	_timeout : null,
	_list : [],


	cancel : function() {
		if (Animate._timeout)
			clearTimeout(Animate._timeout);
		Animate._timeout = null;
		Animate._list.length = 0;
		flipping_deck = false;
	},


	anything : function(steps, things) {
		if (!Config.animation) return;

		let f = function(percent) {
			ctx2.clearRect(0,0,canvas.width,canvas.height);

			things.forEach(thing => {
				let [card, pileFrom,pileTo=pileFrom, scaleXFrom=1,scaleXTo=scaleXFrom, scaleYFrom=1,scaleYTo=scaleYFrom, alphaFrom=1,alphaTo=alphaFrom] = thing;

				const x = pileFrom._x*(1-percent) + pileTo._x*percent;
				const y = pileFrom._y*(1-percent) + pileTo._y*percent;
				const angle = pileFrom._rotate*(1-percent) + pileTo._rotate*percent;
				const scaleX = scaleXFrom*(1-percent) + scaleXTo*percent;
				const scaleY = scaleYFrom*(1-percent) + scaleYTo*percent;
				const alpha = alphaFrom*(1-percent) + alphaTo*percent;

				ctx2.save();
				ctx2.positionCard(x,y, angle, scaleX,scaleY);
				ctx2.globalAlpha = alpha;
				ctx2.paintCard(card);
				ctx2.restore();
			});
		}

		let step = 1;
		let ff = () => {
			let percent = Math.min( (100/steps)*step, 100 );
			f(percent/100);
			step++;
			if (step < steps)
				Animate._timeout = setTimeout(ff, Animate._TIME);
			else
				Animate._timeout = setTimeout(Animate.doit, Animate._TIME);
		}
		Animate._list.push(ff);
	},



	flip : function(card, pile, show=true) {
		show ? card.hide : card.show;

		Animate.anything(10, [[card, pile,pile, 1,0]]);
		Animate.func(() => card.flip);
		Animate.anything(10, [[card, pile,pile, 0,1]]);
	},
	move : function(card, pile_from, pile_to, put_below=false) {
		if (!Config.animation) return;

		if (put_below && pile_to.topCard)
			Animate.anything(20, [[card, pile_from,pile_to], [pile_to.topCard, pile_to]]);
		else
			Animate.anything(20, [[card, pile_from,pile_to]]);
	},
	destroy : function(card, pile, steps=20) {
		if (!Config.animation) return;

		Animate.anything(steps, [[card, pile,pile, 1,2, 1,2, 1,0]]);
	},

	func : function(f, last=false) {
		Animate._list.push(() => {
			f();
			if (!last) Animate.doit();
		});
	},

	doit : function() {
		Animate._timeout = null;
		repaint_all(false);
		if (Animate._list.length)
			Animate._list.shift()();
	},

};

