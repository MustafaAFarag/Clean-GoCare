import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { categorySlider } from "../../../data/owl-carousel";
import { Category } from "../../../interface/category.interface";
import { ButtonComponent } from "../button/button.component";
import { NoDataComponent } from "../no-data/no-data.component";
import { AttributeService } from "../../../services/attribute.service";
import { environment } from "../../../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    TranslateModule,
    RouterModule,
    ButtonComponent,
    NoDataComponent,
  ],
  templateUrl: "./categories.component.html",
  styleUrl: "./categories.component.scss",
})
export class CategoriesComponent implements OnInit {
  @Input() categoryIds: number[] = [];
  @Input() style: string = "vertical";
  @Input() image?: string;
  @Input() slider: boolean;
  @Input() options: OwlOptions = categorySlider;

  public categories: Category[] = [];
  public selectedCategorySlug: string[] = [];
  public StorageURL = environment.storageURL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attributeService: AttributeService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCategorySlug = params["category"]
        ? params["category"].split(",")
        : [];
    });
  }

  ngOnInit() {
    this.fetchCategoriesFromAPI();
  }

  fetchCategoriesFromAPI() {
    this.http
      .get<any>(
        "https://gocare-back-develop.salonspace1.com/api/services/WebApp/ProductCategory/SearchAll"
      )
      .subscribe(
        (response) => {
          this.categories = response.result;
          console.log("Fetched Categories:", this.categories);
          this.categories.forEach((category) => {
            console.log("URL:", this.getFullImageUrl(category.imageUrl));
          });
        },
        (error) => {
          console.error("Error fetching categories:", error);
        }
      );
  }

  getFullImageUrl(relativePath?: string): string {
    if (!relativePath) return "assets/default-image.jpg";
    return `${environment.apiUrl}${relativePath.replace(/\\/g, "/")}`;
  }

  redirectToCollection(slug: string) {
    let index = this.selectedCategorySlug.indexOf(slug);
    if (index === -1) this.selectedCategorySlug.push(slug);
    else this.selectedCategorySlug.splice(index, 1);

    this.router.navigate(["/collections"], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategorySlug.length
          ? this.selectedCategorySlug?.join(",")
          : null,
      },
      queryParamsHandling: "merge",
      skipLocationChange: false,
    });
  }

  closeCanvasMenu() {
    this.attributeService.offCanvasMenu = false;
  }
}
