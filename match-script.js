var studentPanels = document.querySelectorAll('.student-panel');
var prevButton = document.getElementById('prevButton');
var nextButton = document.getElementById('nextButton');
var currentIndex = 0;

function showPanel(index) {
  if (index < 0) {
    currentIndex = studentPanels.length - 1;
  } else if (index >= studentPanels.length) {
    currentIndex = 0;
  }

  studentPanels.forEach(function(panel) {
    panel.style.display = 'none';
  });

  studentPanels[currentIndex].style.display = 'block';
}

function showNextPanel() {
  currentIndex++;
  showPanel(currentIndex);
}

function showPreviousPanel() {
  currentIndex--;
  showPanel(currentIndex);
}

showPanel(currentIndex);
