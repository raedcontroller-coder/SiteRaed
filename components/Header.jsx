"use client";
import React from 'react';
import Link from 'next/link';

export default function Header({ openContactModal }) {
  return (
    <header className="visible">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <img src="/assets/img/Logo.svg" alt="Raed Logo" />
        </Link>
        <nav className="nav-links">
          <a href="#services">NOSSOS SERVIÇOS</a>
          <a href="#contact">CONTATO</a>
          <Link href="/calculadora">CALCULADORA</Link>
          <Link href="/login">LOGIN</Link>
          <a href="#contact" className="btn-hitech" onClick={openContactModal}>
            Falar com Especialista
          </a>
        </nav>
      </div>
    </header>
  );
}
