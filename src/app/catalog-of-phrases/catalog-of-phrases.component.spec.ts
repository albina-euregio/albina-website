import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogOfPhrasesComponent } from './catalog-of-phrases.component';

describe('CatalogOfPhrasesComponent', () => {
  let component: CatalogOfPhrasesComponent;
  let fixture: ComponentFixture<CatalogOfPhrasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogOfPhrasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogOfPhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
