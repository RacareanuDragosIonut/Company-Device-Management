import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermngmntComponent } from './usermngmnt.component';

describe('UsermngmntComponent', () => {
  let component: UsermngmntComponent;
  let fixture: ComponentFixture<UsermngmntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsermngmntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsermngmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
