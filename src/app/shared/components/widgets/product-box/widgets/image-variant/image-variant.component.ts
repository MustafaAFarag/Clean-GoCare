import { Component, Input } from "@angular/core";
import { Attachment } from "../../../../../interface/attachment.interface";
import { Product } from "../../../../../interface/product.interface";
import { RouterModule } from "@angular/router";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { CommonModule } from "@angular/common";
import { Select } from "@ngxs/store";
import { ThemeState } from "../../../../../store/state/theme.state";
import { ThemeOptionState } from "../../../../../store/state/theme-option.state";
import { Observable } from "rxjs";
import { Option } from "../../../../../interface/theme-option.interface";
import { environment } from "../../../../../../../environments/environment.development";
import { ServicesService } from "../../../../../../components/services/services/services.service";

@Component({
  selector: "app-image-variant",
  standalone: true,
  imports: [RouterModule, CarouselModule, CommonModule],
  templateUrl: "./image-variant.component.html",
  styleUrl: "./image-variant.component.scss",
})
export class ProductBoxImageVariantComponent {
  @Input() thumbnail?: Attachment | null;
  @Input() gallery_images?: any;
  @Input() product: Product;

  @Select(ThemeOptionState.themeOptions) themeOptions$: Observable<Option>;

  public variant: string = "image_zoom";
  public testProducts: any[];
  public flipImage: Attachment[] = [];
  public imageType = [
    "image/apng",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg",
    "image/svg+xml",
    "image/webp",
  ];
  public customOptions: OwlOptions = {
    loop: true,
    autoplayTimeout: 1200,
    items: 1,
    autoplay: false, // Initialize autoplay as false
  };

  constructor(private servicesService: ServicesService) {}

  getFullImageUrl(relativePath?: string): string {
    if (!relativePath) {
      return "assets/default-image.jpg";
    }
    return `${environment.apiImageUrl}${relativePath.replace(/\\/g, "/")}`;
  }

  ngOnInit() {
    this.themeOptions$.subscribe((options) => {
      this.variant = options.product.image_variant;
    });

    this.servicesService
      .getAllProductVariantsForClient()
      .subscribe((response) => {
        this.testProducts = response.result.items;
      });

    this.flipImage = this.gallery_images.map((image: any) => {
      let images;
      if (this.imageType.includes(image.mime_type)) {
        images = image;
      }
      return images!;
    });
  }

  startAutoplay() {
    this.thumbnail = null;
    this.customOptions = { ...this.customOptions, autoplay: true };
  }

  stopAutoplay() {
    this.customOptions = { ...this.customOptions, autoplay: false };
  }
}
