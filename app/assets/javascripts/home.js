//
// READY!
//
$(function(){
  // true if there's less than 2 selected
  var can_select_chord = function() {
    if ($('#chord-selector a.selected').length < 2) {
      return true;
    } else {
      return false;
    }
  }

  // display this chord
  var add_to_selected_chords = function(chord) {
    var content = '<h2>' + chord.text() + '</h2>';
    $('#selected-chords div:empty').first().append(content);
  }

  // undisplay this chord
  var remove_from_selected_chords = function(chord) {
    $('#selected-chords div h2').filter(function(){
      return $(this).text() === chord.text()
    }).remove();
  };

  // feedback: can't select this button
  var flash_no_select = function($chord) {
    console.log('FLASH NO SELECT!')
    var oldBG = $chord.css('background-color');
    $chord.animate({
      backgroundColor: "#fcc"
    }, 300).animate({
      backgroundColor: oldBG
    }, 300, function() {
      $(this).removeAttr('style');          
    });
  }

  // click handler for chord buttons
  var toggleChord = function(evt) {
    evt.preventDefault();
    var $chord = $(this);
    if ($chord.hasClass('selected')) {
      $chord.removeClass('selected');
      remove_from_selected_chords($chord);
    } else {
      if ( can_select_chord() ) {
        $chord.addClass('selected');
        // put this in #selected-chords
        add_to_selected_chords($chord);
      } else {
        flash_no_select($chord);
      }
    }
  }

  // click handler for #clear-selections
  var clearSelections = function() {
    $('#chord-selector .selected').each(function(){
      $(this).click();
    });
  };

  // Click handler randomPair() for #random-pair
  var shuffle = function(chords) {
    var curIndex = chords.length, swapIndex, tmp;

    while (curIndex > 1) {
      curIndex -= 1;
      swapIndex = Math.floor(Math.random() * curIndex);
      tmp = chords[swapIndex];
      chords[swapIndex] = chords[curIndex];
      chords[curIndex] = tmp;
    }
  }

  var randomPair = function(e) {
    e.preventDefault();
    clearSelections();
    chords = $('#chord-selector a');
    shuffle(chords);
    chords[0].click();
    chords[1].click();
  }

  // click handler and support for GO! button
  var $modal = $('#minute-timer');

  var loadTimerChords = function() {
    $('#chord-display li:nth-child(1)').text( $('#selected-chords div:nth-child(1)').text() );
    $('#chord-display li:nth-child(2)').text( $('#selected-chords div:nth-child(2)').text() );
  }

  var displayTimer = function() {
    loadTimerChords();
    resetTimer();
    $modal.removeClass('hidden').addClass('modal');
  }

  var hideTimer = function() {
    $modal.removeClass('modal').addClass('hidden');
  }

  var timerHidden = function() {
    return $modal.hasClass('hidden');
  }

  var timerDone = function() {
    $('#piano')[0].play()
  }


  // click handler for start button
  var timeInt;
  var time;
  var $timerDisplay = $('#timer');
  var $piano = $('#piano');
  var timeToPlay = 60;

  // running the timer: display time, count, update display
  var updateTimerDisplay = function() {
    var time_remaining = ':' + ('0' + time).slice(-2);
    $timerDisplay.text(time_remaining);
  };

  var $startTimer = $('#timer-start')[0];

  var resetTimer = function() {
    clearInterval( $('#timer-start')[0].interval );
    $startTimer.interval = false;
    $($startTimer).text('Start');
    resetTimeRemaining();
    updateTimerDisplay();
  }

  var resetTimeRemaining = function() {
    time = timeToPlay;
  }

  var startCountdown = function() {
    var cd_t = 3;
    $startTimer.interval = setInterval(function() {
      $timerDisplay.addClass("red");
      if (cd_t > 0) {
        $timerDisplay.text(':0' + cd_t);
        cd_t--;
      } else {
        clearInterval( $startTimer.interval );
        $timerDisplay.removeClass("red");
        $timerDisplay.text('Go!');
        startCountUp();
      }
    }, 1000);
  }

  var startCountUp = function() {
      $startTimer.interval = setInterval(function(){
        // tic tic...
        time--;
        updateTimerDisplay();

        if (time <= 0) {
          clearInterval( $startTimer.interval );

          timerDone();
          $($startTimer).text('Complete');
          $startTimer.interval = 'complete';

        }
      }, 1000);
  }

  var runTimer = function() {
    if ( $startTimer.interval != false ) { 
      if ($startTimer.interval === 'complete') {
        resetTimer();
      } else {
        clearInterval($startTimer.interval);
        $($startTimer).text('Start');
        $startTimer.interval = false;
      }
    } else {
      $($startTimer).text('Stop');
      startCountdown();
    }
  }

  var chords = [
    'A', 'Am', 'A7',
    'B', 'Bm', 'B7',
    'C', 'C7',
    'D', 'Dm', 'D7',
    'E', 'Em', 'E7', 'E7hD',
    'F', 'Fm', 'Fmaj7',
    'G', 'G7'
  ];

  // setup chord buttons
  $chordSelector = $('#chord-selector');

  $.each(chords, function(i, chord_name){
    // make the link
    var $chord = $('<a href="#">' + chord_name + '</a>');
    $chord.click(toggleChord);
    // add it to a list item
    var $item = $('<li></li>');
    $item.append($chord);
    // append to #chord-selector
    $chordSelector.append($item);
  });

  // setup clear buttons
  $clearButton = $('#clear-selections');
  $clearButton.click(clearSelections);

  // setup random button
  $randomButton = $('#random-pair');
  $randomButton.click(randomPair);

  // setup GO button
  $goButton = $('#display-timer');
  $goButton.click(displayTimer);

  // setup Close button
  $closeButton = $('.close');
  $closeButton.click(hideTimer);

  // setup start button
  $startButton = $('#timer-start');
  $startButton.click(runTimer);

  // setup reset button
  $resetButton = $('#timer-reset');
  $resetButton.click(resetTimer);
});
