import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailSorteoPage } from './detail-sorteo.page';

describe('DetailSorteoPage', () => {
  let component: DetailSorteoPage;
  let fixture: ComponentFixture<DetailSorteoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSorteoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
