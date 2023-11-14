function loadModel
mdl = 'cstr_sim';
load_system('cstr_sim');
set_param(mdl, 'StopTime','1', 'SolverType','Fixed-step', 'FixedStep','0.1', 'SimulationMode','Accelerator');