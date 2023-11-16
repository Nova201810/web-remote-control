import React, { useEffect, useState } from 'react';

import ConcentrationChart from './components/ConcentrationChart/index.jsx';
import TemperatureChart from './components/TemperatureChart/index.jsx';
import LabelledField from './components/LabelledField/index.jsx';
import Button from './components/Button/index.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import './App.css';

function App() {
  const [u1, setU1] = useState('');
  const [u2, setU2] = useState('');
  const [u3, setU3] = useState('');
  const [y1, setY1] = useState('');
  const [y2, setY2] = useState('');
  const { x1, x2, savedFields, isSimulationActive, startSimulation, updateSimulation, stopSimulation } = useSimulation();

  const hasSimulationResults = Boolean(x1 || x2);
  const isWaitForSimulation = !(isSimulationActive || hasSimulationResults);
  const isLoadSimulation = isSimulationActive && !hasSimulationResults;
  const hasActiveSimulationProcess = hasSimulationResults && isSimulationActive;
  const isU1Updated = u1 !== savedFields.u1;
  const isU2Updated = u2 !== savedFields.u2;
  const isU3Updated = u3 !== savedFields.u3;
  const hasUpdatedFields = [isU1Updated, isU2Updated, isU3Updated].some(Boolean);

  const onChangeWrapper = (setFn) => (event) => {
    const { value } = event.target;
    setFn(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const simulateData = { u1, u2, u3, y1, y2 };
    startSimulation(simulateData);
  };

  const onUpdate = () => {
    const data = { u1, u2, u3, y1, y2 };
    updateSimulation(data);
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
                isUpdated={hasActiveSimulationProcess && isU1Updated}
                label="Концентрация A во входном потоке сырья [кгмоль/м^3]"
                name="u1"
                type="number"
                step="0.001"
                min="0"
                required
                value={u1}
                onChange={onChangeWrapper(setU1)}
              />
              <LabelledField
                isUpdated={hasActiveSimulationProcess && isU2Updated}
                label="Температура входного питательного потока [K]"
                name="u2"
                type="number"
                step="0.001"
                min="0"
                required
                value={u2}
                onChange={onChangeWrapper(setU2)}
              />
              <LabelledField
                isUpdated={hasActiveSimulationProcess && isU3Updated}
                label="Температура охлаждающей жидкости в рубашке [K]"
                name="u3"
                type="number"
                step="0.001"
                min="0"
                required
                value={u3}
                onChange={onChangeWrapper(setU3)}
              />
            </fieldset>
            <fieldset className="Fields_Block">
              <legend className="Fields_Block__Label">Исходное состояние процесса</legend>
              <LabelledField
                label="Концентрация A в резервуаре реактора [кгмоль/м^3]"
                name="y1"
                type="number"
                step="0.001"
                min="0"
                required
                disabled={isSimulationActive}
                value={y1}
                onChange={onChangeWrapper(setY1)}
              />
              <LabelledField
                label="Температура реактора [K]"
                name="y2"
                type="number"
                step="0.001"
                min="0"
                required
                disabled={isSimulationActive}
                value={y2}
                onChange={onChangeWrapper(setY2)}
              />
            </fieldset>
          </div>
          <div className="App_Content__Actions">
            {!hasActiveSimulationProcess && (
              <Button kind="primary" type="submit" disabled={isSimulationActive}>Запустить</Button>
            )}
            {hasActiveSimulationProcess && (
              <>
                <Button kind="secondary" type="submit" disabled={!hasUpdatedFields} onClick={onUpdate}>Обновить</Button>
                <Button kind="risky" type="button" onClick={stopSimulation}>
                  Остановить
                </Button>
              </>
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
              <ConcentrationChart data={x1} />
              <TemperatureChart data={x2} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
