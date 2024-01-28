class Cards {
  constructor() {
    this.wrapper = document.querySelector('.card-wrapper');
    this.halfArea = this.wrapper.clientWidth / 2;
    this.setup();
  }

  setup() {
    this.current = this.wrapper.lastElementChild;
    this.initialCoord = { initX: 0, initY: 0 };
    this.moveCoord = { moveX: 0, moveY: 0 };
    this.offset = { X: 0, Y: 0 };

    if (!this.cardWidth) this.cardWidth = this.current.clientWidth;

    const cardSetup = (event) => {
      const { current } = this;
      this.initialCoord = { initX: event.clientX, initY: event.clientY };

      const cardMove = (event) => {
        this.moveCoord = { moveX: event.clientX, moveY: event.clientY };
        const { halfArea } = this;
        const { moveX, moveY } = this.moveCoord;
        const { initX, initY } = this.initialCoord;
        this.offset = { offsetX: moveX - initX, offsetY: moveY - initY };
        const { offsetX, offsetY } = this.offset;

        const likeShadow = offsetX > 0 ? '#a81d3e' : '#aaa';
        const alpha = 5;
        const likeRot = (offsetX / halfArea) * alpha;

        current.style.transform = `translate3D(${offsetX}px ,${offsetY}px , 10px)
        rotate(${likeRot}deg)`;
        current.style.boxShadow = `0px 0px 50px 50px ${likeShadow};`;
      };

      const cardLeave = () => {
        const { cardWidth } = this;
        const { offsetX } = this.offset;
        const delay = 1000;
        if (Math.abs(offsetX) < cardWidth) {
          setTimeout(() => {
            current.style.transition = 'all 0s';
          }, delay * 0.9);
          current.style.transition = `all ${delay}ms`;
          current.style.transform = 'translate3D(0px,0px,0px)';
        }

        current.removeEventListener('pointerup', cardLeave);
        current.removeEventListener('pointermove', cardMove);
        current.removeEventListener('pointerleave', cardLeave);
      };

      current.addEventListener('pointermove', cardMove);
      current.addEventListener('pointerleave', cardLeave);
      current.addEventListener('pointerup', cardLeave);
    };

    this.current.addEventListener('pointerdown', cardSetup);
  }
}

new Cards();
