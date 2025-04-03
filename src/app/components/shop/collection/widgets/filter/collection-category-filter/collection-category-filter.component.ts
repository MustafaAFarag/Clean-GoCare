import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, OnChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Category } from "../../../../../../shared/interface/category.interface";
import { Params } from "../../../../../../shared/interface/core.interface";
import { SearchFilterPipe } from "../../../../../../shared/pipe/search-filter.pipe";
import { NoDataComponent } from "../../../../../../shared/components/widgets/no-data/no-data.component";
import { ServicesService } from "../../../../../services/services/services.service";

@Component({
  selector: "app-collection-category-filter",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SearchFilterPipe,
    NoDataComponent,
  ],
  templateUrl: "./collection-category-filter.component.html",
  styleUrl: "./collection-category-filter.component.scss",
})
export class CollectionCategoryFilterComponent implements OnInit, OnChanges {
  @Input() filter: Params;

  public categories: Category[] = [];
  public selectedCategories: string[] = [];
  public searchText: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService
  ) {}

  ngOnInit() {
    // Get categories from the API instead of store
    this.fetchCategorySidebarFiltersAPI();
  }

  // CATEGORY SIDEBAR API
  fetchCategorySidebarFiltersAPI() {
    this.servicesService.getMockCategorySidebar().subscribe((response: any) => {
      console.log("CATEGORIES", response);
      // Assuming the API response structure has a data property with categories
      if (response && response.data) {
        this.categories = response.data.filter(
          (category: Category) => category.type === "product"
        );
      } else {
        // If the response structure is different, adjust accordingly
        this.categories = Array.isArray(response)
          ? response.filter((category: Category) => category.type === "product")
          : [];
      }
      console.log("CATEGORIES", this.categories);
    });
  }

  ngOnChanges() {
    this.selectedCategories = this.filter["category"]
      ? this.filter["category"].split(",")
      : [];
  }

  applyFilter(event: Event) {
    const index = this.selectedCategories.indexOf(
      (<HTMLInputElement>event?.target)?.value
    ); // checked and unchecked value

    if ((<HTMLInputElement>event?.target)?.checked)
      this.selectedCategories.push((<HTMLInputElement>event?.target)?.value);
    // push in array cheked value
    else this.selectedCategories.splice(index, 1); // removed in array unchecked value

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategories.length
          ? this.selectedCategories?.join(",")
          : null,
        page: 1,
      },
      queryParamsHandling: "merge", // preserve the existing query params in the route
      skipLocationChange: false, // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCategories?.indexOf(item) != -1) {
      return true;
    }
    return false;
  }
}
