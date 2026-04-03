document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/resumenes.json');
    const resumenes = await res.json();
    
    // 1. Poblar filtros dinámicamente
    const materias = [...new Set(resumenes.map(r => r.materia))].sort();
    const subs = [...new Set(resumenes.map(r => r.submateria))].sort();
    
    const selMat = document.getElementById('filtro-materia');
    const selSub = document.getElementById('filtro-sub');
    
    materias.forEach(m => selMat.innerHTML += `<option value="${m}">${m}</option>`);
    subs.forEach(s => selSub.innerHTML += `<option value="${s}">${s}</option>`);
    
    // 2. Renderizar catálogo
    const grid = document.getElementById('grid-resumenes');
    
    function render(items) {
      grid.innerHTML = '';
      if (items.length === 0) {
        grid.innerHTML = '<p class="loading">No se encontraron resúmenes con esos filtros.</p>';
        return;
      }
      items.forEach(r => {
        grid.innerHTML += `
          <div class="card">
            <div class="meta">${r.materia} • ${r.submateria}</div>
            <div class="titulo">${r.titulo}</div>
            <div class="desc">${r.descripcion}</div>
            <div class="precio-row">
              <span class="precio">$${r.precio}</span>
              <button class="btn-buy" onclick="comprar('${r.titulo}')">Solicitar</button>
            </div>
          </div>`;
      });
    }
    
    render(resumenes);
    
    // 3. Lógica de filtros
    function filtrar() {
      const texto = document.getElementById('buscador').value.toLowerCase();
      const mat = selMat.value;
      const sub = selSub.value;
      
      const filtrados = resumenes.filter(r => {
        const coincideTexto = r.titulo.toLowerCase().includes(texto) || 
                              r.materia.toLowerCase().includes(texto) || 
                              r.submateria.toLowerCase().includes(texto);
        const coincideMat = !mat || r.materia === mat;
        const coincideSub = !sub || r.submateria === sub;
        return coincideTexto && coincideMat && coincideSub;
      });
      render(filtrados);
    }
    
    document.getElementById('buscador').addEventListener('input', filtrar);
    selMat.addEventListener('change', filtrar);
    selSub.addEventListener('change', filtrar);
    
  } catch (e) {
    document.getElementById('grid-resumenes').innerHTML = '<p class="loading">Error al cargar el catálogo. Revisá que data/resumenes.json exista.</p>';
  }
});

// Función para comprar: abre WhatsApp con el resumen pre-seleccionado
window.comprar = (nombre) => {
  // ⚠️ REEMPLAZÁ ESTE NÚMERO POR EL TUYO (código de país + número, sin espacios ni guiones)
  const telefono = '59898362625'; 
  
  const mensaje = `Hola Esteban! 👋 Me interesa comprar un resumen de FMED-UdelaR.

📚 *Resumen:* ${nombre}
👤 *Nombre:* 
📧 *Email:* 
💳 *Alias:* resfmed.mp
📎 *Comprobante:* Ya te adjunto la foto del pago.`;

  // Usamos wa.me (API oficial) en vez de wa.link para permitir texto dinámico
  const link = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  
  window.open(link, '_blank');
};
