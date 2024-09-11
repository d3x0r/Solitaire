

//extern char *cardlongnames[14];

const MAX_ITERATORS = 5;
const ITERATE_START	= ( 1 );
const ITERATE_FROM_BASE = ( ITERATE_START + 1 );
// 2 - 2+n
const ITERATE_FROM = (n) =>( n + ITERATE_FROM_BASE );
// 7 - 7+n

const ITERATE_AT_BASE	= ( ITERATE_START +(1*MAX_ITERATORS) + 1 )
const ITERATE_AT = (n)=> ( n + ITERATE_AT_BASE )
const ITERATE_NEXT	=	( 0 )



const l = {
	flags : { ha : 0 },
	decks : []
};


class Card {
	id = 0;
	fake_id = 0;
	flags = {
		bDiscard: false,
		bFaceDown: false
	};
	pPlayedBy = {
		ref: null,
		field:null 
	};  // last stack that had this card...
	next = null;
	me = {ref: null, field: null};


	constructor( deck, id ) {
		this.id = id;
		this.deck = deck;
	}

	get name() {
		if( this.id >= this.deck.minor )
			return this.deck.trumpNames[this.id-this.deck.minor];
		return this.deck.faceNames[this.deck.CARD_NUMBER(this.id)] + this.deck.suitNames[this.deck.CARD_SUIT(this.id)];
	}
	get longName() {
		if( this.id >= this.deck.minor )
			return this.deck.trumpNames[this.id-this.deck.minor];
		return this.deck.faceLongNames[this.deck.CARD_NUMBER(this.id)] + " of " + this.deck.suitLongNames[this.deck.CARD_SUIT(this.id)];
	}

	//typedef PCARD (*IterateHand)( PHAND hand, let level, let bStart );
	get longName() {
		return this.deck.cardlongnames[Card.CARD_NUMBER(this.id)];
	}
	get wild( ){
		return ( this.id & 0x8000 ) !== 0;
	}
	set wild( value ) {
		if( value ) this.id |= 0x8000;
		else this.id &= 0x7FFF;
	}	
	// name of iterator...


	grab() {
		// save the last stack that had this card.
		if( this.me.field === "next" ) {
			// is in a list of cards, need to step back to find the card stack this was in...
			let prior = this.me.ref[this.me.field];
			while( prior ) {
				if( prior.me.field === "cards" ) {
					this.pPlayedBy = prior.me.ref;
					break;
				}
				prior = prior.me.ref[prior.me.field];
			}
		} else 
			this.pPlayedBy = this.me.ref;


		if( this.next ) {
			this.next.me.ref = this.me.ref;
			this.next.me.field = this.me.field;
		} // end of list, or isolated card.
		if( this.me.ref ) this.me.ref[this.me.field] = this.next; // isolated card
		this.next = null;
		this.me.ref = null;
		return this;
	}
	
	faceDown(){
		this.flags.bFaceDown = true;
		return this;
	}

}

/*
struct update_callback
{
	void (CPROC *f)( uintptr_t psv );
	uintptr_t psv;
};
*/

class CardStack {
	name = "CardStack";
	cards = null;
	update_callbacks = [];
	out_of_cards_callbacks = [];
	deck = null;

	constructor( name ) {
		this.name = name;
	}


	addUpdate( f, psv ) {
		this.update_callbacks.push( {f, psv} );
	}
	removeUpdate( psv ) {
		this.update_callbacks = this.update_callbacks.filter( cb => cb.psv !== psv );
	}
	update() {
		this.update_callbacks.forEach( cb => cb.f( cb.psv ) );
	}
	addOutOfCards( f, psv ) {
		this.out_of_cards_callbacks.push( {f, psv} );
	}
	removeOutOfCards( psv ) {
		this.out_of_cards_callbacks = this.out_of_cards_callbacks.filter( cb => cb.psv !== psv );
	}
	out_of_cards() {
		this.out_of_cards_callbacks.forEach( cb => cb.f( cb.psv ) );
	}
	getNthCard( n ) {
		let card = this.cards;
		while( n-- && card ) card = card.next;
		return card;
	}
	get top() {
		return this.cards;
	}
	playTo( stack ) {
		if( this.cards ) {
			this.cards.flags.bFaceDown = false;
			stack.add( this.cards );
		}
	}
	dealTo( stack ) {
		if( this.cards ) {
			stack.add( this.cards );
		}
	}
	transfer( to, nCards ) {
		const tmpStack = {
			cards : null
		}
		let card;
		for( let n = 0; n < nCards; n++ )
		{
			card = this.cards;
			if( card )
			{
				card.grab();
				if( card.next = tmpStack.cards ) {
					card.next.me.ref = card;
					card.next.me.field = "next";
				}
				card.me.ref = tmpStack;
				card.me.field = "cards";
				tmpStack.cards = card;
			}
		}
		while( card = tmpStack.cards )
		{
			if( card.me.ref[card.me.field] = card.next ) {
				card.next.me.ref = card.me.ref;
				card.next.me.field = card.me.field;
			}
			if( card.next = to.cards ) {
				to.cards.me.ref = card;
				to.cards.me.field = "next";
			}
			card.me.ref = to;
			card.me.field = "cards";
			to.cards = card;
		}
		this.update();
		to.update();
	}	
	turnTopCard() {
		if( this.cards )
			this.cards.flags.bFaceDown = false;
		this.update();
	}

