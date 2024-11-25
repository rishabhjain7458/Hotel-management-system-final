import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigationBar from './components/navigationBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <NavigationBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
    </Router>
  );
}

export default App
