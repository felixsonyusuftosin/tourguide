import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const appRoot = document.getElementById('root')
const modalRoot = document.getElementById('modal-root')

const animate = (toLeft, toTop, tour) => {
  if (document.readyState !== 'complete' || !tour) {
    return
  }

  let start
  const frame = timestamp => {
    if (!start) {
      start = timestamp
    }
    const elapsed = timestamp - start
    tour.style.cssText = `
          transform: translate(${toLeft}px, ${Math.min(
      0.8 * elapsed,
      toTop
    )}px);
          opacity: ${Math.min(0.4 * elapsed, 1)};
    `

    if (elapsed < 2000) {
      window.requestAnimationFrame(frame)
    }
  }
  window.requestAnimationFrame(frame)
}

/**
 *
 * @param {*} clonedElement
 * @param {*} modalRoot
 */
const appendTourToHighlightedElement = (clonedElementRect, element) => {
  let { top, bottom, left } = clonedElementRect

  const tour = document.createElement('div')
  const tourHeight = tour.offsetHeight + 5

  let tourPlacementTop, tourPlacementLeft

  if (tourHeight - top < 0) {
    tourPlacementTop = bottom + 5
  } else {
    tourPlacementTop = top = 5
  }
  tourPlacementLeft = left

  tour.classList.add('tour-guide')
  const text =
    'Keep in mind that you could try and test everything during the Tour. For example, try selecting the highlighted text…'
  const tourContent = `
     <span class='badge'>5</span>
     <div class='tour-content'>
       <p>${text}</p>
       <div className='tour-data-row'></div>
     </div>

  `
  tour.setAttribute('id', 'tour')
  tour.innerHTML = tourContent
  element.appendChild(tour)
  animate(tourPlacementLeft, tourPlacementTop, tour)
}
/**
 * @function AppendHighlightedElementToModal copy the element you want to highlight for purposes of tour
 * and then append it onto a modal and pass in a background color of white so it appears highlighted
 * @param { DONElement } clonedElement - the element to highlight
 * @param { DOMElement } modalRoot - the root of the modal
 */
const AppendHighlightedElementToModal = (clonedElement, modalRoot) => {
  if (!clonedElement) {
    return
  }
  const clonedElementRect = clonedElement.getBoundingClientRect()
  const { top, left } = clonedElementRect
  const element = document.createElement('div')
  const appReference = appRoot.lastElementChild
  const appClassList = appReference.classList

  // add the app class to any child of the modal to maintain the parent class relationship
  // in terms of defining inherited styles
  appClassList.forEach(className => {
    element.classList.add(className)
  })

  // Reshape position the cloned element to fit exactly where its sibling was sitting on the DOM
  clonedElement.style.cssText = `top: ${top}px; left: ${left}px;  position:absolute;`
  clonedElement.classList.add('overlay-element')
  element.appendChild(clonedElement)
  appendTourToHighlightedElement(clonedElementRect, element)
  modalRoot.appendChild(element)
}

const updateClassListWhenModalIsOpen = () => {
  // when modal is toggled opened
  modalRoot.classList.add('modal-open')
  modalRoot.classList.remove('modal-close')
}

const updateClassListWhenModalIsClosed = () => {
  // when modal is toggled close
  modalRoot.classList.remove('modal-open')
  modalRoot.classList.add('modal-close')
}

const removeAllModalDescendants = () => {
  let child = modalRoot.lastElementChild
  while (child) {
    modalRoot.removeChild(child)
    child = modalRoot.lastElementChild
  }
}

function Modal(props) {
  const {
    open,
    DomElementInFocus = document.getElementById('clonable')
  } = props
  useEffect(() => {
    if (open) {
      updateClassListWhenModalIsOpen()

      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
      // prevent the page from scrolling when modal is opened
    } else {
      updateClassListWhenModalIsClosed()

      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
      // return back to the original scroll position when modal is closed
    }
  }, [open]) // Only run this effect when modal has just being toggled

  const [modalElement] = useState(null)
  useEffect(() => {
    if (DomElementInFocus && document.readyState === 'complete') {
      const cloned = DomElementInFocus.cloneNode(true)
      AppendHighlightedElementToModal(
        document.getElementById('clonable'),
        modalRoot
      )
    }
    return () => {
      // clean up when component unMounts
      removeAllModalDescendants()
    }
  }, [DomElementInFocus])

  return modalElement && createPortal(props.children, modalElement)
}

export default Modal
