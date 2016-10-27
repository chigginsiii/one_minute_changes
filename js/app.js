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

var clearSelections = function() {
  $('#chord-selector .selected').each(function(){
    $(this).click();
  });
};

var shuffle = function(chords) {
  var curIndex = chords.length, swapIndex, tmp;

  while (curIndex > 1) {
    curIndex -= 1;
    swapIndex = Math.floor(Math.random() * curIndex);

    console.log('swapping ' + curIndex + ' with ' + swapIndex);

    tmp = chords[swapIndex];
    chords[swapIndex] = chords[curIndex];
    chords[curIndex] = tmp;
  }
  return chords;
}

var randomPair = function() {
  clearSelections();
  chords = $('#chord-selector a');
  shuffle(chords);

  console.log(chords);

  chords[0].click();
  chords[1].click();
}

$(function(){
  // A Am A7 B B7 C C7 D Dm D7 E Em E7 E7highD F Fmaj7 G G7
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
});
