import { card_images_selected, card_stack_control} from "./card-stack-control.js";
const msg = window.msg;

export class card_drag_control {

	frame = document.createElement ("div" );
	canvas = document.createElement ("canvas" );
	ctx = this.canvas.getContext ("2d" );
	cardx = 0;
	cardy = 0;
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

	constructor( parent ) {
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
				//console.log( "at least one resize/", rect );	
			}
		  });
		  
		  resizeObserver.observe(this.canvas);

	}

	add( stack ) {
		this.stacks.push( stack );
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
			this.b = evt.buttons;
		}
		if( type == "up" ) {
			this.b = evt.buttons;
		}
		card_drag_control.mouse( this, x, y, this.b );
	}

	static mouse( self, x, y, b ) {
		//msg.textContent=( "Drag event:"+x+","+y+","+b );
		if( !(self._b & 1) && (b & 1) ) {
			self.setDrag( x, y );

		}
		if( !(self._b & 1) && (b & 1) ) {
			self.drag( x - self.mx, y - self.my );
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
			self.cards = null;
			self.frame.classList.remove( "active" );
		}
		self.cardx = x;
		self.cardy = y;
		self.draw();
	}

	select( stack, cards, cx, cy, mx, my ) {
		this.cardx = mx-cx;
		this.cardy = my-cy;
		this.ofsx = mx;
		this.ofsy = my;
		this.cards = cards;
		this.stack = stack;
		this.draw();
		this.frame.classList.add( "active" );
	}

	setDrag( x, y ) {
	}

	stopDrag( x, y ) {
	}

	drag(x,y) {
		this.cardx += x;
		this.cardy += y;
	}

	draw() {
		//this.SetStackCards();
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		if( !this.cards ) return;
		this.ctx.fillStyle = "rgba( 0, 0, 0, 0.5 )";
		this.ctx.fillRect( this.cardx-this.ofsx, this.cardy-this.ofsy, 100, 100 );
		let cx = this.cardx-this.ofsx;
		let cy = this.cardy-this.ofsy;
		let xs = 0;
		let ys = 0;
		if( this.stack.flags.bVertical )
		   ys = this.stack.step_y * this.stack.canvas.height / 100;
		if( this.stack.flags.bHorizontal )
		   xs = this.stack.step_x * this.stack.canvas.width / 100;
		const cimg = card_images_selected;
		for( let card of this.cards ) {
			if( !card.flags.bFaceDown) {
				this.ctx.drawImage( cimg[card.id], cx, cy, this.stack.image_width, this.stack.image_width*1.5 );
				cy += ys;
				cx += xs;
			}else
				this.ctx.drawImage( cimg[52], cx, cy, this.stack.image_width, this.stack.image_width * 1.5  );


		}
	}
}