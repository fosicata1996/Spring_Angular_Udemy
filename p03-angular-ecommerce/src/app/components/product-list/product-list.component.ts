import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit
{

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
              private route: ActivatedRoute)
  {
  }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts()
  {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode)
    {
      this.handleSearchProducts();
    }
    else
    {
      this.handleListProducts();
    }
  }

  handleListProducts()
  {
    // check if "id" parameter is available
    if (this.route.snapshot.paramMap.has('id'))
    {
      // get the "id" param string. Convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else
    {
      this.currentCategoryId = 1;
    }

    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  private handleSearchProducts()
  {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // now we search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
