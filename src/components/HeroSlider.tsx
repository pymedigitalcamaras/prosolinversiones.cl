"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowDown, Calculator, HelpCircle, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/site";

export type SlideData = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  action: string;
};

const defaultSlides: SlideData[] = [
  {
    image: "/images/slider/slider-1-corregido.webp",
    alt: "Bombas de calor termodinamicas NAE y estanque de acero inoxidable en sala tecnica de edificio",
    eyebrow: "BOMBAS DE CALOR TERMODINÁMICAS · ACS EDIFICIOS",
    title: "Bombas de calor de 3ra generación para agua caliente en edificios.",
    text: "Venta, instalación y asesoría técnica de bombas de calor NAE. Dimensionadas para las condiciones reales de su comunidad o copropiedad.",
    href: "#familias", action: "Conoce las soluciones",
  },
  {
    image: "/images/slider/slider-5.webp",
    alt: "Sistema de bombas de calor instalado en azotea de edificio residencial",
    eyebrow: "PARA ADMINISTRADORES Y COMITÉS · EFICIENCIA Y AHORRO",
    title: "Instalación profesional de bombas de calor con respaldo de fábrica.",
    text: "Evaluamos consumo, infraestructura eléctrica y continuidad operativa antes de instalar una bomba de calor en su comunidad.",
    href: "/contacto?perfil=administrador", action: "Solicitar evaluación técnica",
  },
  {
    image: "/images/slider/slider-0.webp",
    alt: "Asesores en copropiedad evaluando soluciones de bombas de calor para edificios",
    eyebrow: "CANAL ASESOR EN COPROPIEDAD · ALIANZA COMERCIAL",
    title: "Acompañamiento técnico comercial para asesores de comunidades.",
    text: "Presente soluciones de bombas de calor NAE con ingeniería validada y construya una relación comercial legítima con Prosol.",
    href: "/contacto?perfil=asesor", action: "Conocer el canal de asesores",
  },
  {
    image: "/images/slider/slider-4.webp",
    alt: "Equipo tecnico de Prosol instalando bombas de calor en sala tecnica",
    eyebrow: "INGENIERÍA ESPECIALIZADA · CAPACITACIÓN EN FÁBRICA",
    title: "Una bomba de calor termodinámica no se instala como una caldera.",
    text: "Departamento de ingeniería especializado, soporte directo en fábrica y acompañamiento en la puesta en marcha de cada proyecto.",
    href: "/centro-tecnico", action: "Conocer el enfoque técnico",
  },
  {
    image: "/images/slider/slider-3.webp",
    alt: "Edificios residenciales con sistema de bomba de calor instalado",
    eyebrow: "MÁS DE 10 AÑOS DE EXPERIENCIA · DISTRIBUIDOR NAE CHILE",
    title: "Asesoría técnica y respaldo garantizado en bombas de calor NAE.",
    text: "Acompañamos a administradores, comités y comisiones en la transición hacia agua caliente de alta eficiencia sin calderas a gas.",
    href: "/nosotros", action: "Por qué elegir Prosol",
  },
];

export function HeroSlider({ slides = defaultSlides }: { slides?: SlideData[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const phoneNumber = "+56 9 9011 7784";

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const go = (index: number) => setCurrent((index + slides.length) % slides.length);

  return (
    <div className="nae-hero-wrapper">
      {/* Hero Carousel Container (Exact NAE Height & Aspect: 54vh-62vh) */}
      <div 
        className="nae-hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.image + index}
              className={`nae-hero-slide ${isActive ? "active" : ""}`}
              aria-hidden={!isActive}
            >
              {/* Daylight Industrial Photography */}
              <Image 
                src={slide.image} 
                alt={isActive ? slide.alt : ""} 
                fill 
                priority={index === 0} 
                sizes="100vw"
                className="nae-slide-img" 
              />
              
              {/* NAE Platform Navy Gradient Overlay */}
              <div className="nae-hero-overlay" />
              
              {/* Slide Content centered vertically */}
              <div className="container nae-hero-content">
                <div className="nae-hero-copy">
                  {slide.eyebrow && (
                    <div className="nae-hero-tag">
                      {slide.eyebrow}
                    </div>
                  )}
                  
                  {index === 0 ? (
                    <h1 className="nae-hero-title">{slide.title}</h1>
                  ) : (
                    <h2 className="nae-hero-title">{slide.title}</h2>
                  )}
                  
                  <p className="nae-hero-subtitle">{slide.text}</p>

                  <div className="nae-hero-btn-wrap">
                    <Link 
                      href={slide.href} 
                      className="nae-ghost-btn"
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span>{slide.action}</span>
                      <ArrowDown size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows (< and >) */}
        <button
          onClick={() => go(current - 1)}
          className="nae-arrow-btn nae-arrow-prev"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(current + 1)}
          className="nae-arrow-btn nae-arrow-next"
          aria-label="Siguiente slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators at bottom right (Orange active pill + white dots) */}
        <div className="nae-slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              className={`nae-dot ${idx === current ? "active" : ""}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* FLOATING ACTION DOCK (Exact NAE Screenshot Replica) */}
      <div className="container nae-dock-container">
        <div className="nae-dock-pill">
          {/* Left: Technical Agent Online */}
          <div className="nae-dock-agent">
            <div className="nae-dock-avatar-wrap">
              <div className="nae-dock-avatar">PS</div>
              <span className="nae-dock-avatar-dot" />
            </div>
            <div className="nae-dock-agent-text">
              <div className="nae-dock-agent-title">
                Estamos en línea — <span>Asesoría Técnica Prosol</span>
              </div>
              <div className="nae-dock-agent-desc">Respuesta en minutos, en tu idioma</div>
            </div>
          </div>

          {/* Middle: Quick Links + PRINTED PHONE */}
          <div className="nae-dock-links">
            <Link href="/contacto" className="nae-dock-link">
              <Calculator size={16} />
              <span>Evaluación técnica</span>
            </Link>
            <Link href="/catalogo" className="nae-dock-link">
              <HelpCircle size={16} />
              <span>Catálogo de bombas</span>
            </Link>
            <div className="nae-dock-phone-box" title="Teléfono">
              Celular: <strong>{phoneNumber}</strong>
            </div>
          </div>

          {/* Right: Orange WhatsApp Direct Button */}
          <div className="nae-dock-cta-wrap">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="nae-dock-whatsapp-btn"
            >
              <MessageCircle size={16} fill="white" />
              <span>WhatsApp directo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
