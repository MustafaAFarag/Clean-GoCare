import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { ThemeOptionService } from "../../shared/services/theme-option.service";

import { GetHomePage } from "../../shared/store/action/theme.action";

import { ThemeState } from "../../shared/store/state/theme.state";

import { Fashion5Component } from "./fashion/fashion-5/fashion-5.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, Fashion5Component],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  @Select(ThemeState.homePage) homePage$: Observable<string>;
  @Select(ThemeState.activeTheme) activeTheme$: Observable<string>;

  public theme: string;
  public homePage: any;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private themeOptionService: ThemeOptionService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.themeOptionService.preloader = true;
      this.activeTheme$.subscribe((theme) => {
        this.theme = params["theme"] ? params["theme"] : "fashion_five";

        if (this.theme) {
          this.store.dispatch(new GetHomePage(this.theme)).subscribe((data) => {
            this.homePage = data.theme.homePage || { slug: "fashion_five" }; // Ensure 'fashion_five' is set as default
            this.themeOptionService.preloader = false;
          });
        }
      });
    });
  }
}
