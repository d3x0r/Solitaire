import * as cards from "./cards.js"
const msg = window.msg;

import { card_drag_control } from "./card-drag-control.js";
import {JSOX} from "./node_modules/jsox/lib/jsox.mjs"
import {popups} from "/node_modules/@d3x0r/popups/popups.mjs"

let cardImages;
await fetch( "./images/cards/cardset2.jsox" ).then( async (response) => {return JSOX.parse( await response.text() ) } ).then( async (data) => {
	if( data === "import" ){
		data = (await import( "./images/cards/cardset2.jsox" )).default;
	}
	cardImages = data
} );

//import cardImages from "./images/cards/cardset2.jsox"


import {getImage} from "./node_modules/sack.vfs/apps/http-ws/imageLoader.js"
import {Fraction} from "./node_modules/sack.vfs/apps/fractions/fractions.mjs"
import {card_game} from "./card_game.js"
const card_images = await Promise.all( cardImages.map( async (card) => {return getImage( card)}))
function Color(r,g,b) { return [r,g,b] }
const converter = document.createElement("canvas");
const converterCtx = converter.getContext("2d", {willReadFrequently :true});
export const card_images_selected = card_images.map( (img)=>processImage( img,  Color( 255, 0, 0 )
																	, Color( 0, 128, 0 )
																	, Color( 64, 64, 192 ) )
)


function processImage( image, r,g,b ) {
	converter.width = image.width;
	converter.height = image.height;
	converterCtx.fillStyle = "transparent";
	converterCtx.fillStroke = "transparent";
	//converterCtx.clearRect( 0, 0, image.width, image.height );
	//var myImageData = converterCtx.getImageData(0, 0, image.width, image.height);
	converterCtx.drawImage(image, 0, 0);
	var myImageData = converterCtx.getImageData(0, 0, image.width, image.height);
	var outImageData = converterCtx.createImageData(image.width, image.height);
	var numBytes = myImageData.data.length;
	for( let n = 0; n < numBytes; n+=4 ) {
		outImageData.data[n+0] = (myImageData.data[n+0] * r[0]
				  + myImageData.data[n+1] * g[0]
				  + myImageData.data[n+2] * b[0])>>8
				;	
		outImageData.data[n+1] = ( myImageData.data[n+0] * r[1]
				  + myImageData.data[n+1] * g[1]
				  + myImageData.data[n+2] * b[1] ) >> 8;
				;	
		outImageData.data[n+2] = ( myImageData.data[n+0] * r[2]
				  + myImageData.data[n+1] * g[2]
				  + myImageData.data[n+2] * b[2] ) >> 8;
				;	
		outImageData.data[n+3] = myImageData.data[n+3];
		
	}
	converterCtx.putImageData(outImageData, 0, 0)
	var image = new Image();
	image.src = converter.toDataURL();
	return image;
}

// this is really more like "Solitaire game general stack control"

export class card_stack_control {
	#deck = null;
	#dragControl = null;

	flags = {
		bVertical : false,
		bReversed : false,
		bStacked : false,
		bNotStackedDown : false,

		bOnlyAceWhenEmpty : false,
		bOnlyKingWhenEmpty : false,
		bLastAce : false,
		bLastKing : false,
		bMustPlayWhenEmpty : false, // uses acitve.nMustPlay as first
		bOnlyPlusOne : false,
		bOnlyMinusOne : false,
		bOnlySame : false, // same number must be played
		bAlternateSuit : false,
		bSameSuit : false,
		bNoSelect : false, // no draw/move from.


		bSelectSameSuit : false,
		bSelectAltSuit : false,
		bSelectOnlyTop : false,
		bSelectAny : false, // any up to valid... if no restrict, up to all.
		bSelectPlusOne : false,
		bSelectMinusOne : false,

		bSelectAll : false,
		bCompareTopOnly : false,
		bDrawFrom : false,
		shuffleOnEmpty : false, // shuffle when empty and gather from discard

		bTurnTop : false, // click on pile turns over top card on stack, then plays it if possible.?
		bTurnToDiscard : false, // click on draw pile turns over top card on stack, then plays it on discard/table if possible.?
		bTurn3ToDiscard : false,
	};

