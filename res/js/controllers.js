App.controller('home', function (page) {
    // put stuff here
    $(page).find('.try-me').on('click', function(){
        console.log('clicked');
    });
});

App.controller('game', function (page) {
    curr_page = page;
    nextPlayer();
    $(page).find('.rather-not').on('click', function(){
        App.dialog(
            {
                title        : "Are you sure?",
                // text         : "This game is a lot more fun if you have a little bit of guts.",
                text         : "If you wuss out on this one, you'll get {the next letter}",
                okButton     : "Still a Wuss",
                cancelButton : "Maybe I'm Not",
            }
           ,function (still_wuss) {
                if (still_wuss) {
                    wussOut();
                    nextPlayer();
                }
            }
        );
    });
    $(page).find('.dare1,.dare2').on('click', function(){
        var dare_idx = $(this).data('idx');
        var dare = dares[dare_idx];
        App.dialog(
            {
                text         : dare,
                okButton     : "I did it!",
                cancelButton : "I wussed out",
            }
           ,function (success) {
                if (!success) {
                    wussOut();
                }
                nextPlayer();
            }
        );
    });
});

App.controller('setup', function(page) {
    gos = getGameOptions();
    console.log('controller: game_options');
    console.log(gos);
    for (var k in gos) {
        var v = gos[k];
        console.log(k + ': ' + v);
        console.log('#go-' + k);
        $(page).find('#go-' + k + '[type="number"]').val(v);
        $(page).find('#go-' + k + '[type="text"]').val(v);
        $(page).find('textarea#go-' + k).html(v);
    }
    $(page).find('textarea.app-input').on('keyup', function(){
        console.log('saving game options...');
        setGameOption($(this).attr('name'), $(this).val());
    });
    $(page).find('.app-input[type="number"]').on('click', function(){
        console.log('saving game options...');
        setGameOption($(this).attr('name'), $(this).val());
    });
});
App.controller('names', function(page) {
    var player_count = getGameOption('player_count');
    var names = default_names.slice(0);
    
    for (var i = 0; i < player_count; i++) {
        var random_idx = Math.floor(Math.random() * names.length);
        var nickname = names[random_idx];
        names.splice(random_idx, 1);
        console.log(nickname);
        if (!(players[i] && players[i].name)) {
            players[i] = new Player(nickname);
        }
    }
    for (var i = 0; i < players.length; i++) {
        $(page).find('.names').append('<div class="app-section name">'
                                     +'<label for="name-'+i+'">Player '+(i+1)+'</label>'
                                     +'<input type="text" data-pid="'+i+'" class="app-input" id="name-'+i+'" name="name-'+i+'" value="'+players[i].name+'" />'
                                     +'</div>');
    }
    $(page).find('.names input').on('keyup', function(){
        players[$(this).data('pid')].name = $(this).val();
    });
});