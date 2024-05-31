import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLayout} from '../../../core'

const PageTitle = () => {
  const  pageTitle = "";
  const pageDescription = "";
  const pageBreadcrumbs:any = [
    {
      isSeparator: false,
      isActive: false
    }
  ]
  const {config, classes} = useLayout()
  const appPageTitleDirection = config.app?.pageTitle?.direction

  return (
    <div
      id='kt_page_title'
      data-kt-swapper='true'
      data-kt-swapper-mode='prepend'
      data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx(
        'page-title d-flex flex-wrap me-3',
        classes.pageTitle.join(' '),
        config.app?.pageTitle?.class,
        {
          'flex-column justify-content-center': appPageTitleDirection === 'column',
          'align-items-center': appPageTitleDirection !== 'column',
        }
      )}
    >
      {/* begin::Title */}
      {config.app?.pageTitle?.display && pageTitle && (
        <h1
          className={clsx('page-heading d-flex text-gray-900 fw-bold fs-3 my-0', {
            'flex-column justify-content-center': appPageTitleDirection,
            'align-items-center': !appPageTitleDirection,
          })}
        >
          {pageTitle}
          {pageDescription && config.app?.pageTitle && config.app?.pageTitle?.description && (
            <span
              className={clsx('page-desc text-muted fs-7 fw-semibold', {
                'pt-2': appPageTitleDirection === 'column',
              })}
            >
              {config.app?.pageTitle?.direction === 'row' && (
                <span className='h-20px border-1 border-gray-300 border-start ms-3 mx-2'></span>
              )}
              {pageDescription}{' '}
            </span>
          )}
        </h1>
      )}
      {/* end::Title */}

      
    </div>
  )
}

export {PageTitle}
