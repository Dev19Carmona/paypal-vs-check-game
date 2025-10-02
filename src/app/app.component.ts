import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

interface Equipo {
  nombre: string;
  color: string;
  puntos: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Estados del juego
  pantallaActual: 'explicacion' | 'ruleta' | 'trivia' | 'resultado' = 'explicacion';
  
  // Equipos
  equipos: Equipo[] = [
    { nombre: 'PayPal', color: 'azul', puntos: 0 },
    { nombre: 'Visa Checkout', color: 'rojo', puntos: 0 }
  ];
  
  equipoAsignado: Equipo | null = null;
  ruletaGirando = false;
  
  // Trivia
  preguntaActual = 0;
  respuestaSeleccionada: number | null = null;
  mostrarExplicacion = false;
  juegoTerminado = false;
  
  preguntas: Pregunta[] = [
    {
      id: 1,
      pregunta: "¿Cuál fue el enfoque inicial de PayPal?",
      opciones: [
        "Ser un facilitador de pagos con tarjeta Visa",
        "Ser un método de pago digital independiente",
        "Ser una extensión del ecosistema bancario",
        "Ser una plataforma de comercio electrónico"
      ],
      respuestaCorrecta: 1,
      explicacion: "PayPal nació como un método de pago digital independiente, sin depender de bancos ni tarjetas específicas."
    },
    {
      id: 2,
      pregunta: "¿En qué año fue lanzado Visa Checkout?",
      opciones: ["2012", "2014", "2016", "2018"],
      respuestaCorrecta: 1,
      explicacion: "Visa Checkout fue lanzado en 2014 por Visa como extensión de su ecosistema de tarjetas."
    },
    {
      id: 3,
      pregunta: "¿Cuál fue la principal ventaja de PayPal para los usuarios?",
      opciones: [
        "Solo necesitaba un correo electrónico",
        "Era más barato que las tarjetas",
        "Tenía mejor diseño visual",
        "Era más rápido que Visa Checkout"
      ],
      respuestaCorrecta: 0,
      explicacion: "PayPal solo necesitaba un correo electrónico y una cuenta, lo que lo hacía muy rápido para enviar/recibir dinero."
    },
    {
      id: 4,
      pregunta: "¿Por qué Visa Checkout no fue exitoso?",
      opciones: [
        "Era muy caro",
        "No aportaba un diferencial de seguridad",
        "Tenía problemas técnicos",
        "No tenía buena publicidad"
      ],
      respuestaCorrecta: 1,
      explicacion: "Visa Checkout no aportaba un diferencial de seguridad, ya que de todas formas la transacción seguía siendo con la tarjeta."
    },
    {
      id: 5,
      pregunta: "¿Cuál empresa logró crear un ecosistema propio más fuerte?",
      opciones: ["Visa Checkout", "PayPal", "Ambas por igual", "Ninguna"],
      respuestaCorrecta: 1,
      explicacion: "PayPal creó un ecosistema propio que funciona como billetera digital, cuenta online, envío de dinero P2P e integración en plataformas globales."
    }
  ];

  // Métodos del juego
  siguientePantalla() {
    if (this.pantallaActual === 'explicacion') {
      this.pantallaActual = 'ruleta';
    } else if (this.pantallaActual === 'ruleta') {
      this.pantallaActual = 'trivia';
    }
  }

  girarRuleta() {
    if (this.ruletaGirando) return;
    
    this.ruletaGirando = true;
    
    // Simular giro de ruleta
    setTimeout(() => {
      const indiceAleatorio = Math.floor(Math.random() * this.equipos.length);
      this.equipoAsignado = this.equipos[indiceAleatorio];
      this.ruletaGirando = false;
    }, 2000);
  }

  seleccionarRespuesta(indice: number) {
    if (this.respuestaSeleccionada !== null) return;
    
    this.respuestaSeleccionada = indice;
    this.mostrarExplicacion = true;
    
    // Verificar si la respuesta es correcta
    const pregunta = this.preguntas[this.preguntaActual];
    if (indice === pregunta.respuestaCorrecta) {
      this.equipoAsignado!.puntos += 10;
    }
  }

  siguientePregunta() {
    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual++;
      this.respuestaSeleccionada = null;
      this.mostrarExplicacion = false;
    } else {
      this.juegoTerminado = true;
      this.pantallaActual = 'resultado';
    }
  }

  reiniciarJuego() {
    this.pantallaActual = 'explicacion';
    this.equipoAsignado = null;
    this.ruletaGirando = false;
    this.preguntaActual = 0;
    this.respuestaSeleccionada = null;
    this.mostrarExplicacion = false;
    this.juegoTerminado = false;
    this.equipos.forEach(equipo => equipo.puntos = 0);
  }

  get equipoGanador(): Equipo | null {
    if (this.equipos[0].puntos > this.equipos[1].puntos) {
      return this.equipos[0];
    } else if (this.equipos[1].puntos > this.equipos[0].puntos) {
      return this.equipos[1];
    }
    return null;
  }
}
