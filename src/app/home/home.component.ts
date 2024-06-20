import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allProducts: any = []
  p: number = 1;
  searchKey:string=""

  constructor(private api: ApiService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.api.getAllProduct().subscribe({
      next: (result: any) => {
        this.allProducts = result
        console.log(this.allProducts);
      }
    })
  }

  addToWishlist(product: any) {
    if (sessionStorage.getItem("token")) {
      this.api.addToWishlistapi(product).subscribe({
        next: (result: any) => {
          this.toaster.success(`product ${result.title} has been added to ur wishlist`)
          this.api.getWishlistCount()
        },
        error: (reason: any) => {
          console.log(reason);
          this.toaster.warning(reason.error)

        }
      })
    } else {
      this.toaster.warning("please Login")
    }
  }
  
  addToCart(product: any) {
    if (sessionStorage.getItem("token")) {
      product.quantity = 1
      this.api.addToCartAPI(product).subscribe({
        next: (result: any) => {
          this.toaster.success(result)
          this.api.getCartCount()
        },
        error: (reason: any) => {
          this.toaster.warning(reason.error)
        }
      })
    } else {
      this.toaster.warning("please Login")
    }
  }


}
