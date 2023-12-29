import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicemngmntComponent } from './devicemngmnt.component';

describe('DevicemngmntComponent', () => {
  let component: DevicemngmntComponent;
  let fixture: ComponentFixture<DevicemngmntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicemngmntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevicemngmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
