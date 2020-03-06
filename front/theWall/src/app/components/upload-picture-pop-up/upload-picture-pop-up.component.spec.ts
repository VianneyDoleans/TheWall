import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPicturePopUpComponent } from './upload-picture-pop-up.component';

describe('UploadPicturePopUpComponent', () => {
  let component: UploadPicturePopUpComponent;
  let fixture: ComponentFixture<UploadPicturePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPicturePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPicturePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
