/**
 * @file utility files that manages DOM manipulation for the tour guide 
 * React virtual DOM implementation is leveraged to inject the DOM into the Modal
 * However more low level DOM manipulation technique was leveraged for dynamically generating and copying highlighted 
 * elements into the modal as a corresponding react implementation will be slower, more complex  and more memory intensive
 */

import HTMLTourContent from './components'

const appRoot = document.getElementById('root')
const modalRoot = document.getElementById('modal-root')

/**
 * @function  appendTourToHighlightedElement adds the tour guide and associate it with the current 
 * highlighted element, the essence of this is to calculate the placement of the tour guide and render associated DOM element
 * @param { Object } clonedElementRect the highlighted element rectangular position on the DOM 
 * @param { DOMElement } element the element to highlight 
 * @param { Object } currentItem the current object of the tour 
 * @param { Object[] } tourGuideReferenceArray all the objects contained in the tour
 */
const appendTourToHighlightedElement = (clonedElementRect, element, currentItem,  tourGuideReferenceArray) => {
  const { top, bottom, left, height } = clonedElementRect
  const tour = document.getElementById('tour') || document.createElement('div')
  const modalHeight = modalRoot.scrollHeight
  const tourHeight = tour.offsetHeight + 5
  const tourWidth = 305
  const windowWidth = Math.max(window.innerWidth,document.documentElement.clientWidth, document.body.clientWidth)

  let tourPlacementTop, tourPlacementLeft

  if (tourHeight - top < 0) {
    tourPlacementTop = bottom + 5
  } else {
    tourPlacementTop = top + 5
  }
  // check to see if the tour will overflow at the bottom and make corrections
  if (tourHeight + height + top > modalHeight - 100) {
    tourPlacementTop = top - (tourHeight + 150)
  }
  
  if ( (tourWidth + left) > windowWidth ) { 
    tourPlacementLeft = left - (tourWidth / 2)
    while (tourPlacementLeft + tourWidth > windowWidth && tourPlacementLeft > 0) { 
      tourPlacementLeft = tourPlacementLeft - 100
    }
  } else {
   tourPlacementLeft = left
  }

  tour.classList.add('tour-guide')
  tour.setAttribute('id', 'tour')
  tour.innerHTML = HTMLTourContent({
    text: currentItem.content,
    badge: currentItem.position + 1,
    currentItem,
    tourGuideReferenceArray
  })

  element.appendChild(tour)
  tour.style.cssText = `left: ${tourPlacementLeft}px; top: ${tourPlacementTop}px; `
}

/**
 * @function AppendHighlightedElementToModal copy the element you want to highlight for tour
 * and then append it onto a modal and pass in a background color of white so it appears highlighted
 * @param { DONElement } clonedElement - the element to highlight
 * @param { Object } rect - the highlighted element rectangular position on the DOM 
 * @param { DOMElement } modalRoot - reference to the Modal DOm element
 * @param { function } onNext - callback method to navigate to next tour item
 * @param { function } onPrev - callback method to navigate to previous tour item 
 * @param { function } onClose - callback method to close the modal
 * @param { Object } currentItem - The current selected item on the tour guid
 * @param { Object[] } tourGuideReferenceArray - all the objects contained in the tour
 */
const appendHighlightedElementToModal = (
  clonedElement,
  rect,
  modalRoot,
  onNext,
  onPrev,
  onClose,
  currentItem,
  tourGuideReferenceArray
) => {
  if (!clonedElement) {
    return
  }
  const clonedElementRect = rect
  const { top, left, width, height } = clonedElementRect
  const element = document.createElement('div')
  const appReference = appRoot.lastElementChild
  const appClassList = appReference.classList

  // add the app class to any child of the modal to maintain the parent class relationship
  // in terms of defining inherited styles
  appClassList.forEach(className => {
    element.classList.add(className)
  })

  // Reshape position the cloned element to fit exactly where its sibling was sitting on the DOM
  clonedElement.style.cssText = `top: ${top}px; left: ${left}px; width: ${width}px;  height:${height}px;  position:absolute;`
  clonedElement.classList.add('overlay-element')
  element.appendChild(clonedElement)
  appendTourToHighlightedElement(clonedElementRect, element, currentItem, tourGuideReferenceArray)
  modalRoot.appendChild(element)

  document.getElementById('next').addEventListener('click', onNext)
  document.getElementById('prev').addEventListener('click', onPrev)
  document.getElementById('close').addEventListener('click', onClose)
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

/**
 * @function removeAllModalDescendants removes all descendants except the tour 
 * we leave the tour so as to make sure our animation runs smooth
 */
const removeAllModalDescendants = () => {
  let child = modalRoot.lastElementChild
  const tourElement = child && child.id === 'tour'

  while (child && !tourElement) {
    modalRoot.removeChild(child)
    child = modalRoot.lastElementChild
  }
}

export {
  appendTourToHighlightedElement,
  removeAllModalDescendants,
  updateClassListWhenModalIsClosed,
  updateClassListWhenModalIsOpen,
  appendHighlightedElementToModal,
  appRoot,
  modalRoot
}
