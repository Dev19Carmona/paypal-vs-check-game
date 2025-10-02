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
  preguntasRespondidas: number;
  preguntasCorrectas: number;
}

interface RespuestaEquipo {
  equipo: Equipo;
  preguntaId: number;
  respuesta: number;
  esCorrecta: boolean;
  puntosObtenidos: number;
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
    { nombre: 'PayPal', color: 'azul', puntos: 0, preguntasRespondidas: 0, preguntasCorrectas: 0 },
    { nombre: 'Visa Checkout', color: 'rojo', puntos: 0, preguntasRespondidas: 0, preguntasCorrectas: 0 }
  ];
  
  // Sistema de turnos
  equipoActual: Equipo | null = null;
  equipoAsignado: Equipo | null = null; // Para compatibilidad con HTML
  ruletaGirando = false; // Para compatibilidad con HTML
  turnoActual = 0; // 0 = PayPal, 1 = Visa Checkout
  preguntaActual = 0;
  respuestaSeleccionada: number | null = null;
  mostrarExplicacion = false;
  juegoTerminado = false;
  respuestasEquipos: RespuestaEquipo[] = [];
  
  // Configuración del juego
  preguntasPorEquipo = 3; // Cada equipo responde 3 preguntas
  puntosPorRespuesta = 10;
  
  // Preguntas para PayPal (equipo azul)
  preguntasPayPal: Pregunta[] = [
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
      id: 3,
      pregunta: "¿Cuál empresa logró crear un ecosistema propio más fuerte?",
      opciones: ["Visa Checkout", "PayPal", "Ambas por igual", "Ninguna"],
      respuestaCorrecta: 1,
      explicacion: "PayPal creó un ecosistema propio que funciona como billetera digital, cuenta online, envío de dinero P2P e integración en plataformas globales."
    }
  ];

  // Preguntas para Visa Checkout (equipo rojo)
  preguntasVisa: Pregunta[] = [
    {
      id: 4,
      pregunta: "¿En qué año fue lanzado Visa Checkout?",
      opciones: ["2012", "2014", "2016", "2018"],
      respuestaCorrecta: 1,
      explicacion: "Visa Checkout fue lanzado en 2014 por Visa como extensión de su ecosistema de tarjetas."
    },
    {
      id: 5,
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
      id: 6,
      pregunta: "¿Cuál fue el principal problema de Visa Checkout?",
      opciones: [
        "Llegó muy tarde al mercado",
        "No resolvió un problema real",
        "Era muy complicado de usar",
        "Todas las anteriores"
      ],
      respuestaCorrecta: 3,
      explicacion: "Visa Checkout llegó tarde, no resolvió un problema real y era más complicado que PayPal."
    }
  ];

  // Obtener preguntas del equipo actual
  get preguntasActuales(): Pregunta[] {
    if (this.turnoActual === 0) {
      return this.preguntasPayPal;
    } else {
      return this.preguntasVisa;
    }
  }

  // Métodos del juego
  siguientePantalla() {
    if (this.pantallaActual === 'explicacion') {
      this.pantallaActual = 'ruleta';
    } else if (this.pantallaActual === 'ruleta') {
      this.iniciarTrivia();
    }
  }

  girarRuleta() {
    // Simular giro de ruleta (ahora solo es decorativo)
    this.pantallaActual = 'trivia';
    this.iniciarTrivia();
  }

  iniciarTrivia() {
    this.pantallaActual = 'trivia';
    this.turnoActual = 0; // Empezar con PayPal
    this.equipoActual = this.equipos[0];
    this.preguntaActual = 0;
    this.respuestaSeleccionada = null;
    this.mostrarExplicacion = false;
    this.juegoTerminado = false;
    this.respuestasEquipos = [];
    
    // Resetear estadísticas
    this.equipos.forEach(equipo => {
      equipo.puntos = 0;
      equipo.preguntasRespondidas = 0;
      equipo.preguntasCorrectas = 0;
    });
  }

  seleccionarRespuesta(indice: number) {
    if (this.respuestaSeleccionada !== null || !this.equipoActual) return;
    
    this.respuestaSeleccionada = indice;
    this.mostrarExplicacion = true;
    
    // Verificar si la respuesta es correcta
    const pregunta = this.preguntasActuales[this.preguntaActual];
    const esCorrecta = indice === pregunta.respuestaCorrecta;
    const puntosObtenidos = esCorrecta ? this.puntosPorRespuesta : 0;
    
    // Actualizar estadísticas del equipo actual
    this.equipoActual.puntos += puntosObtenidos;
    this.equipoActual.preguntasRespondidas++;
    if (esCorrecta) {
      this.equipoActual.preguntasCorrectas++;
    }
    
    // Guardar respuesta
    this.respuestasEquipos.push({
      equipo: this.equipoActual,
      preguntaId: pregunta.id,
      respuesta: indice,
      esCorrecta: esCorrecta,
      puntosObtenidos: puntosObtenidos
    });
  }

  siguientePregunta() {
    this.respuestaSeleccionada = null;
    this.mostrarExplicacion = false;
    
    // Verificar si el equipo actual terminó sus preguntas
    if (this.equipoActual!.preguntasRespondidas >= this.preguntasPorEquipo) {
      // Cambiar al siguiente equipo
      this.turnoActual = (this.turnoActual + 1) % this.equipos.length;
      this.equipoActual = this.equipos[this.turnoActual];
      this.preguntaActual = 0; // Resetear pregunta para el nuevo equipo
      
      // Si ambos equipos terminaron, mostrar resultados
      if (this.turnoActual === 0) {
        this.juegoTerminado = true;
        this.pantallaActual = 'resultado';
        return;
      }
    } else {
      // Mismo equipo, siguiente pregunta
      this.preguntaActual++;
    }
  }

  reiniciarJuego() {
    this.pantallaActual = 'explicacion';
    this.equipoActual = null;
    this.turnoActual = 0;
    this.preguntaActual = 0;
    this.respuestaSeleccionada = null;
    this.mostrarExplicacion = false;
    this.juegoTerminado = false;
    this.respuestasEquipos = [];
    
    this.equipos.forEach(equipo => {
      equipo.puntos = 0;
      equipo.preguntasRespondidas = 0;
      equipo.preguntasCorrectas = 0;
    });
  }

  get equipoGanador(): Equipo | null {
    if (this.equipos[0].puntos > this.equipos[1].puntos) {
      return this.equipos[0];
    } else if (this.equipos[1].puntos > this.equipos[0].puntos) {
      return this.equipos[1];
    }
    return null;
  }

  get progresoEquipoActual(): number {
    if (!this.equipoActual) return 0;
    return (this.equipoActual.preguntasRespondidas / this.preguntasPorEquipo) * 100;
  }

  get esUltimaPreguntaEquipo(): boolean {
    if (!this.equipoActual) return false;
    return this.equipoActual.preguntasRespondidas >= this.preguntasPorEquipo - 1;
  }

  get esUltimoEquipo(): boolean {
    return this.turnoActual === this.equipos.length - 1;
  }

  get textoBotonSiguiente(): string {
    if (this.esUltimaPreguntaEquipo) {
      if (this.esUltimoEquipo) {
        return 'Ver Resultados';
      } else {
        return `Cambiar a ${this.equipos[(this.turnoActual + 1) % this.equipos.length].nombre}`;
      }
    } else {
      return 'Siguiente Pregunta';
    }
  }
}