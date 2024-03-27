import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToTime } from '../utils/seconds-to-time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-finish.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-start.mp3');

const audioStart = new Audio(bellStart);
const audioFinish = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortTime: number;
  longTime: number;
  cycles: number;
}

export function PromodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeWorked, setTimeWorked] = React.useState(0);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [timeBlocks, setTimeBlocks] = React.useState(0);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cycles, setCycles] = React.useState(0);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
  }, [working]);

  const configWorking = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStart.play();
  };
  const configRest = (long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);
    audioFinish.play();
    if (long) {
      setMainTime(props.longTime);
    } else {
      setMainTime(props.shortTime);
    }
  };

  const currentCycles = (blocks: number, cycle: number) => {
    const currentCycle = blocks / cycle;
    setCycles(Math.floor(currentCycle));
  };

  // para tempo trabalhado
  useInterval(
    () => {
      setTimeWorked(timeWorked + 1);
    },
    // se estiver contando e trabalhando o intervalo será de 1000 ms = 1 segundo
    working && timeCounting ? 1000 : null,
  );

  // para o decrescimo
  useInterval(
    () => {
      setMainTime(mainTime - 1);
      currentCycles(timeBlocks, props.cycles);

      if (working && mainTime <= 1.01) {
        setTimeBlocks(timeBlocks + 1);
        if (timeBlocks / cycles == props.cycles) {
          configRest(true);
          console.log('tempo longo');
        } else {
          configRest(false);
          console.log('tempo curto');
        }
      } else if (!working && mainTime <= 0) {
        configWorking();
        setMainTime(props.pomodoroTime);
      }
    },
    // se estiver contando o intervalo será de 1000 ms = 1 segundo
    timeCounting ? 1000 : null,
  );

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTimer={mainTime}></Timer>
      <div className="controls">
        <Button
          className="jonas"
          text="iniciar"
          onClick={() => configWorking()}
        ></Button>
        <Button
          className="jonas"
          text="Rest"
          onClick={() => configRest(false)}
        ></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>
      <div className="details">
        <h2>Details:</h2>
        <p>Cycles: {cycles}</p>
        <p>Total Working time: {secondsToTime(timeWorked)}</p>
        <p>Time blocks (pomodoros): {timeBlocks}</p>
      </div>
    </div>
  );
}
