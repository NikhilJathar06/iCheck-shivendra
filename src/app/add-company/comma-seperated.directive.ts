import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCommaSeperated]'
})
export class CommaSeperatedDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = this.el.nativeElement;
    const value = input.value;
    const formattedValue = this.addCommasToNumber(value);
    if (formattedValue !== value) {
      input.value = formattedValue;
      input.dispatchEvent(new Event('input')); // trigger input event to update FormControl value
    }
  }

  addCommasToNumber(value: string): string {
    const number = Number(value.replace(/,/g, ''));
    if (isNaN(number)) {
      return value;
    }
    const formattedNumber = number.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return formattedNumber;
  }

}
