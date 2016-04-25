'use strict';

var printStr = `<table class='print-table'>
<tr>
  <th class='print-th' style='width: 75%;' colspan=2>押金详细</th>
  <th class='print-th'>备注</th>
</tr>
<tr>
  <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 180px;'>
      <div class='print-text-l' style='margin: 75px 0px 5px;'>
        收到入住，押金{deposit}元。
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
    {depositChinese} &nbsp;&nbsp; ￥{deposit} 元
  </div> </td>
</tr>
</table>`


var build = (data) => {
  return printStr.replace(/{deposit}/g, data.deposit)
                 .replace(/{depositChinese}/g, data.depositChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build 