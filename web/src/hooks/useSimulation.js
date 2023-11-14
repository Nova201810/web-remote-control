import { useState, useEffect, useRef, useReducer } from 'react';
import { io } from "socket.io-client";

export const useSimulation = () => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [socket, setSocket] = useState(null);
  const results = useRef(null);
  const time = useRef(0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const stopSimulation = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsSimulationActive(false);
    }
  }

  const formatValue = (value, digits = 1) => {
    return Number.parseFloat(value).toFixed(digits);
  };

  const getResults = (data) => {
    const initY1 = [];
    const initY2 = [];
    const results = data.reduce((res, point) => {
      const currentTime = time.current;
      res[0].push({ time: formatValue(currentTime), value: formatValue(point[0], 3) });
      res[1].push({ time: formatValue(currentTime), value: formatValue(point[1], 3) });
      time.current = currentTime + 0.1;
      return res;
    }, [initY1, initY2])
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
    const updateEvent = 'sim_update';
    webSocket.emit(updateEvent, data);
    webSocket.on(updateEvent, (socketData) => {
      const { data } = JSON.parse(socketData);
      const dataArr = JSON.parse(data);
      if (!results.current) {
        const [newY1, newY2] = getResults(dataArr);
        results.current = {
          y1: [...newY1],
          y2: [...newY2],
        };
      } else {
        const [, ...simulationData] = dataArr;
        const [newY1, newY2] = getResults(simulationData);
        const { y1, y2 } = results.current;
        results.current.y1 = [...y1, ...newY1];
        results.current.y2 = [...y2, ...newY2];
      }
      forceUpdate();
    });
  }

  useEffect(() => {
    return stopSimulation;
  }, [socket]);

  const { y1, y2 } = results.current ?? {};

  return {
    y1,
    y2,
    isSimulationActive,
    startSimulation,
    stopSimulation,
  };
};