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

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;

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

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous, then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId)
    {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  processResult()
  {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
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

  updatePageSize(pageSize: number)
  {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
