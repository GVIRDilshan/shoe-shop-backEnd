export class SaleItemModel {
    constructor(
        iCode,
        tags,
        description,
        availableSizeList,
        availableColourList,
        saleItemQtyHolderDTOList,
        saleItemImageHolderDTOList,
        price,
        category,
        gender,
        verities,
        occasion

    ) {
        this.iCode = iCode;
        this.tags = tags;
        this.description = description;
        this.availableSizeList = availableSizeList;
        this.availableColourList = availableColourList;
        this.saleItemQtyHolderDTOList = saleItemQtyHolderDTOList;
        this.saleItemImageHolderDTOList = saleItemImageHolderDTOList;
        this.price = price;
        this.category = category;
        this.gender = gender;
        this.verities = verities;
        this.occasion = occasion;

        console.log(occasion);

    }

}







