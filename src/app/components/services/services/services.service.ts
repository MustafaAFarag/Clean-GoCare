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

  // CATEGORY API
  getCategories(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${ApiEndPoint.allCategoriesApi}`
    );
  }

  // Product API
  getAllProductVariantsForClient(
    filters: {
      pageNumber?: number;
      pageSize?: number;
      countryId?: number;
      gender?: number[];
      categoryId?: number[];
      subCategoryId?: number[];
      subSubCategoryId?: number[];
      brandId?: number[];
      sortBy?: number;
    } = {}
  ): Observable<any> {
    const body = {
      paging: {
        pageNumber: filters.pageNumber ?? 1,
        pageSize: filters.pageSize ?? 10,
      },
      categoryId: filters.categoryId ?? [],
      subCategoryId: filters.subCategoryId ?? [],
      subSubCategoryId: filters.subSubCategoryId ?? [],
      countryId: filters.countryId ?? 224,
      brandId: filters.brandId ?? [],
      gender: filters.gender ?? [0, 1],
      sortBy: filters.sortBy ?? 0,
    };

    return this.http.post<any>(
      `${environment.apiUrl}/${ApiEndPoint.getAllProductVariantsForClient}`,
      body
    );
  }

  getProductDetails() {
    return this.http.get(
      "https://run.mocky.io/v3/fc56610e-2030-4bdc-b5ad-676bb853397a"
    );
  }
}
