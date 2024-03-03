import './button.style.css'

export default function Button(props) {
 const { buttonText, onClickFunction } = props
 return (
  <button
   className='button'
   onClick={onClickFunction}
  >
   {buttonText}
  </button>
 )
}