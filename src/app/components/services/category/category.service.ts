import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl =
    "https://gocare-back-develop.salonspace1.com/api/services/WebApp/ProductCategory/SearchAll";

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
