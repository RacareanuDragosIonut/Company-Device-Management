import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesetComponent } from './deviceset.component';

describe('DevicesetComponent', () => {
  let component: DevicesetComponent;
  let fixture: ComponentFixture<DevicesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