	add( card ) {
		card.grab();
		if( card.next = this.cards ) {
			card.next.me.ref = card;
			card.next.me.field = "next";
		}
		card.me.ref = this;
		card.me.field = "cards";
		this.cards = card;
		this.update();
	}

	discard() {
		while( this.cards ) {
			deck.discard( this.cards.grab() );
		}
		this.deck.deleteHand( this );
		this.update();
	}
}

class Hand {
	// typical stacks are: Cards, Showing
	stacks = [];
	deck = null;
	tricks = 0;

	// iterator state...
	iStage = [];
	card = [];

	constructor( deck ) {

	}

	delete() {
		this.stacks.forEach( stack=>{
			stack.discard( this.deck );
		})
	}

	getStack( name ) {
		const stack = this.stacks.find( s => s.name === name );
		if( !stack ) {
			const stack = new CardStack( name );
			this.stacks.push( stack );
			return stack;
		}
		return stack;
	}
	add( card ) {
		this.getStack( "Cards" ).add( card );
	}

	get count() {
		let n = 0;
		let card = this.getStack( "Cards" ).cards;
		while( card ) card = card.next, n++;
	}
	
	get cardList() {
		let card = this.getStack( "Cards" ).cards;
		let cards = [];
		while( card ) cards.push( card), card = card.next;
		return cards.map( card => card.name ).join(',');
	}

	get cardListLong() {
		let card = this.getStack( "Cards" ).cards;
		let cards = [];
		while( card ) cards.push( card), card = card.next;
		return cards.map( card =>card.longName ).join(',');
	}
	get gameCardList() {
		let count = 0;
		const cards = [];
		for( count = 0, pc = ph.getStack( "Cards" ).cards; pc; pc = pc.next, count++ );
		for( count = 1, pc = this.pDeck._HandIterator( ph, 0, true );
			 pc;
				pc = this.deck._HandIterator( ph, 0, false ), count++ ) {
				const cardval = this.deck.CARD_NUMBER( pc.id );
				if( !pDeck.flags.bLowball && !cardval )
					cardval = 13;
				cards.push( cardnames[cardval] + suits2[(pc.id/13)|0] );
		}
		return cards.join(',');
	}

	
}