	startup = {
		 nDrawAtStart : 0,
		 nDrawDownAtStart : 0,
		 nDrawAtDeal : 0,
	};

	active = {
		nMustPlay : 0, // specific card must be played here...
		nCardsSelected : 0, // number of cards selected from the top
	};

	allow_if_has_cards = []; // can play if any of these stacks have cards
	allow_move_to = []; // can move only to these stacks... defined on the source
	clone_count = 0; // number of times this was cloned
	//{
	 //  CTEXTSTR hand_stack,
	//},//PLIST,
	game = null;// new card_game() // game has the deck
	deck_stack = "Draw"; // default deck stack
	stack = null;


	step_x = 0;
	step_y = 0;
	fd_step_x = 0;
	fd_step_y = 0;
	scaled_step_x = 0;
	scaled_step_y = 0;
	scaled_fd_step_x = 0;
	scaled_fd_step_y = 0;
	//how many rows and cols can fit... 
	// step_x and step_y are the percentage of the control width/height that a card is offset.
	// 2,2 is 1A + step_x*A
	card_width = 1;
	card_height = 1;

	width = 0;
	height = 0;
	real_width = 0; // actual card_width - this is the width to output.
	real_height = 0;
	image_width = 0;  // for the mouse to compute
	image_height = 0;
	#max_id = 0;

	//let nCards, // array, may be by dimensional...
	//Image *card_image,
	//CDATA background,
	//CDATA empty_background,
	//psv_update_callback, // reference from registering an update callback for this control - important for edit which may change which part of the deck we watch....
	_b = 0; // last known button state on this control
	b = 0; // current button state on this control
	mx = 0; // mousex
	my = 0; // mousey
	top = 0;
	left = 0;
	tx = 0;
	ty = 0;
	touches = [];

	frame = document.createElement ("div" );
	canvas = document.createElement ("canvas" );
	ctx = this.canvas.getContext ("2d" );

