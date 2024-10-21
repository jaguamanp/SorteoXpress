import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRegisterPage } from './modal-register.page';

describe('ModalRegisterPage', () => {
  let component: ModalRegisterPage;
  let fixture: ComponentFixture<ModalRegisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
