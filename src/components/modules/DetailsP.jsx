import React from 'react';

const DetailsP = ({ id }) => {
    // Puedes usar el id aquí para hacer una solicitud a una API o para mostrar detalles
    return (
        <div>
            <h1>Detalles del Producto</h1>
            <p>ID: {id}</p>
            {/* Aquí puedes agregar más lógica para mostrar detalles */}
        </div>
    );
};

export default DetailsP;