import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();

  private currentTheme = new BehaviorSubject<"Berryat" | "GoCare">("Berryat");
  public currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem("currentTheme") as
      | "Berryat"
      | "GoCare";
    if (savedTheme) {
      this.toggleTheme(savedTheme);
    }
  }

  toggleTheme(theme: "Berryat" | "GoCare"): void {
    this.currentTheme.next(theme);

    if (theme === "GoCare") {
      document.body.classList.add("dark");
      this.isDarkMode.next(true);
    } else {
      document.body.classList.remove("dark");
      this.isDarkMode.next(false);
    }

    localStorage.setItem("currentTheme", theme);
  }

  /** Getter for the current theme */
  get theme(): "Berryat" | "GoCare" {
    return this.currentTheme.value;
  }
}
