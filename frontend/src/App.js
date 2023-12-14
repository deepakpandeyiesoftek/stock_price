import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [input, setInput] = useState(0);
  const [stockData, setStockData] = useState({});
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    let symbolsString = symbols.map(item => {
      return `A.${item[0]},`;
    }).join('');
    symbolsString = symbolsString.replace(/,$/, '');
    const ws = new WebSocket(`wss://socket.polygon.io/stocks`);
    ws.onopen = () => {
      ws.send('{"action":"auth","params":"oYzka98_7LOuw8DqhUIxHK9qqh1Rpqp4"}');
      ws.send(`{"action":"subscribe","params":${symbolsString}}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStockData(prevData => ({ ...prevData, [data.symbol]: data.price }));
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols]);

  const callInputApi = async ()=>{
    try {
      let result = await fetch('http://localhost:5000/input', {
          method: 'post',
          body: JSON.stringify({ val: input }),
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (result.ok) {
          result = await result.json();
          setSymbols(result.data);
          console.log(result);
      } else {
          console.error('Failed to fetch:', result.status, result.statusText);
      }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
  }

  return (
    <div>
      <h1>Live Stock Prices</h1>
      <div>
        <span>Enter number of stocks : </span>
        <input type='text' onChange={(e)=>setInput(e.target.value)} />
        <button onClick={callInputApi}>Submit</button>
      </div>
      {JSON.stringify(stockData).length>2?
      <ul>
        {Object.entries(stockData).map(([symbol, price]) => (
          <li key={symbol}>{symbol}: {price}</li>
        ))}
      </ul>
      :
      <></>
      // <span>call Api to view data</span>
      }
    </div>
  );
}

export default App;
