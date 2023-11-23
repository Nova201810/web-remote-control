from flask import Flask, request
from flask_socketio import SocketIO, emit
import json
import matlab
import matlab.engine
import numpy
import signal
import time

appFlask = Flask(__name__)
socketio = SocketIO(appFlask, cors_allowed_origins='*')
simStart = 'sim_start'
simUpdate = 'sim_update'
isSimulationInProgress = False
u1 = u2 = u3 = None

@socketio.on(simStart)
def simulate(data):
    def getValue(name):
        floatValue = float(data[name])
        return matlab.double(floatValue)
    print('simulation')
    # Initial values: 10.0, 298.15, 313.15, 8.95, 313.15
    global u1
    u1 = getValue('u1')
    global u2
    u2 = getValue('u2')
    global u3
    u3 = getValue('u3')
    y1 = getValue('y1')
    y2 = getValue('y2')
    x1 = y1
    x2 = y2
    global isSimulationInProgress
    isSimulationInProgress = True
    while isSimulationInProgress:
        res = mle.idnlgreysim(u1, u2, u3, x1, x2)
        arr = numpy.array(res)
        # Update values
        x1, x2 = arr[-1]
        stringifiedArr = str(arr.tolist())
        emit(simUpdate, json.dumps({ 'data': stringifiedArr }))
        time.sleep(1)

@socketio.on(simUpdate)
def update(data):
    def getValue(name):
        floatValue = float(data[name])
        return matlab.double(floatValue)
    global u1
    u1 = getValue('u1')
    global u2
    u2 = getValue('u2')
    global u3
    u3 = getValue('u3')

@socketio.on('disconnect')
def disconnected():
    print('disconnect')
    global isSimulationInProgress
    isSimulationInProgress = False
    emit('disconnect', {'data': 'Disconnected'})

if __name__ == '__main__':
    print('Running server')
    mle = matlab.engine.start_matlab() # start the matlab engine
    print('Matlab engine started')
    mle.loadModel(nargout=0)
    print('Model loaded')
    socketio.run(appFlask)
    mle.quit()