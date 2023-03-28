import React from "react";
import StraightLine from "./StraightLine";
import DecliningBalanceEqualPrincipal from "./DecliningBalanceEqualPrincipal";
import DecliningBalanceEqualInstallments from "./DecliningBalanceEqualInstallments";


enum CalculationType {
    StraightLine = `Straight_Line`,
    DecliningBalanceEqualInstallments= `Declining_with_Equal_Installments`,
    DecliningBalanceEqualPrincipal= `Declining_Balance`
}


function ScheduleCalculator(props: any) {
    if (props.type === CalculationType.StraightLine) {
        return <StraightLine {...props.data} />
    }

    if (props.type === CalculationType.DecliningBalanceEqualInstallments) {
        return <DecliningBalanceEqualInstallments {...props.data} />
    }

    if (props.type === CalculationType.DecliningBalanceEqualPrincipal) {
        return <DecliningBalanceEqualPrincipal {...props.data} />
    }
    
    return <div>No data supplied</div>;
}

export default ScheduleCalculator;