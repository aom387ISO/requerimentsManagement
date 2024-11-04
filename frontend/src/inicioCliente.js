import React, { useState } from 'react';
import './incioCliente.css';

const data = [
  {
    projectName: 'Nombre del proyecto 1',
    requirements: [
      { name: 'Nombre del requisito 1', weight: 5, time: '4h30m', priority: 1 },
      { name: 'Nombre del requisito 2', weight: 2, time: '2h30m', priority: 2 },
      { name: 'Nombre del requisito 3', weight: 3, time: '7h', priority: 3 },
    ],
  },
  {
    projectName: 'Nombre del proyecto 3',
    requirements: [],
  },
];

function InicioCliente() {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  return (
    <div className="main-container">
      <div className="header">
        <button className="logout-button">Cerrar sesión</button>
      </div>
      
      <div className="table-container">
        <div className="table-header">
          <div className="title">Nombre</div>
          <div className="title">Peso</div>
          <div className="title">Tiempo</div>
          <div className="title">Prioridad</div>
        </div>

        {data.map((project, index) => (
          <div key={index} className="row">
            <div className="project-row">
              <button onClick={() => toggleRow(index)}>
                {expandedRows[index] ? '-' : '+'}
              </button>
              <span className="project-name">{project.projectName}</span>
            </div>
            
            {expandedRows[index] && project.requirements.map((req, reqIndex) => (
              <div key={reqIndex} className="requirement-row">
                <span className="requirement-name">{req.name}</span>
                <span className="weight">
                  {req.weight} <button className="edit-weight">Modificar peso</button>
                </span>
                <span>{req.time}</span>
                <span className={`priority priority-${req.priority}`}>{req.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InicioCliente;