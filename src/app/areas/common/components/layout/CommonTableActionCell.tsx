
import { FC, useEffect, useState } from 'react'

import DeleteConfirmationModal from './DeleteConfirmationModal'
import { ID, KTIcon } from '../../../../../_sitecommon/helpers'
import { MenuComponent } from '../../../../../_sitecommon/assets/ts/components'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_sitecommon/common/helpers/global/ValidationHelper'
import { deletAnyRecordApi } from '../../../../../_sitecommon/common/helpers/api_helpers/ApiCalls'



type Props = {
  editId: ID,
  showEditButton: boolean,
  deleteData: any,
  onEditClick: any,
  onDeleteClick: any
}

const CommonTableActionCell: FC<Props> = ({ editId, showEditButton, deleteData, onEditClick, onDeleteClick }) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>();
  const [isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal] = useState<boolean>(false);


  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const hanldeEditDropDown = (e: any) => {
    e.preventDefault();
    setIsEditOpen(!isEditOpen);
  }

  const onEditClickLocal = (e: any, id: any) => {
    setIsEditOpen(false);
    onEditClick(e, id);
  }
  const onDeleteClickLocal = (e: any) => {
    e.preventDefault();
    setIsEditOpen(false);
    setIsOpenDeleteConfirmationModal(true);

  }



  const handleDeleteModalOnClose = (event: any) => {
    event?.preventDefault();
    setIsOpenDeleteConfirmationModal(false);

  }

  const handleDeleteConfirm = (event: any) => {
    event.preventDefault();

    //-- ✅ If the record is just a dummy row that not exist in actual database table. For example we add product attribue and
    //-- then user can remove/delete. So in this case, we have just to send isRawDummyRecordDelete == true so that no delete api call.
    if(deleteData?.isRawDummyRecordDelete && deleteData.isRawDummyRecordDelete == true){
      onDeleteClick(deleteData?.entityRowId);
      return false;
    }

    if (stringIsNullOrWhiteSpace(deleteData.entityRowId) || deleteData.entityRowId == null || deleteData.entityRowId < 1) {
      showErrorMsg('Invalid Record. Please try again!');
      return false;
    }


    //--make api call
    const deleteParam = {
      entityName: deleteData?.entityName,
      entityColumnName: deleteData?.entityColumnName,
      entityRowId: deleteData?.entityRowId,
      sqlDeleteTypeId: deleteData?.sqlDeleteTypeId
    }
    deletAnyRecordApi(deleteParam)
      .then((res: any) => {
        if (res?.data?.response && res?.data?.response == "Deleted Successfully!") {
          showSuccessMsg("Deleted Successfully!");

          //--clear form
          setTimeout(() => {
            handleDeleteModalOnClose(event);
            onDeleteClick(deleteData?.entityRowId);
            //setListRefreshCounter(prevCounter => prevCounter + 1);
          }, 500);




        } else {
          showErrorMsg("An error occured. Please try again!");
        }


      })
      .catch((err: any) => {
        console.error(err, "err");

        if(err?.data && (typeof err.data === 'string') && err.data.includes('The DELETE statement conflicted with the REFERENCE constraint')){ 
          showErrorMsg("This record used by other tables. Therefore, first remove this record from other tables then delete. Detail error message log to the console. Please inspect and check the console.");
        }else{
          showErrorMsg("An error occured. Please try again!");
        }
      });

    setIsOpenDeleteConfirmationModal(false);
  }



  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
        onClick={(e) => hanldeEditDropDown(e)}
      >
        Actions
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className={`menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4 ${isEditOpen == true ? 'table-edit-cell-dropdown' : ''}`}
        data-kt-menu='true'

      >
        {
          showEditButton == true
            ?
            <div className='menu-item px-3'>
              <a className='menu-link px-3'
                onClick={(e) => onEditClickLocal(e, editId)}
              >
                Edit
              </a>
            </div>

            :
            <></>

        }


        {
          deleteData?.showDeleteButton == true
            ?
            <div className='menu-item px-3'>
              <a
                className='menu-link px-3'
                data-kt-users-table-filter='delete_row'
                onClick={(e) => onDeleteClickLocal(e)}
              >
                Delete
              </a>
            </div>
            :
            <></>
        }


      </div>
      {/* end::Menu */}


      {
        isOpenDeleteConfirmationModal == true
          ?
          <DeleteConfirmationModal
            isOpen={isOpenDeleteConfirmationModal}
            closeModal={handleDeleteModalOnClose}
            onDeleteConfirm={handleDeleteConfirm}
            modalTitle={deleteData?.deleteModalTitle ?? 'Delete Record'} />
          :
          <></>
      }


    </>
  )
}

export { CommonTableActionCell }
