// Jamie McGowan 2018

// Uses howler.js

// TODO 


// Store all sound object
var sounds = {};

// Store sound settings; stored when fave button is clicked
// Stored as dict; key = sound name; value = [playing?, volume]
var sound_settings = {};

var volumes = {}
var muted = false;

$(document).ready(function() {
    loadSounds();
    loadFavorite();

    // Initialise dropdowns and modals
    $('.dropdown-trigger').dropdown();
    $('.modal').modal();

    $(".button-play").click(function() {
		var sound = $(this).data("sound");
		var child = $(this).children()[0];

		// Play or pause sound and change FAB icon
		if (sounds[sound].playing()) {
			sounds[sound].pause();
			$(child).text("play_arrow");
		}
		else {
			sounds[sound].play("main");
			$(child).text("pause");
		}
    });

    $(".volume-slider").change(function() {
        if(!muted) {
            var sound = $(this).data("sound");
            sounds[sound].volume(($(this).val() / 100));
        }
    });

    $("#favorite-button").click(function() {
        for(var sound in sounds) {
            sound_settings[sound] = [sounds[sound].playing(), ($('input[data-sound="' + sound + '"]')[0].value / 100)];
        }

        saveFavorite();
        M.toast({html: "Current settings saved as favorite"})
    });

    // Randomly select sounds and volume to play at
    $("#shuffle-button").click(function() {
        selected = [];
        
        unmute();

        // Randomly select at least 2 sounds
        while(selected.length < 2) {
            selected = randomlySelectSounds();
        }

        // First, reset all volumes to 100% and stop playing
        for(var sound in sounds) {
            sounds[sound].volume(1);
            $('input[data-sound="' + sound + '"]')[0].value = (100);
            
            sounds[sound].pause();
            $($($('a[data-sound="' + sound + '"]')[0]).children()[0]).text("play_arrow");
        }

        // Play sounds and randomly choose volume (between 25 and 100%)
        for(var sound in selected) {
            randomVolume = Math.random() * (100 - 25) + 25;

            sounds[selected[sound]].volume(randomVolume / 100);
            $('input[data-sound="' + selected[sound] + '"]')[0].value = (randomVolume);

            sounds[selected[sound]].play("main");
            $($($('a[data-sound="' + selected[sound] + '"]')[0]).children()[0]).text("pause");
        }
    });

    $("#mute-button").click(function() {
        if(muted) {
            unmute();
        }
        else {
            mute();
        }
    })

    $("#about-button").click(function() {

    })
})

var loadSounds = function() {
    var rain = new Howl({src: ["./audio/Rain.aac"], loop: true, sprite: {main: [100, 32000, true]}});
    var thunder = new Howl({src: ["./audio/Thunder.aac"], loop: true, sprite: {main: [100, 33500, true]}});
    var wind = new Howl({src: ["./audio/Wind.aac"], loop: true, sprite: {main: [100, 33000, true]}});
    var fire = new Howl({src: ["./audio/Fire.aac"], loop: true, sprite: {main: [100, 32000, true]}});

    var white_noise = new Howl({src: ["./audio/White_noise.aac"], loop: true, sprite: {main: [100, 32000, true]}});
    var grey_noise = new Howl({src: ["./audio/Grey_noise.aac"], loop: true, sprite: {main: [100, 32000, true]}});
    var pink_noise = new Howl({src: ["./audio/Pink_noise.aac"], loop: true, sprite: {main: [100, 32000, true]}});
    var brown_noise = new Howl({src: ["./audio/Brown_noise.aac"], loop: true, sprite: {main: [100, 32000, true]}});

    sounds["rain"] = rain;
    sounds["thunder"] = thunder;
    sounds["wind"] = wind;
    sounds["fire"] = fire;

    sounds["white-noise"] = white_noise;
    sounds["grey-noise"] = grey_noise;
    sounds["pink-noise"] = pink_noise;
    sounds["brown-noise"] = brown_noise;
}

// Randomly select sounds to play
var randomlySelectSounds = function () {
    selected = [];
    
    for(var sound in sounds) {
        toPlay = Math.round(Math.random());

        if(toPlay == 1) {
            selected.push(sound);
        }
    }

    return selected;
}

var saveFavorite = function() {
    var cookie = "sounds=" + JSON.stringify(sound_settings);
    document.cookie = cookie;
}

var loadFavorite = function() {
    sound_settings = read_cookie("sounds");

    for(var sound in sound_settings) {
        // Set volume to that saved in cookies; update slider to reflect this
        sounds[sound].volume(sound_settings[sound][1]);
        $('input[data-sound="' + sound + '"]')[0].value = (sound_settings[sound][1] * 100);

        // Play sound if it was playing in fave settings; update play button to reflect this
        if (sound_settings[sound][0] == true) {
            sounds[sound].play("main");
            $($($('a[data-sound="' + sound + '"]')[0]).children()[0]).text("pause");
        }
    }
    
}

// Mute (fade out) and change icon
var mute = function() {
    muted = true;
    $($($("#mute-button")).children()[0]).text("volume_off");

    for(var sound in sounds) {
        sounds[sound].fade(sounds[sound].volume(), 0.0, 1500);
    }
}

// Unmute (fade in) and change icon
var unmute = function() {
    muted = false;
    $($($("#mute-button")).children()[0]).text("volume_up");

    for(var sound in sounds) {
        sounds[sound].fade(0, ($('input[data-sound="' + sound + '"]')[0].value / 100), 1500);
    }
}

function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}
