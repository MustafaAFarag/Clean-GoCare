import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { ApiEndPoint } from "../../../shared/constants/apis.constant";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${ApiEndPoint.allCategoriesApi}`
    );
  }
}
