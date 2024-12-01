/* eslint-disable */

import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  defaultAlerts,
  defaultLogs,
  KTIcon,
  toAbsoluteUrl,
  useIllustrationsPath,
} from '../../../helpers'


import { useSelector } from 'react-redux'
import { RootState } from '../../../../app/globalStore/rootReducer'
import BusinessPartnerTypesEnum from '../../../common/enums/BusinessPartnerTypesEnum'
import { getDaysDiffFromAnyDate, getTimeSlotFromCreateOnDate, makeAnyStringShortAppendDots } from '../../../common/helpers/global/ConversionHelper'


const HeaderNotificationsMenu: FC = () => {
  const [siteGeneralNotifications, setSiteGeneralNotifications] = useState<any>([])
  const [headerUnreadNotificationCount, setHeaderUnreadNotificationCount] = useState<number>(0)

  const loginUser = useSelector((state: RootState) => state.userData.userData);


  const createNavLinkForNotification = () => {

    let notificationUrl = '/admin/notifications-list';

    if (loginUser.busnPartnerTypeId == BusinessPartnerTypesEnum.Admin) {
      notificationUrl = '/admin/notifications-list';
    }else if(loginUser.busnPartnerTypeId == BusinessPartnerTypesEnum.Cashier){
      notificationUrl = '/cashier/notifications-list';
    }else if(loginUser.busnPartnerTypeId == BusinessPartnerTypesEnum.Kitchen){
      notificationUrl = '/kitchen/notifications-list';
    }

    return notificationUrl;
  }

  useEffect(() => {
    getSiteGeneralNotificationsService();
  }, []);

  const getSiteGeneralNotificationsService = () => {

    const pageBasicInfo: any = {
      PageNo: 1,
      PageSize: 20,
      IsReadNullProperty: false
    }
    let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();

    // getSiteGeneralNotificationsApi(pageBasicInfoParams)
    //   .then((res: any) => {

    //     const { data } = res;
    //     if (data && data.length > 0) {

    //       setSiteGeneralNotifications(data);
    //       setHeaderUnreadNotificationCount(data[0].headerUnreadNotificationCount)

    //     } else {
    //       setSiteGeneralNotifications([]);
    //     }


    //   })
    //   .catch((err: any) => console.log(err, "err"));
  };




  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
      data-kt-menu='true'
    >
      <div
        className='d-flex flex-column bgi-no-repeat rounded-top'
        style={{ backgroundImage: `url('${toAbsoluteUrl('media/misc/menu-header-bg.jpg')}')` }}
      >
        <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
          Notifications <span className='fs-8 opacity-75 ps-3'>{headerUnreadNotificationCount} unread</span>
        </h3>

        <ul className='nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9'>


          {/* <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4 active'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_2'
          >
            Logs
          </a>
        </li> */}


        </ul>
      </div>

      <div className='tab-content'>




        <div className='tab-pane fade show active' id='kt_topbar_notifications_2' role='tabpanel'>
          <div className='scroll-y mh-325px my-5 px-8'>
            {siteGeneralNotifications?.map((log: any, index: number) => (
              <div key={`log${index}`} className='d-flex flex-stack py-4'>
                <div className='d-flex align-items-center me-2'>
                  {/* <span className={clsx('w-110px badge', `badge-light-success`, 'me-4')}>
                   {`${getDaysDiffFromAnyDate(log.createdOn)}: ${getTimeSlotFromCreateOnDate(log.createdOn)}`} 
                  </span> */}
                  <span className={clsx(' badge', `badge-light-success`, 'me-4')}>
                    {`${getDaysDiffFromAnyDate(log.createdOn)}: ${getTimeSlotFromCreateOnDate(log.createdOn)}`}
                  </span>

                  <a href='#' className='text-gray-800 text-hover-primary fw-bold'>
                    {makeAnyStringShortAppendDots(log.message, 45)}
                  </a>

                  {/* <span className='badge badge-light fs-8'>
                    {getTimeSlotFromCreateOnDate(log.createdOn)}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
          <div className='py-3 text-center border-top'>
            <Link
              to={createNavLinkForNotification()}
              className='btn btn-color-gray-600 btn-active-color-primary'
            >
              View All <KTIcon iconName='arrow-right' className='fs-5' />
            </Link>
          </div>
        </div>


      </div>
    </div>
  )



}

export { HeaderNotificationsMenu }
