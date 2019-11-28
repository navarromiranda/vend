import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrintModalPage } from './print-modal.page';

describe('PrintModalPage', () => {
  let component: PrintModalPage;
  let fixture: ComponentFixture<PrintModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrintModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
