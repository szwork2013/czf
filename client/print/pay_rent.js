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
      房租(元/月)
    </div> </td>
    <td class='print-td' colspan=2> <div class='print-cell print-text-center'>
      {rental} 元
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      还欠费
    </div> </td>
    <td class='print-td'> <div class='print-cell print-text-center'>
      {oweRental} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 20px;'>
      {servicesChargesDes}
    </div> </td>
    <td class='print-td' colspan=3> <div class='print-cell print-text-center'>
      {servicesCharges} 元
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 20px;'>
      本次缴费房间使用时间
    </div> </td>
    <td class='print-td' colspan=3> <div class='print-cell print-text-center'>
      从 {rentalStartDate} 到 {rentalEndDate}
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td' colspan=2> <div class='print-cell print-text-center' style='height: 20px;'>
      下次最迟缴费时间
    </div> </td>
    <td class='print-td' colspan=3> <div class='print-cell print-text-center'>
      {rentalEndDate} 前
    </div> </td>
  </tr>
  <tr class='print-text-xs'>
    <td class='print-td'> <div class='print-cell print-text-center' style='height: 20px;'>
      {rentalSummedDes}合计(元)
    </div> </td>
    <td class='print-td' colspan=4> <div class='print-cell print-text-center'>
      {rentalSummedChinese}
      &nbsp;&nbsp;
      ￥{rentalSummed} 元
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
                 .replace(/{rental}/g, data.rental)
                 .replace(/{oweRental}/g, data.oweRental)
                 .replace(/{oweRentalExpiredDate}/g, data.oweRentalExpiredDate)
                 .replace(/{servicesCharges}/g, data.servicesCharges)
                 .replace(/{servicesChargesDes}/g, data.servicesChargesDes)
                 .replace(/{rentalStartDate}/g, data.rentalStartDate)
                 .replace(/{rentalEndDate}/g, data.rentalEndDate)
                 .replace(/{rentalSummed}/g, data.rentalSummed)
                 .replace(/{rentalSummedDes}/g, data.rentalSummedDes)
                 .replace(/{rentalSummedChinese}/g, data.rentalSummedChinese)
                 .replace(/{remark}/g, data.remark)
}
exports.build = build 