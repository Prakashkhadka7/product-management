import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {
  productForm: FormGroup;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBarService: SnackbarService
  ) {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe(
      (product:any) => this.productForm.patchValue(product),
      (error:any) => console.error('Error loading product', error)
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        id: this.productId ?? 0
      };

      if (this.productId) {
        this.productService.updateProduct(product).subscribe(
          () => {
            this.snackBarService.openSnackBar('Product updated successfully', true);
            this.router.navigate(['/products'])},
          (error:any) => {
            this.snackBarService.openSnackBar('Error updating product. Please try again later.', false);
          }
        );
      } else {
        this.productService.addProduct(product).subscribe(
          () => this.router.navigate(['/products']),
          (error:any) => {
            console.error('Error adding product', error);
            this.snackBarService.openSnackBar('Error adding product. Please try again later.', false);
          }
        );
      }
    }
  }
}
