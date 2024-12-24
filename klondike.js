
import {clone,klondike_board,klondike3_board} from "./solitaire-rules.js";
import {card_drag_control} from "./card-drag-control.js"
import {card_stack_control} from "./card-stack-control.js"
import {popups} from "./node_modules/@d3x0r/popups/popups.mjs";

import {card_game} from "./card_game.js"
import {getStandardDeck} from "./cards.js";


export function setup( parent, options ) {
	options = options || { draw3 : false, fullAuto : true };
	const useBoard = clone( options.draw3 ? klondike3_board : klondike_board );
	let deck = getStandardDeck( useBoard.name = useBoard.name + options.fullAuto?"(auto)":"(manual)" );
	const stacks = [];
	const fill = parent.querySelector( "#klondike-game" );
	const dragControl = new card_drag_control( parent );
	// use useBoard.name 

	const foundations = [];
	const tableau = [];
	let discard = null;
	let drawPile = null;

	for( let stackName of Object.keys( useBoard ) ){
		if( stackName === "name" ) continue;
		const stack = useBoard[stackName];
		// this is magic.
		stack.deck = deck;
		stack.dragControl = dragControl;
		stack.append( fill );
		stacks.push( stack );
		if( stackName.startsWith( "discardPile" ) ) {
			discard = stack;
		}
		if( stackName.startsWith( "drawPile" ) ) {
			drawPile = stack;
		}
		if( stackName.startsWith( "acePile" ) ) {
			foundations.push( stack );
		}
		if( stackName.startsWith( "boardPile" ) ) {
			tableau.push( stack );
		}
	}
	card_game.makeGame( useBoard.name, deck );

	dragControl.on( "land", (card)=>{
		deck.autoPlay(card, true, false);
	} );
	dragControl.on( "flipped", (card)=>{
		deck.autoPlay(card, false, true);
	} );

	
	const newGame = () => {

		const game = card_game.getGame( useBoard.name );

		for( let stack of stacks ){
			stack.game = game;
		}
		deck.autoPlay = autoPlay;
		deck.gather();
		deck.shuffle();
		deck.deals = 0;
		let c = 0;
		let isDealing = true;
		let dealtTo = [];
		const draw = deck.getStack( "Draw" );
		while( isDealing ) {
			isDealing = false;
			for( let stack of stacks ){
				if( c < stack.startup.nDrawDownAtStart ) {
					//dragControl.addMove( {draw. {x:stack.x, y:stack.y} draw.top
					draw.dealTo( stack.stack );
					if( !dealtTo.includes( stack ) )
						dealtTo.push( stack );
					isDealing = true;
				}
				else if( (c-stack.startup.nDrawDownAtStart) < stack.startup.nDrawAtStart ) {
					draw.playTo( stack.stack );
					if( !dealtTo.includes( stack ) )
						dealtTo.push( stack );
					isDealing = true;
				}
			}
			c++;
		}
		dealtTo.forEach( stack => {stack.draw()})

	}

	deck.on("lose", ()=>{
		newGame();
	})

	popups.makeButton( fill, "New Game", newGame, {suffix:"new-game"} );
	
	function autoPlay( lastCard, wasFloat, wasFlip ) {
		if( lastCard.flags.bFaceDown ) return; 
		//console.log( "time to make a new move...", lastCard );

		if( wasFlip ) {
			if( lastCard.thisStack === drawPile.stack ) {
				console.log( "Card flipped, move to discard...");
				drawPile.stack.transfer( discard.stack, 1, 0.125 );
				return;
			}
		}

		if( lastCard.thisStack.name == "Discard" ) {

			if( lastCard.me.ref !== lastCard.thisStack ) {
				console.log( "Card played too soon....");
				return; // wait until the top card drops
			}
			//console.log( "Play to..." );
			lastCard.thisStack.control.SelectCards( 1, true );
			for( let f of foundations ) {
				
				if( card_stack_control.CanMoveCards( lastCard.thisStack.control, f ) ) {
					lastCard.thisStack.control.DoMoveCards( f );
					//console.log( "Played from discard to foundation...." );
					return;
				} 
			}
			for( let f of tableau ) {
				
				if( card_stack_control.CanMoveCards( lastCard.thisStack.control, f ) ) {
					lastCard.thisStack.control.DoMoveCards( f );
					//console.log( "Played from discard to tableau...." );
					return;
				} 
			}
		}


		if( lastCard.thisStack.name.startsWith("BoardPile") ) {
			//console.log( "BoardPile.... card landed" );
			if( lastCard.me.ref !== lastCard.thisStack ) return; // wait until the top card drops

			for( let s = 1; lastCard.thisStack.control.SelectCards( s, true ); s++ ) {
				if( s === 1 ) {
					for( let f of foundations ) {
						const cs = lastCard.thisStack;
						if( card_stack_control.CanMoveCards( cs.control, f ) ) {
							cs.control.DoMoveCards( f );
							if( cs.top ) {
								if( cs.top.flags.bFaceDown ) {
									dragControl.addTurn( cs.top, 0, 0.125 );
									cs.turnTopCard();
								}
								//console.log( "Turn top card(2)")
								card_stack_control.update( lastCard.thisStack.control );
							}	
							//console.log( "Played to foundation...." );
							return;
						} 
					}
		
				}
				if( !lastCard.next || lastCard.next.flags.bFaceDown ){
					for( let f of tableau ) {
						if( f === lastCard.thisStack ) continue;
						const cs = lastCard.thisStack;
						if( !f.stack.top ){
							const card = lastCard.thisStack.getNthCard( lastCard.thisStack.control.active.nCardsSelected -1 );
							if( !card || !card.next ) continue;
							
						}
						if( card_stack_control.CanMoveCards( cs.control, f ) ) {
							cs.control.DoMoveCards( f );
							if( cs.top ) {
								if( cs.top.flags.bFaceDown ) {
									dragControl.addTurn( cs.top, 0, 0.125 );
									cs.turnTopCard();
								}
								//console.log( "Turn top card(6)")
								card_stack_control.update( lastCard.thisStack.control );
							}	

							//console.log( "Played to foundation...." );
							return;
						} 
					}
				}
			}
		}

		if( lastCard.thisStack.name.startsWith("AcePile") ) {

			for( let t of tableau ) {
				t.SelectCards( 1, true );
				
				// while it is selected, maybe it was uncovered by this move, and can go somewhere else?
				for( let f of foundations ) {
				
					if( card_stack_control.CanMoveCards( t, f ) ) {
						t.DoMoveCards( f );
						if( t.stack.top ) {
							if( t.stack.top.flags.bFaceDown ) {
								t.stack.turnTopCard();
								dragControl.addTurn( t.stack.top, 0, 0.125 );
							}
							//console.log( "Turn top card(3)")
							card_stack_control.update( t );
						}	
						//console.log( "Played to foundation...." );
						return;
					} 
				}

			}
		}

		for( let t of tableau ) {
			if( t === lastCard.thisStack ) continue;
			let found = false;
			for( let s = 1; t.SelectCards( s, true ); s++ ) {
				if( t.stack.top.flags.bFloating ) break;
				if( s === 1 ) {
					// only move the last card from table to foundation
					for( let f of foundations ) {
						if( card_stack_control.CanMoveCards( t, f ) ) {
							lastCard.thisStack.control.DoMoveCards( f );
							if( t.stack.top ) {
								if( t.stack.top.flags.bFaceDown ) {
									dragControl.addTurn( t.stack.top, 0, 0.125 );
									t.stack.turnTopCard();
								}
								//console.log( "Turn top card(4)")
								card_stack_control.update( t );
							}	
							//console.log( "Played to foundation...." );
							return;
						} 
					}
				}
				const card = t.stack.getNthCard( t.active.nCardsSelected -1 );

				if( card && ( !card.next || card.next.flags.bFaceDown ) ){
					for( let f of tableau ) {
						if( f === t ) continue;
						if( card_stack_control.CanMoveCards( t, f ) ) {
							if( !card.next && !f.stack.top ) continue;
							t.DoMoveCards( f );
							if( t.stack.top ) {
								if( t.stack.top.flags.bFaceDown ) {
									dragControl.addTurn( t.stack.top, 0, 0.125 );
									t.stack.turnTopCard();
								}
								//console.log( "Turn top card(5)")
								card_stack_control.update( t );
							}	
							//console.log( "Played to tableau (from tableau)...." );
							found = true;
							break;
						} 
					}
				}
				if( found ) break;
			}
		}

		{
			const t = discard;
			if( t !== lastCard.thisStack ) {
				if( t.SelectCards( 1, true ) ) {
					if( !t.stack.top.flags.bFloating ) {
						{
							// only move the last card from table to foundation
							for( let f of foundations ) {
								if( card_stack_control.CanMoveCards( t, f ) ) {
									lastCard.thisStack.control.DoMoveCards( f );
									if( t.stack.top ) {
										if( t.stack.top.flags.bFaceDown ) {
											dragControl.addTurn( t.stack.top, 0, 0.125 );
											t.stack.turnTopCard();
										}
										card_stack_control.update( t );
									}	
									return;
								} 
							}
						}
						const card = t.stack.getNthCard( t.active.nCardsSelected -1 );

						if( card ){
							for( let f of tableau ) {
								if( f === t ) continue;
								if( card_stack_control.CanMoveCards( t, f ) ) {
									if( !card.next && !f.stack.top ) continue;
									t.DoMoveCards( f );
									if( t.stack.top ) {
										if( t.stack.top.flags.bFaceDown ) {
											dragControl.addTurn( t.stack.top, 0, 0.125 );
											t.stack.turnTopCard();
										}
										//console.log( "Turn top card(5)")
										card_stack_control.update( t );
									}	
									return;
								} 
							}
						}
					}
				} else {

				}

				if( options.fullAuto )
				if( wasFloat ) {


					if(  drawPile.stack.top && 
							!discard.stack.top?.flags.bFloating && 
							!drawPile.stack.top?.flags.bFloating) {
								console.log( "Flip the draw card..." );


								if( drawPile.flags.bTurn3ToDiscard ) {
									for( let n = 0; n < 3; n++ ) {
										drawPile.stack.turnTopCard();
										dragControl.addTurn( drawPile.stack.top, 0, 0.25 );
			
										//const stack_to = stack.#deck.getStack("Discard")
										//card_stack.transfer( stack_to, 1 );
									}
								} else {
									drawPile.stack.turnTopCard();
									dragControl.addTurn( drawPile.stack.top, 0, 0.25 );
									// update?
									//const stack_to = stack.#deck.getStack("Discard")
									//card_stack.transfer( stack_to, 1 );
								}
					}
				}
				return;

			}
		}

	}

}