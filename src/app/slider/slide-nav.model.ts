import { ElementRef, Renderer2 } from "@angular/core";
import { Slide } from "./slide.model";

export class SlideNav extends Slide {
  prevElement: ElementRef;
  nextElement: ElementRef;
  controlArray: any;
  control: any;

  eventPrevClick: any;
  eventNextClick: any;
  eventControlClick: any;
  eventWrapperChange: any;

  constructor(renderer: Renderer2, slide: ElementRef, wrapper: ElementRef) {
    super(renderer, slide, wrapper);
    this.bindControlEvents();
  }

  addArrow(prev, next): void {
    this.prevElement = prev;
    this.nextElement = next;
    this.addArrowEvent();
  }

  addArrowEvent(): void {
    this.eventPrevClick = this.renderer.listen(
      this.prevElement.nativeElement,
      "click",
      evt => {
        evt.preventDefault();
        this.activePrevSlide(evt);
      }
    );

    this.eventNextClick = this.renderer.listen(
      this.nextElement.nativeElement,
      "click",
      evt => {
        evt.preventDefault();
        this.activeNextSlide(evt);
      }
    );
  }

  createControl(): any {
    const control = this.renderer.createElement("ul");
    control.dataset.control = "slide";
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index +
        1}</a></li>`;
    });
    this.wrapper.nativeElement.appendChild(control);
    return control;
  }

  eventControl(item, index): void {
    this.eventControlClick = this.renderer.listen(
      item.nativeElement,
      "click",
      event => {
        event.preventDefault();
        this.changeSlide(index);
      }
    );
    this.eventWrapperChange = this.renderer.listen(
      this.wrapper.nativeElement,
      "changeEvent",
      evt => {
        evt.preventDefault();
        this.activeControlItem(evt);
      }
    );
  }

  activeControlItem(event): void {
    this.controlArray.forEach(item => item.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl): void {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];

    this.activeControlItem(null);
    this.controlArray.forEach(this.eventControl);
  }

  bindControlEvents(): void {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }

  finalizeNav(): void {
    /* release listeners */
    this.eventPrevClick();
    this.eventNextClick();
    this.eventControlClick();
    this.eventWrapperChange();

    /* call heritage finalize to release all events listeners */
    this.finalize();
  }
}
