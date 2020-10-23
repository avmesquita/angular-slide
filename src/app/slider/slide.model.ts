import { ElementRef, Renderer2 } from "@angular/core";

export class Slide {
  slide: ElementRef;
  wrapper: ElementRef;
  dist: any;
  activeClass = "";
  changeEvent: Event;
  index: any;
  slideArray: any;
  renderer: Renderer2;

  /* Pointer to event To destroy On finalize */
  eventWrapperMouseDown: any;
  eventWrapperTouchStart: any;
  eventWrapperMouseUp: any;
  eventWrapperTouchEnd: any;
  eventWrapperOnStartClick: any;
  eventWrapperOnMove: any;
  eventWindowResize: any;

  constructor(
    renderer: Renderer2,
    slideParam: ElementRef,
    wrapperParam: ElementRef
  ) {
    this.slide = slideParam;
    this.wrapper = wrapperParam;
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "active";
    this.changeEvent = new Event("changeEvent");
    this.renderer = renderer;
  }

  transition(active): void {
    this.slide.nativeElement.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX): void {
    this.dist.movePosition = distX;
    this.slide.nativeElement.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX): number {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event: any): void {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.eventWrapperOnMove = this.renderer.listen(
      this.wrapper.nativeElement,
      movetype,
      evt => {
        event.preventDefault();
        this.onMove(evt);
      }
    );
    this.transition(false);
  }

  onMove(event): void {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event): void {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.eventWrapperOnMove();
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd(event);
  }

  changeSlideOnEnd(event): void {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide(null);
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide(null);
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents(): void {
    this.eventWrapperMouseDown = this.renderer.listen(
      this.wrapper.nativeElement,
      "mousedown",
      evt => {
        evt.preventDefault();
        this.onStart(evt);
      }
    );

    this.eventWrapperTouchStart = this.renderer.listen(
      this.wrapper.nativeElement,
      "touchstart",
      evt => {
        evt.preventDefault();
        this.onStart(evt);
      }
    );

    this.eventWrapperMouseUp = this.renderer.listen(
      this.wrapper.nativeElement,
      "mouseup",
      evt => {
        evt.preventDefault();
        this.onEnd(evt);
      }
    );

    this.eventWrapperTouchEnd = this.renderer.listen(
      this.wrapper.nativeElement,
      "touchend",
      evt => {
        evt.preventDefault();
        this.onEnd(evt);
      }
    );
  }

  /* Slides config */
  slidePosition(slide): number {
    const margin =
      (this.wrapper.nativeElement.offsetWidth - slide.offsetWidth) / 10;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig(): any {
    this.slideArray = [...this.slide.nativeElement.children].map(element => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slidesIndexNav(index): void {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    };
  }

  changeSlide(index: number): void {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.wrapper.nativeElement.dispatchEvent(this.changeEvent);
  }

  changeActiveClass(): void {
    this.slideArray.forEach(item =>
      item.element.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide(event): void {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide(event): void {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize(event: any): void {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent(): void {
    this.eventWindowResize = this.renderer.listen(window, "resize", evt => {
      evt.preventDefault();
      this.onResize(evt);
    });
  }

  bindEvents(): void {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);

    this.onResize = this.debounce(this.onResize.bind(this), 200);
  }

  init(): any {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }

  debounce(callback, delay): any {
    let timer;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback(...args);
        timer = null;
      }, delay);
    };
  }

  finalize(): void {
    /* release all event listeners */
    this.eventWrapperMouseDown();
    this.eventWrapperTouchStart();
    this.eventWrapperMouseUp();
    this.eventWrapperTouchEnd();
    this.eventWrapperOnStartClick();
    this.eventWrapperOnMove();
    this.eventWindowResize();
  }
}
