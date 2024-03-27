import React from 'react';
import { secondsToTime } from '../utils/seconds-to-time';

interface Props {
  mainTimer: number;
}

export function Timer(props: Props): JSX.Element {
  return <div className="timer">{secondsToTime(props.mainTimer)}</div>;
}
