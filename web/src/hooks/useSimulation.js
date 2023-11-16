import { useState, useEffect, useRef, useReducer } from 'react';
import { io } from "socket.io-client";

export const useSimulation = () => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [socket, setSocket] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const results = useRef(null);
  const time = useRef(0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const startEvent = 'sim_start';
  const updateEvent = 'sim_update';

  const stopSimulation = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsSimulationActive(false);
      setSavedData(null);
    }
  }

  const updateSimulation = (data) => {
    if (socket) {
      setSavedData(data);
      socket.emit(updateEvent, data);
    }
  };

  const formatValue = (value, digits = 1) => {
    return +Number.parseFloat(value).toFixed(digits);
  };

  const getResults = (data) => {
    const initX1 = [];
    const initX2 = [];
    const results = data.reduce((res, point) => {
      const currentTime = time.current;
      res[0].push({ time: currentTime, value: formatValue(point[0], 3) });
      res[1].push({ time: currentTime, value: formatValue(point[1], 3) });
      time.current = formatValue(time.current + 0.1);
      return res;
    }, [initX1, initX2])
    return results;
  };

  const startSimulation = (data) => {
    const webSocket = io("localhost:5000/", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });
    setSocket(webSocket);
    setIsSimulationActive(true);
    results.current = null;
    time.current = 0;
    setSavedData(data);
    webSocket.emit(startEvent, data);
    webSocket.on(updateEvent, (socketData) => {
      const { data } = JSON.parse(socketData);
      const dataArr = JSON.parse(data);
      if (!results.current) {
        const [newX1, newX2] = getResults(dataArr);
        results.current = {
          x1: [...newX1],
          x2: [...newX2],
        };
      } else {
        const [, ...simulationData] = dataArr;
        const [newX1, newX2] = getResults(simulationData);
        const { x1, x2 } = results.current;
        results.current.x1 = [...x1, ...newX1];
        results.current.x2 = [...x2, ...newX2];
      }
      forceUpdate();
    });
  }

  useEffect(() => {
    return stopSimulation;
  }, [socket]);

  const { x1, x2 } = results.current ?? {};
  const savedFields = savedData ?? {};

  return {
    x1,
    x2,
    savedFields,
    isSimulationActive,
    startSimulation,
    updateSimulation,
    stopSimulation,
  };
};