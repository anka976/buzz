// ----------------------------------------------------------------------------
// All right reserved
// Copyright (C) 2012 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------
// Need awesome webdevelopments? Hire me!
// ----------------------------------------------------------------------------
// 
// jQuery           http://jquery.com
// jQuery Ui        http://ui.jquery.com
// Buzz             http://buzz.jaysalvat.com
// Illustrations    http://www.joker-park.com
// 
// ----------------------------------------------------------------------------

buzz.defaults.formats = [ 'ogg', 'mp3' ];
buzz.defaults.preload = 'metadata';

//'gorilla1|терминатор управления|собаа|учитель|попугай|водитель|врач|das Model'

var games = [
    { img: 'img/pony.png', color:'#D4FFD4', word: 'Горилла Первая|Терминатор управления|Собака|Учитель',
        sound: 'sounds/monkey' }
];

var winSound        = new buzz.sound('sounds/win' ),
    errorSound      = new buzz.sound('sounds/error' );


$( function() {
    if ( !buzz.isSupported() ) {
        $('#warning').show();
    }

    var idx = 0,
        $container  = $( '#container' ),
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' );

    $( 'body' ).bind('selectstart', function() { 
        return false 
    });

    $picture.click( function() {
        refreshGame();
        buildGame( ++idx ); 
        return false;
    });

    function refreshGame() {
        $( '#models' ).html( '' );
        $( '#letters' ).html( '' );
    }

    function refreshPicture(img) {
        // Update the picture
        $picture.attr( 'src', img );
    }

    function buildGame( x ) {
        if ( x > games.length - 1 ) {
            idx = 0;
        }
        if ( x < 0 ) {
            idx = games.length - 1;
        }

        var game  = games[ idx ],
            score = 0;

        var gameSound = new buzz.sound( game.sound );
        gameSound.play();

        // Fade the background color
        $( 'body' ).stop().animate({
            backgroundColor: game.color
        }, 1000);
        $( '#header').find('a' ).stop().animate({
            color: game.color
        }, 1000);

        refreshPicture(game.img);
        $('#won').addClass( 'hidden' );

        // Build model
        var modelLetters = game.word.split( '|' );

        modelLetters.forEach( function(elem,  i ) {
            var j = i + 1;
            $models.append( '<span id="' + elem + '" class="col-xs-12 col-sm-6 col-md-3 col-lg-3">' + j + '</span>' );
        });

        // Build shuffled letters
        var letters  = game.word.split( '|' ),
            shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 });

        shuffled.forEach(function(element) {
            $letters.append('<span class="draggable col-xs-12 col-sm-6 col-md-3 col-lg-3">' + element + '</span>');
        });

        var modelsSpans = $models.find( 'span' );

        $letters.find( 'span' ).each( function( i ) {
            var top   = 300 * Math.random() + 500,
                left  =  $(modelsSpans[i]).offset().left -50 ,
                angle = ( Math.random() * 30 ) - 10;

            $( this ).css({
                top:  top  + 'px',
                left: left + 'px'
            });

            rotate( this, angle );
        });

        $letters.find( 'span.draggable' ).draggable({
            zIndex: 9999,
            stack: '#letters span'
        });

        $models.find( 'span' ).droppable( {
            accept:     '.draggable',
            hoverClass: 'hover',
            drop: function( e, ui ) {
                var modelLetter      = this.id,
                    droppedLetter = ui.helper.text();

                if ( modelLetter == droppedLetter ) {
                    ui.draggable.animate( {
                        top:     $( this ).position().top,
                        left:     $( this ).position().left
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true);
                    
                    rotate( ui.draggable, 0 );
                    ui.draggable.text(this.innerText + '. ' + droppedLetter);
                    refreshPicture('img/pony.png');
                    
                    score++;
                    
                    if ( score == modelLetters.length ) {
                        winGame();
                    }    
                } else {
                    ui.draggable.draggable( 'option', 'revert', true );
                    
                    errorSound.play();
                    refreshPicture('img/demon.png');
                    
                    setTimeout( function() {
                        ui.draggable.draggable( 'option', 'revert', false );
                    }, 100 );
                }
            }
        });
    }

    function winGame() {
        winSound.play();
        refreshPicture('img/chibi_demon.png');
        $('#won').removeClass( 'hidden' );
    }

    function rotate( el, angle ) {
        $( el ).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    buildGame( idx );

});