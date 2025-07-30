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
      data-kt-menu='true'><div className='menu-item px-5'>
        <a className='menu-link px-5'
          onClick={handleLogout}>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
