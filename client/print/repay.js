'use strict';

var printStr = `<table class='print-table'>
<tr>
  <th class='print-th' style='width: 75%;' colspan=2>缴欠款详细</th>
  <th class='print-th'>备注</th>
</tr>
<tr>
  <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 180px;'>
      <div class='print-text-s' style='margin: 75px 0px 5px;'>
        {room}房租户补缴从 {rentalStartDate} 到 {rentalEndDate} 租期所欠租金{oweRentalRepay}元。
      </div>
  </div> </td>
  <td class='print-td' rowspan=2> <div class='print-cell print-text-xs' style='height: 210px;'>
    {remark}
  </div> </td>
</tr>
<tr class='print-text-xs'>
  <td class='print-td' style='width: 17%'> <div class='print-cell print-text-center' style='height: 20px'>
    实收合计(元)
  </div> </td>
  <td class='print-td'> <div class='print-cell print-text-center'>
    {oweRentalRepayChinese} &nbsp; ￥{oweRentalRepay} 元
  </div> </td>
</tr>
</table>`


var build = (data) => {
  return printStr.replace(/{room}/g, data.room)
                 .replace(/{rentalStartDate}/g, data.rentalStartDate)
                 .replace(/{rentalEndDate}/g, data.rentalEndDate)
                 .replace(/{oweRentalRepay}/g, data.oweRentalRepay)
                 .replace(/{oweRentalRepayChinese}/g, data.oweRentalRepayChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build 






