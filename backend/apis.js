const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const app = express();
const WebSocket = require('ws')
app.use(cors());
app.use(express.json());
const apiKey = 'oYzka98_7LOuw8DqhUIxHK9qqh1Rpqp4';

const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NVDA', 'PYPL', 'INTC', 'CSCO', 'IBM', 'NFLX', 'ADBE', 'AMD', 'C', 'DIS', 'V', 'GS', 'JPM', 'BAC'];

app.post('/input',async(req,res)=>{
    const n=req.body.val;
    const stocks = JSON.parse(fs.readFileSync('stocks_data.json', 'utf8'));
    let data = Object.entries(stocks).slice(0, n);
    res.status(200);
    res.send({msg:'ok',data:data});
})

function getNstocks(n){
    const locale = 'us';
    const market = 'stocks';
    const limit = n;
    const url = `https://api.polygon.io/v2/snapshot/locale/${locale}/markets/${market}/tickers`;
    const params = {
        apiKey: apiKey,
        sort: 'day',
        order: 'desc',
        limit: limit,
    };
    const stocksData = {};

    axios.get(url, { params })
        .then(response => {
            const topStocks = response.data.tickers;
            topStocks.forEach(stock => {
                const refreshInterval = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                stocksData[stock.ticker] = { openPrice:stock.day.open, refreshInterval };
                console.log(`Symbol: ${stock.ticker}, Open Price: ${stock.day.open}`);
            });
            fs.writeFileSync('stocks_data.json', JSON.stringify(stocksData, null, 2));
        })
        .catch(error => {
            console.error('Error setting up the request:', error);
        });
}
//// get top 20 stocks/////////
// getNstocks(20);











// const stocksData = {};
// function getStockData(symbol) {
//     const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev`;
//     const params = {
//         apiKey: apiKey,
//         limit: 1,
//         adjusted: true,
//     };

//     return axios.get(url, { params })
//         .then(response => {
//             console.log('res',response)
//             response.data?.results[0].o})
//         .catch(error => {
//             console.error(`Error fetching data for ${symbol}: ${error}`);
//             return null;
//         });
// }

// function stockData(){
//     for (const symbol in stocks) {
//         const refreshInterval = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
//         updateStockPrices(symbol,refreshInterval)
//     }
// }
// async function updateStockPrices(symbol,refreshInterval) {
//     const openPrice = await getStockData(symbol)
//     if (openPrice !== null) {
//         stocksData[symbol] = { openPrice, refreshInterval };
//         console.log('refresh interval: ',openPrice, refreshInterval)
//         broadcastStockPrice(symbol, openPrice);
//         setTimeout(() => updateStockPrices(symbol, refreshInterval), 1000 * refreshInterval);
//     }            
// }
// function broadcastStockPrice(symbol, price) {
//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({ symbol, price }));
//         }
//     });
// }

// function saveStockData() {
//     fs.writeFileSync('stocks_data.json', JSON.stringify(stocksData, null, 2));
// }

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', ws => {
//     console.log('Client connected');

//     ws.send(JSON.stringify(stocksData));

//     ws.on('close', () => console.log('Client disconnected'));
// });


// stockData();
// setInterval(saveStockData, 1000 * 60 * 5);
app.listen(5000)