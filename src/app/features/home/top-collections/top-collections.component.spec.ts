import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCollectionsComponent } from './top-collections.component';

describe('TopCollectionsComponent', () => {
  let component: TopCollectionsComponent;
  let fixture: ComponentFixture<TopCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
