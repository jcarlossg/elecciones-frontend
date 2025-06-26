import React, { useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import api from '../api/api';
import { useEffect } from 'react';
export default function DetalleMesa() {
  const { id } = useParams();
  const { state } = useLocation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  // Iniciar cámara
  const iniciarCamara = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error al acceder a la cámara', err));
  };

  // Tomar foto
  const capturarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/png');
      setImageData(image);
    }
  };

  // Enviar al backend
const guardarFoto = async () => {
  if (!imageData) return;

  const payload = {
    idMesa: id,
    imagenBase64: imageData,
  };

  try {
    await api.post('/registro-foto/base64', payload);
    alert('Foto guardada correctamente');
  } catch (error) {
    console.error('Error al guardar la foto', error);
    alert('Error al guardar la foto');
  }
};
useEffect(() => {
  if (id) {
    api.get(`/registro-foto/mesa/${id}`)
      .then(res => setImageData(res.data))
      .catch(() => console.log('No se encontró imagen'));
  }
}, [id]);

  return (
    <Box p={4}>
      <Typography variant="h4">Detalle de Mesa {id}</Typography>

      {state ? (
        <Box mt={2}>
          <Typography>Recinto: {state.nombreRecinto}</Typography>
          <Typography>Mesa: {state.numeroMesa}</Typography>
        </Box>
      ) : (
        <Typography>No hay datos disponibles</Typography>
      )}

      <Box mt={4}>
        <video ref={videoRef} autoPlay width="100%" style={{ maxWidth: 400 }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {imageData && (
          <Box mt={2}>
            <Typography>Foto capturada:</Typography>
            <img src={imageData} alt="captura" width={300} />
          </Box>
        )}

        <Box mt={2}>
          <Button variant="contained" onClick={iniciarCamara} sx={{ mr: 2 }}>
            Iniciar Cámara
          </Button>
          <Button variant="contained" onClick={capturarFoto} sx={{ mr: 2 }}>
            Tomar Foto
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={guardarFoto}
            disabled={!imageData}
          >
            Guardar Foto
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
