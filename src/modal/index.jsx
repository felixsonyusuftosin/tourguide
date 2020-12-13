/**
 * @file ModalComponent this is a react implementation of portal 
 * that creates a modal for the tour guide.
 */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  removeAllModalDescendants,
  updateClassListWhenModalIsClosed,
  updateClassListWhenModalIsOpen,
  appendHighlightedElementToModal,
  modalRoot
} from './utils'

function Modal(props) {
  const { open, tourGuideReferenceArray = [], toggleModal } = props

  if (!tourGuideReferenceArray || !tourGuideReferenceArray.length) {
    throw new Error(
      'You must pass in a reference array to your tour guide this could be a json or a plain javascript array of objects'
    )
  }

  if (!toggleModal) {
    throw new Error(
      ' You must pass a callback method "toggleModal" that closes the modal when you hit the close button '
    )
  }

  const [modalElement] = useState(null)
  const [currentItem, setSelectedItem] = useState(tourGuideReferenceArray[0])

  const onNext = () => {
    if (currentItem.position + 1 < tourGuideReferenceArray.length) {
      setSelectedItem(tourGuideReferenceArray[currentItem.position + 1])
    }
  }

  const onPrev = () => {
    if (currentItem.position - 1 >= 0) {
      setSelectedItem(tourGuideReferenceArray[currentItem.position - 1])
    }
  }

  const onClose = () => {
    updateClassListWhenModalIsClosed()
    setSelectedItem(tourGuideReferenceArray[0])
    toggleModal()
  }

  const preventDocumentScrollWhenModalIsOpen = () => {
    document.body.style.position = 'fixed'
    document.body.style.top = `-${window.scrollY}px`
  }

  const preserveDocumentScrollWhenModalIsClosed = () => {
    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }

  // effect manages the opening and closing of the modal
  useEffect(() => {
    if (open) {
      updateClassListWhenModalIsOpen()
      preventDocumentScrollWhenModalIsOpen()
    } else {
      updateClassListWhenModalIsClosed()
      preserveDocumentScrollWhenModalIsClosed()
    }
  }, [open]) // Only run this effect when modal has just being toggled

  // effect manages the cloning and injection of the highlighted element into the DOM
  useEffect(() => {
    if (document.readyState === 'complete') {
      const currentNode = document.getElementById(currentItem.id)
      const cloned = currentNode.cloneNode(true)
      const rect = currentNode.getBoundingClientRect()
      currentNode &&
        appendHighlightedElementToModal(
          cloned,
          rect,
          modalRoot,
          onNext,
          onPrev,
          onClose,
          currentItem,
          tourGuideReferenceArray
        )
    }
    return () => {
      // clean up when component unMounts
      removeAllModalDescendants()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem, document.readyState])

  // cleanUp Modal when component is unMounting
  useEffect(() => {
    return () => {
      let child = modalRoot.lastElementChild
      // cleanup remove all event listeners
      const nextButton = document.getElementById('next')
      const prevButton = document.getElementById('prev')
      const closeButton = document.getElementById('close')

      nextButton && nextButton.removeEventListener('click')
      prevButton && prevButton.removeEventListener('click')
      closeButton && closeButton.removeEventListener('click')

      while (child) {
        modalRoot.removeChild(child)
        child = modalRoot.lastElementChild
      }
      updateClassListWhenModalIsClosed()
      toggleModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return modalElement && createPortal(props.children, modalElement)
}

export default Modal
