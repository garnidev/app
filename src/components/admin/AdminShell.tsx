"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import type { Usuario } from "@/lib/auth";

type Props = {
  usuario: Usuario;
  children: React.ReactNode;
};

/**
 * Shell coordinador del admin
 * - Maneja el estado colapsado/expandido del sidebar
 * - Sincroniza el padding izquierdo del contenido con el ancho del sidebar
 * - Persiste preferencia en localStorage
 */
export function AdminShell({ usuario, children }: Props) {
  const [colapsado, setColapsado] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  // Leer preferencia guardada (solo cliente, evita hydration mismatch)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("admin-sidebar-colapsado");
      if (guardado === "true") setColapsado(true);
    } catch {
      // Ignorar errores de localStorage (modo privado, etc.)
    }
    setHidratado(true);
  }, []);

  const toggle = () => {
    const nuevo = !colapsado;
    setColapsado(nuevo);
    try {
      localStorage.setItem("admin-sidebar-colapsado", String(nuevo));
    } catch {
      // Ignorar
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar
        usuario={usuario}
        colapsado={colapsado}
        onToggle={toggle}
        hidratado={hidratado}
      />

      {/* Área de contenido — el padding izquierdo se ajusta al ancho del sidebar */}
      <main
        className={`min-h-screen transition-all duration-300 ease-out ${
          colapsado ? "pl-20" : "pl-20 md:pl-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}