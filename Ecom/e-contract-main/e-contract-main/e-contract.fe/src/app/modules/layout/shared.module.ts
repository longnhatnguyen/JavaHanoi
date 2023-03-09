import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { HasRoleDirective } from 'src/app/directive/has-role.directive';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HasRoleDirective,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    OverlayModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HasRoleDirective,
  ]
})
export class SharedModule { }

