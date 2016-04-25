'use strict';

var printStr = `<table class='print-table'>
  <tr>
    <th class='print-th' style='width: 17%;'>项目</th>
    <th class='print-th' style='width: 14%;'>底数</th>
    <th class='print-th' style='width: 14%;'>本次</th>
    <th class='print-th' style='width: 15%;'>单价</th>
    <th class='print-th' style='width: 15%;'>收费</th>
    <th class='print-th'>备注</th>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      电费
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {electricMeterEndNumberLast} 度
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {electricMeterEndNumber} 度
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {electricChargesPerKWh} 元/度
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {electricCharges} 元
    </div> </td>
    <td class='print-td' rowspan=7> <div class='print-cell print-text-xs' style='height: 210px'>
      {remark}
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      水费
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {waterMeterEndNumberLast} 吨
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {waterMeterEndNumber} 吨
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {waterChargesPerTon} 元/吨
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {waterCharges} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      住房逾期费
    </div> </td>
    <td class='print-td' colspan=4> <div class='print-cell print-text-center'>
      {overdueCharges} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      损坏赔偿费
    </div> </td>
    <td class='print-td' colspan=4> <div class='print-cell print-text-center'>
      {compensation} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      退还押金
    </div> </td>
    <td class='print-td' colspan=4> <div class='print-cell print-text-center'>
      {deposit} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      {checkoutSummedDes}合计(元)
    </div> </td>
    <td class='print-td' colspan=4> <div class='print-cell print-text-center'>
      {checkoutSummedChinese}
      &nbsp;&nbsp;
      ￥{checkoutSummed} 元
    </div> </td>
  </tr>
</table>`


var build = (data) => {
  return printStr.replace(/{subscription}/g, data.subscription)
                 .replace(/{electricMeterEndNumberLast}/g, data.electricMeterEndNumberLast)
                 .replace(/{electricMeterEndNumber}/g, data.electricMeterEndNumber)
                 .replace(/{electricChargesPerKWh}/g, data.electricChargesPerKWh)
                 .replace(/{electricKWhs}/g, data.electricKWhs)
                 .replace(/{electricCharges}/g, data.electricCharges)
                 .replace(/{waterMeterEndNumberLast}/g, data.waterMeterEndNumberLast)
                 .replace(/{waterMeterEndNumber}/g, data.waterMeterEndNumber)
                 .replace(/{waterChargesPerTon}/g, data.waterChargesPerTon)
                 .replace(/{waterTons}/g, data.waterTons)
                 .replace(/{waterCharges}/g, data.waterCharges)
                 .replace(/{overdueCharges}/g, data.overdueCharges)
                 .replace(/{compensation}/g, data.compensation)
                 .replace(/{deposit}/g, data.deposit)
                 .replace(/{checkoutSummedDes}/g, data.checkoutSummedDes)
                 .replace(/{checkoutSummed}/g, data.checkoutSummed)
                 .replace(/{checkoutSummedChinese}/g, data.checkoutSummedChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build   





