
import {clone,clover_board} from "./solitaire-rules.js";
import {card_drag_control} from "./card-drag-control.js"
import {card_stack_control} from "./card-stack-control.js"
import {popups} from "./node_modules/@d3x0r/popups/popups.mjs";

import {card_game} from "./card_game.js"
import {getStandardDeck} from "./cards.js";


export function setup( parent, options ) {
	options = options || { draw3 : false, fullAuto : false };
	// the name should change after clone... (maybe extend clone?)
	const useBoard = clone( clover_board );
	let deck = getStandardDeck( useBoard.name = useBoard.name + (options.fullAuto?"(auto)":"(manual)") );
	const stacks = [];
	const fill = parent.querySelector( "#clover-game" );
	const controls = parent.querySelector( "#controls" );
	const dragControl = new card_drag_control( fill );
	// use useBoard.name 
	const foundations = [];
	const table = [];
	let first = true;

	dragControl.startDelay = useBoard.dragDelay;
	for( let stackName of Object.keys( useBoard ) ){
		if( ["name","dragDelay", "autoDraw","autoPlayFoundation","autoPlayTableau","autoPlayDiscard"].includes( stackName ) ) continue;
		const stack = useBoard[stackName];
		// this is magic.
		stack.deck = deck;
		stack.thing = ()=>{
			first = true;
		}
		stack.dragControl = dragControl;
		stack.append( fill );
		stacks.push( stack );

		if( stack.stack.name.startsWith( "AcePile" ) )
			foundations.push( stack );
		if( stack.stack.name.startsWith( "table"))
			table.push( stack );
	}
	card_game.makeGame( useBoard.name, deck );

	dragControl.on( "land", (card)=>{
		if( first ) {
			first = false;
			deck.autoPlay(card, true, false);
		}
	} );
	dragControl.on( "flipped", (card)=>{
		if( first ) {
			first = false;
			deck.autoPlay(card, false, true);
		}
	} );

	
	const newGame = () => {
		first = true;
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

	popups.makeButton( controls, "New Game", newGame, {suffix:"new-game"} );
	popups.makeCheckbox( controls, useBoard, "autoPlayFoundation", "Auto Play to Foundation" )
	popups.makeCheckbox( controls, useBoard, "autoPlayTableau", "Auto Play from Tableau" )
	popups.makeCheckbox( controls, useBoard, "autoPlayDiscard", "Auto Play from Discard" )
	const change4 = popups.makeCheckbox( controls, useBoard, "autoDraw", "Auto Draw" );
	change4.on("change", ()=>{ if( useBoard.autoDraw ){

	} } );
	
	function autoPlay( lastCard, wasFloat, wasFlip ) {
		if( lastCard.flags.bFaceDown ) return; 
		//console.log( "time to make a new move...", lastCard );

		if( wasFlip ) {
			if( lastCard ) {
				// select this flipped card - it's the one we want to move somewhere.
				if( useBoard.autoPlayFoundation ) {
					lastCard.thisStack.control.SelectCards( 1, false );
					//if( card_stack_control.CanMoveCards( lastCard.thisStack.control, f ) ) 
					const num = lastCard.deck.CARD_NUMBER( lastCard.id );
					lastCard.thisStack.control.DoMoveCards( foundations[num] );
					if( useBoard.autoPlayDiscard ) {
						autoPlay( lastCard, true, false );						
					} else first = true;
				}
			}
		}

		if( wasFloat ) {
			//if( useBoard.autoPlayFoundation ) 
			{
				const t = lastCard.thisStack;
				if( t.top.flags.bFaceDown ) {
					dragControl.addTurn( t.top, 0, 0.125 );
					t.turnTopCard();
					if( useBoard.autoPlayDiscard ) {
						// don't wait for animation to end... we know where it's going... and what to flip.
						autoPlay( t.top, false, true );
					} else first = true;
				}
			}
		}

		
	}

	function getMoves(  ) {
		//console.log( "time to make a new move...", lastCard );
		const moves = []

		if( !discard.stack.top.flags.bFloating ) {
			discard.SelectCards( 1, true );
			for( let f of foundations ) {
				if( card_stack_control.CanMoveCards( discard, f ) ) {
					moves.push( {from:discard, to:f} )
				} 
			}
			for( let f of tableau ) {
				if( card_stack_control.CanMoveCards( discard, f ) ) {
					moves.push( {from:discard, to:f} )
				}
			}
		}

		if( useBoard.autoPlayTableau )
			for( let t of tableau ) {
				for( let s = 1; t.SelectCards( s, true ); s++ ) {
					if( t.stack.top.flags.bFloating ) break; // next stack, still floating
					if( s === 1 && useBoard.autoPlayFoundation) {
						// only move the last card from table to foundation
						for( let f of foundations ) {
							if( card_stack_control.CanMoveCards( t, f ) ) {
								// only need to move to first foundation
								// an ace might land on multiple
								// while any other card would only target one of them anyway
								moves.push( {from:t, to:f, count:s} )
								break;
							} 
						}
					}

					const card = t.stack.getNthCard( t.active.nCardsSelected -1 );
					// there's a card (or more) to move, and it's the bottom of the pile
					// or the next card is face down
					//    this prevents breaking piles in the middle, which only a 
					//   human would do (or if multiple solutions are run in parallel).
					if( card && ( !card.next || card.next.flags.bFaceDown ) ){
						for( let f of tableau ) {
							if( f === t ) continue; // skip the same target as this
							if( card_stack_control.CanMoveCards( t, f ) ) {
								if( !card.next && !f.stack.top ) continue; // don't move an empty stack to another empty stack
								moves.push( {from:t, to:f, count:s} );
							} 
						}
					}
				}
			}

		if( useBoard.autoPlayDiscard )
		{
			const t = discard;
			if( t.SelectCards( 1, true ) ) {
				if( !t.stack.top.flags.bFloating ) {
					let movedToFoundation = false
					{
						// only move the last card from table to foundation
						for( let f of foundations ) {
							if( card_stack_control.CanMoveCards( t, f ) ) {
								movedToFoundation = true;
								moves.push( {from:t, to:f, count:1} )
								break;
							} 
						}
					}
					const card = t.stack.getNthCard( t.active.nCardsSelected -1 );

					if( card && !movedToFoundation ){
						for( let f of tableau ) {
							if( f === t ) continue;
							if( card_stack_control.CanMoveCards( t, f ) ) {
								if( !card.next && !f.stack.top ) continue;
								moves.push( {from:t, to:f, count:1} );
								return;
							} 
						}
					}
				}
			} 

			if( options.fullAuto )
				if( wasFloat ) {
					if(  drawPile.stack.top && 
							!discard.stack.top?.flags.bFloating && 
							!drawPile.stack.top?.flags.bFloating) {
								//console.log( "Flip the draw card..." );

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

		}
		return moves;
	}


}