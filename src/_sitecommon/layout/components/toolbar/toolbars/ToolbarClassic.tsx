
/* eslint-disable */

import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon } from '../../../../helpers'
import { CreateAppModal, Dropdown1 } from '../../../../partials'
import { useLayout } from '../../../core'
import { Link } from 'react-router-dom'
import { SearchHeaderButtonHtmlType } from '../../../../../app/models/common/SearchHeaderButtonHtmlType'
import { getCurrentDate } from '../../../../common/helpers/global/GlobalHelper'


type Props = {
  addNewClickType: string,
  newLink: string,
  onAddNewClick?: () => void,
  additionalInfo: any
}

const ToolbarClassic: React.FC<Props> = ({ addNewClickType, newLink, onAddNewClick, additionalInfo }) => {
  const { config } = useLayout()


  let headerOtherButtons: SearchHeaderButtonHtmlType[] = additionalInfo?.headerOtherButtons ?? [];



  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? 'btn-light'
    : 'bg-body btn-color-gray-700 btn-active-color-primary'

  return (
    <div className='d-flex align-items-center gap-2 gap-lg-3'>


      {/* {
        additionalInfo?.headerOtherButtons != undefined && additionalInfo?.headerOtherButtons != undefined && additionalInfo?.headerOtherButtons.length > 0
          ?
          additionalInfo?.headerOtherButtons?.map((item: any, index: any) => (
            <div>
              hello
            </div>

          ))
          :
          <></>
      } */}

      {
        headerOtherButtons && Array.isArray(headerOtherButtons) && headerOtherButtons.length > 0
          ? headerOtherButtons?.map((item: SearchHeaderButtonHtmlType, index: number) => (
            <div key={index}>
              {item.buttonHtml}
            </div>
          ))
          : null
      }

      {
        additionalInfo.showAddNewButton == true
          ?

          addNewClickType == 'link'
            ?
            <Link
              to={newLink}
              className='btn btn-sm fw-bold  btn-danger'
            >
              Add New
            </Link>
            :
            <Link
              to='#'
              onClick={onAddNewClick}
              className='btn btn-sm fw-bold  btn-danger'
            >
              Add New
            </Link>
          :
          <></>
      }

     


    </div>
  )
}

export { ToolbarClassic }
