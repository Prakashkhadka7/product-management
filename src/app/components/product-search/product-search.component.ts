import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {
  @Output() searchTerm = new EventEmitter<string>();

  search(term: string): void {
    this.searchTerm.emit(term);
  }
}
