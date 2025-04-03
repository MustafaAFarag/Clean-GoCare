import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { HttpClient } from "@angular/common/http";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { Observable, Subscription } from "rxjs";

import { ProductBoxComponent } from "../../../../shared/components/widgets/product-box/product-box.component";

import {
  Category,
  CategoryModel,
} from "../../../../shared/interface/category.interface";
import { Params } from "../../../../shared/interface/core.interface";
import { Product } from "../../../../shared/interface/product.interface";
import { GetCategoryProducts } from "../../../../shared/store/action/product.action";
import { CategoryState } from "../../../../shared/store/state/category.state";
import { ProductState } from "../../../../shared/store/state/product.state";
import { NoDataComponent } from "../../../../shared/components/widgets/no-data/no-data.component";
import { productSlider4 } from "../../../../shared/data/owl-carousel";
import { ProductTabSection } from "../../../../shared/interface/theme.interface";
import { ProductService } from "../../../../shared/services/product.service";
import { SkeletonProductBoxComponent } from "../../../../shared/components/widgets/product-box/widgets/skeleton-product-box/skeleton-product-box.component";
import { ServicesService } from "../../../services/services/services.service";

@Component({
  selector: "app-theme-product-tab-section",
  standalone: true,
  imports: [
    CommonModule,
    ProductBoxComponent,
    CarouselModule,
    NoDataComponent,
    SkeletonProductBoxComponent,
  ],
  templateUrl: "./theme-product-tab-section.component.html",
  styleUrl: "./theme-product-tab-section.component.scss",
})
export class ThemeProductTabSectionComponent implements OnInit, OnDestroy {
  @Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(ProductState.categoryProducts) product$: Observable<Product[]>;

  @Input() categoryIds?: number[];
  @Input() slider: boolean = false;
  @Input() style: string;
  @Input() tab_title_class: string;
  @Input() tab_style: string;
  @Input() showItems: number = 4;
  @Input() class: string =
    "row row-cols-xl-4 row-cols-md-3 row-cols-2 g-md-4 g-3";
  @Input() type: string;
  @Input() title: ProductTabSection | undefined;
  @Input() product_box_style: string;
  @Input() options: OwlOptions = productSlider4;

  public skeletonItems = Array.from(
    { length: this.showItems || 4 },
    (_, index) => index
  );

  public categories: Category[] = [];
  public products: Product[] = [];
  public allProducts: Product[] = [];
  public activeCategory: number;
  public selectedCategorySlug: string = "";
  private categorySubscription: Subscription;
  private productSubscription: Subscription;

  public filter: Params = {
    page: 1,
    paginate: 4,
    status: 1,
    category_id: "",
  };

  constructor(
    private store: Store,
    public productService: ProductService,
    private http: HttpClient,
    private serviceServices: ServicesService
  ) {}

  ngOnInit() {
    this.fetchCategoriesFromAPI();
    this.fetchProductsFromAPI();
  }

  // PRODUCT API
  fetchProductsFromAPI() {
    this.http
      .get<any[]>(
        "https://run.mocky.io/v3/fc56610e-2030-4bdc-b5ad-676bb853397a"
      )
      .subscribe(
        (response) => {
          this.allProducts = response;
          this.filterProducts();
          console.log("PRODUCT", this.allProducts);
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );
  }

  fetchCategoriesFromAPI() {
    this.http
      .get<any>(
        "https://gocare-back-develop.salonspace1.com/api/services/WebApp/ProductCategory/SearchAll"
      )
      .subscribe(
        (response) => {
          this.categories = response.result;
          console.log("RESPONSE", this.categories);
          if (this.categories.length) {
            this.activeCategory = this.categories[0].id;
            this.selectedCategorySlug = this.categories[0].slug;
            this.filterProducts();
          }
          console.log("Fetched Categories:", this.categories);
        },
        (error) => {
          console.error("Error fetching categories:", error);
        }
      );
  }

  filterProducts() {
    if (!this.allProducts.length) return;

    // Filter products where filterCategory matches the selectedCategorySlug
    this.products = this.allProducts.filter((product) => {
      return product.filterCategory === this.selectedCategorySlug;
    });

    console.log("Filtered Products:", this.products);
    console.log("Filter criteria:", {
      filterCategory: this.selectedCategorySlug,
    });
  }

  changeTab(category: Category) {
    this.activeCategory = category.id;
    this.selectedCategorySlug = category.slug;
    this.filterProducts();
  }

  ngOnChanges() {
    this.filter["paginate"] = this.showItems;
    this.skeletonItems = Array.from(
      { length: this.showItems || 4 },
      (_, index) => index
    );

    if (this.categoryIds && this.categoryIds.length) {
      this.categorySubscription = this.category$.subscribe((res) => {
        if (res) {
          this.categories = this.getCategoriesByIds(
            res.data,
            this.categoryIds!
          );

          if (this.categories.length) {
            this.activeCategory = this.categories[0].id;
            this.selectedCategorySlug = this.categories[0].slug;
            this.filterProducts();
          }
        }
      });
    }
  }

  getCategoriesByIds(categories: Category[], ids: number[]): Category[] {
    let matchedCategories: Category[] = [];

    categories.forEach((category) => {
      if (ids.includes(category.id)) {
        matchedCategories.push(category);
      }

      if (category.subcategories?.length) {
        const matchedSubcategories = this.getCategoriesByIds(
          category.subcategories,
          ids
        );
        if (matchedSubcategories.length) {
          matchedCategories.push(...matchedSubcategories);
        }
      }
    });

    return matchedCategories;
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