class Deck {
	name = "Deck";
	flags = {
		bHold: false,
		bLowball: false
	};
	get faces() {
		return this.config && this.config.faces || 0;
	}
	get suits() {
		return this.config && this.config.suits || 0;
	}
	minor = 0
	trumps = 0;
	cards = [];
	hands = [];
	// typical stacks are: Draw, Discard, Table
	stacks = [];
	handIterator = null;
	config = null;
	constructor( name, config ) {
		this.name = name;
		this.config = config || {
			faces: 13,
			suits: 4,
			suitLongNames: [ "Hearts", "Diamonds", "Clubs", "Spades" ],
			suitNames: [ "H", "D", "C", "S" ],
			suitEmojis: [ "♥️", "♦️", "♣️", "♠️" ],
			faceLongNames: [ "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ],
			faceNames: [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ]
		};
		this.minor = this.config.suits*this.config.faces;
		for( let i = 0; i < this.config.suits; i++ )
			for( let j = 0; j < this.config.faces; j++ )
				this.cards.push( new Card( this, this.CARD_ID(i,j) ) );
		for( let i = 0; i < this.config.trumps; i++ )
			this.cards.push( new Card( this, this.CARD_ID(this.config.suits,j) ) );
		const drawPile = this.getStack( "Draw" );
		for( let card of this.cards )
			drawPile.add(card);
	}

	get faceNames() {
		return this.config.faceNames;
	}
	get faceLongNames() {
		return this.config.faceLongNames;
	}
	get suitNames() {
		return this.config.suitNames;
	}
	get suitLongNames() {
		return this.config.suitLongNames;
	}

	add( card ) {
		card.grab();
		card.next = this.cards;
		card.me.ref = this;
		card.me.field = "cards";
		this.cards = card;
	}

	gather() {
		const draw = this.getStack( "Draw" );
		this.hands.forEach( hand => {
			while( hand.cards )
				draw.add( hand.cards.grab() );
			hand.update();
		} );
		this.stacks.forEach( stack => {
			if( stack === draw ) return;
			while( stack.cards )
				draw.add( stack.cards.grab() );
			stack.update();
		} );
		{
			for( let card = 0; card < this.cards.length; card++ )
				this.cards[card].flags.bFaceDown = true;
		}
		{
			let t;
			let card;
			for( card = 0, t=this.getStack( "Draw" ).cards; t; card++ )
			{
				t = t.next;
			}
			console.log( "Playing with:", card );
		}
	
	}

	newHand() {
		const hand = new Hand( this );
		this.hands.push( hand );
		return hand;
	}
	

	delete() {
		// delete all hands
		// but really this is garbage collected, so just drop the deck.
	}
	
	discard( card ) {
		this.getStack( "Discard" ).add( card.grab() );
	}

	deleteHand( hand ) {
		this.hands = this.hands.filter( h => h !== hand );
	}

	getStack( name ) {
		const stack = this.stacks.find( s => s.name === name );
		if( !stack ) {
			const stack = new CardStack( name );
			this.stacks.push( stack );
			return stack;
		}
		return stack;
	}
	CARD_NUMBER(id){return	( (id) % this.faces ) }
	CARD_SUIT(id){ return ( ((id) / this.faces)|0 ) ; }
	CARD_ID(suit,number) { 
		if( suit < 0 || suit >= this.suits ) 
			return number; 
		else
			return	( ((suit)*this.faces) + (number));
	}

	playCard( pCard )
	{
		const stack = this.getStack( "Table" );
		if( stack )
			stack.add( pCard );
	}

	shuffle()
	{
		let tree = null;
		let card;
		// assume everything to gather has been gathered
		const stack = this.getStack( "Draw" );
		
		while( card = stack.cards )
		{
			if( card.me.ref[card.me.field] = card.next ) {
				card.next.me.ref = card.me.ref;
				card.next.me.field = card.me.field;
			}
			card.next = null;
			card.me.ref = null;
			tree = sort( tree, card, Math.random() );
		}
	
		FoldTree( { ref:stack, field: "cards" }, tree );
		stack.update();
	}

	dealTo( playTo )
	{
		const pc = this.getStack( "Draw" ).cards;
		if( pc && playTo )
		{
			playTo.add( pc );
		}
	}

	playTo( playTo )
	{
		const pc = this.getStack( "Draw" ).cards;
		if( pc && playTo )
		{
			playTo.add( pc );
			pc.flags.bFaceDown = false;
		}
	}
	
	//CARDS_PROC( void, DeckPlayCard )( PDECK, PCARD );
	//CARDS_PROC( void, DeckDiscard )( PDECK pDeck, PCARD pCard );
	//CARDS_PROC( void, Shuffle )( PDECK pDeck );
	//CARDS_PROC( void, GatherCards )( PDECK deck );
	
	// deal the next card on the deck to a hand
	// if hand is null, then it is dealt to the face-up table.
	//CARDS_PROC( void, DealTo )( PDECK pd, PHAND ph, LOGICAL bPlayTo );
	//CARDS_PROC( PCARD, PickACard )( PDECK deck, let ID );
	
	//CARDS_PROC( PCARD_STACK, GetCardStack )( PDECK deck, CTEXTSTR name );
	
	

}

//---------------------------------------------------------------------

class Holder {
	card = null;
	r = 0;
	pLess = null;
	pMore = null;
	constructor( card, r ) {
		this.card = card;
		this.r = r;
	}
}

function sort( tree, card, r )
{
	if( !tree )
		tree = new Holder( card, r )
	else
	{
		if( r > tree.r )
			tree.pMore = sort( tree.pMore, card, r );
		else
			tree.pLess = sort( tree.pLess, card, r );
	}
	return tree;
}

function FoldTree( pStack, tree )
{
	if( tree.pLess )
		FoldTree( pStack, tree.pLess );
	if( tree.card.next = pStack.ref[pStack.field] ) {
		pStack.ref[pStack.field].me.ref = tree.card;
		pStack.ref[pStack.field].me.field = "next";
	}
	tree.card.me.ref = pStack.ref;
	tree.card.me.field = pStack.field;

	pStack.ref[pStack.field] = tree.card;
	if( tree.pMore )
		FoldTree( pStack, tree.pMore );
}




class Poker {
	static poker_hand_class = {
		POKER_HAND_SOMETHING_HIGH : 0,
		POKER_HAND_PAIR : 0x100000,
		POKER_HAND_2PAIR : 0x200000,
		POKER_HAND_3KIND: 0x300000,
		POKER_HAND_STRAIGHT : 0x400000,
		POKER_HAND_FLUSH : 0x500000,
		POKER_HAND_FULLHOUSE : 0x600000,
		POKER_HAND_4KIND : 0x700000,
		POKER_HAND_STRAIGHT_FLUSH : 0x800000,
		POKER_HAND_ROYAL_FLUSH : 0x900000,
		POKER_HAND_5KIND : 0xa00000,
		POKER_HAND_MASK : 0xF00000
	};
	

	static GetPokerHandName( hand, textRef/*PTEXT**/ ){

	}


