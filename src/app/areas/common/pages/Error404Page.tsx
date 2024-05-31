import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ErrorsLayout } from '../components/layout/ErrorsLayout'
import { toAbsoluteUrl } from '../../../../_sitecommon/helpers'


const Error404Page: FC = () => {
    return (
        <>
            <ErrorsLayout>

                <h1 className='fw-bolder fs-2hx text-gray-900 mb-4'>Oops!</h1>



                <div className='fw-semibold fs-6 text-gray-500 mb-7'>We can't find that page.</div>



                <div className='mb-3'>
                    <img
                        src={toAbsoluteUrl('media/auth/404-error.png')}
                        className='mw-100 mh-300px theme-light-show'
                        alt=''
                    />
                    <img
                        src={toAbsoluteUrl('media/auth/404-error-dark.png')}
                        className='mw-100 mh-300px theme-dark-show'
                        alt=''
                    />
                </div>

                <div className='mb-0'>
                    <Link to='/dashboard' className='btn btn-sm btn-primary'>
                        Return Home
                    </Link>
                </div>
            </ErrorsLayout>
        </>
    )
}

export { Error404Page }
