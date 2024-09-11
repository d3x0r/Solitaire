import {SaltyRNG} from "/node_modules/@d3x0r/srg2/salty_random_generator2.mjs";
import {getStandardDeck} from "./cards.js";

// this is sort of a binding point between logical game structures
// and visual game structures.

export class card_game {
	static games = [];
	name = "change me";
	deck = getStandardDeck();
	controls = [];
	selected_stack = null;
	seed = new Date().toLocaleDateString();

	static makeGame( name, deck ) {
		const game = new card_game();
		game.name = name;
		game.deck = deck;
		card_game.games.push( game );
		return game;
	}

	static getGame( name, deck )
	{
		//if( StrCmp( "Stud", name ) == 0 )
		//	return &l.game;
		const parts = name.split("#");
		const game = card_game.games.find( game => game.name == parts[0] );
		if( !game )
		{
			const game = new card_game();
			game.name = name;
			game.suits = 4;
			game.faces = 13;
			game.deck = deck;
			game.selected_stack = NULL;
			game.controls = NULL;
			card_game.games.push( game )
			return game;
		}
		if( parts.length > 1 ){
			const seeded_game = new card_game();
			seeded_game.name = game.name;
			seeded_game.deck = game.deck;
			seeded_game.seed = SaltyRNG.id();
			return seeded_game;
		}
		return game;
	}

}

