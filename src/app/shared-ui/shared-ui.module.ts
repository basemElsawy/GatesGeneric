import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './input-text/input-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LabelComponent } from './label/label.component';
import { ButtonComponent } from './button/button.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomComponent } from './welcom/welcom.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoadingComponent } from './loading/loading.component';
import { SearchComponent } from './search/search.component';
import { TableComponent } from './table/table.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ModelComponent } from './model/model.component';
import { StructureComponentsComponent } from './structure-components/structure-components.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationsComponent } from './paginations/paginations.component';
import { DpSingleSelectComponent } from './dp-single-select/dp-single-select.component';
import { OptionComponent } from './option/option.component';
import { ErrorInputComponent } from './error-input/error-input.component';
import { StructurePriceComponentComponent } from './structure-price-component/structure-price-component.component';
import { WebcamModule } from 'ngx-webcam';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AppRoutingModule } from '../app-routing.module';
import { UserDropDownComponent } from './user-drop-down/user-drop-down.component';
import { RouterModule } from '@angular/router';
import { InputDateComponent } from './input-date/input-date.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { LoaderComponent } from './loader/loader.component';
import { FooterComponent } from './footer/footer.component';
import { SearchWithDropDownComponent } from './search-with-drop-down/search-with-drop-down.component';
import { EmptyTableComponent } from './empty-table/empty-table.component';
import { NFoundComponent } from './nfound/nfound.component';
import { InlineTextComponent } from './inline-text/inline-text.component';
import { InputCheckboxComponent } from './input-checkbox/input-checkbox.component';
import { RecetComponent } from './recet/recet.component';
import { QrCodeModule } from 'ng-qrcode';
import { AppSearchReportFilterComponent } from './app-search-report-filter/app-search-report-filter.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputRadioComponent } from './input-radio/input-radio.component';
import { UserDataComponent } from './user-data/user-data.component';
@NgModule({
  declarations: [
    InputTextComponent,
    LabelComponent,
    ButtonComponent,
    WelcomComponent,
    NotFoundComponent,
    LoadingComponent,
    SearchComponent,
    TableComponent,
    PageTitleComponent,
    ModelComponent,
    StructureComponentsComponent,
    PaginationsComponent,
    DpSingleSelectComponent,
    OptionComponent,
    ErrorInputComponent,
    StructurePriceComponentComponent,
    NavbarComponent,
    SideNavComponent,
    UserDropDownComponent,
    InputDateComponent,
    InputNumberComponent,
    LoaderComponent,
    FooterComponent,
    SearchWithDropDownComponent,
    EmptyTableComponent,
    NFoundComponent,
    InlineTextComponent,
    InputCheckboxComponent,
    InputRadioComponent,
    RecetComponent,
    AppSearchReportFilterComponent,
    UserDataComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild(),
    ToastrModule.forRoot(),
    WebcamModule,
    RouterModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    QrCodeModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    InputTextComponent,
    LabelComponent,
    ButtonComponent,
    WelcomComponent,
    NotFoundComponent,
    LoadingComponent,
    SearchComponent,
    TableComponent,
    PageTitleComponent,
    ModelComponent,
    StructureComponentsComponent,
    PaginationsComponent,
    DpSingleSelectComponent,
    OptionComponent,
    ErrorInputComponent,
    StructurePriceComponentComponent,
    NavbarComponent,
    InputRadioComponent,
    SideNavComponent,
    UserDropDownComponent,
    InputDateComponent,
    InputNumberComponent,
    FooterComponent,
    SearchWithDropDownComponent,
    EmptyTableComponent,
    InlineTextComponent,
    InputCheckboxComponent,
    AppSearchReportFilterComponent,
  ],
})
export class SharedUiModule {}
