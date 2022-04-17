import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import CryptoDetails from './components/CryptoDetails'
import HomePage from './components/HomePage';
import './App.css'

function App() {
  const [allData, setAllData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCoins, setCurrentCoins] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(false)
  const coinsPerpage = 10


  useEffect(() => {
    async function getData() {
      setLoading(true)
      const data = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_rank&per_page=100&page=1&sparkline=false")
      setAllData(data.data?.sort((a,b)=>  parseFloat(a.market_cap_rank) - parseFloat(b.market_cap_rank)))
      
      const indexLast = currentPage * coinsPerpage;
      const indexFirst = indexLast - coinsPerpage;
      setCurrentCoins(data?.data?.slice(indexFirst, indexLast))
      setTrending(data.data?.slice()
      .sort((a, b) => parseFloat(b.price_change_percentage_24h) - parseFloat(a.price_change_percentage_24h))
      .slice(0,4))
      setLoading(false)
    }
    getData()

// eslint-disable-next-line
  },[])

  useEffect(() => {
    const indexLast = currentPage * coinsPerpage;
    const indexFirst = indexLast - coinsPerpage;
    setCurrentCoins(allData?.slice(indexFirst, indexLast))
  }, [currentPage,allData])




  function updatePage(data) {
    const indexLast = currentPage * coinsPerpage;
    const indexFirst = indexLast - coinsPerpage;
    setCurrentCoins(data?.slice(indexFirst, indexLast))
  }


  function CoinDetails(){
    const {id}=useParams()
    return <CryptoDetails id={id} />
  }


  return (
    <>
    <div className="blocker">
      Please View in Desktop
    </div>
    <div className="app">
    <Router>
        { loading? <div className="loader">
          <span className="loadImg"></span>
          <p>Loading</p>
        </div>:
          <Routes>
          <Route path='/' element={<HomePage
              currentCoins={currentCoins}
              allData={allData}
              length={allData?.length}
              setCurrentPage={setCurrentPage}
              updatePage={updatePage}
              currentPage={currentPage}
              trending={trending} />}/>
            
          <Route path={`/details/:id`} element={<CoinDetails/>}/>
        </Routes>
        }
    </Router>
    </div>
    </>
  );
}

export default App;
