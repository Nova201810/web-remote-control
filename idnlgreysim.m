function result = idnlgreysim(u1,u2,u3,y1,y2)

FileName      = 'cstr_m';                          % File describing the model structure.
Order         = [2 3 2];                           % Model orders [ny nu nx].
Parameters    = [1; 1; 35e6; 11850; ...            % Initial parameters.
                 1.98589; -5960; 480; 145];
InitialStates = [y1; y2];                 % Initial value of the initial states.
Ts            = 0;                                 % Time-continuous system.
nlgr = idnlgrey(FileName, Order, Parameters, InitialStates, Ts, 'Name', ...
                'Stirred tank reactor',  ...
                'TimeUnit', 'hours');
nlgr.InputName = {'Concentration of A in inlet feed stream'   ...   % u(1).
                         'Inlet feed stream temperature'             ...   % u(2).
                         'Jacket coolant temperature'};                % u(3).
nlgr.InputUnit = {'kgmol/m^3' 'K' 'K'};
nlgr = setinit(nlgr, 'Name', {'Concentration of A in reactor tank'          ...   % x(1).
                       'Reactor temperature'});                      ...   % x(2).
nlgr = setinit(nlgr, 'Unit', {'kgmol/m^3' 'K'});
nlgr = setinit(nlgr, 'Fixed', {false false});
nlgr.OutputName = {'A Concentration' ...   % y(1); Concentration of A in reactor tank
                         'Reactor temp.'};   % y(2).
nlgr.OutputUnit = {'kgmol/m^3' 'K'};
nlgr = setpar(nlgr, 'Name', {'Volumetric flow rate (volume/time)'                   ...   % F.
                      'Volume in reactor'                                    ...   % V.
                      'Pre-exponential nonthermal factor'                    ...   % k_0.
                      'Activation energy'                                    ...   % E.
                      'Boltzmann''s ideal gas constant'                       ...   % R.
                      'Heat of reaction'                                     ...   % H.
                      'Heat capacity times density'                          ...   % HD.
                      'Overall heat transfer coefficient times tank area'}); ...   % HA.
nlgr = setpar(nlgr, 'Unit', {'m^3/h' 'm^3' '1/h' 'kcal/kgmol' 'kcal/(kgmol*K)'      ...
                      'kcal/kgmol' 'kcal/(m^3*K)' 'kcal/(K*h)'});
nlgr.Parameters(1).Fixed = true;   % Fix F.
nlgr.Parameters(2).Fixed = true;   % Fix V.
nlgr.Parameters(5).Fixed = true;   % Fix R.
nlgr.Parameters(6).Fixed = true;   % Fix H.
nlgr.Parameters(1).Minimum = 0;   % F.
nlgr.Parameters(2).Minimum = 0;   % V.
nlgr.Parameters(3).Minimum = 0;   % k_0.
nlgr.Parameters(4).Minimum = 0;   % E.
nlgr.Parameters(5).Minimum = 0;   % R.
nlgr.Parameters(6).Maximum = 0;   % H.
nlgr.Parameters(7).Minimum = 0;   % HD.
nlgr.Parameters(8).Minimum = 0;   % HA.

inp = [u1, u2, u3];
state = [y1, y2];
zv = iddata(state, inp, 0.1);
zv.InputName = nlgr.InputName;
zv.InputUnit = nlgr.InputUnit;
zv.OutputName = nlgr.OutputName;
zv.OutputUnit = nlgr.OutputUnit;
zv.Tstart = 0;
zv.TimeUnit = 'hour';

mdl = 'cstr_sim';
if ~evalin('base', 'exist(''zv'', ''var'')')
    cstrws = get_param(bdroot, 'modelworkspace');
    cstrws.assignin('zv', zv);
    cstrws.assignin('nlgr', nlgr);
end

sim(mdl);
if ~exist('zsim', 'var')
 zsim = evalin('base', 'zsim');
end
zsim.InputName = nlgr.InputName;
zsim.InputUnit = nlgr.InputUnit;
zsim.OutputName = nlgr.OutputName;
zsim.OutputUnit = nlgr.OutputUnit;
zsim.TimeUnit = 'hour';
result = zsim.OutputData; 