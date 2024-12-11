
import {klondike_board,klondike3_board} from "./solitaire-rules.js";
import {card_drag_control} from "./card-drag-control.js"
import {popups} from "./node_modules/@d3x0r/popups/popups.mjs";

import {card_game} from "./card_game.js"
import {getStandardDeck} from "./cards.js";





export function setup( parent, options ) {
	options = options || { draw3 : false };
	const useBoard = options.draw3 ? klondike3_board : klondike_board;
	let deck = getStandardDeck( useBoard.name );
	const stacks = [];
	const fill = parent.querySelector( "#klondike-game" );
	const dragControl = new card_drag_control( parent );
	// use useBoard.name 
	for( let stackName of Object.keys( useBoard ) ){
		if( stackName === "name" ) continue;
		const stack = useBoard[stackName];
		// this is magic.
		stack.dragControl = dragControl;
		stack.deck = deck;
		stack.append( fill );
		stacks.push( stack );
	}
	card_game.makeGame( useBoard.name, deck );

	popups.makeButton( fill, "New Game", () => {

		const game = card_game.getGame( useBoard.name );

		for( let stack of stacks ){
			stack.game = game;
		}
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

	}, {suffix:"new-game"} );
}