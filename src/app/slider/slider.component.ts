import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { SlideItem } from "./slide-item.model";
import { SlideNav } from "./slide-nav.model";

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.css"]
})
export class SliderComponent implements AfterViewInit {
  @ViewChild("slideWrapper", { static: true, read: ElementRef })
  slideWrapper: ElementRef;

  @ViewChild("slideContainer", { static: true, read: ElementRef })
  slideContainer: ElementRef;

  items: SlideItem[] = [
    {
      src: "assets/card-ok.png",
      title: "Slide 1"
    },
    {
      src: "assets/card-ok.png",
      title: "Slide 2"
    },
    {
      src: "assets/card-ok.png",
      title: "Slide 3"
    },
    {
      src: "assets/card-ok.png",
      title: "Slide 4"
    },
    {
      src: "assets/card-ok.png",
      title: "Slide 5"
    },
    {
      src: "assets/card-ok.png",
      title: "Slide 6"
    }
  ];

  slide: SlideNav;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.slide = new SlideNav(
      this.renderer,
      this.slideWrapper,
      this.slideContainer
    );
    this.slide.init();
  }
}
