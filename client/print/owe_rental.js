'use strict';

var printStr = `<table class='print-table'>
<tr>
  <th class='print-th' style='width: 75%;' colspan=2>欠款详细</th>
  <th class='print-th'>备注</th>
</tr>
<tr>
  <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 180px;'>
      <div class='print-text-s' style='margin: 40px 0px 5px;'>
        {room}房租户缴从 {rentalStartDate} 到 {rentalEndDate} 租期房租，房租应缴{rental}元，实际缴费{realRental}元，还欠租金{oweRental}元。
      </div>
      <div class='print-text-left' style=' text-indent: 2em;'>
        租户需于：{oweRentalExpiredDate}前（包含当日）一次性缴清全部欠款，否则房东有权依据双方所约定合同作出处理。
      </div>
  </div> </td>
  <td class='print-td' rowspan=2> <div class='print-cell print-text-xs' style='height: 210px;'>
    {remark}
  </div> </td>
</tr>
<tr class='print-text-xs'>
  <td class='print-td' style='width: 17%'> <div class='print-cell print-text-center' style='height: 20px'>
    欠费合计(元)
  </div> </td>
  <td class='print-td'> <div class='print-cell print-text-center'>
    {oweRentalChinese} &nbsp; ￥{oweRental} 元
  </div> </td>
</tr>
</table>`


var build = (data) => {
  return printStr.replace(/{room}/g, data.room)
                 .replace(/{rental}/g, data.rental)
                 .replace(/{rentalStartDate}/g, data.rentalStartDate)
                 .replace(/{rentalEndDate}/g, data.rentalEndDate)
                 .replace(/{realRental}/g, data.realRental)
                 .replace(/{oweRental}/g, data.oweRental)
                 .replace(/{oweRentalExpiredDate}/g, data.oweRentalExpiredDate)
                 .replace(/{oweRentalChinese}/g, data.oweRentalChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build 






