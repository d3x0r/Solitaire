
import {card_stack_control} from "./card-stack-control.js"

const step_y = 2;
const step_x = 2;

const freecell_board = { 
    name : "Freecell",
    acePile1 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
		},
		startup : {
			nDrawAtDeal : 0,
		},
		deck_stack : "AcePile1",
		step_x : 0,
		step_y : 1,
		x : 10,
		y : 5,
		width : 10,
		height : 20,
	}),
	acePile2 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
		},
		deck_stack : "AcePile2",
		step_x : 0,
		step_y : 1,
		x : 30,
		y : 5,
		width : 10,
		height : 20,
	}),
	acePile3 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
		},
		deck_stack : "AcePile3",
		step_x : 0,
		step_y : 1,
		x : 50,
		y : 5,
		width : 10,
		height : 20,
	}),
	acePile4 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
		},
		deck_stack : "AcePile4",
		step_x : 0,
		step_y : 1,
		x : 70,
		y : 5,
		width : 10,
		height : 20,
	}),
	boardPile1 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 6,
		},
		deck_stack : "BoardPile1",
		step_x : 0,
		step_y : 25,
		x : 10,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile2 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 5,
		},
		deck_stack : "BoardPile2",
		step_x : 0,
		step_y : 25,
		x : 10,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile3 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 4,
		},
		deck_stack : "BoardPile3",
		step_x : 0,
		step_y : 20,
		x : 20,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile4 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 3,
		},
		deck_stack : "BoardPile4",
		step_x : 0,
		step_y : 20,
		x : 30,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile5 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 2,
		},
		deck_stack : "BoardPile5",
		step_x : 0,
		step_y : 20,
		x : 40,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile6 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 1,
		},
		deck_stack : "BoardPile6",
		step_x : 0,
		step_y : 20,
		x : 50,
		y : 27,
		width : 8,
		height : 20,

	} ),
	boardPile7 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 0,
		},
		deck_stack : "BoardPile7",
		step_x : 0,
		step_y : 20,
		x : 60,
		y : 27,
		width : 8,
		height : 20,
	} ),
	drawPile : new card_stack_control({
		flags : {
		},
		startup: {
			nDrawAtStart : 0,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Draw",
		step_x : 0,
		step_y : 20,
		x : 60,
		y : 27,
		width : 8,
		height : 20,
	} ),
	discardPile : new card_stack_control({
		flags : {
			bSelectOnlyTop : true
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Discard",
		step_x : 0,
		step_y : 20,
		x : 60,
		y : 27,
		width : 8,
		height : 20,
	} ),

};


const klondike_board = { 
    name : "Klondike",
    acePile1 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
			bOnlyPlusOne : true,
		},
		startup : {
			nDrawAtDeal : 0,
		},
		deck_stack : "AcePile1",
		step_x : 0,
		step_y : 1,
		x : 10,
		y : 5,
		width : 9,
		height : 19,
		card_width: 1,
		card_height: 16,
	}),
	acePile2 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
			bOnlyPlusOne : true,
		},
		deck_stack : "AcePile2",
		step_x : 0,
		step_y : 1,
		x : 30,
		y : 5,
		width : 9,
		height : 19,
		card_width: 1,
		card_height: 16,
	}),
	acePile3 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
			bOnlyPlusOne : true,
		},
		deck_stack : "AcePile3",
		step_x : 0,
		step_y : 1,
		x : 50,
		y : 5,
		width : 9,
		height : 19,
		card_width: 1,
		card_height: 16,
	}),
	acePile4 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyAceWhenEmpty : true,
			bLastKing: true,
			bSameSuit: true,
			bOnlyPlusOne : true,
		},
		deck_stack : "AcePile4",
		step_x : 0,
		step_y : 2,
		x : 70,
		y : 5,
		width : 9,
		height : 19,
		card_width: 1,
		card_height: 16,
	}),
	boardPile1 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 6,
		},
		deck_stack : "BoardPile1",
		step_x : 0,
		step_y : 4,
		x : 10,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile2 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 5,
		},
		deck_stack : "BoardPile2",
		step_x : 0,
		step_y : 4,
		x : 20,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile3 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 4,
		},
		deck_stack : "BoardPile3",
		step_x : 0,
		step_y : 4,
		x : 30,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile4 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 3,
		},
		deck_stack : "BoardPile4",
		step_x : 0,
		step_y : 4,
		x : 40,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile5 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 2,
		},
		deck_stack : "BoardPile5",
		step_x : 0,
		step_y : 4,
		x : 50,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile6 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 1,
		},
		deck_stack : "BoardPile6",
		step_x : 0,
		step_y : 4,
		x : 60,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,

	} ),
	boardPile7 : new card_stack_control({
		flags : {
			bVertical : true,
			bOnlyKingWhenEmpty : true,
			bLastAce: true,
			bAlternateSuit: true,
			bTurnTop : true,
			bOnlyMinusOne : true,
		},
		startup: {
			nDrawAtStart : 1,
			nDrawDownAtStart : 0,
		},
		deck_stack : "BoardPile7",
		step_x : 0,
		step_y : 4,
		x : 70,
		y : 27,
		width : 9,
		height : 70,
		card_width: 1,
		card_height: 16,
	} ),
	drawPile : new card_stack_control({
		flags : {
			bTurnToDiscard : true,
		},
		startup: {
			nDrawAtStart : 0,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Draw",
		step_x : 0,
		step_y : 0,
		x : 81,
		y : 80,
		width : 8,
		height : 15,
		card_width: 1,
		card_height: 1,
	} ),
	discardPile : new card_stack_control({
		flags : {
			bSelectOnlyTop : true
		},
		startup: {
			nDrawAtStart : 0,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Discard",
		step_x : 0,
		step_y : 2,
		x : 91,
		y : 80,
		width : 8,
		height : 15,
		card_width: 1,
		card_height: 1,
	} ),

};

function clone( board ) {
	const clone = {};
	for( let stack in board){
		if( stack === "name" ) continue;
		clone[stack] = new card_stack_control( board[stack] );
	}
	return clone;
}

const klondike3_board = clone(klondike_board);
klondike3_board.name = "Klondike Draw 3"; 
klondike3_board.drawPile.flags.bTurn3ToDiscard = true;


for( let stack in freecell_board){
	if( stack === "name" ) continue;
	freecell_board[stack].x = freecell_board[stack].x * 1 / 80;
	freecell_board[stack].y = freecell_board[stack].y * 1 / 60;
	freecell_board[stack].width = freecell_board[stack].width * 4 / 80;
	freecell_board[stack].height = freecell_board[stack].height * 4 / 60;
}
for( let stack in klondike_board){
	if( stack === "name" ) continue;
}


export {freecell_board, klondike_board, klondike3_board};