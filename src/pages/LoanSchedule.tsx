import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import ScheduleCalculator from "../components/LoanSchedule/ScheduleCalculator";
import {sendLoanApplication} from "../clients/loan";
import useAuthStore from "../stores/authStore";



const LoanSchedule = (props: any) =>{
    let loanData = props.location.loanData
    if((loanData === null) || (loanData=== "") || (loanData === undefined)) {
        props.history.push('/new-loan-request')
    }
    else{
      loanData = props.location.loanData
    }

    const [isScheduleVisible, setIsScheduleVisible] = useState(false);

    const token = useAuthStore((state) => state.accessToken);

    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);
    const [responseData, setResponse] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const updateErrors = (errors: []) => {
        setErrorMsg(Object.values(errors).flat());
    };

    const postLoan = async () => {
        let values = {
            product_code: loanData.no,
            loan_amount: loanData.loan_amount,
            number_of_repayments: loanData.no_of_repayments,
            account_statement_code: loanData.account_statement_code
        }
        setLoading(true)
        try {
          const { message, data, success } = await sendLoanApplication(token, values);

            if (success === false) {
                let msg = [] as any;
                msg.push(message);
                setErrorMsg(msg);
                setLoading(false);
                return;
            }

          setSubmitted(true);
          setTimeout(function () {
              setSubmitted(false);
              props.history.replace("/applications");
            }, 5000);
          setResponse(message);
          setErrorMsg([]);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          if (error && !error.response) {
            let msg = [] as any;
            msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
            setErrorMsg(msg);
            return;
          }
          if (error && error.response.status === 500) {
            let msg = [] as any;
            msg.push(error.response.data.message);
            setErrorMsg(msg);
            return;
          }
          const {
            response: { data },
          } = error;
          data.errors && updateErrors(data.errors);
        }
      };

      if (isLoading) {
        return (
          <>
            <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative">
              <img
                src="/img/loading-gif.gif"
                alt=""
                className="w-1/8 m-auto py-10"
              />
              <h6 className="m-auto text-lg text-gray-700 text-center">Please wait while your application is being submitted...</h6>
            </div>
          </>
        );
      }

    return (
        <>
        <main className="md:pl-12">
            <div className="flex ">
                <div className="w-full ">
                    <div className="flex items-center mt-10 lg:mt-0">
                        <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
                        <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-normal md:font-semibold text-md md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                            Loan Schedule
                        </h4>
                    </div>
                    <br />
                    {errorMsg.length ? (
                        <div
                        className="w-11/12 bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md mb-5 m-auto md:m-0 md:mb-2"
                            role="alert"
                        >
                            <div className="flex">
                            <div className="py-1">
                                <svg
                                className="fill-current h-6 w-6 text-red-500 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                >
                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                </svg>
                            </div>
                            <div>
                                <ul style={{ listStyleType: "none" }}>
                                {errorMsg.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                                </ul>
                            </div>
                            </div>
                        </div>
                        ) : (
                        ""
                        )
                    }
                    {submitted ? (
                        <>
                            <div className="w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0">
                                <div
                                className="w-11/12 bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-5 m-auto fade-in"
                                role="alert"
                                >
                                    <div className="flex">
                                        <div className="py-1">
                                            <svg
                                                className="fill-current h-6 w-6 text-teal-500 mr-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold">Application successful</p>
                                            <p className="text-sm">
                                                {responseData}. You will be notified of updates concerning your application.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-9/12 m-auto px-8 relative">
                                    <img
                                        src="/img/message-posted.svg"
                                        alt=""
                                        className="w-2/4 md:w-1/4 m-auto py-8"
                                    />
                                </div>
                            </div>
                        </>
                        ) : 
                        (
                        <>
                            <div className="w-11/12 bg-white flex rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0">
                                <div className={isScheduleVisible ? "hidden" : "hidden md:block w-5/12 mb-6 border-r-2 border-gray-300 px-4"}>
                                    <img src="/img/loan-schedule-img.svg" alt="" className="w-9/12 m-auto pt-16 pb-4" />
                                    <h1 className="w-10/12 m-auto text-center text-blue-800 text-lg font-bold mb-2">
                                    Your cash is closer than you think
                                    </h1>
                                </div>
                                <div className={isScheduleVisible ? "md:w-11/12 w-full mb-6 sm:pl-16 pl-6 py-6 relative" : "md:w-7/12 w-full mb-6 sm:pl-16 pl-6 py-6 relative"}>
                                    {
                                        isScheduleVisible ?
                                            <>
                                                <h1 className="block text-blue-800 text-lg font-bold mb-6">
                                                    Your repayment schedule:
                                                </h1>
                                                <div className="w-full">
                                                    <ScheduleCalculator type={loanData.interest_calculation_method} data={ {amount: loanData.loan_amount, rate: loanData.interest_percent, tenor: loanData.no_of_repayments} }/>
                                                </div>
                                            </>
                                        :
                                            <>
                                                <h1 className="block text-blue-800 text-lg font-bold mb-6 fade-in">
                                                Your loan summary:
                                                </h1>
                                                <table className="table-fixed w-11/12 mb-8 fade-in">  
                                                    <tbody>
                                                        <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Type:</td>
                                                            <td className="sm:w-4/12 w-1/2 px-4 py-1 text-md text-right font-normal text-gray-700">{loanData ? loanData.description : "" }</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Amount:</td>
                                                            <td className="sm:w-4/12 w-1/2 px-4 py-1 text-md text-right font-normal text-gray-700">{loanData ? `₦`+Number(loanData.loan_amount).toLocaleString() : ""}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Duration:</td>
                                                            <td className="w-4/12 px-4 py-1 text-md text-right font-normal text-gray-700">{loanData ? loanData.no_of_repayments: ""} months</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Interest Rate:</td>
                                                            <td className="w-4/12 px-4 py-1 text-md text-right font-normal text-gray-700">{loanData ? loanData.interest_percent: ""}%</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Monthly repayment:</td>
                                                            <td className="w-4/12 px-4 py-1 text-md text-right font-normal text-gray-700">N14,000</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="sm:w-8/12 w-1/2  py-1 text-md font-normal text-gray-700">Total amount payable:</td>
                                                            <td className="w-4/12 px-4 py-1 text-md text-right font-normal text-gray-700">N396,000</td>
                                                        </tr> */}
                                                    </tbody>
                                                </table>
                                            </>
                                    }
                                    <div className="flex justify-end w-11/12">
                                        <div className="md:inline-flex justify-end pr-4">
                                            <button
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-600 text-xs font-normal py-3 px-10 rounded-l focus:outline-none focus:shadow-outline inline-flex items-center md:mb-0 mb-5 transition-colors duration-150 ease-in-out"
                                            type="button"
                                            onClick={() => setIsScheduleVisible(!isScheduleVisible)} 
                                            >
                                                <span> { isScheduleVisible ? "View loan summary" : "View payment schedule" }</span>
                                            </button>
                                            <button
                                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-normal py-3 px-10 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center transition-colors duration-150 ease-in-out"
                                            type="button"
                                            onClick={postLoan}
                                            >
                                                <span> Process my loan </span>
                                                <svg
                                                    className="-mt-1"
                                                    width="14"
                                                    height="14"
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
                                    </div>
                                </div>
                            </div>
                            <div className="w-11/12 mt-8 hidden md:block">
                                <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
                            </div>
                        </>
                        )
                    }
                    
                </div>
            </div>
            <br />
        </main>
        </>
    )
}

export default withRouter(LoanSchedule);