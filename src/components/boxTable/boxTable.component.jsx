import './boxTable.style.css'
import { useState, useEffect } from "react"
import Button from "../button/button.component"

export default function BoxTable(props) {
  //this component will be loaded differently depending on what stage it is in

  const { boxes, showBoxesMissingInTheBay, stage, startNewBay, missingBin } = props

  //state to keep all boxes from the location and by able to control checkboxes 
  const [allBoxes, setAllBoxes] = useState([])

  //loading passed boxes to state
  useEffect(() => setAllBoxes([...boxes]), [boxes])

  // function to handle state change when chackbox is selected
  const handleCheckbox = (event, id) => {
    const isChacked = event.target.checked
    setAllBoxes(prevAllBoxes => prevAllBoxes.map(boxFromState => {
      return boxFromState.id === id ?
        { ...boxFromState, isSelected: isChacked } : boxFromState
    }))
  }

  //function to sort boxes by r-number
  function sortByProduct() {
    const arrayToSort = [...allBoxes]
    const sortedByProduct = arrayToSort.sort((a, b) => {
      return a.product.localeCompare(b.product)
    })
    setAllBoxes(sortedByProduct)
  }

  //function to sort boxes by product
  function sortByRNum() {
    const arrayToSort = [...allBoxes]
    const sortedByRNum = arrayToSort.sort((a, b) => {
      return a.rNum.localeCompare(b.rNum, undefined, {
        numeric: true,
      })
    })
    setAllBoxes(sortedByRNum)
  }

  return (
    <div className='tableContainer'>

      {allBoxes.length >= 1 && stage === 'stage2' &&
        <p>
          Boxes in the bay: {allBoxes.length}
        </p>
      }

      {allBoxes.length === 0 && stage === 'stage3' &&
        <p>No missing boxes in that bay</p>
      }
      {allBoxes.length >= 1 && stage === 'stage3' &&
        <div>
          <p>Missing boxes in the bay: {allBoxes.length}</p>
          <p>Please put all below boxes to missing bin {missingBin}</p>
        </div>
      }


      {/* buttons for sorting boxes by product or R-number */}
      {allBoxes.length >= 1 && stage === 'stage2' &&
        <Button
          buttonText={'Sort by product'}
          onClickFunction={() => sortByProduct()}
        />}
      {allBoxes.length >= 1 && stage === 'stage2' &&
        <Button
          buttonText={'Sort by R-number'}
          onClickFunction={() => sortByRNum()}
        />}

      <table className='table'>
        {allBoxes.length >= 1 &&
          <thead>
            <tr>
              <th>Product</th>
              <th>R-number</th>
              {stage === 'stage2' && <th>In bay?</th>}
            </tr>
          </thead>
        }
        <tbody>
          {allBoxes.length >= 1 && allBoxes.map(box => {
            return <tr key={box.id}>
              <td>{box.product}</td>
              <td>{box.rNum}</td>
              {stage === 'stage2' &&
                <td>
                  <input
                    className='checkbox'
                    type="checkbox"
                    id="isInBay"
                    name="isInBay"
                    checked={box.isSelected}
                    onChange={(event) => {
                      const id = box.id
                      handleCheckbox(event, id)
                    }}
                  />
                </td>}
            </tr>
          })}
        </tbody>
      </table>

      {stage === 'stage2' &&
        <Button
          buttonText={'Finish'}
          onClickFunction={() => {
            const missingBoxes = allBoxes.filter(box => box.isSelected === false)
            showBoxesMissingInTheBay(missingBoxes)
          }} />}

      {stage === 'stage3' &&
        <Button
          buttonText={'Start new bay'}
          onClickFunction={() => startNewBay()} />}
    </div>
  )
}