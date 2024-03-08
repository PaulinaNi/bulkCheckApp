import { useState, useEffect } from 'react';
import './App.css'

// components imports
import BaySearchForm from './components/baySearchForm/baySearchForm.componet'
import BoxTable from './components/boxTable/boxTable.component'

// This application works in 3 stages:
// - stage 1 – The user inputs the bay location, and the application passes that information to the state.
// - stage 2 - The application uses a hook to communicate with the database and search which boxes are in that bay. Information is displayed for the user, so the user can check the bay and tick all boxes which are in the bay. Then the user can click finish. 
//  - stage 3 - The application displays all boxes which haven’t been ticked and asks the user to put them on the missing. The button - start next check - is displayed and the user after clicking it will be directed to stage 1 again. 

function App() {

  // all states
  //state to display content for stage
  const [stage, setStage] = useState('stage1')
  //state to keep bay location provided by user
  const [bayLocation, setBayLocation] = useState('')
  //state to keep all boxes located in the location
  const [boxesFromLocation, setBoxesFromLocation] = useState('')
  //state to keep all missing boxes in the location
  const [missingBoxes, setMissingBoxes] = useState('')

  //stage 1 code
  // function which is passed to BaySearchForm so component can return bay location value
  function handleSubmitOfBaySearchForm(bayLocationFromForm, event) {
    event.preventDefault();
    setBayLocation(bayLocationFromForm)
    setStage('stage2')
  }

  //stage 2 code
  //load database and create an array to display all boxes in the location by filtering
  useEffect(() => {
    //only pulling data from DB if bayLocation is set
    if (bayLocation.length > 1) {
      fetch('./example_db.json')
        .then(response => response.json())
        .then(boxes => {
          // filterdBoxes collect all boxes from the selected location
          const filterdBoxes = boxes.filter(box => box.bayLocation === bayLocation)
          // boxesToDisplay - will create an array with only the data needed to be displayed so that we don't store unnecessary data
          const boxesToDisplay = filterdBoxes.map(box => {
            return {
              id: box._id,
              product: box.product,
              rNum: box.rNumber,
              isSelected: false
            }
          })

          //sorting by R-number using string method localeCompare()
          const sortedBoxesToDisplay = boxesToDisplay.sort((a, b) => {
            return a.rNum.localeCompare(b.rNum, undefined, {
              numeric: true,
            })
          });

          //passing data to state   
          setBoxesFromLocation(sortedBoxesToDisplay)
        })
        .catch(e => console.log(e))
    }
  }, [bayLocation])

  //stage 3 code
  //function which is passed to BoxTable so component can return missing boxes which need to be put on missing
  function showBoxesMissingInTheBay(onlyMissingBoxes) {
    setMissingBoxes(onlyMissingBoxes)
    setStage('stage3')
  }
  //function which is passed to BoxTable to start checking new bay
  function startNewBay() {
    setStage('stage1')
    setBayLocation('')
  }

  // function which pass which missing bin use - M07M01/M08M01 etc
  function missingBin() {
    if (bayLocation[0] === 'E') {
      return 'M55M01'
    } else if (bayLocation[0] === 'B' || bayLocation[0] === 'D' || bayLocation[0] === 'F') {
      return 'M07M01'
    } else if (bayLocation[0] === 'J' || bayLocation[0] === 'K' || bayLocation[0] === 'L') {
      return 'M08M01'
    } else if (bayLocation[0] === 'N' || bayLocation[0] === 'R') {
      return 'M09M01'
    } else if (bayLocation[0] === 'Q') {
      return 'M06M01'
    } else {
      return ''
    }
  }

  return (
    <main className='app'>
      <h1>For demonstration purposes, the database is set for only 3 bulk locations: B07A05, E03C08, Q01A01</h1>

      {(bayLocation) && <p className='bayLocationDisplay'>{bayLocation}</p>}

      {/* Stage 1*/}
      {(stage === 'stage1') && <BaySearchForm handleSubmitOfBaySearchForm={handleSubmitOfBaySearchForm} />}

      {/* Stage 2 */}
      {(stage === 'stage2') && boxesFromLocation.length === 0 &&
        <p className='noBoxesInBay'>
          This bay doesn't exist or is empty. Check your spelling.
        </p>}
      {(stage === 'stage2') && <BoxTable boxes={boxesFromLocation} showBoxesMissingInTheBay={showBoxesMissingInTheBay} stage='stage2' />}


      {/* Stage 3 */}
      {(stage === 'stage3') && <BoxTable boxes={missingBoxes} startNewBay={startNewBay} missingBin={missingBin()} stage='stage3' />}

    </main>
  )
}

export default App