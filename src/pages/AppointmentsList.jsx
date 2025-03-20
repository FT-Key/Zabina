import React, { useEffect, useState } from 'react';
import { fetchServerData, putServerData } from '../helpers/ServerCalling';
import { getToken } from '../helpers/Token.helper';
import '../css/AppointmentList.css';
import { formatDate } from '../helpers/FormatDateHTML';
import { Col, Container, Row } from 'react-bootstrap';
import CustomButton from '../components/CustomButton';
import { Helmet } from 'react-helmet-async';

const AppointmentList = () => {
  const [turnos, setTurnos] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);

  useEffect(() => {
    const fetchTurnos = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = getToken();

      try {
        const response = await fetchServerData(apiUrl, '/turnos/listaTurnos', token);

        if (Array.isArray(response) && response.length > 0) {
          const listaTurnos = response.map(turno => ({
            ...turno,
            fecha: formatDate(turno.fecha),
          }));

          setTurnos(listaTurnos);
        }
      } catch (error) {
        console.error('Error al obtener turnos:', error);
      }
    };
    fetchTurnos();
  }, [updateMark]);

  const handleCancelButton = async (turnoId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const response = await putServerData(apiUrl, '/turnos/cancelarTurno', { turnoId }, token);

      setUpdateMark(prev => !prev);
    } catch (error) {
      console.error('Error al obtener turnos:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Mis Turnos</title>
      </Helmet>
      <div className='appointmentList px-5'>
        {turnos && turnos.length > 0
          ?
          (<Container fluid className='list mb-3'>
            <h2 className='text-center pb-3'>Turnos</h2>

            <div>
              <Row key={'header'} className='header text-white d-none d-md-flex'>
                <Col xs={12} md={3}>
                  Tipo de atención
                </Col>

                <Col xs={12} md={2}>
                  Estado
                </Col>

                <Col xs={12} md={3}>
                  Descripción
                </Col>

                <Col xs={12} md={1}>
                  Fecha
                </Col>

                <Col xs={12} md={1}>
                  Hora
                </Col>

                <Col xs={12} md={2}>
                  Cancelar
                </Col>
              </Row>
              {turnos.map((turno) => (
                <Row key={turno._id} className='text-center'>
                  <Col xs={12} md={3}>
                    {turno.tipoAtencion}
                  </Col>

                  <Col className={ESTADOS_TURNO_COLOR[turno.estado]} xs={12} md={2}>
                    {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                  </Col>

                  <Col xs={12} md={3}>
                    {turno.descripcion}
                  </Col>

                  <Col xs={12} md={1}>
                    {turno.fecha}
                  </Col>

                  <Col xs={12} md={1}>
                    {turno.hora}
                  </Col>

                  <Col xs={12} md={2}>
                    {!['completado', 'cancelado', 'no asistido', 'caducado'].includes(turno.estado)
                      ?
                      (<CustomButton
                        paddingB={false}
                        className={"my-1"}
                        variant={'danger'}
                        buttonText={'Cancelar'}
                        onClick={() => handleCancelButton(turno._id)}
                      />)
                      :
                      (
                        <span className='false-btn'>-</span>
                      )
                    }
                  </Col>
                </Row>
              ))}
            </div>
          </Container>)
          :
          <div>
            <h2 className='empty'>No tiene turnos.</h2>
          </div>
        }
      </div>
    </>
  );
};

const ESTADOS_TURNO_COLOR = {
  libre: 'turnoLibre',
  pendiente: 'turnoPendiente',
  completado: 'turnoCompletado',
  cancelado: 'turnoCancelado',
  'no asistido': 'turnoNoAsistido',
  confirmado: 'turnoConfirmado',
  caducado: 'turnoCaducado',
};

export default AppointmentList;