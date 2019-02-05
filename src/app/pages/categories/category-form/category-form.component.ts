import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { Category } from "../shared/category.model";
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string
  categoryForm: FormGroup
  pageTitle: string
  serverErrorMessages: string[] = null
  submitingForm: boolean = false
  category: Category = new Category()


  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildCategoryForm()
    this.loadCategory()
  }

  ngAfterContentChecked() {
    this.setPageTitle()
  }

  // PRIVATE METHODS
  private setPageTitle() {
    if (this.currentAction == 'new') 
      this.pageTitle = 'Cadastro de Nova Categoria'
    else {
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando Categoria: ' + categoryName
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category
          this.categoryForm.patchValue(category) // binds loader category data to categoryForm 
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

}
