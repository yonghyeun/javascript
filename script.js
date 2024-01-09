function spinWheel() {
  const numPeople = prompt('Enter the number of people:');
  const roulette = document.getElementById('roulette');

  // Clear existing sections
  roulette.innerHTML = '';

  // Calculate angle for each section
  const sectionAngle = 360 / numPeople;

  for (let i = 0; i < numPeople; i++) {
    const section = document.createElement('div');
    section.className = 'section';
    section.style.background = getRandomColor();

    const number = document.createElement('span');
    number.className = 'number';
    number.textContent = i + 1;
    number.style.color = getContrastColor(section.style.background);

    section.appendChild(number);
    roulette.appendChild(section);

    // Rotate each section to create a pie-like effect
    const rotateValue = sectionAngle * i;
    section.style.transform = `rotate(${rotateValue}deg) skewY(${sectionAngle}deg)`;
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getContrastColor(hexColor) {
  const threshold = 130;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > threshold ? '#000' : '#FFF';
}
