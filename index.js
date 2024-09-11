

import {setup} from "./klondike.js";
import {popups} from "./node_modules/@d3x0r/popups/popups.mjs";

const pages = new popups.PagedFrame( document.querySelector( "#game1" ) );
popups.utils.preAddPopupStyles( document.head )

function include( selector ) {
    const page = pages.addPage( "Klondike", "klondike.html", {noDefaultStyle:true, origin:null,} );
    //const parent = document.querySelector( selector );
    //popups.fillFromURL( parent, "klondike.html", {noDefaultStyle:true, origin:null,} )
}

function include3( selector ) {
    const page = pages.addPage( "Klondike Draw 3", "klondike3.html", {noDefaultStyle:true, origin:null,} );
    //const parent = document.querySelector( selector );
    //popups.fillFromURL( parent, "klondike3.html", {noDefaultStyle:true, origin:null,} )
}


include( "#game1" );
include3( "#game1" );
