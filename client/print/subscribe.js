'use strict';

var printStr = `<table class='print-table'>
  <tr>
    <th class='print-th' style='width: 75%;'>定金详细</th>
    <th class='print-th'>备注</th>
  </tr>
  <tr>
    <td class='print-td'>
    <div class='print-cell print-text-center' style='height: 210px;'>
        <div class='print-text-l' style='margin: 20px 0px 5px;'>
          收到定房，定金{subscription}元。
        </div>
        <div class='print-text-s' style='margin-bottom: 10px'>
          {subscriptionChinese}
        </div>
        <div class='print-text-left' style=' text-indent: 2em;'>
          定房者需于：{expiredDate}前（包含当日），凭此定金单到本楼管理处办理正式入住手续，房东退还本单定金费。如果定房者逾期未办理入住手续或放弃所定房间，本单定金费房东不予退还。
        </div>
    </div>
    </td>
    <td class='print-td'>
    <div class='print-cell print-text-xs' style='height: 210px;'>
      {remark}
    </div>  
    </td>
  </tr>
</table>`


var build = (data) => {
  return printStr.replace(/{subscription}/g, data.subscription)
                       .replace(/{subscriptionChinese}/g, data.subscriptionChinese)
                       .replace(/{expiredDate}/g, data.expiredDate)
                       .replace(/{remark}/g, data.remark)
}
exports.build = build 