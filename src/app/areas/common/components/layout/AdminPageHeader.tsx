/* eslint-disable */

import clsx from 'clsx';
import React, { useEffect } from 'react'
import { ILayout, useLayout } from '../../../../../_sitecommon/layout/core';
import { ToolbarClassic } from '../../../../../_sitecommon/layout/components/toolbar/toolbars';
import AdminPageTitle from './AdminPageTitle';

interface AdminPageHeaderProps {
    title: string;
    pageDescription: string;
    addNewClickType: any;
    newLink: string;
    onAddNewClick?: () => void ,
    additionalInfo: any
}





const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, pageDescription, addNewClickType, newLink, onAddNewClick, additionalInfo }) => {
    const {config, classes} = useLayout()
    if (!config.app?.toolbar?.display) {
      return null
    }

    useEffect(() => {
        updateDOM(config)
        document.body.setAttribute('data-kt-app-toolbar-enabled', 'true')
      }, [config])

    return (
        <div
            id='kt_app_toolbar'
            className={clsx('app-toolbar', classes.toolbar.join(' '), config?.app?.toolbar?.class)}
        >
            <div
                id='kt_app_toolbar_container'
                className={clsx(
                    'app-container',
                    classes.toolbarContainer.join(' '),
                    config.app?.toolbar?.containerClass,
                    config.app?.toolbar?.minimize?.enabled ? 'app-toolbar-minimize' : '',
                    {
                        'container-fluid': config.app?.toolbar?.container === 'fluid',
                        'container-xxl': config.app?.toolbar?.container === 'fixed',
                    }
                )}
            >
                <AdminPageTitle
                    title={title}
                    pageDescription= {pageDescription}
                    
                />
              <ToolbarClassic
               addNewClickType = {addNewClickType}
               newLink = {newLink}
               onAddNewClick = {onAddNewClick}
               additionalInfo = {additionalInfo}
              />
            </div>
        </div>
    )
}

const updateDOM = (config: ILayout) => {
    let appToolbarSwapAttributes: {[attrName: string]: string} = {}
    const appToolbarSwapEnabled = config.app?.toolbar?.swap?.enabled
    if (appToolbarSwapEnabled) {
      appToolbarSwapAttributes = config.app?.toolbar?.swap?.attributes as {[attrName: string]: string}
    }
  
    let appToolbarStickyAttributes: {[attrName: string]: string} = {}
    const appToolbarStickyEnabled = config.app?.toolbar?.sticky?.enabled
    if (appToolbarStickyEnabled) {
      appToolbarStickyAttributes = config.app?.toolbar?.sticky?.attributes as {
        [attrName: string]: string
      }
  
      let appToolbarMinimizeAttributes: {[attrName: string]: string} = {}
      const appToolbarMinimizeEnabled = config.app?.toolbar?.minimize?.enabled
      if (appToolbarMinimizeEnabled) {
        appToolbarMinimizeAttributes = config.app?.toolbar?.minimize?.attributes as {
          [attrName: string]: string
        }
      }
  
      if (config.app?.toolbar?.fixed?.desktop) {
        document.body.setAttribute('data-kt-app-toolbar-fixed', 'true')
      }
  
      if (config.app?.toolbar?.fixed?.mobile) {
        document.body.setAttribute('data-kt-app-toolbar-fixed-mobile', 'true')
      }
  
      setTimeout(() => {
        const toolbarElement = document.getElementById('kt_app_toolbar')
        // toolbar
        if (toolbarElement) {
          const toolbarAttributes = toolbarElement
            .getAttributeNames()
            .filter((t) => t.indexOf('data-') > -1)
          toolbarAttributes.forEach((attr) => toolbarElement.removeAttribute(attr))
  
          if (appToolbarSwapEnabled) {
            for (const key in appToolbarSwapAttributes) {
              if (appToolbarSwapAttributes.hasOwnProperty(key)) {
                toolbarElement.setAttribute(key, appToolbarSwapAttributes[key])
              }
            }
          }
  
          if (appToolbarStickyEnabled) {
            for (const key in appToolbarStickyAttributes) {
              if (appToolbarStickyAttributes.hasOwnProperty(key)) {
                toolbarElement.setAttribute(key, appToolbarStickyAttributes[key])
              }
            }
          }
  
          if (appToolbarMinimizeEnabled) {
            for (const key in appToolbarMinimizeAttributes) {
              if (appToolbarMinimizeAttributes.hasOwnProperty(key)) {
                toolbarElement.setAttribute(key, appToolbarMinimizeAttributes[key])
              }
            }
          }
        }
      }, 0)
    }
  }


export default AdminPageHeader;