class Cards {
  constructor() {
    this.wrapper = document.querySelector('.card-wrapper');
    this.setup();
  }

  setup() {
    this.current = this.wrapper.lastElementChild;
    if (!this.cardWidth) this.cardWidth = this.current.clientWidth;
    this.initialCoord = { initX: 0, initY: 0 };
    this.offset = { X: 0, Y: 0 };

    const cardSetup = (event) => {
      const { current } = this;
      this.initialCoord = { initX: event.clientX, initY: event.clientY };

      const cardMove = (event) => {
        const { initX, initY } = this.initialCoord;
        this.offset = {
          X: event.clientX - initX,
          Y: event.clientY - initY,
        };
        const { offset, cardWidth } = this;

        const likeShadow = offset.X > 0 ? '#a81d3e' : '#aaa';
        const alpha = 5;
        const likeRot = (offset.X / cardWidth) * alpha;

        current.style.transform = `translate3D(${offset.X}px ,${offset.Y}px , 10px)
        rotate(${likeRot}deg)`;
        current.style.boxShadow = `0px 0px 50px 50px ${likeShadow};`;
      };

      const cardLeave = () => {
        const { cardWidth, offset } = this;
        const delay = 1000;

        if (Math.abs(offset.X) < cardWidth) {
          current.style.transition = `all ${delay}ms`;
          setTimeout(() => {
            current.style.transition = 'all 0s';
          }, delay * 0.9);

          current.style.transform = 'translate3D(0px,0px,0px)';
        } else {
          console.log('event!');
          current.style.transition = `all ${delay}ms`;
          setTimeout(() => {
            current.style.transition = 'all 0s';
            this.wrapper.removeChild(current);
            this.setup();
          }, delay * 0.5);
          current.style.transform = `translate3D(${offset.X * 5}px,${
            offset.Y * 5
          }px,0px)`;
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
