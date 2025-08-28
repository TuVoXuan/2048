export class FixedSizeStack<T> {
  private items: T[];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.items = [];
  }

  push(item: T) {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift(); // Remove first (oldest) item
    }
    return this.items.length;
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  get length() {
    return this.items.length;
  }

  get value() {
    return this.items;
  }
}
