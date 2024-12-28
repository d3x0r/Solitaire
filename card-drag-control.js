import {Events} from "/node_modules/sack.vfs/apps/events/events.mjs"

import { card_images, card_images_selected, card_stack_control} from "./card-stack-control.js";
const msg = window.msg;

export class card_drag_control extends Events {

	frame = document.createElement ("div" );
	canvas = document.createElement ("canvas" );
	ctx = this.canvas.getContext ("2d" );
	cardx = 0;
	cardy = 0;
	mx = 0;
	my = 0;
	ofsx = 0;
	ofsy = 0;
	touchx = 0;
	touchy = 0;
	//selx = 0;
	//sely = 0;
	card = null;
	cards = null;
	stack = null;
	stacks = [];
	touches = [];

	lastTick = 0;
	thisTick = 0;
	startOfs = 0;
	startDelay = 0.025;
	
	moving = [];
	turning = [];

	constructor( parent ) {
		super();
		this.frame.className = "card-drag-frame";
		this.canvas.className = "card-drag-control";
		parent.appendChild( this.frame );
		this.frame.appendChild( this.canvas );
		
		//this.canvas.width = 
		this.canvas.addEventListener( "touchstart", (evt)=>this.touch( "start", evt ) );
		this.canvas.addEventListener( "touchend", (evt)=>this.touch( "end", evt ) );
		this.canvas.addEventListener( "touchcancel", (evt)=>this.touch( "cancel", evt ) );
		this.canvas.addEventListener( "touchmove", (evt)=>this.touch( "move", evt ) );

		this.canvas.addEventListener( "mousedown", (evt)=>this.mouse( "down", evt ) );
		this.canvas.addEventListener( "mouseup", (evt)=>this.mouse( "up", evt ) );
		this.canvas.addEventListener( "mousemove", (evt)=>this.mouse( "move", evt ) );
		this.canvas.addEventListener( "mouseout", (evt)=>this.mouse( "out", evt ) );
		this.canvas.addEventListener( "mouseover", (evt)=>this.mouse( "over", evt ) );
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
			  const { width, height } = entry.contentRect;
			  //console.log('Size changed:', width, height);
			  if( !width || !height ) return;
				this.canvas.width = width;
				this.canvas.height = height;
				this.draw();
				//console.log( "at least one resize/", rect );	
			}
		  });
		  
		  resizeObserver.observe(this.canvas);

	}

	add( stack ) {
		this.stacks.push( stack );
		stack.stack.on( "deal", (from,to,card)=>{
			if( this.lastTick != this.thisTick ) {
				this.thisTick = this.lastTick;
				this.startOfs = 0;
			}
			to.control.updateCards();
			this.addMove( { x: this.canvas.width * from.control.x / 100
			                     + from.control.image_width * card.wasAt.x / 100
			              , y: this.canvas.height * from.control.y / 100
			                     + from.control.image_height * card.wasAt.y / 100
			              , stack: from
			} // from
			            , { x: this.canvas.width * to.control.x / 100
			                     + to.control.image_width * card.at.x / 100
			              , y: this.canvas.height * to.control.y / 100
			                     + to.control.image_height * card.at.y / 100
			              , stack: to
			              }
			            , this.startOfs + performance.now() / 1000
			            , this.startOfs + performance.now() / 1000 + 0.32, card );

			this.startOfs += this.startDelay;
		} );
		stack.stack.on( "play", (from,to,card)=>{
			if( this.lastTick != this.thisTick ) {
				this.thisTick = this.lastTick;
				this.startOfs = 0;
			}
			to.control.updateCards();
			this.addMove( { x: this.canvas.width * from.control.x / 100
			                     + from.control.image_width * card.wasAt.x / 100
			              , y: this.canvas.height * from.control.y / 100
			                     + from.control.image_height * card.wasAt.y / 100
			              , stack: from
			} // from
			            , { x: this.canvas.width * to.control.x / 100
			                     + to.control.image_width * card.at.x / 100
			              , y: this.canvas.height * to.control.y / 100
			                     + to.control.image_height * card.at.y / 100
			              , stack: to
			              }
						  , this.startOfs + performance.now()/1000, this.startOfs + performance.now()/1000 + 0.32, card );
			this.startOfs += this.startDelay;
		} );
		stack.stack.on( "move", (from,to,card,delay)=>{
			// card is already in new stack.
			// card.lastStack should be === from
			if( this.lastTick != this.thisTick ) {
				this.thisTick = this.lastTick;
				this.startOfs = 0;
			}
			to.control.updateCards();
			const turn = this.turning.find( (t)=>t.card === card );
			const extraDelay = turn?turn.end-performance.now()/1000+0.005:0;
			this.addMove( { x: this.canvas.width * from.control.x / 100
			                     + from.control.image_width * card.wasAt.x / 100
			              , y: this.canvas.height * from.control.y / 100
			                     + from.control.image_height * card.wasAt.y / 100
			              , stack: from
			} // from
			            , { x: this.canvas.width * to.control.x / 100
			                     + to.control.image_width * card.at.x / 100
			              , y: this.canvas.height * to.control.y / 100
			                     + to.control.image_height * card.at.y / 100
			              , stack: to
			              }
			            , this.startOfs + performance.now()/1000 + extraDelay, this.startOfs + performance.now()/1000 + extraDelay + (delay||0.32), card );
			this.startOfs += this.startDelay;
		} );
	}

	touch( type, e ) {
		switch( type ) {
			case "start":
			e.preventDefault();
			for( let touch of e.changedTouches ){
				const old = this.touches.find( (t)=> t.ID === touch.identifier );
				if( old ) {
					old.x = touch.clientX;
					old.y = touch.clientY;
					old.new = true;
				} else {
					this.touches.push( {ID:touch.identifier,
						x : touch.clientX,
						y : touch.clientY,
						new : true
					})
				}
			}
		case "move":{
			e.preventDefault();
			for( let touchChanged of e.changedTouches ) {
			  var touch = this.touches.find( (t)=> t.ID === touchChanged.identifier );
			  if( touch ) {
				touch.x = touchChanged.clientX;
				touch.y = touchChanged.clientY;
			  }
			}
		  }
		  break;
		  
		  case "end": {
			e.preventDefault();
			for( let touchChanged of e.changedTouches ){
			  var touchIndex = this.touches.findIndex( (t)=> t.ID === touchChanged.identifier );
			  if( touchIndex >= 0 )
			  this.touches.splice( touchIndex, 1 )
			}
		  }
		}
		this.touchUpdate();
	}

	addTurn( card, start, end ) {
		//end = end * 10;
		if( this.lastTick != this.thisTick ) {
			this.thisTick = this.lastTick;
			this.startOfs = 0;
		}

		this.turning.unshift( {card,start:this.startOfs + performance.now()/1000+start,end:this.startOfs + performance.now()/1000+end} );
		card.flags.bFloating = true;

		if( this.turning.length +this.moving.length === 1 )
			requestAnimationFrame( (a)=>this.animate(a) );
		this.startOfs += this.startDelay;
	}

	addMove( from, to, start, end, card ) {
		this.moving.unshift( {card,start, end, from,to} );
		//console.log( "Setting floating", card.name, end );
		card.flags.bFloating = true;  // table draw code shouldn't draw this until it gets to the target...
		if( this.turning.length +this.moving.length === 1 )
			requestAnimationFrame( (a)=>this.animate(a) );
	}

	touchUpdate() {
		msg.textContent = "touches: "+this.touches.length;
		if( this.touches.length == 1 ){
		  var t = this.touches[0];
		  if( t.new )
		  {
			this._b = this.b;
			this.b = 1;
			this.touchx = t.x;
			this.touchy = t.y;
			card_drag_control.mouse( this, t.x, t.y, this.b );
			//rotateStart.set( t.x, t.y );
			t.new = false;
		  }
		  else {
			this._b = this.b;
			this.b = 1;
			this.touchx = t.x;
			this.touchy = t.y;
			card_drag_control.mouse( this, t.x, t.y, this.b );
		  }
		}
		else if( !this.touches.length ) {
			this._b = this.b;
			this.b = 0;
			card_drag_control.mouse( this, this.touchx, this.touchy, this.b );

		}
		else console.log( "Too many touches?", this.touches.length );
	}
	  

	mouse( type, evt ) {
		let x = evt.clientX - this.canvas.offsetLeft;
		let y = evt.clientY - this.canvas.offsetTop;
		this._b = this.b;
		this.mx = x;
		this.my = y;
		if( type == "down" ) {
			this._b = 0;
			this.b = evt.buttons;
		}
		if( type == "up" ) {
			this._b = 1;
			this.b = evt.buttons;
		}
		card_drag_control.mouse( this, x, y, this.b );
	}

	static mouse( self, x, y, b ) {
		msg.textContent=( "Drag event:"+x+","+y+","+b+" " + self.ofsx+","+self.ofsy );
		if( !(self._b & 1) && (b & 1) ) {
			self.setDrag( x, y );
			console.log( "Start drag" );

		}
		if( !(self._b & 1) && (b & 1) ) {
			self.drag( x - self.stack.mx, y - self.stack.my );
			console.log( "Drag" );
		}
		if( (self._b & 1) && !(b & 1) ) {
			//self.stopDrag( x, y );
			let possibles = [];
			for( let stack of self.stacks ){
				if( x >= stack.left && x <= stack.left + stack.image_width ){
					if( y >= stack.top && y <= stack.top + stack.image_height ){
						if( card_stack_control.CanMoveCards( self.stack, stack ) ){
							self.stack.DoMoveCards( stack );
							possibles.length = 0;
							break;
						}
					}
				}
				if( card_stack_control.CanMoveCards( self.stack, stack ) ){
					possibles.push( {near:{x:stack.left+stack.image_width/2-x,y:stack.top+stack.image_height/2-y},stack} );
				}
			}
			if( possibles.length ) {
				let best = {near:{x:self.stack.left+self.stack.image_width/2-x,y:self.stack.top+self.stack.image_height/2-y},stack:self.stack};
				for( let possible of possibles ){
					let dx = possible.near.x;
					let dy = possible.near.y;
					let d = dx*dx+dy*dy;
					if( d < best.near.x*best.near.x+best.near.y*best.near.y )
						best = possible;
				}
				if( best.stack != self.stack )
					self.stack.DoMoveCards( best.stack );
			}
			for( let card of self.cards) {
				card.flags.bFloating = false;
				card.thisStack.control.draw();
			}
			self.cards = null;
			self.frame.classList.remove( "active" );
		}
		//self.cardx = x;
		//self.cardy = y;
		self.draw();
	}

	select( stack, cards, cx, cy, mx, my ) {
		this.cardx = cx;
		this.cardy = cy;
		this.mx = mx;
		this.my = my;
		this.ofsx = mx;
		this.ofsy = my;
		this.cards = cards;
		for( let card of this.cards) {
			card.flags.bFloating = true;
		}
		this.stack = stack;

		stack.draw();
		this.draw();
		this.frame.classList.add( "active" );
	}

	setDrag( x, y ) {
		this.ofsx = x;
		this.ofsy = y;
	}

	stopDrag( x, y ) {
	}

	drag(x,y) {
		//this.cardx += x;
		//this.cardy += y;
	}

	draw(noClear) {
		//this.SetStackCards();
		if( !noClear )
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		if( !this.cards ) return;
		this.ctx.fillStyle = "rgba( 0, 0, 0, 0.5 )";
		for( let card of this.cards ) {
			this.ctx.fillRect( card.at.x/100*this.stack.image_width+this.cardx + ( this.mx - this.ofsx)
							, card.at.y/100*this.stack.image_height+this.cardy + ( this.my - this.ofsy)
							, this.stack.image_width, this.stack.image_width*1.5 );
		}

		let cx = this.cardx + (this.mx-this.ofsx);
		let cy = this.cardy + (this.my-this.ofsy);
		const cimg = card_images_selected;
		for( let c = this.cards.length-1; c >= 0 ; c-- ) {
			const card = this.cards[c];
			if( !card.flags.bFaceDown) {
				this.ctx.drawImage( cimg[card.id]
								, cx+this.stack.image_width*(card.at.x)/100
								, cy+this.stack.image_height*(card.at.y)/100
									//, cx, cy
									, this.stack.image_width, this.stack.image_width*1.5 );
			}else
				this.ctx.drawImage( cimg[52], card.at.x, card.at.y
									//, cx, cy
					            , this.stack.image_width, this.stack.image_width * 1.5  );


		}
	}

	animate(a) {
		const ms = a/1000;
		if( !this.lastTick ) this.lastTick = ms - 10;
		
		const del = ms - this.lastTick;


		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

		//console.log( "Tick?", a );
		for( let idx = 0;idx < this.turning.length; idx++ )  {
			const turn = this.turning[idx];
			const cimg = card_images;
			const w = (turn.card.thisStack.control.card_width);
			const h = (turn.card.thisStack.control.card_height);
			if( turn.end < ms ) {
				this.turning.splice( idx, 1 );
				//console.log( "turn expired... set card as down.", turn.card.name );
				turn.card.flags.bFloating = false;
				this.on( "flipped", turn.card );
				turn.card.thisStack.control.draw();
			} else if( turn.start < ms ){
				const cardDel = (ms - turn.start)/(turn.end-turn.start);
				if( cardDel > 0.5 ) {
					const show = Math.sin(Math.PI/2*(cardDel - 0.5)*2);
					//console.log( "Fliped, showing front now... ", show, cardDel, turn.card.flags.bFaceDown?52:turn.card.id )
					this.ctx.drawImage( cimg[turn.card.flags.bFaceDown?52:turn.card.id]
						, this.canvas.width * ( turn.card.thisStack.control.x  ) /100
						+ turn.card.thisStack.control.image_width * turn.card.at.x / 100
						, this.canvas.height * ( turn.card.thisStack.control.y )/100
						+ turn.card.thisStack.control.image_height * turn.card.at.y /100
								+ (h/2)*(1-show)
						, w
						, h*show );

				} else {
					const show = Math.sin(Math.PI/2*(cardDel)*2);
					//console.log( "Flip show: (showing back?)", show, cardDel, turn.card.flags.bFaceDown?turn.card.id:52 );
					this.ctx.drawImage( cimg[turn.card.flags.bFaceDown?turn.card.id:52]
						, this.canvas.width * ( turn.card.thisStack.control.x  ) /100
						+ turn.card.thisStack.control.image_width * turn.card.at.x / 100
						, this.canvas.height * ( turn.card.thisStack.control.y )/100
						+ turn.card.thisStack.control.image_height * turn.card.at.y /100
										+ (h/2)*(show)
								, w
								, h*(1-show) );

				}
			} else {
				this.ctx.drawImage( cimg[turn.card.flags.bFaceDown?52:turn.card.id]
					, this.canvas.width * ( turn.card.thisStack.control.x  ) /100
					+ turn.card.thisStack.control.image_width * turn.card.at.x / 100
					, this.canvas.height * ( turn.card.thisStack.control.y )/100
					+ turn.card.thisStack.control.image_height * turn.card.at.y /100
						
					, w
					, h );

			}
		}

		//console.log( "Frame tick:",ms );
		for( let idx = 0;idx < this.moving.length; idx++ )  {
			const move = this.moving[idx];
			const cimg = card_images;
			if( move.end < ms ) {
				this.moving.splice( idx, 1 );
				//console.log( "move expired... set card as down.", move.end, move.card.name );
				move.card.flags.bFloating = false;
				this.on( "land", move.card );
				move.to.stack.control.draw();
				//console.log( "last card pos was to:", move.card.id, move.card.at, move );
				idx--;
			} else if( move.start < ms ){
				const cardDel = (ms - move.start)/(move.end-move.start);
				//console.log( "Moving card:", cardDel, move.card.name );
				this.ctx.drawImage( cimg[move.card.flags.bFaceDown?52:move.card.id]
								, (1-cardDel)*move.from.x + (cardDel)*move.to.x
								,  (1-cardDel)*move.from.y + (cardDel)*move.to.y
								, (move.from.stack.control.card_width*(1-cardDel))+(cardDel*move.to.stack.control.card_width)
								, ((move.from.stack.control.card_height*(1-cardDel))+ ( cardDel*move.to.stack.control.card_height)) );

				
			} else {
				this.ctx.drawImage( cimg[move.card.flags.bFaceDown?52:move.card.id]
					,  ( move.from.x  )
					,  ( move.from.y ) 
					, move.from.stack.control.card_width
					, move.from.stack.control.card_height );

			}
		}

		this.draw(true);
		this.lastTick = ms;
		if( this.moving.length + this.turning.length ) {
			requestAnimationFrame( (a)=>this.animate(a) );
		} else {
			this.startOfs = 0;
		}
	}

}