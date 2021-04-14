import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePeopleComponent } from './save-people.component';

describe('AddPeopleComponent', () => {
  let component: SavePeopleComponent;
  let fixture: ComponentFixture<SavePeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavePeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
