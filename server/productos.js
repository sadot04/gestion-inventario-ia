const productos = [
    { id: 'prod-1', nombre: 'Cuaderno rayado', categoria: 'Papelería', sku: 'PAP-001', precio: 8.5, stock: 24 },
    { id: 'prod-2', nombre: 'Botella térmica', categoria: 'Hogar', sku: 'HOG-014', precio: 32, stock: 5 },
    { id: 'prod-3', nombre: 'Auriculares inalámbricos', categoria: 'Tecnología', sku: 'TEC-008', precio: 74.9, stock: 0 }
];
function responder(respuesta, estado, cuerpo) {
    respuesta.statusCode = estado;
    respuesta.setHeader('Content-Type', 'application/json; charset=utf-8');
    respuesta.end(JSON.stringify(cuerpo));
}
function leerCuerpo(solicitud) {
    return new Promise((resolver, rechazar) => {
        let contenido = '';
        solicitud.on('data', (fragmento) => { contenido += fragmento.toString(); });
        solicitud.on('end', () => {
            try {
                resolver(JSON.parse(contenido));
            }
            catch {
                rechazar(new Error('El cuerpo debe ser JSON válido.'));
            }
        });
        solicitud.on('error', rechazar);
    });
}
function validarProducto(entrada, id) {
    const datos = entrada && typeof entrada === 'object' ? entrada : {};
    const errores = [];
    const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
    const categoria = typeof datos.categoria === 'string' ? datos.categoria.trim() : '';
    const sku = typeof datos.sku === 'string' ? datos.sku.trim().toUpperCase() : '';
    const precio = typeof datos.precio === 'number' ? datos.precio : 0;
    const stock = typeof datos.stock === 'number' ? datos.stock : -1;
    const camposRequeridos = ['nombre', 'categoria', 'sku', 'precio', 'stock'];
    camposRequeridos.forEach((campo) => { if (!(campo in datos))
        errores.push(`El campo ${campo} es obligatorio.`); });
    if (!nombre)
        errores.push('El nombre debe ser texto no vacío.');
    if (!categoria)
        errores.push('La categoría debe ser texto no vacío.');
    if (!sku)
        errores.push('El SKU debe ser texto no vacío.');
    if (!Number.isFinite(precio) || precio <= 0)
        errores.push('El precio debe ser un número mayor que 0.');
    if (!Number.isInteger(stock) || stock < 0)
        errores.push('El stock debe ser un entero igual o mayor que 0.');
    if (sku && productos.some((producto) => producto.sku.toLowerCase() === sku.toLowerCase() && producto.id !== id))
        errores.push('El SKU ya está en uso.');
    if (errores.length > 0)
        return { errores };
    return { datos: { nombre, categoria, sku, precio, stock }, errores };
}
export function middlewareProductos(solicitud, respuesta, siguiente) {
    if (!solicitud.url?.startsWith('/api/products') || !['POST', 'PUT'].includes(solicitud.method ?? ''))
        return siguiente();
    const coincidencia = solicitud.url.match(/^\/api\/products\/?([^/]*)$/);
    const id = coincidencia?.[1] || undefined;
    if (solicitud.method === 'PUT' && !id)
        return responder(respuesta, 400, { mensaje: 'El ID del producto es obligatorio.' });
    void leerCuerpo(solicitud).then((entrada) => {
        const validacion = validarProducto(entrada, id);
        if (!validacion.datos)
            return responder(respuesta, 400, { mensaje: 'Los datos del producto no son válidos.', errores: validacion.errores });
        if (id) {
            const indice = productos.findIndex((producto) => producto.id === id);
            if (indice < 0)
                return responder(respuesta, 404, { mensaje: 'Producto no encontrado.' });
            productos[indice] = { id, ...validacion.datos };
            return responder(respuesta, 200, { producto: productos[indice] });
        }
        const producto = { id: `prod-${crypto.randomUUID()}`, ...validacion.datos };
        productos.push(producto);
        return responder(respuesta, 201, { producto });
    }).catch((error) => responder(respuesta, 400, { mensaje: error.message }));
}
