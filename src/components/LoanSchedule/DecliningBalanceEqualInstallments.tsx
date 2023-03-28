import React, {useState, useEffect, useCallback} from 'react';


export default function DecliningBalanceEqualInstallments(props: any) {

    let principal = parseFloat(props.amount);
    let rate = parseFloat(props.rate);
    let tenor = parseFloat(props.tenor);
    // let tenorInYears = tenor/12; 

    const [schedule, setSchedule] = useState<any[]>([]);

    let interestRate=rate/100;
    let monthly=interestRate/12;
    let repayment=((principal*monthly)/(1-Math.pow((1+monthly),-tenor)));

    let total=repayment*tenor;
    let interest=total-principal;

    const calculateSchedule = useCallback(() => {

        function fixVal(value,numberOfCharacters,numberOfDecimals,padCharacter) { 
            var i, stringObject, stringLength, numberToPad;            
        
            value=value*Math.pow(10,numberOfDecimals);                 
            value=Math.round(value);                                   
        
            stringObject=new String(value);                            
            stringLength=stringObject.length;                          // get length of string
            while(stringLength<numberOfDecimals) {                     
                stringObject="0"+stringObject;                     // add a leading zero
                stringLength=stringLength+1;                       
            }
        
            if(numberOfDecimals>0) {			           
                stringObject=stringObject.substring(0,stringLength-numberOfDecimals)+"."+
                stringObject.substring(stringLength-numberOfDecimals,stringLength);
            }
        
            if (stringObject.length<numberOfCharacters && numberOfCharacters>0) {
                numberToPad=numberOfCharacters-stringObject.length;      
                for (i=0; i<numberToPad; i=i+1) {
                    stringObject=padCharacter+stringObject;
                }
            }
        
            return stringObject;                                       
        }

    
        let newPrincipal=principal;

        
        let i =1;
        let data: any[] = [];
        while (i <= tenor) {

            let newInterest=monthly*newPrincipal;
		    let reduction=repayment-newInterest;
            
            newPrincipal=newPrincipal-reduction;
            
            let innerData = {};

            innerData= {
                "i" : i,
                "repayment": fixVal(repayment,0,2,' '),
                "interest": fixVal(newInterest,0,2,' '),
                "principal": fixVal(reduction,0,2,' '),
                "balance": fixVal(newPrincipal,0,2,' ')
            };
            data.push(innerData);
            i++;
        }

        setSchedule(data);
        

    }, [monthly, repayment, principal, tenor]);

    useEffect(() => {
        calculateSchedule();
    }, [calculateSchedule])


    

    return (
        <>  
            <div>
                <h3 className="text-gray-700 text-md md:text-xl"> Total Interest: <span className="font-bold">₦{Number(interest).toLocaleString(undefined, {maximumFractionDigits: 2})} </span></h3>
                <h3 className="text-gray-700 text-md md:text-xl"> Total Repayment: <span className="font-bold text-green-700">₦{Number(total).toLocaleString(undefined, {maximumFractionDigits: 2})} </span></h3>
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
                                <th className="p-4 w-1/4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Balance (₦)</th>
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
                                        <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700 text-center">{Number(s.balance).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
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