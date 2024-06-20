import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username:string = ""
  wishlistCount:number = 0
  cartCount:number = 0
  // searchKey:string=""
  
  constructor(private api:ApiService,private router:Router){}
  
    ngOnInit(): void {
      if(sessionStorage.getItem("user")){
        this.username =JSON.parse(sessionStorage.getItem("user")|| "").username.split(" ")[0]
        this.api.wishlistCount.subscribe((res:any)=>{
          this.wishlistCount = res
        })
        this.api.cartCount.subscribe((res:any)=>{
          this.cartCount = res
        })
      }else{
        this.username = ""
      }
    }

    logOut(){
      sessionStorage.clear()
      this.username = ""
      this.wishlistCount = 0
      this.router.navigateByUrl("/")
    }
}
