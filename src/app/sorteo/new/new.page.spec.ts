import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewModalSorteoPage } from './new.page';

describe('NewModalSorteoPage', () => {
  let component: NewModalSorteoPage;
  let fixture: ComponentFixture<NewModalSorteoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModalSorteoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
