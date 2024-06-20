import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import jspdf from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  yourCart: any = []
  cartTotalPrice:number = 0
  couponStatus:boolean = false
  couponClickStatus:boolean = false

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("token")) {
      this.getCartItems()
    }
  }

  getCartItems() {
    this.api.getCartApi().subscribe((result: any) => {
      this.yourCart = result
      this.getCartTotal()
    })
  }

  getCartTotal(){
    this.cartTotalPrice = Math.ceil(this.yourCart.map((item:any)=>item.totalPrice).reduce(((p1:any,p2:any)=>p1+p2)))
  }

  removeItem(id:any){
    this.api.removeCartItemApi(id).subscribe({
      next:(result:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason.error);
        
      }
    })
  }

  incrementCart(id:any){
    this.api.getIncrementCartApi(id).subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason);
        
      }
    })
  }

  decrementCart(id:any){
    this.api.getDecrementCartApi(id).subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
      },
      error:(reason:any)=>{
        console.log(reason);
        
      }
    })
  }
  
  emptyCart(){
    this.api.emptyCartApi().subscribe({
      next:(res:any)=>{
        this.getCartItems()
        this.api.getCartCount()
        this.router.navigateByUrl("")
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  getCoupon(){
    this.couponStatus = true
  }

  backToOfferBtn(){
    this.couponStatus = false
  }

  tenOff(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.05)
    this.cartTotalPrice -= discount
  }

  twentyFiveOff(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.2)
    this.cartTotalPrice -= discount
  }

  fiftyOff(){
    this.couponClickStatus = true
    let discount = Math.ceil(this.cartTotalPrice*.5)
    this.cartTotalPrice -= discount
  }

  checkOut(){
    sessionStorage.setItem("cartTotal",JSON.stringify(this.cartTotalPrice))
    this.router.navigateByUrl("checkout")
  }

  generatePDF(){
    let pdf = new jspdf()
    let head = [['ID','NAME','PRICE']]
    let body:any = []
    this.yourCart.forEach((item:any)=>{
      body.push([item.id,item.title,item.totalPrice])
    })
    pdf.setFontSize(30)
    pdf.text("All item List",20,10)
    autoTable(pdf,{head,body})
    pdf.output('dataurlnewwindow')
    pdf.save('frame-list.pdf')
  }  

}
