// private String rId;
// private double value;
// private Date date;
// private String reason;
// private int qty;
//
// private String employeeId;
// private String itemSaleId;

export class RefundModel {
    constructor(
        rId,
        value,
        date,
        reason,
        qty,
        employeeId,
        saleId,
        itemSaleId,
        saleCartDTO
    ) {
        this.rId = rId;
        this.value = value;
        this.date = date;
        this.reason = reason;
        this.qty = qty;
        this.employeeId = employeeId;
        this.saleId = saleId;
        this.itemSaleId = itemSaleId;
        this.saleCartDTO = saleCartDTO;

    }

}

