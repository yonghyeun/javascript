const $weatherByTime = document.querySelector('.weather-by-time');
const $itemWrapper = document.querySelector('.item-wrapper');
const makeTimeZone = () => {
  for (let hour = 0; hour < 24; hour += 1) {
    const $timeWrapper = document.createElement('div');
    const $smallTemperature = document.createElement('div');
    const $smallWeatherImg = document.createElement('img');
    const $smallTimeText = document.createElement('div');
    const imgPath = 'images/sunny.png';

    $timeWrapper.classList.add('time-wrapper');
    $smallTemperature.classList.add('small-temperature');
    $smallTimeText.classList.add('small-time-text');
    $smallWeatherImg.classList.add('small-weather-img');

    $smallTemperature.textContent = '-1' + '℃';
    $smallTimeText.textContent = hour < 10 ? `0${hour}` : hour;
    $smallWeatherImg.src = imgPath;

    $timeWrapper.appendChild($smallTemperature);
    $timeWrapper.appendChild($smallWeatherImg);
    $timeWrapper.appendChild($smallTimeText);

    $itemWrapper.appendChild($timeWrapper);
  }
  $weatherByTime.appendChild($itemWrapper);
};

makeTimeZone();

$itemWrapper.style.transform = `translateX(${-15 * 50}px)`;
