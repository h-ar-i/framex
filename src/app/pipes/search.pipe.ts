import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allProducts:any[],searchTerm:string): any {
    const result:any = []
    if(!allProducts || !searchTerm){
      return allProducts
    }
    allProducts.forEach((item:any)=>{
      if(item['title'].toLowerCase().includes(searchTerm.toLowerCase())){
        result.push(item)
      }
    })
    return result;
  }

}
