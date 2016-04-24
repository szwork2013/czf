'use strict';

var printStr = `<table class='print-table'>
  <tr>
    <th class='print-th' style='width: 75%;'>退订金详细</th>
    <th class='print-th'>备注</th>
  </tr>
  <tr>
    <td class='print-td'>
    <div class='print-cell print-text-center' style='height: 210px;'>
        <div class='print-text-l' style='margin: 20px 0px 5px;'>
          退订房，退订金{refund}元。
        </div>
        <div class='print-text-s' style='margin-bottom: 10px'>
          {refundChinese}
        </div>
        <div class='print-text-left' style=' text-indent: 2em;'>
          经过房东与订房者的友好协商，订房者于：{subscribeDate}所订房的订房合同终止，相应订金单作废！
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
  return printStr.replace(/{refund}/g, data.refund)
                       .replace(/{refundChinese}/g, data.refundChinese)
                       .replace(/{subscribeDate}/g, data.subscribeDate)
                       .replace(/{remark}/g, data.remark)
}
exports.build = build 