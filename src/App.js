import React, { useState } from 'react'
import './App.css'
import Modal from './modal/index'

const tourGuideReferenceArray = [
  { id: 'one', content: 'This is the first item clicked ', position: 0 },
  { id: 'two', content: 'This is the second item clicked ', position: 1 },
  { id: 'three', content: 'This is the third item clicked ', position: 2 },
  { id: 'four', content: 'This is the fourth item clicked ', position: 3 },
  { id: 'five', content: 'This is the fifth item clicked ', position: 4 },
  { id: 'six', content: 'This is the sixth item clicked ', position: 5 },
  { id: 'seven', content: 'This is the seventh item clicked ', position: 6 },
]

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const toggleModal = () => setIsOpened(!isOpened)

  return (
    <div className='App'>
      <Modal tourGuideReferenceArray={tourGuideReferenceArray} toggleModal={toggleModal} open={isOpened}>
        <div />
      </Modal>
      <div className='grid'>
        <div  className='row one-row'></div>
        <div className='row two-rows'>
          <div id='two' className='item'>
            {' '}
            <h1 onClick={toggleModal}>
              {' '}
              Hey this is a modal === check it out{' '}
            </h1>{' '}
          </div>
          <div  id='three' className='item'></div>
        </div>
        <div className='row three-rows'>
          <div id='four' className='item'></div>
          <div className='item'></div>
          <div className='item'></div>
        </div>
        <div className='row two-rows'>
          <div id='five' className='item'></div>
          <div className='item' id='clonable'></div>
        </div>
        <div className='row four-rows '>
          <div className='item'></div>
          <div id='seven' className='item'></div>
          <div id='one' className='item'></div>
          <div className='item'></div>
        </div>
        <div className='row three-rows'>
          <div id='six' className='item'></div>
          <div className='item'></div>
          <div className='item'></div>
        </div>
      </div>
    </div>
  )
}

export default App


