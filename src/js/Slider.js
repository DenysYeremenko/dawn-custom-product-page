export default () => ({
  skip: 1,
  slider: null,
  active: 1,
  total: null,
  interval: 3000,
  autoplay: false,
  direction: 'right',
  startX: 0,
  endX: 0,
  isAnimating: false,
  isDragging: false,
  swipeThreshold: 50,
  init() {
    this.$nextTick(() => {
      this.total = this.$refs.slider.children.length;
      this.slider = this.$refs.slider;

      this.slider.addEventListener('touchstart', this.touchStart.bind(this));
      this.slider.addEventListener('touchmove', this.touchMove.bind(this));
      this.slider.addEventListener('touchend', this.touchEnd.bind(this));

      this.slider.addEventListener('mousedown', this.mouseStart.bind(this));
      this.slider.addEventListener('mousemove', this.mouseMove.bind(this));
      this.slider.addEventListener('mouseup', this.mouseEnd.bind(this));
      this.slider.addEventListener('mouseleave', this.mouseEnd.bind(this));

      this.slider.addEventListener('dragstart', (e) => e.preventDefault());
      this.slider.addEventListener('dragend', (e) => e.preventDefault());
    });

    if (this.autoplay) {
      this.play();
    }
  },
  next() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.to((current, offset) => current + offset * this.skip);
      this.updateActive(1);
    }
  },
  prev() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.to((current, offset) => current - offset * this.skip);
      this.updateActive(-1);
    }
  },
  to(strategy) {
    let slider = this.$refs.slider;
    let current = slider.scrollLeft;
    let offset = slider.firstElementChild.getBoundingClientRect().width;

    slider.scrollTo({ left: strategy(current, offset), behavior: 'smooth' });

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  },
  updateActive(step) {
    this.active = ((this.active + step + this.total - 1) % this.total) + 1;

    if (this.active === 1) {
      this.slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (this.active === this.total) {
      this.slider.scrollTo({ left: this.slider.scrollWidth - this.slider.clientWidth, behavior: 'smooth' });
    }
  },
  play() {
    let counter = this.active;
    let interval = setInterval(() => {
      if (this.direction === 'right') {
        this.next();
        counter++;
      }
      if (this.direction === 'left') {
        this.prev();
        counter--;
      }
      if (counter == this.total) {
        this.direction = 'left';
      }
      if (counter == 1) {
        this.direction = 'right';
      }
    }, this.interval);
  },
  touchStart(event) {
    this.startX = event.touches[0].clientX;
  },
  touchMove(event) {
    this.endX = event.touches[0].clientX;
  },
  touchEnd() {
    if (this.startX > this.endX + this.swipeThreshold) {
      this.next();
    } else if (this.startX < this.endX - this.swipeThreshold) {
      this.prev();
    }
  },
  mouseStart(event) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.endX = event.clientX;
  },

  mouseMove(event) {
    event.preventDefault();
    if (this.isDragging) {
      this.endX = event.clientX;
    }
  },

  mouseEnd(event) {
    event.preventDefault();
    if (this.isDragging) {
      this.isDragging = false;
      const distance = Math.abs(this.startX - this.endX);
      if (distance >= this.swipeThreshold) {
        if (this.startX > this.endX) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
  },
  focusableWhenVisible: {
    'x-intersect:enter'() {
      this.$el.removeAttribute('tabindex');
    },
    'x-intersect:leave'() {
      this.$el.setAttribute('tabindex', '-1');
    },
  },
});
