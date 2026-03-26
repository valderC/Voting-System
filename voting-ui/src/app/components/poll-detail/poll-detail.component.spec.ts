import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PollDetailComponent } from './poll-detail.component';

describe('PollDetailComponent', () => {
  let component: PollDetailComponent;
  let fixture: ComponentFixture<PollDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null poll', () => {
    expect(component.poll).toBeNull();
  });

  it('should return 0 percentage when no votes', () => {
    expect(component.getPercentage({ id: 1, optionText: 'A', voteCount: 0 })).toBe(0);
  });
});
