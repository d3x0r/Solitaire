
import {card_stack_control} from "./card-stack-control.js"

const step_y = 2;
const step_x = 2;

class Board {
	name= "boardName";
	autoPlayFoundation = true;
	autoPlayTableau = true;
	autoPlayDiscard = true;
	autoDraw = false;
    constructor( name, stacks ) {

	}
}

const clock_board = { 
    name : "Clock",
	autoPlayFoundation : true,
	autoPlayTableau : true,
	autoPlayDiscard : true,
	autoDraw : false,
	dragDelay : 0,
	_1 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 1, // 1 based so 0 is disable.			
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "1",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 63,
		y : 8,
		cards_wide : 4,
		cards_high : 1,
		width : 10,
		height : 15,
	}),
	_2 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 2, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "2",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 75,
		y : 26,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_3 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 3, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "3",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 85,
		y : 42.5,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_4 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 4,
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "4",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 75,
		y : 59,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_5 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 5, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "5",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 63,
		y : 76,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_6 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 6, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
			bTurnTop : true,
		},
		deck_stack : "6",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 42.5,
		y : 85,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_7 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 7, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "7",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 25,
		y : 76,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_8 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 8, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "8",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 13,
		y : 59,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_9 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 9, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "9",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 0,
		y : 42.5,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_10 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 10, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "10",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 13,
		y : 26,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_11 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 11, // 1 based so 0 is disable.
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "11",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 25,
		y : 8,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_12 :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 12,
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "12",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 42.5,
		y : 0,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),
	_dot :  new card_stack_control({
		flags : {
			bOnlySame : true,
			bPlayToBottom : true,
			nMustPlay : 13,
			bTurnTop : true,
		},
		startup : {
			nDrawAtDeal : 0,
			nDrawDownAtStart : 4,
		},
		deck_stack : "13",
		step_x : 10,
		step_y : 0,
		fd_step_x : 10,
		fd_step_y : 0,
		x : 42.5,
		y : 42.5,
		cards_wide : 4,
		cards_high : 1,
		width : 15,
		height : 15,
	}),


};

const freecell_board = { 
    name : "Freecell",
	autoPlayFoundation : true,
	autoPlayTableau : true,
	autoPlayDiscard : true,
	autoDraw : false,
	dragDelay : 0.025,
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
		step_y : 2,
		fd_step_x : 0,
		fd_step_y : 2,
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
		step_y : 2,
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
		step_y : 2,
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
		step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 2,
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
		fd_step_x : 0,
		fd_step_y : 0,
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
		fd_step_x : 0,
		fd_step_y : 0,
		x : 60,
		y : 27,
		width : 8,
		height : 21,
	} ),

};


const klondike_board = { 
    name : "Klondike",
	autoPlayFoundation : true,
	autoPlayTableau : true,
	autoPlayDiscard : true,
	autoDraw : false,
	dragDelay : 0.025,
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
		step_y : 2,
		x : 10,
		y : 5,
		width : 9,
		height : 19,
		cards_wide: 1,
		cards_high: 16,
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
		step_y : 2,
		x : 30,
		y : 5,
		width : 9,
		height : 19,
		cards_wide: 1,
		cards_high: 16,
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
		step_y : 2,
		x : 50,
		y : 5,
		width : 9,
		height : 19,
		cards_wide: 1,
		cards_high: 16,
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
		cards_wide: 1,
		cards_high: 16,
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
			nDrawDownAtStart : 0,
		},
		deck_stack : "BoardPile1",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 10,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
			nDrawDownAtStart : 1,
		},
		deck_stack : "BoardPile2",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 20,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
			nDrawDownAtStart : 2,
		},
		deck_stack : "BoardPile3",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 30,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
		fd_step_x : 0,
		fd_step_y : 5,
		x : 40,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
			nDrawDownAtStart : 4,
		},
		deck_stack : "BoardPile5",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 50,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
			nDrawDownAtStart : 5,
		},
		deck_stack : "BoardPile6",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 60,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,

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
			nDrawDownAtStart : 6,
		},
		deck_stack : "BoardPile7",
		step_x : 0,
		step_y : 4,
		fd_step_x : 0,
		fd_step_y : 5,
		x : 70,
		y : 27,
		width : 9,
		height : 70,
		cards_wide: 1,
		cards_high: 16,
	} ),
	drawPile : new card_stack_control({
		flags : {        	
			bTurnToDiscard : true,
			bVertical : true
		},
		startup: {
			nDrawAtStart : 0,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Draw",
		step_x : 0,
		step_y : 0,
		fd_step_y : -1.25,
		x : 81,
		y : 66,
		width : 12,
		height : 31.2,
		cards_wide: 1,
		cards_high: 20,
	} ),
	discardPile : new card_stack_control({
		flags : {
			bSelectOnlyTop : true,
			bVertical : true,
		},
		startup: {
			nDrawAtStart : 0,
			nDrawDownAtStart : 0,
		},
		deck_stack : "Discard",
		step_x : 0,
		step_y : 0,
		fd_step_x : 0,
		fd_step_y : 0,
		x : 81,
		y : 32,
		width : 12,
		height : 31.2,
		cards_wide: 1,
		cards_high: 24,
	} ),

};

export function clone( board ) {
	const clone = {};
	clone.name = board.name;
	for( let stack in board){
		if( ["name","dragDelay", "autoDraw","autoPlayFoundation","autoPlayTableau","autoPlayDiscard"].includes( stack ) ) {
			clone[stack] = board[stack];
			continue;
		}
		clone[stack] = new card_stack_control( board[stack] );
	}
	return clone;
}

const klondike3_board = clone(klondike_board);
klondike3_board.name = "Klondike Draw 3"; 
klondike3_board.drawPile.flags.bTurn3ToDiscard = true;




export {freecell_board, klondike_board, klondike3_board, clock_board};