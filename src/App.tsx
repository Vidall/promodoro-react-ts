import React from 'react';
import { PromodoroTimer } from './components/pomodoro-timer';

function App() {
  return (
    <div className="App">
      <PromodoroTimer
        pomodoroTime={10} //1500
        shortTime={5} // 300
        longTime={8} // 900
        cycles={4}
      />
    </div>
  );
}

export default App;
