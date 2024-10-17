import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SorteoPage } from './sorteo.page';

describe('SorteoPage', () => {
  let component: SorteoPage;
  let fixture: ComponentFixture<SorteoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SorteoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