	constructor( options ) {
		Object.assign( this.flags, options.flags );
		Object.assign( this.startup, options.startup );
		Object.assign( this.active, options.active );
		[ 'deck_stack','step_x','step_y','fd_step_x','fd_step_y'
		  , 'x','y'
		  , 'width','height'].forEach( (key) => {
			this[key] = options[key];	
		} );
		// at this point could pretend do to do some setup of the position?
		// this is setting information about the canavas (Surface/output image) and cards (images)
		this.SetStackCards();

		this.canvas.addEventListener( "touchstart", (evt)=>this.touch( "start", evt ) );
		this.canvas.addEventListener( "touchend", (evt)=>this.touch( "end", evt ) );
		this.canvas.addEventListener( "touchcancel", (evt)=>this.touch( "cancel", evt ) );
		this.canvas.addEventListener( "touchmove", (evt)=>this.touch( "move", evt ) );


		this.canvas.addEventListener( "mousedown", (evt)=>this.mouse( "down", evt ) );
		this.canvas.addEventListener( "mouseup", (evt)=>this.mouse( "up", evt ) );
		this.canvas.addEventListener( "mousemove", (evt)=>this.mouse( "move", evt ) );
		this.canvas.addEventListener( "mouseout", (evt)=>this.mouse( "out", evt ) );
		this.canvas.addEventListener( "mouseover", (evt)=>this.mouse( "over", evt ) );
		//this.canvas.addEventListener( "click", (evt)=>this.mouse( "click", evt ) );
		//this.canvas.addEventListener( "dblclick", (evt)=>this.mouse( "dblclick", evt ) );
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
			  const { width, height } = entry.contentRect;
			  //console.log('Size changed:', width, height);
			  if( !width || !height ) return;

				const realRect = entry.target.getBoundingClientRect();
				this.canvas.width = width;
				this.canvas.height = height;
				this.top = realRect.top;
				this.left = realRect.left;
				this.draw();
				//console.log( "at least one resize/", rect );	
			}
		  });
		  
		  resizeObserver.observe(this.canvas);

	}

	set dragControl( val ) {
		this.#dragControl = val;
		val.add(this);
	}

	set deck( val ) {
		if( this.stack ) {
			this.stack.removeUpdate( card_stack_control.update, this );
		}
		this.#deck = val;
		this.stack = val.getStack( this.deck_stack );
		this.stack.addUpdate( card_stack_control.update, this );
		const discard = this.#deck.getStack( "Discard" );
		if( this.deck_stack === "Draw" ) {
			this.stack.addOutOfCards( ()=>{
				val.deals++;
				if( this.flags.bTurn3ToDiscard ) {
					if( val.deals >= 3 ) {
						const n = popups.simpleNotice( "LOSE", "You have Lost, New Game?", ()=>{}, ()=>{}, {} );
						n.show();
						console.log( "LOSE!" );
					}
				} else if( this.flags.bTurnToDiscard ) {
					if( val.deals >= 1 ) {
						const n = popups.simpleNotice( "LOSE", "You have Lost, New Game?", ()=>{}, ()=>{}, {} );
						n.show();
						console.log( "LOSE!" );
					}
				}
				while( discard.cards ) {
					this.stack.add( discard.cards.grab().faceDown() );
				}
				if( this.flags.shuffleOnEmpty )
					this.#deck.shuffle();
				this.stack.update();
				discard.update();
			} );
		}
		this.#max_id = val.faces * val.suits;
	}

	touch( type, e ) {
		switch( type ) {
			case "start":
			e.preventDefault();
			for( let touch of e.changedTouches ){
				const old = this.touches.find( (t)=> t.ID === touch.identifier );
				if( old ) {
					old.x = touch.clientX - this.canvas.offsetLeft;
					old.y = touch.clientY - this.canvas.offsetTop;
					old.new = true;
				} else {
					this.touches.push( {ID:touch.identifier,
						x : touch.clientX - this.canvas.offsetLeft,
						y : touch.clientY - this.canvas.offsetTop,
						new : true
					})
				}
			}
			break;
		case "cancel":{
			console.log ( "Fell out?" );
			break;
		}
		case "move":{
			e.preventDefault();
			//console.log ( "Move touch..." + this.touches.length );
			for( let touchChanged of e.changedTouches ){
			  var touch = this.touches.find( (t)=> t.ID === touchChanged.identifier );
			  if( touch ) {
				touch.x = touchChanged.clientX- this.canvas.offsetLeft;
				touch.y = touchChanged.clientY- this.canvas.offsetTop;
			  }
			  //console.log( "Move touch...(oh can't see this" );
			}
		}
		  break;
		  
		  case "end": {
			e.preventDefault();
			for( let touchChanged of e.changedTouches ){
			  var touchIndex = this.touches.findIndex( (t)=> t.ID === touchChanged.identifier );
			  if( touchIndex >= 0 ){
				this.touchx = this.touches[touchIndex].x;
				this.touchy = this.touches[touchIndex].y;
			  	this.touches.splice( touchIndex, 1 )
				}
				//else console.log( "A touch ended that never started?" );
			}
			if( this.active.nCardsSelected ) {	
				card_drag_control.mouse( this.#dragControl, this.touchx + this.canvas.offsetLeft, this.touchy + this.canvas.offsetTop, 0 );
				this.#dragControl._b = 0;

			}
		  }
		  break;
		}
		this.touchUpdate();
	}

	touchUpdate() {
		if( this.touches.length == 1 ){
		  var t = this.touches[0];
		  //console.log ( "Touch at " + t.x + "," + t.y );
		  if( t.new )
		  {
			this._b = 0;//this.b;
			this.b = 1;
			this.touchx = t.x;
			this.touchy = t.y;
			card_stack_control.mouse( this, this.touchx, this.touchy, this.b );
			//rotateStart.set( t.x, t.y );
			t.new = false;
		  }
		  else {
			this._b = this.b;
			this.b = 1;
			this.touchx = t.x;
			this.touchy = t.y;
			card_stack_control.mouse( this, this.touchx, this.touchy, this.b );
			if( this.active.nCardsSelected ) {
				card_drag_control.mouse( this.#dragControl, this.touchx + this.canvas.offsetLeft, this.touchy + this.canvas.offsetTop, 1 );
				this.#dragControl._b = 1;
			}
		  }
		}
		else {
			this._b = this.b;
			this.b = 0;
			card_stack_control.mouse( this, this.touchx, this.touchy, this.b );
			if( this.active.nCardsSelected ) {	
				card_drag_control.mouse( this.#dragControl, this.touchx + this.canvas.offsetLeft, this.touchy + this.canvas.offsetTop, 0 );
				this.#dragControl._b = 0;
			}
		}
	}
	  


	mouse( type, evt ) {
		let x = evt.clientX - this.canvas.offsetLeft;
		let y = evt.clientY - this.canvas.offsetTop;
		this._b = this.b;
		this.mx = x;
		this.my = y;

		//if( type != "move" );
		//	console.log( "handle event:", type, x, y, evt.buttons );
		if( type == "down" ) {
			this._b = 0;
			this.b = evt.buttons;
			//console.log( "down", this.b );
		}
		if( type == "up" ) {
			this._b = 1;
			this.b = evt.buttons;
			//console.log( "up", this.b );
		}
		card_stack_control.mouse( this, x, y, this.b );
	}

	static update( stack )  {
		stack.draw();
	}

	draw() {
		this.SetStackCards();
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		//this.ctx.fillText( "Hello World", 10, 10 );
		const stack = this;
		let y = 0;
		let x = 0;
		let xs = 0;
		let ys = 0;
		let xs_fd = 0;
		let ys_fd = 0;
		if( this.flags.bVertical ) {
		   ys = this.step_y * this.canvas.height / 100;
		   ys_fd = this.fd_step_y * this.card_height / 100;
		}
		if( this.flags.bHorizontal ) {
		   xs = this.step_x * this.canvas.width / 100;
		   xs_fd = this.fd_step_x * this.card_width / 100;
		}
		const cards = this.stack.cards;
		const cstack = [];
		for( let card = cards; card; card = card.next ){
			if( !card.next ) {
				for( let c = card; c; c = (c.me.ref != this.stack)?c.me.ref:null  ) {
					cstack.push( c );
				}
				break;
			}
		}
		let nsel = cstack.length;
		for( let card of cstack ){
			nsel--;

			const cimg = ( this.active.nCardsSelected > nsel )?card_images_selected:card_images;

			if( card.flags.bFaceDown) {
				this.ctx.drawImage( cimg[card_images.length-1], x, y, this.canvas.width, this.canvas.width * 1.5  );
				y += ys_fd;
				x += xs_fd;
			} else {
				this.ctx.drawImage( cimg[card.id], x, y, this.canvas.width, this.canvas.width * 1.5 );
				y += ys;
				x += xs;
			}
			//console.log( "Simple draw stack:", this.deck_stack, card.name, card.flags.bFaceDown?"down":"up" );
		}


		//if( ( this.canvas.width != stack.image_width ) ||(  this.canvas.height != stack.image_height)  )

			// backgroundColor
		//ClearImageTo( surface, stack.background );
		{
			let card;
			let s_width;
			let s_height;
			if( !stack.flags.bStacked )
			{
				let count = 0;
				let row = 0;
				let col = 0;
				let step_width = (((stack.step_x<0)?-stack.step_x:stack.step_x) * stack.width ) / 100;
				let step_height = (((stack.step_y<0)?-stack.step_y:stack.step_y) * stack.height ) / 100;
				let fd_step_width = (((stack.step_x<0)?-stack.fd_step_x:stack.fd_step_x) * stack.width ) / 100;
				let fd_step_height = (((stack.step_y<0)?-stack.fd_step_y:stack.fd_step_y) * stack.height ) / 100;
				let scaled_step_width = (stack.scaled_step_x<0)?-stack.scaled_step_x:stack.scaled_step_x;
				let scaled_step_height = (stack.scaled_step_y<0)?-stack.scaled_step_y:stack.scaled_step_y;
				let x = (this.canvas.width) - stack.real_width;
				let y = (this.canvas.height) - stack.real_height;//surface.height - stack.height;
	
				let cardstack = this.stack;//stack.deck.getStack( stack.deck_stack );
				/* should count the cards so we can better position this... */
				for( card = cardstack.last_card; card; card = (card.me.field == "next" && card.me.ref ) )
				{
					const card_image = (stack.active.nCardsSelected?card_images_selected:card_images)[card.flags.bFaceDown?this.#max_id:card.id];
					if( card_image )
					{
						s_width = stack.width;
						if( s_width > card_image.width )
							s_width = card_image.width;
						s_height = stack.height;
						if( s_height > card_image.height )
							s_height = card_image.height;
						if( card.flags.bFaceDown )
						{
							if( !stack.flags.bNotStackedDown )
							{
								if( count )
									break;
							}
						}
						{
							if( !col && !row )
								this.ctx.drawImage( card_image
										, 0, 0, s_width, s_height
										, x + col * stack.scaled_step_x, y + row * stack.scaled_step_y, stack.real_width, stack.real_height
										);
								
							else if( col && !row )
							{
								this.ctx.drawImage( card_image
									, 0, 0, step_width, s_height
									, x + col * stack.scaled_step_x, y + row * stack.scaled_step_y, stack.scaled_step_width, stack.real_height
									);
							}
							else if( !col && row )
								this.ctx.drawImage( card_image
									, 0, 0, s_width, step_height
									, x + col * stack.scaled_step_x, y + row * stack.scaled_step_y, stack.real_width, stack.scaled_step_height
									);
							else if( col && row )
								this.ctx.drawImage( card_image
									, 0, 0, step_width, step_height
									, x + col * stack.scaled_step_x, y + row * stack.scaled_step_y, scaled_step_width, stack.scaled_step_height
									);
						}
					}
					if( stack.flags.bVertical )
					{
						row++;
						if( ( y + row * stack.scaled_step_x ) < 0 )
						{
							col++;
							row = 0;
						}
					}
					else
					{
						col++;
						if( ( x + col * stack.scaled_step_x ) < 0 )
						{
							row++;
							col = 0;
						}
					}
					count++;
				}
				//if( !count )
				//	ClearImageTo( surface, stack.empty_background );
			}
			else
			{
				let card = this.stack.cards//stack.deck.getStack( stack.deck_stack ).cards;
				if( card )
				{
					const card_image = (stack.active.nCardsSelected?card_images_selected:card_images)[card.flags.bFaceDown?this.#max_id:card.id];
					s_width = stack.width;
					if( card_image )
					{
						if( s_width > card_image.width )
							s_width = card_image.width;
						s_height = stack.height;
						if( s_height > card_image.height )
							s_height = card_image.height;
							this.ctx.drawImage( card_image
								, 0, 0, stack.width, stack.height
								, 0, 0, stack.width, stack.height
								);
					}
				}
			}
		}
		// and then I can draw like cards or something here?
		return 1;
	

	}

	append( parent ) {
		this.frame.className = "card-stack";
		this.canvas.className = "card-stack-canvas";
		parent.appendChild( this.canvas );

		this.canvas.style.position = "absolute";
		this.canvas.style.left = this.x+"vw";
		this.canvas.style.top = this.y+"vh";
		this.canvas.style.backgroundColor = "#003000";
		this.canvas.style.width = this.width+"vw";
		this.canvas.style.height = this.height+"vh";

		//this.canvas.style.border = "1px solid black";

		this.SetStackCards(); 
	}

	SetStackCards()
	{
		const rect = this.canvas.getBoundingClientRect();
		this.canvas.width = rect.width;
		this.canvas.height = rect.height;
		//this.SetStackCards(); 

		let card_w = card_images[0].width, card_h = card_images[0].height;
		let control_w = this.canvas.width, control_h = this.canvas.height;
		// selection of images needs to be added...
		const stack = this;
		
		stack.image_width = control_w;
		stack.image_height = control_h;
		stack.card_height = control_w * 1.5;

		stack.scaled_step_x = this.step_x * this.canvas.width/( this.card_width * this.step_x/100 ) / 100
		stack.scaled_step_y = this.step_y * this.canvas.height/( ( this.card_height * this.step_y/100 ) ) / 100
		stack.scaled_fd_step_x = this.card_width * this.fd_step_x/100
		stack.scaled_fd_step_y = this.card_height * this.fd_step_y/100 
	}


	TransferCards( stack_to, n ) {
		const stack_from = this;
	}

	DoMoveCards( stack_to )
	{
		const stack_from = this;
		if( stack_from.active.nCardsSelected )
		{
			if( card_stack_control.CanMoveCards( stack_from, stack_to ) )
			{
				// transfer does updates
				const toTransfer = stack_from.active.nCardsSelected;
				stack_from.active.nCardsSelected = 0;
				stack_from.game.selected_stack = null;

				stack_from.stack.transfer( stack_to.stack, toTransfer );
				return true;
			}
		}
		return false;
	}
	

	SelectCards( card_index_picked )
	{
		const stack = this;
		if( !stack.flags.bNoSelect )
		{
			if( stack.game.selected_stack )
			{
				stack.game.selected_stack.active.nCardsSelected = 0;
				if( stack.game.selected_stack != this )
					stack.game.selected_stack.draw();
			}
			stack.game.selected_stack = this;
			{
				const card_stack = stack.stack;
				if( !card_stack.cards ) {
					stack.active.nCardsSelected = 0;
					return;
				}
				let card = null;
				let _card;
				let reverse = [];
				let c;
				for( c = card_stack.cards; c.next && c; c = c.next );
				for( ; c!=card_stack && c; c = c.me.ref) {
					if( c.flags.bFaceDown ) continue;
					reverse.push( c );
				}
				card_index_picked = reverse.length - card_index_picked;
				let count = 0;
				let thinking = 1;
				// ignore count now... compute what we should select...
				do
				{
					if( count > card_index_picked )
					{
						thinking = 0;
						continue;
					}
					_card = card;
					card = card_stack.getNthCard( count++ );
					if( !card )
					{
						thinking = 0;
						count--;
						continue;
					}
					if( card.flags.bFaceDown )
					{
						//lprintf( "Cannot select face down cards (yet) " );
						count--;
						break;
					}
					if( stack.flags.bSelectOnlyTop )
					{
						thinking = 0;
						continue;
					}


					if( stack.flags.bSelectAltSuit )
					{
						if( _card )
						{
							if( (stack.#deck.CARD_SUIT(card.id)%2) != (1 - stack.#deck.CARD_SUIT(_card.id)%2) )
							{
								count--;
								break;
							}
						}
					}
					if( stack.flags.bSelectSameSuit )
					{
						if( _card )
						{
							if( stack.#deck.CARD_SUIT(card.id) != stack.#deck.CARD_SUIT(_card.id) )
							{
								count--;
								break;
							}
						}
					}
					if( stack.flags.bSelectPlusOne )
					{
						if( _card )
						{
							if( stack.#deck.CARD_NUMBER(card.id) != (1+stack.#deck.CARD_NUMBER(_card.id)) )
							{
								count--;
								break;
							}
						}
					}
					if( stack.flags.bSelectMinusOne )
					{
						if( _card )
						{
							if( (1+stack.#deck.CARD_NUMBER(card.id)) != (stack.#deck.CARD_NUMBER(_card.id)) )
							{
								count--;
								break;
							}
						}
					}

				}while( thinking );
				stack.active.nCardsSelected = count;

			}
			this.draw();
		}
	}


	static CanMoveCards( from, to )
	{
		if( from.game == to.game )
		{
			const from_stack = from.stack;
			const to_stack = to.stack;
			if( !from_stack.cards )
				return false;
			{
				// can't move directly to draw stack, or from table to draw stack?
				const draw =  from.#deck.getStack( "Draw" );
				const table = from.#deck.getStack( "Discard" );
				if( to_stack == draw )
					return false;
				if( to_stack == table && from_stack != draw )
					return false;
			}
			if( !from.active.nCardsSelected )
				return false; // can't move none selected
			{
				// compare stacks that this is allowed to move to
				let had_one = 0;
				let allow = 0;
				for( let stack of from.allow_move_to )
				{
					had_one = 1;
					if( stack.stack == to_stack )
					{
						allow = 1;
						break;
					}
				}
				if( had_one && !allow )
					return false;
			}
			{
				// compare stacks that must not be empty to move this...
				let had_one = 0;
				let allow = 0;
				for( let stack of from.allow_if_has_cards )
				{
					had_one = 1;
					if( ( test = stack.stack) && test.cards )
					{
						allow = 1;
						break;
					}
				}
				if( had_one && !allow )
					return false;
			}
			if( !to_stack.cards )
			{
				if( to.flags.bMustPlayWhenEmpty )
				{
					let test = from.flags.bCompareTopOnly
						?from_stack.cards
						:( from_stack.getNthCard( from.active.nCardsSelected-1 ) );
					if( ( test.id % from.#deck.faces ) != to.active.nMustPlay )
						return false;
				}
				if( to.flags.bOnlyAceWhenEmpty )
				{
					{
						let n;
						if( from.active.nCardsSelected > 1 ) {
							for( n = 0; n < from.active.nCardsSelected; n++ )
							{
								if( !( from_stack.getNthCard( n ).id % from.#deck.faces ) ) {
									if( !n ) { // first card is ace
										from.active.nCardsSelected = 1;
									}
								}
							}
							if( n == from.active.nCardsSelected ) // no ace in stack.
							return false;
						}
						for( n = 0; n < from.active.nCardsSelected; n++ )
						{
							if( !( from_stack.getNthCard( n ).id % from.#deck.faces ) )
							{
								break;
							}
						}
						if( n == from.active.nCardsSelected ) // no ace in stack.
							return false;
					}
				}
				if( to.flags.bOnlyKingWhenEmpty )
				{
					{
						//if( from.active.nCardsSelected > 1 )
						//	return false;
						//if( ( from_stack.cards.id % from.game.faces ) != (from.game.faces-1) )
						//	return false;
						let n;
						for( n = 0; n < from.active.nCardsSelected; n++ )
						{
							if( from_stack.getNthCard( n ).id % from.#deck.faces == (from.#deck.faces-1) )
							{
								break;
							}
						}
						if( n == from.active.nCardsSelected ) // no king in stack.
							return false;
					}
				}
			}
			if( to.flags.bSameSuit )
			{
				let test = from.flags.bCompareTopOnly
					?from_stack.cards
					:( from_stack.getNthCard( from.active.nCardsSelected-1 ) );
				if( to_stack.cards ) // is not empty
				{
					if( ( (to_stack.cards.id / from.#deck.faces)|0 ) != ((test.id / from.#deck.faces)|0) )
						return false;
				}
			}
			if( to.flags.bAlternateSuit ) // is not empty
			{
				let test = from.flags.bCompareTopOnly
					?from_stack.cards
					:( from_stack.getNthCard( from.active.nCardsSelected-1 ) );
				if( test && to_stack.cards )
				{
					if( (( ( to_stack.cards.id / from.#deck.faces ) %2)|0 )
						!= ( 1 - (( (test.id / from.#deck.faces ) % 2)|0)) )
						return false;
				}
			}
			if( to.flags.bOnlyPlusOne || to.flags.bOnlyMinusOne )
			{
				if( to_stack.cards ) // not empty
				{
					let failed = true;
					let test = from.flags.bCompareTopOnly
						?from_stack.cards
						:( from_stack.getNthCard( from.active.nCardsSelected-1 ) );
					if( test )
					{
						if( to.flags.bOnlyPlusOne )
						{
							if( to.flags.bLastKing )
								if( to.#deck.CARD_NUMBER( to_stack.cards.id ) == (from.#deck.faces-1) )
									return false;
							if( ( (to_stack.cards.id + 1) % from.#deck.faces ) ==
								( (test.id ) % from.#deck.faces ) )
								failed = false;
						}
						if( to.flags.bOnlyMinusOne )
						{
							if( to.flags.bLastAce )
								if( to.#deck.CARD_NUMBER( to_stack.cards.id ) == 0 )
									return false;
							if( ( (to_stack.cards.id) % from.#deck.faces ) ==
								( (test.id + 1 ) % from.#deck.faces ) )
								failed = false;
						}
					}
					if( failed )
						return false;
				}
			}
			return true;
		} else {
			console.log( "Can't move cards between different games" );
		}
		return false;
	}


	// select cards
	// turn top card

	static mouse(stack,x,y,b) {
		//MyValidatedControlData( struct card_stack_control *, stack, (PSI_CONTROL)pc );
		// what can I do with a mouse?
		// I can drraw on a frame... I don't need to be a control...
		if( !stack.game ) return;
		//console.log( "Static mouse event:", stack.stack.name, x, y, b );
		if( ( b & 1 ) && !( stack._b & 1 ) )
		{
			const card_stack = stack.stack;
			if( !card_stack.cards && card_stack.name === "Draw") {
				card_stack.out_of_cards();
				//stack._b = b;
				return 1;
			}
			
			if( card_stack.cards && card_stack.cards.flags.bFaceDown ) {
				if( stack.flags.bTurnTop )
					card_stack.turnTopCard();
				else if( stack.flags.bTurnToDiscard ) {
					if( stack.flags.bTurn3ToDiscard ) {
						for( let n = 0; n < 3; n++ ) {
							card_stack.turnTopCard();
							card_stack.transfer( stack.#deck.getStack("Discard"), 1 );
						}
					} else {
						card_stack.turnTopCard();
						card_stack.transfer( stack.#deck.getStack("Discard"), 1 );

					}
				}
			} else
			{
				let card_pos;
				let row = 0, col = 0;
				let cols = 7; // short-rows didn't work?
				const scaled_step_width = stack.step_x * stack.canvas.width / 100;
				const scaled_step_height = stack.step_y * stack.canvas.height / 100;
				const scaled_fd_step_width = stack.fd_step_x * stack.card_width / 100;
				const scaled_fd_step_height = stack.fd_step_y * stack.card_height / 100;
				let fd_skip_y = 0;
				let fd_skip_x = 0;

				
				let card = stack.stack.cards;
				let count = 0;
				for( ; card; card = card.next ){
					if( card.flags.bFaceDown ) {
						fd_skip_y += scaled_fd_step_height;
						fd_skip_x += scaled_fd_step_width;
					}
				}

				
				card = stack.stack.cards;
				count = 0;
				for( ; card; card = card.next ){
					if( card.flags.bFaceDown ) {
						continue; // can't select face down cards
					}
					count++;
					if( y < (count*scaled_step_height+fd_skip_y)) {
						break;
					}
				}
				if( y > ((count-1)*scaled_step_height+(stack.canvas.width * 1.5*0.5)+fd_skip_y)) {
					count = 1;
				}

				if( stack.game.selected_stack &&
					stack.game.selected_stack != stack )
				{
					if( !stack.game.selected_stack.DoMoveCards( stack ) )
						stack.SelectCards( count ); // pass the index of the card selected... may select up to this...
				}
				else
					stack.SelectCards( count );
			}
	
		}
		//console.log ( "static mouse event?" + stack.active.nCardsSelected );
		
		if( stack.#dragControl && stack.active.nCardsSelected ) {

			const stackRect = stack.canvas.getBoundingClientRect();
			let cx = stackRect.left;
			let cy = stackRect.top;
			const cards = stack.stack.cards;
			const cstack = [];
			for( let card = cards; card; card = card.next ){
				if( !card.next ) {
					for( let c = card; c; c = (c.me.ref != stack.stack)?c.me.ref:null  ) {
						if( !c.flags.bFaceDown ){
							cstack.push( c );
						}
					}
					break;
				}
			}
			let xs = 0;
			let ys = 0;
			if( stack.flags.bVertical )
			   ys = stack.step_y * stack.canvas.height / 100;
			if( stack.flags.bHorizontal )
			   xs = stack.step_x * stack.canvas.width / 100;
			   //console.log( "button states are: " + b + " " + stack._b + " " + stack.b );

			if( !(stack._b&1) && (stack.b&1) ) {
				//console.log ( "selected to drag layer at " + x + "," + y );
				stack.#dragControl.select( stack
							, cstack.slice( cstack.length-stack.active.nCardsSelected )
							, cx + cstack.length * stack.scaled_step_x, cy + cstack.length * stack.scaled_step_y, x - (cstack.length-stack.active.nCardsSelected) * xs, y - (cstack.length-stack.active.nCardsSelected) * ys );
			}
		}
		//stack._b = b;
		return 1;
	}
	
	
}

