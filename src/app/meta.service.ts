import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(public meta: Meta, public title: Title) {}

  setTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({
      name: 'og:title',
      content: title,
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: title,
    });
  }
}
