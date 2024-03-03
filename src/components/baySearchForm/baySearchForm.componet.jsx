import './baySearchForm.style.css'
import { useState } from "react"

export default function BaySearchForm(props) {
 const { handleSubmitOfBaySearchForm } = props

 const [baySearchFormControl, setBaySearchFormControl] = useState()

 function handleChangeInForm(event) {
  setBaySearchFormControl(event.target.value.toUpperCase())
 }

 return (
  <form className='form' onSubmit={() => handleSubmitOfBaySearchForm(baySearchFormControl, event)}>
   <div className='bayInputContainer'>
    <label className='bayInputLabel' htmlFor='bayLocation'>Bay location:</label>
    <input className='bayInputText' type='text' name='bayLocation' id='bayLocation' onChange={handleChangeInForm} required />
   </div>
   {/* <Button buttonText='Go to bay'/> */}
   <input className='submitButton' type="submit" value='Go to bay' />
  </form>
 )
}