import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SorteoGeneradorPage } from './sorteo-generador.page';

describe('SorteoGeneradorPage', () => {
  let component: SorteoGeneradorPage;
  let fixture: ComponentFixture<SorteoGeneradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SorteoGeneradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
