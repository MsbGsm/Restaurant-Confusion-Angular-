import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators} from '@angular/forms'

import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;

  formErrors = {
    'author': '',
    'comment': ''
  }

  validationMessages = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Author name must be at least 2 charecters long.'
    },
    'comment': {
      'required': 'Your comment is required.'
    }
  }

  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) 
              {
                this.createForm();
              }


  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); }, errmess => this.errMess = <any>errmess);
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: [5],
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required]],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; };
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  doSubmit() {
    const currentDate: Date = new Date();
    this.comment = this.commentForm.value;
    this.comment['date'] = currentDate.toISOString();
    this.dish.comments.push(this.comment);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: 5,
      author: '',
      comment: ''
    })
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() {
    this.location.back();
  }
}
