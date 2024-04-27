import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { InputOtpModule } from 'primeng/inputotp';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(private formBuilder: FormBuilder) {}
  otpRequest: boolean = true;
  value: string | undefined;
  form: FormGroup = this.formBuilder.group({
    code: [null, [Validators.required]],
  });

  sampleClick() {
    console.log(this.form.value);
  }
}