	//static ValuePokerHand( PHAND pHand, PCARD pWild, let bHigh );

	//static IterateHoldemHand( PHAND hand, let level, let bStart );
	//static IterateStudHand( PHAND hand, let level, let bStart );


	static IsWild( pCard, pWild )
	{
		// check to see if the card can be wild....
		if( pCard.id & 0x8000 )
			return true;
		for( let pCheck = pWild; pCheck; pCheck = pCheck.next )
			if( pCard.id == pCheck.id )
				return true;
		return false;
	}
	
	//-------------------------------------------------------------------------
	
	CountWild( pHand, pWild )
	{
		// check to see if the card can be wild....
		let n = 0;
		let pCheck, pCard;
		const iter = pHand.Deck._HandIterator;
		for( pCard = iter( pHand, 0, true ); 
				pCard; 
				pCard = iter( pHand, 0, false ) )
		{
			pCheck = pWild;
			while( pCheck )
			{
				if( pCard.id == pCheck.id )
				{
					n++;
					break;
				}
				pCheck = pCheck.next;
			}
		}
		return n;
	}
	
	//-------------------------------------------------------------------------
	
	static HighCard( pHand, pWild )
	{
		let result, max = 0, val, skipwild = 0, n;
		let pCard;
			let iter = pHand.Deck._HandIterator;
		result = 0;
		for( n = 0; n < 5; n++ )
		{
				max = 0;
				for( pCard = iter( pHand, 0, true ); 
						pCard; 
						pCard = iter( pHand, 0, false ) )
				{
					// if it's wild, it's the highest card.
				if( Poker.IsWild( pCard, pWild ) )
					{
					// low card play needs to not pass wild cards...
					// whatever, we have at least a pair.
					return 0;
				}
				else // if not wild, then grab this card's value.
				{
					val = CARD_NUMBER( pCard.id ) + 1;
				//lprintf( "Checking card %d in %08x", val, result );
					if( val == 1 )	// aces are high.
						val = 14;
				}
				// biggest number yet
				// but if we have a result, the low nibble is the highest card 
				// which it may be.	
				if( val >= max	)
				{
					if( result )
					{
						// only problem is when this has a pair or more....
						// but this algorithm does not apply to a pair
						// though it does apply to 2 pair and flushes.
						if( val < ( (result) & 0xF ) )
						{
							max = val;
						}
					}
					else
						max = val; // if no result yet we want THE highest.
					} // otherwise we don't want to store this.
			}
				result <<= 4;
				result += (max);
			//lprintf( "Result is now %08x", result );
		}
		return 0x0000000 | result;
	}
	
	//-------------------------------------------------------------------------
	
