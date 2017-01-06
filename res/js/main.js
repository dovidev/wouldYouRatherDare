var players = [];
var curr_player_idx;
var curr_page;
var audio = {};
var game_options = {};
var default_game_options = {
    strikes      : 1
   ,final_dare   : 'Call the mayor and tell them that you are now King of the Wusses. You may leave a message if nobody answers.'
   ,player_count : 3
};


class Player {
    constructor(name) {
        this.name = name;
        this.strikes = 0;
    }
}

function getGameOption(k) {
    console.log('getGameOption('+k+')');
    if (!game_options) {
        game_options = getGameOptions();
    }
    console.log(game_options);
    return game_options[k];
}
function getGameOptions() {
    console.log('getGameOptions()');
    console.log(game_options);
    var gos = {};
    var gos_str = "";
    if (localStorage.getItem("game_options")) {
        console.log("we've got a saved copy");
        gos_str = localStorage.getItem("game_options");
        console.log('gos_str: ' + gos_str);
        if (gos_str && gos_str !== 'undefined') {
            gos = JSON.parse(gos_str);
        }
        game_options = gos;
    }
    else {
        gos = default_game_options;
        setGameOptions(gos);
    }
    return gos;
}
function setGameOptions(gos) {
    console.log('setGameOptions()');
    console.log(gos);
    console.log(game_options);
    game_options = gos;
    var game_options_str = JSON.stringify(game_options);
    localStorage.setItem('game_options', game_options_str);
}
function setGameOption(k, v) {
    if (!game_options.length) {
        game_options = getGameOptions();
    }
    game_options[k] = v;
    setGameOptions(game_options);
}

function playSound(filename, repeat){
    audio[filename] = new Audio(filename);
    audio[filename].loop = !!repeat;
    audio[filename].play();
}
function wussOut() {
    players[curr_player_idx].strikes++;
    if (players[curr_player_idx].strikes >= getGameOption('strikes')) {
        playSound('res/audio/fanfare.mp3');
        App.dialog(
            {
                title        : "Hail, the king of the wusses?",
                text         : "As the loser, you must " + getGameOption('final_dare'),
                okButton     : "Ok",
            }
           ,function (still_wuss) {
                App.load('home');
            }
        );
    }
}
function updateScoreboard() {
    var sb = $(curr_page).find('.scoreboard tbody');
    sb.html('');
    
    console.log(sb);
    for (var i = 0; i < players.length; i++) {
        console.log(players[i].name);
        console.log($(curr_page).find('.player-'+i));
        if (!$(curr_page).find('.player-'+i).length) {
            sb.append('<tr class="player-'+i+'"><th>'+players[i].name+'</th></tr>');
            for (var x = 0; x < getGameOption('strikes'); x++) {
                $(curr_page).find('.player-'+i).append('<td class="strike strike-'+x+'"></td>');
            }
        }
        
        console.log($(curr_page).find('.player-'+i+' td'));
        $(curr_page).find('.player-'+i+' td').html('');
        for (var x = 0; x < getGameOption('strikes'); x++) {
            if (players[i].strikes > x) {
                $(curr_page).find('.player-'+i+' td.strike-'+x).addClass('struck');                
            }
        }        
    }
}

function nextPlayer() {
    console.log('next_player');
    updateScoreboard();
    if (curr_player_idx !== undefined) {
        curr_player_idx = (curr_player_idx + 1) % players.length;
    }
    else {
        curr_player_idx = Math.floor(Math.random() * players.length);
    }
    // put stuff here
    dares = shuffle(dares);
    
    var dare1 = dares[0];
    var dare2 = dares[1];
    
    console.log($(curr_page));
    console.log($(curr_page).find('.dare1'));
    console.log($(curr_page).find('.dare2'));
    console.log($(curr_page).find('.player-name'));
    $(curr_page).find('.dare1').html(dare1);
    $(curr_page).find('.dare2').html(dare2);
    $(curr_page).find('.player-name').html(players[curr_player_idx].name);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

try {
    App.restore();
} 
catch (err) {
    App.load('home');
}
