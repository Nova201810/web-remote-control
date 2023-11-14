import React, { useEffect } from 'react';

import ConcentrationChart from './components/ConcentrationChart/index.jsx';
import TemperatureChart from './components/TemperatureChart/index.jsx';
import LabelledField from './components/LabelledField/index.jsx';
import Button from './components/Button/index.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import './App.css';

function App() {
  const { y1, y2, isSimulationActive, startSimulation, stopSimulation } = useSimulation();

  const hasSimulationResults = Boolean(y1 || y2);
  const isWaitForSimulation = !(isSimulationActive || hasSimulationResults);
  const isLoadSimulation = isSimulationActive && !hasSimulationResults;

  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const simulateData = {
      u1: formData.get('u1'),
      u2: formData.get('u2'),
      u3: formData.get('u3'),
      y1: formData.get('y1'),
      y2: formData.get('y2'),
    };
    startSimulation(simulateData);
  };

  useEffect(function scrollToChartsOnDrawing() {
    if (hasSimulationResults) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [hasSimulationResults]);

  return (
    <div className="App">
      <div className="App_Content">
        <form method="POST" onSubmit={onSubmit} className="App_Content__State">
          <legend>
            <h1 className="App_Content__Label">
              Контроль процесса перемешивания
            </h1>
          </legend>
          <div className="App_Content__Fields">
            <fieldset className="Fields_Block">
              <legend className="Fields_Block__Label">Входные параметры</legend>
              <LabelledField
                label="Концентрация A во входном потоке сырья [кгмоль/м^3]"
                name="u1"
                type="number"
                step="0.001"
                required
              />
              <LabelledField
                label="Температура входного питательного потока [K]"
                name="u2"
                type="number"
                step="0.001"
                required
              />
              <LabelledField
                label="Температура охлаждающей жидкости в рубашке [K]"
                name="u3"
                type="number"
                step="0.001"
                required
              />
            </fieldset>
            <fieldset className="Fields_Block">
              <legend className="Fields_Block__Label">Исходное состояние процесса</legend>
              <LabelledField
                label="Концентрация A в резервуаре реактора [кгмоль/м^3]"
                name="y1"
                type="number"
                step="0.001"
                required
              />
              <LabelledField
                label="Температура реактора [K]"
                name="y2"
                type="number"
                step="0.001"
                required
              />
            </fieldset>
          </div>
          <div className="App_Content__Actions">
            <Button kind="start" type="submit" disabled={isSimulationActive}>Запустить</Button>
            {hasSimulationResults && (
              <Button kind="stop" type="button" disabled={!isSimulationActive} onClick={stopSimulation}>
                Остановить
              </Button>
            )}
          </div>
        </form>
        <div className="App_Content__Results">
          {isWaitForSimulation && (
            <div className="App_Content__Results--empty">Запустите симуляцию чтобы увидеть результаты</div>
          )}
          {isLoadSimulation && (
            <div className="App_Content__Results--loading">Загрузка...</div>
          )}
          {hasSimulationResults && (
            <div className="App_Content__Results--filled">
              <ConcentrationChart data={y1} />
              <TemperatureChart data={y2} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
