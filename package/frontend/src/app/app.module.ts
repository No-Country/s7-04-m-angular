import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './views/home/home.component';
import { UserComponent } from './views/user/user.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { CardComponent } from './components/card/card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ForumBarComponent } from './components/forum-bar/forum-bar.component';
import { TitleComponent } from './components/title/title.component';
import { SectionComponent } from './components/section/section.component';
import { LogoComponent } from './components/logo/logo.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ThreadsComponent } from './views/threads/threads.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    FooterComponent,
    HomeComponent,
    UserComponent,
    HeaderComponent,
    MainComponent,
    CardComponent,
    SearchBarComponent,
    ForumBarComponent,
    TitleComponent,
    SectionComponent,
    LogoComponent,
    ThreadsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
