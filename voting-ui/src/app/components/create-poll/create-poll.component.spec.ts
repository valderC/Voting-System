import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CreatePollComponent } from './create-poll.component';

describe('CreatePollComponent', () => {
  let component: CreatePollComponent;
  let fixture: ComponentFixture<CreatePollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePollComponent, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with 2 empty options', () => {
    expect(component.options.length).toBe(2);
  });

  it('should add an option', () => {
    component.addOption();
    expect(component.options.length).toBe(3);
  });

  it('should not add more than 10 options', () => {
    for (let i = 0; i < 20; i++) component.addOption();
    expect(component.options.length).toBe(10);
  });

  it('should remove an option', () => {
    component.addOption();
    component.removeOption(0);
    expect(component.options.length).toBe(2);
  });

  it('should not remove below 2 options', () => {
    component.removeOption(0);
    expect(component.options.length).toBe(2);
  });

  it('should be invalid with empty question', () => {
    component.question = '';
    component.options = ['A', 'B'];
    expect(component.isValid()).toBe(false);
  });

  it('should be valid with question and options filled', () => {
    component.question = 'Test?';
    component.options = ['A', 'B'];
    expect(component.isValid()).toBe(true);
  });
});