	static IsPair( pHand, pWild )
	{
		let val1, val2, max = 0;
		const iter = pHand.Deck._HandIterator;
		let pCheck, pCheck2;
		for( pCheck = iter(pHand, 0, ITERATE_START );
		     pCheck; 
		     pCheck = iter( pHand, 0, ITERATE_NEXT ) )
		{
			// matching 3 of a kind aces (0) are high... therefore correct
			// the value. (and below)
			val1 = CARD_NUMBER( pCheck.id );
			if( !val1 )
			 val1 = 13;
			if( Poker.IsWild( pCheck, pWild ) )
				val1 = 0; // this is okay to match with ANY
			for( pCheck2 = iter( pHand, 1, ITERATE_FROM(0) ); 
			     pCheck2; 
			     pCheck2 = iter( pHand, 1, ITERATE_NEXT ) )
			{
				val2 = CARD_NUMBER( pCheck2.id );
			 //lprintf( "checking to see if %d=%d", val2, val1 );
			 if( !val2 )
				val2 = 13;
				if( Poker.IsWild( pCheck2, pWild ) )
					val2 = 0; // this is okay to match with ANY
				
			 if( !val1 || !val2 || ( val1 == val2 ) )
			 {
				 if( val1 )
				 {
						if( val1 > max )
							max = val1;
					} 
					else if( val2 )
				 {
						if( val2 > max )
							max = val2;
					} 
					else
					{
						// all 2 of these are wild, MUST be a pair.
						// max=13;
					//lprintf( "More than a pair - failed is pair." );
						return 0x10D; // 3 of a kind ace high.
					}
			 }
			}
		}
		if( max )
			return 0x100000 | max;
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static Is2Pair(	pHand, pWild )
	{
		let n1 = 0, n2 = 0, val1, val2;
		let pCheck, pCheck2;
		const iter = pHand.Deck._HandIterator;
		// 2 wild cards or more is better.
		// 1 wild card and a pair is better. (3 of a kind)
		// 2 pair is only natural.
		if( CountWild( pHand, pWild ) )
			return 0; // it can't be this. (it could by WHY)
	
		for( pCheck = iter( pHand, 0, ITERATE_START );
				pCheck; 
				pCheck = iter( pHand, 0, ITERATE_NEXT ) )
		{
			val1 = CARD_NUMBER( pCheck.id );
			if( !val1 ) // aces are numerically 0 but need to be 13.
			 val1 = 13;
			for( pCheck2 = iter( pHand, 1, ITERATE_FROM(0) );
					pCheck2 ; 
					pCheck2 = iter( pHand, 1, false ) )
			{
			 val2 = CARD_NUMBER( pCheck2.id );
			 if( !val2 )
				val2 = 13;
			 if( val1 == val2 )
			 {
				if( n1 )
				{
					if( n1 == val1 ) // 3 of a kind trip
						return 0; // 3 of a kind will trigger....
					if( n2 )
					{
						if( val1 > n1 )
							n1 = val1;
						else if( val1 > n2 )
							n2 = val1;
						// otherwise both are higher than this one we'd call.
					}
					else
						n2 = val1;
				}
				else
					n1 = val1;
				break;
			 }
			}
		}
		if( n1 < n2 )
		{
			let t;
			t = n1;
			n1 = n2;
			n2 = t;
		}
		if( n1 && n2 )
			return 0x0200000 | (n1<<4) | n2 ;
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static Is3Kind( pHand, pWild )
	{
		let val1, val2, val3, max = 0;
		let pCheck, pCheck2, pCheck3;
		const  iter = pHand.Deck._HandIterator;
		for( pCheck = iter( pHand, 0, ITERATE_START ); 
				pCheck; 
				pCheck = iter( pHand, 0, ITERATE_NEXT ) )
		{
			// matching 3 of a kind aces (0) are high... therefore correct
			// the value. (and below)
			val1 = CARD_NUMBER( pCheck.id );
			if( !val1 )
			 val1 = 13;
			if( Poker.IsWild( pCheck, pWild ) )
				val1 = 0; // this is okay to match with ANY
			for( pCheck2 = iter( pHand, 1, ITERATE_FROM(0) ); 
					pCheck2; 
					pCheck2 = iter( pHand, 1, ITERATE_NEXT ) )
			{
			 val2 = CARD_NUMBER( pCheck2.id );
			 if( !val2 )
				val2 = 13;
				if( Poker.IsWild( pCheck2, pWild ) )
					val2 = 0; // this is okay to match with ANY
			 if( !val1 || !val2 || ( val1 == val2 ) )
			 {
				 for( pCheck3 = iter( pHand, 2, ITERATE_FROM(1) ); 
							pCheck3; 
							pCheck3 = iter( pHand, 2, 0 ) )
				 {
					val3 = CARD_NUMBER( pCheck3.id );
					if( !val3 )
						val3 = 13;
						if( Poker.IsWild( pCheck3, pWild ) )
							val3 = 0; // this is okay to match with ANY
					if( !val3 || (val1)?(val3==val1):(val2)?(val3==val2):0 )
					{
						if( val1 )
						{
							if( val1 > max )
								max = val1;
						} 
						else if( val2 )
						{
							if( val2 > max )
								max = val2;
						} 
						else if( val3 )
						{
							if( val3 > max )
								max = val3;
							}
							else
							{
								// all 3 of these are wild, MUST be 3 kind.
								// max=13; 
								return 0x30000D; // 3 of a kind ace high.
							}
						break;
					}
					}
			 }
			}
		}
		if( max )
			return 0x300000 | max;
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static IsStraight( pHand, pWild )
	{
		let start = -1, length = 0, maxstart, maxlength = 0, wilds;
		let card;
		const iter = pHand.Deck._HandIterator;
		let n;
		wilds = CountWild( pHand, pWild );
		for( n = 0; n <= 13; n++ )
		{
			for( card = iter( pHand, 0, ITERATE_START );
					card; 
					 card = iter( pHand, 0, ITERATE_NEXT ) )
			{
				let val = CARD_NUMBER(card.id);
				if( val == 0 && n > 0 )
					val = 13;
				if( val == n )
				{
					if( start < 0 )
					{
						start = n;
						length = 1;
					}
					else
					{
						length++;
					}
					break;
				}
			}
			if( !card )
			{
				if( wilds )
				{
					if( start >= 0 )
					{
						wilds--;
						length++;
					}
				}
				else
				{
					if( length > maxlength )
					{
						maxlength = length;
						maxstart = start;
					}
					length = 0;
					start = -1;
					wilds = CountWild( pHand, pWild );
				}
			}
		}
		//Log4( "Length: %d start: %d	maxlen: %d	maxstart : %d", length, start, maxlength, maxstart );
		if( length >= 5 )
		{
			if( wilds )
				length += wilds;
			if( (start + length-2) >= 13 )
				return 0x40D;
			return 0x400000 + (start + length-2);
		}
		if( maxlength >= 5 )
			return 0x400000 + (maxstart + maxlength-2);
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static IsFlush( pHand, pWild )
	{
		const iter = pHand.deck._HandIterator;	
		let number = 0, val, match = 0;
		let card, start = pHand.getStack( "Cards" ).cards;
		for( start = iter( pHand, 0, ITERATE_START );
				start && ( match < 5 );
				start = iter( pHand, 0, ITERATE_NEXT ) )
		{
			match = 0;
			number = 0;
			for( card = iter( pHand, 1, ITERATE_AT(0) );
				 match < 5 && card;
					card = iter( pHand, 1, ITERATE_NEXT ) )
				if( !Poker.IsWild( card, pWild ) ) // if it's wild we don't care.
				{
					if( !number )
					{
						number = pHand.deck.CARD_SUIT( card.id ) + 1;
						match++;
					}
					// if this number is not the number we're matching, is not 5 kind
					else if( number == ( pHand.deck.CARD_SUIT( card.id ) + 1 ) )
						match++;
				}
				else
					match++;
		}
		if( match == 5)
		{
			val = HighCard( pHand, pWild );
			return 0x500000 + val;
		}
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static IsFullHouse( pHand, pWild )
	{
		let val, max = 0;
		let nWilds = CountWild( pHand, pWild );
		const iter = pHand.Deck._HandIterator;
		if( nWilds > 2 )
		{
			Log( " we're in trouble... we have more than 2 wilds in a full house?" );
			return 0;
		}
	
		// Due to the nature - will use all wild cards in the three of a kind
		// and never ever in a pair.
		// for if we have 4+ wild cards that's 5 kind
		// if we have 3 wild cards that's 4 kind
		// if we have 2 wild cards and a pair that's 4 kind
		// if we have 2 wild cards and no pair that's 3 kind(only)
		// if we have 1 wild card and a natural 3 kind that's 4 kind.
		// if we have 1 wild card then we need 2 pair or a natural. 
		//	AND the wild card will construct the top 3 kind
		// else we have a natural 3 kind and pair (which is not the same value
		//	 as the three of a kind.
		if( val = Is3Kind( pHand, pWild ) )
		{
			// here have to do custom ispair code so that we exclude those 
			// which are already accounted for.
			let val1, val2;
			let pCheck, pCheck2;
			for( pCheck = iter( pHand, 0, ITERATE_START ); 
					pCheck; 
					pCheck = iter( pHand, 0, ITERATE_NEXT ) )
			{
				// matching 3 of a kind aces (0) are high... therefore correct
				// the value. (and below)
				if( Poker.IsWild( pCheck, pWild ) )
					continue; // any wild is already used.
				if( ( val1 = CARD_NUMBER( pCheck.id ) ) == ( val & 0xFF ) )
					continue; // any card which is in the 3 of a kinda found is used.
	
			 if( !val1 )
				val1 = 13;
	
			 for( pCheck2 = iter( pHand, 0, ITERATE_FROM(0) ); 
						pCheck2; 
						pCheck2 = iter( pHand, 0, ITERATE_NEXT ) )
			 {
					if( Poker.IsWild( pCheck2, pWild ) )
						continue; // any wild is already used.
					if( ( val2 = CARD_NUMBER( pCheck2.id ) ) == ( val & 0xFF ) )
						continue; // any card which is in the 3 of a kinda found is used.
					if( val1 == val2 )
					{
						if( val1 > max )
							max = val1;
						break; // next outer card to match, please.
					}
			 }
			}
			if( max )
			{
				return 0x600000 | ( ( val & 0xF ) << 4 ) | max;
			}
		}
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static Is4Kind( pHand, pWild )
	{
		let number, max = 0, test;
		let matched = 0;
		const iter = pHand.Deck._HandIterator;
		let last_kicker = 0;
		let kicker = 0;
		let start = pHand.getStack( "Cards" ).cards;
		let card;
		for( start = iter( pHand, 0, ITERATE_START ); start; start = iter( pHand, 0, ITERATE_NEXT ) )
		{
			matched = 0;
			number = 0;
			kicker = 0;
			for( card = iter( pHand, 1, ITERATE_AT(0) );
				 matched < 4 && card;
				 card = iter( pHand, 1, ITERATE_NEXT ) )
			{
				if( !Poker.IsWild( card, pWild ) ) // if it's wild we don't care.
				{
					test = CARD_NUMBER( card.id );
					if( !test )
						test = 13;
					if( !number )
					{
						number = test;
						matched++;
					}
					else if( number == test ) 
					{
						matched++;
					}
					else
					{
						if( test > kicker )
							kicker = test;
					}
				}
				else // all wild cards match.
					matched++;
			}
			if( matched >= 4 )
			{
				if( !number )
					number = 13;			
				if( number > max )
					max = number;
				last_kicker = kicker;
			}
			start = start.next;
		}
		if( max )
			return 0x700000 + (max<<4) + last_kicker;
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static	IsStraightFlush( pHand, pWild )
	{
		let val = 0;
		if( IsFlush( pHand, pWild ) )
				if( val = IsStraight( pHand, pWild ) )
				{
					if( (val & 0xFF) == 0xD ) // special case - royal flush.
						return 0x900000;
					return ( val & 0xFF ) | 0x800000;
				}
		return 0;
	}
	
	//-------------------------------------------------------------------------
	
	static Is5Kind( pHand, pWild )
	{
		let nWild = CountWild( pHand, pWild );
		let count;
		// must have at least one wild to consider this hand.
		if( !nWild )
			return 0;
		{
			let number = 0;
			let card;
			count = 0;
			for( card = pHand.getStack( "Cards" ).cards; card; card = card.next )
				if( !Poker.IsWild( card, pWild ) ) // if it's wild we don't care.
				{
					if( !number )
					{
						number = CARD_NUMBER( card.id ) + 1;
						count++;
					}
					// if this number is not the number we're matching, is not 5 kind
					else if( number != CARD_NUMBER( card.id ) )
						return 0;
					count++;
				}
				else
					count++;
			if( !number )
				number = 13; // all wilds, therefore we assume 5 aces.
			if( count >= 5 )
				return 0xA00000 + number;
		}
		return 0; // may not be passed 5 cards
	}
	
	//-------------------------------------------------------------------------
	
	static ValuePokerHand( pHand, pWild, bHigh )
	{
		let val;
		if( !pHand )
			return 0;
		if( bHigh )
		{
			val = Poker.Is5Kind( pHand, pWild );
			// this is a special straight flush (name only?)
			// if( !val ) val = IsRoyalFlush( pHand, pWild );
			if( !val ) val = Poker.IsStraightFlush( pHand, pWild );
			if( !val ) val = Poker.Is4Kind( pHand, pWild );
			if( !val ) val = Poker.IsFullHouse( pHand, pWild );
			if( !val ) val = Poker.IsFlush( pHand, pWild );
			if( !val ) val = Poker.IsStraight( pHand, pWild );
			if( !val ) val = Poker.Is3Kind( pHand, pWild );
			if( !val ) val = Poker.Is2Pair( pHand, pWild );
			if( !val ) val = Poker.IsPair( pHand, pWild );
			if( !val ) val = Poker.HighCard( pHand, pWild );
		}
		else
		{
			val = Poker.HighCard( pHand, pWild );
			// this is a special straight flush (name only?)
			// if( !val ) val = IsRoyalFlush( pHand, pWild );
			if( !val ) val = Poker.IsStraightFlush( pHand, pWild );
			if( !val ) val = Poker.Is4Kind( pHand, pWild );
			if( !val ) val = Poker.IsFullHouse( pHand, pWild );
			if( !val ) val = Poker.IsFlush( pHand, pWild );
			if( !val ) val = Poker.IsStraight( pHand, pWild );
			if( !val ) val = Poker.Is3Kind( pHand, pWild );
			if( !val ) val = Poker.Is2Pair( pHand, pWild );
			if( !val ) val = Poker.IsPair( pHand, pWild );
			if( !val ) val = Poker.Is5Kind( pHand, pWild );
		}
		return val;
	}
	
	//-------------------------------------------------------------------------
	
	static GetPokerHandName( pHand )
	{
		let name = '';
		let value;
		value = Poker.ValuePokerHand( pHand, null, true );
		if( !value )
			name = "No hand";
		else switch( value >> 20 )
		{
		case 0:
			name = "High Card - " + cardlongnames[ ((value>>16)&0xF)-1 ];
			break;
		case 1:
			name = "A Pair of "+cardlongnames[ (value&0xF) ]+"s";
			break;
		case 2:
			name = "2 Pair "+cardlongnames[ (value&0xF0)>>4]+"s and "+cardlongnames[ (value&0xF) ] +"s"
							 ;
			break;
		case 3:
			name = "3 of a Kind "+cardlongnames[ (value&0xF) ]+"s" ;
			break;
		case 4:
			name = "Straight";
			break;
		case 5:
			name = "Flush";
			break;
		case 6:
			name = "Full House "+cardlongnames[ (value&0xF0)>>4] +"s over "+cardlongnames[ (value&0xF) ] +"s";
			break;
		case 7:
			name = "4 of a Kind "+cardlongnames[(value&0xF0)>>4] +"s";
			break;
		case 8:
			name = "Straight Flush";
			break;
		case 9:
			name = "Royal Flush";
			break;
		case 10:
			name = "5 of a Kind "+cardlongnames[value&0xF]+"s";
			break;
		}
		return name;
	}
	
	//-------------------------------------------------------------------------
	
	static IterateHoldemHand( hand, level, bStart )
	{
		//lprintf( "Iterate start: %d level: %d", bStart, level );
		if( bStart != ITERATE_NEXT )
		{
			if( bStart == ITERATE_START )
			{
				hand.card[level] = hand.getStack( "Cards" ).cards;;
				hand.iStage[level] = 0;
			}
			else
			{
				if( bStart >= ITERATE_FROM_BASE )
				{
					let n = bStart - ITERATE_FROM_BASE;
					if( n >= MAX_ITERATORS )
					n -= MAX_ITERATORS;
				// this is iterate_from or iterate_at
					// this is iterate from - which starts at the next
					// beyond the iterator of the level specified...
					hand.card[level] = hand.card[n];
					hand.iStage[level] = hand.iStage[n];
				// this is what makes an Iteratefrom be an iterate from
					if( bStart < ITERATE_AT_BASE ) {// this is NOT an AT so do step, else return here.
						stepNext = true;
						//goto Step_next_card;
					}
				}
			}
		}
		else
			stepNext = true;

		if( stepNext)
		{
			if( hand.card[level] )
			{
				hand.card[level] = hand.card[level].next;
				while( hand.iStage[level] < 1 &&
						!hand.card[level] )
				{
					hand.card[level] = hand.deck.getStack( "Table" ).cards;
					hand.iStage[level]++;
				}
			}
		}

		return hand.card[level];
	}
	
	//-------------------------------------------------------------------------
	
	static IterateStudHand( hand, level, bStart )
	{
		if( bStart )
		{
			hand.card[level] = hand.getStack( "Cards" ).cards;
			hand.iStage[level] = 0;
		}
		else
		{
			hand.card[level] = hand.card[level].next;
			while( hand.iStage[level] < 1 &&
					!hand.card[level] )
			{
				hand.card[level] = hand.getStack( "Showing" ).cards;
				hand.iStage[level]++;
			}
		}
		return hand.card[level];
	}

}

const getStandardDeck = () => {
	return new Deck( "Standard", {
		faces:13, suits:4, iterator:null,
		suitLongNames: [ "Hearts", "Clubs", "Diamonds", "Spades" ],
		suitNames: [ "H", "C", "D", "S" ],
		suitEmojis: [ "♥️", "♣️", "♦️", "♠️" ],
		faceLongNames: [ "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ],
		faceNames: [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ]
	});
}
const getHoldemDeck = () => {
	return new Deck( "Holdem", {
		faces:13, suits:4, iterator:Poker.IterateHoldemHand,
		suitLongNames: [ "Hearts", "Clubs", "Diamonds", "Spades" ],
		suitNames: [ "H", "C", "D", "S" ],
		suitEmojis: [ "♥️", "♣️", "♦️", "♠️" ],
		faceLongNames: [ "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ],
		faceNames: [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ]
	});
}
const getStudDeck = () => {
	return new Deck( "Stud", {
		faces:13, suits:4, iterator:Poker.IterateStudHand,
		suitLongNames: [ "Hearts", "Clubs", "Diamonds", "Spades" ],
		suitNames: [ "H", "C", "D", "S" ],
		suitEmojis: [ "♥️", "♣️", "♦️", "♠️" ],
		faceLongNames: [ "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" ],
		faceNames: [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ]
	});
}
const getTarotDeck = () => {
	return new Deck( "Tarot", {
		faces:14, suits:4, iterator:null,
		// 22 major arcana, 56 minor arcana
		trumps: 22,
		suitLongNames : [ "Wands", "Cups", "Swords", "Pentacles" ],
		suitNames : [ "W", "C", "S", "P" ],
		suitEmojis : [ "🪄"/*"🕯️"*//*"🔥"*/, "🥂"/*"💧"*/, "⚔️", "🌟" ],
		// ★⛤✮✪⛥🪄✪
		faceLongNames : [ "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "Page", "Knight", "Queen", "King" ],
		faceNames : [ "1","2","3","4","5","6","7","8","9","10","P","k","Q","K" ],
		trumpNames : [ "Fool", "Magician", "High Priestess", "Empress", "Emperor", "Hierophant", "Lovers", "Chariot", "Strength", "Hermit", "Wheel of Fortune", "Justice",
			"Hanged", "Death", "Temperence", "Devil", "Tower", "Star", "Moon", "Sun", "Judgement", "World" ]
/*
0. The Fool. 🃏
I. The Magician. 🙌
II. The High Priestess. 🔮
III. The Empress. 🗽
IV. The Emperor. 🗿
V. The Hierophant. 🎓
VI. The Lovers. 💞
VII. The Chariot. 🚀
VIII. Strength. 💪
IX. The Hermit. ⛺️
X. Wheel of Fortune. 🎡
XI. Justice. 🔑
XII. The Hanged Man. 👻
XIII. Death. 💀
XIV. Temperance. 🍵
XV. The Devil. 👺
XVI. The Tower. 💥
XVII. The Star. ✨
XVIII. The Moon. 🌝
XIX. The Sun. 🌞
XX. Judgment. 📯
XXI. The World. 🌈
*/


	});
}

export {Deck,Poker, getStandardDeck, getHoldemDeck, getStudDeck, getTarotDeck};
