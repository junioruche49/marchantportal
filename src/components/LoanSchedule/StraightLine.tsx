import React, { useState, useEffect, useCallback } from 'react';  


export default function StraightLine(props: any) {

    let principal = parseFloat(props.amount);
    let interestRate = parseFloat(props.rate)/100;
    let tenor = parseFloat(props.tenor);
    let tenorInYears = tenor/12; 


    let amount;
    let simpleInt;
    const [schedule, setSchedule] = useState<any[]>([]);

    const simpleInterest = useCallback(() => {

        let monthlyPrincipal = principal/tenor;
        let monthlyInterestRate = interestRate/12;
        let monthlyInterest = principal*monthlyInterestRate;

        let monthlyRepayment = monthlyPrincipal + monthlyInterest;

        
        let i =1;
        let data: any[] = [];
        while (i <= tenor) {
            let innerData = {};

            innerData= {
                "i" : i,
                "principal": monthlyPrincipal,
                "interest": monthlyInterest,
                "repayment": monthlyRepayment
            };
            data.push(innerData);
            i++;
        }

        setSchedule(data);
        

    }, [principal, interestRate, tenor]);

    useEffect(() => {
        simpleInterest();
    }, [simpleInterest])

    simpleInt = (principal * interestRate * tenorInYears);
    amount = principal + simpleInt;

    

    return (
        <>  
            <div>
                <h3 className="text-gray-700 text-md md:text-xl"> Total Interest: <span className="font-bold">₦{Number(simpleInt).toLocaleString(undefined, {maximumFractionDigits: 2})} </span></h3>
                <h3 className="text-gray-700 text-md md:text-xl"> Total Repayment: <span className="font-bold text-green-700">₦{Number(amount).toLocaleString(undefined, {maximumFractionDigits: 2})} </span></h3>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-auto  fade-in mt-5 mb-10">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full w-full leading-normal">
                        <thead className="flex w-full">
                            <tr className="flex w-full">
                                <th className="p-4 w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S/N</th>
                                <th className="p-4 w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Principal (₦)</th>
                                <th className="p-4 w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Interest (₦)</th>
                                <th className="p-4 w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Repayment (₦)</th>
                            </tr>
                        </thead>
                        <tbody className="flex flex-col items-center overflow-y-scroll w-full schedule-table">
                            {schedule.map((s) => (
                                <>
                                    <tr className="flex w-full">
                                        <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700">{s.i}.</td>
                                        <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700 text-center">{Number(s.principal).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700 text-center">{Number(s.interest).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                        <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-sm text-green-600 font-bold text-center">{Number(s.repayment).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>  
                </div>
            </div>
        </>
    ) 
}