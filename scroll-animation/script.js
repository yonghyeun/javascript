// 배너 객체 생성

class BannerTag {
  constructor() {
    this.count = 0;
  }

  setTag(identifier) {
    this.tag = document.querySelector(identifier);
    return this;
  }

  setTextArray(text) {
    // textArr 는 설정된 text 의 두 배를 넣기
    this.textArray = text.split(' ');
    this.textArray.push(...this.textArray);
    return this;
  }

  setDirection(direction) {
    if (direction === -1) {
      // 배너의 이동 방향이 반대라면 해당 배너를 좌측으로 옮겨줘야 한다.
      this.tag.style.left = '-100%';
    }
    this.direction = direction;
    return this;
  }

  setTextContent() {
    this.tag.textContent = this.textArray.join('\u00A0\u00A0\u00A0\u00A0');
    return this;
  }

  marqueeText() {
    const MARGIN = 2000;
    const isScrollHalf = this.count + MARGIN > this.tag.scrollWidth / 2;

    if (isScrollHalf) {
      this.count = 0;
      this.tag.style.transform = 'translateX(0px)';
      return this.count;
    }
    this.tag.style.transform = `translateX(${-this.count * this.direction}px)`;
    return this.count;
  }

  animate() {
    this.count += 1;
    this.count = this.marqueeText();

    requestAnimationFrame(this.animate.bind(this));
  }
}

const $banner1 = new BannerTag()
  .setTag('.first-banner')
  .setTextArray(
    'Yummy Tasty Delicious Useful Coding Yummy Yummmmy Yummmmmmmmmy yum',
  )
  .setDirection(1)
  .setTextContent();

const $banner2 = new BannerTag()
  .setTag('.second-banner')
  .setTextArray(
    'Chicken Hamburger Pizza Salad Sushi Bibimbab Gimbab JJajangmyeon JJambbong',
  )
  .setDirection(-1)
  .setTextContent();

$banner1.animate();
$banner2.animate();

window.addEventListener('scroll', () => {
  $banner1.count += 15;
  $banner2.count += 15;
});
