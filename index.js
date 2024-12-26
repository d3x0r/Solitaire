

import {setup} from "./klondike.js";
import {popups} from "./node_modules/@d3x0r/popups/popups.mjs";

const pages = new popups.PagedFrame( document.querySelector( "#game1" ) );
popups.utils.preAddPopupStyles( document.head )

function include( selector, playAuto, title, fragment ) {
    const page = pages.addPage( ( title || ( "Klondike" ) ) + (playAuto?"(AUTO)":""), fragment || "klondike.html", {noDefaultStyle:true, origin:null} );
    page.content.classList.add( playAuto?"auto":"manual" );
    //const parent = document.querySelector( selector );
    //popups.fillFromURL( parent, "klondike.html", {noDefaultStyle:true, origin:null,} )
}

function include3( selector, playAuto ) {
    const page = pages.addPage( "Klondike Draw 3" + (playAuto?"(AUTO)":""), "klondike3.html", {noDefaultStyle:true, origin:null} );
    page.content.classList.add( playAuto?"auto":"manual" );
    //const parent = document.querySelector( selector );
    //popups.fillFromURL( parent, "klondike3.html", {noDefaultStyle:true, origin:null,} )
}


include( "#game1" );
include3( "#game1" );

include( "#game1", true );
include3( "#game1", true );

include( "#game1", false, "Clock", "clock.html" )