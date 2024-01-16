const address = 'http://localhost:3000';
const $content = document.querySelector('.content');

const fetchUrl = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();

    $content.textContent += JSON.stringify(result);
  } catch (error) {
    $content.textContent += error;
    $content.style.color = 'red';
  }
};

fetchUrl(address);
