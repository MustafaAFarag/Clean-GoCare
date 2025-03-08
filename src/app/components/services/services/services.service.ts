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
}
