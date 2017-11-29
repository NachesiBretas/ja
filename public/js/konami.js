// a key map of allowed keys
var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

// the 'official' Konami Code sequence
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length)
      activateCheats();
  } else
    konamiCodePosition = 0;
});

function activateCheats() {
  // var trigger = $("body").find('[data-toggle="modal"]');
  // trigger.click(function () {
  //     var theModal = $(this).data("target"),
  //         videoSRC = 'http://www.youtube.com/embed/7SA_DarPYl8',
  //         videoSRCauto = videoSRC + "?autoplay=1";
  //     $(theModal + ' iframe').attr('src', videoSRCauto);
  //     $(theModal + ' button.close').click(function () {
  //         $(theModal + ' iframe').attr('src', videoSRC);
  //     });
  // });
  var x = Math.floor((Math.random() * 4) + 1);
  switch(x) {
    case 1:
      var audio = new Audio('/img/icons/level/getting_warm/audio/jungle.mp3');
      audio.play();
      alert("Bill: 奴ら・・・ゆるさん\n Lance: 派手に出迎えてやろうぜ！！");
      break;
    case 2:
      var audio = new Audio('/img/icons/level/getting_warm/audio/pizza_time.mp3');
      audio.play();
      alert("My toes!!! My toes!!! Shell Shock");
      break;
    case 3:
      var audio = new Audio('/img/icons/level/getting_warm/audio/belmont.mp3');
      audio.play();
      alert("What is a man? A miserable little pile of secrets. But enough talk… Have at you!");
      break;
    case 4:
      var audio = new Audio('/img/icons/level/getting_warm/audio/riders.mp3');
      audio.play();
      alert("Yahoooo. Bury me with my money. Ahhhhhhhhhh");
      break;
    default:
  }
}