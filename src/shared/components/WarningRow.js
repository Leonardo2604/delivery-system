import React from 'react';

const WarningRow = function({col, text}) {
    return (
        <tr>
            <td colSpan={col} className="text-center">
                {text}
            </td>
        </tr>
    );
}

export default WarningRow;
