import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ValidadoresService } from 'src/app/service/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  forma = new FormGroup ({});



  constructor(private fb: FormBuilder,
              private validadores: ValidadoresService) {
    
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();

  }

  ngOnInit() {
  }
  get pasatiempos() {
    return this.forma.get('pasatiempos') as FormArray
  }

  get nombreNoValido() {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched
  }
  get apellidoNoValido() {
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched
  }
  get correoNoValido() {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched
  }
  get usuarioNoValido() {
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched
  }

  get ciudadNoValido() {
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched
  }

  get calleNoValido() {
    return this.forma.get('direccion.calle').invalid && this.forma.get('direccion.calle').touched
  }

  get pass1NoValido() {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched
  }
  get pass2NoValido() {
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    return (pass1 === pass2) ? false : true;
    }

  crearFormulario() {

    this.forma = this.fb.group ({
      nombre   : ['', [ Validators.required, Validators.minLength(4) ] ],
      apellido : ['', [ Validators.required, Validators.minLength(4), this.validadores.noHerrera ] ],
      correo   : ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ] ],
      usuario  : ['','', this.validadores.existeUsuario], // las validaciones asíncronas son las que se encian en tercera posición y los sincronos en segunda posición.
      pass1    : ['', [Validators.required, Validators.minLength(6)] ],
      pass2    : ['', [Validators.required, Validators.minLength(6)] ],
      direccion: this.fb.group ({
        ciudad: ['', Validators.required ],
        calle : ['', Validators.required ],
      }),
      pasatiempos:this.fb.array ([])
    },
    {
      validator: this.validadores.passwordIguales('pass1','pass2')
    });
  }

  crearListeners(){
    this.forma.valueChanges.subscribe( valor => {
      console.log(valor);
    });

    this.forma.statusChanges.subscribe( status => console.log(status));
  }

  cargarDataAlFormulario(){

    //this.forma.setValue({
      this.forma.reset({
      
        nombre   : 'Luis',
        apellido : 'Felce',
        correo   : 'peo@gmail.com',
        pass1    : '123457',
        pass2    : '123457',
        direccion: {
          ciudad: 'Madrid',
          calle : 'Zombi 34'
      }
    })

  }

  agregarPasatiempo(){
    this.pasatiempos.push( this.fb.control ('') );
  }
  borrarPasatiempo(i:number){
    this.pasatiempos.removeAt(i);
  }

  guardar(){ 
    console.log(this.forma);

    if ( this.forma.invalid ) {
     return Object.values(this.forma.controls).forEach( control => {

      if(control instanceof FormGroup ) {
        Object.values(control.controls).forEach( control => control.markAsTouched() );
      }else {
        control.markAsTouched();
      }

        control.markAsTouched();
      });
    }

    //Posteo de información

  this.forma.reset();
  }

}
