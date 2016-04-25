'use strict';

var printStr = `<table class='print-table'>
  <tr>
    <th class='print-th' style='width: 75%;' colspan=2>门卡购退详细</th>
    <th class='print-th'>备注</th>
  </tr>
  <tr>
    <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 180px;'>
      <div class='print-text-l' style='margin: 75px 0px 5px;'>
        {room}房{doorCardSellOrRecoverDes}门卡{doorCardCount}个，{doorCardChargesDes} {doorCardCharges}元。
      </div>
    </div> </td>
    <td class='print-td' rowspan=2> <div class='print-cell print-text-xs' style='height: 210px;'>
      {remark}
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td' style='width: 17%'> <div class='print-cell print-text-center' style='height: 20px'>
      {doorCardChargesDes}合计(元)
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px'>
      {doorCardChargesChinese} &nbsp;&nbsp; ￥{doorCardCharges} 元
    </div> </td>
  </tr>
</table>`


var build = (data) => {
  return printStr.replace(/{room}/g, data.room)
                 .replace(/{doorCardSellOrRecoverDes}/g, data.doorCardSellOrRecoverDes)
                 .replace(/{doorCardCount}/g, data.doorCardCount)
                 .replace(/{doorCardChargesDes}/g, data.doorCardChargesDes)
                 .replace(/{doorCardCharges}/g, data.doorCardCharges)
                 .replace(/{doorCardChargesChinese}/g, data.doorCardChargesChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build 