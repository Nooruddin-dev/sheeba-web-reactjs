/* eslint-disable */

import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Languages } from './Languages'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../app/globalStore/rootReducer'
import { saveUserData } from '../../../../app/globalStore/features/user/userSlice'
import { setAuthToken } from '../../../common/helpers/api_helpers/axiosHelper'
import { setBusnPartnerIdAndTokenInStorage } from '../../../common/helpers/global/GlobalHelper'
import { stringIsNullOrWhiteSpace } from '../../../common/helpers/global/ValidationHelper'

const HeaderUserMenu: FC = () => {
  const currentUser: any = {}
  const dispatch = useDispatch();
  const loginUser = useSelector((state: RootState) => state.userData.userData);
  const profilePictureUrl = loginUser?.profilePictureUrl;


  const handleLogout = (event: any) => {
    event.preventDefault();
    dispatch(saveUserData(null));
    setAuthToken('', null);
    setBusnPartnerIdAndTokenInStorage(null, '');
  }


  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            {
              profilePictureUrl && !stringIsNullOrWhiteSpace(profilePictureUrl)
                ?
                <img alt='Logo' src={toAbsoluteUrlCustom(profilePictureUrl)} />
                :
                <img alt='Logo' src={toAbsoluteUrl('media/avatars/300-3.jpg')} />
            }

          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.first_name} {currentUser?.first_name}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
          My Profile
        </Link>
      </div>





      <div className='separator my-2'></div>

      <Languages />


      <div className='menu-item px-5'>
        <a className='menu-link px-5'
          onClick={handleLogout}
        >
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
