import React from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import {useForm} from "react-hook-form";

const OnboardingLoanRequest = (props: any) =>{
    return (
        <>
            <div className="hidden md:block w-6/12 mb-6 border-r-2 border-gray-200">
                <OnboardingSideBar name="LOAN REQUEST" />
                {/* <img src="/img/checklists.svg" alt="" className="w-1/4 m-auto pt-16" /> */}
                <button
                    className="bg-blue-700 w-4/6 ml-16 mt-8 mb-16 hover:bg-blue-800 text-white text-md md:text-xl font-light py-3 px-8 text-center rounded-lg focus:outline-none focus:shadow-outline flex justify-center shadow-lg"
                    type="button"
                    >
                    <span className="text-center"> Update my documents </span>
                    
                </button>
            </div>

            <div className="md:w-6/12 w-full mb-6 px-8">
                {/* <h3 className="text-gray-600 text-sm"> We hate to ask, but regulations mandate us to. <br/> Your BVN is safe with us!</h3> */}
                <form className="w-full max-w-lg">
                <div className="flex flex-wrap -mx-3 mb-16">
                    <div className="w-full md:w-ful px-3">
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
                        </div>
                    <p className="text-gray-700 text-xs italic"><span className="text-blue-500"> Learn more</span> about the selected loan type</p>
                    </div>
                    
                </div>
                <div className="flex flex-wrap -mx-3 mb-12">
                    <div className="w-full md:w-1/2 px-3">
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
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
                    onClick={() => props.history.push("/loan-schedule")}
                    className="bg-green-600 hover:bg-green-600 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center"
                    type="button"
                    >
                    <span> Apply! </span>
                    <svg
                        className="ml-2 -mt-1"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="chevron_right_24px">
                        <path
                            id="icon/navigation/chevron_right_24px"
                            d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z"
                            fill="white"
                        />
                        </g>
                    </svg>
                    </button>
                </div>
                </form>
            </div>
        </>
    )
}

export default OnboardingLoanRequest;