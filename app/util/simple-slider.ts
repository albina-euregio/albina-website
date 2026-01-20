type SliderOptions = {
  labels: string[]; //list of labels. ie low, medium...
  initialIndex?: number; //selected index. ie. 0 = low
  interactive?: boolean; //user can change slider
  onChange?: (index: number) => void;
};

/**
 * class for a simple slider. user can pass in options such as lable
 */
export class LabeledSlider {
  private container: HTMLElement;
  private options: SliderOptions;
  private selectedIndex: number;

  constructor(container: HTMLElement, options: SliderOptions) {
    this.container = container;
    this.options = options;
    this.selectedIndex = options.initialIndex ?? 0;

    this.render();
  }

  private render() {
    const { labels } = this.options;

    this.container.innerHTML = "";
    this.container.className = "labeled-slider";

    const track = document.createElement("div");
    track.className = "slider-track";

    const progress = document.createElement("div");
    progress.className = "slider-progress";
    track.appendChild(progress);

    const ticks = document.createElement("div");
    ticks.className = "slider-ticks";

    labels.forEach((label, index) => {
      const tick = document.createElement("div");
      tick.className = "slider-tick";
      tick.dataset.index = index.toString();

      const dot = document.createElement("div");
      dot.className = "slider-dot";

      const text = document.createElement("div");
      text.className = "slider-label";
      text.textContent = label;

      tick.appendChild(dot);
      tick.appendChild(text);
      if (this.options.interactive !== false) {
        tick.addEventListener("click", () => this.setIndex(index));
      }
      ticks.appendChild(tick);
    });

    this.container.appendChild(track);
    this.container.appendChild(ticks);

    this.updateUI();
  }

  private updateUI() {
    const { labels } = this.options;
    const progress = this.container.querySelector(
      ".slider-progress"
    ) as HTMLElement;

    const percentage = (this.selectedIndex / (labels.length - 1)) * 100;
    progress.style.width = `${percentage}%`;

    this.container.querySelectorAll(".slider-tick").forEach(tick => {
      const idx = Number(tick.getAttribute("data-index"));
      tick.classList.toggle("active", idx === this.selectedIndex);
    });
  }

  public setIndex(index: number) {
    this.selectedIndex = index;
    this.updateUI();
    this.options.onChange?.(index);
  }
}
