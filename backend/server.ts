// Punto de entrada del servidor backend
// Inicia el servidor Express en el puerto especificado

import app from './app';

const PORT = process.env.PORT || 3000;

// Iniciar servidor y escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});