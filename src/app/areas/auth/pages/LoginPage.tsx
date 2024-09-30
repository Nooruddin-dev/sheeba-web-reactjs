/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import LoginLayout from '../../common/components/layout/LoginLayout';
import { toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { getUserLoginApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { setBusnPartnerIdAndTokenInStorage } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { setAuthToken } from '../../../../_sitecommon/common/helpers/api_helpers/axiosHelper';
import { saveUserData } from '../../../globalStore/features/user/userSlice';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';



export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<any>(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState(false);


    const onSubmitLoginForm = (data: any) => {
        console.log(data); // Handle form submission here
        const { emailAddress, password } = data;

        if (stringIsNullOrWhiteSpace(emailAddress) || stringIsNullOrWhiteSpace(password)) {
            showErrorMsg('Please fill all required fields');
            return;
        }


        const loginFormBody = {
            userName: emailAddress,
            password: password,
        }
        getUserLoginApi(loginFormBody)
        .then((res: any) => {
            if (res?.data) {


                const { token, user } = res?.data;

                if (user != undefined && user != null) {
                   // setAuthToken(token, user?.busnPartnerId);
                   // setBusnPartnerIdAndTokenInStorage(user?.busnPartnerId, token);
                   

                    setTimeout(() => {
                        if (user?.busnPartnerTypeId == BusinessPartnerTypesEnum.Admin || user?.busnPartnerTypeId == BusinessPartnerTypesEnum.NormalUser) {
                           
                            dispatch(saveUserData(user));
                            showSuccessMsg("Login successfully!");
                           
                            // navigate('/admin/dashboard');
                            window.location.href = '/admin/dashboard';  //-- as we use diff themes, so after login, page reload is required otherwise, when swithc between diff themes then may css give issues on pages.
                        } else{
                            showErrorMsg("Invalid user. Not able to login!");
                        }

                    }, 300);
                } else {
                    showErrorMsg("No user found. Please try again!");
                }

            } else {
                showErrorMsg("No user found. Please try again!");
            }


        })
        .catch((err: any) => {
            showErrorMsg("An error occured. Please try again!");
            console.error("error", err);
        });




    };

    useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
            root.style.height = '100%'
        }


        return () => {
            if (root) {
                root.style.height = 'auto'
            }

        }
    }, [])

    //  <style>{`body { background-image: url('assets/media/auth/bg4.jpg'); } [data-bs-theme="dark"] body { background-image: url('assets/media/auth/bg4-dark.jpg'); }`}</style>
    return (
        <LoginLayout>

            <div className="d-flex flex-column flex-root loginscreen" id="kt_app_root"            >
                {/* Page bg image */}

                {/* Authentication - Sign-in */}
                <div className="d-flex flex-column flex-column-fluid flex-lg-row">
                    {/* Aside */}
                    <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
                        <div className="d-flex flex-center flex-lg-center flex-column">
                            {/* Logo */}
                            <a href="index.html" className="mb-7 default_dark_2 loginlogo">
                                <img alt="Logo" src={toAbsoluteUrl('media/logos/default_dark_2.png')} />
                            </a>
                            {/* Title */}
                            <h2 className=" fw-normal m-0 ">Sheeba Inventory Management System</h2>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
                        {/* Card */}
                        <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-20">
                            {/* Wrapper */}
                            <div className="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
                                {/* Form */}
                                <form className="form w-100"
                                    id='kt_login_signin_form'

                                    onSubmit={(e) => {
                                        handleSubmit(onSubmitLoginForm)(e);
                                        setFormSubmitted(true);
                                    }}
                                >
                                    {/* Heading */}
                                    <div className="text-center mb-11">
                                        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
                                        <div className="text-gray-500 fw-semibold fs-6">Your Login Credentials</div>
                                    </div>

                                    {/* <div className="row g-3 mb-9">
                                        <div className="col-md-6">
                                            <a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
                                                <img alt="Logo" src="assets/media/svg/brand-logos/google-icon.svg" className="h-15px me-3" />
                                                Sign in with Google
                                            </a>
                                        </div>
                                        <div className="col-md-6">
                                            <a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
                                                <img alt="Logo" src="assets/media/svg/brand-logos/apple-black.svg" className="theme-light-show h-15px me-3" />
                                                <img alt="Logo" src="assets/media/svg/brand-logos/apple-black-dark.svg" className="theme-dark-show h-15px me-3" />
                                                Sign in with Apple
                                            </a>
                                        </div>
                                    </div> */}

                                    {/* <div className="separator separator-content my-14">
                                        <span className="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
                                    </div> */}

                                    <div className='fv-row mb-8'>
                                        <label className='form-label fs-6 fw-bolder text-gray-900 required'>Email</label>
                                        <input
                                            placeholder='Email'

                                            className={`form-control bg-transparent ${formSubmitted ? (errors.emailAddress ? 'is-invalid' : 'is-valid') : ''}`}


                                            type='email'
                                            id="emailAddress" {...register("emailAddress", { required: true, pattern: /^\S+@\S+$/i })}

                                        />


                                        {errors.emailAddress && <SiteErrorMessage errorMsg='Email is required' />}

                                    </div>

                                    <div className='fv-row mb-3'>
                                        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0 required'>Password</label>
                                        <input
                                            type='password'
                                            autoComplete='off'

                                            className={`form-control bg-transparent ${formSubmitted ? (errors.password ? 'is-invalid' : 'is-valid') : ''}`}

                                            id="password" placeholder="Password*" {...register("password", { required: true })}
                                        />

                                        {errors.password && <SiteErrorMessage errorMsg='Password is required' />}
                                    </div>



                                    {/* Wrapper */}
                                    <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                                        <div></div>
                                        <a href="/auth/forgot-password" className="link-primary"></a>
                                    </div>
                                    {/* Submit button */}
                                    <div className="d-grid mb-10">
                                        <button type="submit" id="kt_sign_in_submit" className="btn btn-primary">
                                            {!loading && <span className='indicator-label'>Sign In</span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{ display: 'block' }}>
                                                    Please wait...
                                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}

                                        </button>
                                    </div>

                                    {/* <div className="text-gray-500 text-center fw-semibold fs-6">Not a Member yet? <a href="authentication/layouts/creative/sign-up.html" className="link-primary">Sign up</a></div> */}
                                </form>
                                {/* End Form */}
                            </div>
                            {/* End Wrapper */}
                            {/* Footer */}
                            <div className="d-flex flex-stack px-lg-10">
                                {/* Languages */}
                                <div className="me-0">
                                  
                                    <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4 fs-7" data-kt-menu="true" id="kt_auth_lang_menu">
                                        {/* Menu items */}
                                    </div>
                                </div>
                                {/* Links */}
                              
                            </div>
                            {/* End Footer */}
                        </div>
                        {/* End Card */}
                    </div>
                    {/* End Body */}
                </div>
                {/* End Authentication - Sign-in */}
            </div>




        </LoginLayout>
    )
}
