import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { HighlightDirective } from '../../shared/pipes/highlight.directive';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductSearchComponent,
    CurrencyFormatPipe,
    HighlightDirective,
    HttpClientModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>; 
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService,private snackBarService: SnackbarService) {}

  ngOnInit(): void {
    this.products$ = this.searchTerms.pipe(
      startWith(''), // Emit an initial empty search term to fetch all products initially
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.productService.searchProducts(term).pipe(
          catchError(error => {
            console.error('Error fetching products:', error);
            this.snackBarService.openSnackBar('Error fetching products. Please try again later.', false);
            return of([]); // Return an empty array on error
          })
        )
      )
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  deleteProduct(event: Event, id: number): void {
    event.stopPropagation();
    event.preventDefault()
    this.productService.deleteProduct(id).pipe(
      catchError(error => {
        this.snackBarService.openSnackBar('Error deleting product. Please try again later.', false);
        return of(null); // Return a null observable to complete the stream
      })
    ).subscribe(result => {
      if (result !== null) {
        this.snackBarService.openSnackBar('Product deleted successfully', true);
        // Refreshing  the product list if deletion was successful
        this.products$ = this.productService.getProducts();
      }
    });
  }
}
