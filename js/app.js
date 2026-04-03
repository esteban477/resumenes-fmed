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
    
    // 4. Función comprar (copia nombre y baja al form)
    window.comprar = (nombre) => {
      navigator.clipboard.writeText(nombre).then(() => {
        alert(`✅ "${nombre}" copiado. Pegalo en el formulario de abajo.`);
        document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
      });
    };
    
  } catch (e) {
    document.getElementById('grid-resumenes').innerHTML = '<p class="loading">Error al cargar el catálogo. Revisá que data/resumenes.json exista.</p>';
  }
});
