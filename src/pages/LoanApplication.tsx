import React from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import {useForm} from "react-hook-form";

const LoanRequest = (props: any) =>{
    return (
        <>
        <main className="md:pl-12">
            <div className="flex ">
            <div className="w-full ">
                <div className="flex items-center mt-10 lg:mt-0">
                    <div className="w-8 h-1 bg-blue-700 rounded mr-3 hidden md:block"></div>
                        <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-light md:font-semibold text-sm md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                            New Loan
                        </h4>
                    </div>
                    <br />
                    <img src="/img/new-loan-mobile-card-bg.svg" alt=""  className="md:hidden absolute mobile-card-bg"/>
                    <div className="relative w-11/12 bg-white flex rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
                        <div className="hidden md:block w-6/12 mb-6 border-r-2 border-gray-200">
                            <img src="/img/loan-application-bg.svg" alt="" className="m-auto w-5/12 mt-6 fade-element" />
                            <h3 className="text-xl text-gray-700 text-center font-bold m-auto mt-10">How much money do you want?</h3>
                        </div>

                        <div className="md:w-6/12 w-full mb-6 px-8">
                            <form className="w-full max-w-lg">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-ful px-3">
                                        <h3 className="md:hidden text-lg text-gray-700 text-center font-bold m-auto mb-10">How much money do you want?</h3>
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Loan Type
                                        </label>
                                        <div className="relative">
                                            <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            >
                                                <option>Personal</option>
                                                <option>Company</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg
                                                    className="fill-current h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-700 text-xs italic"><span className="text-blue-500"> Learn more</span> about the selected loan type</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-1/2 px-3">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            >
                                                <option>1,000,000</option>
                                                <option>5,000,000</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg
                                                    className="fill-current h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-xs italic">*5,000,000 maximum.</p>
                                    </div>
                                    <div className="w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Duration
                                        </label>
                                        <div className="relative">
                                            <select
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            id="grid-state"
                                            >
                                                <option>1 month</option>
                                                <option>2 months</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg
                                                    className="fill-current h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                                    </div>
                                </div>
                                
                                
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => props.history.push("/onboarding/personal")}
                                        className="bg-green-600 hover:bg-green-600 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center transition-colors duration-150 ease-in-out"
                                        type="button"
                                        >
                                        <span> Apply! </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>       
        </>
    )
}

export default LoanRequest;